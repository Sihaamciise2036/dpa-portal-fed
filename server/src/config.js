// Configuration problems are the operator's own text and safe to echo. Driver
// failures are not: their messages can carry the URI, credentials and host, so
// they are reduced to a code plus the same fix-it advice.
export function describeStartupError(error, advice) {
  const configuration = error?.name === 'Error' && !error.code && !error.syscall;
  if (configuration) return error.message;
  const code = error?.codeName || error?.code || error?.name || 'unknown error';
  return `Atlas connection failed (${code}). ${advice}`;
}
export function loadConfig(env = process.env) {
  const uri = env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required in server/.env.');
  if (!uri.startsWith('mongodb+srv://')) throw new Error('Use a MongoDB Atlas mongodb+srv connection string.');
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters.');
  const database = env.MONGODB_DATABASE || 'dpa_portal';
  if (!/^[a-zA-Z0-9_-]{1,63}$/.test(database)) throw new Error('MONGODB_DATABASE must be a valid database name.');
  const production = env.NODE_ENV === 'production';
  if (production && !env.SMTP_HOST) throw new Error('SMTP_HOST is required in production for verification emails.');
  const port = Number(env.PORT || 3005);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid port.');
  const origins = (env.CLIENT_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(',').map(s => s.trim());
  // How long the driver hunts for a reachable node before giving up. Worth
  // lowering on a hosted platform: a shorter wait turns an unreachable cluster
  // into a fast, legible failure instead of a request that hangs past the
  // host's own gateway timeout and reports nothing useful.
  const serverSelectionTimeoutMs = Number(env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 12000);
  if (!Number.isInteger(serverSelectionTimeoutMs) || serverSelectionTimeoutMs < 1000 || serverSelectionTimeoutMs > 120000) {
    throw new Error('MONGODB_SERVER_SELECTION_TIMEOUT_MS must be between 1000 and 120000.');
  }
  // How many reverse proxies sit in front of this process. Vercel serves the
  // function behind exactly one, and without this Express reads the proxy's own
  // socket address as `req.ip` — identical for every visitor — so the auth rate
  // limiter collapses the whole site into a single 40-request bucket and starts
  // refusing verification codes to everyone. `1` makes `req.ip` the real client
  // again. Never `true`: that would trust a client-supplied X-Forwarded-For and
  // let anyone spoof their way past the limiter.
  const trustProxy = env.TRUST_PROXY === undefined ? (production ? 1 : 0) : Number(env.TRUST_PROXY);
  if (!Number.isInteger(trustProxy) || trustProxy < 0 || trustProxy > 10) throw new Error('TRUST_PROXY must be the number of proxies in front of the API (0-10).');
  // Verification mail has to fail faster than the platform kills the request.
  // Nodemailer's own defaults are a 2-minute connect and a 10-minute socket
  // timeout, both far past Vercel's 30s function limit: an unreachable SMTP
  // host would take the whole invocation down with it, so the code that clears
  // the pending challenge never runs and the user is left waiting out a
  // cooldown for a message that was never sent.
  const mailTimeoutMs = Number(env.MAIL_TIMEOUT_MS || 12000);
  if (!Number.isInteger(mailTimeoutMs) || mailTimeoutMs < 1000 || mailTimeoutMs > 25000) throw new Error('MAIL_TIMEOUT_MS must be between 1000 and 25000.');

  // Federated sign-in from eCitizen. Optional: with no client id and secret the
  // integration routes answer 503 and the rest of the portal is unaffected —
  // there is no unsigned fallback, because accepting an unsigned request would
  // let anyone who can reach the API open a session as any citizen. A secret
  // short enough to guess is refused outright rather than accepted weakly.
  if (env.ECITIZEN_CLIENT_SECRET && env.ECITIZEN_CLIENT_SECRET.length < 32) throw new Error('ECITIZEN_CLIENT_SECRET must contain at least 32 characters.');
  if (env.ECITIZEN_CLIENT_ID && !env.ECITIZEN_CLIENT_SECRET) throw new Error('ECITIZEN_CLIENT_SECRET is required when ECITIZEN_CLIENT_ID is set.');
  return { uri, database, jwtSecret: env.JWT_SECRET, production, port, host: env.HOST || '127.0.0.1',
    origins, serverSelectionTimeoutMs, trustProxy, mailTimeoutMs,
    ecitizen: { clientId: env.ECITIZEN_CLIENT_ID || '', clientSecret: env.ECITIZEN_CLIENT_SECRET || '',
      // Where this portal is served. The launch URL is composed against it,
      // because DPA owns its own routes and eCitizen never builds one.
      portalBaseUrl: (env.PORTAL_BASE_URL || origins[0] || '').replace(/\/+$/, '') },
    smtp: env.SMTP_HOST ? { host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: env.SMTP_SECURE === 'true',
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
      // Each phase bounded well inside mailTimeoutMs so nodemailer reports a real
      // error instead of hanging until the platform times the function out.
      connectionTimeout: 7000, greetingTimeout: 5000, socketTimeout: 8000 } : null,
    mailFrom: env.MAIL_FROM || 'DPA Portal <noreply@localhost>',
  };
}
