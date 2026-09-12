import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, createHmac, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { createApp } from '../src/app.js';
import { initializeDatabase } from '../src/database.js';
import { describeStartupError, loadConfig } from '../src/config.js';

let mongo, client, db, server, base;
const messages = [];
const ecitizen = { clientId: 'ecitizen', clientSecret: 'ecitizen-shared-secret-of-32-chars!', portalBaseUrl: 'http://localhost:3000' };
const config = { jwtSecret: 'test-only-secret-'.repeat(4), origins: ['http://localhost:3000'], production: false, ecitizen, mailTimeoutMs: 300 };
// Swappable so one test can stand in a transport that never answers, which is
// what an unreachable SMTP host looks like from inside the request.
let deliveryOverride = null;
const mailer = async (mail) => { if (deliveryOverride) return deliveryOverride(mail); messages.push(mail); };
async function api(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(base + '/api' + path, { method, headers: {
    ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }, body: body ? JSON.stringify(body) : undefined });
  return { status: response.status, body: await response.json() };
}
async function account(email) {
  const registered = await api('/user/auth/register', { method: 'POST', body: { email, password: 'TestPassword123!', confirm_password: 'TestPassword123!', terms_condition: true, role: 'admin' } });
  assert.equal(registered.status, 201);
  const challenge = registered.body.data;
  const code = messages.findLast(m => m.to === email).code;
  const verified = await api('/user/auth/register/verify-otp', { method: 'POST', body: { ...challenge, otp: code } });
  assert.equal(verified.status, 200);
  return { ...verified.body, email, challenge, code };
}

