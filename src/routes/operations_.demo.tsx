import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  CarFront,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Search,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/operations/demo")({ component: OperationsDemo });

type Status = "pending_review" | "needs_changes" | "approved" | "rejected";
type Filter = "needs_review" | "all" | Status;

type DemoApplication = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  vehicle: string;
  registration: string;
  submitted: string;
  status: Status;
  note: string;
  wallet: number;
  required: number;
  suspended: boolean;
  documentsChecked: number;
};

const initialApplications: DemoApplication[] = [
  {
    id: "KD-DEMO-1024",
    name: "Arun Kumar",
    phone: "+91 98XXX 21452",
    email: "arun.demo@example.com",
    city: "Coimbatore · Saravanampatti",
    vehicle: "Auto rickshaw",
    registration: "TN 66 AB 2145",
    submitted: "Today · 10:42 AM",
    status: "pending_review",
    note: "Awaiting original document verification.",
    wallet: 320000,
    required: 200000,
    suspended: false,
    documentsChecked: 3,
  },
  {
    id: "KD-DEMO-1025",
    name: "Meena Raj",
    phone: "+91 97XXX 08316",
    email: "meena.demo@example.com",
    city: "Coimbatore · Gandhipuram",
    vehicle: "Sedan",
    registration: "TN 38 BK 6081",
    submitted: "Today · 9:18 AM",
    status: "needs_changes",
    note: "Please upload a clearer vehicle insurance copy.",
    wallet: 150000,
    required: 200000,
    suspended: false,
    documentsChecked: 4,
  },
  {
    id: "KD-DEMO-1026",
    name: "Vikram S",
    phone: "+91 99XXX 74102",
    email: "vikram.demo@example.com",
    city: "Chennai · Adyar",
    vehicle: "Mini cab",
    registration: "TN 09 CQ 4172",
    submitted: "Yesterday · 4:35 PM",
    status: "approved",
    note: "Documents verified by operations.",
    wallet: 450000,
    required: 200000,
    suspended: false,
    documentsChecked: 6,
  },
  {
    id: "KD-DEMO-1027",
    name: "Suresh Balan",
    phone: "+91 96XXX 55209",
    email: "suresh.demo@example.com",
    city: "Tiruppur",
    vehicle: "Motorcycle",
    registration: "TN 39 CZ 9054",
    submitted: "Yesterday · 1:12 PM",
    status: "rejected",
    note: "Vehicle category did not meet onboarding requirements.",
    wallet: 0,
    required: 200000,
    suspended: false,
    documentsChecked: 2,
  },
];

const statusText: Record<Status, string> = {
  pending_review: "Pending review",
  needs_changes: "Changes requested",
  approved: "Approved",
  rejected: "Rejected",
};

const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);

