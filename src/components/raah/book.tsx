import { useEffect, useRef, useState } from "react";
import { createMyBooking } from "@/lib/kida/server";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getPlace } from "@/lib/raah/places";
import { getOsmDrivingRoute, type DrivingRoutePreview } from "@/lib/raah/osmMaps";
import { payLabel, promoReason, vehicleLabel } from "@/lib/raah/labels";
import { BOOKABLE_VEHICLES, calculateFareAllocation, inr, kmBetween, quoteRide, resolvePromo, type PromoResult } from "@/lib/raah/pricing";
import { CUSTOMER_FREE_RIDE_CODE, getCustomerRewardProgress, isEligibleCustomerFreeRide } from "@/lib/raah/rewards";
import { useRaah } from "@/lib/raah/store";
import type { VehicleId } from "@/lib/raah/types";
import { VehicleArt } from "./art";
import { MapView } from "./MapView";
import { Btn, Header, inputClass, Pill, useCopy } from "./ui";

function useTripKm() {
  const pickup = useRaah((s) => s.pickup);
  const drop = useRaah((s) => s.drop);
  const stops = useRaah((s) => s.stops);
  const vehicle = useRaah((s) => s.vehicle);
  const place = getPlace(pickup.placeId);
  const points = drop ? [pickup, ...stops, drop] : [];
  const pointsKey = points.map((point) => `${point.lat.toFixed(6)},${point.lng.toFixed(6)}`).join("|");
  const [route, setRoute] = useState<DrivingRoutePreview | null>(null);
  const [routeState, setRouteState] = useState<"loading" | "road" | "approximate">("approximate");

  useEffect(() => {
    let active = true;
    setRoute(null);
    if (points.length < 2) {
      setRouteState("approximate");
      return () => { active = false; };
    }

    setRouteState("loading");
    const requestPoints = pointsKey.split("|").map((value) => {
      const [lat, lng] = value.split(",").map(Number);
      return { lat, lng };
    });
    void getOsmDrivingRoute(requestPoints, vehicle)
      .then((result) => {
        if (!active) return;
        setRoute(result);
        setRouteState("road");
      })
      .catch(() => {
        if (!active) return;
        setRoute(null);
        setRouteState("approximate");
      });

    return () => { active = false; };
  }, [pointsKey, vehicle]);

  if (!drop || !place) return null;
  const straightKm = points.slice(1).reduce((total, point, index) => total + kmBetween(points[index], point), 0);
  const km = route?.distanceKm ?? Math.round(straightKm * 10) / 10;
  return { pickup, drop, stops, place, km, route, routeState, routePath: route?.path };
}

function quoteForTrip(vehicle: VehicleId, km: number, kind: Parameters<typeof quoteRide>[2], promo: PromoResult | null, route: DrivingRoutePreview | null) {
  const quote = quoteRide(vehicle, km, kind, promo);
  return route ? { ...quote, minutes: route.durationMinutes } : quote;
}

