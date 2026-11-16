import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { t, type CopyKey } from "@/lib/raah/i18n";
import { useRaah } from "@/lib/raah/store";

export function useCopy() {
  const lang = useRaah((s) => s.lang);
  return (key: CopyKey) => t(lang, key);
}

const variants = {
  primary: "bg-primary text-primary-ink",
  accent: "bg-accent text-accent-ink",
  soft: "bg-primary-soft text-primary",
  ghost: "bg-transparent text-ink",
  line: "border border-line bg-surface text-ink",
  danger: "bg-danger text-primary-ink",
} as const;

export function Btn({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      className={cn(
        "kida-btn inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-4 text-base font-semibold transition disabled:opacity-45",
        variants[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export function Header({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="kida-page-header flex items-start gap-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full bg-paper text-ink"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="kida-page-title font-display text-3xl text-ink">{title}</h1>
        {subtitle ? <p className="kida-page-subtitle mt-1 text-sm leading-relaxed text-muted">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}

export function Avatar({ name, photo, className }: { name: string; photo?: string; className?: string }) {
  const letter = (name.trim()[0] ?? "R").toUpperCase();
  if (photo) {
    return <img src={photo} alt="" className={cn("size-11 rounded-full object-cover", className)} />;
  }
  return (
    <span
      className={cn(
        "kida-avatar grid size-11 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-ink",
        className,
      )}
      aria-hidden
    >
      {letter}
    </span>
  );
}

export function Pill({
  children,
  tone = "soft",
}: {
  children: ReactNode;
  tone?: "soft" | "ok" | "warn" | "danger" | "line";
}) {
  const tones = {
    soft: "bg-primary-soft text-primary",
    ok: "bg-ok-soft text-ok",
    warn: "bg-accent-soft text-accent",
    danger: "bg-danger-soft text-danger",
    line: "bg-paper text-muted",
  };
  return (
    <span className={cn("kida-pill inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("kida-card rounded-3xl border border-line bg-surface p-4", className)}>{children}</div>;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "kida-input h-12 w-full rounded-2xl border border-line bg-paper px-3 text-base text-ink outline-none ring-primary focus:ring-2";

export function prettyPhone(digits: string) {
  const clean = digits.replace(/\D/g, "").slice(-10);
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)} ${clean.slice(5)}`;
}