before(async () => {
  mongo = await MongoMemoryServer.create();
  client = await new MongoClient(mongo.getUri()).connect();
  db = client.db('dpa_test');
  await initializeDatabase(db);
  server = createApp({ db, config, mailer }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { if (server) await new Promise(resolve => server.close(resolve)); await client?.close(); await mongo?.stop(); });

test('runtime configuration requires Atlas, a named database and a strong signing secret', () => {
  assert.throws(() => loadConfig({}), /MONGODB_URI/);
  assert.throws(() => loadConfig({ MONGODB_URI: 'mongodb://localhost/test', JWT_SECRET: config.jwtSecret }), /Atlas/);
  assert.throws(() => loadConfig({ MONGODB_URI: 'mongodb+srv://user:secret@cluster.mongodb.net/', JWT_SECRET: 'short' }), /JWT_SECRET/);
  const valid = { MONGODB_URI: 'mongodb+srv://user:secret@cluster.mongodb.net/', JWT_SECRET: config.jwtSecret };
  assert.equal(loadConfig(valid).port, 3005);
  assert.equal(loadConfig({ ...valid, PORT: '4100' }).port, 4100);
  assert.throws(() => loadConfig({ ...valid, PORT: '70000' }), /PORT/);
});
test('startup errors echo configuration text but never driver connection details', () => {
  assert.equal(describeStartupError(new Error('JWT_SECRET must contain at least 32 characters.'), 'advice'), 'JWT_SECRET must contain at least 32 characters.');
  const dns = Object.assign(new Error('querySrv ENOTFOUND _mongodb._tcp.secret-cluster.mongodb.net'), { code: 'ENOTFOUND', syscall: 'querySrv' });
  const reported = describeStartupError(dns, 'advice');
  assert.match(reported, /ENOTFOUND/);
  assert.doesNotMatch(reported, /secret-cluster/);
  const auth = Object.assign(new Error('Authentication failed for user admin'), { name: 'MongoServerError', codeName: 'AuthenticationFailed' });
  assert.doesNotMatch(describeStartupError(auth, 'advice'), /admin/);
});
test('health reaches database and private routes require authentication', async () => {
  assert.equal((await api('/health')).status, 200);
  assert.equal((await api('/user/data/controller', { method: 'POST', body: {} })).status, 401);
});
test('registration verifies once, hashes passwords and never grants requested admin access', async () => {
  const user = await account('auth@example.test');
  const stored = await db.collection('users').findOne({ email: user.email });
  assert.notEqual(stored.passwordHash, 'TestPassword123!');
  assert.equal(user.data.role, 'client');
  assert.equal(user.data.passwordHash, undefined);
  assert.equal(user.data.id, user.data._id);
  assert.equal((await api('/user/auth/register/verify-otp', { method: 'POST', body: { ...user.challenge, otp: user.code } })).status, 400);
  assert.equal((await api('/user/auth/login', { method: 'POST', body: { email: user.email, password: 'wrong' } })).status, 401);
  assert.equal((await api('/user/auth/login', { method: 'POST', body: { email: user.email, password: 'TestPassword123!' } })).status, 200);
});
test('unverified accounts cannot log in and OTP failures are bounded', async () => {
  const registered = await api('/user/auth/register', { method: 'POST', body: { email: 'pending@example.test', password: 'TestPassword123!', confirm_password: 'TestPassword123!', terms_condition: true } });
  assert.equal((await api('/user/auth/login', { method: 'POST', body: { email: 'pending@example.test', password: 'TestPassword123!' } })).status, 403);
  for (let attempt = 0; attempt < 5; attempt++) await api('/user/auth/register/verify-otp', { method: 'POST', body: { ...registered.body.data, otp: '000000' } });
  assert.equal((await api('/user/auth/register/verify-otp', { method: 'POST', body: { ...registered.body.data, otp: messages.findLast(m => m.to === 'pending@example.test').code } })).status, 400);
});
test('the auth limiter counts real clients, not the proxy in front of them', () => {
  // Without this Express reports the proxy's socket address as req.ip for every
  // visitor, and express-rate-limit — which keys on req.ip — puts the entire
  // site in one bucket. Production then stops sending verification codes to
  // everyone once any 40 auth requests have been made.
  const valid = { MONGODB_URI: 'mongodb+srv://user:secret@cluster.mongodb.net/', JWT_SECRET: config.jwtSecret };
  assert.equal(loadConfig(valid).trustProxy, 0);
  assert.equal(loadConfig({ ...valid, NODE_ENV: 'production', SMTP_HOST: 'smtp.example.test' }).trustProxy, 1);
  assert.equal(loadConfig({ ...valid, TRUST_PROXY: '2' }).trustProxy, 2);
  assert.throws(() => loadConfig({ ...valid, TRUST_PROXY: 'true' }), /TRUST_PROXY/);
  // A hop count, never `true`: trusting the whole chain would honour a
  // client-supplied X-Forwarded-For and hand every caller a fresh bucket.
  assert.equal(createApp({ db, config: { ...config, trustProxy: 1 }, mailer }).get('trust proxy'), 1);
  assert.equal(createApp({ db, config, mailer }).get('trust proxy'), 0);
});
test('a verification email that never sends leaves nothing blocking the retry', async () => {
  const email = 'unreachable@example.test';
  deliveryOverride = () => new Promise(() => {});
  try {
    const stalled = await api('/user/auth/register', { method: 'POST', body: { email, password: 'TestPassword123!', confirm_password: 'TestPassword123!', terms_condition: true } });
    // Bounded by our own clock rather than the transport's: nodemailer would
    // still be waiting minutes from now, long past the platform's function
    // timeout, and a killed invocation runs no cleanup at all.
    assert.equal(stalled.status, 503);
  } finally { deliveryOverride = null; }
  // The pending challenge has to be gone. Left behind, the one-minute cooldown
  // would answer the user's retry with "please wait" for a code that was never
  // sent — the failure that looks, from the outside, like OTP simply not working.
  assert.equal(await db.collection('auth_challenges').countDocuments({ email, purpose: 'register' }), 0);
  const retried = await api('/user/auth/register', { method: 'POST', body: { email, password: 'TestPassword123!', confirm_password: 'TestPassword123!', terms_condition: true } });
  assert.equal(retried.status, 201);
  assert.equal(messages.findLast(m => m.to === email).to, email);
});
test('a resent code replaces the previous one and carries a token that works', async () => {
  const email = 'resend@example.test';
  const registered = await api('/user/auth/register', { method: 'POST', body: { email, password: 'TestPassword123!', confirm_password: 'TestPassword123!', terms_condition: true } });
  assert.equal(registered.status, 201);
  const first = { challenge: registered.body.data, code: messages.findLast(m => m.to === email).code };
  // The cooldown is the server's own, and it applies to the resend route too.
  assert.equal((await api('/user/auth/register/resend-otp', { method: 'POST', body: { email } })).status, 429);
  await db.collection('auth_challenges').updateOne({ email, purpose: 'register' }, { $set: { createdAt: new Date(Date.now() - 61000) } });
  const resent = await api('/user/auth/register/resend-otp', { method: 'POST', body: { email } });
  assert.equal(resent.status, 200);
  const second = { challenge: resent.body.data, code: messages.findLast(m => m.to === email).code };
  assert.notEqual(second.challenge.token, first.challenge.token);
  // Issuing replaces the challenge outright, so the superseded pair must fail —
  // otherwise a resend would widen the window instead of moving it.
  assert.equal((await api('/user/auth/register/verify-otp', { method: 'POST', body: { ...first.challenge, otp: first.code } })).status, 400);
  const verified = await api('/user/auth/register/verify-otp', { method: 'POST', body: { ...second.challenge, otp: second.code } });
  assert.equal(verified.status, 200);
  assert.equal(verified.body.data.email, email);
  // Nothing left to resend against once the account is real.
  assert.equal((await api('/user/auth/register/resend-otp', { method: 'POST', body: { email } })).status, 409);
  assert.equal((await api('/user/auth/register/resend-otp', { method: 'POST', body: { email: 'never-signed-up@example.test' } })).status, 404);
});
test('drafts persist and another account cannot list, read or overwrite them', async () => {
  const owner = await account('owner@example.test');
  const stranger = await account('stranger@example.test');
  const created = await api('/user/data/controller/add', { token: owner.token, method: 'POST', body: { contact: { name: 'Example Organisation', email: owner.email }, formStepComplete: 3, userId: stranger.data._id, status: 4, payment_status: 2, registrationFee: 1 } });
  assert.equal(created.status, 201);
  assert.equal(created.body.data.userId, owner.data._id);
  assert.equal(created.body.data.status, 7);
  assert.equal(created.body.data.payment_status, 1);
  assert.equal(created.body.data.registrationFee, null);
  const id = created.body.data._id;
  assert.equal((await api(`/user/data/controller/${id}`, { token: stranger.token })).status, 404);
  assert.equal((await api(`/user/data/controller/${id}`, { token: stranger.token, method: 'PUT', body: { contact: { name: 'Hijacked' } } })).status, 404);
  assert.equal((await api('/user/data/controller', { token: stranger.token, method: 'POST', body: {} })).body.data.total, 0);
  const saved = await api(`/user/data/controller/${id}`, { token: owner.token, method: 'PUT', body: { contact: { name: 'Updated Organisation', email: owner.email }, formStepComplete: 4 } });
  assert.equal(saved.body.data.contact.name, 'Updated Organisation');
  assert.equal((await db.collection('controllers').findOne({ userId: owner.data._id })).contact.name, 'Updated Organisation');
  assert.equal((await api('/user/data/controller/status', { token: owner.token })).body.data._id, id);
});
test('malformed identifiers and MongoDB operators are rejected', async () => {
  const user = await account('validation@example.test');
  assert.equal((await api('/user/data/controller/not-an-id', { token: user.token })).status, 400);
  assert.equal((await api('/user/data/controller/add', { token: user.token, method: 'POST', body: { contact: { name: { $ne: null } } } })).status, 422);
  assert.equal((await api('/user/auth/login', { method: 'POST', body: { email: { $ne: null }, password: 'test' } })).status, 422);
});
test('enquiries and messages persist with server-assigned ownership', async () => {
  const user = await account('enquiry@example.test');
  const created = await api('/user/support-ticket/add', { token: user.token, method: 'POST', body: { title: 'Registration help', description: 'Please help with registration.' } });
  assert.equal(created.status, 201);
  const id = created.body.data._id;
  const reply = await api('/user/support-ticket/chat', { token: user.token, method: 'POST', body: { supportTicketId: id, message: 'Additional details', senderType: 2 } });
  assert.equal(reply.status, 201);
  assert.equal(reply.body.data.senderType, 1);
  assert.equal((await api(`/user/support-ticket/chat/${id}`, { token: user.token })).body.data.length, 1);
});
test('password reset consumes its token and revokes existing sessions', async () => {
  const user = await account('reset@example.test');
  const forgot = await api('/user/auth/forgot-password', { method: 'POST', body: { email: user.email } });
  assert.equal(forgot.status, 200);
  assert.equal(forgot.body.data.token, undefined);
  const code = messages.findLast(m => m.to === user.email).code;
  const verified = await api('/user/auth/verify-token', { method: 'POST', body: { email: user.email, token: code } });
  assert.equal(verified.status, 200);
  const body = { ...verified.body.data, password: 'NewPassword123!', confirm_password: 'NewPassword123!' };
  assert.equal((await api('/user/auth/update-password', { method: 'POST', body })).status, 200);
  assert.equal((await api('/user/auth/update-password', { method: 'POST', body })).status, 400);
  assert.equal((await api('/user/site/check-verify', { token: user.token })).status, 401);
});
test('attachments require authentication and cannot be read by another account', async () => {
  const owner = await account('file@example.test');
  const stranger = await account('file-stranger@example.test');
  const data = new FormData();
  data.append('file', new Blob(['%PDF-1.4\nexample'], { type: 'application/pdf' }), 'evidence.pdf');
  const upload = await fetch(base + '/api/file/upload/supportTicket', { method: 'POST', body: data, headers: { Authorization: `Bearer ${owner.token}` } });
  assert.equal(upload.status, 201);
  const { fileName } = await upload.json();
  const path = `/api/file/get/supportTicket/${fileName}`;
  assert.equal((await fetch(base + path)).status, 401);
  assert.equal((await fetch(base + path + '?token=' + stranger.token)).status, 404);
  const downloaded = await fetch(base + path + '?token=' + owner.token);
  assert.equal(downloaded.status, 200);
  assert.equal(await downloaded.text(), '%PDF-1.4\nexample');
});
test('payment endpoints cannot fabricate a successful transaction', async () => {
  const user = await account('payment@example.test');
  assert.deepEqual((await api('/user/payment-method/list', { token: user.token })).body.data, []);
  assert.equal((await api('/user/payment-method/waafi', { token: user.token, method: 'POST', body: { status: 'success' } })).status, 503);
  assert.equal(await db.collection('transactions').countDocuments(), 0);
});

/* ── Federated sign-in from eCitizen ────────────────────────────────────────
   eCitizen says who the citizen is; this portal decides what they may do and
   runs every service itself. These tests hold the two halves of that: the
   request cannot be forged, replayed or pointed somewhere it was not agreed,
   and a citizen who arrives lands in an ordinary DPA session with no second
   account and no second sign-in. */

function signed(body, overrides = {}) {
  const raw = JSON.stringify(body);
  const timestamp = overrides.timestamp ?? Date.now();
  const nonce = overrides.nonce ?? randomBytes(16).toString('hex');
  const digest = createHash('sha256').update(raw).digest('hex');
  const signature = overrides.signature
    ?? createHmac('sha256', overrides.secret ?? ecitizen.clientSecret).update(`${ecitizen.clientId}.${timestamp}.${nonce}.${digest}`).digest('hex');
  return { raw, headers: { 'Content-Type': 'application/json', 'x-ecitizen-client-id': overrides.clientId ?? ecitizen.clientId,
    'x-ecitizen-timestamp': String(timestamp), 'x-ecitizen-nonce': nonce, 'x-ecitizen-signature': signature } };
}
async function launch(identity, { service = 'DPA_DC_DP_REGISTRATION', ...overrides } = {}) {
  const body = { service, correlationId: randomBytes(8).toString('hex'), identity: { provider: 'ecitizen', identityVerified: true, ...identity } };
  const { raw, headers } = signed(body, overrides);
  const response = await fetch(base + '/api/integration/ecitizen/session', { method: 'POST', headers, body: raw });
  return { status: response.status, body: await response.json() };
}
const codeIn = url => new URL(url).searchParams.get('code');
const citizen = (subject, email, fullName = 'Test Citizen') => ({ subject, email, fullName });

test('a launch request that is not eCitizen’s is refused, and touches no account', async () => {
  const before = await db.collection('users').countDocuments();
  const identity = citizen('ec-forged', 'forged@example.test');

  // Unsigned entirely.
  const bare = await fetch(base + '/api/integration/ecitizen/session', { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ service: 'DPA_ENQUIRY', correlationId: 'abcdefgh', identity: { provider: 'ecitizen', ...identity } }) });
  assert.equal(bare.status, 401);

  assert.equal((await launch(identity, { secret: 'a-completely-different-secret-32ch' })).status, 401, 'wrong secret accepted');
  assert.equal((await launch(identity, { clientId: 'someone-else' })).status, 401, 'unknown client accepted');
  assert.equal((await launch(identity, { timestamp: Date.now() - 600000 })).status, 401, 'stale request accepted');
  assert.equal((await launch(identity, { signature: 'z'.repeat(64) })).status, 401, 'garbage signature accepted');

  // Nothing was created by any of them: a refused request must not provision.
  assert.equal(await db.collection('users').countDocuments(), before);
});

