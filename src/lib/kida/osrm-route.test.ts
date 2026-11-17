import test from "node:test";
import assert from "node:assert/strict";
import { parseOsrmRouteResponse } from "./osrm-route.ts";

test("parses OSRM distance, duration and GeoJSON coordinates", () => {
  const route = parseOsrmRouteResponse({
    code: "Ok",
    routes: [{
      distance: 6420,
      duration: 780,
      geometry: { coordinates: [[76.9558, 11.0168], [76.97, 11.03]] },
    }],
  });

  assert.deepEqual(route, {
    distanceKm: 6.4,
    durationMinutes: 13,
    path: [
      { lat: 11.0168, lng: 76.9558 },
      { lat: 11.03, lng: 76.97 },
    ],
  });
});

test("rejects no-route responses instead of interpreting them as zero distance", () => {
  assert.throws(
    () => parseOsrmRouteResponse({ code: "NoRoute", routes: [] }),
    /No drivable road route/,
  );
});

test("rejects invalid distance and duration", () => {
  assert.throws(
    () => parseOsrmRouteResponse({ code: "Ok", routes: [{ distance: 0, duration: 0 }] }),
    /invalid distance or duration/,
  );
});

test("drops malformed coordinates but retains valid road geometry", () => {
  const route = parseOsrmRouteResponse({
    code: "Ok",
    routes: [{
      distance: 1000,
      duration: 100,
      geometry: { coordinates: [[76.9, 11.0], ["bad", 200], [77.0, 11.1]] },
    }],
  });

  assert.equal(route.path.length, 2);
});
