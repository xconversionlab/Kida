import { useEffect, useState } from "react";
import { MessageCircle, Phone, Share2, ShieldAlert } from "lucide-react";
import { company } from "@/lib/raah/company";
import { payLabel, vehicleLabel } from "@/lib/raah/labels";
import { inr } from "@/lib/raah/pricing";
import { useRaah } from "@/lib/raah/store";
import type { RideStatus } from "@/lib/raah/types";
import { VehicleArt } from "./art";
import { MapView } from "./MapView";
import { Avatar, Btn, Header, inputClass, Pill, useCopy } from "./ui";

export function TrackingScreen() {
  const copy = useCopy();
  const lang = useRaah((s) => s.lang);
  const ride = useRide(true);
  const tick = useRaah((s) => s.tickRide);
  const complete = useRaah((s) => s.completeRide);
  const open = useRaah((s) => s.open);
  const [why, setWhy] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => tick(), 800);
    return () => window.clearInterval(id);
  }, [tick]);
  if (!ride || !ride.driver) {
    return (
      <div className="px-4 py-8">
        <p className="text-muted">{copy("searching")}</p>
        <Btn className="mt-4" onClick={() => useRaah.getState().replace("home")}>
          {copy("navHome")}
        </Btn>
      </div>
    );
  }
  const leftKm = Math.max(0.2, Math.round(ride.fare.km * (1 - ride.progress) * 10) / 10);
  const leftMin = Math.max(1, Math.round(ride.fare.minutes * (1 - ride.progress)));
  const phase = ride.status === "ongoing" ? "to_drop" : "to_pickup";
  return (
    <div className="pb-6">
      <div className="px-4 pt-3">
        <MapView
          pickup={ride.pickup}
          drop={ride.drop}
          progress={ride.progress}
          phase={phase}
          className="h-72"
          caption={copy("trackSim")}
        />
      </div>
      <div className="space-y-3 px-4 pt-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted">{ride.status === "ongoing" ? copy("onTrip") : copy("arriving")}</p>
            <p className="font-display text-4xl tabular">
              {leftMin} {copy("min")}
            </p>
            <p className="text-sm text-muted tabular">
              {leftKm} km · {copy("trackSim")}
            </p>
          </div>
          <Pill tone="warn">{ride.source === "call" ? copy("callCta") : copy("proto")}</Pill>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-paper">
          <div className="h-full bg-primary" style={{ width: `${Math.round(ride.progress * 100)}%` }} />
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-line p-3">
          <Avatar name={ride.driver.name} className="size-14" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{ride.driver.name}</p>
            <p className="text-sm text-muted">
              {ride.driver.rating} · {ride.driver.trips} trips · {ride.driver.colour}
            </p>
            <p className="text-xs text-muted">{copy("simDriver")}</p>
          </div>
          <div className="rounded-lg border-2 border-ink bg-road px-2 py-1 text-center">
            <p className="text-xs font-semibold">{copy("plate")}</p>
            <p className="font-semibold tabular">{ride.driver.plate}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <a href={`tel:${company.supportTel}`} className="grid h-16 place-items-center rounded-2xl bg-paper text-center text-xs font-semibold">
            <Phone className="size-5" />
            {copy("callDriver")}
          </a>
          <button type="button" onClick={() => open("chat")} className="grid h-16 place-items-center rounded-2xl bg-paper text-xs font-semibold">
            <MessageCircle className="size-5" />
            {copy("message")}
          </button>
          <button type="button" onClick={() => open("share")} className="grid h-16 place-items-center rounded-2xl bg-paper text-xs font-semibold">
            <Share2 className="size-5" />
            {copy("shareTrip")}
          </button>
          <button type="button" onClick={() => open("sos")} className="grid h-16 place-items-center rounded-2xl bg-danger-soft text-xs font-semibold text-danger">
            <ShieldAlert className="size-5" />
            {copy("sos")}
          </button>
        </div>
        <p className="text-xs text-muted">
          {vehicleLabel(lang, ride.vehicle)} · {copy("callDriver")} opens your dialer for the prototype desk, not a live driver.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="line" onClick={() => setWhy((v) => !v)}>
            {copy("cancelRide")}
          </Btn>
          <Btn variant="soft" onClick={complete}>
            {copy("endDemo")}
          </Btn>
        </div>
        {why ? <CancelBox /> : null}
      </div>
    </div>
  );
}

