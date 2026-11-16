import { nearestPlace } from "./places";
import type { Selection } from "./types";

type Coordinate = { lat: number; lng: number };

interface GoogleLatLng {
  lat: number | (() => number);
  lng: number | (() => number);
}

interface GoogleMapInstance {
  setCenter(position: Coordinate): void;
  setZoom(zoom: number): void;
  fitBounds(bounds: GoogleBounds, padding?: number | { top: number; right: number; bottom: number; left: number }): void;
}

interface GoogleBounds {
  extend(position: Coordinate): void;
}

interface GoogleMarker {
  setMap(map: GoogleMapInstance | null): void;
  setPosition(position: Coordinate): void;
}

interface GooglePolyline {
  setMap(map: GoogleMapInstance | null): void;
}

interface GooglePlace {
  id?: string;
  displayName?: string;
  formattedAddress?: string;
  location?: GoogleLatLng | Coordinate;
  primaryType?: string;
  googleMapsURI?: string;
  fetchFields(options: { fields: string[] }): Promise<void>;
}

interface GooglePrediction {
  placePrediction?: {
    text: { toString(): string };
    toPlace(): GooglePlace;
  };
}

interface GoogleMapsLibrary {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMapInstance;
  Polyline: new (options: Record<string, unknown>) => GooglePolyline;
}

interface GoogleMarkerLibrary {
  Marker: new (options: Record<string, unknown>) => GoogleMarker;
}

interface GoogleCoreLibrary {
  LatLngBounds: new () => GoogleBounds;
}

interface GooglePlacesLibrary {
  Place: {
    searchNearby(request: Record<string, unknown>): Promise<{ places: GooglePlace[] }>;
  };
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: Record<string, unknown>): Promise<{ suggestions: GooglePrediction[] }>;
  };
  AutocompleteSessionToken: new () => object;
}

interface GoogleRouteResult {
  distanceMeters?: number;
  durationMillis?: number;
  path?: GoogleLatLng[];
}

interface GoogleRoutesLibrary {
  Route: {
    computeRoutes(request: Record<string, unknown>): Promise<{ routes?: GoogleRouteResult[] }>;
  };
}

export interface DrivingRoutePreview {
  distanceKm: number;
  durationMinutes: number;
  path: Coordinate[];
}

interface GoogleGeocodingLibrary {
  Geocoder: new () => {
    geocode(request: { location: Coordinate; language?: string; region?: string }): Promise<{
      results: Array<{
        place_id: string;
        formatted_address: string;
        geometry: { location: GoogleLatLng };
      }>;
    }>;
  };
}

interface GoogleNamespace {
  maps: {
    importLibrary(name: string): Promise<unknown>;
  };
}

declare global {
  interface Window {
    google?: GoogleNamespace;
    __kidaGoogleMapsReady?: () => void;
  }
}

export interface GoogleMapsBundle {
  maps: GoogleMapsLibrary;
  marker: GoogleMarkerLibrary;
  core: GoogleCoreLibrary;
  places: GooglePlacesLibrary;
  geocoding: GoogleGeocodingLibrary;
  routes: GoogleRoutesLibrary;
}

export interface GooglePlaceOption {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type?: string;
  mapsUrl?: string;
  place: GooglePlace;
}

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";
export const hasGoogleMapsKey = GOOGLE_MAPS_KEY.trim().length > 0;

let mapsPromise: Promise<GoogleMapsBundle> | null = null;