function OperationsDemo() {
  const [applications, setApplications] = useState(initialApplications);
  const [filter, setFilter] = useState<Filter>("needs_review");
  const [selectedId, setSelectedId] = useState(initialApplications[0].id);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const counts = useMemo(
    () => ({
      total: applications.length,
      pending_review: applications.filter((item) => item.status === "pending_review").length,
      needs_changes: applications.filter((item) => item.status === "needs_changes").length,
      approved: applications.filter((item) => item.status === "approved").length,
      rejected: applications.filter((item) => item.status === "rejected").length,
    }),
    [applications],
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return applications.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "needs_review"
          ? item.status === "pending_review" || item.status === "needs_changes"
          : item.status === filter);
      const matchesQuery =
        !term ||
        [item.name, item.id, item.registration, item.city].some((value) =>
          value.toLowerCase().includes(term),
        );
      return matchesFilter && matchesQuery;
    });
  }, [applications, filter, query]);

  const selected = applications.find((item) => item.id === selectedId) ?? visible[0] ?? null;

  function simulateDecision(status: Status, message: string) {
    if (!selected) return;
    setApplications((current) =>
      current.map((item) =>
        item.id === selected.id
          ? { ...item, status, note: message }
          : item,
      ),
    );
    setToast(`${selected.name}: ${statusText[status].toLowerCase()} (demo only)`);
  }

  const tabs: { value: Filter; label: string }[] = [
    { value: "needs_review", label: "Needs review" },
    { value: "all", label: "All" },
    { value: "approved", label: "Approved" },
    { value: "needs_changes", label: "Changes requested" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <main className="min-h-dvh bg-[#f6f5f0] px-4 py-5 text-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-black text-amber-950">CLIENT PREVIEW · DEMO MODE</p>
            <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-950">
              Sample data only
            </span>
          </div>
          <p className="mt-1 text-sm leading-5 text-amber-900">
            This is a safe walkthrough with fictional Captain applications. Review actions are simulated in this browser and are not saved to Kida.
          </p>
        </div>

        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#f5c518] text-lg font-black">K</span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Kida internal</p>
              <h1 className="text-2xl font-black tracking-tight">Operations</h1>
            </div>
          </div>
          <a href="/" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-bold hover:bg-neutral-50">
            <ArrowLeft className="size-4" /> Customer app
          </a>
        </header>

        <section className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Captain onboarding</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Application review</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Review Captain details, verify documents and check wallet eligibility before a Captain can accept rides.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-600">
            Preview workspace · no sign-in required
          </div>
        </section>

        {toast ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900" role="status">
            {toast}
            <button type="button" onClick={() => setToast("")} className="text-emerald-800 underline">Dismiss</button>
          </div>
        ) : null}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Metric label="Total applications" value={counts.total} />
          <Metric label="Pending review" value={counts.pending_review} />
          <Metric label="Changes requested" value={counts.needs_changes} />
          <Metric label="Approved" value={counts.approved} />
          <Metric label="Rejected" value={counts.rejected} />
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Wallet className="mt-0.5 size-5 text-amber-800" />
            <div>
              <p className="text-sm font-black text-amber-950">Captain wallet eligibility gate</p>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                A Captain can go online only when their wallet is not suspended and the available balance meets the company opening-balance requirement. Approval alone does not unlock dispatch.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-black">Captain applications</h3>
              <span className="text-xs text-neutral-500">{visible.length} shown</span>
            </div>
            <label className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-neutral-200 px-3">
              <Search className="size-4 text-neutral-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, ID, vehicle or city"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setFilter(tab.value)}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${filter === tab.value ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-600"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {visible.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${selected?.id === item.id ? "border-neutral-950 bg-neutral-50" : "border-neutral-200 hover:bg-neutral-50"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">{item.id} · {item.city}</p>
                    </div>
                    <StatusPill status={item.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
                    <CarFront className="size-3.5" /> {item.vehicle} · {item.registration}
                  </div>
                </button>
              ))}
              {visible.length === 0 ? (
                <p className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-500">No applications match this filter.</p>
              ) : null}
            </div>
          </section>

          <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            {selected ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-500">Applicant details</p>
                    <h3 className="mt-1 text-2xl font-black">{selected.name}</h3>
                    <p className="mt-1 text-sm text-neutral-500">{selected.id} · Submitted {selected.submitted}</p>
                  </div>
                  <StatusPill status={selected.status} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Info label="Phone" value={selected.phone} />
                  <Info label="Email" value={selected.email} />
                  <Info label="Service area" value={selected.city} />
                  <Info label="Vehicle" value={selected.vehicle} />
                  <Info label="Registration" value={selected.registration} />
                  <Info label="Latest review note" value={selected.note} />
                </div>

                <div className="mt-5 rounded-xl border border-neutral-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="size-4 text-neutral-600" />
                      <p className="text-sm font-black">Document verification</p>
                    </div>
                    <span className="text-xs font-bold text-neutral-600">{selected.documentsChecked}/6 checked</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-600">
                    {["Identity", "Driving licence", "Commercial permit", "Insurance", "Fitness / PUC", "Vehicle registration"].map((label, index) => (
                      <div key={label} className="flex items-center gap-2">
                        {index < selected.documentsChecked ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Clock3 className="size-4 text-amber-600" />}
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-neutral-200 p-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4 text-neutral-600" />
                    <p className="text-sm font-black">Wallet eligibility</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Info label="Wallet balance" value={money(selected.wallet)} />
                    <Info label="Required balance" value={money(selected.required)} />
                  </div>
                  <p className={`mt-3 rounded-lg px-3 py-2 text-xs font-bold ${!selected.suspended && selected.wallet >= selected.required ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
                    {!selected.suspended && selected.wallet >= selected.required
                      ? "Eligible to go online (demo rule)"
                      : selected.suspended
                        ? "Not eligible · wallet suspended"
                        : "Not eligible · opening balance not met"}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-black">Simulate an operations decision</p>
                  <p className="mt-1 text-xs text-neutral-500">These buttons change only this sample preview.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => simulateDecision("approved", "Demo approval recorded. Original documents verified.")} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-neutral-950 px-3 py-2 text-xs font-bold text-white hover:bg-neutral-800">
                      <CheckCircle2 className="size-4" /> Approve
                    </button>
                    <button type="button" onClick={() => simulateDecision("needs_changes", "Demo: applicant asked to update supporting documents.")} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
                      <Clock3 className="size-4" /> Request changes
                    </button>
                    <button type="button" onClick={() => simulateDecision("rejected", "Demo: application rejected after review.")} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-800">
                      <XCircle className="size-4" /> Reject
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-neutral-500">Select an application to view its details.</p>
            )}
          </section>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4" /> Kida Operations · client walkthrough</span>
          <span>All applicants and records on this page are fictional.</span>
        </footer>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-black tabular-nums">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-neutral-800">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    pending_review: "border-blue-200 bg-blue-50 text-blue-800",
    needs_changes: "border-amber-200 bg-amber-50 text-amber-900",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rejected: "border-red-200 bg-red-50 text-red-800",
  };
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}>
      {statusText[status]}
    </span>
  );
}
