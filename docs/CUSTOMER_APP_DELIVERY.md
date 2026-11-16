# Kida Customer App — Feature Delivery and Production Integration Status

This document describes the customer-facing app surface and distinguishes working client-side preview flows from services that still require a production backend or approved provider credentials.

## Customer app modules included

### Account and onboarding
- Language selection (10 existing language packs)
- Phone number entry and demo OTP journey
- Customer profile and photo
- Saved Home, Work and additional places
- Emergency contact management
- Accessibility preferences

### Everyday ride booking
- India map, pickup and destination selection
- Google Maps JavaScript / Places integration code, with the existing map fallback
- Bike, Auto, Mini, Sedan and XL vehicle choices
- Fare breakdown and promo entry
- Schedule date/time with past-time validation
- Up to three additional stops
- Request-a-woman-driver preference (preference only; it is not a matching guarantee)
- Customer-visible trip PIN in the ride preview
- Ride confirmation, ride history, ride details, cancellation, rating and receipt details

### Additional customer services
- Parcel delivery request
- Outstation / intercity request
- Hourly rental request
- Airport transfer request
- Pet-friendly ride request
- Service request details and local history

### During and after a ride
- Ride status and map screen
- Driver and vehicle presentation in the existing demo journey
- Trip PIN reminder
- Trip detail sharing using the device share sheet or clipboard fallback
- Chat composition and local message history
- Cancellation, completion preview, rating and issue/lost-item reports

### Customer account and engagement
- Payment method selection (UPI, QR, cards, netbanking and cash options)
- Offers and promo UI
- Kida Power Pass membership preview
- Kida Coins and referral/rewards preview
- Notification preference controls
- Customer support call link and local help/ticket flows
- Safety screen with direct user-initiated call to India's 112 emergency number
- Terms, privacy, refund, safety and security draft screens

## Current integration boundary

The app is still a client-side preview. The following capabilities are not live merely because the screens exist:

- SMS OTP delivery and server-side identity verification
- Google Maps address/nearby-place services until a restricted `VITE_GOOGLE_MAPS_API_KEY` is configured and APIs/billing are enabled
- Road-based routing, traffic-aware ETA and production fare calculation
- Customer booking creation on a server
- Live Captain supply, dispatch, accept/reject and GPS updates
- Driver contact masking and realtime chat
- Live trip sharing links
- UPI/card payment collection, wallet, refunds and payment ledger
- Real parcel/rental/intercity/airport/pet service dispatch
- Push/SMS notifications
- Automated SOS alerts, staffed safety desk, police/ambulance partner integrations
- Server-side support tickets, claims and customer service workflows
- Membership billing, referral attribution and rewards credits

Where the app stores preview data, it uses the existing browser persistence. Google Places content is filtered from the local persisted state in line with the Maps content handling implemented in the app. Do not treat browser-local requests as operational bookings or customer-service cases.

## Production exit criteria

Before public launch, each relevant integration must have:
1. A real provider/service endpoint and restricted credentials.
2. Authenticated, authorised server-side APIs.
3. Database records, idempotency and audit history.
4. User-visible pending, success, failure, retry and cancellation states.
5. Privacy, consent, retention and deletion behaviour.
6. Monitoring, alerting, support ownership and operational runbooks.
7. Unit, integration, device, security and failure-mode tests.
8. Legal and regulatory sign-off for every launch state and service category.

The Captain app, Admin & Operations app, dispatch backend, payments ledger and staffed safety/support operation remain separate workstreams.
