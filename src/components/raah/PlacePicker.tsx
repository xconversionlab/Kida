import { useEffect, useMemo, useRef, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { searchPlaces, toSelection } from "@/lib/raah/places";
import type { PlaceKind, Selection } from "@/lib/raah/types";
import { useRaah } from "@/lib/raah/store";
import {
  createGoogleSessionToken,
  getGooglePlaceOption,
  getGooglePredictions,
  getNearbyGooglePlaces,
  googleOptionToSelection,
  hasGoogleMapsKey,
  loadGoogleMaps,
  reverseGeocodeGoogle,
  type GooglePlaceOption,
} from "@/lib/raah/googleMaps";
import { MapView } from "./MapView";
import { Header, inputClass, Pill, useCopy } from "./ui";

interface Prediction {
  id: string;
  description: string;
  place: Parameters<typeof getGooglePlaceOption>[0];
}

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
  const setToast = useRaah((s) => s.setToast);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "village" | "town" | "city">("all");
  const [openId, setOpenId] = useState(pickup.placeId);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [nearby, setNearby] = useState<GooglePlaceOption[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const sessionTokenRef = useRef<object | null>(null);
  const requestNumberRef = useRef(0);
  const autoLocationRequestedRef = useRef(false);

  const title =
    target === "pickup" ? copy("pickupTitle") : target === "drop" ? copy("dropTitle") : copy("addPlace");

  const results = useMemo(() => {
    return searchPlaces(query).filter((place) => {
      if (filter === "all") return true;
      if (filter === "city") return place.kind === "city" || place.kind === "metro";
      return place.kind === filter;
    });
  }, [query, filter]);

  const saved = [home, work, ...extras].filter((item) => item != null);
  const focused = results.find((place) => place.id === openId) ?? results[0];

  async function useGps() {
    if (!hasGoogleMapsKey) {
      setGoogleError("Google location services need to be connected before Kida can fetch a precise address.");
      return;
    }
    if (!navigator.geolocation) {
      setGoogleError("This device does not provide location services.");
      return;
    }

    setLocationLoading(true);
    setGoogleError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const address = await reverseGeocodeGoogle(
            { lat: position.coords.latitude, lng: position.coords.longitude },
            lang,
          );
          choose(googleOptionToSelection(address));
          setToast("Pickup address found using Google Maps.");
        } catch (error) {
          setGoogleError(error instanceof Error ? error.message : "Google could not find this address.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        setGoogleError(error.code === error.PERMISSION_DENIED
          ? "Location permission is off. Allow location access and try again."
          : "Could not read your current location. Check GPS and try again.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  // When the customer opens Pickup, ask for device location and resolve it to a
  // real Google address. The customer can still search or choose manually.
  useEffect(() => {
    if (target !== "pickup") {
      autoLocationRequestedRef.current = false;
      return;
    }
    if (!hasGoogleMapsKey || autoLocationRequestedRef.current || !navigator.geolocation) return;
    autoLocationRequestedRef.current = true;

    let active = true;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const address = await reverseGeocodeGoogle(
            { lat: position.coords.latitude, lng: position.coords.longitude },
            lang,
          );
          if (!active) return;
          choose(googleOptionToSelection(address));
          setToast("Pickup address found using Google Maps.");
        } catch (error) {
          if (active) setGoogleError(error instanceof Error ? error.message : "Google could not find this address.");
        } finally {
          if (active) setLocationLoading(false);
        }
      },
      (error) => {
        if (!active) return;
        setLocationLoading(false);
        setGoogleError(error.code === error.PERMISSION_DENIED
          ? "Allow location access to fill your pickup address automatically, or search for it below."
          : "Location could not be read. Use Search to enter your pickup.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );

    return () => { active = false; };
  }, [target, lang, choose, setToast]);

  // Fetch Google nearby landmarks around the pickup as soon as Drop opens.
  useEffect(() => {
    if (target !== "drop" || !hasGoogleMapsKey) {
      setNearby([]);
      return;
    }
    let active = true;
    setNearbyLoading(true);
    setGoogleError("");
    getNearbyGooglePlaces(coordinateOf(pickup), 15)
      .then((places) => {
        if (active) setNearby(places);
      })
      .catch((error: unknown) => {
        if (active) setGoogleError(error instanceof Error ? error.message : "Nearby places could not be loaded.");
      })
      .finally(() => {
        if (active) setNearbyLoading(false);
      });
    return () => { active = false; };
  }, [target, pickup.lat, pickup.lng]);

  // Search suggestions are biased to the pickup for Drop, and restricted to India.
  useEffect(() => {
    const currentRequest = ++requestNumberRef.current;
    if (!hasGoogleMapsKey || query.trim().length < 3) {
      setPredictions([]);
      setSearchLoading(false);
      if (query.trim().length < 3) sessionTokenRef.current = null;
      return;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        if (!sessionTokenRef.current) {
          const bundle = await loadGoogleMaps();
          sessionTokenRef.current = createGoogleSessionToken(bundle);
        }
        const matches = await getGooglePredictions(
          query.trim(),
          target === "drop" ? coordinateOf(pickup) : null,
          sessionTokenRef.current,
          lang,
        );
        if (active && currentRequest === requestNumberRef.current) setPredictions(matches);
      } catch (error) {
        if (active && currentRequest === requestNumberRef.current) {
          setGoogleError(error instanceof Error ? error.message : "Google search is unavailable.");
        }
      } finally {
        if (active && currentRequest === requestNumberRef.current) setSearchLoading(false);
      }
    }, 320);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, target, pickup.lat, pickup.lng, lang]);

  async function chooseGooglePrediction(prediction: Prediction) {
    setSearchLoading(true);
    setGoogleError("");
    try {
      const option = await getGooglePlaceOption(prediction.place);
      choose(googleOptionToSelection(option));
      sessionTokenRef.current = null;
    } catch (error) {
      setGoogleError(error instanceof Error ? error.message : "This place could not be selected.");
    } finally {
      setSearchLoading(false);
    }
  }

  function chooseNearbyPlace(option: GooglePlaceOption) {
    choose(googleOptionToSelection(option));
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

        {hasGoogleMapsKey && (predictions.length > 0 || searchLoading) ? (
          <section className="overflow-hidden rounded-2xl border border-line bg-white">
            {predictions.map((prediction) => (
              <button
                key={prediction.id}
                type="button"
                onClick={() => void chooseGooglePrediction(prediction)}
                className="flex min-h-14 w-full items-center gap-3 border-b border-line px-3 py-3 text-left last:border-b-0"
              >
                <MapPin className="size-5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 text-sm">{prediction.description}</span>
              </button>
            ))}
            {searchLoading ? <p className="px-3 py-2 text-xs text-muted">Searching Google Maps…</p> : null}
            <p className="px-3 py-2 text-right text-[11px] font-medium text-muted">Powered by Google Maps</p>
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

        {target === "pickup" ? (
          <button type="button" onClick={() => void useGps()} disabled={locationLoading} className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-primary-soft px-3 text-left text-primary disabled:opacity-60">
            <LocateFixed className="size-5 shrink-0" />
            <span>
              <span className="block font-semibold">{locationLoading ? "Finding your address…" : "Use my current location"}</span>
              <span className="block text-xs">{hasGoogleMapsKey ? "Google will turn your GPS position into a full address" : "Google address lookup will activate after setup"}</span>
            </span>
          </button>
        ) : null}

        {googleError ? (
          <div className="rounded-xl border border-line bg-paper px-3 py-2 text-sm text-muted">{googleError}</div>
        ) : null}

        {!hasGoogleMapsKey ? (
          <div className="rounded-xl border border-dashed border-line bg-paper px-3 py-3 text-xs leading-relaxed text-muted">
            Google-powered address lookup and nearby destinations are ready to enable. Add the restricted <strong>VITE_GOOGLE_MAPS_API_KEY</strong> in the Kida Vercel project and enable Maps JavaScript API, Places API (New), and Geocoding API.
          </div>
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

        {target === "drop" && hasGoogleMapsKey ? <MapView pickup={pickup} className="h-44" /> : null}

        {target === "drop" && hasGoogleMapsKey ? (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted">Main places near your pickup</h2>
              <span className="text-[11px] text-muted">Within 7 km</span>
            </div>
            {nearbyLoading ? <p className="py-3 text-sm text-muted">Finding nearby landmarks…</p> : null}
            {!nearbyLoading && nearby.length === 0 ? <p className="py-3 text-sm text-muted">No nearby places found. Search for a destination above.</p> : null}
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
            <p className="mt-2 text-right text-[11px] font-medium text-muted">Places data by Google Maps</p>
          </section>
        ) : null}

        {focused && (!hasGoogleMapsKey || target !== "drop") ? (
          <section>
            <MapView
              pickup={toSelection(focused, focused.landmarks[0], "map")}
              className="h-52"
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {focused.landmarks.map((landmark) => (
                <button
                  key={landmark.id}
                  type="button"
                  onClick={() => choose(toSelection(focused, landmark, "map"))}
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
          {results.length === 0 ? <p className="text-sm text-muted">No sample place matches that search.</p> : null}
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