function CancelBox() {
  const copy = useCopy();
  const cancel = useRaah((s) => s.cancelRide);
  const reasons = ["Plans changed", "Wrong pickup", "Wait is too long", "Booked by mistake"];
  return (
    <div className="rounded-2xl bg-paper p-3">
      <p className="mb-2 text-sm font-semibold">{copy("cancelWhy")}</p>
      <div className="flex flex-wrap gap-2">
        {reasons.map((reason) => (
          <button key={reason} type="button" onClick={() => cancel(reason)} className="h-10 rounded-full bg-surface px-3 text-sm">
            {reason}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">No cancellation fee is charged in this prototype.</p>
    </div>
  );
}

export function CompleteScreen() {
  const copy = useCopy();
  const ride = useRide(false);
  const rate = useRaah((s) => s.rateRide);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  if (!ride) return null;
  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-4xl">{copy("completed")}</h1>
      <p className="mt-2 text-sm text-muted">{copy("trackSim")}</p>
      <p className="mt-4 font-display text-5xl tabular">{inr(ride.fare.total)}</p>
      <p className="text-sm text-muted">
        {ride.fare.km} km · {payLabel(useRaah.getState().lang, ride.payment)}
      </p>
      <p className="mt-6 font-semibold">{copy("rate")}</p>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setStars(n)}
            className={`grid size-12 place-items-center rounded-2xl text-lg font-semibold ${n <= stars ? "bg-accent text-accent-ink" : "bg-paper"}`}
            aria-label={`${n}`}
          >
            {n}
          </button>
        ))}
      </div>
      <textarea
        className="mt-3 min-h-24 w-full rounded-2xl border border-line bg-paper p-3 text-base outline-none"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={copy("feedbackPh")}
      />
      <Btn className="mt-4 w-full" onClick={() => rate(stars, text)}>
        {copy("done")}
      </Btn>
    </div>
  );
}

