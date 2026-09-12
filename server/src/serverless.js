/*
 * Serverless entry point for the existing Express application.
 *
 * `createApp` already returns a bare Express app and never listens — only
 * `index.js` calls `app.listen`, and that file is not imported here. So the
 * same app, the same routes, the same authentication and the same MongoDB
 * access serve both the long-running local server and a serverless platform.
 *
 * What is different in serverless is lifetime. A container handles many
 * requests and may be frozen between them, so the connection is built once and
 * reused; building it per request would open a new pool every time and exhaust
 * the cluster's connection limit under any real load.
 */
import { loadConfig } from './config.js';
import { connectDatabase } from './database.js';
import { createApp } from './app.js';
import { createMailer } from './mail.js';

let pending = null;

async function build() {
  const config = loadConfig();
  const { db } = await connectDatabase(config);
  return createApp({ db, config, mailer: createMailer(config) });
}

/**
 * The ready Express app, built at most once per container.
 *
 * Cached as the promise rather than the resolved app: several requests can
 * arrive before the first connection settles, and they must all wait on that
 * one attempt instead of racing to start their own.
 *
 * A failed attempt is discarded so the next request retries. Caching a
 * rejected promise would pin the container to a transient error — a brief
 * Atlas blip would keep answering 503 until the container was recycled.
 */
export function getApp() {
  if (!pending) {
    pending = build().catch(error => {
      pending = null;
      throw error;
    });
  }
  return pending;
}
