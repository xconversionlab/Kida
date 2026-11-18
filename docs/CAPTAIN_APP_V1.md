# Kida Captain App V1

## Goal

Deliver a separate, mobile-first Captain workspace at `/captain`, connected to the same Kida customer booking records. It is not a second booking database.

## Included in this branch

- Authenticated Captain application intake.
- Kida-operations-only approval and role provisioning.
- Approved Captain profile and vehicle category.
- Availability controls with GPS permission and latest location updates.
- Customer booking queue filtered by the Captain's approved vehicle category, city, women-Captain preference and schedule window.
- Atomic single-Captain booking acceptance.
- Active-trip progression: accepted → captain arriving → arrived → in progress → completed.
- Customer four-digit trip PIN validation before a trip can start.
- Customer app status polling and assigned Captain identity / fresh GPS position.
- Captain ledger eligibility gate. The server does not permit a Captain to go online until the client-approved compulsory opening balance is configured and the Captain wallet meets it.

## Authentication and access

The customer and Captain apps use the same Kida-hosted Better Auth account with email/password sign-in and registration. The server reads the Captain's user ID from the verified session through `authMiddleware`; it does not accept a user ID supplied by the browser.

The application form does not:
- Assign the `captain` role.
- Mark the Captain as approved.
- Verify driving licence, commercial permit, insurance, fitness / PUC or identity documents.
- Mark a user as a woman Captain.

Those steps require an authorised Kida operations review and direct database provisioning. Phone OTP is not live yet.

## Provisioning workflow for Kida operations

1. The applicant creates or signs in to their Kida account and submits the application at `/captain`.
2. Kida operations obtains and checks the actual licence, commercial vehicle registration and permit, insurance, fitness / PUC and identity/background information required for the operating jurisdiction.
3. Operations verifies that the vehicle category is eligible in the intended city/state and that the applicant is permitted to drive it commercially.
4. Only after verification, an authorised database operator approves the application, grants the `captain` role and creates the approved Captain profile.

## Secure database operation

Run the following from a controlled database-owner session, never from a customer or Captain browser. Replace the bracketed placeholders with actual verified values. The applicant must have signed in at least once, so their user ID exists in Better Auth's `"user"` table.

```sql
BEGIN;

SELECT
  a.user_id,
  u.email,
  a.full_name,
  a.phone_e164,
  a.vehicle_id,
  a.registration_number,
  a.vehicle_make_model,
  a.vehicle_colour,
  a.service_city,
  a.status
FROM public.kida_captain_applications a
JOIN public."user" u ON u."id" = a.user_id
WHERE a.id = '[APPLICATION_UUID]';

UPDATE public.kida_captain_applications
SET status = 'approved',
    reviewer_note = 'Documents checked and approved by Kida operations',
    reviewed_by = '[ADMIN_USER_ID]',
    reviewed_at = now(),
    updated_at = now()
WHERE id = '[APPLICATION_UUID]'
  AND status IN ('pending_review', 'needs_changes');

INSERT INTO public.kida_user_roles (user_id, role, created_by)
VALUES ('[CAPTAIN_USER_ID]', 'captain', '[ADMIN_USER_ID]')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.kida_captain_profiles
  (captain_user_id, vehicle_id, registration_number, vehicle_make_model,
   vehicle_colour, service_city, approval_status, is_woman_captain,
   approved_by, approved_at)
SELECT
  a.user_id, a.vehicle_id, a.registration_number, a.vehicle_make_model,
  a.vehicle_colour, a.service_city, 'approved',
  false, '[ADMIN_USER_ID]', now()
FROM public.kida_captain_applications a
WHERE a.id = '[APPLICATION_UUID]'
  AND a.status = 'approved'
ON CONFLICT (captain_user_id) DO UPDATE SET
  vehicle_id = excluded.vehicle_id,
  registration_number = excluded.registration_number,
  vehicle_make_model = excluded.vehicle_make_model,
  vehicle_colour = excluded.vehicle_colour,
  service_city = excluded.service_city,
  approval_status = 'approved',
  approved_by = excluded.approved_by,
  approved_at = excluded.approved_at,
  updated_at = now();

COMMIT;
```

