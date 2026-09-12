import dotenv from 'dotenv';
import { describeStartupError, loadConfig } from '../src/config.js';
import { connectDatabase } from '../src/database.js';
dotenv.config({ path: new URL('../.env', import.meta.url), quiet: true });
try {
  const config = loadConfig();
  const { client, db } = await connectDatabase(config);
  try {
    const names = (await db.listCollections({}, { nameOnly: true }).toArray()).map(c => c.name);
    console.log(`Atlas connected. Database: ${config.database}. Collections: ${names.sort().join(', ')}.`);
  } finally { await client.close(); }
} catch (error) {
  console.error(describeStartupError(error, 'Verify MONGODB_URI in server/.env: the cluster address, the credentials, and that this machine is on the Atlas IP access list.'));
  process.exitCode = 1;
}
