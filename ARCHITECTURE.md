# Kida — customer prototype architecture

Kida is a client-review prototype for an India-wide mobility product: E-Bike Taxi, Auto, Mini, Sedan and 7-seater, for cities, towns and villages, including call-centre booking.

## Web experience

- `src/routes/` — TanStack Start shell. The customer product lives at `/`.
- `src/lib/raah/` — types, sample places, fares, languages, company placeholders and browser state.
- `src/components/raah/` — customer screens, schematic map and the retained operator-desk source (not exposed in the customer-facing app).
- State is Zustand, persisted in the browser only. There is no customer database and no live auth provider in this phase.
- Company CIN, GSTIN, office, phone and email are placeholders in `src/lib/raah/company.ts`, ready to be replaced by verified client-owned information.

## Android APK (current deliverable)

- `android-wrapper/` — Capacitor Android wrapper for the customer app.
- `.github/workflows/build-kida-apk.yml` — builds an installable debug APK and publishes it as the `kida-customer-debug-apk` Actions artifact.
- Android application ID: `com.xconversionlab.kida`.
- The current APK opens the deployed Kida customer experience inside Android WebView. An internet connection is required; the current build is not an offline-bundled native app.
- The debug-signed APK is intended for client preview and sideload testing. A Play Store / production release needs a separately managed signing key.

## What is interactive in the prototype

Navigation, onboarding, phone and demo OTP flow, 10 languages in the existing journey, profile, saved places, India place search, vehicle choice, sample fares, promos, payment-method selection, booking, simulated assignment and movement, ride history, safety/SOS demo, call-to-book and location consent.

## What is simulated

OTP, SMS, voice calls, driver assignment, map roads, GPS as a live trace, payments, refunds, support tickets and emergency dispatch.

## Production still required

Maps (Google Maps Platform, Mappls or OSM), SMS and telephony, OTP rate limits, a driver app, dispatch backend, staffed booking desk, a payment gateway with tokenisation, emergency partners, verified legal identity, production privacy/security review and production signing.
