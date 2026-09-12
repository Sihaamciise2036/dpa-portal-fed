import { MongoClient } from 'mongodb';

const owned = ['controllers', 'breaches', 'complaints', 'support_tickets', 'ticket_messages', 'form_replies', 'transactions'];
const reference = ['categories', 'sizes', 'sectors', 'faqs', 'settings', 'staff_directory', 'certificates'];
// Federated sign-in from eCitizen. Not in `owned`: these rows belong to the
// handoff, not to a citizen's case, and none of them is a record of DPA's work.
const federation = ['ecitizen_launch_codes', 'ecitizen_nonces', 'ecitizen_sso_events'];
export async function initializeDatabase(db) {
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map(c => c.name));
  for (const name of ['users', 'auth_challenges', ...federation, ...owned, ...reference]) {
    if (!existing.has(name)) {
      const required = name === 'users' ? ['email', 'passwordHash', 'createdAt'] : owned.includes(name) ? ['userId', 'createdAt'] : [];
      await db.createCollection(name, { validator: { $jsonSchema: { bsonType: 'object', ...(required.length ? { required } : {}),
        properties: { userId: { bsonType: 'string' }, email: { bsonType: 'string' }, createdAt: { bsonType: 'date' } } } } });
    }
  }
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('auth_challenges').createIndex({ email: 1, purpose: 1 }, { unique: true });
  await db.collection('auth_challenges').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  // One DPA account per external identity. Unique and sparse: it is the link
  // eCitizen sign-in resolves on, and two accounts claiming one eCitizen
  // citizen would silently split that citizen's case history in half. Accounts
  // that have never used federated sign-in carry no such field and are ignored.
  await db.collection('users').createIndex({ 'externalIdentities.provider': 1, 'externalIdentities.subject': 1 }, { unique: true, sparse: true });
  // A launch code is looked up by its hash, is single-use, and disappears on
  // its own. The TTL is a floor, not a guarantee — the monitor runs about once
  // a minute — so `expiresAt` is checked in the query as well.
  await db.collection('ecitizen_launch_codes').createIndex({ codeHash: 1 }, { unique: true });
  await db.collection('ecitizen_launch_codes').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 300 });
  // Replay protection: a nonce that has been seen cannot be seen again. Kept
  // well beyond the two-minute clock window so a replay cannot wait it out.
  await db.collection('ecitizen_nonces').createIndex({ nonce: 1 }, { unique: true });
  await db.collection('ecitizen_nonces').createIndex({ createdAt: 1 }, { expireAfterSeconds: 900 });
  await db.collection('ecitizen_sso_events').createIndex({ createdAt: -1 });
  await db.collection('ecitizen_sso_events').createIndex({ subject: 1, createdAt: -1 });
  for (const name of owned) await db.collection(name).createIndex({ userId: 1, createdAt: -1 });
  await db.collection('ticket_messages').createIndex({ supportTicketId: 1, userId: 1, createdAt: 1 });
  await db.collection('settings').createIndex({ key: 1 }, { unique: true });
  await db.collection('certificates').createIndex({ certificateNumber: 1 }, { unique: true, sparse: true });
}
export async function connectDatabase(config) {
  const client = new MongoClient(config.uri, { serverSelectionTimeoutMS: config.serverSelectionTimeoutMs, connectTimeoutMS: 10000, maxPoolSize: 10, appName: 'DPA-Client-Portal' });
  try {
    await client.connect();
    const db = client.db(config.database);
    await db.command({ ping: 1 });
    await initializeDatabase(db);
    return { client, db };
  } catch (error) { await client.close(); throw error; }
}
