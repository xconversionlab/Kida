import type { VehicleId } from "@/lib/raah/types";

export function VehicleArt({ id, className = "h-12 w-20" }: { id: VehicleId; className?: string }) {
  if (id === "bike") {
    return (
      <svg viewBox="0 0 96 48" className={className} aria-hidden>
        <circle cx="22" cy="34" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="74" cy="34" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M22 34h18l10-14h16l8 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M46 20h12" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="58" cy="18" r="3" fill="var(--color-primary)" />
      </svg>
    );
  }
  if (id === "auto") {
    return (
      <svg viewBox="0 0 96 48" className={className} aria-hidden>
        <circle cx="24" cy="36" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="70" cy="36" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M16 36h64" stroke="currentColor" strokeWidth="3" />
        <path d="M28 36V22h34l10 14" fill="var(--color-accent-soft)" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M30 22c6-8 24-8 30 0" fill="var(--color-primary)" stroke="currentColor" strokeWidth="3" />
        <path d="M40 26h10" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "mini") {
    return (
      <svg viewBox="0 0 96 48" className={className} aria-hidden>
        <path d="M14 32c2-10 10-16 22-16h18c8 0 14 4 18 10l6 6H14Z" fill="var(--color-primary-soft)" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="30" cy="34" r="6" fill="var(--color-road)" stroke="currentColor" strokeWidth="3" />
        <circle cx="70" cy="34" r="6" fill="var(--color-road)" stroke="currentColor" strokeWidth="3" />
        <path d="M38 18v10M54 17v11" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "sedan") {
    return (
      <svg viewBox="0 0 96 48" className={className} aria-hidden>
        <path d="M10 32c4-6 10-14 22-14h20c8 0 14 4 20 10l8 4H10Z" fill="var(--color-paper-deep)" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="28" cy="34" r="6" fill="var(--color-road)" stroke="currentColor" strokeWidth="3" />
        <circle cx="72" cy="34" r="6" fill="var(--color-road)" stroke="currentColor" strokeWidth="3" />
        <path d="M36 18l6 10M58 18l4 10" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 96 48" className={className} aria-hidden>
      <path d="M12 34V20c0-4 4-8 10-8h40c10 0 16 6 20 14l4 8H12Z" fill="var(--color-primary)" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M24 16v12M40 16v12M56 16v12" stroke="var(--color-primary-ink)" strokeWidth="2" />
      <circle cx="28" cy="36" r="6" fill="var(--color-road)" stroke="currentColor" strokeWidth="3" />
      <circle cx="72" cy="36" r="6" fill="var(--color-road)" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-xl bg-[#d3d3d1] px-2 py-1 ${className}`}>
      <img src="/brand/kida-logo.svg" alt="Kida" className="h-[1.15em] w-auto object-contain" />
    </span>
  );
}
