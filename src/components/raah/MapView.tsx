import { useEffect, useRef, useState } from "react";
import { LocateFixed } from "lucide-react";
import { getPlace } from "@/lib/raah/places";
import type { Selection } from "@/lib/raah/types";

type Coordinate = [number, number];
type MapPoint = { lat: number; lng: number };

interface LeafletLayer {
  addTo(map: LeafletMap): this;
  remove(): this;
}

interface LeafletMarker extends LeafletLayer {
  setLatLng(position: Coordinate): this;
}

interface LeafletMap {
  setView(position: Coordinate, zoom?: number, options?: Record<string, unknown>): this;
  fitBounds(bounds: Coordinate[], options?: Record<string, unknown>): this;
  getZoom(): number;
  invalidateSize(): this;
  remove(): void;
}

interface LeafletApi {
  map(element: HTMLElement, options?: Record<string, unknown>): LeafletMap;
  tileLayer(url: string, options?: Record<string, unknown>): LeafletLayer;
  circleMarker(position: Coordinate, options?: Record<string, unknown>): LeafletMarker;
  polyline(points: Coordinate[], options?: Record<string, unknown>): LeafletLayer;
}

declare global {
  interface Window {
    L?: LeafletApi;
  }
}

let leafletPromise: Promise<LeafletApi> | null = null;

function loadLeaflet(): Promise<LeafletApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Maps are available in the browser only."));
  }
  if (window.L) return Promise.resolve(window.L);

  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      stylesheet.dataset.kidaLeaflet = "true";
      document.head.appendChild(stylesheet);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.dataset.kidaLeaflet = "true";
      script.onload = () => {
        if (window.L) resolve(window.L);
        else reject(new Error("The map library loaded without its API."));
      };
      script.onerror = () => reject(new Error("The map library could not be loaded."));
      document.head.appendChild(script);
    }).catch((error: unknown) => {
      leafletPromise = null;
      throw error;
    });
  }

  return leafletPromise;
}

const TILE_URL = (import.meta.env.VITE_KIDA_TILE_URL as string | undefined) ||
  (import.meta.env.DEV ? "https://tile.openstreetmap.org/{z}/{x}/{y}.png" : "");

