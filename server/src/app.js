import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { ZodError } from 'zod';
import { authentication, authRoutes, profileRoutes } from './auth.js';
import { ecitizenRoutes } from './integration.js';
import { recordRoutes } from './records.js';
import { publicRoutes, referenceRoutes } from './references.js';
import { fileRoutes } from './files.js';
import { HttpError, ok } from './http.js';

export function createApp(dependencies) {
  const { db, config } = dependencies;
  const app = express();
  app.disable('x-powered-by');
  /*
   * Behind Vercel every request reaches this process through the platform's
   * proxy, so without this the socket address Express reports as `req.ip` is
   * that proxy — the same value for every visitor on earth. The auth limiter
   * below keys on `req.ip`, so one shared bucket of 40 requests per 15 minutes
   * covered the entire site and verification codes stopped being sent or
   * accepted for everyone once any 40 requests had been made.
   *
   * A hop count, never `true`: trusting the whole chain would honour a
   * client-supplied X-Forwarded-For and hand every caller a fresh bucket.
   */
  app.set('trust proxy', config.trustProxy ?? (config.production ? 1 : 0));
  app.use(helmet());
  app.use(cors({ origin(origin, callback) { callback(null, !origin || config.origins.includes(origin)); } }));
  // The raw bytes are kept alongside the parsed body for one reason: the
  // eCitizen integration signs the request body, and a signature has to be
  // checked against what actually arrived. Re-encoding the parsed object would
  // agree only by luck — key order, unicode escaping and number formatting all
  // differ between runtimes — so the verifier hashes `req.rawBody`.
  app.use(express.json({ limit: '1mb', verify: (req, res, buf) => { req.rawBody = buf; } }));
  app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.get('/api/health', async (req, res) => { await db.command({ ping: 1 }); return ok(res, { status: 'ok', database: 'connected' }); });
  app.use('/api', publicRoutes(dependencies));
  app.use('/api/user/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: config.production ? 40 : 500, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { success: false, message: 'Too many authentication requests. Please try again later.' } }), authRoutes(dependencies));
  /*
   * Federated sign-in from eCitizen. Mounted BEFORE the portal's own
   * authentication, because these two routes are how a session is obtained —
   * a citizen arriving from eCitizen has no DPA token yet, by definition.
   *
   * Neither route is a DPA workflow, and nothing below moves: every service
   * this portal delivers still sits behind `authenticate` and is reached with
   * an ordinary DPA token.
   */
  app.use('/api/integration/ecitizen', rateLimit({ windowMs: 15 * 60 * 1000, limit: config.production ? 60 : 500, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { success: false, message: 'Too many sign-in requests. Please try again later.' } }), ecitizenRoutes(dependencies));

  const authenticate = authentication(db, config);
  app.use('/api', authenticate);
  app.use('/api/user', profileRoutes(dependencies), recordRoutes(dependencies), referenceRoutes(dependencies));
  app.use('/api/file', rateLimit({ windowMs: 60000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }), fileRoutes(dependencies));
  app.post('/api/admin/admin-user/data', async (req, res) => ok(res, { data: [], total: 0 }));
  app.post('/api/admin/admin-user/organize/data', async (req, res) => ok(res, { data: [], total: 0 }));
  app.use((req, res, next) => next(new HttpError(404, 'API endpoint not found.')));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof ZodError) return res.status(422).json({ success: false, message: 'Please check the submitted fields.', errors: Object.fromEntries(error.issues.map(issue => [issue.path.join('.') || 'form', issue.message])) });
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'This record already exists.' });
    if (error.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ success: false, message: 'Files must be smaller than 10 MB.' });
    const status = error.status || (error.name === 'MulterError' ? 422 : error.name?.startsWith('Mongo') ? 503 : 500);
    if (status >= 500) console.error(`API request failed (${error.name || 'Error'}).`);
    return res.status(status).json({ success: false, message: status === 500 ? 'An unexpected server error occurred.' : status === 503 && !error.status ? 'The database is unavailable. Please try again.' : error.message });
  });
  return app;
}
