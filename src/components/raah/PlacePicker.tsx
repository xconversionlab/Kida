import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { searchPlaces, toSelection } from "@/lib/raah/places";
import type { PlaceKind, Selection } from "@/lib/raah/types";
import { useRaah } from "@/lib/raah/store";
import {
  getNearbyOsmPlaces,
  osmOptionToSelection,
  reverseGeocodeOsm,
  searchOsmPlaces,
  type OsmPlaceOption,
} from "@/lib/raah/osmMaps";
import { MapView } from "./MapView";
import { Header, inputClass, Pill, useCopy } from "./ui";

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const radians = (value: number) => (value * Math.PI) / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function nearbyType(type?: string) {
  if (!type) return "Nearby place";
  return type.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function coordinateOf(selection: Selection) {
  return { lat: selection.lat, lng: selection.lng };
}

export function PlacePicker() {
  const copy = useCopy();
  const target = useRaah((s) => s.placeTarget);
  const lang = useRaah((s) => s.lang);
  const back = useRaah((s) => s.back);
  const choose = useRaah((s) => s.choose);
  const home = useRaah((s) => s.home);
  const work = useRaah((s) => s.work);
  const extras = useRaah((s) => s.extras);
  const recents = useRaah((s) => s.recents);
  const pickup = useRaah((s) => s.pickup);
  const setPickupLocation = useRaah((s) => s.setPickupLocation);
  const setPlaceTarget = useRaah((s) => s.setPlaceTarget);
  const setToast = useRaah((s) => s.setToast);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "village" | "town" | "city">("all");
  const [openId, setOpenId] = useState(pickup.placeId);
  const [predictions, setPredictions] = useState<OsmPlaceOption[]>([]);
  const [nearby, setNearby] = useState<OsmPlaceOption[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [pickupGpsReady, setPickupGpsReady] = useState(false);
  const [mapError, setMapError] = useState("");
  const requestNumberRef = useRef(0);
  const autoLocationRequestedRef = useRef(false);

  const title = target === "pickup" ? copy("pickupTitle") : target === "drop" ? copy("dropTitle") : target === "stop" ? "Add a stop" : copy("addPlace");

  const results = useMemo(() => {
    return searchPlaces(query).filter((place) => {
      if (filter === "all") return true;
      if (filter === "city") return place.kind === "city" || place.kind === "metro";
      return place.kind === filter;
    });
  }, [query, filter]);

  const saved = [home, work, ...extras].filter((item) => item != null);
  const focused = results.find((place) => place.id === openId) ?? results[0];

  const applyCurrentPickup = useCallback(async (position: GeolocationPosition, isActive: () => boolean = () => true) => {
    const point = { lat: position.coords.latitude, lng: position.coords.longitude };
    const address = await reverseGeocodeOsm(point, lang);
    if (!isActive()) return;

    const selection = osmOptionToSelection(address);
    setPickupLocation(selection);
    setPickupGpsReady(true);
    setMapError("");
    setToast("Your current location is set as the pickup.");
    if (target === "pickup") choose(selection);
  }, [lang, setPickupLocation, setToast, target, choose]);

  function useGps() {
    if (!navigator.geolocation) {
      setPickupGpsReady(false);
      setMapError("This device does not provide location services. Choose your pickup manually.");
      return;
    }

    setLocationLoading(true);
    setPickupGpsReady(false);
    setMapError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void applyCurrentPickup(position)
          .catch((error: unknown) => setMapError(error instanceof Error ? error.message : "OpenStreetMap could not identify this location."))
          .finally(() => setLocationLoading(false));
      },
      (error) => {
        setLocationLoading(false);
        setPickupGpsReady(false);
        setMapError(error.code === error.PERMISSION_DENIED
          ? "Location permission is off. Allow location access or choose your pickup manually."
          : "Could not read your current location. Check GPS and try again.");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  }

  // Resolve the device position as soon as the ride-order map opens.
  // This prevents the Bengaluru demo seed from being used as the pickup.
  useEffect(() => {
    const isLocationStage = target === "pickup" || target === "drop";
    if (!isLocationStage) {
      autoLocationRequestedRef.current = false;
      setPickupGpsReady(false);
      return;
    }
    if (autoLocationRequestedRef.current) return;
    autoLocationRequestedRef.current = true;

    if (!navigator.geolocation) {
      setLocationLoading(false);
      setPickupGpsReady(false);
      setMapError("Location services are unavailable. Choose your pickup manually.");
      return;
    }

    let active = true;
    setLocationLoading(true);
    setPickupGpsReady(false);
    setMapError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void applyCurrentPickup(position, () => active)
          .catch((error: unknown) => {
            if (active) setMapError(error instanceof Error ? error.message : "OpenStreetMap could not identify this location.");
          })
          .finally(() => {
            if (active) setLocationLoading(false);
          });
      },
      (error) => {
        if (!active) return;
        setLocationLoading(false);
        setPickupGpsReady(false);
        setMapError(error.code === error.PERMISSION_DENIED
          ? "Allow location access to set your current position as pickup, or choose a pickup manually."
          : "Location could not be read. Check GPS and try again.");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );

    return () => { active = false; };
  }, [target, applyCurrentPickup]);

  // Fetch real nearby OSM features around the pickup when the Drop selector opens.
  useEffect(() => {
    if (target !== "drop") {
      setNearby([]);
      return;
    }
    let active = true;
    setNearbyLoading(true);
    setMapError("");
    getNearbyOsmPlaces(coordinateOf(pickup), 15)
      .then((places) => {
        if (active) setNearby(places);
      })
      .catch((error: unknown) => {
        if (active) setMapError(error instanceof Error ? error.message : "Nearby OpenStreetMap places could not be loaded.");
      })
      .finally(() => {
        if (active) setNearbyLoading(false);
      });
    return () => { active = false; };
  }, [target, pickup.lat, pickup.lng]);

  // Photon suggestions are debounced and biased toward the pickup for drop searches.
  useEffect(() => {
    const currentRequest = ++requestNumberRef.current;
    if (query.trim().length < 3) {
      setPredictions([]);
      setSearchLoading(false);
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearchLoading(true);
      void searchOsmPlaces(
        query.trim(),
        target === "drop" ? coordinateOf(pickup) : null,
        lang,
        controller.signal,
      )
        .then((matches) => {
          if (active && currentRequest === requestNumberRef.current) setPredictions(matches);
        })
        .catch((error: unknown) => {
          if (active && currentRequest === requestNumberRef.current && !(error instanceof DOMException && error.name === "AbortError")) {
            setMapError(error instanceof Error ? error.message : "OpenStreetMap search is unavailable.");
          }
        })
        .finally(() => {
          if (active && currentRequest === requestNumberRef.current) setSearchLoading(false);
        });
    }, 350);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, target, pickup.lat, pickup.lng, lang]);

  function chooseOsmPrediction(option: OsmPlaceOption) {
    setMapError("");
    choose(osmOptionToSelection(option));
  }

  function chooseNearbyPlace(option: OsmPlaceOption) {
    choose(osmOptionToSelection(option));
  }

  return (
    <div className="rise pb-6">
      <Header title={title} subtitle={target === "drop" ? "Choose a destination near your pickup" : copy("unmapped")} onBack={back} />
      <div className="space-y-4 px-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            className={`${inputClass} pl-10`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={target === "drop" ? "Search destination or landmark" : "Search address, street or landmark"}
            aria-label={copy("search")}
          />
        </div>

        {(predictions.length > 0 || searchLoading) ? (
          <section className="overflow-hidden rounded-2xl border border-line bg-white">
            {predictions.map((prediction) => (
              <button
                key={prediction.id}
                type="button"
                onClick={() => chooseOsmPrediction(prediction)}
                className="flex min-h-14 w-full items-center gap-3 border-b border-line px-3 py-3 text-left last:border-b-0"
              >
                <MapPin className="size-5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{prediction.name}</span>
                  <span className="block truncate text-xs text-muted">{prediction.address}</span>
                </span>
              </button>
            ))}
            {searchLoading ? <p className="px-3 py-2 text-xs text-muted">Searching OpenStreetMap…</p> : null}
            <p className="px-3 py-2 text-right text-[11px] font-medium text-muted">Places data © OpenStreetMap contributors · Photon</p>
          </section>
        ) : null}

        <div className="flex gap-2 overflow-x-auto">
          {(
            [
              ["all", "filterAll"],
              ["city", "filterCity"],
              ["town", "filterTown"],
              ["village", "filterVillage"],
            ] as const
          ).map(([id, key]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`h-10 shrink-0 rounded-full px-3 text-sm font-semibold ${filter === id ? "bg-ink text-surface" : "bg-paper text-ink"}`}
            >
              {copy(key)}
            </button>
          ))}
        </div>

        {target === "pickup" || target === "drop" ? (
          <button type="button" onClick={useGps} disabled={locationLoading} className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-primary-soft px-3 text-left text-primary disabled:opacity-60">
            <LocateFixed className="size-5 shrink-0" />
            <span>
              <span className="block font-semibold">{locationLoading ? "Detecting current pickup…" : "Use my current location as pickup"}</span>
              <span className="block text-xs">Device GPS will set your pickup and center the map here</span>
            </span>
          </button>
        ) : null}

        {mapError ? (
          <div className="rounded-xl border border-line bg-paper px-3 py-2 text-sm text-muted">{mapError}</div>
        ) : null}

        {saved.length > 0 && !query ? (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-muted">{copy("saved")}</h2>
            <div className="space-y-2">
              {saved.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => choose(item.selection)}
                  className="kida-location-card flex w-full items-center gap-3 rounded-2xl border border-line px-3 py-3 text-left"
                >
                  <MapPin className="size-5 text-primary" />
                  <span>
                    <span className="block font-semibold">{item.slot === "extra" ? item.label : copy(item.slot === "home" ? "home" : "work")}</span>
                    <span className="block text-sm text-muted">{item.selection.line}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {recents.length > 0 && !query ? (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-muted">{copy("recent")}</h2>
            <div className="flex gap-2 overflow-x-auto">
              {recents.map((item) => (
                <button
                  key={item.landmarkId}
                  type="button"
                  onClick={() => choose({ ...item, source: "recent" })}
                  className="kida-location-card max-w-56 shrink-0 rounded-2xl bg-paper px-3 py-3 text-left"
                >
                  <span className="block font-semibold">{item.label}</span>
                  <span className="block text-sm text-muted">{item.line}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {target === "drop" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-line bg-paper px-3 py-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Pickup location</p>
                <p className="truncate text-sm font-semibold">
                  {pickupGpsReady ? pickup.label : locationLoading ? "Detecting your current location…" : "Waiting for current location"}
                </p>
                {pickupGpsReady ? <p className="truncate text-xs text-muted">{pickup.line}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  setPlaceTarget("pickup");
                  useRaah.getState().open("pickup");
                }}
                className="ml-2 shrink-0 text-xs font-semibold text-primary"
              >
                Change
              </button>
            </div>
            <MapView
              pickup={pickupGpsReady ? pickup : null}
              caption={pickupGpsReady
                ? "Your current location is set as pickup"
                : locationLoading
                  ? "Detecting your current location…"
                  : "Enable location or choose a pickup"}
              className="h-44"
            />
          </div>
        ) : null}

        {target === "drop" ? (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted">Nearby places from OpenStreetMap</h2>
              <span className="text-[11px] text-muted">Within 7 km</span>
            </div>
            {nearbyLoading ? <p className="py-3 text-sm text-muted">Finding nearby landmarks…</p> : null}
            {!nearbyLoading && nearby.length === 0 ? <p className="py-3 text-sm text-muted">No nearby mapped places found. Search for a destination above.</p> : null}
            <div className="space-y-2">
              {nearby.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseNearbyPlace(item)}
                  className="kida-location-card flex w-full items-center gap-3 rounded-2xl border border-line px-3 py-3 text-left"
                >
                  <MapPin className="size-5 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{item.name}</span>
                    <span className="block truncate text-sm text-muted">{item.address}</span>
                    <span className="block text-[11px] text-muted">{nearbyType(item.type)} · {distanceKm(pickup, item).toFixed(1)} km</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-right text-[11px] font-medium text-muted">© OpenStreetMap contributors</p>
          </section>
        ) : null}

        {focused && target !== "drop" ? (
          <section>
            <MapView pickup={toSelection(focused, focused.landmarks[0], "map")} className="h-52" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {focused.landmarks.map((landmark) => (
                <button
                  key={landmark.id}
                  type="button"
                  onClick={() => choose(toSelection(focused, landmark, "search"))}
                  className="min-h-12 rounded-2xl border border-line px-3 py-2 text-left text-sm"
                >
                  <span className="block font-semibold">{landmark.name}</span>
                  <span className="text-muted">{landmark.hint}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted">{copy("around")}</h2>
          {results.map((place) => (
            <div key={place.id} className="rounded-2xl border border-line">
              <button
                type="button"
                onClick={() => setOpenId(place.id)}
                className="flex w-full items-center justify-between px-3 py-3 text-left"
              >
                <span>
                  <span className="block font-semibold">{place.name}</span>
                  <span className="text-sm text-muted">{place.district}, {place.state}</span>
                </span>
                <Pill tone={place.kind === "village" ? "warn" : "line"}>{kindLabel(place.kind)}</Pill>
              </button>
              {openId === place.id ? (
                <div className="space-y-1 border-t border-line px-2 py-2">
                  {place.landmarks.map((landmark) => (
                    <button
                      key={landmark.id}
                      type="button"
                      onClick={() => choose(toSelection(place, landmark, "search"))}
                      className="flex min-h-12 w-full items-center rounded-xl px-2 text-left hover:bg-paper"
                    >
                      <span>
                        <span className="block font-medium">{landmark.name}</span>
                        <span className="text-sm text-muted">{landmark.hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {results.length === 0 ? <p className="text-sm text-muted">No local sample city or village matches that search. Use the OpenStreetMap search results above.</p> : null}
        </section>
      </div>
    </div>
  );
}

function kindLabel(kind: PlaceKind) {
  if (kind === "metro") return "Metro";
  if (kind === "city") return "City";
  if (kind === "town") return "Town";
  return "Village";
}
