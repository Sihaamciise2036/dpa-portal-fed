// Runs the API against a throwaway in-memory MongoDB, so the portal can be
// exercised end to end before Atlas credentials are available.
//
// This is deliberately a separate, explicitly named command. `npm start` and
// `npm run dev` still refuse to start without a real MONGODB_URI — the server
// never silently falls back to a local database. Everything written here is
// discarded when the process exits.
import dotenv from 'dotenv';
import { randomBytes } from 'node:crypto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { loadConfig } from '../src/config.js';
import { initializeDatabase } from '../src/database.js';
import { createApp } from '../src/app.js';
import { createMailer } from '../src/mail.js';

dotenv.config({ path: new URL('../.env', import.meta.url), quiet: true });
if (process.env.NODE_ENV === 'production') {
  console.error('dev:local is a development-only command and will not run with NODE_ENV=production.');
  process.exit(1);
}

// Borrow the real validation for port, origins, secret and SMTP, but stand in a
// syntactically valid URI: the in-memory server supplies the actual connection.
const config = loadConfig({
  ...process.env,
  MONGODB_URI: 'mongodb+srv://local:local@in-memory.mongodb.net/',
  JWT_SECRET: process.env.JWT_SECRET?.length >= 32 ? process.env.JWT_SECRET : randomBytes(48).toString('base64url'),
});

const mongo = await MongoMemoryServer.create();
const client = await new MongoClient(mongo.getUri()).connect();
const db = client.db(config.database);
await initializeDatabase(db);

const server = createApp({ db, config, mailer: createMailer(config) }).listen(config.port, config.host, () => {
  console.log(`DPA API listening on http://${config.host}:${config.port}`);
  console.log('Database: in-memory MongoDB (THROWAWAY — all data is lost on exit).');
  console.log('Verification emails are written to server/.mail; open the newest file to read the code.');
});
server.on('error', error => { console.error(`API startup failed (${error.code || error.name}).`); shutdown(1); });

let closing = false;
async function shutdown(code = 0) {
  if (closing) return;
  closing = true;
  server.close();
  await client.close().catch(() => {});
  await mongo.stop().catch(() => {});
  process.exit(code);
}
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
