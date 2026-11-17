# Kida Open Maps Migration

## Scope

This migration replaces the Google Maps Platform dependency in the Customer app's map experience with open mapping software and OpenStreetMap data. It preserves the existing Kida screens, pricing and customer database.

## Providers

| Capability | Implementation |
|---|---|
| Map renderer | Leaflet |
| Map data / raster tiles | OpenStreetMap |
| Address search and autocomplete | Photon |
| Reverse geocoding | Photon |
| Nearby named features | Overpass API |
| Road distance, route geometry and ETA | OSRM |
| Device position | Browser/Android GPS |

## Runtime configuration

Frontend build-time variables:

- VITE_KIDA_TILE_URL — tile URL template, normally ending in /{z}/{x}/{y}.png
- VITE_KIDA_PHOTON_URL — Photon service base URL
- VITE_KIDA_OVERPASS_URL — Overpass interpreter endpoint
- VITE_KIDA_OSRM_URL — OSRM service base URL
- VITE_KIDA_OSRM_PROFILE — route profile; currently defaults to driving

Server-only variable:

- KIDA_OSRM_BASE_URL — server route-distance verification endpoint; never expose this as a browser variable.

In local development only, the code falls back to public demo services so a developer can try the integration without API keys. In non-development builds the endpoints must be configured explicitly. The feature branch's Vercel preview variables are scoped to feature/open-maps; do not copy these public demo endpoints into the Production environment.

## Customer reward distance safety

The customer-facing route preview uses OSRM when available. If routing is unavailable, the UI can show a clearly labelled straight-line estimate for ordinary fare preview, but it does not apply the sixth-ride free-cab reward.

When a customer requests the reward, the authenticated server recalculates the road route from the submitted pickup, intermediate stops and dropoff using KIDA_OSRM_BASE_URL. It reserves the free reward only when the server-verified route distance is strictly less than 7 km. Missing/failed route verification fails closed; the customer is asked to retry.

The server route uses the configured OSRM profile. The current default is driving for every vehicle class. This is suitable only as a preview estimate; vehicle-specific routing (especially a true two-wheeler profile) needs a compatible routing dataset/profile before production fare use.

## Public demo service limitations

The default URLs are for local development / low-volume preview testing only:

- OpenStreetMap's standard tile servers are donation-funded, have limited capacity, require clear visible attribution and proper caching, prohibit bulk prefetch/offline tile downloads, and provide no SLA. See the OSM tile policy: https://operations.osmfoundation.org/policies/tiles/
- Photon describes its public demo as reasonable-use only and warns extensive use may be throttled or banned. See the Photon project: https://github.com/komoot/photon
- The OSRM demo server documents a one-request-per-second ceiling and says its demo service is for reasonable non-commercial use with no uptime/latency guarantees. It must not be used as Kida's commercial production routing backend. See the OSRM demo server policy: https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server
- Public Overpass servers are shared infrastructure; the OpenStreetMap wiki recommends self-hosting or a provider when the workload grows. See the Overpass API documentation: https://wiki.openstreetmap.org/wiki/Overpass_API

## Production readiness requirements

Before production launch:

1. Choose a commercial-permitted OSM tile host or self-host tiles and publish appropriate attribution.
2. Self-host Photon or select a provider with a suitable commercial agreement and rate limits.
3. Self-host Overpass or replace it with a cached/controlled nearby-feature service.
4. Self-host OSRM (or use another commercial-permitted router) on a suitable India extract; add vehicle-appropriate profiles.
5. Configure frontend VITE_KIDA_* values and server-only KIDA_OSRM_BASE_URL independently for Preview and Production.
6. Add API/service health monitoring, request throttling, retry/backoff and server-side result caching appropriate to the selected provider.
7. Field-test address and routing coverage around Coimbatore/Saravanampatti and representative village roads before using route distance for production fares.

## Not included in this migration

This change does not implement Captain live tracking, background GPS permission handling, dispatch, payments, a production map tile host, offline maps or a Play Store signing setup. The map renderer can display GPS positions, but end-to-end realtime customer/Captain tracking remains a separate feature.
