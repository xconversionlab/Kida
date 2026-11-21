# Kida Client Requirements V2

## 1. Purpose and source

This document captures the additional requirements supplied in the client's WhatsApp screenshots. It translates those instructions into a shared product and developer specification for the Kida Customer app, Captain app and Kida Operations dashboard.

The examples shown by the client (₹50, ₹100, ₹150, ₹2,000, ₹5,000, 15/20 rides, 5%/10%, and office hours) are examples only. They are not approved production values and must remain configurable until the client confirms them.

## 2. Product-wide requirements

### 2.1 Languages

The product must operate in:
- English
- Hindi
- Marathi

The language choice must apply consistently to the Customer app, Captain app, notifications, safety instructions, support and key booking/payment states. Translations of legal, fare and safety information must be reviewed before release.

**Current implementation:** The Customer experience has a 10-language catalogue including English, Hindi and Marathi. The Captain workspace is currently English-only. This requirement is therefore only partially met.

### 2.2 Driver identity shown to customers

During an assigned ride, the Customer app must display the verified Captain's photograph and the relevant driver/vehicle identity details.

The photograph must come from the approved Captain profile, not a sample avatar or unverified upload. Operations must be able to reject or replace an unsuitable image.

**Current implementation:** The tracking screen displays a generic avatar generated from the Captain's name. A verified Captain photograph is not yet part of the approved profile flow.

### 2.3 Live trip sharing and tracking

The Customer app must:
- Show the assigned Captain's current location and trip progress during an active trip.
- Allow the customer to share a live trip link with a trusted contact.
- Keep location visibility limited to the trip and authorised viewers.
- Clearly show when a location update is stale or unavailable.

**Current implementation:** The Captain app sends GPS fixes while online, and the authenticated Customer booking view can receive the assigned Captain's recent location. The Operations dashboard also displays a fresh GPS fix. The Customer share action currently shares trip details; a secure external live-tracking link is still required. Background GPS and delivery guarantees are not yet implemented.

### 2.4 Accessibility

Provide accessibility features suitable for people with disabilities in both apps. The release criteria must include:
- Screen-reader labels and meaningful control names.
- Usable text resizing and readable contrast.
- Keyboard and switch-access operation for supported controls.
- Clear focus indication and touch targets.
- Reduced-motion support and alternatives to colour-only status communication.
- Accessible error messages, maps, forms, trip status and SOS flows.

Test with assistive technologies and document issues before release. These are proposed acceptance criteria to operationalise the client's accessibility requirement.

**Current implementation:** No dedicated accessibility audit or completed accessibility acceptance test is documented. Existing semantic labels are not evidence of end-to-end accessibility compliance.

### 2.5 Driver licence identifier

Display the driver's ULIN (as named in the client instruction: “Unique Licence Identification Number”) in the appropriate verified driver identity view, subject to confirming the exact identifier, issuing authority, format and disclosure rules with the client.

Do not invent or derive a ULIN. Store and display it only after an authorised verification process.

**Current implementation:** The Captain profile and application do not currently capture or display a ULIN.

### 2.6 24x7 grievance redressal

Provide an always-available grievance route from both apps, with:
- A clearly visible call/contact option and digital complaint submission.
- Case reference, category, timestamp and status.
- Ownership, escalation and resolution history for Operations.
- Published response and resolution commitments.
- An escalation path for urgent safety complaints.

A form that merely stores a ticket is not a 24x7 staffed grievance mechanism. A real support operation, contact channel, rota and escalation process must be active before this claim is made.

**Current implementation:** Customers can save support/lost-item reports to their account. The app explicitly does not notify a support agent, and no staffed 24x7 case-management operation is connected.

## 3. Customer app requirements

### 3.1 Masked calling

Mask the Captain's personal phone number when a customer calls, and mask the customer's number when the Captain calls. Use a contracted telephony/masking provider and expire the relay after the trip or the approved support window.

**Current implementation:** The call-to-Captain control is disabled and identifies a masked-call provider as a pending dependency.

### 3.2 Live tracking

Show the assigned Captain's live location to the customer during the ride, with freshness indicators and clear recovery behaviour when GPS is unavailable.

**Current implementation:** Recent Captain GPS is connected to authenticated active-booking views. The current experience is polling-based and depends on foreground/browser location permissions; reliable background tracking and external live sharing remain open.

### 3.3 Routing

Use road-route distance and duration for the route preview and fare calculation. Make any approximate/straight-line fallback explicit. Do not use an approximate route to approve a distance-restricted promotion.

