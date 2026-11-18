# Kida — customer and Captain architecture

Kida is a mobility product for E-Bike Taxi, Auto, Mini, Sedan and 7-seater journeys across cities, towns and villages, including call-centre booking.

## Web experience

- `src/routes/` — TanStack Start application. The customer product lives at `/`; the separate Captain workspace lives at `/captain`.
- `src/lib/raah/` — customer types, sample places, fares, languages, company placeholders and browser state.
- `src/components/raah/` — customer screens, schematic map and operator-desk components.
- Customer screens use Zustand for transient UI and demo-only data. Authenticated bookings and support tickets are loaded from the server for the signed-in Kida account.
- Better Auth is hosted by Kida at `/api/auth/*`. Customers and Captains use the same email/password account at `/login`; Captain permissions are checked separately by the server.
- Neon Postgres is used when the deployment supplies `DATABASE_URL`; PGlite remains the local development fallback. Schema lives in ordered `migrations/*.sql` files.
- Backend-owned booking, trip and ticket rows are not written into browser localStorage; they are scoped to the authenticated account.
- The customer phone/OTP journey still uses a demonstration code and is not a real phone authentication method. A production phone OTP provider is still required before phone-based launch.
- Company CIN, GSTIN, office, phone and email are placeholders in `src/lib/raah/company.ts`, ready to be replaced by verified client-owned information.

## Android APK

- `android-wrapper/` — Capacitor Android wrapper for the customer app.
- `.github/workflows/build-kida-apk.yml` — builds a debug APK for client preview and sideload testing.
- Android application ID: `com.xconversionlab.kida`.
- The APK opens the deployed Kida customer experience inside Android WebView. An internet connection is required.
- A Play Store / production release needs a separately managed signing key.

## Prototype and production boundaries

The prototype includes the customer journey, vehicle selection, sample fares, booking, map presentation, ride history and safety/SOS demonstration. SMS, phone OTP, voice calls, payments, refunds, emergency dispatch and some location/dispatch behaviour still require production integrations and operational processes.
