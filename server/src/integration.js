import { Router } from 'express';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { HttpError, emailSchema, id, ok } from './http.js';
import { publicUser } from './auth.js';

// Federated sign-in from eCitizen.
//
// eCitizen authenticates the citizen and vouches for who they are; the DPA
// portal decides what that citizen may do and runs every service itself. This
// file is the whole of the boundary: it opens a session, and it does nothing
// else. There is no route here that reads, creates, alters, approves, prices or
// closes a controller registration, a breach report, a complaint, a transaction
// or a ticket — those stay behind the portal's own authentication, unchanged.
//
// Two exchanges, and they are deliberately different in kind:
//
//   POST /api/integration/ecitizen/session   server to server, signed. Resolves
//     the citizen to a DPA account and mints a one-time launch code.
//   POST /api/integration/ecitizen/exchange  browser facing, public, and safe
//     only because the code is single-use, short-lived and unguessable. Trades
//     it for an ordinary DPA session — the same JWT the login form issues.
//
// The eCitizen token never reaches this API and is never accepted by it. After
// the exchange the browser holds a DPA token and calls DPA's own endpoints with
// it exactly as it always has.

// The routes a launch may land on. DPA owns its own URLs, so this map lives
// here and nowhere else: eCitizen sends a code, never a path, and a code that
// is not on this list is refused before an account is touched.
//
// A Map, and not an object literal: the key comes off the wire, and
// `{}['constructor']` is truthy. An object here would have resolved
// `service: "constructor"` to a function and carried it forward as a redirect
// target — the allowlist quietly answering yes to something nobody listed.
//
// `DPA_PORTAL_HOME` is the portal itself rather than one of its services, and
// it is what "Open DPA Portal" on eCitizen asks for: a citizen who wants the
// dashboard — their registrations, their transactions, their tickets — rather
// than a particular form. It is an ordinary entry on the same allowlist
// precisely so it gets the same treatment; a "no service named" fallback that
// defaulted to somewhere would be the allowlist answering for a code nobody
// listed, which is the shape this map exists to refuse.
const LAUNCH_ROUTES = new Map([
  ['DPA_PORTAL_HOME', '/home'],
  ['DPA_DC_DP_REGISTRATION', '/dc-dp/registration'],
  ['DPA_DATA_BREACH_REPORT', '/data-breach/registration'],
  ['DPA_DATA_PROTECTION_COMPLAINT', '/complaint-handle/registration'],
  ['DPA_ENQUIRY', '/enquiries'],
]);

// How far apart the two servers' clocks may be before a request is stale. Wide
// enough for ordinary drift, narrow enough that a captured request is useless
// long before anyone could reuse it — and the nonce refuses it even inside the
// window.
const CLOCK_SKEW_MS = 120000;
const CODE_TTL_SECONDS = 60;

const sessionSchema = z.object({
  service: z.string().trim().min(3).max(64),
  correlationId: z.string().trim().min(8).max(64),
  identity: z.object({
    provider: z.literal('ecitizen'),
    subject: z.string().trim().min(1).max(128),
    email: emailSchema,
    fullName: z.string().trim().min(1).max(150),
    phone: z.string().trim().max(30).optional(),
    identityVerified: z.boolean().optional(),
  }),
});

