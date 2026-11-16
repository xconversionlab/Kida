import { getPlace } from "@/lib/raah/places";
import type { Selection } from "@/lib/raah/types";

const SLOTS = [
  { x: 26, y: 64 },
  { x: 70, y: 36 },
  { x: 42, y: 28 },
  { x: 74, y: 70 },
];

function slot(selection?: Selection | null) {
  if (!selection) return null;
  const place = getPlace(selection.placeId);
  const index = place?.landmarks.findIndex((item) => item.id === selection.landmarkId) ?? 0;
  return SLOTS[Math.max(0, index)] ?? SLOTS[0];
}

function lerp(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function MapView({
  pickup,
  drop,
  progress = 0,
  phase = "idle",
  className = "h-64",
  caption,
}: {
  pickup?: Selection | null;
  drop?: Selection | null;
  progress?: number;
  phase?: "idle" | "to_pickup" | "to_drop";
  className?: string;
  caption?: string;
}) {
  const place = getPlace(pickup?.placeId ?? drop?.placeId ?? "blr");
  const from = slot(pickup) ?? SLOTS[0];
  const to = slot(drop);
  const start = { x: from.x - 16, y: Math.min(88, from.y + 12) };
  let driver = from;
  if (phase === "to_pickup") driver = lerp(start, from, progress);
  if (phase === "to_drop" && to) driver = lerp(from, to, progress);
  const showRoute = Boolean(to && phase !== "idle");
  const routeD = to ? `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.min(from.y, to.y) - 8} ${to.x} ${to.y}` : "";

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-map ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <ellipse cx="22" cy="24" rx="18" ry="10" fill="var(--color-park)" />
        <path d="M0 78 C 20 70, 40 88, 70 76 S 100 84, 100 90 L 100 100 L 0 100 Z" fill="var(--color-water)" />
        <path d="M-2 40 H 102" stroke="var(--color-road)" strokeWidth="5" />
        <path d="M-2 62 H 102" stroke="var(--color-road)" strokeWidth="4" />
        <path d="M30 -2 V 102" stroke="var(--color-road)" strokeWidth="4" />
        <path d="M68 -2 V 102" stroke="var(--color-road)" strokeWidth="5" />
        <path d="M8 20 C 30 28, 50 10, 92 22" fill="none" stroke="var(--color-paper-deep)" strokeWidth="1.4" />
        {showRoute ? (
          <path d={routeD} fill="none" stroke="var(--color-primary)" strokeWidth="1.8" strokeDasharray="2 1.4" strokeLinecap="round" />
        ) : null}
      </svg>
      <div className="absolute left-3 top-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-semibold text-ink">
        {place?.name}
        <span className="font-medium text-muted"> · {place?.state}</span>
      </div>
      {place?.kind === "village" ? (
        <div className="absolute right-3 top-3 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
          Landmark
        </div>
      ) : null}
      <Pin x={from.x} y={from.y} tone="primary" label="Pickup" />
      {to ? <Pin x={to.x} y={to.y} tone="ink" label="Drop" /> : null}
      {phase !== "idle" ? (
        <span
          className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent shadow"
          style={{ left: `${driver.x}%`, top: `${driver.y}%` }}
          aria-hidden
        />
      ) : (
        <span className="absolute" style={{ left: `${from.x}%`, top: `${from.y}%` }} aria-hidden>
          <span className="puck absolute -left-3 -top-3 size-6 rounded-full bg-primary" />
        </span>
      )}
      <p className="absolute bottom-2 left-3 right-3 text-xs text-ink/80">
        {caption ?? "Schematic map · sample roads · not live navigation"}
      </p>
    </div>
  );
}

function Pin({ x, y, tone, label }: { x: number; y: number; tone: "primary" | "ink"; label: string }) {
  return (
    <span className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${x}%`, top: `${y}%` }}>
      <span
        className={`block size-3.5 rounded-full border-2 border-surface ${tone === "primary" ? "bg-primary" : "bg-ink"}`}
        title={label}
      />
    </span>
  );
}
