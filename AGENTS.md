# Kida project guide

Kida is a mobility application with a customer experience and a separate Captain workspace.

## Stack

- TanStack Start and React
- TypeScript and Tailwind CSS
- Better Auth for Kida email/password accounts
- PostgreSQL in deployment and PGlite for local development
- Capacitor Android wrappers in `android-wrapper/` and `android-captain-wrapper/`

## Security rules

- Authenticate server functions with `authMiddleware`.
- Derive the account ID from the verified server session. Never trust an account ID sent by the browser.
- Scope every per-user database query to the authenticated account.
- Captain role assignment and approval are operations-only. A Captain application must never approve itself.
- Keep `BETTER_AUTH_SECRET` and `KIDA_TRIP_PIN_SECRET` server-only and stable across production instances.
- Never store customer trip PINs in plaintext or expose the stored PIN to Captain endpoints.

## Development commands

- `npm run dev` — start the development server on port 8080.
- `npm test` — run unit and migration tests.
- `npm run typecheck` — typecheck the application.
- `npm run build` — build the app and apply pending migrations.

## Database changes

- Add new ordered SQL migrations under `migrations/`.
- Do not rewrite an already-applied migration. Add a forward migration for schema changes.
- Keep migration tests in sync with schema changes.

## Release boundaries

- Customer and Captain mobile wrappers load the deployed Kida web experience and require internet access.
- Debug APKs are for internal testing only. A Play Store release needs a separately managed signing key.
- Do not claim that payments, phone OTP, push notifications, background GPS, or financial settlement are live until their integrations are implemented and tested.
