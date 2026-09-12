# DPA portal backend and Atlas database

The user authorized building the missing database/backend for the existing portal and using their Atlas cluster. Add an Express API under `server/`, listening on loopback port 3003. Use the official MongoDB Node driver with database `dpa_portal`. The frontend retains its existing HTTP API URL. Never expose MongoDB credentials through Vite environment prefixes.

## Data and interfaces

Collections: users, auth_challenges, controllers, breaches, complaints, support_tickets, ticket_messages, form_replies, transactions, categories, sizes, sectors, faqs, settings, staff_directory, certificates, and GridFS attachments. Validate requests before storage and create unique email, owner/date, and expiring challenge indexes. Preserve the existing response envelopes (`data`, paginated `data.data`/`data.total`, and login `token`). Documents expose MongoDB `_id` plus an `id` alias.

Passwords use salted scrypt. JWTs expire and carry the portal's `type: user` claim. Registration requires a one-time email code. Reset codes are bounded, expire, and are exchanged for a single-use reset token; password reset invalidates earlier sessions. All record, message, profile and file routes enforce ownership. Client fields cannot assign owners, approval status, fees, roles, or payment success. Public lookup only exposes explicitly published certificate fields; breach and complaint records are private.

Application forms save drafts using their existing step counter. No client can approve an application, issue a certificate, or mark a transaction paid. Payment methods remain empty and payment initiation returns a clear unavailable response until a real gateway is configured. No invented regulatory fees, official categories, certificates, or staff are seeded. Reference data is stored in editable collections; starter categories/sectors are clearly documented as local configuration, if added.

## Operation

`server/.env` holds Atlas URI, JWT secret, allowed origins and optional SMTP settings and is ignored. The server refuses to start without a configured database/secret; it never silently falls back to a local database. A local development outbox stores verification emails under ignored `server/.mail/`; production requires SMTP. Uploaded files are limited to 10 MB, stored in GridFS and retrieved only by their owner. File URLs retain the existing bearer-query compatibility, with no URL request logging.

## Verification and limits

Use an isolated temporary MongoDB instance exclusively for automated tests, never as the application's runtime database. Exercise register/verify/login/reset, persistence, ownership isolation, invalid IDs, injection/privilege attempts, file access, pagination, unavailable payments and frontend error handling. Confirm Atlas with ping and collection initialization when the exact connection string is available. Browser-check the real portal flow and record any external block honestly. The new backend provides client workflows, not the removed staff back office or a payment processor.

References: [MongoDB connections](https://www.mongodb.com/docs/drivers/node/current/connect/connection-targets/), [Express async error handling](https://expressjs.com/en/5x/guide/error-handling/).
