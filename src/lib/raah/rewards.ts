import type { Ride, VehicleId } from "./types";

export const CUSTOMER_FREE_RIDE_CODE = "KIDA_6TH_RIDE_FREE";
export const CUSTOMER_FREE_RIDE_RULES = {
  paidRidesRequired: 5,
  maximumDistanceKmExclusive: 7,
  eligibleVehicles: ["mini", "sedan", "xl"] as const,
};

export interface CustomerRewardProgress {
  completedPaidRides: number;
  paidRidesTowardReward: number;
  rewardAvailable: boolean;
  rewardPending: boolean;
}

/**
 * Count only completed account-backed rides. Demo/localStorage sample rides
 * never advance a real customer's reward progress. A pending free ride reserves
 * the reward until it completes or is cancelled/expired.
 */
export function getCustomerRewardProgress(rides: readonly Ride[]): CustomerRewardProgress {
  const accountRides = rides
    .filter((ride) => Boolean(ride.backendBookingId && ride.backendStatus))
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  let completedPaidRides = 0;
  let rewardPending = false;

  for (const ride of accountRides) {
    const status = ride.backendStatus;
    if (ride.isCustomerRewardRide) {
      if (status === "completed") {
        completedPaidRides = 0;
        rewardPending = false;
      } else if (status !== "cancelled" && status !== "expired" && status !== "no_captain") {
        rewardPending = true;
      }
      continue;
    }
    if (status === "completed" && ride.fare.total > 0) {
      completedPaidRides += 1;
    }
  }

  return {
    completedPaidRides,
    paidRidesTowardReward: Math.min(completedPaidRides, CUSTOMER_FREE_RIDE_RULES.paidRidesRequired),
    rewardAvailable: completedPaidRides >= CUSTOMER_FREE_RIDE_RULES.paidRidesRequired && !rewardPending,
    rewardPending,
  };
}

export function isEligibleCustomerFreeRide(
  progress: CustomerRewardProgress,
  vehicle: VehicleId,
  distanceKm: number,
): boolean {
  return progress.rewardAvailable
    && (CUSTOMER_FREE_RIDE_RULES.eligibleVehicles as readonly VehicleId[]).includes(vehicle)
    && Number.isFinite(distanceKm)
    && distanceKm < CUSTOMER_FREE_RIDE_RULES.maximumDistanceKmExclusive;
}
