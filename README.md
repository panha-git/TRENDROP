# TRENDROP

TRENDROP is a responsive multi-vendor marketplace prototype built with Next.js, React, TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Screens

- `/` — marketplace discovery and trending drops
- `/products/aeroglow` — AeroGlow product detail and checkout preview
- `/cart` — shopping cart
- `/orders` — buyer orders and delivery tracking
- `/account` — buyer profile and account settings
- `/seller/onboarding` — seller identity and onboarding flow
- `/seller/dashboard` — seller overview and inventory
- `/seller/fulfillment` — seller orders and dispatch

Product, seller, and order content is currently sample UI data. Cart updates are kept in browser storage; checkout and payment actions are previews and do not place real orders.

## MongoDB

The existing MongoDB connection and registration APIs remain available. Add your connection details to `.env.local` (do not commit it):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/
MONGODB_DB=C0
```

The registration form is available at `/signupform` and uses the `/api/registrations` endpoint. Passwords are stored as salted hashes. The registration list endpoint currently has no authentication; add access controls before using it with real personal data.

## Checks

```bash
npm run lint
npm run build
```
