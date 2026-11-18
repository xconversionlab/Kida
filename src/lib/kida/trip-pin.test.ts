import test from "node:test";
import assert from "node:assert/strict";
import {
  createTripPinCredentials,
  decryptTripPin,
  matchesTripPin,
} from "./trip-pin.ts";

const originalSecret = process.env.KIDA_TRIP_PIN_SECRET;
process.env.KIDA_TRIP_PIN_SECRET = "kida-test-trip-pin-secret-with-more-than-32-characters";

test("trip PIN is encrypted for the booking owner and HMAC-verified for Captain pickup", () => {
  const bookingId = "6cc7e350-d1c9-47fc-a08e-0ce7fd8259a1";
  const credentials = createTripPinCredentials(bookingId, "4829");

  assert.equal(typeof credentials.tripPinHash, "string");
  assert.equal(credentials.tripPinHash.length, 64);
  assert.notEqual(credentials.tripPinCiphertext, "4829");
  assert.equal(decryptTripPin(bookingId, credentials.tripPinCiphertext), "4829");
  assert.equal(matchesTripPin(bookingId, "4829", credentials.tripPinHash), true);
  assert.equal(matchesTripPin(bookingId, "1234", credentials.tripPinHash), false);
});

test("trip PIN ciphertext is bound to one booking ID", () => {
  const credentials = createTripPinCredentials("6cc7e350-d1c9-47fc-a08e-0ce7fd8259a1", "1937");
  assert.equal(decryptTripPin("different-booking-id", credentials.tripPinCiphertext), null);
  assert.equal(matchesTripPin("different-booking-id", "1937", credentials.tripPinHash), false);
});

test("trip PIN helpers reject a non-four-digit value", () => {
  assert.throws(
    () => createTripPinCredentials("6cc7e350-d1c9-47fc-a08e-0ce7fd8259a1", "123"),
    /four-digit/,
  );
});

if (originalSecret === undefined) delete process.env.KIDA_TRIP_PIN_SECRET;
else process.env.KIDA_TRIP_PIN_SECRET = originalSecret;
