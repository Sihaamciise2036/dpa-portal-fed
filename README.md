# DPA Client Portal

The client-facing (user) portal of the Somalia Data Protection Authority registration
system, extracted as a standalone React app. This is the area a data controller, data
processor or DPO sees after signing in — the admin back office is not included.

## Running it

```bash
npm install
cd server && npm install && cd ..

npm run dev:all    # API on :3005 and the portal on http://localhost:3200
```

Or run the two halves separately: `npm run dev:api` and `npm run dev`.

Other scripts: `npm run build` (outputs to `dist/`), `npm run preview`, `npm test`
(frontend), `npm run test:api` (backend), `npm run db:check` (Atlas connectivity).

## Deploying

Frontend and API deploy together, to one Vercel project on one domain:

```
https://<domain>/*        -> Vite SPA (dist/)
https://<domain>/api/*    -> the Express app, via api/index.js
```

`api/index.js` is a thin adapter: it imports `server/src/serverless.js`, which
builds the *same* `createApp` used locally and caches it per container. No route,
controller or middleware is duplicated. `app.listen` stays in `server/src/index.js`
and is never reached in serverless.

`vercel.json` carries the three settings that make this work:

- `outputDirectory: "dist"` — matching Vite's own default, so the build lands where
  Vercel looks even if this file is ignored or a dashboard setting contradicts it. It
  was `build/`, inherited from CRA, and that mismatch failed two deploys.
- `rewrites` sends `/api/:path*` to `/api` explicitly, including nested paths such
  as `/api/user/auth/login`. The SPA fallback `/((?!api(?:/|$)).*)` excludes both
  `/api` and `/api/*`, so API requests cannot receive `index.html`.
- `functions.maxDuration: 30` — comfortably above the 8s server-selection timeout, so a
  database problem returns a JSON error instead of a platform timeout page.

The frontend needs no environment variable in production: `API_BASE_URL` defaults to
`/api`, which is same-origin. Set `REACT_APP_API_BASE_URL` only to point the portal at
an API on a *different* host.

### Environment variables to set in Vercel

Required — the API refuses to start without them, and in serverless that surfaces as
503 on every `/api` call:

| Variable | Notes |
|---|---|
| `MONGODB_URI` | Atlas `mongodb+srv://` string. Atlas Network Access must allow `0.0.0.0/0`; Vercel functions have no fixed egress IP. |
| `JWT_SECRET` | 32+ characters. Use a different value from development. |
| `SMTP_HOST` | **Required whenever `NODE_ENV=production`**, which Vercel sets automatically. There is no development outbox in production, so without SMTP the API will not boot. Set `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and `MAIL_FROM` with it. |

Optional: `MONGODB_DATABASE` (default `dpa_portal`), `MONGODB_SERVER_SELECTION_TIMEOUT_MS`
(default 12000; 8000 suits serverless), `CLIENT_ORIGINS`, `TRUST_PROXY`, `MAIL_TIMEOUT_MS`,
and the `ECITIZEN_*` group.

`TRUST_PROXY` is the number of reverse proxies in front of the API, and it defaults to
`1` whenever `NODE_ENV=production` — which is what Vercel sets. Leave it alone unless
you put something else in front of Vercel. It must never be `true`: Express would then
honour a client-supplied `X-Forwarded-For`, and anyone could hand themselves a fresh
rate-limit bucket per request.

`PORT` and `HOST` are ignored in serverless — nothing listens.

### Serverless caveats

Two platform limits apply to the deployed API that do not apply locally:

- **Request bodies are capped at ~4.5 MB.** The app itself allows 10 MB uploads, so
  larger attachments will fail on Vercel even though they work locally.
- **Rate limiting is per-container.** `express-rate-limit` keeps counters in memory, and
  each serverless container has its own, so the auth limits are looser than the
  configured numbers suggest. A shared store (Redis) would be needed to enforce them
  globally. What is *not* loose is which client each request counts against: that
  needs `trust proxy`, and without it every visitor shared one bucket and the whole
  site stopped receiving verification codes after 40 requests. See `TRUST_PROXY` above.
- **Functions are killed at `maxDuration` (30s in `vercel.json`).** Anything the API
  waits on has to fail sooner or the invocation dies with its cleanup unrun. Nodemailer's
  own defaults are a 2-minute connect and a 10-minute socket timeout, so SMTP is given
  explicit per-phase timeouts and the send is additionally raced against
  `MAIL_TIMEOUT_MS` (default 12000). A code that cannot be sent must clear its pending
  challenge, or the one-minute cooldown answers the user's retry instead of the retry.

## The API

`server/` is an Express 5 + MongoDB API serving the client workflows this portal uses.
It listens on **port 3005** (loopback only), and the frontend points at it through
`.env.development`:

```
REACT_APP_API_BASE_URL=http://localhost:3005/api
```

### Configuration

Copy `server/.env.example` to `server/.env` and fill it in. `server/.env` is
gitignored and is the only place credentials live — never put a MongoDB URI behind a
`REACT_APP_`/`VITE_` name, because those are compiled into the browser bundle.

| Variable | Notes |
|---|---|
| `MONGODB_URI` | Atlas `mongodb+srv://` string. The server refuses to start without it and never falls back to a local database. |
| `MONGODB_DATABASE` | Defaults to `dpa_portal`. |
| `JWT_SECRET` | 32+ characters. Changing it invalidates every session. |
| `PORT` / `HOST` | Default `3005` / `127.0.0.1`. |
| `CLIENT_ORIGINS` | CORS allowlist, comma separated. Defaults to the Vite dev origins. |
| `SMTP_*`, `MAIL_FROM` | Optional in development, **required in production**. |

