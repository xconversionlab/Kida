import { useMemo, useState } from "react";
import { company } from "@/lib/raah/company";
import { t } from "@/lib/raah/i18n";
import { payLabel, vehicleLabel } from "@/lib/raah/labels";
import { getPlace, searchPlaces, toSelection } from "@/lib/raah/places";
import { BOOKABLE_VEHICLES, inr, kmBetween, quoteRide } from "@/lib/raah/pricing";
import { DESK_CALLS, useRaah } from "@/lib/raah/store";
import type { VehicleId } from "@/lib/raah/types";
import { MapView } from "./MapView";
import { Btn, Pill } from "./ui";

export function OperatorConsole({ onBack }: { onBack?: () => void }) {
  const desk = useRaah((s) => s.desk);
  const consent = useRaah((s) => s.consent);
  const loadCall = useRaah((s) => s.loadCall);
  const setDesk = useRaah((s) => s.setDesk);
  const sendLink = useRaah((s) => s.sendLocationLink);
  const create = useRaah((s) => s.createDeskBooking);
  const [query, setQuery] = useState("");
  const [aim, setAim] = useState<"pickup" | "drop">("pickup");
  const hits = useMemo(() => searchPlaces(query).slice(0, 6), [query]);
  const pickupPlace = desk.pickup ? getPlace(desk.pickup.placeId) : null;
  const fare =
    desk.pickup && desk.drop && pickupPlace
      ? quoteRide(desk.vehicle, kmBetween(desk.pickup, desk.drop), pickupPlace.kind, null)
      : null;
  const blocked = !desk.pickup || !desk.drop || !fare || fare.availability === "unavailable";

  return (
    <section className="kida-operator-screen flex h-full min-h-0 flex-col text-ink">
      <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary">RAAH DESK</p>
          <h2 className="font-display text-3xl">Call-centre booking</h2>
          <p className="text-sm text-muted">Prototype operator view. Caller ID is not GPS.</p>
        </div>
        {onBack ? (
          <button type="button" onClick={onBack} className="h-11 rounded-full bg-surface px-3 text-sm font-semibold">
            Back to app
          </button>
        ) : null}
      </header>
      <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted">Sample incoming calls</p>
          {DESK_CALLS.map((call) => (
            <button
              key={call.id}
              type="button"
              onClick={() => loadCall(call)}
              className={`kida-location-card w-full rounded-2xl border p-3 text-left ${desk.callId === call.id ? "border-primary bg-surface" : "border-line bg-surface"}`}
            >
              <span className="block font-semibold">{call.name}</span>
              <span className="block text-sm tabular text-muted">+91 {call.phone}</span>
              <span className="mt-1 block text-xs text-muted">{call.note}</span>
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Caller name
              <input className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3" value={desk.name} onChange={(e) => setDesk({ name: e.target.value })} />
            </label>
            <label className="text-sm">
              Mobile
              <input
                className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 tabular"
                value={desk.phone}
                onChange={(e) => setDesk({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              />
            </label>
          </div>
          <p className="text-sm text-muted">{desk.note || "Choose a sample call, or type a caller."}</p>
          <MapView
            pickup={desk.pickup}
            drop={desk.drop}
            caption={
              consent === "allowed"
                ? "Customer allowed this pin. Sharing is explicit."
                : "No GPS yet. Book with the landmark, or send a location link."
            }
            className="h-52"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={consent === "allowed" ? "ok" : consent === "denied" ? "danger" : "warn"}>
              {consent === "none" ? "Location not requested" : consent === "link_sent" ? "Link sent · waiting" : consent === "allowed" ? "Customer allowed location" : "Customer declined"}
            </Pill>
            <Btn variant="soft" onClick={sendLink} disabled={!desk.phone}>
              Send location SMS
            </Btn>
          </div>
          <p className="text-xs text-muted">The SMS is simulated. The customer app shows the consent screen. Nothing is tracked before Allow.</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAim("pickup")} className={`h-10 rounded-full px-3 text-sm font-semibold ${aim === "pickup" ? "bg-ink text-surface" : "bg-surface"}`}>
              Set pickup
            </button>
            <button type="button" onClick={() => setAim("drop")} className={`h-10 rounded-full px-3 text-sm font-semibold ${aim === "drop" ? "bg-ink text-surface" : "bg-surface"}`}>
              Set destination
            </button>
          </div>
          <input
            className="h-11 w-full rounded-xl border border-line bg-surface px-3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Village, landmark, city…"
            aria-label="Find a place"
          />
          <div className="space-y-2">
            {hits.map((place) => (
              <div key={place.id} className="rounded-2xl bg-surface p-2">
                <p className="px-2 text-sm font-semibold">
                  {place.name} · {place.kind} · {place.state}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {place.landmarks.map((landmark) => (
                    <button
                      key={landmark.id}
                      type="button"
                      className="h-10 rounded-full bg-paper px-3 text-sm"
                      onClick={() => setDesk({ [aim]: toSelection(place, landmark, "operator") })}
                    >
                      {landmark.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {BOOKABLE_VEHICLES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDesk({ vehicle: item.id as VehicleId })}
                className={`h-12 shrink-0 rounded-2xl px-3 text-sm font-semibold ${desk.vehicle === item.id ? "bg-primary text-primary-ink" : "bg-surface"}`}
              >
                {vehicleLabel(desk.language, item.id)}
              </button>
            ))}
          </div>
          <div className="rounded-2xl bg-surface p-3 text-sm">
            <p>
              Pickup: <span className="font-medium">{desk.pickup?.line ?? "Not set"}</span>
            </p>
            <p className="mt-1">
              Destination: <span className="font-medium">{desk.drop?.line ?? "Not set"}</span>
            </p>
            <p className="mt-2 font-display text-3xl tabular">{fare && fare.availability !== "unavailable" ? inr(fare.total) : "—"}</p>
            <p className="text-muted">
              {fare ? `${fare.km} km · ${fare.minutes} min · ${fare.availability}` : "Choose both ends for a sample fare."} · {payLabel("en", "cash")} by default for phone bookings.
            </p>
            {pickupPlace && (pickupPlace.kind === "village" || pickupPlace.kind === "town") ? (
              <p className="mt-2 text-accent">Road coverage may be incomplete. The landmark is the finding instruction.</p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-line bg-surface p-3 text-sm">
            <p className="font-semibold">SMS preview · {desk.language.toUpperCase()}</p>
            <p className="mt-1 text-muted">
              {company.brand}: {t(desk.language, "booked")}. {desk.pickup?.label ?? "Pickup"} → {desk.drop?.label ?? "Destination"}. {fare ? inr(fare.total) : ""} {t(desk.language, "trackSim")}.
            </p>
            <p className="mt-2 font-semibold">Voice script</p>
            <p className="text-muted">
              {t(desk.language, "callLead")} {desk.name ? `${desk.name}, ` : ""}
              {t(desk.language, "how5")}
            </p>
          </div>
          <Btn className="w-full" disabled={blocked} onClick={create}>
            Create phone booking
          </Btn>
          <p className="text-xs text-muted">
            Creates a simulated ride for the customer app beside this desk. Cash fare. Driver is not a real person. Desk number {company.supportPhone} is a placeholder.
          </p>
        </div>
      </div>
    </section>
  );
}
