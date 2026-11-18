import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { signIn, authEnabled, GROK_PROVIDERS } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  acceptCaptainBooking,
  advanceCaptainBooking,
  applyForCaptain,
  getMyCaptainPortal,
  setCaptainAvailability,
  updateCaptainLocation,
} from "@/lib/kida/captain-server";
import { MapView } from "@/components/raah/MapView";
import type { Selection } from "@/lib/raah/types";

export const Route = createFileRoute("/captain")({ component: CaptainApp });

type Portal = Awaited<ReturnType<typeof getMyCaptainPortal>>;
type VehicleChoice = "bike" | "auto" | "mini" | "xl";
type ApplicationForm = {
  fullName: string;
  phone: string;
  vehicleId: VehicleChoice;
  registrationNumber: string;
  vehicleMakeModel: string;
  vehicleColour: string;
  serviceCity: string;
  drivingLicence: boolean;
  commercialPermit: boolean;
  insurance: boolean;
};

const initialForm: ApplicationForm = {
  fullName: "",
  phone: "+91",
  vehicleId: "auto",
  registrationNumber: "",
  vehicleMakeModel: "",
  vehicleColour: "",
  serviceCity: "",
  drivingLicence: false,
  commercialPermit: false,
  insurance: false,
};

const VEHICLES: { id: VehicleChoice; label: string }[] = [
  { id: "bike", label: "E-Bike" },
  { id: "auto", label: "Auto" },
  { id: "mini", label: "Mini cab" },
  { id: "xl", label: "7-seater cab" },
];

function money(paise: unknown): string {
  const amount = typeof paise === "number" ? paise : typeof paise === "string" ? Number(paise) : NaN;
  return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount / 100) : "Not configured";
}

