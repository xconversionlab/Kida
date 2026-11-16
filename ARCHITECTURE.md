# Raah — prototype architecture

Raah is a client-review prototype of an India-wide mobility product: bike, auto, mini cab, sedan and 7-seater, for metros, towns and villages, including a call-centre booking desk.

This build is a responsive web app. It is not a native Android or iOS binary.

## How it is shaped

- `src/routes/` — TanStack Start shell. The product lives on `/`.
- `src/lib/raah/` — types, sample places, fares, languages, company placeholders, browser state.
- `src/components/raah/` — customer screens, schematic map, and the operator desk.
- State is Zustand, persisted in the browser only. There is no customer database and no live auth provider in this phase.
- Company CIN, GSTIN, office, phone and email are placeholders in `src/lib/raah/company.ts`, ready to be replaced by an admin-owned config.

## What is interactive

Navigation, 10 languages on the main journey, profile, saved places, India place search, vehicle choice, sample fares, promos, payments selection, booking, simulated assignment and movement, ride history, safety and SOS demo, call-to-book, location consent, and the operator desk.

## What is simulated

OTP, SMS, voice calls, driver assignment, map roads, GPS as a live trace, payments, refunds, support tickets, and emergency dispatch.

## Production still required

Maps (Google Maps Platform, Mappls, or OSM), SMS and telephony, OTP rate limits, a driver app, a staffed desk, a payment gateway with tokenization, emergency partners, admin for legal identity, and store builds. A later Android APK can wrap this web experience (for example with Capacitor) once those services exist. Do not describe the current build as an installed APK.

## Preview

The review app is the live preview. Wide screens show the customer phone and the call desk together. Narrow screens keep the desk under Account → Call-centre desk.
