# Kida Backend V1

## Purpose

This branch adds the first account-backed backend foundation to the existing Kida customer prototype. It does not replace the current customer experience and does not start the Captain app.

The backend uses the repository's existing server-only PostgreSQL layer:
- Neon Postgres when the deployment provides `DATABASE_URL`.
- PGlite for local/live-preview development without `DATABASE_URL`.
- Ordered SQL migrations in `migrations/*.sql`.

## Included

### Identity and access

- Better Auth is enabled at `/api/auth/*`.
- A Kida account sign-in page is available at `/login`.
- This repository's existing identity integration supports Google and X. Email/password remains disabled.
- Every data endpoint below uses `authMiddleware`; the user ID comes from the verified session, never from a client argument.
- Newly created identities receive a least-privilege `customer` role and a Kida profile. Elevated roles are not assignable through customer endpoints.

**Important:** The current Kida phone screen and OTP `482913` remain a local demonstration flow. The repository's existing Better Auth integration does not support phone/SMS OTP. A production customer mobile-login journey still requires selecting and integrating a suitable OTP identity provider. No phone number is marked verified by these endpoints.

### Customer profile

- Read the signed-in user's profile.
- Update display name, preferred language and an E.164-formatted contact number.
- Changing the contact number clears any prior verification timestamp. No API in V1 can set `phone_verified_at`.

### Customer booking records

- Create a booking request with an idempotency key.
- Retrieve a customer's own booking list and individual booking.
- Retrieve the chronological event history for an owned booking.
- Cancel a booking only while it is `requested` or `searching`.
- Creation and initial audit event are written together in one SQL statement.
- Repeating the same client request ID returns the existing booking rather than making a duplicate.

Booking lifecycle:

`requested → searching → accepted → captain_arriving → arrived → in_progress → completed`

Alternative terminal outcomes are `cancelled`, `expired` and `no_captain`. The pure transition guard lives in `src/lib/kida/booking-state.ts`.

### Support and safety intake

- Create and list support tickets for the signed-in user.
- Record safety incident reports against the user's own booking or without a booking association.

These APIs store records only. They do **not** dispatch a Captain, call emergency services, send an SOS, contact a staffed operations centre, issue a refund or notify a support agent.

## Data handling

- All customer records are scoped by the verified account ID on every read and write.
- Customer identity/profile and booking ownership are separate from client-supplied IDs.
- Google Places selections are stored as provider + place ID only; Google-provided place names, addresses, coordinates and route geometry are not copied into booking JSON.
- For non-Google selections, the submitted pickup/drop address and coordinates are saved as booking details because they are necessary to describe the requested trip.
- The client fare is stored only in `client_fare_preview`. It is untrusted display metadata, not a server quote, charge amount or settlement instruction.
- Booking events are append-only through the current customer API. No customer-facing endpoint can alter a historical event or assign Captain/admin/support roles.

## What is not live yet

This is a backend foundation, not a production ride-hailing launch.

1. The Customer app has not yet been switched from its local Zustand booking store to these endpoints.
2. The phone OTP screen still accepts the demo code `482913`; choose and integrate a production OTP identity provider before using phone numbers as account identity.
3. No Captain app, KYC approval, online availability, matching/dispatch, driver location stream, trip PIN verification or staffed operator console is connected.
4. Fare rates in the Customer app are sample values. No server-approved city/vehicle rate card or final fare calculation is active.
5. No payment gateway, wallet, payouts, refunds or financial ledger is active.
6. Support and safety submissions are persisted but have no staffed responder or emergency-service integration.
7. City/vehicle operating eligibility, permits, insurance, state-by-state rules and launch approvals still need formal configuration and review. Do not enable a vehicle category for public trips until its legal and operational approvals are confirmed.
8. The deployment must have its server database and Better Auth provider configuration provisioned. Do not expose `DATABASE_URL`, Better Auth secrets or any server secret in browser environment variables.

## Key source files

- `migrations/0001_auth.sql` — generated Better Auth schema, copied unchanged from the repository's auth migration.
- `migrations/0002_kida_core.sql` — Kida profiles, roles, bookings, events, support and safety tables.
- `src/lib/kida/server.ts` — authenticated server functions.
- `src/lib/kida/booking-state.ts` — booking transition rules.
- `src/lib/kida/booking-state.test.ts` — booking transition tests.
- `src/routes/api/auth/$.ts` — Better Auth API route.
- `src/routes/login.tsx` — Kida account sign-in page.

## Verification

The booking transition tests are included in the repository's `npm test` script. The normal project typecheck and production build remain required before merging this branch. A passing build alone does not certify OTP, dispatch, payments, safety response or the full customer booking journey.
