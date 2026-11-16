import type { Availability, PayMethod, PlaceKind, Quote, VehicleId } from "./types";

export const VEHICLES: {
  id: VehicleId;
  capacity: number;
  base: number;
  perKm: number;
  arrival: number;
  speed: number;
  minFare: number;
}[] = [
  { id: "bike", capacity: 1, base: 25, perKm: 7, arrival: 3, speed: 24, minFare: 30 },
  { id: "auto", capacity: 3, base: 35, perKm: 13, arrival: 5, speed: 20, minFare: 45 },
  { id: "mini", capacity: 4, base: 60, perKm: 14, arrival: 6, speed: 26, minFare: 80 },
  { id: "sedan", capacity: 4, base: 90, perKm: 18, arrival: 8, speed: 28, minFare: 120 },
  { id: "xl", capacity: 6, base: 120, perKm: 22, arrival: 11, speed: 26, minFare: 160 },
];

export const PAY_METHODS: PayMethod[] = ["upi", "qr", "credit", "debit", "netbanking", "cash"];

export function vehicleMeta(id: VehicleId) {
  const found = VEHICLES.find((v) => v.id === id);
  if (!found) throw new Error(`Unknown vehicle ${id}`);
  return found;
}

export function kmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const km = 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return Math.max(0.8, Math.round(km * 10) / 10);
}

export function availability(id: VehicleId, km: number, kind: PlaceKind): Availability {
  if (id === "bike" && km > 80) return "unavailable";
  if (id === "auto" && km > 45) return "unavailable";
  if (id === "bike" && (km > 25 || kind === "village")) return "limited";
  if (id === "auto" && kind === "metro" && km > 18) return "limited";
  if ((id === "xl" || id === "sedan") && kind === "village") return "limited";
  if (id === "xl" && kind === "town") return "limited";
  return "ready";
}

export interface PromoResult {
  ok: boolean;
  code: string | null;
  discount: number;
  reason: string;
}

export function resolvePromo(
  raw: string,
  subtotal: number,
  vehicle: VehicleId,
  kind: PlaceKind,
  used: string[],
): PromoResult {
  const code = raw.trim().toUpperCase();
  if (!code) return { ok: false, code: null, discount: 0, reason: "empty" };
  if (used.includes(code) && code === "RAAH50") {
    return { ok: false, code, discount: 0, reason: "used" };
  }
  if (code === "RAAH50") {
    return { ok: true, code, discount: Math.min(50, subtotal), reason: "first" };
  }
  if (code === "FEST25") {
    return { ok: true, code, discount: Math.min(40, Math.round(subtotal * 0.1)), reason: "fest" };
  }
  if (code === "VILLAGE20") {
    if ((vehicle === "bike" || vehicle === "auto") && (kind === "village" || kind === "town")) {
      return { ok: true, code, discount: Math.min(20, subtotal), reason: "village" };
    }
    return { ok: false, code, discount: 0, reason: "village-only" };
  }
  if (code === "CITY15") {
    if (kind === "metro" || kind === "city") {
      return { ok: true, code, discount: Math.min(15, subtotal), reason: "city" };
    }
    return { ok: false, code, discount: 0, reason: "city-only" };
  }
  if (code === "REFER75") {
    if (used.includes(code)) return { ok: false, code, discount: 0, reason: "used" };
    return { ok: true, code, discount: Math.min(75, subtotal), reason: "refer" };
  }
  return { ok: false, code, discount: 0, reason: "unknown" };
}

export function quoteRide(
  vehicle: VehicleId,
  km: number,
  kind: PlaceKind,
  promo: PromoResult | null,
): Quote {
  const meta = vehicleMeta(vehicle);
  const avail = availability(vehicle, km, kind);
  const base = meta.base;
  const distanceCharge = Math.round(meta.perKm * km);
  const waiting = 0;
  const discount = promo?.ok ? promo.discount : 0;
  const taxable = Math.max(0, base + distanceCharge + waiting - discount);
  const tax = Math.round(taxable * 0.05);
  const total = avail === "unavailable" ? 0 : Math.max(meta.minFare, taxable + tax);
  const speed = meta.speed + Math.min(22, km * 0.35);
  const minutes = Math.max(4, Math.round((km / speed) * 60));
  const arrivalMin = meta.arrival + (kind === "village" ? 4 : kind === "town" ? 2 : 0);
  return {
    km,
    minutes,
    arrivalMin,
    base,
    distanceCharge,
    waiting,
    tax,
    discount,
    total,
    promoCode: promo?.ok ? promo.code : null,
    availability: avail,
  };
}

export function inr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
