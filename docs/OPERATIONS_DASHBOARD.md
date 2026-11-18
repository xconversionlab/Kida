# Kida Operations Dashboard

## Route and access

The internal operations workspace is available at /operations.

- The route uses the existing Kida email/password account.
- Every dashboard read and review action is enforced on the server through authMiddleware and the admin entry in public.kida_user_roles.
- A Captain, customer or support-role account cannot read applicant records or submit review decisions.
- There is no default admin and no self-service role elevation.
- Do not expose an admin credential or database URL in a browser environment variable.

## Provision the first operations admin

An authorised database owner must first create the staff member's Kida account through the normal sign-in page. After the staff member has signed in once, run the following SQL from a controlled database-owner session, replacing the email with the actual staff account email:

\`\`\`sql
BEGIN;

WITH target_admin AS MATERIALIZED (
  SELECT "id"
    FROM public."user"
   WHERE lower("email") = lower('REPLACE-WITH-OPERATIONS-EMAIL')
   FOR UPDATE
)
INSERT INTO public.kida_user_roles (user_id, role, created_by)
SELECT "id", 'admin', "id"
  FROM target_admin
ON CONFLICT (user_id, role) DO NOTHING;

COMMIT;
\`\`\`

Verify that exactly the intended account has the role:

\`\`\`sql
SELECT u."id", u."name", u."email", r.role
  FROM public.kida_user_roles r
  JOIN public."user" u ON u."id" = r.user_id
 WHERE r.role = 'admin'
 ORDER BY u."email";
\`\`\`

Grant the role only to named Kida operations staff. Revoke it through a controlled database-owner session when access is no longer required. Do not promote a Captain account just to test the page.

## Application review procedure

1. Open /operations and sign in with a provisioned admin account.
2. Select a pending Captain application.
3. Compare the applicant's identity and declarations with the original documents.
4. Inspect the actual driving licence, applicable commercial permit, valid insurance, fitness/PUC and vehicle registration. Confirm the vehicle and registration match the application and local operating requirements.
5. Approve only after every original-document checkbox is confirmed. Otherwise request changes or reject and record a clear review note.
6. Avoid entering document numbers or sensitive identity details in the reviewer note. The app stores a minimal verification checklist and decision note, not images of identity documents.

## What approval does

The approval transaction atomically:
- Changes the application status to approved.
- Grants the captain role to the applicant.
- Creates or updates the approved Captain profile with is_online = false.
- Creates a zero-balance wallet if the Captain does not already have one.
- Appends an immutable row to public.kida_captain_application_reviews.

The audit table records the reviewer, previous and new status, note, six document-verification flags and timestamp. The current application row shows the latest decision. Historical decisions remain in the review table.

Rejection and change requests update the application and append an audit row but do not grant the Captain role or create an approved profile. Applicants can revise and resubmit applications marked rejected or needs_changes.

## Shared Customer and Captain trips

The Operations live-trips section reads the same `public.kida_bookings` rows used by the Customer and Captain apps. It shows active trips and recent terminal statuses, including the customer, pickup and destination, assigned Captain, vehicle registration, fare preview and latest Captain GPS fix when it is no older than 90 seconds. The view refreshes automatically every eight seconds.

Operations trip visibility is read-only. Customer booking creation, Captain acceptance and trip-state transitions remain owned by their respective authenticated server functions. The dashboard never exposes the customer trip PIN and does not move money or override the Captain eligibility gate.

The Customer app's local demo OTP is a UI-only preview sign-in; it does not create a Better Auth backend session. Saving a live booking requires a real signed-in Kida account. The public `/operations/demo` page is sample-only and is not connected to live customer or Captain records.

## Wallet and online eligibility

The dashboard displays each Captain's wallet balance, the company-required opening balance, suspension status and the result of public.kida_captain_can_accept_rides(user_id).

Approval does not:
- Set the company-required opening balance.
- Deposit or credit money.
- Unsuspend a wallet.
- Set the Captain online.
- Override the server-side/database eligibility check.

When driver_required_opening_balance_paise is NULL, no Captain can go online or accept trips. Keep it unset until Kida receives the actual approved opening-balance amount and ledger policy. Once approved, operations must configure the exact amount and separately reconcile each real opening deposit using the controlled finance process. Do not use a test value to unlock live dispatch.

## Verification and rollout

- Migration 0007 creates the append-only review history.
- npm test includes approval-check tests and the migration test exercises the review-history schema.
- The new route and server functions are included in the existing Kida app build.
- Provision the operations admin only after the updated preview has deployed, then test with a dedicated staff account.