**Current implementation:** The OpenStreetMap/OSRM preview route has been added. Public demonstration services are not suitable as the commercial production routing backend. Vehicle-specific routing, including an appropriate E-Bike profile, remains to be validated.

### 3.4 Modify a ride during travel

Allow the customer to request one or more additional stops or change the destination during an active trip. The system must:
- Send the requested change to the assigned Captain.
- Require the Captain's acceptance where appropriate.
- Recalculate the road route and fare server-side.
- Show the revised route, fare difference and customer confirmation before the change takes effect.
- Record an auditable trip event and notify both parties.
- Prevent changes after trip completion or cancellation.

**Current implementation:** Customers can select stops before booking. Mid-trip stop/destination changes and server-authoritative fare recalculation are not implemented.

### 3.5 Lost property and support

Keep a lost-item/report option inside the Customer app, with a direct support contact option and a case reference. The case must reach an operational support queue.

**Current implementation:** Lost-item and issue forms can create account-backed support-ticket records. No support-agent notification or staffed resolution workflow is connected.

### 3.6 Women customer's safety preference

Retain the option to request a woman Captain. Dispatch must not assign a Captain who does not meet the verified preference. If no eligible Captain is available, tell the customer and allow them to wait or choose another option; do not silently assign a different Captain.

**Current implementation:** The booking preference is passed to dispatch, which filters for an operations-verified woman Captain. Availability and supply in each operating city still need operational validation.

## 4. Captain app requirements

### 4.1 Captain verification and profile

The Captain onboarding and Operations review must cover:
- Identity verification.
- Driving licence verification and validity/expiry.
- Commercial permit verification and validity/expiry.
- Vehicle registration and vehicle details.
- Insurance validity.
- Fitness and PUC validity, where applicable.
- ULIN capture and verification, after the client confirms its meaning.
- UPI identity/account verification before payouts are enabled.
- Verified Captain photograph.

Record reviewer, verification status, expiry date, evidence reference and audit history. Provide expiry reminders and automatically suspend or restrict eligibility when a mandatory document expires, according to the approved policy.

**Current implementation:** The onboarding and Operations review have a manual document checklist for identity, driving licence, commercial permit, insurance, fitness/PUC and vehicle registration. This records review flags, not uploaded evidence, document numbers, expiry dates, ULIN or UPI verification.

### 4.2 Working-time limit

Implement the client's stated eight-hour working-time requirement. The client must confirm whether this means eight hours online, eight hours of active driving, or eight hours of paid/working duty, and whether breaks or split shifts are permitted.

The server must enforce the agreed limit across devices and sessions; a client-side timer alone is insufficient.

**Current implementation:** No eight-hour shift or working-time enforcement is documented.

### 4.3 Captain rating and dispatch

Use the Captain's rating as one input to ride allocation, while preserving eligibility, vehicle match, service area, availability, freshness of GPS and customer safety preferences. Document the ranking policy and guard against rating manipulation or unfair exclusion.

**Current implementation:** Dispatch currently matches by approved status, online state, vehicle category, service area/radius, recent GPS, women's preference and one-active-trip rules. Rating is not part of a documented dispatch ranking algorithm.

### 4.4 Captain SOS

Provide a prominent Captain SOS flow for the Captain's own safety and vehicle/passenger safety. The flow must capture the active trip and location, contact the designated response operation and provide a clear acknowledgement and fallback emergency action.

**Current implementation:** A Customer-side SOS entry point exists, but it does not dispatch an emergency response. A dedicated Captain SOS workflow and staffed response integration are not documented.

### 4.5 Payout choices

Support the client's requested payment schedules, described in the source as “weekly payment option 3 days option”. Confirm whether the intended choices are weekly and every three days, or weekly with a three-day alternative. Show the next payout date, eligible balance, deductions, statement and payment status.

**Current implementation:** Wallet and ledger schema foundations exist. Actual UPI verification, payout execution, reconciliation and payout scheduling are not live.

### 4.6 Captain subscription plan

Provide an optional subscription plan under which an eligible Captain receives the full applicable trip fare from the company, according to a client-approved subscription price, billing period, eligibility and settlement policy.

The plan must clearly explain how it changes the existing commission model, how free/promotional rides are funded, what happens on failed subscription payment, and whether taxes or other deductions apply.

**Current implementation:** The current documented standard allocation is 80% Captain share and 20% Kida commission. No subscription product or subscription-based 100% payout rule is implemented. Do not activate this until the commercial terms are approved.

### 4.7 Cancellation charges