export function HistoryScreen() {
  const copy = useCopy();
  const rides = useRaah((s) => s.rides);
  const select = useRaah((s) => s.selectRide);
  const start = useRaah((s) => s.startScheduled);
  const [tab, setTab] = useState<RideStatus | "all">("all");
  const filters: { id: RideStatus | "all"; label: string }[] = [
    { id: "all", label: copy("filterAll") },
    { id: "scheduled", label: copy("upcoming") },
    { id: "arriving", label: copy("active") },
    { id: "completed", label: copy("completed") },
    { id: "cancelled", label: copy("cancelled") },
  ];
  const list = rides.filter((ride) => {
    if (tab === "all") return true;
    if (tab === "arriving") return ride.status === "arriving" || ride.status === "ongoing" || ride.status === "searching";
    return ride.status === tab;
  });
  return (
    <div className="pb-4">
      <Header title={copy("navRides")} />
      <div className="flex gap-2 overflow-x-auto px-4">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`h-10 shrink-0 rounded-full px-3 text-sm font-semibold ${tab === item.id ? "bg-ink text-surface" : "bg-paper"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-2 px-4">
        {list.length === 0 ? <p className="text-sm text-muted">{copy("emptyRides")}</p> : null}
        {list.map((ride) => (
          <article key={ride.id} className="rounded-3xl border border-line p-3">
            <button type="button" onClick={() => select(ride.id)} className="flex w-full items-center gap-3 text-left">
              <VehicleArt id={ride.vehicle} className="h-10 w-16" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{ride.drop.label}</span>
                <span className="block truncate text-sm text-muted">{ride.pickup.label}</span>
              </span>
              <span className="text-right">
                <span className="block font-semibold tabular">{inr(ride.fare.total)}</span>
                <Pill tone={ride.status === "cancelled" ? "danger" : ride.status === "completed" ? "ok" : "warn"}>{ride.status}</Pill>
              </span>
            </button>
            {ride.status === "scheduled" ? (
              <Btn className="mt-3 w-full" variant="soft" onClick={() => start(ride.id)}>
                {copy("bookNow")}
              </Btn>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

export function RideDetail() {
  const copy = useCopy();
  const lang = useRaah((s) => s.lang);
  const ride = useSelected();
  const back = useRaah((s) => s.back);
  const report = useRaah((s) => s.reportOnRide);
  const [lost, setLost] = useState("");
  const [issue, setIssue] = useState("");
  if (!ride) return null;
  return (
    <div className="pb-8">
      <Header title={copy("receipt")} subtitle={new Date(ride.createdAt).toLocaleString("en-IN")} onBack={back} />
      <div className="space-y-3 px-4">
        <p className="text-sm text-muted">{ride.source === "call" ? "Booked by the call desk · prototype" : "Booked in the app · prototype"}</p>
        <StopLine label={copy("from")} value={ride.pickup.line} />
        <StopLine label={copy("to")} value={ride.drop.line} />
        <div className="rounded-3xl border border-line p-3">
          <Row k={copy("base")} v={inr(ride.fare.base)} />
          <Row k={copy("distance")} v={inr(ride.fare.distanceCharge)} />
          <Row k={copy("tax")} v={inr(ride.fare.tax)} />
          <Row k={copy("discount")} v={inr(ride.fare.discount)} />
          <Row k={copy("total")} v={inr(ride.fare.total)} />
          <p className="mt-2 text-sm text-muted">
            {vehicleLabel(lang, ride.vehicle)} · {payLabel(lang, ride.payment)} · {ride.status}
          </p>
          {ride.driver ? (
            <p className="mt-1 text-sm">
              {ride.driver.name} · {ride.driver.plate} · {ride.driver.rating}
            </p>
          ) : null}
          {ride.rating ? <p className="mt-1 text-sm">Your rating: {ride.rating}</p> : null}
          {ride.cancelReason ? <p className="mt-1 text-sm text-muted">{ride.cancelReason}</p> : null}
        </div>
        <label className="block text-sm font-medium">
          {copy("lost")}
          <input className={`${inputClass} mt-1`} value={lost} onChange={(e) => setLost(e.target.value)} />
        </label>
        <Btn variant="line" className="w-full" disabled={lost.trim().length < 3} onClick={() => report("lost", lost)}>
          {copy("lost")}
        </Btn>
        <label className="block text-sm font-medium">
          {copy("issue")}
          <textarea className="mt-1 min-h-20 w-full rounded-2xl border border-line bg-paper p-3" value={issue} onChange={(e) => setIssue(e.target.value)} />
        </label>
        <Btn variant="soft" className="w-full" disabled={issue.trim().length < 3} onClick={() => report("issue", issue)}>
          {copy("issue")}
        </Btn>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{k}</span>
      <span className="tabular">{v}</span>
    </div>
  );
}

function StopLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="text-xs font-semibold text-muted">{label}</span>
      <span className="block">{value}</span>
    </p>
  );
}

export function ChatScreen() {
  const copy = useCopy();
  const ride = useRide(true);
  const back = useRaah((s) => s.back);
  const add = useRaah((s) => s.addMessage);
  const [text, setText] = useState("");
  function send(value: string) {
    const clean = value.trim();
    if (!clean) return;
    add(clean, "you");
    setText("");
    window.setTimeout(() => useRaah.getState().addMessage(copy("driverReply"), "driver"), 600);
  }
  return (
    <div>
      <Header title={copy("chatTitle")} subtitle={copy("chatSim")} onBack={back} />
      <div className="space-y-2 px-4">
        {(ride?.messages ?? []).map((message, index) => (
          <p key={index} className={`max-w-xs rounded-2xl px-3 py-2 text-sm ${message.from === "you" ? "ml-auto bg-primary text-primary-ink" : "bg-paper"}`}>
            {message.text}
          </p>
        ))}
        <div className="flex flex-wrap gap-2 pt-2">
          {[copy("quick1"), copy("quick2"), copy("quick3")].map((item) => (
            <button key={item} type="button" onClick={() => send(item)} className="h-10 rounded-full bg-paper px-3 text-sm">
              {item}
            </button>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <input className={inputClass} value={text} onChange={(e) => setText(e.target.value)} aria-label={copy("message")} />
          <Btn className="shrink-0" onClick={() => send(text)}>
            {copy("message")}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function ShareScreen() {
  const copy = useCopy();
  const ride = useRide(true) ?? useSelected();
  const back = useRaah((s) => s.back);
  return (
    <div>
      <Header title={copy("shareTitle")} subtitle={copy("shareBody")} onBack={back} />
      <div className="px-4">
        <div className="rounded-3xl border border-line p-4">
          <p className="text-xs font-semibold text-primary">RAAH TRIP PREVIEW</p>
          <p className="mt-2 font-display text-2xl">{ride?.driver?.name ?? "Driver not assigned"}</p>
          <p className="tabular text-lg">{ride?.driver?.plate}</p>
          <p className="mt-2 text-sm text-muted">{ride?.pickup.line}</p>
          <p className="text-sm text-muted">{ride?.drop.line}</p>
          <p className="mt-3 text-xs text-muted">Not a public link. Expires when a live trip would end.</p>
        </div>
      </div>
    </div>
  );
}

function useRide(activeOnly: boolean) {
  const rides = useRaah((s) => s.rides);
  const activeId = useRaah((s) => s.activeRideId);
  const selected = useRaah((s) => s.selectedRideId);
  const id = activeOnly ? activeId : selected;
  return rides.find((ride) => ride.id === id) ?? null;
}

function useSelected() {
  const rides = useRaah((s) => s.rides);
  const selected = useRaah((s) => s.selectedRideId);
  return rides.find((ride) => ride.id === selected) ?? null;
}