test('an intact launch request cannot be replayed', async () => {
  const identity = citizen('ec-replay', 'replay@example.test');
  const nonce = randomBytes(16).toString('hex');
  assert.equal((await launch(identity, { nonce })).status, 200);
  // Same nonce, freshly signed and inside the clock window — still refused.
  assert.equal((await launch(identity, { nonce })).status, 401);
});

test('a launch may only name a service the portal agreed to', async () => {
  const identity = citizen('ec-service', 'service@example.test');
  // `constructor` and `__proto__` are in this list deliberately: an object
  // literal as the allowlist would have resolved both to something truthy and
  // carried it forward as a redirect target.
  for (const service of ['DPA_ADMIN', '/dc-dp/registration', 'https://example.invalid', '', 'constructor', '__proto__', 'toString']) {
    const attempt = await launch(identity, { service });
    assert.ok(attempt.status === 400 || attempt.status === 422, `${service} was accepted`);
  }
});

test('a citizen arriving from eCitizen gets a DPA session, an account and no second sign-in', async () => {
  const identity = citizen('ec-1001', 'newcomer@example.test', 'Amina Yusuf');
  const issued = await launch(identity, { service: 'DPA_DATA_BREACH_REPORT' });

  assert.equal(issued.status, 200);
  assert.ok(issued.body.data.launchUrl.startsWith('http://localhost:3000/ecitizen/callback?code='));
  assert.equal(issued.body.data.expiresIn, 60);
  // The launch response carries an address and nothing else — no token, no
  // account, nothing about the citizen.
  assert.equal(issued.body.data.token, undefined);

  const exchanged = await api('/integration/ecitizen/exchange', { method: 'POST', body: { code: codeIn(issued.body.data.launchUrl) } });
  assert.equal(exchanged.status, 200);
  assert.equal(exchanged.body.redirectTo, '/data-breach/registration');
  assert.equal(exchanged.body.data.email, 'newcomer@example.test');

  // An ordinary DPA session: it works on the portal's own endpoints.
  assert.equal((await api('/user/site/check-verify', { token: exchanged.body.token })).status, 200);

  const user = await db.collection('users').findOne({ email: 'newcomer@example.test' });
  assert.equal(user.verified, true);
  assert.deepEqual(user.externalIdentities, [{ provider: 'ecitizen', subject: 'ec-1001' }]);
  // Provisioned without a usable password: this account has no sign-in of its
  // own until the citizen sets one through Forgot password.
  assert.ok(user.passwordHash.startsWith('scrypt:'));
});

