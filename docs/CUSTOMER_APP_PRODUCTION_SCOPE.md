# Kida Customer App — complete product scope

This document records the customer-facing scope implemented in the Kida client app, and distinguishes interactive prototype behaviour from services that must be connected before a real public launch.

## Customer journeys and screens

### 1. Install, onboarding and account
- Kida welcome and onboarding.
- Ten Indian-language choices: English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati and Punjabi.
- Indian mobile number input and six-digit demo OTP flow.
- Customer name and photo, settings, logout and local data deletion.
- Saved Home, Work and additional places.
- Up to three saved emergency contacts.

**Status:** UI and local state are implemented. The OTP is a fixed demonstration code, 482913, and the account is not verified against an authentication service. It is not production authentication.

### 2. Home and location selection
- India-wide interactive map with zoom and pan.
- Pickup and destination selection.
- GPS permission flow and address lookup integration.
- Google Places search and nearby landmarks, biased around the pickup point.
- Local sample-place and manual-search fallback.
- Call-to-book information.

**Status:** Map and GPS UI are implemented. Google Maps, Places and Geocoding calls require a restricted Google key. No key is currently configured in the Kida Vercel project.

### 3. Everyday ride booking
- Bike, Auto, Mini, Sedan and XL.
- Pickup, destination and up to three additional stops.
- Fare breakdown, sample promotions and payment-method selection.
- Immediate and scheduled bookings.
- Women-driver preference request.
- Review and confirm screen.
- Four-digit trip PIN shown to the customer.
- Booking history, scheduled-ride list and receipts.

**Status:** The interaction flow and state model work locally. The driver list, matching, booking confirmation, PIN issuance/validation and trip progress are simulated. Pricing currently uses sample per-kilometre rules unless the Google Routes integration is configured. Even with Routes enabled, the tariff, taxes, tolls, wait charges and final payable price still need a Kida server-side pricing policy.

### 4. Additional services
- Parcel delivery, with recipient details and item category.
- Outstation and intercity request.
- Hourly rental request.
- Airport transfer request.
- Pet-friendly ride request.
- Metro and transit ticket request.
- Auto Share / group-ride request with passenger count and a split-fare preference.

**Status:** Forms and local request history are implemented. They save a request preview on the device; no driver, courier, transit ticket, shared seat or rental is dispatched or sold.

### 5. Active ride and post-ride
- Driver/vehicle information layout.
- Pickup and destination map, stop markers and route preview.
- Trip PIN reminder.
- Call, message, share-trip and SOS entry points.
- Cancellation-reason selector.
- Ride completion, rating and feedback.
- Optional tip selection.
- Ride history, receipt, lost-item and issue-report forms.

**Status:** Driver identity, responses, trip movement, PIN and completion are simulated. Share-trip shares trip details; it is not a live tracking URL. Tip selection is a preview and does not charge or transfer money. Driver call masking, chat delivery and complaint submission need backend integrations.

### 6. Safety, support and account
- Safety centre and emergency contacts.
- Direct India emergency call link to 112.
- Kida support call link.
- Trip-detail sharing.
- Help FAQs, support ticket and claim/lost-item forms.
- Notification preference controls.
- Kida Power Pass membership information.
- Rewards, coins and referral invitation UI.
- Payment-method selection, settings, legal and company information.

**Status:** Preferences, contacts and tickets are stored locally. Push/SMS/WhatsApp notifications, payments, refunds, membership purchases, rewards credits, referral attribution and staffed support are not connected. Calling 112 opens the device dialer; Kida does not dispatch an emergency response team.

## Production integrations required

| System | Required before real launch |
|---|---|
| Authentication | OTP provider, verified sessions, account recovery and abuse controls |
| Customer backend | Persistent server-side customer, ride, preference and consent records |
| Captain platform | Captain application, identity/KYC, vehicle and permit verification |
| Dispatch | Supply/availability, matching, timeouts, reassignments and cancellation state machine |
| Location | Authenticated Captain GPS updates, realtime delivery and background-location handling |
| Maps | Restricted Google Maps key, Places, Geocoding and Routes API; city and rural address testing |
| Pricing | Server-side city/category tariffs, state rules, taxes, tolls, waiting, promotions and fare audit |
| Payments | UPI/card gateway checkout, cash reconciliation, refunds, receipts and double-entry ledger |
| Safety | Staffed response desk, escalation protocols, incident records, emergency contacts and tested drills |
| Communications | Push/SMS, masked calling, in-app message delivery and delivery receipts |
| Support | Staff console, ticket ownership, SLA, refunds and complaint audit |
| Compliance | Aggregator licensing, city/state vehicle eligibility, insurance, grievance and privacy controls |

## Launch guardrails

- Keep prototype/demo indicators until the relevant integration is proven.
- Do not represent a preview service request as a confirmed booking.
- Do not show simulated captains as real partners.
- Do not represent a straight-line distance as a road route or a sample rate as a final fare.
- Keep state/city/category eligibility server-configurable; do not globally enable bike taxi without confirmed local authorisation.
- Never advertise automated SOS response, live tracking, payment protection, insurance or 24/7 support until the actual operation and provider are active and tested.
- Keep Google Maps browser keys restricted by exact website referrers and API allowlist. Monitor billing and quotas.
