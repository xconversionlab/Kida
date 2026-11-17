import { nearestPlace } from "./places";
import type { Selection } from "./types";
import { parseOsrmRouteResponse, type OsrmRoadRoute } from "../kida/osrm-route";

type Coordinate = { lat: number; lng: number };

export interface OsmPlaceOption {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type?: string;
}

export type DrivingRoutePreview = OsrmRoadRoute;

interface PhotonFeature {
  type?: string;
  geometry?: { type?: string; coordinates?: unknown };
  properties?: Record<string, unknown>;
}

interface PhotonResponse {
  features?: PhotonFeature[];
}

interface OverpassElement {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

const PHOTON_BASE = (import.meta.env.VITE_KIDA_PHOTON_URL as string | undefined) || (import.meta.env.DEV ? "https://photon.komoot.io" : "");
const OVERPASS_URL = (import.meta.env.VITE_KIDA_OVERPASS_URL as string | undefined) || (import.meta.env.DEV ? "https://overpass-api.de/api/interpreter" : "");
const OSRM_BASE = (import.meta.env.VITE_KIDA_OSRM_URL as string | undefined) || (import.meta.env.DEV ? "https://router.project-osrm.org" : "");
const OSRM_PROFILE = (import.meta.env.VITE_KIDA_OSRM_PROFILE as string | undefined) || "driving";
const REQUEST_TIMEOUT_MS = 10000;

const searchCache = new Map<string, { expiresAt: number; values: OsmPlaceOption[] }>();
const nearbyCache = new Map<string, { expiresAt: number; values: OsmPlaceOption[] }>();
const routeCache = new Map<string, { expiresAt: number; value: Promise<DrivingRoutePreview> }>();

function withTimeout(signal?: AbortSignal, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    },
  };
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const timed = withTimeout(signal);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: timed.signal,
    });
    if (!response.ok) throw new Error(`Map service returned HTTP ${response.status}.`);
    return await response.json() as T;
  } finally {
    timed.cleanup();
  }
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function featureToOption(feature: PhotonFeature): OsmPlaceOption | null {
  const coordinates = feature.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  const properties = feature.properties ?? {};
  const name = clean(properties.name) || clean(properties.street) ||
    clean(properties.suburb) || clean(properties.locality) || clean(properties.city) || "Selected location";
  const street = [clean(properties.housenumber), clean(properties.street)].filter(Boolean).join(" ");
  const locality = [
    street,
    clean(properties.suburb),
    clean(properties.district),
    clean(properties.city),
    clean(properties.state),
    clean(properties.country),
  ].filter(Boolean);
  const address = [...new Set(locality)].join(", ") || name;
  const id = [
    clean(properties.osm_type) || clean(properties.type) || "osm",
    clean(properties.osm_id) || `${lat.toFixed(6)}-${lng.toFixed(6)}`,
  ].join(":");

  return {
    id,
    name,
    address,
    lat,
    lng,
    type: clean(properties.osm_value) || clean(properties.type) || undefined,
  };
}

function languageForPhoton(language: string): string {
  const supported = new Set(["en", "de", "fr", "it", "es", "ru", "zh", "ja", "ta"]);
  return supported.has(language) ? language : "en";
}

export async function searchOsmPlaces(
  query: string,
  center: Coordinate | null,
  language = "en",
  signal?: AbortSignal,
): Promise<OsmPlaceOption[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];
  if (!PHOTON_BASE) throw new Error("Photon is not configured for this environment.");
  const cacheKey = `${trimmed.toLowerCase()}:${center ? `${center.lat.toFixed(3)},${center.lng.toFixed(3)}` : "india"}:${language}`;
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.values;

  const url = new URL("/api/", PHOTON_BASE);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("limit", "10");
  url.searchParams.set("lang", languageForPhoton(language));
  if (center) {
    url.searchParams.set("lat", String(center.lat));
    url.searchParams.set("lon", String(center.lng));
    url.searchParams.set("zoom", "16");
  }
  const response = await getJson<PhotonResponse>(url.toString(), signal);
  const values = (response.features ?? [])
    .map(featureToOption)
    .filter((value): value is OsmPlaceOption => value !== null);
  searchCache.set(cacheKey, { expiresAt: Date.now() + 60_000, values });
  return values;
}

