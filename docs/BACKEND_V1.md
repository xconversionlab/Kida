# Kida Backend V1

## Purpose

This branch adds the first account-backed backend foundation to the existing Kida customer prototype. It does not replace the current customer experience and does not start the Captain app.

The backend uses the repository's existing server-only PostgreSQL layer:
- Neon Postgres when the deployment provides `DATABASE_URL`.
- PGlite for local/live-preview development without `DATABASE_URL`.
- Ordered SQL migrations in `migrations/*.sql`.
- Migration `0004_client_commercial_rules.sql` adds the client-approved fare/reward settings, booking reward markers, Captain wallet/ledger tables, trip financial allocations, daily bonus award records and a fail-closed Captain ledger-balance gate.

## Included

### Identity and access

- Better Auth is enabled at `/api/auth/*`.
- A Kida account sign-in page is available at `/login`.
- The Customer app uses the signed-in Better Auth session before creating server-backed bookings or saving support/safety reports.
- This repository's existing identity integration supports Google and X. Email/password remains disabled.
- Every data endpoint below uses `authMiddleware`; the user ID comes from the verified session, never from a client argument.
- Newly created identities receive a least-privilege `customer` role and a Kida profile. Elevated roles are not assignable through customer endpoints.

**Important:** The current Kida phone screen and OTP `482913` remain a local demonstration flow. The repository's existing Better Auth integration does not support phone/SMS OTP. A production customer mobile-login journey still requires selecting and integrating a suitable OTP identity provider. No phone number is marked verified by these endpoints.

### Customer profile

- Read the signed-in user's profile.
- The Customer profile screen reads and saves the display name, preferred language and an E.164-formatted contact number.
- Changing the contact number clears any prior verification timestamp. No API in V1 can set `phone_verified_at`.
- The profile save explicitly tells the customer that this does not verify their phone number.

### Customer booking records

- The Customer confirmation screen creates a backend booking request with an idempotency key after the account session is verified.
- Vehicle, payment-method preference, woman-Captain preference, pickup, dropoff, up to three stops, optional schedule and an explicitly untrusted fare preview are stored.
- Customer app sync loads the account-owned booking list into History and the booking detail screen.
- Backend-owned bookings are excluded from browser localStorage and fetched again only for the current signed-in account.
- The Customer can cancel a backend booking only while it is `requested` or `searching`; the server checks ownership and status.
- Creation and initial audit event are written together in one SQL statement.
- Repeating the same client request ID returns the existing booking rather than making a duplicate.
- Backend requests appear as requests saved to the account; they do not trigger the local simulated Captain-matching sequence.
- Client-approved preview rates: E-Bike ₹15/km, Auto ₹20/km, Mini cab ₹25/km and 7-seater cab ₹30/km. Sedan is hidden from new bookings until its rate is approved.
- The customer reward requires five completed paid account rides, then one free cab ride strictly below 7 km. A ride of 7 km or more is paid. Kida funds the Captain payout for a redeemed free ride.
- Normal completed-trip allocation is 80% Captain / 20% Kida, as a split of the fare and not an additional customer charge.

Booking lifecycle:

`requested → searching → accepted → captain_arriving → arrived → in_progress → completed`

Alternative terminal outcomes are `cancelled`, `expired` and `no_captain`. The pure transition guard lives in `src/lib/kida/booking-state.ts`.

### Support and safety intake

- The Customer support/claims form saves support tickets for the signed-in user, optionally linked to that user's booking.
- The ride detail issue/lost-item report forms save account-backed support tickets.
- The SOS confirmation screen can record a safety incident against the user's own booking or without a booking association.
- Support tickets are refreshed into the account's customer UI when its session is loaded.

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

1. The app's local OTP screen still accepts the demonstration code `482913`. It does not create a Better Auth account and must not be treated as phone authentication. The connected backend booking path requires a real Google/X Better Auth session. A production phone/SMS OTP provider still needs to be selected and integrated.
2. No Captain app, KYC approval, online availability, matching/dispatch, driver location stream, trip PIN verification or staffed operator console is connected. Backend booking requests currently stop at `requested`; they do not notify or match a Captain.
3. The Customer app now displays the client's supplied preview rates (E-Bike ₹15/km, Auto ₹20/km, Mini ₹25/km and 7-seater ₹30/km; Sedan hidden until priced). The stored fare remains a client preview, not a server-verified road quote or final settlement amount.
4. The selected payment method is stored as a preference only. No payment gateway or live settlement is active. Migration 0004 adds the Captain ledger and financial-allocation schema, but actual commission deductions, direct-cash reconciliation, company-funded free-ride payouts, wallet top-ups and daily bonus credits are not yet connected to a Partner/dispatch application.
5. Support and SOS incident submissions are stored for the signed-in account but have no staffed responder or emergency-service integration. The customer must still call 112 directly when emergency help is needed.
6. The Android app is still a web-backed preview shell; the backend endpoints are deployed with the server application only after the feature is merged and its production database/auth environment is provisioned.
7. City/vehicle operating eligibility, permits, insurance, state-by-state rules and launch approvals still need formal configuration and review. Do not enable a vehicle category for public trips until its legal and operational approvals are confirmed.
8. The deployment must have its server database and Better Auth provider configuration provisioned. Do not expose `DATABASE_URL`, Better Auth secrets or any server secret in browser environment variables.
9. The client's compulsory opening ledger amount has not been supplied. The platform setting is deliberately NULL; Captain ride acceptance must remain blocked until an administrator configures the exact approved amount.
10. The client-approved ₹200 daily bonus after 15 completed rides for Auto and cab Captains is represented in the schema only. E-Bike Captains are excluded. A server-side daily award transaction and Captain app are still required before credits can be issued.

## Key source files

- `migrations/0001_auth.sql` — generated Better Auth schema, copied unchanged from the repository's auth migration.
- `migrations/0002_kida_core.sql` — Kida profiles, roles, bookings, events, support and safety tables.
- `migrations/0003_customer_booking_preferences.sql` — payment preference and woman-Captain request flags.
- `migrations/0004_client_commercial_rules.sql` — client commercial settings, customer reward booking markers, Captain wallet/ledger, financial allocation and daily bonus award schema. The opening ledger threshold remains unset until the client supplies it.
- `src/lib/kida/customer-sync.ts` — session-scoped loading and mapping of account-owned bookings and tickets into Customer UI state.
- `src/components/raah/book.tsx` — authenticated booking request creation.
- `src/components/raah/more.tsx` — profile save, support ticket and SOS incident submission.
- `src/components/raah/ride.tsx` — booking history, cancellation and booking-linked support reports.
- `src/lib/kida/server.ts` — authenticated server functions.
- `src/lib/kida/booking-state.ts` — booking transition rules.
- `src/lib/kida/booking-state.test.ts` — booking transition tests.
- `src/routes/api/auth/$.ts` — Better Auth API route.
- `src/routes/login.tsx` — Kida account sign-in page.

## Verification

The booking transition tests are included in the repository's `npm test` script. The normal project typecheck and production build remain required before merging this branch. A passing build alone does not certify OTP, dispatch, payments, safety response or the full customer booking journey.