export function MapView({
  pickup,
  drop,
  stops = [],
  routePath,
  caption,
  className = "h-64",
}: {
  pickup?: Selection | null;
  drop?: Selection | null;
  stops?: Selection[];
  routePath?: MapPoint[];
  caption?: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const pickupLayerRef = useRef<LeafletLayer | null>(null);
  const dropLayerRef = useRef<LeafletLayer | null>(null);
  const stopLayersRef = useRef<LeafletLayer[]>([]);
  const routeLayerRef = useRef<LeafletLayer | null>(null);
  const userMarkerRef = useRef<LeafletMarker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");
  const [gpsState, setGpsState] = useState<"off" | "locating" | "live" | "error">("off");

  const place = getPlace(pickup?.placeId ?? drop?.placeId ?? "");

  useEffect(() => {
    let cancelled = false;
    let createdMap: LeafletMap | null = null;
    let resizeObserver: ResizeObserver | null = null;

    loadLeaflet()
      .then((L) => {
        const element = hostRef.current;
        if (cancelled || !element) return;
        if (!TILE_URL) throw new Error("A map tile provider must be configured for this environment.");

        createdMap = L.map(element, {
          center: [22.9734, 78.6569],
          zoom: 5,
          minZoom: 4,
          maxZoom: 19,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: true,
        });

        L.tileLayer(TILE_URL, {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
        }).addTo(createdMap);

        mapRef.current = createdMap;
        setMapReady(true);
        window.setTimeout(() => createdMap?.invalidateSize(), 120);

        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => createdMap?.invalidateSize());
          resizeObserver.observe(element);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setMapError(error instanceof Error ? error.message : "The OpenStreetMap map could not be loaded.");
      });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      createdMap?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!mapReady || !map || !L) return;

    pickupLayerRef.current?.remove();
    dropLayerRef.current?.remove();
    stopLayersRef.current.forEach((layer) => layer.remove());
    routeLayerRef.current?.remove();
    pickupLayerRef.current = null;
    dropLayerRef.current = null;
    stopLayersRef.current = [];
    routeLayerRef.current = null;

    const from: Coordinate | null = pickup ? [pickup.lat, pickup.lng] : null;
    const to: Coordinate | null = drop ? [drop.lat, drop.lng] : null;

    stops.forEach((stop) => {
      stopLayersRef.current.push(L.circleMarker([stop.lat, stop.lng], {
        radius: 6,
        color: "#ffffff",
        weight: 2,
        fillColor: "#2878E5",
        fillOpacity: 1,
      }).addTo(map));
    });

    if (from) {
      pickupLayerRef.current = L.circleMarker(from, {
        radius: 8,
        color: "#171717",
        weight: 3,
        fillColor: "#F5C518",
        fillOpacity: 1,
      }).addTo(map);
    }

    if (to) {
      dropLayerRef.current = L.circleMarker(to, {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#171717",
        fillOpacity: 1,
      }).addTo(map);
    }

    const routeCoordinates: Coordinate[] = routePath?.length
      ? routePath.map((point) => [point.lat, point.lng])
      : from && to ? [from, to] : [];

    if (routeCoordinates.length > 1) {
      routeLayerRef.current = L.polyline(routeCoordinates, {
        color: "#D6A900",
        weight: 4,
        opacity: 0.92,
        lineCap: "round",
      }).addTo(map);
      map.fitBounds(routeCoordinates, { padding: [44, 44], maxZoom: 15 });
    } else if (from || to) {
      map.setView(from ?? to!, 14, { animate: true });
    } else {
      map.setView([22.9734, 78.6569], 5);
    }
  }, [
    mapReady,
    pickup?.lat,
    pickup?.lng,
    drop?.lat,
    drop?.lng,
    stops.map((point) => `${point.lat},${point.lng}`).join(";"),
    routePath?.map((point) => `${point.lat},${point.lng}`).join(";"),
  ]);

  function toggleGps() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      setGpsState("off");
      return;
    }

    if (!navigator.geolocation) {
      setGpsState("error");
      return;
    }

    setGpsState("locating");
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location: Coordinate = [position.coords.latitude, position.coords.longitude];
        const map = mapRef.current;
        const L = window.L;
        if (!map || !L) return;

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(location);
        } else {
          userMarkerRef.current = L.circleMarker(location, {
            radius: 8,
            color: "#ffffff",
            weight: 3,
            fillColor: "#2878E5",
            fillOpacity: 1,
          }).addTo(map);
        }

        map.setView(location, Math.max(map.getZoom(), 15), { animate: true });
        setGpsState("live");
      },
      () => {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        setGpsState("error");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
  }

  return (
    <div className={`kida-map-view kida-live-map relative isolate overflow-hidden rounded-3xl ${className}`}>
      <div ref={hostRef} className="absolute inset-0 z-0 bg-[#e9eee8]" aria-label="OpenStreetMap map of India" />
      <div className="pointer-events-none absolute left-3 top-3 z-[1000] flex max-w-[68%] items-center gap-2 rounded-full border border-black/5 bg-white/95 px-3 py-2 text-xs font-semibold text-ink shadow-sm">
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-50" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
        </span>
        <span className="truncate">{place ? `${place.name}, ${place.state}` : "India · OpenStreetMap"}</span>
      </div>
      <button
        type="button"
        onClick={toggleGps}
        disabled={!mapReady}
        aria-label={gpsState === "live" || gpsState === "locating" ? "Stop live location" : "Show my live location"}
        aria-pressed={gpsState === "live" || gpsState === "locating"}
        className="absolute right-3 top-3 z-[1000] inline-flex min-h-10 items-center gap-2 rounded-full border border-black/5 bg-white px-3 text-xs font-semibold text-ink shadow-md disabled:opacity-60"
      >
        <LocateFixed className={`size-4 ${gpsState === "live" ? "text-blue-600" : "text-ink"}`} />
        {gpsState === "locating" ? "Locating…" : gpsState === "live" ? "GPS live" : "My location"}
      </button>
      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] max-w-[72%] rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-medium text-ink shadow-sm">
        {caption || (mapError
          ? "Map unavailable · check your internet"
          : gpsState === "live"
            ? "Your device GPS location is updating"
            : gpsState === "error"
              ? "Location permission unavailable"
              : routePath?.length
                ? "OpenStreetMap road route"
                : pickup && drop
                  ? "Road route not available · approximate line"
                  : "© OpenStreetMap contributors")}
      </div>
      {!mapReady && !mapError ? (
        <div className="absolute inset-0 z-[900] grid place-items-center bg-[#e9eee8]/90 text-sm font-medium text-ink">
          Loading OpenStreetMap…
        </div>
      ) : null}
      {mapError ? (
        <div className="absolute inset-0 z-[900] grid place-items-center bg-[#e9eee8] px-6 text-center text-sm font-medium text-ink">
          {mapError}
        </div>
      ) : null}
    </div>
  );
}