test('a citizen can be launched at the portal itself, and lands on the dashboard', async () => {
  /*
   * "Open DPA Portal" on eCitizen — a citizen asking for their DPA dashboard
   * rather than for a new application of a particular kind. Everything it shows
   * them (their registrations, transactions and tickets) lives here and has no
   * copy on eCitizen, so the door is the only way to offer it.
   *
   * It is an ordinary entry on the allowlist and gets the ordinary treatment:
   * the same signature, the same one-time code, the same session.
   */
  const identity = citizen('ec-1010', 'dashboard@example.test', 'Hodan Ali');
  const issued = await launch(identity, { service: 'DPA_PORTAL_HOME' });

  assert.equal(issued.status, 200);
  assert.equal(issued.body.data.token, undefined);

  const exchanged = await api('/integration/ecitizen/exchange', { method: 'POST', body: { code: codeIn(issued.body.data.launchUrl) } });
  assert.equal(exchanged.status, 200);
  assert.equal(exchanged.body.redirectTo, '/home');
  // An ordinary DPA session, indistinguishable downstream from a form sign-in.
  assert.equal((await api('/user/site/check-verify', { token: exchanged.body.token })).status, 200);
});

test('a launch code works once and expires', async () => {
  const issued = await launch(citizen('ec-1002', 'oncecode@example.test'));
  const code = codeIn(issued.body.data.launchUrl);

  assert.equal((await api('/integration/ecitizen/exchange', { method: 'POST', body: { code } })).status, 200);
  // Replayed — the record is marked used in the same operation that found it.
  assert.equal((await api('/integration/ecitizen/exchange', { method: 'POST', body: { code } })).status, 400);
  assert.equal((await api('/integration/ecitizen/exchange', { method: 'POST', body: { code: randomBytes(24).toString('base64url') } })).status, 400);
});

