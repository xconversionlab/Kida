import * as React from "react";
import { getPlace } from "@/lib/raah/places";
import { useRaah } from "@/lib/raah/store";
import type { PayMethod, Ride, Selection, Ticket, VehicleId } from "@/lib/raah/types";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, listMySupportTickets } from "./server";
import { listMyBookingsWithCaptain } from "./captain-server";

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
type BackendBooking = Awaited<ReturnType<typeof listMyBookingsWithCaptain>>[number];
type BackendTicket = Awaited<ReturnType<typeof listMySupportTickets>>[number];

const VEHICLES = new Set<VehicleId>(["bike", "auto", "mini", "sedan", "xl"]);
const PAY_METHODS = new Set<PayMethod>(["upi", "qr", "credit", "debit", "cash"]);
const SELECTION_SOURCES = new Set<Selection["source"]>([
  "saved", "recent", "search", "map", "gps", "operator", "sample", "google", "osm",
]);

function text(value: JsonValue | undefined): string {
  return typeof value === "string" ? value : "";
}

function number(value: JsonValue | undefined, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return fallback;
}

function selectionFromBackend(value: BackendSelection, kind: "pickup" | "drop"): Selection {
  const placeId = text(value.placeId) || "unknown";
  const knownPlace = getPlace(placeId);
  const rawSource = text(value.source);
  const source = SELECTION_SOURCES.has(rawSource as Selection["source"])
    ? rawSource as Selection["source"]
    : "sample";
  const isLegacyExternalMap = source === "google";
  const lat = number(value.lat, knownPlace?.lat ?? 0);
  const lng = number(value.lng, knownPlace?.lng ?? 0);
  const label = text(value.label) || knownPlace?.name || (isLegacyExternalMap ? "Saved map location" : kind === "pickup" ? "Saved pickup" : "Saved destination");
  const line = text(value.line) || knownPlace?.district || (isLegacyExternalMap
    ? "Older map reference saved; address is not cached"
    : "Trip location saved with your booking");

  return { placeId, landmarkId: text(value.landmarkId), label, line, lat, lng, source };
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
  const vehicle = VEHICLES.has(booking.vehicle_id as VehicleId) ? booking.vehicle_id as VehicleId : "auto";
  const payment = PAY_METHODS.has(booking.payment_method as PayMethod) ? booking.payment_method as PayMethod : "cash";
  const preview = booking.client_fare_preview;
  const km = number(preview?.km);
  const minutes = number(preview?.minutes);
  const total = number(preview?.total);
  const captainLat = booking.captain_latitude === null ? null : Number(booking.captain_latitude);
  const captainLng = booking.captain_longitude === null ? null : Number(booking.captain_longitude);
  const captainLocation = captainLat !== null && captainLng !== null
    && Number.isFinite(captainLat) && Number.isFinite(captainLng)
    && booking.captain_location_updated_at
    ? { lat: captainLat, lng: captainLng, updatedAt: booking.captain_location_updated_at }
    : undefined;
  const captainVehicle = VEHICLES.has(booking.captain_vehicle_id as VehicleId)
    ? booking.captain_vehicle_id as VehicleId
    : vehicle;

  return {
    id: booking.id,
    backendBookingId: booking.id,
    backendStatus: booking.status,
    isCustomerRewardRide: booking.is_free_ride,
    tripPin: booking.trip_pin ?? undefined,
    status: uiStatus(booking.status, booking.scheduled_for),
    pickup: selectionFromBackend(booking.pickup, "pickup"),
    drop: selectionFromBackend(booking.dropoff, "drop"),
    stops: booking.stops.map((stop) => selectionFromBackend(stop, "drop")),
    vehicle,
    payment,
    fare: {
      km, minutes, arrivalMin: 0, base: total, distanceCharge: 0,
      waiting: 0, tax: 0, discount: 0, total, promoCode: null, availability: "ready",
    },
    driver: booking.captain_user_id ? {
      name: booking.captain_display_name?.trim() || "Kida Captain",
      plate: booking.captain_registration_number ?? undefined,
      vehicle: captainVehicle,
      colour: booking.captain_vehicle_colour ?? undefined,
      photoUrl: booking.captain_photo_url ?? undefined,
      licenceIdentifier: booking.captain_licence_identifier ?? undefined,
      rating: booking.captain_average_rating == null ? undefined : Number(booking.captain_average_rating),
      trips: booking.captain_rating_count ?? 0,
      ratingCount: booking.captain_rating_count ?? 0,
    } : null,
    captainLocation,
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
  return { id: ticket.id, topic: ticket.topic, text: ticket.message, status, at: ticket.created_at, backend: true };
}

/** Fetch all account-scoped data, including only the caller's own active Captain location. */
export async function syncMyKidaData(shouldApply: () => boolean = () => true) {
  const [profile, bookings, tickets] = await Promise.all([
    getMyProfile(),
    listMyBookingsWithCaptain(),
    listMySupportTickets(),
  ]);
  const rides = bookings.map(mapBooking);
  const mappedTickets = tickets.map(mapTicket);

  if (shouldApply()) {
    useRaah.setState((state) => {
      const currentRide = state.activeRideId
        ? rides.find((ride) => ride.id === state.activeRideId)
        : undefined;
      const dispatchStatuses = new Set(["requested", "searching", "accepted", "captain_arriving", "arrived", "in_progress"]);
      const isLiveRide = (ride: Ride | undefined) => Boolean(
        ride?.backendBookingId
        && ride.status !== "scheduled"
        && dispatchStatuses.has(ride.backendStatus ?? ""),
      );
      // The browser intentionally does not persist backend-owned rides. Restore
      // the active booking pointer from the account API after sign-in / refresh.
      const recoveredRide = isLiveRide(currentRide)
        ? currentRide
        : rides.find((ride) => isLiveRide(ride));
      const rideForScreen = currentRide ?? recoveredRide;
      const nextActiveRideId = recoveredRide?.id ?? null;
      const nextSelectedRideId = state.selectedRideId && rides.some((ride) => ride.id === state.selectedRideId)
        ? state.selectedRideId
        : rides[0]?.id ?? null;
      let screen = state.screen;
      if (state.screen === "assigning" && rideForScreen?.backendStatus && !["requested", "searching"].includes(rideForScreen.backendStatus)) {
        screen = rideForScreen.backendStatus === "completed" ? "complete" : ["cancelled", "expired", "no_captain"].includes(rideForScreen.backendStatus) ? "history" : "tracking";
      } else if (state.screen === "tracking" && rideForScreen?.backendStatus === "completed") {
        screen = "complete";
      } else if (state.screen === "tracking" && rideForScreen?.backendStatus && ["cancelled", "expired", "no_captain"].includes(rideForScreen.backendStatus)) {
        screen = "history";
      }
      return {
        name: profile?.display_name?.trim() ?? "",
        phone: profile?.phone_e164?.startsWith("+91") ? profile.phone_e164.slice(3) : profile?.phone_e164 ?? "",
        rides,
        activeRideId: nextActiveRideId,
        selectedRideId: nextSelectedRideId,
        tickets: mappedTickets,
        screen,
        stack: screen === state.screen ? state.stack : [],
      };
    });
  }

  return { profile, bookings: rides, tickets: mappedTickets };
}

/**
 * Session-scoped account sync. Active booking status and Captain GPS are polled
 * every 4 seconds; idle account history is refreshed every 15 seconds.
 * The next poll starts only after the previous request completes.
 */
export function useKidaCustomerSync(enabled: boolean) {
  const { user, isPending } = useCurrentUserState();
  const screen = useRaah((state) => state.screen);
  const hasActiveBackendRide = useRaah((state) => {
    const ride = state.rides.find((item) => item.id === state.activeRideId);
    return Boolean(ride?.backendBookingId && !["completed", "cancelled"].includes(ride.status));
  });

  React.useEffect(() => {
    if (!enabled || isPending) return;
    if (!user) {
      useRaah.setState((state) => ({
        name: "",
        phone: "",
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
    let timeout: number | undefined;
    let inFlight = false;
    const poll = async () => {
      if (!active || inFlight) return;
      inFlight = true;
      try {
        await syncMyKidaData(() => active);
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : "Could not load your Kida account data.";
          useRaah.setState({ toast: message === "Unauthorized" ? "Please sign in to sync your Kida account." : "Your account data could not be refreshed. Try again." });
        }
      } finally {
        inFlight = false;
        if (active) timeout = window.setTimeout(() => void poll(), screen === "assigning" || screen === "tracking" || hasActiveBackendRide ? 4000 : 15000);
      }
    };
    void poll();
    return () => {
      active = false;
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, [enabled, isPending, user?.id, screen, hasActiveBackendRide]);
}