Implement a policy for customer-initiated and Captain-initiated cancellation. The policy must define:
- When a cancellation fee applies.
- Fee by trip stage and cancellation reason.
- Exceptions (for example, safety issues, no-show, invalid pickup, provider failure).
- Whether the fee is charged to the customer or debited from Captain earnings.
- Dispute, refund and audit handling.

Show the applicable charge before confirmation whenever possible. Do not charge automatically until the client approves the matrix.

**Current implementation:** The backend records cancellation reasons and supports limited pre-acceptance customer cancellation. Cancellation charges, Captain penalties and dispute/refund handling are not implemented.

## 5. Fare policy and competitor positioning

The client's instruction is that fares in both the Customer and Captain apps should be lower than Uber and Rapido.

The fare policy must:
- Use a client-approved tariff by city, service/vehicle category and applicable trip conditions.
- Compare like-for-like journeys against Uber and Rapido for the same pickup, destination, time, vehicle class and included charges.
- Keep the displayed customer fare and the Captain's trip/fare information consistent.
- Show fare changes caused by extra stops or destination changes before confirmation.
- Keep platform commission separate from the customer tariff; do not add an unapproved surcharge.
- Retain a dated record of tariff changes and the basis for the “lower fare” claim.

A fixed rate per kilometre does not by itself prove that the final payable price is lower than competitor prices, because base/minimum fares, booking fees, taxes, waiting, tolls and dynamic pricing may differ. Do not publish a guaranteed lower-than-Uber/Rapido claim until a client-approved comparison method and representative city/route tests support it.

**Current implementation:** The current customer rate card is:
- E-Bike: ₹15/km
- Auto: ₹20/km
- Mini cab: ₹25/km
- 7-seater cab: ₹30/km

Sedan remains hidden from new bookings because its rate has not been approved. No competitor price feed or documented route-by-route benchmark is implemented. The stated rates must not be described as independently verified lower than Uber or Rapido.

## 6. Launching offers and promotions

Build an Operations-controlled campaign configuration so the client can launch, pause and evaluate offers without changing application code. Campaign settings must be auditable and enforced by the server, not only by the Customer UI.

### 6.1 Minimum ride amount and offer cap

Each campaign must support:
- Minimum completed-ride fare required for eligibility.
- A maximum free-ride/discount value.
- For a capped free ride, the company-funded portion is limited to the configured cap and the customer pays any excess amount.

The client gave ₹50/₹100 minimums and ₹100/₹150 caps as examples only. Do not set these as defaults without approval.

### 6.2 Offer frequency and budget

Support a selectable campaign eligibility model:
- One qualifying reward after every configured N completed rides (examples supplied: every 15 or 20 rides); or
- A configured probability/percentage of eligible completed rides (examples supplied: 5% or 10%).

Support a daily or weekly maximum campaign spend. When the approved budget is exhausted, stop issuing new rewards for that budget period and record the reason. Do not revoke a reward already validly reserved or earned unless the approved offer terms explicitly allow it.

The client gave ₹2,000 and ₹5,000 as illustrative daily budgets only.

### 6.3 New-user and office-ride eligibility

Support campaign rules for:
- First completed ride or second completed ride.
- Verified account/mobile number and anti-abuse controls to prevent repeated claims through duplicate accounts/devices, subject to privacy and platform policy.
- Office commute offers using configured time windows and approved pickup/drop-off geofences or locations.

The client supplied 8:00–11:00 AM and 5:00–8:30 PM as examples, not approved operating windows.

### 6.4 Completion and Captain payout

Award an offer only after the qualifying trip is marked completed and validated. Cancelled, abandoned, expired or otherwise ineligible trips must not trigger a reward.

For a company-funded free/discounted ride, the Captain must receive the full approved Captain payout. The campaign subsidy must be recorded against the company's promotion/marketing budget and must not reduce Captain earnings or create a customer-facing Captain payment shortfall.

### 6.5 Operations dashboard and reporting

The dashboard must allow authorised staff to create/configure, preview, activate, pause and close campaigns. It must report:
- Number of free rides issued and completed today.
- Total company spend attributable to the offer.
- Campaign use by area and time/peak-hour window.
- Booking volume before and after a ratio/frequency change.
- Budget used, remaining budget and automatic stop events.
- Reward eligibility, redemption, cancellation and payout audit.

Report definitions and comparison periods must be consistent so campaign performance can be evaluated.

**Current implementation:** The Customer app currently has a fixed sixth-ride reward: after five completed paid rides, the next eligible cab ride under 7 km is free. The reward is account-backed and the company-funded Captain allocation is represented in the fare-allocation helper. This is not yet the configurable campaign engine described above. The Operations dashboard does not currently manage promotion rules or display the requested campaign performance reports.

