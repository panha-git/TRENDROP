# Phase 2 — Marketplace authentication

## Implemented

- Buyer registration at `/register` with input validation, normalized email addresses, duplicate detection, and password hashing with Node.js `scrypt`.
- MongoDB `User` records with a unique email, buyer role by default, and seller-application status.
- Login at `/login` with generic invalid-credential errors.
- Signed, HTTP-only session cookies backed by MongoDB session records. Cookies use `SameSite=Lax`, `Secure` in production, and a seven-day expiry.
- Server-side session lookup and logout.
- Rate limits for registration, login, and seller applications, with rate-limit keys hashed using `SESSION_SECRET`.
- Origin checks on authentication and seller-application mutations, plus request-body size limits.
- Account pages require a signed-in user. Seller dashboard and fulfillment pages require an approved seller.
- Buyer seller applications can enter `pending`; submitting an application does not grant a seller role.

## Not implemented

- Email verification and password reset.
- An administrative review/approval workflow for seller applications.
- Admin role management and admin-only pages.
- Payment, shipping, carrier, and fulfillment integrations.
- Automatic migration of records in the legacy `Student` collection.

## Environment variables

Set these in local development and in the deployment environment:

- `MONGODB_URI`: MongoDB connection string.
- `MONGODB_DB`: database name (the connection helper defaults to `C0` if omitted).
- `SESSION_SECRET`: random secret with at least 32 characters.

Generate a secret with:

```bash
openssl rand -base64 48
```

Never commit real values or expose them to client-side code.

## Production verification note

In the most recent deployed-site audit, registration and login returned HTTP 500. The unauthenticated session endpoint returned `user: null`. The deployment's root cause was not confirmed; inspect Vercel function logs and environment configuration before changing authentication code. Do not treat production registration or login as verified until retested after that investigation.