export function loadGoogleMaps(): Promise<GoogleMapsBundle> {
  if (!hasGoogleMapsKey) {
    return Promise.reject(new Error("Google Maps is not configured. Add VITE_GOOGLE_MAPS_API_KEY."));
  }

  if (!mapsPromise) {
    mapsPromise = new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Google Maps is only available in the browser."));
        return;
      }

      if (window.google?.maps?.importLibrary) {
        resolve();
        return;
      }

      const callback = "__kidaGoogleMapsReady";
      window.__kidaGoogleMapsReady = () => resolve();
      const script = document.createElement("script");
      const params = new URLSearchParams({
        key: GOOGLE_MAPS_KEY,
        v: "weekly",
        loading: "async",
        callback,
      });
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.onerror = () => reject(new Error("Google Maps could not be loaded. Check the API key and enabled APIs."));
      document.head.appendChild(script);
    }).then(async () => {
      if (!window.google?.maps?.importLibrary) throw new Error("Google Maps did not initialise.");
      const [maps, marker, core, places, geocoding, routes] = await Promise.all([
        window.google.maps.importLibrary("maps"),
        window.google.maps.importLibrary("marker"),
        window.google.maps.importLibrary("core"),
        window.google.maps.importLibrary("places"),
        window.google.maps.importLibrary("geocoding"),
        window.google.maps.importLibrary("routes"),
      ]);
      return {
        maps: maps as GoogleMapsLibrary,
        marker: marker as GoogleMarkerLibrary,
        core: core as GoogleCoreLibrary,
        places: places as GooglePlacesLibrary,
        geocoding: geocoding as GoogleGeocodingLibrary,
        routes: routes as GoogleRoutesLibrary,
      };
    }).catch((error: unknown) => {
      mapsPromise = null;
      throw error;
    });
  }

  return mapsPromise;
}

