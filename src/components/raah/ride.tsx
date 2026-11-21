import { useEffect, useState } from "react";
import { cancelMyBooking, createMySupportTicket, rateMyCompletedRide } from "@/lib/kida/server";
import { createLiveTripShare } from "@/lib/kida/client-requirements-server";
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
  const backendRide = Boolean(ride?.backendBookingId);

  useEffect(() => {
    if (backendRide) return;
    const id = window.setInterval(() => tick(), 800);
    return () => window.clearInterval(id);
  }, [tick, backendRide]);

  if (!ride) {
    return <div className="px-4 py-8"><p className="text-muted">{copy("searching")}</p></div>;
  }

  if (backendRide && !ride.driver) {
    return (
      <div className="px-4 py-8">
        <Header title="Finding your Captain" subtitle="Your Kida ride request is being matched." />
        <div className="mt-4 rounded-3xl border border-line bg-paper p-4">
          <p className="font-semibold">Waiting for an eligible Captain</p>
          <p className="mt-1 text-sm text-muted">Kida will update this screen after a Captain accepts. Keep the app open to receive dispatch updates.</p>
        </div>
      </div>
    );
  }

  if (!ride.driver) {
    return (
      <div className="px-4 py-8">
        <p className="text-muted">{copy("searching")}</p>
        <Btn className="mt-4" onClick={() => useRaah.getState().replace("home")}>{copy("navHome")}</Btn>
      </div>
    );
  }

  const leftKm = Math.max(0.2, Math.round(ride.fare.km * (1 - ride.progress) * 10) / 10);
  const leftMin = Math.max(1, Math.round(ride.fare.minutes * (1 - ride.progress)));
  const statusLabel = ride.backendStatus === "in_progress"
    ? "Trip in progress"
    : ride.backendStatus === "arrived"
      ? "Captain has arrived"
      : ride.backendStatus === "captain_arriving"
        ? "Captain is on the way"
        : ride.backendStatus === "accepted"
          ? "Captain accepted your ride"
          : ride.status === "ongoing" ? copy("onTrip") : copy("arriving");

  return (
    <div className="pb-6">
      <div className="px-4 pt-3">
        <MapView
          pickup={ride.pickup}
          drop={ride.drop}
          stops={ride.stops ?? []}
          routePath={ride.routePath}
          captainLocation={ride.captainLocation}
          className="h-72"
        />
      </div>
      <div className="space-y-3 px-4 pt-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted">{statusLabel}</p>
            <p className="font-display text-3xl tabular">
              {backendRide
                ? ride.backendStatus === "in_progress" ? "On the way" : ride.backendStatus === "arrived" ? "At pickup" : "Captain assigned"
                : `${leftMin} ${copy("min")}`}
            </p>
            <p className="text-sm text-muted tabular">
              {backendRide
                ? ride.captainLocation ? "Captain location is updating" : "Waiting for the latest Captain location"
                : `${leftKm} km · ${copy("trackSim")}`}
            </p>
          </div>
          <Pill tone={backendRide ? "ok" : "warn"}>{backendRide ? "Kida dispatch" : ride.source === "call" ? copy("callCta") : copy("proto")}</Pill>
        </div>
        {!backendRide ? (
          <div className="h-2 overflow-hidden rounded-full bg-paper">
            <div className="h-full bg-primary" style={{ width: `${Math.round(ride.progress * 100)}%` }} />
          </div>
        ) : null}
        <div className="kida-card flex items-center gap-3 rounded-3xl border border-line p-3">
          {ride.driver.photoUrl ? <img src={ride.driver.photoUrl} alt={ride.driver.name + " verified Captain photograph"} className="size-14 rounded-full border border-line object-cover" /> : <Avatar name={ride.driver.name} className="size-14" />}
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{ride.driver.name}</p>
            <p className="text-sm text-muted">
              {ride.driver.rating ? `${ride.driver.rating} ★${ride.driver.ratingCount ? ` · ${ride.driver.ratingCount} ratings` : ""} · ` : ""}
              {ride.driver.colour ?? (backendRide ? "Verified Kida Captain" : "")}
            </p>
            <p className="text-xs text-muted">{backendRide ? "Assigned through Kida" : copy("simDriver")}</p>
            {backendRide && ride.driver.licenceIdentifier ? <p className="text-xs text-muted">Licence ID / ULIN: {ride.driver.licenceIdentifier}</p> : null}
          </div>
          <div className="rounded-lg border-2 border-ink bg-road px-2 py-1 text-center">
            <p className="text-xs font-semibold">{copy("plate")}</p>
            <p className="font-semibold tabular">{ride.driver.plate ?? "Vehicle verified"}</p>
          </div>
        </div>
        {ride.tripPin ? (
          <div className="rounded-2xl border border-primary bg-primary-soft px-3 py-3">
            <p className="text-xs font-semibold text-muted">YOUR RIDE PIN</p>
            <p className="mt-1 font-display text-3xl tracking-[0.3em] tabular">{ride.tripPin}</p>
            <p className="mt-1 text-xs text-muted">Show this PIN to the Captain only after you have reached the pickup and verified the vehicle.</p>
          </div>
        ) : null}
        <div className="grid grid-cols-4 gap-2">
          <div className="grid h-16 place-items-center rounded-2xl bg-paper text-center text-xs font-semibold opacity-70 cursor-not-allowed" aria-disabled="true" title="Captain calling will be enabled with the masked-call provider">
            <Phone className="size-5" />
            {copy("callDriver")}
          </div>
          <button type="button" onClick={() => open("chat")} className="grid h-16 place-items-center rounded-2xl bg-paper text-xs font-semibold">
            <MessageCircle className="size-5" />{copy("message")}
          </button>
          <button type="button" onClick={() => open("share")} className="grid h-16 place-items-center rounded-2xl bg-paper text-xs font-semibold">
            <Share2 className="size-5" />{copy("shareTrip")}
          </button>
          <button type="button" onClick={() => open("sos")} className="grid h-16 place-items-center rounded-2xl bg-danger-soft text-xs font-semibold text-danger">
            <ShieldAlert className="size-5" />{copy("sos")}
          </button>
        </div>
        <p className="text-xs text-muted">
          {vehicleLabel(lang, ride.vehicle)} · {backendRide ? "Captain contact and payments are not enabled yet." : copy("callDriver") + " is a prototype action."}
        </p>
        {!backendRide ? (
          <div className="grid grid-cols-2 gap-2">
            <Btn variant="line" onClick={() => setWhy((value) => !value)}>{copy("cancelRide")}</Btn>
            <Btn variant="soft" onClick={complete}>{copy("endDemo")}</Btn>
          </div>
        ) : (
          <p className="rounded-xl bg-paper p-3 text-sm text-muted">Your Captain's trip progress and location will refresh automatically. Payments are not being collected in this build.</p>
        )}
        {why && !backendRide ? <CancelBox /> : null}
      </div>
    </div>
  );
}

