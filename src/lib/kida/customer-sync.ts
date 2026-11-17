import * as React from "react";
import { getPlace } from "@/lib/raah/places";
import { useRaah } from "@/lib/raah/store";
import type { PayMethod, Ride, Selection, Ticket, VehicleId } from "@/lib/raah/types";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authEnabled } from "@/lib/auth/client";
import {
  getMyProfile,
  listMyBookings,
  listMySupportTickets,
} from "./server";

export type BackendBookingStatus =
  | "requested"
  | "searching"
  | "accepted"
  | "captain_arriving"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "expired"
  | "no_captain";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type BackendSelection = { [key: string]: JsonValue };
type BackendBooking = Awaited<ReturnType<typeof listMyBookings>>[number];
type BackendTicket = Awaited<ReturnType<typeof listMySupportTickets>>[number];

const VEHICLES = new Set<VehicleId>(["bike", "auto", "mini", "sedan", "xl"]);
const PAY_METHODS = new Set<PayMethod>(["upi", "qr", "credit", "debit", "netbanking", "cash"]);
const SELECTION_SOURCES = new Set<Selection["source"]>([
  "saved", "recent", "search", "map", "gps", "operator", "sample", "google",
]);

function text(value: JsonValue | undefined): string {
  return typeof value === "string" ? value : "";
}

function number(value: JsonValue | undefined, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function selectionFromBackend(value: BackendSelection, kind: "pickup" | "drop"): Selection {
  const placeId = text(value.placeId) || "unknown";
  const knownPlace = getPlace(placeId);
  const rawSource = text(value.source);
  const source = SELECTION_SOURCES.has(rawSource as Selection["source"])
    ? rawSource as Selection["source"]
    : "sample";
  const isGoogle = source === "google";
  const lat = number(value.lat, knownPlace?.lat ?? 0);
  const lng = number(value.lng, knownPlace?.lng ?? 0);
  const label = text(value.label) || knownPlace?.name || (isGoogle ? "Google Maps location" : kind === "pickup" ? "Saved pickup" : "Saved destination");
  const line = text(value.line) || knownPlace?.district || (isGoogle
    ? "Google place reference saved; address is not cached"
    : "Trip location saved with your booking");

  return {
    placeId,
    landmarkId: text(value.landmarkId),
    label,
    line,
    lat,
    lng,
    source,
  };
}

function uiStatus(status: BackendBookingStatus, scheduledFor: string | null): Ride["status"] {
  if (status === "requested" && scheduledFor) return "scheduled";
  if (status === "completed") return "completed";
  if (status === "cancelled" || status === "expired" || status === "no_captain") return "cancelled";
  if (status === "accepted" || status === "captain_arriving" || status === "arrived") return "arriving";
  if (status === "in_progress") return "ongoing";
  return "searching";
}

function mapBooking(booking: BackendBooking): Ride {
  const vehicle = VEHICLES.has(booking.vehicle_id as VehicleId)
    ? booking.vehicle_id as VehicleId
    : "auto";
  const payment = PAY_METHODS.has(booking.payment_method as PayMethod)
    ? booking.payment_method as PayMethod
    : "cash";
  const preview = booking.client_fare_preview;
  const km = number(preview?.km);
  const minutes = number(preview?.minutes);
  const total = number(preview?.total);

  return {
    id: booking.id,
    backendBookingId: booking.id,
    backendStatus: booking.status,
    status: uiStatus(booking.status, booking.scheduled_for),
    pickup: selectionFromBackend(booking.pickup, "pickup"),
    drop: selectionFromBackend(booking.dropoff, "drop"),
    stops: booking.stops.map((stop) => selectionFromBackend(stop, "drop")),
    vehicle,
    payment,
    fare: {
      km,
      minutes,
      arrivalMin: 0,
      base: total,
      distanceCharge: 0,
      waiting: 0,
      tax: 0,
      discount: 0,
      total,
      promoCode: null,
      availability: "ready",
    },
    driver: null,
    createdAt: booking.created_at,
    scheduledFor: booking.scheduled_for ?? undefined,
    progress: 0,
    source: "app",
    messages: [],
    womenDriverRequested: booking.women_driver_requested,
  };
}

function mapTicket(ticket: BackendTicket): Ticket {
  const status = ticket.status === "open"
    ? "Open"
    : ticket.status === "resolved"
      ? "Resolved"
      : ticket.status === "closed"
        ? "Closed"
        : "In review";
  return {
    id: ticket.id,
    topic: ticket.topic,
    text: ticket.message,
    status,
    at: ticket.created_at,
    backend: true,
  };
}

/** Fetch and replace account-owned customer data from the server. */
export async function syncMyKidaData(shouldApply: () => boolean = () => true) {
  const [profile, bookings, tickets] = await Promise.all([
    getMyProfile(),
    listMyBookings(),
    listMySupportTickets(),
  ]);
  const rides = bookings.map(mapBooking);
  const mappedTickets = tickets.map(mapTicket);

  if (shouldApply()) {
    useRaah.setState({
      name: profile?.display_name?.trim() ?? "",
      phone: profile?.phone_e164?.startsWith("+91")
        ? profile.phone_e164.slice(3)
        : profile?.phone_e164 ?? "",
      rides,
      activeRideId: null,
      selectedRideId: rides[0]?.id ?? null,
      tickets: mappedTickets,
    });
  }

  return { profile, bookings: rides, tickets: mappedTickets };
}

/**
 * Session-scoped data loading. Backend-owned rides/tickets are intentionally
 * omitted from localStorage and reloaded only after the verified session resolves.
 */
export function useKidaCustomerSync(enabled: boolean) {
  const { user, isPending } = useCurrentUserState();

  React.useEffect(() => {
    if (!enabled || isPending) return;
    if (!user) {
      useRaah.setState((state) => ({
        ...(authEnabled ? { name: "", phone: "" } : {}),
        rides: state.rides.filter((ride) => !ride.backendBookingId),
        tickets: state.tickets.filter((ticket) => !ticket.backend),
        activeRideId: state.activeRideId && state.rides.some(
          (ride) => ride.id === state.activeRideId && !ride.backendBookingId,
        ) ? state.activeRideId : null,
        selectedRideId: state.selectedRideId && state.rides.some(
          (ride) => ride.id === state.selectedRideId && !ride.backendBookingId,
        ) ? state.selectedRideId : null,
      }));
      return;
    }

    let active = true;
    void syncMyKidaData(() => active).catch((error: unknown) => {
      if (!active) return;
      const message = error instanceof Error ? error.message : "Could not load your Kida account data.";
      useRaah.setState({ toast: message === "Unauthorized" ? "Please sign in to sync your Kida account." : "Your account data could not be refreshed. Try again." });
    });
    return () => {
      active = false;
    };
  }, [enabled, isPending, user?.id]);
}