function readPoint(point: GoogleLatLng | Coordinate | undefined): Coordinate | null {
  if (!point) return null;
  const lat = typeof point.lat === "function" ? point.lat() : point.lat;
  const lng = typeof point.lng === "function" ? point.lng() : point.lng;
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

export function createGoogleSessionToken(bundle: GoogleMapsBundle) {
  return new bundle.places.AutocompleteSessionToken();
}

export async function getGooglePredictions(
  input: string,
  center: Coordinate | null,
  sessionToken: object,
  language = "en",
): Promise<Array<{ id: string; description: string; place: GooglePlace }>> {
  const bundle = await loadGoogleMaps();
  const request: Record<string, unknown> = {
    input,
    includedRegionCodes: ["in"],
    region: "in",
    language,
    sessionToken,
  };
  if (center) {
    request.origin = center;
    request.locationBias = { center, radius: 12000 };
  }
  const response = await bundle.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
  return (response.suggestions ?? []).flatMap((suggestion) => {
    const prediction = suggestion.placePrediction;
    if (!prediction) return [];
    return [{
      id: `prediction-${prediction.text.toString()}`,
      description: prediction.text.toString(),
      place: prediction.toPlace(),
    }];
  });
}

export async function getGooglePlaceOption(place: GooglePlace): Promise<GooglePlaceOption> {
  await place.fetchFields({
    fields: ["id", "displayName", "formattedAddress", "location", "primaryType", "googleMapsURI"],
  });
  const point = readPoint(place.location);
  if (!point) throw new Error("Google did not return a usable location for this place.");
  return {
    id: place.id ?? `point-${point.lat.toFixed(6)}-${point.lng.toFixed(6)}`,
    name: place.displayName ?? place.formattedAddress ?? "Selected place",
    address: place.formattedAddress ?? place.displayName ?? "Address unavailable",
    lat: point.lat,
    lng: point.lng,
    type: place.primaryType,
    mapsUrl: place.googleMapsURI,
    place,
  };
}

export async function reverseGeocodeGoogle(
  point: Coordinate,
  language = "en",
): Promise<GooglePlaceOption> {
  const bundle = await loadGoogleMaps();
  const geocoder = new bundle.geocoding.Geocoder();
  const response = await geocoder.geocode({ location: point, language, region: "IN" });
  const result = response.results[0];
  if (!result) throw new Error("Google could not identify an address at this location.");
  return {
    id: result.place_id,
    name: result.formatted_address.split(",")[0] ?? "Current location",
    address: result.formatted_address,
    lat: point.lat,
    lng: point.lng,
    place: {
      id: result.place_id,
      displayName: result.formatted_address.split(",")[0],
      formattedAddress: result.formatted_address,
      location: point,
      fetchFields: async () => undefined,
    },
  };
}

export async function getNearbyGooglePlaces(
  center: Coordinate,
  maxResults = 15,
): Promise<GooglePlaceOption[]> {
  const bundle = await loadGoogleMaps();
  const response = await bundle.places.Place.searchNearby({
    fields: ["id", "displayName", "formattedAddress", "location", "primaryType", "googleMapsURI"],
    locationRestriction: {
      center,
      radius: 7000,
    },
    includedPrimaryTypes: [
      "tourist_attraction",
      "shopping_mall",
      "hospital",
      "bus_station",
      "train_station",
      "subway_station",
      "airport",
      "educational_institution",
      "primary_school",
      "secondary_school",
      "restaurant",
      "park",
      "hindu_temple",
      "church",
      "mosque",
      "art_museum",
      "history_museum",
      "market",
    ],
    maxResultCount: Math.min(20, Math.max(1, maxResults)),
    rankPreference: "DISTANCE",
  });

  return (response.places ?? []).flatMap((place) => {
    const point = readPoint(place.location);
    if (!point || !place.id) return [];
    return [{
      id: place.id,
      name: place.displayName ?? "Nearby place",
      address: place.formattedAddress ?? "",
      lat: point.lat,
      lng: point.lng,
      type: place.primaryType,
      mapsUrl: place.googleMapsURI,
      place,
    }];
  });
}


/**
 * Fetches a road route and traffic-aware ETA for the customer fare preview.
 * This requires Routes API access on the restricted Google Maps browser key.
 * The caller must show a straight-line preview state when this cannot run.
 */
const drivingRouteCache = new Map<string, { expiresAt: number; request: Promise<DrivingRoutePreview> }>();

export async function getGoogleDrivingRoute(
  points: Coordinate[],
  vehicle: "bike" | "auto" | "mini" | "sedan" | "xl",
): Promise<DrivingRoutePreview> {
  if (points.length < 2) throw new Error("A pickup and destination are required.");
  const cacheKey = `${vehicle}:${points.map((point) => `${point.lat.toFixed(6)},${point.lng.toFixed(6)}`).join("|")}`;
  const cached = drivingRouteCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.request;
  const request = (async () => {
  const bundle = await loadGoogleMaps();
  const request: Record<string, unknown> = {
    origin: points[0],
    destination: points[points.length - 1],
    travelMode: vehicle === "bike" ? "TWO_WHEELER" : "DRIVING",
    routingPreference: "TRAFFIC_AWARE",
    departureTime: new Date(),
    region: "IN",
    fields: ["distanceMeters", "durationMillis", "path"],
  };
  if (points.length > 2) {
    request.intermediates = points.slice(1, -1).map((location) => ({ location, via: false }));
  }
  const response = await bundle.routes.Route.computeRoutes(request);
  const route = response.routes?.[0];
  if (!route?.distanceMeters || !route.durationMillis) {
    throw new Error("Google could not calculate a road route for these locations.");
  }
  const path = (route.path ?? []).map(readPoint).filter((point): point is Coordinate => point !== null);
  return {
    distanceKm: Math.round((route.distanceMeters / 1000) * 10) / 10,
    durationMinutes: Math.max(1, Math.ceil(route.durationMillis / 60000)),
    path,
  };
  })();
  drivingRouteCache.set(cacheKey, { expiresAt: Date.now() + 3 * 60 * 1000, request });
  try {
    return await request;
  } catch (error) {
    drivingRouteCache.delete(cacheKey);
    throw error;
  }
}

export function googleOptionToSelection(option: GooglePlaceOption): Selection {
  const nearest = nearestPlace(option.lat, option.lng);
  return {
    placeId: nearest.id,
    landmarkId: `google:${option.id}`,
    label: option.name,
    line: option.address,
    lat: option.lat,
    lng: option.lng,
    source: "google",
  };
}