function readSelection(value: Record<string, unknown> | null | undefined): Selection | null {
  if (!value) return null;
  const lat = typeof value.lat === "number" ? value.lat : Number(value.lat);
  const lng = typeof value.lng === "number" ? value.lng : Number(value.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const source = value.source;
  const allowed = ["saved", "recent", "search", "map", "gps", "operator", "sample", "google", "osm"] as const;
  const safeSource = allowed.includes(source as (typeof allowed)[number]) ? source as Selection["source"] : "sample";
  return {
    placeId: typeof value.placeId === "string" ? value.placeId : "unknown",
    landmarkId: typeof value.landmarkId === "string" ? value.landmarkId : "",
    label: typeof value.label === "string" ? value.label : "Trip location",
    line: typeof value.line === "string" ? value.line : "",
    lat,
    lng,
    source: safeSource,
  };
}

function Field({ label, value, onChange, placeholder, type = "text", required = true, autoComplete }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-neutral-700">{label}</span>
      <input
        className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 text-base text-neutral-950 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-yellow-300"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
    </label>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm ${className}`}>{children}</section>;
}

function Button({ children, onClick, disabled = false, variant = "dark", type = "button", className = "" }: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "dark" | "yellow" | "light" | "danger";
  type?: "button" | "submit";
  className?: string;
}) {
  const styles = {
    dark: "bg-neutral-950 text-white hover:bg-neutral-800",
    yellow: "bg-[#f5c518] text-neutral-950 hover:bg-[#e8b900]",
    light: "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
    danger: "bg-red-50 text-red-700 hover:bg-red-100",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

function CaptainApp() {
  const { user, isPending } = useCurrentUserState();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [tripPin, setTripPin] = useState("");
  const [tripBusy, setTripBusy] = useState(false);
  const watchId = useRef<number | null>(null);
  const lastLocationSent = useRef(0);

  const refresh = useCallback(async (quiet = false) => {
    if (!user || user.isDevFallback) return;
    if (!quiet) setRefreshing(true);
    try {
      const result = await getMyCaptainPortal();
      setPortal(result);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load your Captain dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.isDevFallback) return;
    setPortal(null);
    let active = true;
    let timer: number | undefined;
    const load = async () => {
      try {
        const result = await getMyCaptainPortal();
        if (active) setPortal(result);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load your Captain dashboard.");
      } finally {
        if (active) {
          setLoading(false);
          timer = window.setTimeout(() => void load(), 6000);
        }
      }
    };
    setLoading(true);
    void load();
    return () => {
      active = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [user]);

  const isOnline = Boolean(portal?.profile?.is_online);
  useEffect(() => {
    if (!isOnline || !navigator.geolocation) return;
    let active = true;
    const send = (position: GeolocationPosition) => {
      const now = Date.now();
      if (now - lastLocationSent.current < 4000) return;
      lastLocationSent.current = now;
      void updateCaptainLocation({
        data: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyM: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null,
          headingDeg: position.coords.heading === null ? null : position.coords.heading,
          speedMps: position.coords.speed === null ? null : position.coords.speed,
        },
      }).catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Captain GPS could not be updated.");
      });
    };
    watchId.current = navigator.geolocation.watchPosition(
      send,
      (cause) => {
        if (!active) return;
        setError(cause.message || "Location permission is required while online.");
        void setCaptainAvailability({ data: { isOnline: false } })
          .then(() => refresh(true))
          .catch(() => undefined);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
    return () => {
      active = false;
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    };
  }, [isOnline, refresh]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const phone = form.phone.replace(/[\s()-]/g, "");
      await applyForCaptain({
        data: {
          fullName: form.fullName.trim(),
          phoneE164: phone,
          vehicleId: form.vehicleId,
          registrationNumber: form.registrationNumber.trim().toUpperCase(),
          vehicleMakeModel: form.vehicleMakeModel.trim(),
          vehicleColour: form.vehicleColour.trim(),
          serviceCity: form.serviceCity.trim(),
          confirmsValidDrivingLicence: form.drivingLicence,
          confirmsCommercialPermit: form.commercialPermit,
          confirmsValidInsurance: form.insurance,
        },
      });
      setNotice("Your Captain application has been submitted for Kida operations review.");
      await refresh(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Application could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleAvailability() {
    setError("");
    setNotice("");
    try {
      if (isOnline) {
        await setCaptainAvailability({ data: { isOnline: false } });
        await refresh(true);
        setNotice("You are now offline.");
        return;
      }
      if (!navigator.geolocation) throw new Error("This device does not support GPS location.");
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, maximumAge: 0, timeout: 20000,
        });
      });
      await setCaptainAvailability({ data: { isOnline: true } });
      await refresh(true);
      setNotice("You are online. Keep Kida open and allow location access while accepting trips.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Availability could not be changed.");
    }
  }

  async function acceptTrip(bookingId: string) {
    setError("");
    setNotice("");
    try {
      await acceptCaptainBooking({ data: { bookingId } });
      await refresh(true);
      setNotice("Trip accepted. Follow the pickup details and update each trip stage.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "This booking is no longer available.");
      await refresh(true);
    }
  }

  async function advanceTrip(bookingId: string, toStatus: "captain_arriving" | "arrived" | "in_progress" | "completed") {
    setTripBusy(true);
    setError("");
    setNotice("");
    try {
      await advanceCaptainBooking({
        data: {
          bookingId,
          toStatus,
          ...(toStatus === "in_progress" ? { tripPin } : {}),
        },
      });
      setTripPin("");
      await refresh(true);
      setNotice(toStatus === "completed" ? "Trip marked completed. Thank you, Captain." : "Trip status updated for the customer.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Trip status could not be updated.");
    } finally {
      setTripBusy(false);
    }
  }

  if (isPending || loading && !portal) {
    return <PageShell><p className="text-sm text-neutral-600">Loading Kida Captain…</p></PageShell>;
  }

  if (!user) {
    return (
      <PageShell>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Kida Captain</p>
          <h1 className="mt-2 text-3xl font-black">Sign in to drive with Kida</h1>
          <p className="mt-2 text-sm text-neutral-600">Use your own Kida account. Customer and Captain permissions are checked separately by the server.</p>
          {authEnabled ? (
            <div className="mt-5 grid gap-2">
              {GROK_PROVIDERS.map((provider) => (
                <Button key={provider.providerId} variant="dark" onClick={() => void signIn(provider.providerId, { callbackURL: "/captain" })}>
                  Continue with {provider.label}
                </Button>
              ))}
            </div>
          ) : <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Account authentication must be enabled before Captain registration.</p>}
        </Card>
      </PageShell>
    );
  }

  if (user.isDevFallback) {
    return (
      <PageShell>
        <Card>
          <h1 className="text-2xl font-black">Captain access needs a verified account</h1>
          <p className="mt-2 text-sm text-neutral-600">This preview is using a shared development identity. Captain applications and trips require a real, individually authenticated Kida account.</p>
        </Card>
      </PageShell>
    );
  }

  if (!portal) {
    return <PageShell><Card><p className="text-sm text-neutral-600">Loading your Captain profile…</p>{error ? <Alert>{error}</Alert> : null}<Button variant="light" onClick={() => void refresh()}>Retry</Button></Card></PageShell>;
  }

  if (!portal.hasCaptainRole && portal.application?.status !== "approved") {
    if (portal.application) {
      const state = portal.application.status;
      return (
        <PageShell>
          <Card>
            <TopLabel>Captain application</TopLabel>
            <h1 className="mt-2 text-2xl font-black">
              {state === "pending_review" ? "Application received" : state === "needs_changes" ? "Changes required" : "Application not approved"}
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              {state === "pending_review"
                ? "Kida operations must review your driving licence, commercial vehicle permit, insurance and vehicle details before activating your Captain account."
                : portal.application.reviewer_note || "Please contact Kida operations for the next steps."}
            </p>
            <div className="mt-4 rounded-2xl bg-neutral-50 p-3 text-sm">
              <p><b>Vehicle:</b> {portal.application.vehicle_id.toUpperCase()} · {portal.application.registration_number}</p>
              <p><b>City:</b> {portal.application.service_city}</p>
              <p><b>Status:</b> {state.replaceAll("_", " ")}</p>
            </div>
            <Button variant="light" onClick={() => void refresh()}>Refresh application status</Button>
          </Card>
        </PageShell>
      );
    }
    return (
      <PageShell>
        <Card>
          <TopLabel>Become a Kida Captain</TopLabel>
          <h1 className="mt-2 text-3xl font-black">Your road. Your workday.</h1>
          <p className="mt-2 text-sm text-neutral-600">Submit your details to begin Kida's Captain onboarding. This form is not a document-verification approval.</p>
          <form className="mt-5 space-y-4" onSubmit={(event) => void submitApplication(event)}>
            <Field label="Full name" value={form.fullName} onChange={(value) => setForm((s) => ({ ...s, fullName: value }))} placeholder="As on driving licence" autoComplete="name" />
            <Field label="Mobile number" value={form.phone} onChange={(value) => setForm((s) => ({ ...s, phone: value }))} type="tel" autoComplete="tel" placeholder="+91…" />
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-neutral-700">Vehicle category</span>
              <select value={form.vehicleId} onChange={(event) => setForm((s) => ({ ...s, vehicleId: event.target.value as VehicleChoice }))}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 text-base text-neutral-950">
                {VEHICLES.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.label}</option>)}
              </select>
            </label>
            <Field label="Vehicle registration number" value={form.registrationNumber} onChange={(value) => setForm((s) => ({ ...s, registrationNumber: value.toUpperCase() }))} placeholder="TN 00 AB 0000" />
            <Field label="Vehicle make and model" value={form.vehicleMakeModel} onChange={(value) => setForm((s) => ({ ...s, vehicleMakeModel: value }))} placeholder="e.g. vehicle make and model" />
            <Field label="Vehicle colour" value={form.vehicleColour} onChange={(value) => setForm((s) => ({ ...s, vehicleColour: value }))} placeholder="e.g. white" />
            <Field label="Operating city" value={form.serviceCity} onChange={(value) => setForm((s) => ({ ...s, serviceCity: value }))} placeholder="e.g. Coimbatore" />
            <div className="rounded-2xl border border-neutral-200 p-3">
              <p className="text-sm font-bold">Required declarations</p>
              <p className="mt-1 text-xs text-neutral-500">You must hold all applicable valid documents. Kida operations will inspect and verify them before approval.</p>
              {[
                ["drivingLicence", "I hold a valid driving licence for this vehicle category."],
                ["commercialPermit", "This vehicle has the required commercial registration and permit."],
                ["insurance", "This vehicle has valid insurance and required fitness / PUC documents."],
              ].map(([key, label]) => (
                <label key={key} className="mt-3 flex gap-3 text-sm text-neutral-800">
                  <input type="checkbox" checked={form[key as "drivingLicence" | "commercialPermit" | "insurance"]}
                    onChange={(event) => setForm((s) => ({ ...s, [key]: event.target.checked }))} required />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <Button type="submit" disabled={submitting || !form.drivingLicence || !form.commercialPermit || !form.insurance} variant="yellow">
              {submitting ? "Submitting…" : "Submit Captain application"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-neutral-500">Kida does not accept private vehicles as commercial partners. Approval depends on document, vehicle and local operating-rule verification.</p>
        </Card>
      </PageShell>
    );
  }

  if (!portal.profile || portal.profile.approval_status !== "approved") {
    return (
      <PageShell>
        <Card>
          <TopLabel>Captain activation</TopLabel>
          <h1 className="mt-2 text-2xl font-black">Your documents are being verified</h1>
          <p className="mt-2 text-sm text-neutral-600">Kida operations must approve your Captain profile and vehicle records before you can receive any customer bookings.</p>
          {error ? <Alert>{error}</Alert> : null}
          <Button variant="light" onClick={() => void refresh()}>Refresh status</Button>
        </Card>
      </PageShell>
    );
  }

  const profile = portal.profile;
  const active = portal.activeBooking;
  const nextAction = active?.status === "accepted" ? "captain_arriving"
    : active?.status === "captain_arriving" ? "arrived"
      : active?.status === "arrived" ? "in_progress"
        : active?.status === "in_progress" ? "completed" : null;
  const activePickup = readSelection(active?.pickup);
  const activeDrop = readSelection(active?.dropoff);

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-3">
        <div>
          <TopLabel>Captain workspace</TopLabel>
          <h1 className="mt-1 text-3xl font-black">Hello, Captain</h1>
          <p className="text-sm text-neutral-600">{profile.service_city} · {profile.registration_number}</p>
        </div>
        <span className={`rounded-full px-3 py-2 text-xs font-bold ${isOnline ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-600"}`}>
          {isOnline ? "ONLINE" : "OFFLINE"}
        </span>
      </div>

      {error ? <Alert>{error}</Alert> : null}
      {notice ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p> : null}

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold">Your availability</p>
            <p className="mt-1 text-xs text-neutral-500">Go online to receive matching customer bookings.</p>
          </div>
          <Button variant={isOnline ? "light" : "yellow"} disabled={!portal.canAcceptRides && !isOnline} onClick={() => void toggleAvailability()}>
            {isOnline ? "Go offline" : "Go online"}
          </Button>
        </div>
        {!portal.canAcceptRides ? (
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            {portal.wallet?.required_balance_paise === null || portal.wallet?.required_balance_paise === undefined
              ? "Kida operations must configure the approved compulsory opening ledger balance before Captains can accept rides."
              : "Your Captain wallet does not currently meet the eligibility requirement. Contact Kida operations."}
          </p>
        ) : null}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-neutral-50 p-3">
            <p className="text-xs text-neutral-500">Wallet balance</p>
            <p className="mt-1 text-xl font-black tabular-nums">{money(portal.wallet?.balance_paise)}</p>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-3">
            <p className="text-xs text-neutral-500">Completed today</p>
            <p className="mt-1 text-xl font-black tabular-nums">{portal.completedToday}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-neutral-500">Wallet and trip earnings are read-only previews in this first Captain build. Payments, commission deductions and payouts are not connected.</p>
      </Card>

      {active ? (
        <Card>
          <TopLabel>Active customer booking</TopLabel>
          <h2 className="mt-1 text-xl font-black">{active.status.replaceAll("_", " ")}</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="rounded-xl bg-neutral-50 p-3"><p className="text-xs font-bold text-neutral-500">PICKUP</p><p className="font-semibold">{typeof active.pickup.label === "string" ? active.pickup.label : "Pickup location"}</p><p className="text-neutral-500">{typeof active.pickup.line === "string" ? active.pickup.line : ""}</p></div>
            <div className="rounded-xl bg-neutral-50 p-3"><p className="text-xs font-bold text-neutral-500">DESTINATION</p><p className="font-semibold">{typeof active.dropoff.label === "string" ? active.dropoff.label : "Destination"}</p><p className="text-neutral-500">{typeof active.dropoff.line === "string" ? active.dropoff.line : ""}</p></div>
          </div>
          {activePickup && activeDrop ? <div className="mt-3"><MapView pickup={activePickup} drop={activeDrop} stops={(active.stops ?? []).map((stop) => readSelection(stop)).filter((stop): stop is Selection => Boolean(stop))} className="h-52" caption="Customer pickup and destination" /></div> : null}
          {active.status === "arrived" ? (
            <div className="mt-4">
              <Field label="Enter the customer's 4-digit trip PIN" value={tripPin} onChange={(value) => setTripPin(value.replace(/\D/g, "").slice(0, 4))} placeholder="0000" />
              <p className="mt-1 text-xs text-neutral-500">Ask the customer to show the PIN in their Kida app. Do not start the trip without verifying it.</p>
            </div>
          ) : null}
          {nextAction ? (
            <Button className="mt-4 w-full" variant="yellow" disabled={tripBusy || (nextAction === "in_progress" && tripPin.length !== 4)}
              onClick={() => void advanceTrip(active.id, nextAction)}>
              {tripBusy ? "Updating…" : nextAction === "captain_arriving" ? "Start towards pickup" : nextAction === "arrived" ? "I have arrived" : nextAction === "in_progress" ? "Verify PIN & start trip" : "Complete trip"}
            </Button>
          ) : <p className="mt-3 text-sm text-neutral-600">This booking is awaiting an update.</p>}
        </Card>
      ) : (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div><TopLabel>Nearby booking requests</TopLabel><h2 className="mt-1 text-xl font-black">{portal.availableBookings.length} available</h2></div>
            <Button variant="light" onClick={() => void refresh(true)}>{refreshing ? "Refreshing…" : "Refresh"}</Button>
          </div>
          {!isOnline ? <p className="mt-3 text-sm text-neutral-600">Go online to see bookings for your approved vehicle category.</p>
            : portal.availableBookings.length === 0 ? <p className="mt-3 text-sm text-neutral-600">No matching customer requests right now. Kida will refresh this list automatically.</p>
            : (
              <div className="mt-4 space-y-3">
                {portal.availableBookings.map((booking) => (
                  <article key={booking.id} className="rounded-2xl border border-neutral-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase text-neutral-500">{booking.vehicle_id} booking</span>
                      {booking.is_free_ride ? <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-900">Kida-funded reward ride</span> : null}
                    </div>
                    <p className="mt-2 font-semibold">{typeof booking.pickup.label === "string" ? booking.pickup.label : "Pickup location"}</p>
                    <p className="text-xs text-neutral-500">{typeof booking.pickup.line === "string" ? booking.pickup.line : ""}</p>
                    <p className="my-2 text-sm">↓ {typeof booking.dropoff.label === "string" ? booking.dropoff.label : "Destination"}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{booking.client_fare_preview?.total ? money(Number(booking.client_fare_preview.total) * 100) : "Fare estimate pending"}</span>
                      <Button variant="dark" onClick={() => void acceptTrip(booking.id)}>Accept trip</Button>
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">Customer fare estimate only · not guaranteed Captain earnings.</p>
                  </article>
                ))}
              </div>
            )}
        </Card>
      )}

      <div className="flex justify-between gap-3 pb-6">
        <p className="text-xs text-neutral-500">Kida Captain · Version 1</p>
        <button type="button" onClick={() => void refresh()} className="text-xs font-bold text-neutral-600 underline">Refresh dashboard</button>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-[#f5f4ef] px-4 py-6 text-neutral-950">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <a href="/" className="inline-flex w-fit items-center gap-2 text-sm font-black tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-[#f5c518] text-sm">K</span>
          KIDA <span className="font-medium text-neutral-500">CAPTAIN</span>
        </a>
        {children}
      </div>
    </main>
  );
}

function TopLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500">{children}</p>;
}

function Alert({ children }: { children: ReactNode }) {
  return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{children}</p>;
}