test('the same citizen returning is the same DPA account, not another one', async () => {
  const identity = citizen('ec-1003', 'returning@example.test');
  await launch(identity);
  // Second visit, and the email has since changed on the eCitizen side — the
  // link is on the immutable subject, so the case history stays with them.
  await launch({ ...identity, email: 'renamed@example.test' });

  const linked = await db.collection('users').find({ externalIdentities: { $elemMatch: { provider: 'ecitizen', subject: 'ec-1003' } } }).toArray();
  assert.equal(linked.length, 1);
  assert.equal(linked[0].email, 'returning@example.test');
});

test('a citizen who already has a DPA account keeps it, rather than getting a second', async () => {
  const existing = await account('already-here@example.test');
  const issued = await launch(citizen('ec-1004', 'already-here@example.test'));
  assert.equal(issued.status, 200);

  const exchanged = await api('/integration/ecitizen/exchange', { method: 'POST', body: { code: codeIn(issued.body.data.launchUrl) } });
  assert.equal(exchanged.status, 200);
  // The account they registered themselves, now reachable both ways.
  assert.equal(exchanged.body.data._id, existing.data._id);
  assert.equal(await db.collection('users').countDocuments({ email: 'already-here@example.test' }), 1);
});

test('a second eCitizen identity cannot take over an account already linked to one', async () => {
  await launch(citizen('ec-1005', 'contested@example.test'));
  const intruder = await launch(citizen('ec-9999', 'contested@example.test'));

  // Re-pointing an existing case history at a different person is the one
  // outcome that must never happen quietly.
  assert.equal(intruder.status, 409);
  const user = await db.collection('users').findOne({ email: 'contested@example.test' });
  assert.deepEqual(user.externalIdentities, [{ provider: 'ecitizen', subject: 'ec-1005' }]);
});

test('an eCitizen token is never accepted as a DPA session', async () => {
  /*
   * The boundary in one assertion. eCitizen's own JWT — even signed with the
   * shared integration secret — is not a DPA credential, and this API must
   * refuse it outright. If it ever stopped doing so, the exchange and the
   * one-time code would be decoration.
   */
  const foreign = jwt.sign({ userId: 'x', role: 'citizen', citizenId: 'x', sessionId: 'x' }, ecitizen.clientSecret, { expiresIn: '8h' });
  assert.equal((await api('/user/site/check-verify', { token: foreign })).status, 401);
  assert.equal((await api('/user/data/controller', { token: foreign, method: 'POST', body: {} })).status, 401);
});
