import { Headphones, Shield } from "lucide-react";
import { getPlace } from "@/lib/raah/places";
import { inr, kmBetween, quoteRide } from "@/lib/raah/pricing";
import { useRaah } from "@/lib/raah/store";
import type { VehicleId } from "@/lib/raah/types";
import { vehicleLabel } from "@/lib/raah/labels";
import { VehicleArt, Wordmark } from "./art";
import { MapView } from "./MapView";
import { Avatar, useCopy } from "./ui";

const quick: VehicleId[] = ["bike", "auto", "mini", "sedan", "xl"];

export function HomeScreen() {
  const copy = useCopy();
  const lang = useRaah((s) => s.lang);
  const name = useRaah((s) => s.name);
  const photo = useRaah((s) => s.photo);
  const pickup = useRaah((s) => s.pickup);
  const drop = useRaah((s) => s.drop);
  const simple = useRaah((s) => s.simpleMode);
  const rides = useRaah((s) => s.rides);
  const open = useRaah((s) => s.open);
  const tab = useRaah((s) => s.tab);
  const setTarget = useRaah((s) => s.setPlaceTarget);
  const setVehicle = useRaah((s) => s.setVehicle);
  const place = getPlace(pickup.placeId);
  const live = rides.find((ride) => ride.status === "arriving" || ride.status === "ongoing" || ride.status === "searching");
  const km = drop ? kmBetween(pickup, drop) : null;

  function goPickup() {
    setTarget("pickup");
    open("pickup");
  }
  function goDrop() {
    setTarget("drop");
    open("destination");
  }

  return (
    <div className="kida-home-screen rise pb-4">
      <header className="kida-home-header flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <Wordmark className="text-3xl" />
          <p className="mt-1 text-sm text-muted">
            {copy("hello")}, {name.split(" ")[0]}
          </p>
        </div>
        <button type="button" onClick={() => tab("safe")} className="grid size-11 place-items-center rounded-full bg-paper" aria-label={copy("navSafety")}>
          <Shield className="size-5" />
        </button>
        <button type="button" onClick={() => open("support")} className="grid size-11 place-items-center rounded-full bg-paper" aria-label={copy("support")}>
          <Headphones className="size-5" />
        </button>
        <button type="button" onClick={() => open("profile")} aria-label={copy("profile")}>
          <Avatar name={name} photo={photo} />
        </button>
      </header>
      <div className="space-y-3 px-4">
        <MapView pickup={pickup} drop={drop} className={simple ? "h-40" : "h-56"} caption={copy("sampleFix")} />
        <p className="text-xs text-muted">
          {place?.name}, {place?.state}
          {place?.kind === "village" || place?.kind === "town" ? ` · ${copy("villageNote")}` : ""}
        </p>
        {live ? (
          <button
            type="button"
            onClick={() => {
              useRaah.setState({ activeRideId: live.id, selectedRideId: live.id });
              useRaah.getState().replace(live.status === "searching" ? "assigning" : "tracking");
            }}
            className="flex w-full items-center justify-between rounded-2xl bg-primary px-4 py-3 text-left text-primary-ink"
          >
            <span>
              <span className="block text-sm">{copy(live.status === "ongoing" ? "onTrip" : "arriving")}</span>
              <span className="font-semibold">{live.driver?.name ?? copy("searching")}</span>
            </span>
            <span className="text-sm font-semibold">{copy("done")}</span>
          </button>
        ) : null}
        {simple ? (
          <>
            <button type="button" onClick={() => open("call")} className="kida-feature-card min-h-16 w-full rounded-3xl bg-accent px-4 py-4 text-left text-accent-ink">
              <span className="block text-xl font-semibold">{copy("callCta")}</span>
              <span className="text-sm">{copy("callSub")}</span>
            </button>
            <button type="button" onClick={goDrop} className="kida-feature-card min-h-16 w-full rounded-3xl bg-primary px-4 py-4 text-left text-primary-ink">
              <span className="block text-xl font-semibold">{copy("bookPhone")}</span>
              <span className="text-sm">{copy("whereTo")}</span>
            </button>
          </>
        ) : null}
        <button type="button" onClick={goPickup} className="flex w-full items-center gap-3 rounded-2xl border border-line px-3 py-3 text-left">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-muted">{copy("pickup")}</span>
            <span className="block truncate font-medium">{pickup.label}</span>
          </span>
        </button>
        <button type="button" onClick={goDrop} className="flex h-14 w-full items-center gap-3 rounded-2xl bg-paper px-3 text-left">
          <span className="size-2.5 rounded-full bg-accent" />
          <span className="text-lg font-semibold text-muted">{drop ? drop.label : copy("whereTo")}</span>
        </button>
        {!simple ? (
          <button type="button" onClick={() => open("call")} className="flex min-h-16 w-full items-center justify-between rounded-3xl bg-accent px-4 py-3 text-left text-accent-ink">
            <span>
              <span className="block text-lg font-semibold">{copy("callCta")}</span>
              <span className="text-sm">{copy("callSub")}</span>
            </span>
            <PhoneMark />
          </button>
        ) : null}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quick.map((id) => {
            const fare = place && km ? quoteRide(id, km, place.kind, null) : null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setVehicle(id);
                  if (drop) useRaah.getState().replace("vehicles");
                  else goDrop();
                }}
                className="w-36 shrink-0 rounded-2xl border border-line p-3 text-left text-ink"
              >
                <VehicleArt id={id} className="h-10 w-16" />
                <span className="mt-2 block font-semibold">{vehicleLabel(lang, id)}</span>
                <span className="text-sm text-muted tabular">{fare && fare.availability !== "unavailable" ? inr(fare.total) : copy("whereTo")}</span>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => tab("offers")} className="flex w-full items-center justify-between rounded-2xl bg-accent-soft px-4 py-3 text-left">
          <span>
            <span className="block text-sm font-semibold text-accent">{copy("offers")}</span>
            <span className="text-sm text-ink">KIDA50 · ₹50 off the first prototype ride</span>
          </span>
        </button>
      </div>
    </div>
  );
}

function PhoneMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-10" aria-hidden>
      <rect x="14" y="6" width="20" height="36" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
