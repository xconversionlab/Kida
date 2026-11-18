import test from "node:test";
import assert from "node:assert/strict";
import {
  canCustomerCancelBooking,
  canTransitionBooking,
  type BookingStatus,
} from "./booking-state.ts";

test("booking follows the supported lifecycle", () => {
  const path: BookingStatus[] = [
    "requested",
    "searching",
    "accepted",
    "captain_arriving",
    "arrived",
    "in_progress",
    "completed",
  ];
  for (let index = 0; index < path.length - 1; index += 1) {
    assert.equal(canTransitionBooking(path[index], path[index + 1]), true);
  }
});

test("a Captain may accept a just-created request without a separate searching event", () => {\n  assert.equal(canTransitionBooking("requested", "accepted"), true);\n});\n\ntest("terminal statuses cannot transition again", () => {
  for (const status of ["completed", "cancelled", "expired", "no_captain"] as const) {
    assert.equal(canTransitionBooking(status, "searching"), false);
  }
});

test("customers can only cancel before a Captain accepts", () => {
  assert.equal(canCustomerCancelBooking("requested"), true);
  assert.equal(canCustomerCancelBooking("searching"), true);
  assert.equal(canCustomerCancelBooking("accepted"), false);
  assert.equal(canCustomerCancelBooking("in_progress"), false);
});
