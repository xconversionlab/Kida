import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getOperationsDashboard, reviewCaptainApplication } from "@/lib/kida/operations-server";
import { CampaignManager } from "@/components/kida/CampaignManager";
import { SupportDesk } from "@/components/kida/SupportDesk";
import {
  emptyCaptainDocumentChecks,
  isCaptainApplicationApprovalReady,
  type CaptainDocumentChecks,
} from "@/lib/kida/operations-review";

export const Route = createFileRoute("/operations")({ component: OperationsDashboard });

type Dashboard = Awaited<ReturnType<typeof getOperationsDashboard>>;
type Filter = "needs_review" | "all" | "approved" | "needs_changes" | "rejected";
type Decision = "approved" | "rejected" | "needs_changes";

const DOCUMENTS: { key: keyof CaptainDocumentChecks; label: string; description: string }[] = [
  { key: "identity", label: "Identity document", description: "Original identity document checked" },
  { key: "drivingLicence", label: "Driving licence", description: "Valid for the selected vehicle category" },
  { key: "commercialPermit", label: "Commercial permit", description: "Commercial registration and permit checked" },
  { key: "insurance", label: "Vehicle insurance", description: "Current and valid insurance checked" },
  { key: "fitnessPuc", label: "Fitness / PUC", description: "Required fitness and pollution documents checked" },
  { key: "vehicleRegistration", label: "Vehicle registration", description: "Registration details match the actual vehicle" },
];

function money(paise: string | null): string {
  if (paise === null) return "Not configured";
  const amount = Number(paise);
  if (!Number.isFinite(amount)) return "Not configured";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount / 100);
}

function dateLabel(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function statusLabel(status: string): string {
  return status.replaceAll("_", " ");
}

function statusClass(status: string): string {
  if (status === "approved") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "rejected") return "border-red-200 bg-red-50 text-red-800";
  if (status === "needs_changes") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-blue-200 bg-blue-50 text-blue-800";
}

function tripStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    requested: "Requested",
    searching: "Searching",
    accepted: "Accepted",
    captain_arriving: "Captain en route",
    arrived: "Captain arrived",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
    expired: "Expired",
    no_captain: "No Captain found",
  };
  return labels[status] ?? status.replaceAll("_", " ");
}

function tripStatusClass(status: string): string {
  if (status === "completed") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "cancelled" || status === "expired" || status === "no_captain") return "border-red-200 bg-red-50 text-red-800";
  if (status === "in_progress") return "border-violet-200 bg-violet-50 text-violet-800";
  if (status === "requested" || status === "searching") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-blue-200 bg-blue-50 text-blue-800";
}

