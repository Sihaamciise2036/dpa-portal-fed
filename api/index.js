/*
 * Vercel entry point for the DPA API.
 *
 * An explicit /api/:path* rewrite in vercel.json sends every API path here,
 * including nested paths. Requests are handed to the existing Express
 * application unchanged. No route, controller, middleware
 * or authentication logic is reimplemented: this file only adapts a serverless
 * invocation to the app that already exists.
 *
 * The Express app mounts all of its own routes under `/api` (see server/src/
 * app.js), and Vercel passes the original path through, so `/api/user/auth/
 * login` matches the real login route directly. No prefix rewriting is needed
 * or wanted — stripping `/api` here would make every mount path miss.
 */
import { describeStartupError } from '../server/src/config.js';
import { getApp } from '../server/src/serverless.js';

/*
 * Insurance against the one thing about this setup that cannot be checked
 * without deploying: whether a rewrite hands the function the path that was
 * requested, or the path it was rewritten to.
 *
 * Normally `req.url` still reads `/api/user/auth/login` and this does nothing.
 * If it ever arrives flattened to `/api`, the segments captured by
 * `/api/:path*` are rebuilt from the query so Express still matches its real
 * mounts instead of answering 404 for every route.
 */
function restorePath(req) {
  const [pathname, search = ''] = String(req.url || '').split('?');
  if (pathname !== '/api' && pathname !== '/api/') return;
  const params = new URLSearchParams(search);
  const captured = params.getAll('path').filter(Boolean).join('/');
  if (!captured) return;
  params.delete('path');
  const rest = params.toString();
  req.url = `/api/${captured}${rest ? `?${rest}` : ''}`;
}

export default async function handler(req, res) {
  restorePath(req);
  let app;
  try {
    app = await getApp();
  } catch (error) {
    // Configuration and connection failures happen before the app exists, so
    // Express's own error handler cannot answer them. Reply in the same
    // envelope the client already understands, and keep the detail in the
    // platform log: the driver's text can name the cluster and credentials.
    //
    // Deliberately not process.exit(): that would kill the container mid
    // request and return a platform error page instead of this response.
    console.error(describeStartupError(error, 'Check MONGODB_URI, JWT_SECRET and SMTP_HOST in the deployment environment.'));
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify({ success: false, message: 'The service is temporarily unavailable. Please try again.', data: null }));
  }
  return app(req, res);
}
