# DPA backend implementation plan

**Goal:** Run the existing portal against a secure MongoDB Atlas backend.
**Architecture:** Express 5 with the MongoDB driver, separate auth, records, reference data and files modules. Preserve frontend API contracts.
**Spec:** `docs/superpowers/specs/2026-09-09-dpa-backend-design.md`.

Global constraints: credentials stay server-side; runtime uses Atlas only; ownership is mandatory; no fake payments, approvals or email delivery. Execute inline under the user's existing build authorization.

- [x] Database and app foundation: `server/package.json`, `src/config.js`, `src/database.js`, `src/app.js`, `src/http.js`, `src/index.js`. Test configuration rejection, health, database indexes and validation. Install dependencies and run Node test runner.
- [x] Authentication: `src/auth.js`, `src/mail.js`, `test/api.test.js`. Write integration tests for code verification, bad/expired/replayed credentials and session invalidation; implement scrypt, JWT, bounded one-time challenges, and private development outbox.
- [x] Portal records: `src/records.js`, `src/references.js`. Test cross-account isolation and protected fields, then implement applications, breach/complaint records, enquiries, replies, read-only transactions and explicit payment unavailability.
- [x] Attachments and client integration: `src/files.js`, frontend Axios network error handling and profile redirect. Test authenticated upload/read, cross-user denial, upload limits, and profile password reauthentication. Keep the existing UI usable.
- [x] Atlas and operation: ignored server env, connection-check command, combined startup command, setup README. Run API integration tests, frontend build and browser checks; verify Atlas ping and persistence or report the exact connection blocker.

## Port

The API listens on **3005**, not the 3003 named in the spec — the user asked for a
different port. Set in `server/src/config.js` (default), `server/.env{,.example}` and
`.env.development`; asserted in `test/api.test.js`.

## Status

Backend complete: 11 integration tests pass against a throwaway in-memory MongoDB, the
app binds and serves on 3005, and `initializeDatabase` creates all 16 collections with
their validators and indexes. Frontend builds clean.

Atlas verified end to end (database `dpa_portal`): ping succeeds,
all 16 collections and their indexes were created on first connect, and a full
register → email code → verify → login → save draft → list → enquiry flow persisted.
Confirmed by reading the cluster directly, outside the API: password stored as scrypt,
`userId` matching the owner, and the server overriding client-supplied `status` and
`registrationFee`. Smoke-test records were deleted afterwards.

`npm run dev:all:local` was added to run the API against a throwaway in-memory
database. It is a separate command, not a fallback — `npm start` and `npm run dev`
still refuse to start without a real `MONGODB_URI`, as the spec requires.