function fareLabel(value: string | null): string {
  if (value === null) return "Fare preview unavailable";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Fare preview unavailable";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function OperationsDashboard() {
  const { user, isPending } = useCurrentUserState();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<Filter>("needs_review");
  const [selectedId, setSelectedId] = useState("");
  const [decision, setDecision] = useState<Decision | null>(null);
  const [reviewerNote, setReviewerNote] = useState("");
  const [documentChecks, setDocumentChecks] = useState<CaptainDocumentChecks>(emptyCaptainDocumentChecks());
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async (quiet = false) => {
    if (!user) return;
    if (!quiet) setRefreshing(true);
    try {
      const result = await getOperationsDashboard();
      setDashboard(result);
      setAccessDenied(false);
      setError("");
      setSelectedId((current) => {
        if (current && result.applications.some((item) => item.id === current)) return current;
        const firstReview = result.applications.find((item) => item.status === "pending_review" || item.status === "needs_changes");
        return firstReview?.id ?? result.applications[0]?.id ?? "";
      });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Operations dashboard could not be loaded.";
      setError(message);
      setAccessDenied(message.toLowerCase().includes("not authorised"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setDashboard(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    void refresh(true);
    const interval = window.setInterval(() => {
      if (active) void refresh(true);
    }, 8000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [user, refresh]);

  const selected = dashboard?.applications.find((item) => item.id === selectedId) ?? null;
  const filteredApplications = useMemo(() => {
    const items = dashboard?.applications ?? [];
    if (filter === "needs_review") return items.filter((item) => item.status === "pending_review" || item.status === "needs_changes");
    if (filter === "all") return items;
    return items.filter((item) => item.status === filter);
  }, [dashboard, filter]);

  useEffect(() => {
    if (selected && !filteredApplications.some((item) => item.id === selected.id)) {
      setSelectedId(filteredApplications[0]?.id ?? "");
    }
  }, [filteredApplications, selected]);

  function beginDecision(next: Decision) {
    setDecision(next);
    setReviewerNote("");
    setDocumentChecks(emptyCaptainDocumentChecks());
    setError("");
    setNotice("");
  }

  async function submitDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !decision) return;
    if (decision === "approved" && !isCaptainApplicationApprovalReady(documentChecks)) {
      setError("Complete every original-document check before approving this Captain.");
      return;
    }
    if (!reviewerNote.trim()) {
      setError("Add an operations review note before submitting this decision.");
      return;
    }
    const confirmed = window.confirm(
      decision === "approved"
        ? "Approve this Captain application and activate the Captain role? Wallet eligibility will remain separately enforced."
        : decision === "rejected"
          ? "Reject this Captain application?"
          : "Return this Captain application and request changes?",
    );
    if (!confirmed) return;

    setSaving(true);
    setError("");
    setNotice("");
    try {
      await reviewCaptainApplication({
        data: {
          applicationId: selected.id,
          decision,
          reviewerNote: reviewerNote.trim(),
          documentChecks,
        },
      });
      const successMessage = decision === "approved"
        ? "Captain approved and account activated. Online eligibility is still controlled by the wallet gate."
        : decision === "rejected"
          ? "Captain application rejected. The decision has been recorded."
          : "Changes requested. The applicant can update and resubmit their application.";
      setNotice(successMessage);
      setDecision(null);
      setReviewerNote("");
      setDocumentChecks(emptyCaptainDocumentChecks());
      await refresh(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The review decision could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  if (isPending) return <PageShell><p className="text-sm text-neutral-600">Checking Kida account…</p></PageShell>;

  if (!user) {
    return (
      <PageShell>
        <Panel>
          <Eyebrow>Kida internal access</Eyebrow>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Operations sign in</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">Sign in with the Kida account that has been explicitly granted the admin role.</p>
          <EmailPasswordForm callbackURL="/operations" />
        </Panel>
      </PageShell>
    );
  }

  if (accessDenied) {
    return (
      <PageShell>
        <Panel>
          <Eyebrow>Restricted workspace</Eyebrow>
          <h1 className="mt-2 text-2xl font-black">Operations access required</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">This account does not have the Kida admin role. Captain applicants and Captains cannot access application records or review actions.</p>
          <p className="mt-3 text-xs text-neutral-500">Ask an authorised database owner to provision the operations account using docs/OPERATIONS_DASHBOARD.md.</p>
          <a href="/" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-neutral-200 px-4 text-sm font-bold">Return to Kida</a>
        </Panel>
      </PageShell>
    );
  }

  if (!dashboard || loading) {
    return (
      <PageShell>
        <Panel>
          <p className="text-sm text-neutral-600">Loading Kida operations…</p>
          {error ? <Alert>{error}</Alert> : null}
          <ActionButton variant="light" onClick={() => void refresh()}>Retry</ActionButton>
        </Panel>
      </PageShell>
    );
  }

  const summary = dashboard.summary;
  const requiredBalance = dashboard.walletPolicy.requiredOpeningBalancePaise;

  return (
    <main className="min-h-dvh bg-[#f6f5f0] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#f5c518] text-lg font-black">K</span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Kida internal</p>
              <h1 className="text-2xl font-black tracking-tight">Operations</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">{user.displayName || "Operations admin"}</p>
              <p className="text-xs text-neutral-500">{user.primaryEmail}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a href="/captain" className="inline-flex min-h-10 items-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-bold hover:bg-neutral-50">Captain app</a>
              <a href="/" className="inline-flex min-h-10 items-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-bold hover:bg-neutral-50">Customer app</a>
            </div>
          </div>
        </header>

        <section className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Eyebrow>Captain onboarding</Eyebrow>
            <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Application review</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">Verify original documents, review vehicle details and record every decision. Approval activates the Captain account but does not fund or unlock the wallet.</p>
          </div>
          <ActionButton variant="light" disabled={refreshing} onClick={() => void refresh()}>{refreshing ? "Refreshing…" : "Refresh applications"}</ActionButton>
        </section>

        {notice ? <Notice>{notice}</Notice> : null}
        {error ? <Alert>{error}</Alert> : null}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Metric label="Total applications" value={summary.total} />
          <Metric label="Pending review" value={summary.pending_review} emphasize />
          <Metric label="Changes requested" value={summary.needs_changes} />
          <Metric label="Approved" value={summary.approved} />
          <Metric label="Rejected" value={summary.rejected} />
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-amber-950">Captain wallet eligibility gate</p>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                {dashboard.walletPolicy.isConfigured
                  ? "A Captain can go online only when the wallet is not suspended and its balance meets the configured company opening-balance requirement."
                  : "The compulsory opening balance has not been configured. All Captains remain unable to go online or accept rides, even after approval."}
              </p>
            </div>
            <span className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm font-black text-amber-950">Required: {money(requiredBalance)}</span>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>Shared customer and Captain dispatch</Eyebrow>
              <h2 className="mt-1 text-2xl font-black tracking-tight">Live trips</h2>
              <p className="mt-1 text-sm text-neutral-600">Bookings from the Customer app and trip updates from the Captain app appear here automatically.</p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">Auto-refresh · 8 seconds</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Metric label="Active bookings" value={dashboard.tripSummary.active_bookings} />
            <Metric label="Awaiting Captain" value={dashboard.tripSummary.awaiting_captain} emphasize />
            <Metric label="Assigned trips" value={dashboard.tripSummary.assigned_trips} />
            <Metric label="In progress" value={dashboard.tripSummary.in_progress} />
            <Metric label="Completed today" value={dashboard.tripSummary.completed_today} />
            <Metric label="Captains online" value={dashboard.tripSummary.online_captains} />
          </div>
          {dashboard.trips.length === 0 ? (
            <Panel>
              <h3 className="font-black">No live customer bookings yet</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-600">When a customer creates a booking using a signed-in Kida account, it will appear here. The Captain app and Operations dashboard read from the same booking records.</p>
            </Panel>
          ) : (
            <div className="grid gap-3">
              {dashboard.trips.map((trip) => (
                <Panel key={trip.id} className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">{trip.service_mode.replaceAll("_", " ")} · {trip.vehicle_id.toUpperCase()} · {trip.id.slice(0, 8)}</p>
                      <h3 className="mt-1 text-lg font-black">{trip.customer_name}</h3>
                      <p className="mt-1 text-xs text-neutral-500">Requested {dateLabel(trip.requested_at)}{trip.scheduled_for ? " · Scheduled " + dateLabel(trip.scheduled_for) : ""}</p>
                    </div>
                    <span className={"rounded-full border px-3 py-1.5 text-xs font-black " + tripStatusClass(trip.status)}>{tripStatusLabel(trip.status)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Info label="Pickup" value={trip.pickup_label + (trip.pickup_line && trip.pickup_line !== trip.pickup_label ? " · " + trip.pickup_line : "")} />
                    <Info label="Destination" value={trip.dropoff_label + (trip.dropoff_line && trip.dropoff_line !== trip.dropoff_label ? " · " + trip.dropoff_line : "")} />
                    <Info label="Assigned Captain" value={trip.captain_name ? trip.captain_name + (trip.captain_registration_number ? " · " + trip.captain_registration_number : "") : "Awaiting assignment"} />
                    <Info label="Fare preview" value={fareLabel(trip.fare_total)} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Captain location</p>
                      {trip.captain_latitude && trip.captain_longitude ? (
                        <p className="mt-1 text-sm font-semibold">{Number(trip.captain_latitude).toFixed(5)}, {Number(trip.captain_longitude).toFixed(5)} · updated {trip.captain_location_updated_at ? dateLabel(trip.captain_location_updated_at) : "just now"}</p>
                      ) : (
                        <p className="mt-1 text-sm text-neutral-500">No fresh Captain GPS location (latest 90-second window).</p>
                      )}
                    </div>
                    {trip.captain_latitude && trip.captain_longitude ? (
                      <a
                        href={"https://www.google.com/maps?q=" + encodeURIComponent(trip.captain_latitude + "," + trip.captain_longitude)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 items-center rounded-xl border border-neutral-200 px-3 text-xs font-bold hover:bg-neutral-50"
                      >
                        Open Captain location
                      </a>
                    ) : null}
                    <p className="text-xs text-neutral-500">Last update {dateLabel(trip.updated_at)}</p>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </section>

        <SupportDesk />

        <CampaignManager />

        <section className="grid items-start gap-4 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.4fr)]">
          <Panel className="overflow-hidden p-0">
            <div className="border-b border-neutral-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-black">Applications</h3>
                <span className="text-xs text-neutral-500">{filteredApplications.length} shown</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {([
                  ["needs_review", "Needs review"],
                  ["all", "All"],
                  ["approved", "Approved"],
                  ["needs_changes", "Changes"],
                  ["rejected", "Rejected"],
                ] as [Filter, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={[
                      "rounded-full border px-3 py-1.5 text-xs font-bold",
                      filter === value ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[72vh] overflow-y-auto">
              {filteredApplications.length === 0 ? (
                <div className="p-5 text-sm text-neutral-500">No applications in this view.</div>
              ) : filteredApplications.map((application) => (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(application.id);
                    setDecision(null);
                    setReviewerNote("");
                    setDocumentChecks(emptyCaptainDocumentChecks());
                    setError("");
                  }}
                  className={[
                    "block w-full border-b border-neutral-100 p-4 text-left transition hover:bg-neutral-50",
                    selected?.id === application.id ? "bg-[#fff8da] ring-1 ring-inset ring-[#e3b900]" : "bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-black">{application.full_name}</p>
                      <p className="mt-1 text-xs text-neutral-500">{application.vehicle_id.toUpperCase()} · {application.service_city}</p>
                    </div>
                    <span className={"shrink-0 rounded-full border px-2 py-1 text-[10px] font-black capitalize " + statusClass(application.status)}>{statusLabel(application.status)}</span>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">{application.registration_number} · {dateLabel(application.submitted_at)}</p>
                </button>
              ))}
            </div>
          </Panel>

          {selected ? (
            <div className="space-y-4">
              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Eyebrow>Applicant details</Eyebrow>
                    <h3 className="mt-1 text-2xl font-black">{selected.full_name}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{selected.account_email}</p>
                  </div>
                  <span className={"rounded-full border px-3 py-1.5 text-xs font-black capitalize " + statusClass(selected.status)}>{statusLabel(selected.status)}</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Info label="Mobile number" value={selected.phone_e164} />
                  <Info label="Kida account" value={selected.account_name || "Account holder"} />
                  <Info label="Application received" value={dateLabel(selected.submitted_at)} />
                  <Info label="Application ID" value={selected.id} mono />
                </div>
                <div className="mt-5 border-t border-neutral-100 pt-4">
                  <Eyebrow>Vehicle information</Eyebrow>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Info label="Vehicle category" value={selected.vehicle_id.toUpperCase()} />
                    <Info label="Registration number" value={selected.registration_number} />
                    <Info label="Make and model" value={selected.vehicle_make_model} />
                    <Info label="Colour" value={selected.vehicle_colour} />
                    <Info label="Operating city" value={selected.service_city} />
                  </div>
                </div>
                <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
                  <p className="text-sm font-black">Applicant declarations</p>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    <Declaration label="Driving licence" checked={selected.confirms_valid_driving_licence} />
                    <Declaration label="Commercial permit" checked={selected.confirms_commercial_permit} />
                    <Declaration label="Insurance" checked={selected.confirms_valid_insurance} />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-neutral-500">These are applicant declarations only. They are not proof that a document is valid.</p>
                </div>
                {selected.reviewer_note ? (
                  <div className="mt-4 rounded-2xl border border-neutral-200 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-neutral-500">Latest operations note</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{selected.reviewer_note}</p>
                    {selected.reviewed_at ? <p className="mt-2 text-xs text-neutral-500">Reviewed {dateLabel(selected.reviewed_at)}{selected.reviewed_by_name ? " by " + selected.reviewed_by_name : ""}</p> : null}
                  </div>
                ) : null}
              </Panel>

              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Eyebrow>Activation and wallet</Eyebrow>
                    <h3 className="mt-1 text-lg font-black">Ride eligibility</h3>
                  </div>
                  <span className={[
                    "rounded-full px-3 py-1.5 text-xs font-black",
                    selected.can_accept_rides ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900",
                  ].join(" ")}>
                    {selected.can_accept_rides ? "Eligible to accept rides" : "Not eligible to go online"}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Info label="Wallet balance" value={money(selected.wallet_balance_paise)} />
                  <Info label="Required balance" value={money(selected.required_opening_balance_paise)} />
                  <Info label="Wallet state" value={selected.wallet_balance_paise === null ? "Not created" : selected.wallet_is_suspended ? "Suspended" : "Active"} />
                  <Info label="Online state" value={selected.is_online === null ? "Not activated" : selected.is_online ? "Online" : "Offline"} />
                </div>
                <p className="mt-3 text-xs leading-5 text-neutral-500">Approval never deposits funds or changes the company-required opening balance. The server and database independently enforce wallet eligibility before Captain availability and trip acceptance.</p>
              </Panel>

              {(selected.status === "pending_review" || selected.status === "needs_changes") ? (
                <Panel>
                  <Eyebrow>Operations decision</Eyebrow>
                  <h3 className="mt-1 text-lg font-black">Review this application</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">Check the original documents in person before approving. Kida does not currently collect document uploads in this application.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ActionButton variant="approve" onClick={() => beginDecision("approved")}>Approve Captain</ActionButton>
                    <ActionButton variant="light" onClick={() => beginDecision("needs_changes")}>Request changes</ActionButton>
                    <ActionButton variant="reject" onClick={() => beginDecision("rejected")}>Reject</ActionButton>
                  </div>
                  {decision ? (
                    <form className="mt-5 space-y-4 border-t border-neutral-100 pt-4" onSubmit={(event) => void submitDecision(event)}>
                      <div>
                        <p className="text-sm font-black">{decision === "approved" ? "Confirm document verification" : decision === "rejected" ? "Reject application" : "Request applicant changes"}</p>
                        {decision === "approved" ? (
                          <div className="mt-3 space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-3">
                            {DOCUMENTS.map((document) => (
                              <label key={document.key} className="flex items-start gap-3 rounded-xl bg-white p-3">
                                <input
                                  type="checkbox"
                                  checked={documentChecks[document.key]}
                                  onChange={(event) => setDocumentChecks((current) => ({ ...current, [document.key]: event.target.checked }))}
                                  className="mt-1 size-4 accent-neutral-950"
                                />
                                <span>
                                  <span className="block text-sm font-bold">{document.label}</span>
                                  <span className="block text-xs text-neutral-500">{document.description}</span>
                                </span>
                              </label>
                            ))}
                            <p className="text-xs leading-5 text-amber-950">By approving, you confirm that you personally inspected the original documents and matched them to this applicant and vehicle. Do not tick a check based only on the applicant's declaration.</p>
                          </div>
                        ) : null}
                      </div>
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-bold">Operations review note</span>
                        <textarea
                          value={reviewerNote}
                          onChange={(event) => setReviewerNote(event.target.value)}
                          minLength={4}
                          maxLength={1000}
                          required
                          rows={4}
                          placeholder={decision === "approved"
                            ? "Record the checks completed and any operational notes. Do not enter document numbers."
                            : decision === "rejected"
                              ? "Explain the reason for rejection."
                              : "List the exact changes or documents the applicant must provide."}
                          className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-yellow-300"
                        />
                        <span className="mt-1 block text-xs text-neutral-500">{reviewerNote.length}/1000 characters · Do not record document numbers or sensitive identity details.</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <ActionButton
                          type="submit"
                          disabled={saving || !reviewerNote.trim() || (decision === "approved" && !isCaptainApplicationApprovalReady(documentChecks))}
                          variant={decision === "approved" ? "approve" : decision === "rejected" ? "reject" : "dark"}
                        >
                          {saving ? "Saving decision…" : decision === "approved" ? "Confirm approval and activate" : decision === "rejected" ? "Confirm rejection" : "Send changes request"}
                        </ActionButton>
                        <ActionButton variant="light" disabled={saving} onClick={() => setDecision(null)}>Cancel</ActionButton>
                      </div>
                    </form>
                  ) : null}
                </Panel>
              ) : null}
            </div>
          ) : (
            <Panel>
              <h3 className="font-black">Select an application</h3>
              <p className="mt-1 text-sm text-neutral-500">Choose an applicant from the list to inspect the details and review history.</p>
            </Panel>
          )}
        </section>

        <footer className="border-t border-neutral-200 py-4 text-xs leading-5 text-neutral-500">
          Kida Operations · Admin-only workspace · Review actions are recorded in the application audit history. Approval does not bypass the Captain wallet eligibility gate.
        </footer>
      </div>
    </main>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-[#f6f5f0] px-4 py-6 text-neutral-950">
      <div className="mx-auto w-full max-w-xl space-y-4">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-black">
          <span className="grid size-9 place-items-center rounded-xl bg-[#f5c518]">K</span>
          KIDA <span className="font-medium text-neutral-500">OPERATIONS</span>
        </a>
        {children}
      </div>
    </main>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={["rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm", className].join(" ")}>{children}</section>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500">{children}</p>;
}

function Metric({ label, value, emphasize = false }: { label: string; value: number; emphasize?: boolean }) {
  return (
    <Panel className={emphasize ? "border-amber-200 bg-amber-50" : ""}>
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-black tabular-nums">{value}</p>
    </Panel>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">{label}</p>
      <p className={["mt-1 break-words text-sm font-semibold", mono ? "font-mono text-xs" : ""].join(" ")}>{value}</p>
    </div>
  );
}

function Declaration({ label, checked }: { label: string; checked: boolean }) {
  return (
    <p className="flex items-center gap-2 text-xs font-semibold">
      <span className={checked ? "size-2 rounded-full bg-emerald-600" : "size-2 rounded-full bg-red-500"} />
      {label}: {checked ? "Declared" : "Not declared"}
    </p>
  );
}

function ActionButton({ children, onClick, disabled = false, type = "button", variant = "dark" }: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "dark" | "light" | "approve" | "reject";
}) {
  const styles = {
    dark: "bg-neutral-950 text-white hover:bg-neutral-800",
    light: "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
    approve: "bg-emerald-700 text-white hover:bg-emerald-800",
    reject: "bg-red-700 text-white hover:bg-red-800",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={["inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40", styles[variant]].join(" ")}
    >
      {children}
    </button>
  );
}

function Alert({ children }: { children: ReactNode }) {
  return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">{children}</p>;
}

function Notice({ children }: { children: ReactNode }) {
  return <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">{children}</p>;
}
