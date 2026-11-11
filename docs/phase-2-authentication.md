# Phase 2 — Marketplace authentication

## Implemented in this branch

- Buyer registration at `/register`
- Login at `/login`
- MongoDB `User` model with buyer as the default role
- Password hashing with Node.js scrypt and a unique random salt
- Signed, HTTP-only, SameSite=Lax session cookie
- Session lookup and logout endpoints
- Legacy student registration URL redirects to the marketplace registration page; the old API is retired
- Quality workflow also runs for pull requests targeting `main`

## Environment variables

Configure these in local development and in the deployment environment:

- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB`: database name (the app's existing connection helper defaults to `C0` if omitted)
- `SESSION_SECRET`: random secret with at least 32 characters

Generate a secret with:

```bash
openssl rand -base64 48
```

Do not commit real values or share them in chat. Add `SESSION_SECRET` to your hosting provider's environment variables before testing login.

## API endpoints

- `POST /api/auth/register` — creates a buyer account
- `POST /api/auth/login` — verifies credentials and sets the session cookie
- `GET /api/auth/session` — returns the current signed-in user
- `POST /api/auth/logout` — clears the session cookie

## Important limitations

This is the first authentication milestone, not a complete production security review. Email verification, password reset, login rate limiting, CSRF/origin hardening, seller application workflows, and protected-route enforcement remain follow-up work. Existing records in the legacy `Student` collection are not automatically migrated.
