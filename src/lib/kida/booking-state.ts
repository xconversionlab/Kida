export const BOOKING_STATUSES = [
  "requested",
  "searching",
  "accepted",
  "captain_arriving",
  "arrived",
  "in_progress",
  "completed",
  "cancelled",
  "expired",
  "no_captain",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

const TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  requested: ["searching", "cancelled", "expired", "no_captain"],
  searching: ["accepted", "cancelled", "expired", "no_captain"],
  accepted: ["captain_arriving", "cancelled"],
  captain_arriving: ["arrived", "cancelled"],
  arrived: ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed: [],
  cancelled: [],
  expired: [],
  no_captain: [],
};

/** Pure transition guard shared by server handlers and tests. */
export function canTransitionBooking(
  from: BookingStatus,
  to: BookingStatus,
): boolean {
  return TRANSITIONS[from].includes(to);
}

/** Only a customer may cancel before a Captain accepts the request. */
export function canCustomerCancelBooking(status: BookingStatus): boolean {
  return status === "requested" || status === "searching";
}
