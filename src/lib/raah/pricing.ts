import type { Availability, PayMethod, PlaceKind, Quote, VehicleId } from "./types";

export const VEHICLES: {
  id: VehicleId;
  capacity: number;
  base: number;
  perKm: number;
  arrival: number;
  speed: number;
  minFare: number;
  availableForBooking?: boolean;
}[] = [
  // Client-approved customer rate card. No separate base/minimum fare is added.
  { id: "bike", capacity: 1, base: 0, perKm: 15, arrival: 3, speed: 24, minFare: 0 },
  { id: "auto", capacity: 3, base: 0, perKm: 20, arrival: 5, speed: 20, minFare: 0 },
  { id: "mini", capacity: 4, base: 0, perKm: 25, arrival: 6, speed: 26, minFare: 0 },
  // Sedan has no client-approved rate yet; retain its type for existing records but hide it from new bookings.
  { id: "sedan", capacity: 4, base: 0, perKm: 0, arrival: 8, speed: 28, minFare: 0, availableForBooking: false },
  { id: "xl", capacity: 7, base: 0, perKm: 30, arrival: 11, speed: 26, minFare: 0 },
];

export const BOOKABLE_VEHICLES = VEHICLES.filter((vehicle) => vehicle.availableForBooking !== false);

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
  if (vehicleMeta(id).availableForBooking === false) return "unavailable";
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
  if (used.includes(code) && code === "KIDA50") {
    return { ok: false, code, discount: 0, reason: "used" };
  }
  if (code === "KIDA50") {
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
  // The client supplied per-kilometre rates are shown as the fare. Tax/base/minimum
  // add-ons are not introduced until the client approves them.
  const tax = 0;
  const total = avail === "unavailable" ? 0 : Math.max(meta.minFare, taxable);
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


export const PLATFORM_COMMISSION_PERCENT = 20;
export const CAPTAIN_SHARE_PERCENT = 80;

/** Fare allocation for a normal trip or a company-funded sixth-ride reward. */
export function calculateFareAllocation(customerFare: number, companyFundedFreeRide = false) {
  const grossFare = Math.max(0, Math.round(customerFare));
  if (companyFundedFreeRide) {
    return {
      customerPays: 0,
      captainReceives: grossFare,
      companyCommission: 0,
      companySubsidy: grossFare,
    };
  }
  const companyCommission = Math.round((grossFare * PLATFORM_COMMISSION_PERCENT) / 100);
  return {
    customerPays: grossFare,
    captainReceives: grossFare - companyCommission,
    companyCommission,
    companySubsidy: 0,
  };
}
