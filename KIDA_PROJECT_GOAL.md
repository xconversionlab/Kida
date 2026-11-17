# Kida — Project Goal and Scope Anchor

## The goal (repeat at every work checkpoint)

**Build and finish the Kida CUSTOMER-FACING ride-booking app as a working client-approval prototype and deliver an installable Android APK. Do not start the driver's app until the customer app has been demonstrated and approved.**

This file is the scope anchor. If work starts to drift, return here. Do not reopen already-settled decisions or create another ZIP instead of improving the live repository or delivering the APK.

## Phase 1 — Customer app (current)

- Product: Kida customer ride-booking app.
- Required deliverable: installable Android APK named Kida, built from the customer app and suitable for client review/sideload testing. The current Capacitor wrapper loads the deployed customer app over HTTPS, so an internet connection is required.
- Brand: preserve the client-approved Kida logo artwork; do not redesign the symbol, road motif, typography or proportions. Use the approved yellow-and-white identity, with black only where needed for logo contrast and readable text.
- Languages exposed in the prototype: English, Hindi and Marathi.
- Booking choices: E-Bike Taxi, Auto, Mini and Sedan (retain other existing vehicle classes only if they do not distract from the requested customer journey).
- Show a distinct per-kilometre demo rate for each vehicle. Rates and promotions are sample values until the client approves the fare card.
- Customer journey: onboarding/profile, pickup and destination selection, GPS permission, vehicle selection, fare/offer review, booking confirmation, ride status/map, trip history, support and call booking.
- Call booking must work as a demonstrable flow for people in villages and customers who do not use the app. The real company booking number is not yet supplied; do not invent one or expose an empty telephone link.
- Place search should represent all 28 Indian states and 8 Union Territories, with town and village examples. The current in-app place catalogue is a prototype sample, not a claim of complete geocoding coverage. Production requires a verified India-wide geocoder/map provider and rural-address coverage.
- The map and ride movement in this prototype are illustrative/simulated. Real driver live tracking requires the later driver app, dispatch backend and location permissions.
- Show company identity and legal-information sections, but do not invent the registered office, CIN, GSTIN, support phone, support email or grievance officer. These must be supplied and verified by the client.
- Payment methods are a UI demonstration only. No real payment is processed or stored. Production requires a licensed payment gateway, secure backend, tokenisation, encryption, access controls, audit logging and a reviewed privacy/security design.
- Do not mention AI anywhere in customer-facing copy.
- Keep internal operator tools out of the customer-facing app.

## Explicitly out of scope until customer approval

**Do not build the driver's app in Phase 1.** The driver's app is Phase 2 and begins only after the customer app is shown to the client and approved.

Preserve these client requirements for Phase 2:
- Only commercially registered/eligible vehicles; no private vehicles.
- Validate commercial registration, permits, insurance, fitness/PUC, driving licence, driver badge and required identity/background checks.
- Drivers should be able to communicate in Marathi.
- Fare structure target: customer fare at least 25% below the agreed market/base fare; driver receives at least 80% of the customer fare, subject to final commercial/legal review.
- Driver duty cap: 12 consecutive hours.
- Critical-hub cancellation penalties: 5x the normal penalty, subject to final policy and legal review.
- Five-day driver induction/training before activation.
- Driver GPS, SOS/safety, trip acceptance, earnings and dispatch integration belong to Phase 2.

## Release blockers before a real public launch

1. Client approval of customer screens, vehicle classes, fare schedule and offer rules.
2. Verified registered legal name, registered office, CIN, GSTIN and grievance contact.
3. Official support/booking phone, support email and operating hours.
4. Production map/geocoding provider with India-wide and village-level coverage.
5. Backend, OTP provider, secure customer accounts, dispatch and driver tracking.
6. Licensed payment gateway and security/privacy review.
7. Operational, insurance, permits and state-by-state legal review.
8. Production signing key and release build for Play Store or wider distribution.

## Working rule

At each project checkpoint, state the goal in one line: **Customer app first; APK delivery and client approval next; driver app only after approval.** Work directly in this repository and verify each change.


## Client commercial update — 17 November 2026

- Customer rate card: E-Bike ₹15/km, Auto ₹20/km, Mini cab ₹25/km, 7-seater cab ₹30/km.
- Customer reward: after five completed paid account rides, one free ride on the next eligible cab trip strictly below 7 km. Trips at or above 7 km remain paid; the reward stays available for a later qualifying cab trip. Kida funds the Captain payout for a redeemed free ride.
- Normal completed-trip split: 80% Captain earnings and 20% Kida platform commission, included in the fare allocation rather than added as an extra 20% customer surcharge.
- Partner Phase 2: ₹200 daily bonus after 15 completed rides for Auto and cab Captains only; E-Bike Captains are excluded.
- Partner Phase 2: compulsory opening ledger balance; Captains below the configured required balance cannot accept trips. The required amount has not yet been supplied by the client and must not be guessed.
- If a customer pays the Captain directly, the company commission is debited from the Captain ledger and may be reconciled against future earnings/top-ups.
- The existing Sedan category is not shown for new bookings until its client-approved rate is supplied.