export async function reverseGeocodeOsm(
  point: Coordinate,
  language = "en",
  signal?: AbortSignal,
): Promise<OsmPlaceOption> {
  if (!PHOTON_BASE) throw new Error("Photon is not configured for this environment.");
  const url = new URL("/reverse", PHOTON_BASE);
  url.searchParams.set("lat", String(point.lat));
  url.searchParams.set("lon", String(point.lng));
  url.searchParams.set("lang", languageForPhoton(language));
  const response = await getJson<PhotonResponse>(url.toString(), signal);
  const option = (response.features ?? []).map(featureToOption).find(Boolean);
  if (!option) throw new Error("OpenStreetMap could not find an address at this location.");
  return { ...option, lat: point.lat, lng: point.lng };
}

function distanceKm(a: Coordinate, b: Coordinate): number {
  const radians = (value: number) => (value * Math.PI) / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function overpassOption(element: OverpassElement): OsmPlaceOption | null {
  const tags = element.tags ?? {};
  const name = clean(tags.name);
  const lat = Number(element.lat ?? element.center?.lat);
  const lng = Number(element.lon ?? element.center?.lon);
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const category = tags.amenity || tags.shop || tags.tourism || tags.leisure ||
    tags.public_transport || tags.railway || tags.healthcare || tags.office || tags.highway || "place";
  const address = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:state"],
  ].filter(Boolean).join(", ") || name;
  return {
    id: `osm-${element.type ?? "feature"}-${element.id ?? `${lat.toFixed(6)}-${lng.toFixed(6)}`}`,
    name,
    address,
    lat,
    lng,
    type: category,
  };
}

export async function getNearbyOsmPlaces(
  center: Coordinate,
  maxResults = 15,
  signal?: AbortSignal,
): Promise<OsmPlaceOption[]> {
  const cacheKey = `${center.lat.toFixed(3)},${center.lng.toFixed(3)}`;
  const cached = nearbyCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.values;

  if (!OVERPASS_URL) throw new Error("Overpass is not configured for this environment.");
  const radiusMeters = 7000;
  const query = `[out:json][timeout:10];(nwr(around:${radiusMeters},${center.lat},${center.lng})[name];);out center tags 100;`;
  const timed = withTimeout(signal, 12000);
  try {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", Accept: "application/json" },
      body: new URLSearchParams({ data: query }),
      signal: timed.signal,
    });
    if (!response.ok) throw new Error(`Nearby-place service returned HTTP ${response.status}.`);
    const data = await response.json() as OverpassResponse;
    const values = (data.elements ?? [])
      .map(overpassOption)
      .filter((value): value is OsmPlaceOption => value !== null)
      .map((value) => ({ value, distance: distanceKm(center, value) }))
      .filter((entry) => entry.distance <= radiusMeters / 1000)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, Math.min(30, Math.max(1, maxResults)))
      .map((entry) => entry.value);
    nearbyCache.set(cacheKey, { expiresAt: Date.now() + 5 * 60_000, values });
    return values;
  } finally {
    timed.cleanup();
  }
}

export async function getOsmDrivingRoute(
  points: Coordinate[],
  _vehicle: "bike" | "auto" | "mini" | "sedan" | "xl",
): Promise<DrivingRoutePreview> {
  if (points.length < 2) throw new Error("A pickup and destination are required.");
  if (!OSRM_BASE) throw new Error("OSRM is not configured for this environment.");
  const cacheKey = `${OSRM_PROFILE}:${points.map((point) => `${point.lat.toFixed(6)},${point.lng.toFixed(6)}`).join("|")}`;
  const cached = routeCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const coordinatePath = points.map((point) => `${point.lng},${point.lat}`).join(";");
  const url = `${OSRM_BASE.replace(/\/$/, "")}/route/v1/${encodeURIComponent(OSRM_PROFILE)}/${coordinatePath}?overview=full&geometries=geojson&steps=false`;
  const request = getJson<unknown>(url).then(parseOsrmRouteResponse);
  routeCache.set(cacheKey, { expiresAt: Date.now() + 2 * 60_000, value: request });
  try {
    return await request;
  } catch (error) {
    routeCache.delete(cacheKey);
    throw error;
  }
}

export function osmOptionToSelection(option: OsmPlaceOption): Selection {
  const nearest = nearestPlace(option.lat, option.lng);
  return {
    placeId: nearest.id,
    landmarkId: `osm:${option.id}`,
    label: option.name,
    line: option.address,
    lat: option.lat,
    lng: option.lng,
    source: "osm",
  };
}
