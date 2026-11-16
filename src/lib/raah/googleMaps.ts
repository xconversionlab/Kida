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
      const [maps, marker, core, places, geocoding] = await Promise.all([
        window.google.maps.importLibrary("maps"),
        window.google.maps.importLibrary("marker"),
        window.google.maps.importLibrary("core"),
        window.google.maps.importLibrary("places"),
        window.google.maps.importLibrary("geocoding"),
      ]);
      return {
        maps: maps as GoogleMapsLibrary,
        marker: marker as GoogleMarkerLibrary,
        core: core as GoogleCoreLibrary,
        places: places as GooglePlacesLibrary,
        geocoding: geocoding as GoogleGeocodingLibrary,
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
