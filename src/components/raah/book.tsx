import { useEffect, useState } from "react";
import { getPlace } from "@/lib/raah/places";
import { payLabel, promoReason, vehicleLabel } from "@/lib/raah/labels";
import { inr, kmBetween, quoteRide, resolvePromo, VEHICLES, type PromoResult } from "@/lib/raah/pricing";
import { useRaah } from "@/lib/raah/store";
import type { VehicleId } from "@/lib/raah/types";
import { VehicleArt } from "./art";
import { Btn, Header, inputClass, Pill, useCopy } from "./ui";

function useTripKm() {
  const pickup = useRaah((s) => s.pickup);
  const drop = useRaah((s) => s.drop);
  const place = getPlace(pickup.placeId);
  if (!drop || !place) return null;
  return { pickup, drop, place, km: kmBetween(pickup, drop) };
}

export function VehiclesScreen() {
  const copy = useCopy();
  const lang = useRaah((s) => s.lang);
  const vehicle = useRaah((s) => s.vehicle);
  const setVehicle = useRaah((s) => s.setVehicle);
  const back = useRaah((s) => s.back);
  const open = useRaah((s) => s.open);
  const trip = useTripKm();
  if (!trip) {
    return (
      <div className="px-4 py-6">
        <Header title={copy("vehicleTitle")} onBack={() => useRaah.getState().replace("home")} />
        <Btn onClick={() => useRaah.getState().replace("home")}>{copy("whereTo")}</Btn>
      </div>
    );
  }
  return (
    <div className="pb-6">
      <Header title={copy("vehicleTitle")} subtitle={`${trip.km} km · ${copy("fareNote")}`} onBack={back} />
      <div className="space-y-3 px-4">
        {VEHICLES.map((item) => {
          const fare = quoteRide(item.id, trip.km, trip.place.kind, null);
          const selected = vehicle === item.id;
          const blocked = fare.availability === "unavailable";
          return (
            <button
              key={item.id}
              type="button"
              disabled={blocked}
              onClick={() => setVehicle(item.id)}
              className={`flex w-full items-center gap-3 rounded-3xl border p-3 text-left ${selected ? "border-primary bg-primary-soft" : "border-line"} ${blocked ? "opacity-50" : ""}`}
            >
              <span className="grid size-16 place-items-center rounded-2xl bg-paper text-ink">
                <VehicleArt id={item.id} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{vehicleLabel(lang, item.id)}</span>
                  <Pill tone={fare.availability === "ready" ? "ok" : fare.availability === "limited" ? "warn" : "line"}>
                    {copy(fare.availability)}
                  </Pill>
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {item.capacity} {copy("seats")} · {fare.minutes} {copy("min")} · {fare.arrivalMin} {copy("min")} {copy("away")}
                </span>
              </span>
              <span className="font-semibold tabular">{blocked ? "—" : inr(fare.total)}</span>
            </button>
          );
        })}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Btn variant="line" onClick={() => open("fare")}>
            {copy("schedule")}
          </Btn>
          <Btn
            onClick={() => {
              useRaah.getState().setWhen("now");
              open("fare");
            }}
          >
            {copy("bookNow")}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function FareScreen() {
  const copy = useCopy();
  const lang = useRaah((s) => s.lang);
  const vehicle = useRaah((s) => s.vehicle);
  const payment = useRaah((s) => s.payment);
  const promoInput = useRaah((s) => s.promoInput);
  const setPromoInput = useRaah((s) => s.setPromoInput);
  const promo = useRaah((s) => s.promo);
  const setPromo = useRaah((s) => s.setPromo);
  const used = useRaah((s) => s.usedPromos);
  const when = useRaah((s) => s.when);
  const setWhen = useRaah((s) => s.setWhen);
  const back = useRaah((s) => s.back);
  const open = useRaah((s) => s.open);
  const trip = useTripKm();
  const [note, setNote] = useState("");
  if (!trip) return null;
  const fare = quoteRide(vehicle, trip.km, trip.place.kind, promo);
  const blocked = fare.availability === "unavailable";
  function apply() {
    const result: PromoResult = resolvePromo(promoInput, fare.base + fare.distanceCharge, vehicle, trip!.place.kind, used);
    setNote(promoReason(result.reason));
    setPromo(result.ok ? result : null);
  }
  return (
    <div className="pb-8">
      <Header title={copy("fareDetails")} subtitle={copy("fareNote")} onBack={back} />
      <div className="space-y-3 px-4">
        <Row label={copy("base")} value={inr(fare.base)} />
        <Row label={`${copy("distance")} · ${fare.km} km`} value={inr(fare.distanceCharge)} />
        <Row label={copy("waiting")} value={inr(fare.waiting)} />
        <Row label={copy("discount")} value={fare.discount ? `−${inr(fare.discount)}` : inr(0)} />
        <Row label={copy("tax")} value={inr(fare.tax)} />
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="font-semibold">{copy("total")}</span>
          <span className="font-display text-3xl tabular">{blocked ? "—" : inr(fare.total)}</span>
        </div>
        <p className="text-xs text-muted">{copy("waitingNote")}</p>
        <div className="flex gap-2">
          <input className={inputClass} value={promoInput} onChange={(e) => setPromoInput(e.target.value.toUpperCase())} placeholder={copy("promoPh")} aria-label={copy("promo")} />
          <Btn variant="soft" className="shrink-0" onClick={apply}>
            {copy("apply")}
          </Btn>
        </div>
        {note ? <p className="text-sm text-muted">{note}</p> : null}
        <button type="button" onClick={() => open("payments")} className="flex h-12 w-full items-center justify-between rounded-2xl bg-paper px-3 text-left">
          <span className="text-sm text-muted">{copy("payWith")}</span>
          <span className="font-semibold">{payLabel(lang, payment)}</span>
        </button>
        <label className="block text-sm font-medium text-muted">
          {copy("pickTime")}
          <input
            type="datetime-local"
            className={`${inputClass} mt-1`}
            value={when === "now" ? "" : when}
            onChange={(event) => setWhen(event.target.value || "now")}
          />
        </label>
        <Btn className="w-full" disabled={blocked} onClick={() => open("confirm")}>
          {copy("continue")}
        </Btn>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="tabular font-medium">{value}</span>
    </div>
  );
}

export function ConfirmScreen() {
  const copy = useCopy();
  const lang = useRaah((s) => s.lang);
  const pickup = useRaah((s) => s.pickup);
  const drop = useRaah((s) => s.drop);
  const vehicle = useRaah((s) => s.vehicle);
  const payment = useRaah((s) => s.payment);
  const when = useRaah((s) => s.when);
  const back = useRaah((s) => s.back);
  const confirm = useRaah((s) => s.confirmBooking);
  const place = getPlace(pickup.placeId);
  if (!drop || !place) return null;
  const fare = quoteRide(vehicle, kmBetween(pickup, drop), place.kind, useRaah.getState().promo);
  return (
    <div className="pb-8">
      <Header title={copy("confirmRide")} subtitle={copy("proto")} onBack={back} />
      <div className="space-y-3 px-4">
        <Stop label={copy("from")} title={pickup.label} line={pickup.line} />
        <Stop label={copy("to")} title={drop.label} line={drop.line} />
        {(place.kind === "village" || place.kind === "town") && <p className="text-sm text-accent">{copy("villageNote")}</p>}
        <div className="flex items-center gap-3 rounded-3xl border border-line p-3">
          <VehicleArt id={vehicle as VehicleId} />
          <div className="flex-1">
            <p className="font-semibold">{vehicleLabel(lang, vehicle)}</p>
            <p className="text-sm text-muted">
              {payLabel(lang, payment)} · {when === "now" ? copy("now") : when.replace("T", " ")}
            </p>
          </div>
          <p className="font-display text-2xl tabular">{inr(fare.total)}</p>
        </div>
        <Btn className="w-full" onClick={confirm}>
          {when === "now" ? copy("confirmRide") : copy("scheduleTitle")}
        </Btn>
      </div>
    </div>
  );
}

function Stop({ label, title, line }: { label: string; title: string; line: string }) {
  return (
    <div className="rounded-2xl bg-paper px-3 py-3">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted">{line}</p>
    </div>
  );
}

export function AssigningScreen() {
  const copy = useCopy();
  const assign = useRaah((s) => s.assignDriver);
  useEffect(() => {
    const id = window.setTimeout(() => assign(), 1400);
    return () => window.clearTimeout(id);
  }, [assign]);
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <div className="mx-auto size-16 rounded-full bg-primary-soft puck" />
        <h1 className="mt-6 font-display text-3xl">{copy("searching")}</h1>
        <p className="mt-2 text-sm text-muted">{copy("simDriver")}</p>
      </div>
    </div>
  );
}
