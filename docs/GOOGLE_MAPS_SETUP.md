# Google Maps setup for Kida

Kida uses the Google Maps JavaScript API for its live map when a key is configured. The same browser session uses Places Autocomplete (New), Nearby Search (New), and reverse geocoding to resolve the rider's current GPS position into a pickup address.

## 1. Enable Google Maps Platform APIs

In the Google Cloud project that will own Kida's Maps usage, enable:

- Maps JavaScript API
- Places API (New)
- Geocoding API

Attach a billing account to the project. Google Maps Platform usage is metered; set billing alerts and API quotas before launch.

## 2. Create a restricted browser key

Create an API key and set:

- Application restriction: **Websites**
- API restrictions: **Maps JavaScript API**, **Places API (New)**, and **Geocoding API**

Restrict website referrers to the actual Kida deployment domains. For the current Vercel deployment, allow the exact Kida customer prototype domain and any approved production domain. Avoid an unrestricted key or a wildcard covering every Vercel project.

The key is intentionally used in the browser, so it is visible in the built JavaScript. Security comes from strict website-referrer and API restrictions, not from treating this key as a server secret.

## 3. Add the key to Vercel

In the Vercel project **kida-customer-prototype**, add this environment variable to Preview and Production:

```text
VITE_GOOGLE_MAPS_API_KEY=YOUR_RESTRICTED_BROWSER_KEY
```

Redeploy the customer-app branch after adding the variable. For local development, place the same variable in an ignored `.env.local` file.

## 4. What Kida activates

- Opening Pickup requests device location and reverse-geocodes the coordinates into a full address.
- Pickup search offers India-restricted Google place/address predictions.
- Opening Drop searches for nearby major destinations around the selected pickup (7 km radius).
- Drop search suggestions are biased toward the pickup location.
- The map switches to Google Maps whenever the Google key is available, so Google Places content is not plotted on a non-Google map.

Google Places results are kept in runtime state and excluded from Kida's local persisted prototype state. The app should also keep Google's map attribution visible and publish Terms of Use and a Privacy Policy incorporating the applicable Google Maps terms before public launch.

## 5. Fallback

Without the key, Kida keeps the existing India map and built-in sample locations. Google address lookup and nearby place search show as unavailable instead of pretending that live Google results are being returned.
