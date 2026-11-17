import test from "node:test";
import assert from "node:assert/strict";
import { getCustomerRewardProgress, isEligibleCustomerFreeRide } from "./rewards.ts";
import type { Ride, VehicleId } from "./types.ts";

function ride(
  id: string,
  status: NonNullable<Ride["backendStatus"]>,
  total: number,
  vehicle: VehicleId = "mini",
  isCustomerRewardRide = false,
  accountBacked = true,
): Ride {
  return {
    id,
    status: status === "completed" ? "completed" : status === "cancelled" ? "cancelled" : "searching",
    backendBookingId: accountBacked ? id : undefined,
    backendStatus: accountBacked ? status : undefined,
    isCustomerRewardRide,
    pickup: { placeId: "p", landmarkId: "", label: "", line: "", lat: 0, lng: 0, source: "sample" },
    drop: { placeId: "d", landmarkId: "", label: "", line: "", lat: 0, lng: 0, source: "sample" },
    vehicle,
    payment: "cash",
    fare: { km: 2, minutes: 5, arrivalMin: 0, base: 0, distanceCharge: total, waiting: 0, tax: 0, discount: 0, total, promoCode: null, availability: "ready" },
    driver: null,
    createdAt: new Date(Number(id.replace(/\D/g, "") || "1") * 1000).toISOString(),
    progress: 1,
    source: "app",
    messages: [],
  };
}

test("five completed paid account rides unlock the sixth-ride reward", () => {
  const progress = getCustomerRewardProgress(Array.from({ length: 5 }, (_, i) => ride(`ride-${i + 1}`, "completed", 100)));
  assert.equal(progress.rewardAvailable, true);
  assert.equal(progress.paidRidesTowardReward, 5);
});

test("demo rides do not count toward an account reward", () => {
  const progress = getCustomerRewardProgress(Array.from({ length: 5 }, (_, i) => ride(`demo-${i + 1}`, "completed", 100, "mini", false, false)));
  assert.equal(progress.completedPaidRides, 0);
  assert.equal(progress.rewardAvailable, false);
});

test("the reward is only for cab categories and strictly below seven kilometres", () => {
  const progress = getCustomerRewardProgress(Array.from({ length: 5 }, (_, i) => ride(`ride-${i + 1}`, "completed", 100)));
  assert.equal(isEligibleCustomerFreeRide(progress, "mini", 6.9), true);
  assert.equal(isEligibleCustomerFreeRide(progress, "xl", 6.99), true);
  assert.equal(isEligibleCustomerFreeRide(progress, "auto", 4), false);
  assert.equal(isEligibleCustomerFreeRide(progress, "bike", 4), false);
  assert.equal(isEligibleCustomerFreeRide(progress, "mini", 7), false);
});

test("a requested free ride reserves the reward until completion or cancellation", () => {
  const rides = Array.from({ length: 5 }, (_, i) => ride(`ride-${i + 1}`, "completed", 100));
  rides.push(ride("ride-6", "requested", 0, "mini", true));
  const progress = getCustomerRewardProgress(rides);
  assert.equal(progress.rewardPending, true);
  assert.equal(progress.rewardAvailable, false);
});

test("a completed free ride starts a new five-paid-ride cycle", () => {
  const rides = Array.from({ length: 5 }, (_, i) => ride(`ride-${i + 1}`, "completed", 100));
  rides.push(ride("ride-6", "completed", 0, "mini", true));
  const progress = getCustomerRewardProgress(rides);
  assert.equal(progress.completedPaidRides, 0);
  assert.equal(progress.rewardAvailable, false);
});
