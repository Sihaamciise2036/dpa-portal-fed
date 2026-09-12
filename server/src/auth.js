import { Router } from 'express';
import { createHmac, randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { HttpError, emailSchema, passwordSchema, id, ok } from './http.js';

const scrypt = promisify(scryptCallback);
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${hash.toString('hex')}`;
}
export async function checkPassword(password, stored) {
  const [, salt, encoded] = (stored || '').split(':');
  if (!salt || !encoded) return false;
  const expected = Buffer.from(encoded, 'hex');
  const actual = await scrypt(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export function publicUser(user) {
  return { _id: String(user._id), id: String(user._id), email: user.email, name: user.name || '', phone: user.phone || '',
    phone_number: user.phone_number || '', phone_no: user.phone_no || '', profile_image: user.profile_image || '', status: user.verified ? 1 : 4, role: 'client', type: 'user' };
}
export function authentication(db, config) {
  return async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.path.startsWith('/file/get/') && typeof req.query.token === 'string' ? req.query.token : '';
    try {
      const decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'], issuer: 'dpa-portal', audience: 'dpa-client' });
      if (decoded.type !== 'user' || !/^[a-f0-9]{24}$/i.test(decoded.sub || '')) throw new Error('Invalid session');
      const user = await db.collection('users').findOne({ _id: id(decoded.sub), verified: true });
      if (!user || (user.tokenVersion || 0) !== decoded.ver || user.disabled) throw new Error('Invalid session');
      req.user = user;
      req.userId = String(user._id);
      next();
    } catch (error) {
      if (error.name?.startsWith('Mongo')) return next(error);
      next(new HttpError(401, 'Please sign in to continue.'));
    }
  };
}

export function authRoutes({ db, config, mailer }) {
  const router = Router();
  const users = db.collection('users');
  const challenges = db.collection('auth_challenges');
  const digest = value => createHmac('sha256', config.jwtSecret).update(value).digest('hex');
  const matches = (value, hash) => typeof hash === 'string' && timingSafeEqual(Buffer.from(digest(value)), Buffer.from(hash));
  const newPassword = z.object({ password: passwordSchema, confirm_password: passwordSchema }).refine(data => data.password === data.confirm_password, { message: 'Passwords do not match.', path: ['confirm_password'] });
  const session = user => ({ token: jwt.sign({ type: 'user', role: 'client', permissions: [], isSuperAdmin: false, ver: user.tokenVersion || 0 }, config.jwtSecret,
    { algorithm: 'HS256', subject: String(user._id), expiresIn: '8h', issuer: 'dpa-portal', audience: 'dpa-client' }), data: publicUser(user) });

  /*
   * Send, but never for longer than the platform will keep the request alive.
   *
   * The cleanup in `issue` only runs if this rejects. A hosted function that is
   * killed mid-send runs no catch at all, so the pending challenge survives —
   * and the one-minute cooldown then turns the user's retry into "please wait"
   * for a code that was never sent. Failing on our own clock keeps the failure
   * inside the request, where it can be undone and reported.
   */
  async function deliver(email, code, purpose) {
    const sent = mailer({ to: email, code, purpose });
    // The loser of the race keeps a no-op handler: an SMTP error arriving after
    // the timeout would otherwise surface as an unhandled rejection.
    sent.catch(() => {});
    let timer;
    const expired = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Mail delivery timed out.')), config.mailTimeoutMs || 12000); });
    try { await Promise.race([sent, expired]); } finally { clearTimeout(timer); }
  }
  async function issue(email, purpose) {
    const code = String(randomInt(100000, 1000000));
    const token = randomBytes(32).toString('hex');
    const challenge = { email, purpose, codeHash: digest(code), tokenHash: digest(token), attempts: 0, createdAt: new Date(), expiresAt: new Date(Date.now() + 600000) };
    await challenges.replaceOne({ email, purpose }, challenge, { upsert: true });
    try { await deliver(email, code, purpose); }
    catch { await challenges.deleteOne({ email, purpose, tokenHash: challenge.tokenHash }); throw new HttpError(503, 'Unable to deliver the verification email. Please try again.'); }
    return token;
  }
  async function consume(email, purpose, code, token) {
    const challenge = await challenges.findOneAndUpdate({ email, purpose, attempts: { $lt: 5 }, expiresAt: { $gt: new Date() } }, { $inc: { attempts: 1 } }, { returnDocument: 'after' });
    if (!challenge || !matches(code, challenge.codeHash) || (purpose === 'register' && !matches(token, challenge.tokenHash))) throw new HttpError(400, 'The verification code is invalid or expired.');
    const deleted = await challenges.deleteOne({ _id: challenge._id, attempts: challenge.attempts });
    if (!deleted.deletedCount) throw new HttpError(400, 'The verification code has already been used.');
  }

  router.post('/register', async (req, res) => {
    const { email } = z.object({ email: emailSchema, terms_condition: z.literal(true) }).parse(req.body);
    const { password } = newPassword.parse(req.body);
    const existing = await users.findOne({ email });
    if (existing?.verified) throw new HttpError(409, 'An account already exists with this email. Please sign in.');
    const pending = await challenges.findOne({ email, purpose: 'register', createdAt: { $gt: new Date(Date.now() - 60000) } });
    if (pending) throw new HttpError(429, 'Please wait one minute before requesting another code.');
    const passwordHash = await hashPassword(password);
    await users.updateOne({ email }, { $setOnInsert: { email, createdAt: new Date(), role: 'client', tokenVersion: 0 }, $set: { passwordHash, verified: false, updatedAt: new Date() } }, { upsert: true });
    const token = await issue(email, 'register');
    // The outbox only exists when SMTP is unconfigured, which cannot happen in
    // production. Naming it there would send a real user looking for a file.
    return ok(res, { email, token }, config.smtp ? 'Verification code sent. Check your email.' : 'Verification code created. Check the local development outbox (server/.mail).', 201);
  });
  /*
   * A second code for a sign-up already in progress.
   *
   * Without this the ten-minute expiry is a dead end: a code that is delayed,
   * spam-filtered or simply missed leaves the verify screen with nothing to do
   * but fill in the whole sign-up form again. Issuing replaces the stored
   * challenge, so the response carries the new token and the caller must keep
   * it — the previous message stops working the moment this succeeds.
   *
   * No new enumeration surface: /register above already answers 409 for an
   * address that is taken, so what this discloses is disclosed there too.
   */
  router.post('/register/resend-otp', async (req, res) => {
    const { email } = z.object({ email: emailSchema }).parse(req.body);
    const user = await users.findOne({ email });
    if (!user) throw new HttpError(404, 'Start again from the sign-up form.');
    if (user.verified) throw new HttpError(409, 'This account is already verified. Please sign in.');
    const pending = await challenges.findOne({ email, purpose: 'register', createdAt: { $gt: new Date(Date.now() - 60000) } });
    if (pending) throw new HttpError(429, 'Please wait one minute before requesting another code.');
    const token = await issue(email, 'register');
    return ok(res, { email, token }, config.smtp ? 'A new verification code is on its way.' : 'A new verification code was created. Check the local development outbox (server/.mail).');
  });
  router.post('/register/verify-otp', async (req, res) => {
    const { email, otp, token } = z.object({ email: emailSchema, otp: z.string().regex(/^\d{6}$/), token: z.string().length(64) }).parse(req.body);
    await consume(email, 'register', otp, token);
    const user = await users.findOneAndUpdate({ email, verified: false }, { $set: { verified: true, updatedAt: new Date() } }, { returnDocument: 'after' });
    if (!user) throw new HttpError(400, 'Account verification is no longer available.');
    return res.json({ success: true, message: 'Account verified.', ...session(user) });
  });
  router.post('/login', async (req, res) => {
    const { email, password } = z.object({ email: emailSchema, password: z.string().min(1).max(128) }).parse(req.body);
    const user = await users.findOne({ email });
    if (!user || !await checkPassword(password, user.passwordHash)) throw new HttpError(401, 'Incorrect email or password.');
    if (!user.verified) throw new HttpError(403, 'Verify your email before signing in.');
    if (user.disabled) throw new HttpError(403, 'This account is disabled.');
    return res.json({ success: true, message: 'Signed in.', ...session(user) });
  });
  router.post('/forgot-password', async (req, res) => {
    const { email } = z.object({ email: emailSchema }).parse(req.body);
    const user = await users.findOne({ email, verified: true });
    const recent = await challenges.findOne({ email, purpose: 'reset', createdAt: { $gt: new Date(Date.now() - 60000) } });
    if (user && !recent) await issue(email, 'reset');
    // Deliberately unchanged by `recent`: saying "one was already sent" would
    // confirm the address is registered, because only a real account leaves a
    // challenge behind. The wording instead sets an expectation that stays true
    // whichever branch ran, so a user who submits twice is not left watching for
    // a second message that was never going to arrive.
    return ok(res, { email }, 'If this account exists, a reset code has been sent. It can take a minute to arrive — check your spam folder before requesting another.');
  });
  router.post('/verify-token', async (req, res) => {
    // Named `token` on the wire but it is the six-digit code, and `consume`
    // takes that third. A reset challenge carries no second factor, so nothing
    // is passed for the fourth — spelled out here because reading
    // `consume(email, 'reset', token)` invites filling the wrong slot.
    const { email, token: code } = z.object({ email: emailSchema, token: z.string().regex(/^\d{6}$/) }).parse(req.body);
    await consume(email, 'reset', code);
    const resetToken = randomBytes(32).toString('hex');
    await challenges.replaceOne({ email, purpose: 'reset-session' }, { email, purpose: 'reset-session', tokenHash: digest(resetToken), expiresAt: new Date(Date.now() + 600000) }, { upsert: true });
    return ok(res, { email, token: resetToken }, 'Code verified. Set your new password.');
  });
  router.post('/update-password', async (req, res) => {
    const { email, token } = z.object({ email: emailSchema, token: z.string().length(64) }).parse(req.body);
    const { password } = newPassword.parse(req.body);
    const passwordHash = await hashPassword(password);
    const challenge = await challenges.findOneAndDelete({ email, purpose: 'reset-session', tokenHash: digest(token), expiresAt: { $gt: new Date() } });
    if (!challenge) throw new HttpError(400, 'The password reset has expired or was already used.');
    await users.updateOne({ email, verified: true }, { $set: { passwordHash, updatedAt: new Date() }, $inc: { tokenVersion: 1 } });
    return ok(res, null, 'Password updated. Please sign in again.');
  });
  return router;
}

export function profileRoutes({ db }) {
  const router = Router();
  router.get('/site/check-verify', (req, res) => ok(res, publicUser(req.user)));
  router.get('/user/:id', (req, res) => {
    id(req.params.id);
    if (req.params.id !== req.userId) throw new HttpError(404, 'User not found.');
    return ok(res, publicUser(req.user));
  });
  router.put('/user/:id', async (req, res) => {
    id(req.params.id);
    if (req.params.id !== req.userId) throw new HttpError(404, 'User not found.');
    const data = z.object({ name: z.string().trim().min(2).max(100).optional(), email: emailSchema.optional(), phone: z.string().max(30).optional(),
      phone_number: z.string().max(30).optional(), phone_no: z.string().max(30).optional(), profile_image: z.string().max(150).optional(), password: z.string().max(128).optional(),
      confirm_password: z.string().max(128).optional(), current_password: z.string().max(128).optional() }).parse(req.body);
    if (data.email && data.email !== req.user.email) throw new HttpError(422, 'Email changes require verification. Keep your current email address.');
    const update = { updatedAt: new Date() };
    for (const key of ['name', 'phone', 'phone_number', 'phone_no', 'profile_image']) if (data[key] !== undefined) update[key] = data[key];
    if (data.password) {
      passwordSchema.parse(data.password);
      if (data.password !== data.confirm_password) throw new HttpError(422, 'Passwords do not match.');
      if (!data.current_password || !await checkPassword(data.current_password, req.user.passwordHash)) throw new HttpError(422, 'Enter your current password to change your password.');
      update.passwordHash = await hashPassword(data.password);
    }
    const user = await db.collection('users').findOneAndUpdate({ _id: req.user._id }, { $set: update, ...(data.password ? { $inc: { tokenVersion: 1 } } : {}) }, { returnDocument: 'after' });
    return ok(res, publicUser(user), data.password ? 'Password changed. Please sign in again.' : 'Profile updated.');
  });
  return router;
}
