import dotenv from 'dotenv';
import { describeStartupError, loadConfig } from './config.js';
import { connectDatabase } from './database.js';
import { createApp } from './app.js';
import { createMailer } from './mail.js';

dotenv.config({ path: new URL('../.env', import.meta.url), quiet: true });
try {
  const config = loadConfig();
  const { client, db } = await connectDatabase(config);
  const server = createApp({ db, config, mailer: createMailer(config) }).listen(config.port, config.host, () => {
    console.log(`DPA API listening on http://${config.host}:${config.port}; Atlas database ${config.database} connected.`);
    if (!config.smtp) console.log('Development email outbox: server/.mail');
  });
  server.on('error', async error => { console.error(`API startup failed (${error.code || error.name}).`); await client.close(); process.exitCode = 1; });
  const stop = () => { server.close(async () => { await client.close(); process.exit(0); }); setTimeout(() => process.exit(1), 10000).unref(); };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
} catch (error) {
  console.error(describeStartupError(error, 'Check the URI, credentials and Atlas network access, then run npm run db:check.'));
  process.exitCode = 1;
}