const sha256 = value => createHash('sha256').update(value).digest('hex');
const equal = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export function ecitizenRoutes({ db, config }) {
  const router = Router();
  const users = db.collection('users');
  const codes = db.collection('ecitizen_launch_codes');
  const nonces = db.collection('ecitizen_nonces');
  const events = db.collection('ecitizen_sso_events');
  const settings = config.ecitizen;

  // Not configured is a state, not a failure. Without a client id and secret
  // there is no trusted partner, so the endpoint says so rather than falling
  // back to accepting unsigned requests.
  const requireConfigured = () => {
    if (!settings?.clientId || !settings?.clientSecret) {
      throw new HttpError(503, 'Federated sign-in is not configured on this server.');
    }
  };

  // The trail this side keeps: which provider, which citizen mapping, which
  // service was asked for, and when a session was created. Never what the
  // citizen then does — that is already in the portal's own records, and
  // copying it here would suggest eCitizen had a hand in it.
  const audit = event =>
    events.insertOne({ provider: 'ecitizen', createdAt: new Date(), ...event }).catch(() => {});

  // Proves the request came from eCitizen and has not been altered or replayed.
  //
  // The signature covers the client id, the timestamp, a per-request nonce and
  // a digest of the exact bytes received, so re-timing it, re-pointing it or
  // editing one character of it all fail. The nonce is then stored under a
  // unique index, so an intact request cannot be sent twice inside the window.
  //
  // It hashes `req.rawBody` — the bytes as they arrived — and not a re-encoding
  // of the parsed object: a signature over JSON.stringify(req.body) would agree
  // only by luck, and would break on key order, unicode escaping or number
  // formatting differing between the two runtimes.
  const verifySignature = async req => {
    const clientId = req.get('x-ecitizen-client-id') || '';
    const timestamp = Number(req.get('x-ecitizen-timestamp'));
    const nonce = req.get('x-ecitizen-nonce') || '';
    const signature = req.get('x-ecitizen-signature') || '';

    if (!equal(clientId, settings.clientId)) throw new HttpError(401, 'Unknown integration client.');
    if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > CLOCK_SKEW_MS) {
      throw new HttpError(401, 'The integration request has expired.');
    }
    if (!/^[a-f0-9]{16,64}$/i.test(nonce)) throw new HttpError(401, 'The integration request is malformed.');
    if (!Buffer.isBuffer(req.rawBody)) throw new HttpError(400, 'The integration request could not be read.');

    const expected = createHmac('sha256', settings.clientSecret)
      .update(`${clientId}.${timestamp}.${nonce}.${sha256(req.rawBody)}`)
      .digest('hex');

    if (!/^[a-f0-9]{64}$/.test(signature) || !equal(signature, expected)) {
      throw new HttpError(401, 'The integration request could not be verified.');
    }

    try {
      await nonces.insertOne({ nonce, createdAt: new Date() });
    } catch (error) {
      if (error?.code === 11000) throw new HttpError(401, 'This integration request has already been used.');
      throw error;
    }
  };

  // Resolving the citizen to a DPA account — the part §8 is about.
  //
  // The link is on the immutable eCitizen subject, never on the email address:
  // an address can be changed or reassigned, and a link built on one would move
  // a citizen's case history the day they updated it. Email is only ever used
  // to *find* a candidate account, and the link is what is trusted afterwards.
  const resolveUser = async identity => {
    const link = { provider: 'ecitizen', subject: identity.subject };
    const now = new Date();

    const linked = await users.findOne({ externalIdentities: { $elemMatch: link } });
    if (linked) {
      if (linked.disabled) throw new HttpError(403, 'This account is disabled.');
      return { user: linked, outcome: 'MATCHED' };
    }

    const byEmail = await users.findOne({ email: identity.email });

    if (byEmail) {
      if (byEmail.disabled) throw new HttpError(403, 'This account is disabled.');

      // Already federated to a different eCitizen identity. Two accounts
      // claiming one mailbox is not something this server can settle, and
      // re-pointing an existing case history at a new person is the one
      // outcome that must never happen silently.
      const claimed = (byEmail.externalIdentities || []).find(
        entry => entry.provider === 'ecitizen' && entry.subject !== identity.subject
      );
      if (claimed) {
        throw new HttpError(409, 'This email address is already linked to a different eCitizen account. Contact the Authority to resolve it.');
      }

      // Safe to link: eCitizen holds a verified account for this address, and
      // a DPA account that was verified proved the same mailbox by email code.
      // An unverified DPA row proved nothing, so eCitizen's proof settles it
      // and the row is adopted rather than left stranded beside a new account —
      // which the unique index on email would refuse anyway.
      const user = await users.findOneAndUpdate(
        { _id: byEmail._id },
        {
          $addToSet: { externalIdentities: link },
          $set: { verified: true, updatedAt: now, ...(byEmail.name ? {} : { name: identity.fullName }) },
        },
        { returnDocument: 'after' }
      );
      return { user, outcome: byEmail.verified ? 'LINKED' : 'ADOPTED' };
    }

    // A new client account, provisioned for this citizen and linked at once, so
    // the next launch matches on the subject rather than creating another one.
    //
    // It is given an unusable random password rather than none: the collection
    // requires a passwordHash, and a citizen who arrives only through eCitizen
    // should not also have a password somebody could guess. Anyone who later
    // wants to sign in at DPA directly sets one through Forgot password, which
    // emails the address eCitizen already verified.
    const created = await users.findOneAndUpdate(
      { email: identity.email },
      {
        $setOnInsert: {
          email: identity.email,
          passwordHash: `scrypt:${randomBytes(16).toString('hex')}:${randomBytes(64).toString('hex')}`,
          createdAt: now,
          role: 'client',
          tokenVersion: 0,
        },
        $set: { verified: true, name: identity.fullName, updatedAt: now, ...(identity.phone ? { phone: identity.phone } : {}) },
        $addToSet: { externalIdentities: link },
      },
      { upsert: true, returnDocument: 'after' }
    );
    return { user: created, outcome: 'PROVISIONED' };
  };

  // Server to server. Signed, replay-protected, and the only thing it hands
  // back is an address — no token, no account data, nothing about the citizen.
  router.post('/session', async (req, res) => {
    requireConfigured();
    await verifySignature(req);

    const { service, correlationId, identity } = sessionSchema.parse(req.body);
    const redirectTo = LAUNCH_ROUTES.get(service);
    if (!redirectTo) throw new HttpError(400, 'That is not a service this portal can be launched into.');

    const { user, outcome } = await resolveUser(identity);

    const code = randomBytes(32).toString('base64url');
    await codes.insertOne({
      codeHash: sha256(code),
      userId: String(user._id),
      subject: identity.subject,
      service,
      redirectTo,
      correlationId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + CODE_TTL_SECONDS * 1000),
      usedAt: null,
    });

    await audit({ event: 'LAUNCH_ISSUED', subject: identity.subject, userId: String(user._id), service, correlationId, outcome });

    // DPA composes its own launch URL, because DPA owns its routes. eCitizen
    // checks the origin before it sends a browser there, and follows nothing
    // else.
    return ok(res, { launchUrl: `${settings.portalBaseUrl}/ecitizen/callback?code=${code}`, expiresIn: CODE_TTL_SECONDS }, 'Launch authorised.');
  });

  // Browser facing. The code is the only credential, it works once, and it
  // expires in a minute — which is why it is safe in a URL where an access
  // token would not be.
  router.post('/exchange', async (req, res) => {
    requireConfigured();
    const { code } = z.object({ code: z.string().trim().min(20).max(64) }).parse(req.body);

    // Marking it used in the same operation that finds it is what makes it
    // single-use: two requests racing with the same code cannot both match.
    const launch = await codes.findOneAndUpdate(
      { codeHash: sha256(code), usedAt: null, expiresAt: { $gt: new Date() } },
      { $set: { usedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!launch) throw new HttpError(400, 'This sign-in link has expired or has already been used. Start again from eCitizen.');

    const user = await users.findOne({ _id: id(launch.userId) });
    if (!user || user.disabled || !user.verified) throw new HttpError(401, 'This account cannot be signed in.');

    await audit({ event: 'SESSION_CREATED', subject: launch.subject, userId: launch.userId, service: launch.service, correlationId: launch.correlationId });

    // `idp` records on the token itself that this session came from eCitizen.
    // Nothing branches on it — the session is an ordinary DPA session with the
    // ordinary DPA lifetime and the ordinary tokenVersion revocation — it is
    // there so an operator reading a token can tell how it was obtained.
    const token = jwt.sign(
      { type: 'user', role: 'client', permissions: [], isSuperAdmin: false, ver: user.tokenVersion || 0, idp: 'ecitizen' },
      config.jwtSecret,
      { algorithm: 'HS256', subject: String(user._id), expiresIn: '8h', issuer: 'dpa-portal', audience: 'dpa-client' }
    );

    // The shape the portal's own login already returns, so the callback screen
    // dispatches the same action the sign-in form does and nothing downstream
    // has to know this session came from eCitizen.
    return res.json({ success: true, message: 'Signed in.', token, data: publicUser(user), redirectTo: launch.redirectTo });
  });

  return router;
}