## 7. Compliance and security requirements supplied by the client

The client has named:
- “PCIDSS” (confirm whether the intended standard is PCI DSS and determine the applicable scope with the payment provider/compliance adviser).
- RBI guidelines.
- Cybersecurity standard compliance and certification by a CERT-In empanelled firm.
- Privacy and safety requirements associated with masked calling, live location and customer/driver identity.

Treat these as formal release workstreams. The application code alone cannot confer certification or prove compliance. Confirm applicability, system scope, evidence, audit frequency, responsible entity and required controls with the client and qualified compliance/security professionals. Arrange the required independent assessment and retain its report before making a certification claim.

Production release must also have an incident-response plan, access controls, audit logs, secret management, backups/recovery, vulnerability remediation and a documented privacy/retention policy for location, call and identity data.

**Current implementation:** Authentication, user-scoped server functions, audit events and some security controls exist. Payment collection is not live, no PCI DSS/RBI compliance assessment is evidenced, and no CERT-In empanelled-firm certification is evidenced.

## 8. Existing Kida baseline that must be preserved or explicitly revised

The current development branch documents these client-approved commercial rules:
- Standard fare allocation: 80% Captain / 20% Kida.
- A company-funded sixth-ride reward after five completed paid rides, for eligible cab rides strictly below 7 km.
- A ₹200 daily bonus after 15 completed rides for Auto and cab Captains, excluding E-Bike Captains.
- The compulsory Captain opening ledger balance remains unset because the client has not supplied the amount; Captain acceptance remains blocked until it is configured.

The new subscription and campaign requirements may change or extend these rules. Do not silently overwrite the existing rules. Obtain explicit client approval for any revised commission, bonus, reward, opening-balance or payout terms.

## 9. Open client decisions required before production configuration

1. Confirm the meaning, issuing authority and display rules for ULIN.
2. Confirm whether UPI verification means verifying a UPI ID, bank account ownership, or both, and select a verification/payment provider.
3. Define the eight-hour working-time calculation, breaks, split shifts and enforcement action.
4. Approve the Captain rating weighting and dispatch fairness policy.
5. Define the Captain SOS and 24x7 grievance contact centre, escalation roster and response targets.
6. Confirm masked-calling and live-share provider/retention requirements.
7. Approve the mid-trip stop/destination-change workflow and fare-recalculation rules.
8. Confirm payout schedule wording: weekly and every three days, or another arrangement.
9. Approve subscription price, period, entitlement and how it replaces/changes the 20% commission.
10. Approve the customer/Captain cancellation fee matrix and exceptions.
11. For each promotional campaign, approve minimum fare, offer type, cap, Nth-ride/probability model, budget, target audience, validity and office geofences/time windows.
12. Approve whether the existing sixth-ride and ₹200/15-trip Captain bonus rules continue alongside the new configurable campaigns.
13. Approve the city/category tariff matrix and a like-for-like Uber/Rapido comparison methodology.
14. Confirm the compliance scope, audit firm and evidence required for PCI DSS, RBI-related requirements and CERT-In assessment.
15. Approve the accessibility target and translation review owner for English, Hindi and Marathi.

The earlier client-provided compulsory Captain opening ledger amount is also still outstanding.

## 10. Delivery sequence and release gates

### Phase A — product rules and foundations
- Resolve the open commercial and policy decisions.
- Create server-authoritative fare, campaign, support and Captain compliance data models.
- Add translation coverage for the Captain workspace.
- Add verified Captain photograph and licence identifier fields with privacy-aware access controls.

### Phase B — customer and Captain operations
- Implement masked calls, customer live-trip sharing, in-app tracking improvements and mid-trip changes.
- Implement document expiry and UPI verification workflow, eight-hour work rules, rating-aware dispatch and Captain SOS.
- Implement payout schedules, subscriptions and cancellation charges after approval.

### Phase C — campaigns and operations
- Add campaign configuration, budget enforcement, automated eligibility and full Captain payout accounting.
- Add the requested campaign reports and operational grievance case management.

### Phase D — release assurance
- Complete accessibility and security testing.
- Complete independent compliance assessments and remediate findings.
- Validate real provider integrations, GPS behaviour, payment/payout reconciliation and city-specific tariffs.
- Run end-to-end operational drills before public rollout.

## 11. Current release statement

The current `feature/captain-app` branch is a working development/preview build, not a production ride-hailing launch. Existing screens, server functions and schema foundations must not be described as live payments, verified UPI, masked calling, 24x7 support, certified compliance, guaranteed live trip sharing, automated Captain payouts or completed accessibility compliance until those capabilities are integrated, tested and operational.