Verify the connection before starting anything:

```bash
npm run db:check   # prints the database name and its collections
```

On first connect the server creates its collections, schema validators and indexes
(unique email, expiring auth challenges, per-owner record indexes) itself.

### Running without Atlas

`npm run dev:all:local` runs the API against a throwaway in-memory MongoDB, for when
you want to click through the portal without credentials. **All data is discarded when
the process exits.** This is a separately named command on purpose: `npm start` and
`npm run dev` still refuse to start without a real `MONGODB_URI`, so the server never
silently falls back to a local database.

### Email in development

Without `SMTP_HOST`, registration and reset codes are written as JSON files to
`server/.mail/` (gitignored) instead of being sent. Read the newest file there to get
the code. Production startup fails outright if SMTP is not configured.

### What the API does not do

By design, and deliberately not faked:

- **No payments.** `/payment-method/list` is empty and payment initiation returns 503
  until a real gateway is wired in. Nothing client-side can mark a transaction paid.
- **No approvals or certificates.** A client cannot approve their own application,
  issue a certificate, or set fees; those fields are server-assigned.
- **No seeded reference data.** Categories, sectors, sizes, FAQs, fees and the DPO
  directory are empty editable collections — no invented regulatory content.
- **No staff back office.** This is the client portal only.

### Tests

```bash
npm run test:api
```

Runs against a throwaway in-memory MongoDB — never your Atlas database. Covers
registration/verification, login, password reset and session revocation, cross-account
isolation, injection attempts, file ownership and payment unavailability.

## What's included

| Area | Path |
|---|---|
| Portal shell (sidebar, pill header, content) | `src/layout/front/` |
| Client pages | `src/views/front/` |
| Sign-in / password reset | `src/views/auth/` |
| Public certificate lookup | `src/views/publicView/` |
| Routes and guards | `src/routes/` |
| API layer | `src/services/` |
| Shared UI components | `src/components/` |
| Redux store, auth guard, helpers | `src/store/`, `src/guard/`, `src/lib/` |
| Design system (Liquid Glass + White themes) | `src/index.css`, `tailwind.config.js` |

Client pages cover: dashboard, DC/DP registration (multi-step form, list, replies),
data breach notification, complaint handling, payments and receipts, enquiries,
FAQs, and the user profile.

## What was removed from the original repo

- `src/views/admin/`, `src/views/admin-auth/`, `src/layout/admin/` — the admin back office
- `src/routes/adminRoutes.jsx`, `src/routes/adminProtectedRoute.jsx`
- `src/services/admin/` — except `AdminServices.js`, which the DC/DP registration form
  still uses for its assignee dropdown

Two files were edited to match:

- `src/routes/index.jsx` — no longer composes the admin route tree
- `src/routes/userProtectedRoute.jsx` — an admin session is sent to `/sign-in` instead
  of `/admin/sign-in`, which does not exist in this build

Verified with `npm run build` after the extraction: 2,745 modules, no errors.

## Theme

The portal ships two themes, both driven from CSS custom properties in `src/index.css`:

- **Liquid Glass** — translucent white panels over a blue-tinted plane
- **White** — flat white surfaces

Both are light-surfaced, so every text colour in the system is dark. The `--liquid-*`
tokens near the top of the theme block are the single place to change palette.
