# Kida — customer prototype architecture

Kida is a client-review prototype for an India-wide mobility product: E-Bike Taxi, Auto, Mini, Sedan and 7-seater, for cities, towns and villages, including call-centre booking.

## Web experience

- `src/routes/` — TanStack Start shell. The customer product lives at `/`.
- `src/lib/raah/` — types, sample places, fares, languages, company placeholders and browser state.
- `src/components/raah/` — customer screens, schematic map and the retained operator-desk source (not exposed in the customer-facing app).
- The Customer screens still use Zustand for transient UI and demo-only data, but authenticated account bookings and support tickets are read from the server after the Better Auth session resolves.
- Better Auth is available at `/api/auth/*`, with account sign-in at `/login`. Customer booking creation, booking history, cancellation, profile save, support ticket submission and SOS incident recording call authenticated server functions in `src/lib/kida/server.ts`.
- Neon Postgres is used when the deployment supplies `DATABASE_URL`; PGlite remains the in-memory preview fallback. Schema lives in ordered `migrations/*.sql` files.
- Backend-owned booking and ticket rows are not written into browser localStorage; they are loaded for the current signed-in account.
- Existing Better Auth sign-in is Google/X. The customer phone/OTP UI still uses the demonstration code and is not a real login method; a production phone OTP provider is still required before phone-based launch.
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