The example intentionally does not set `is_woman_captain = true`. Set that flag only after the company's authorised verification process and a documented policy decision. Do not infer it from a name, photo or self-declaration.

## Opening ledger requirement

The client has not provided the compulsory Captain opening balance amount. The database value `kida_platform_settings.driver_required_opening_balance_paise` remains NULL on purpose. The database function `kida_captain_can_accept_rides()` therefore returns false and the app keeps the Captain offline / unable to accept rides.

Do not guess or populate the amount. Once the client approves the exact INR amount and ledger policy, operations must:
- Set `driver_required_opening_balance_paise` to the approved amount in paise.
- Create each Captain wallet with the actual received opening amount.
- Record the opening funds with a matching `opening_balance` ledger entry and receipt / reconciliation evidence.
- Ensure the wallet balance meets the configured threshold before enabling online availability.

## Shared customer booking lifecycle

- Customer app inserts one row in `kida_bookings` with status `requested`.
- The customer app generates a four-digit trip PIN. The server stores an HMAC for verification and an AES-256-GCM encrypted copy so the booking owner can retrieve the same PIN after an app refresh. The Captain is never sent the stored PIN.
- Eligible online Captains can see unassigned requests matching their approved vehicle category and the customer preference.
- Accept is an atomic server-side update. One booking cannot be accepted by two Captains; a Captain can have at most one active trip.
- Captain trip status changes are checked in SQL against the allowed lifecycle and recorded in `kida_booking_events`.
- The server compares the entered trip PIN before allowing `in_progress`.
- Only the booking's customer can read its assigned Captain details and fresh location. The location query returns only a recent fix (last 90 seconds).
- The customer app polls account bookings while a ride is active and displays the assigned Captain and latest location.

## Current integration boundaries

Not connected in V1:
- SMS / mobile OTP authentication.
- Document uploads, KYC provider or automated verification.
- Admin approval dashboard.
- Push notifications or realtime socket delivery (the apps poll the shared API).
- Masked calls, in-app chat delivery or customer phone-number disclosure.
- Payment gateway, cash reconciliation, Captain payouts, platform commission deduction or wallet top-up.
- Automated daily bonus award after eligible trips.
- Background GPS after the app is terminated, trip replay or a guaranteed tracking SLA.
- Captain cancellation / operations re-dispatch workflow.
- Trip fare repricing. Customer fare values remain client previews until a server-side fare service exists.

The Captain app must not claim that a trip has been paid, settled or reconciled. A completed trip status currently means the Captain marked the trip complete; it does not move money.

## Environment and deployment

Required for stable account and trip security:
- Set a strong server-only `BETTER_AUTH_SECRET` and `KIDA_TRIP_PIN_SECRET` in Preview and Production.
- Keep both secrets stable across serverless instances and deployments while sessions and bookings are active.
- Never expose them using a `VITE_*` environment variable.
- If `KIDA_TRIP_PIN_SECRET` is rotated, old encrypted PINs will no longer decrypt and existing PIN-based trips may be unable to start. Plan a controlled rotation.

The application uses the existing `DATABASE_URL`, Kida-hosted Better Auth and Vercel deployment. Do not create a new database for Captains.

## Verification checklist

- A user can create a Kida account and sign in using email and password.
- Customer and Captain apps recognise the same account session.
- Applicant can submit an application but cannot self-approve.
- A user without the Captain role cannot view customer request data or call Captain trip APIs.
- A Captain without an approved profile cannot go online.
- A Captain below the compulsory wallet threshold cannot go online or accept.
- A Captain receives only matching, unassigned booking requests.
- Two Captains cannot win the same booking.
- A Captain cannot accept a second active ride.
- Invalid lifecycle transitions are rejected before the database update.
- The customer PIN is never exposed to the Captain API or stored in plaintext.
- A wrong PIN cannot start the trip.
- A customer can still see the same PIN after app refresh.
- Only the booking owner can retrieve their Captain details and location.
- Stale location fixes are not shown as live location.
