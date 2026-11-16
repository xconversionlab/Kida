import { useMemo, useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { nearestPlace, searchPlaces, toSelection } from "@/lib/raah/places";
import type { PlaceKind } from "@/lib/raah/types";
import { useRaah } from "@/lib/raah/store";
import { MapView } from "./MapView";
import { Header, inputClass, Pill, useCopy } from "./ui";

export function PlacePicker() {
  const copy = useCopy();
  const target = useRaah((s) => s.placeTarget);
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

  function useGps() {
    if (!navigator.geolocation) {
      setToast(copy("gpsDenied"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const place = nearestPlace(pos.coords.latitude, pos.coords.longitude);
        const landmark = place.landmarks[0];
        choose(toSelection(place, landmark, "gps"));
        setToast(`${copy("gpsSnapped")} ${place.name}.`);
      },
      () => setToast(copy("gpsDenied")),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  }

  return (
    <div className="rise pb-6">
      <Header title={title} subtitle={copy("unmapped")} onBack={back} />
      <div className="space-y-4 px-4">
        <input
          className={inputClass}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy("searchPh")}
          aria-label={copy("search")}
        />
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
          <button type="button" onClick={useGps} className="flex h-12 w-full items-center gap-3 rounded-2xl bg-primary-soft px-3 text-left text-primary">
            <LocateFixed className="size-5" />
            <span>
              <span className="block font-semibold">{copy("tryGps")}</span>
              <span className="block text-xs">{copy("gpsNote")}</span>
            </span>
          </button>
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
        {focused ? (
          <section>
            <MapView
              pickup={toSelection(focused, focused.landmarks[0], "map")}
              className="h-52"
              caption={copy("villageNote")}
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
                  <span className="text-sm text-muted">
                    {place.district}, {place.state}
                  </span>
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