function CancelBox() {
  const copy = useCopy();
  const cancelLocal = useRaah((s) => s.cancelRide);
  const ride = useRide(true);
  const setToast = useRaah((s) => s.setToast);
  const [saving, setSaving] = useState(false);
  const reasons = ["Plans changed", "Wrong pickup", "Wait is too long", "Booked by mistake"];

  async function cancel(reason: string) {
    if (!ride || saving) return;
    if (!ride.backendBookingId) {
      cancelLocal(reason);
      return;
    }
    setSaving(true);
    try {
      const result = await cancelMyBooking({ data: { bookingId: ride.backendBookingId, reason } });
      if (!result) {
        setToast("This booking can only be cancelled before Captain acceptance.");
        return;
      }
      useRaah.setState((state) => ({
        rides: state.rides.map((item) => item.backendBookingId === ride.backendBookingId
          ? { ...item, status: "cancelled", backendStatus: "cancelled", cancelReason: reason }
          : item),
        activeRideId: null,
        screen: "history",
        stack: [],
        toast: "Your booking request has been cancelled.",
      }));
    } catch {
      setToast("Your booking could not be cancelled. Please retry.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="rounded-2xl bg-paper p-3">
      <p className="mb-2 text-sm font-semibold">{copy("cancelWhy")}</p>
      <div className="flex flex-wrap gap-2">
        {reasons.map((reason) => (
          <button key={reason} type="button" disabled={saving} onClick={() => void cancel(reason)} className="h-10 rounded-full bg-surface px-3 text-sm disabled:opacity-50">
            {reason}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">{ride?.backendBookingId ? "Cancellation is allowed only while the request is awaiting a Captain. No cancellation fee is processed in this build." : "No cancellation fee is charged in this prototype."}</p>
    </div>
  );
}

export function CompleteScreen() {
  const copy = useCopy();
  const ride = useRide(false);
  const rate = useRaah((s) => s.rateRide);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [tipAmount, setTipAmount] = useState(0);
  const [ratingBusy, setRatingBusy] = useState(false);
  const [ratingError, setRatingError] = useState("");
  async function submitRating() {
    if (!ride || ratingBusy) return;
    setRatingBusy(true);
    setRatingError("");
    try {
      if (ride.backendBookingId && ride.backendStatus === "completed") {
        await rateMyCompletedRide({ data: { bookingId: ride.backendBookingId, rating: stars, feedback: text } });
      }
      rate(stars, text, tipAmount);
    } catch (cause) {
      setRatingError(cause instanceof Error ? cause.message : "Your rating could not be saved. Please try again.");
    } finally {
      setRatingBusy(false);
    }
  }
  if (!ride) return null;
  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-4xl">{copy("completed")}</h1>
      <p className="mt-2 text-sm text-muted">{copy("trackSim")}</p>
      <p className="mt-4 font-display text-5xl tabular">{inr(ride.fare.total)}</p>
      <p className="text-sm text-muted">
        {ride.fare.km} km · {payLabel(useRaah.getState().lang, ride.payment)}
      </p>
      <div className="mt-5 rounded-3xl border border-line p-3">
        <p className="font-semibold">Say thanks to your Captain</p>
        <p className="mt-1 text-sm text-muted">Choose a tip amount for this preview. No money is collected or transferred.</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[0, 20, 50, 100].map((amount) => (
            <button key={amount} type="button" aria-pressed={tipAmount === amount} onClick={() => setTipAmount(amount)} className={`h-11 rounded-xl border text-sm font-semibold ${tipAmount === amount ? "border-primary bg-primary-soft" : "border-line"}`}>
              {amount === 0 ? "No tip" : `₹${amount}`}
            </button>
          ))}
        </div>
        {tipAmount > 0 ? <p className="mt-3 text-sm font-semibold">Preview total: {inr(ride.fare.total + tipAmount)}</p> : null}
      </div>
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
      {ratingError ? <p role="alert" className="mt-3 text-sm text-danger">{ratingError}</p> : null}
      <Btn className="mt-4 w-full" disabled={ratingBusy} onClick={() => void submitRating()}>
        {ratingBusy ? "Saving rating…" : copy("done")}
      </Btn>
    </div>
  );
}

export function HistoryScreen() {
  const copy = useCopy();
  const rides = useRaah((s) => s.rides);
  const serviceRequests = useRaah((s) => s.serviceRequests);
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
        {list.length === 0 && serviceRequests.length === 0 ? <p className="text-sm text-muted">{copy("emptyRides")}</p> : null}
        {list.map((ride) => (
          <article key={ride.id} className="kida-ride-card rounded-3xl border border-line p-3">
            <button type="button" onClick={() => select(ride.id)} className="flex w-full items-center gap-3 text-left">
              <VehicleArt id={ride.vehicle} className="h-10 w-16" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{ride.drop.label}</span>
                <span className="block truncate text-sm text-muted">{ride.pickup.label}</span>
              </span>
              <span className="text-right">
                <span className="block font-semibold tabular">{inr(ride.fare.total + (ride.tipAmount ?? 0))}</span>
                <Pill tone={ride.status === "cancelled" ? "danger" : ride.status === "completed" ? "ok" : "warn"}>
                {ride.backendBookingId
                  ? ride.backendStatus === "requested" ? "Request saved"
                    : ride.backendStatus === "searching" ? "Awaiting Captain match"
                    : ride.backendStatus === "no_captain" ? "No Captain available"
                    : ride.backendStatus === "expired" ? "Request expired"
                    : ride.backendStatus === "in_progress" ? "In progress"
                    : ride.backendStatus === "completed" ? "Completed"
                    : ride.backendStatus === "cancelled" ? "Cancelled"
                    : ride.backendStatus?.replaceAll("_", " ") ?? "Backend booking"
                  : ride.status}
              </Pill>
              </span>
            </button>
            {ride.status === "scheduled" && !ride.backendBookingId ? (
              <Btn className="mt-3 w-full" variant="soft" onClick={() => start(ride.id)}>
                {copy("bookNow")}
              </Btn>
            ) : null}
          </article>
        ))}
        {serviceRequests.length > 0 ? (
          <section className="space-y-2 pt-3">
            <h2 className="text-sm font-semibold text-muted">Other service requests</h2>
            {serviceRequests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{request.service === "parcel" ? "Parcel delivery" : request.service === "intercity" ? "Outstation trip" : request.service === "rental" ? "Hourly rental" : request.service === "airport" ? "Airport transfer" : request.service === "transit" ? "Metro & Transit tickets" : request.service === "shared" ? "Auto Share & Group Ride" : "Pet-friendly ride"}</p>
                  <Pill tone="warn">Saved on device</Pill>
                </div>
                <p className="mt-1 text-sm text-muted">{request.pickup.label}{request.drop ? ` → ${request.drop.label}` : ""}</p>
                <p className="mt-1 text-xs text-muted">{new Date(request.createdAt).toLocaleString("en-IN")} · Request preview only; not dispatched</p>
              </article>
            ))}
          </section>
        ) : null}
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
  const [reporting, setReporting] = useState(false);
  const [reportNotice, setReportNotice] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelNotice, setCancelNotice] = useState("");
  if (!ride) return null;
  const selectedRide = ride;

  async function cancelBookingRequest() {
    if (!selectedRide.backendBookingId || cancelling) return;
    setCancelling(true);
    setCancelNotice("");
    try {
      const result = await cancelMyBooking({
        data: { bookingId: selectedRide.backendBookingId, reason: "Cancelled by customer" },
      });
      if (!result) {
        setCancelNotice("This booking can only be cancelled while it is awaiting a Captain.");
        return;
      }
      useRaah.setState((state) => ({
        rides: state.rides.map((item) => item.backendBookingId === selectedRide.backendBookingId
          ? { ...item, status: "cancelled", backendStatus: "cancelled", cancelReason: "Cancelled by customer" }
          : item),
        activeRideId: null,
        toast: "Your booking request has been cancelled.",
      }));
    } catch {
      setCancelNotice("Cancellation failed. Please retry.");
    } finally {
      setCancelling(false);
    }
  }

  async function submitRideReport(kind: "issue" | "lost", message: string) {
    const clean = message.trim();
    if (clean.length < 3 || reporting) return;
    if (!selectedRide.backendBookingId) {
      report(kind, clean);
      if (kind === "lost") setLost("");
      else setIssue("");
      return;
    }
    setReporting(true);
    setReportNotice("");
    try {
      const result = await createMySupportTicket({
        data: {
          bookingId: selectedRide.backendBookingId,
          topic: kind === "lost" ? "lost_item" : "booking",
          message: clean,
        },
      });
      useRaah.setState((state) => ({
        tickets: [{
          id: result.id,
          topic: result.topic,
          text: result.message,
          status: "Open",
          at: result.created_at,
          backend: true,
        }, ...state.tickets.filter((ticket) => ticket.id !== result.id)],
      }));
      setReportNotice("Your report has been saved to your Kida account. No Captain or support agent has been notified yet.");
      if (kind === "lost") setLost("");
      else setIssue("");
    } catch {
      setReportNotice("Your report could not be saved. Please retry or call Kida support.");
    } finally {
      setReporting(false);
    }
  }
  return (
    <div className="pb-8">
      <Header title={copy("receipt")} subtitle={new Date(ride.createdAt).toLocaleString("en-IN")} onBack={back} />
      <div className="space-y-3 px-4">
        <p className="text-sm text-muted">{selectedRide.backendBookingId ? "Customer booking request saved to your Kida account" : ride.source === "call" ? "Booked by the call desk · prototype" : "Booked in the app · prototype"}</p>
        {selectedRide.backendBookingId ? (
          <div className="space-y-2 rounded-xl bg-primary-soft p-3">
            <p className="text-xs text-muted">Current backend status: {ride.backendStatus?.replaceAll("_", " ")}. Captain matching, live tracking and payment are not connected yet.</p>
            {ride.backendStatus === "requested" || ride.backendStatus === "searching" ? (
              <Btn variant="line" className="w-full" disabled={cancelling} onClick={() => void cancelBookingRequest()}>
                {cancelling ? "Cancelling…" : "Cancel booking request"}
              </Btn>
            ) : null}
            {cancelNotice ? <p role="alert" className="text-xs text-danger">{cancelNotice}</p> : null}
          </div>
        ) : null}
        <StopLine label={copy("from")} value={ride.pickup.line} />
        {(ride.stops ?? []).map((stop,index)=><StopLine key={stop.landmarkId+"-"+index} label={`Stop ${index+1}`} value={stop.line}/>) }
        <StopLine label={copy("to")} value={ride.drop.line} />
        <div className="rounded-3xl border border-line p-3">
          <Row k={copy("base")} v={inr(ride.fare.base)} />
          <Row k={copy("distance")} v={inr(ride.fare.distanceCharge)} />
          <Row k={copy("tax")} v={inr(ride.fare.tax)} />
          <Row k={copy("discount")} v={inr(ride.fare.discount)} />
          <Row k={copy("total")} v={inr(ride.fare.total)} />
          {(ride.tipAmount ?? 0) > 0 ? <Row k="Captain tip (preview only)" v={inr(ride.tipAmount ?? 0)} /> : null}
          <p className="mt-2 text-sm text-muted">
            {vehicleLabel(lang, ride.vehicle)} · {payLabel(lang, ride.payment)} · {ride.backendStatus?.replaceAll("_", " ") ?? ride.status}
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
        <Btn variant="line" className="w-full" disabled={reporting || lost.trim().length < 3} onClick={() => void submitRideReport("lost", lost)}>
          {reporting ? "Saving report…" : copy("lost")}
        </Btn>
        <label className="block text-sm font-medium">
          {copy("issue")}
          <textarea className="mt-1 min-h-20 w-full rounded-2xl border border-line bg-paper p-3" value={issue} onChange={(e) => setIssue(e.target.value)} />
        </label>
        <Btn variant="soft" className="w-full" disabled={reporting || issue.trim().length < 3} onClick={() => void submitRideReport("issue", issue)}>
          {reporting ? "Saving report…" : copy("issue")}
        </Btn>
        {reportNotice ? <p role="status" className="text-sm text-muted">{reportNotice}</p> : null}
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
  }
  return (
    <div>
      <Header title={copy("chatTitle")} subtitle="Messaging preview · not delivered to a Captain" onBack={back} />
      <div className="mx-4 mb-3 rounded-xl bg-primary-soft px-3 py-2 text-xs text-muted">Messages are stored locally in this preview. Live driver chat will activate after dispatch and realtime messaging are connected.</div>
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
  const [message,setMessage] = useState("");
  async function share() {
    if (!ride) return;
    if (ride.backendBookingId) {
      try {
        const created = await createLiveTripShare({ data: { bookingId: ride.backendBookingId } });
        const liveUrl = window.location.origin + "/share/" + created.token;
        if (navigator.share) {
          await navigator.share({ title: "Kida live trip", text: "Track this Kida trip using the private link.", url: liveUrl });
          setMessage("Live trip link shared. It expires automatically in 12 hours.");
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(liveUrl);
          setMessage("Live trip link copied. It expires automatically in 12 hours.");
        } else { setMessage(liveUrl); }
      } catch (cause) { setMessage(cause instanceof Error ? cause.message : "A live trip link could not be created."); }
      return;
    }
    const route = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${ride.pickup.lat}%2C${ride.pickup.lng}%3B${ride.drop.lat}%2C${ride.drop.lng}`;
    const details = [
      "Kida trip details",
      `Driver: ${ride.driver?.name ?? "Not assigned in this preview"}`,
      `Vehicle: ${ride.driver?.plate ?? "Not assigned"}`,
      `Pickup: ${ride.pickup.line}`,
      `Drop: ${ride.drop.line}`,
      `Trip status: ${ride.status}`,
      route,
      "This is a trip details share, not a live tracking link.",
    ].join("\\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Kida trip details", text: details, url: route });
        setMessage("Share sheet opened.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(details);
        setMessage("Trip details copied. Share them with someone you trust.");
      } else {
        setMessage("Sharing is not supported on this device.");
      }
    } catch {
      setMessage("Sharing was cancelled or unavailable.");
    }
  }
  return (
    <div>
      <Header title={copy("shareTitle")} subtitle="Share ride details with someone you trust" onBack={back} />
      <div className="space-y-3 px-4">
        <div className="kida-card rounded-3xl border border-line p-4">
          <p className="text-xs font-semibold text-primary">KIDA TRIP DETAILS</p>
          <p className="mt-2 font-display text-2xl">{ride?.driver?.name ?? "Driver not assigned"}</p>
          <p className="tabular text-lg">{ride?.driver?.plate ?? "Vehicle not assigned"}</p>
          <p className="mt-2 text-sm text-muted">{ride?.pickup.line}</p>
          <p className="text-sm text-muted">{ride?.drop.line}</p>
          <p className="mt-3 text-xs text-muted">{ride?.backendBookingId ? "This private link shows trip status and the latest available Captain GPS. It expires after 12 hours." : "This prototype ride can share details only. Live trip links are available for account-backed Kida bookings."}</p>
        </div>
        <button type="button" onClick={() => void share()} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-ink"><Share2 className="size-4"/> {ride?.backendBookingId ? "Create live trip link" : "Share trip details"}</button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
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