function RouteAccuracy({ trip }: { trip: { route: DrivingRoutePreview | null; routeState: "loading" | "road" | "approximate"; km: number } }) {
  if (trip.routeState === "loading") {
    return <p className="text-xs text-muted">Calculating road distance and estimated travel time…</p>;
  }
  if (trip.routeState === "road" && trip.route) {
    return <p className="text-xs text-muted">OpenStreetMap road route · {trip.km} km · estimated travel time {trip.route.durationMinutes} min (no live traffic)</p>;
  }
  return <p className="text-xs text-muted">Approximate straight-line distance only · OSRM road routing is temporarily unavailable</p>;
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
      <Header title={copy("vehicleTitle")} subtitle={`${trip.km} km · ${trip.stops.length} extra stops · ${copy("fareNote")}`} onBack={back} />
      <div className="space-y-3 px-4">
        <MapView pickup={trip.pickup} drop={trip.drop} stops={trip.stops} routePath={trip.routePath} className="h-44" />
        <RouteAccuracy trip={trip} />
        {BOOKABLE_VEHICLES.map((item) => {
          const fare = quoteForTrip(item.id, trip.km, trip.place.kind, null, trip.route);
          const selected = vehicle === item.id;
          const blocked = fare.availability === "unavailable";
          return (
            <button
              key={item.id}
              type="button"
              disabled={blocked}
              onClick={() => setVehicle(item.id)}
              aria-pressed={selected}
              className={`kida-vehicle-option flex w-full items-center gap-3 rounded-3xl border p-3 text-left ${selected ? "border-primary bg-primary-soft" : "border-line"} ${blocked ? "opacity-50" : ""}`}
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
                  {item.capacity} {copy("seats")} · ₹{item.perKm}/km · {fare.minutes} {copy("min")} · {fare.arrivalMin} {copy("min")} {copy("away")}
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
  const rides = useRaah((s) => s.rides);
  const removeStop = useRaah((s) => s.removeStop);
  const setTarget = useRaah((s) => s.setPlaceTarget);
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

  const rewardProgress = getCustomerRewardProgress(rides);
  const isCabVehicle = vehicle === "mini" || vehicle === "sedan" || vehicle === "xl";
  const rewardRouteNeedsVerification = rewardProgress.rewardAvailable && isCabVehicle && trip.routeState !== "road";
  const rewardApplied = trip.routeState === "road" && isEligibleCustomerFreeRide(rewardProgress, vehicle, trip.km);
  const standardFare = quoteForTrip(vehicle, trip.km, trip.place.kind, null, trip.route);
  const fare = rewardApplied
    ? { ...standardFare, discount: standardFare.total, total: 0, promoCode: CUSTOMER_FREE_RIDE_CODE }
    : quoteForTrip(vehicle, trip.km, trip.place.kind, promo, trip.route);
  const allocation = calculateFareAllocation(fare.total, false);
  const blocked = fare.availability === "unavailable";
  const invalidSchedule = when !== "now" && new Date(when).getTime() <= Date.now();

  function apply() {
    if (rewardApplied) {
      setNote("Your sixth-ride reward is applied automatically. Promo codes cannot be combined with this free ride.");
      setPromo(null);
      return;
    }
    const result: PromoResult = resolvePromo(promoInput, fare.base + fare.distanceCharge, vehicle, trip!.place.kind, used);
    setNote(promoReason(result.reason));
    setPromo(result.ok ? result : null);
  }

  return (
    <div className="pb-8">
      <Header title={copy("fareDetails")} subtitle={copy("fareNote")} onBack={back} />
      <div className="space-y-3 px-4">
        <div className="space-y-2 rounded-2xl border border-line p-3">
          <MapView pickup={trip.pickup} drop={trip.drop} stops={trip.stops} routePath={trip.routePath} className="h-40" />
          <RouteAccuracy trip={trip} />
          <p className="text-xs font-semibold text-muted">YOUR ROUTE</p>
          <p className="mt-2 text-sm font-semibold">A · {trip.pickup.label}</p>
          {trip.stops.map((stop,index)=>(
            <div key={stop.landmarkId+"-"+index} className="my-2 flex items-center justify-between gap-2 rounded-xl bg-paper px-2 py-2">
              <span className="min-w-0 text-sm">Stop {index+1} · {stop.label}</span>
              <button type="button" onClick={()=>removeStop(index)} className="shrink-0 text-xs font-semibold text-danger">Remove</button>
            </div>
          ))}
          <p className="mt-2 text-sm font-semibold">B · {trip.drop.label}</p>
          <button type="button" disabled={trip.stops.length>=3} onClick={()=>{setTarget("stop");open("destination");}} className="mt-3 h-10 rounded-full border border-line px-3 text-sm font-semibold text-primary disabled:opacity-50">
            + Add stop {trip.stops.length}/3
          </button>
        </div>
        <Row label={copy("distance") + " · " + trip.km + " km × ₹" + (BOOKABLE_VEHICLES.find((item) => item.id === vehicle)?.perKm ?? 0) + "/km"} value={inr(rewardApplied ? standardFare.total : fare.distanceCharge)} />
        {fare.discount > 0 ? <Row label="Reward / discount" value={"−" + inr(fare.discount)} /> : null}
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="font-semibold">{copy("total")}</span>
          <span className="font-display text-3xl tabular">{blocked ? "—" : inr(fare.total)}</span>
        </div>
        {rewardApplied ? (
          <div className="rounded-2xl border border-primary bg-primary-soft p-3">
            <p className="font-semibold text-primary">Your sixth ride is free</p>
            <p className="mt-1 text-sm text-muted">This cab route is below 7 km. Kida will fund the Captain's full fare for this reward ride.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-line p-3">
            <p className="text-sm font-semibold">Fare allocation · included in your fare</p>
            <Row label="Captain earnings (80%)" value={inr(allocation.captainReceives)} />
            <Row label="Kida platform fee (20%)" value={inr(allocation.companyCommission)} />
            <p className="mt-1 text-xs text-muted">The 20% platform share is included in the listed fare; it is not added as a separate surcharge.</p>
          </div>
        )}
        {rewardProgress.rewardPending ? (
          <p className="rounded-xl bg-paper p-3 text-sm text-muted">Your sixth-ride reward is already attached to a booking. Complete or cancel that booking before another reward can be used.</p>
        ) : rewardRouteNeedsVerification ? (
          <p className="rounded-xl bg-paper p-3 text-sm text-muted">Your free cab ride is available, but Kida must verify the actual road distance before applying it. Please retry when road routing is available.</p>
        ) : rewardProgress.rewardAvailable && !rewardApplied ? (
          <p className="rounded-xl bg-paper p-3 text-sm text-muted">{trip.km >= 7 ? "This route is 7 km or longer, so it remains paid. Your free cab ride stays available for a later qualifying route below 7 km." : "You have a free cab ride available. Choose a cab route strictly below 7 km to use it."}</p>
        ) : null}
        <p className="text-xs text-muted">{copy("waitingNote")}</p>
        <div className="flex gap-2">
          <input className={inputClass} value={promoInput} onChange={(e) => setPromoInput(e.target.value.toUpperCase())} placeholder={copy("promoPh")} aria-label={copy("promo")} disabled={rewardApplied} />
          <Btn variant="soft" className="shrink-0" onClick={apply} disabled={rewardApplied}>
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
            min={new Date(Date.now() + 60000).toISOString().slice(0,16)}
            onChange={(event) => setWhen(event.target.value || "now")}
          />
        </label>
        <Btn className="w-full" disabled={blocked || invalidSchedule || trip.routeState === "loading" || rewardRouteNeedsVerification} onClick={() => open("confirm")}>
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
  const rides = useRaah((s) => s.rides);
  const womenPreference = useRaah((s) => s.womenDriverPreference);
  const setWomenPreference = useRaah((s) => s.setWomenDriverPreference);
  const back = useRaah((s) => s.back);
  const confirm = useRaah((s) => s.confirmBooking);
  const trip = useTripKm();
  const place = getPlace(pickup.placeId);
  const { user, isPending: authPending } = useCurrentUserState();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const requestId = useRef<string | null>(null);
  const tripPinRef = useRef<string | null>(null);
  if (!drop || !place || !trip) return null;
  const bookingTrip = trip;
  const rewardProgress = getCustomerRewardProgress(rides);
  const isCabVehicle = vehicle === "mini" || vehicle === "sedan" || vehicle === "xl";
  const rewardRouteNeedsVerification = rewardProgress.rewardAvailable && isCabVehicle && bookingTrip.routeState !== "road";
  const rewardApplied = bookingTrip.routeState === "road" && isEligibleCustomerFreeRide(rewardProgress, vehicle, bookingTrip.km);
  const standardFare = quoteForTrip(vehicle, bookingTrip.km, place.kind, null, bookingTrip.route);
  const fare = rewardApplied
    ? { ...standardFare, discount: standardFare.total, total: 0, promoCode: CUSTOMER_FREE_RIDE_CODE }
    : quoteForTrip(vehicle, bookingTrip.km, place.kind, useRaah.getState().promo, bookingTrip.route);
  const regularTotal = rewardApplied ? standardFare.total : fare.total;

  async function saveBooking() {
    if (!user || saving || rewardRouteNeedsVerification) return;
    setSaving(true);
    setSaveError("");
    try {
      requestId.current ??= crypto.randomUUID();
      tripPinRef.current ??= String(1000 + Math.floor(Math.random() * 9000));
      const result = await createMyBooking({
        data: {
          clientRequestId: requestId.current,
          tripPin: tripPinRef.current,
          serviceMode: "ride",
          vehicleId: vehicle,
          paymentMethod: payment,
          womenDriverRequested: womenPreference,
          pickup,
          dropoff: drop,
          stops: bookingTrip.stops,
          scheduledFor: when === "now" ? null : new Date(when).toISOString(),
          customerRewardCode: rewardApplied ? CUSTOMER_FREE_RIDE_CODE : null,
          farePreview: {
            km: Math.round(bookingTrip.km * 10) / 10,
            minutes: Math.ceil(fare.minutes),
            total: Math.round(fare.total),
            regularTotal: Math.round(regularTotal),
            currency: "INR",
          },
        },
      });
      if (result.status !== "requested") {
        throw new Error("The booking was saved with an unexpected status. Refresh your booking history.");
      }
      if (rewardApplied && !result.is_free_ride) {
        throw new Error("Your sixth-ride reward could not be reserved. Refresh your rides and try again.");
      }
      const tripPin = result.tripPin ?? tripPinRef.current;
      if (!tripPin) throw new Error("Your secure trip PIN could not be created. Refresh your booking and retry.");
      requestId.current = null;
      tripPinRef.current = null;
      confirm(bookingTrip.route?.distanceKm, bookingTrip.route?.durationMinutes, bookingTrip.route?.path, {
        id: result.id,
        status: "requested",
        isFreeRide: result.is_free_ride,
        tripPin,
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Your booking could not be saved. Please retry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pb-8">
      <Header title={copy("confirmRide")} subtitle={copy("proto")} onBack={back} />
      <div className="space-y-3 px-4">
        <MapView pickup={pickup} drop={drop} stops={trip.stops} routePath={trip.routePath} className="h-44" />
        <RouteAccuracy trip={trip} />
        <Stop label={copy("from")} title={pickup.label} line={pickup.line} />
        {trip.stops.map((stop,index)=><Stop key={stop.landmarkId+"-"+index} label={`Stop ${index+1}`} title={stop.label} line={stop.line}/> )}
        <Stop label={copy("to")} title={drop.label} line={drop.line} />
        {(place.kind === "village" || place.kind === "town") && <p className="text-sm text-accent">{copy("villageNote")}</p>}
        <div className="flex items-center gap-3 rounded-3xl border border-line p-3">
          <VehicleArt id={vehicle as VehicleId} />
          <div className="flex-1">
            <p className="font-semibold">{vehicleLabel(lang, vehicle)}</p>
            <p className="text-sm text-muted">
              {payLabel(lang, payment)} · {when === "now" ? copy("now") : when.replace("T", " ")}
            </p>
            {rewardApplied ? <p className="text-xs font-semibold text-primary">Sixth-ride reward · Kida-funded Captain payout</p> : null}
          </div>
          <p className="font-display text-2xl tabular">{inr(fare.total)}</p>
        </div>
        <button type="button" aria-pressed={womenPreference} onClick={()=>setWomenPreference(!womenPreference)} className={`flex min-h-14 w-full items-center justify-between rounded-2xl border px-3 text-left ${womenPreference?"border-primary bg-primary-soft":"border-line"}`}>
          <span><span className="block text-sm font-semibold">Request a woman driver</span><span className="block text-xs text-muted">Preference only · subject to availability and launch support</span></span><span className={`h-6 w-11 rounded-full p-1 ${womenPreference?"bg-primary":"bg-line"}`}><span className={`block size-4 rounded-full bg-white ${womenPreference?"ml-5":""}`}/></span>
        </button>
        {authPending ? (
          <p className="rounded-2xl bg-paper px-3 py-3 text-sm text-muted">Checking your Kida account…</p>
        ) : !user ? (
          <div className="space-y-3 rounded-2xl border border-primary/30 bg-primary-soft p-3">
            <div>
              <p className="font-semibold">Sign in to save this booking</p>
              <p className="mt-1 text-sm text-muted">Your ride request will be stored under your Kida account. Use a verified account session to continue.</p>
            </div>
            <EmailPasswordForm callbackURL="/" />
          </div>
        ) : (
          <Btn className="w-full" disabled={saving || trip.routeState === "loading" || rewardRouteNeedsVerification} onClick={() => void saveBooking()}>
            {saving ? "Saving booking…" : when === "now" ? copy("confirmRide") : copy("scheduleTitle")}
          </Btn>
        )}
        {saveError ? <p role="alert" className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">{saveError}</p> : null}
        {rewardRouteNeedsVerification ? <p className="rounded-xl bg-paper p-3 text-sm text-muted">Your free-ride reward is ready, but the road-distance service is unavailable. Kida will not apply or charge the free ride until the route can be verified.</p> : null}
        <p className="text-xs text-muted">Your ride request is sent to eligible online Kida Captains. Captain matching and status updates are connected; payment collection and final fare settlement are not active in this build.</p>
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
  const activeRideId = useRaah((s) => s.activeRideId);
  const ride = useRaah((s) => s.rides.find((item) => item.id === activeRideId));
  const isBackendRide = Boolean(ride?.backendBookingId);
  useEffect(() => {
    if (isBackendRide) return;
    const id = window.setTimeout(() => assign(), 1400);
    return () => window.clearTimeout(id);
  }, [assign, isBackendRide]);
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <div className="mx-auto size-16 rounded-full bg-primary-soft puck" />
        <h1 className="mt-6 font-display text-3xl">{isBackendRide ? "Finding your Captain" : copy("searching")}</h1>
        <p className="mt-2 text-sm text-muted">
          {isBackendRide
            ? "Your request is visible to eligible online Captains. This screen updates when a Captain accepts."
            : copy("simDriver")}
        </p>
        {isBackendRide ? <p className="mt-4 text-xs text-muted">Keep Kida open. Please do not travel to the pickup until your Captain is confirmed.</p> : null}
      </div>
    </div>
  );
}
