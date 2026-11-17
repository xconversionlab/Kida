export interface RouteCoordinate {
  lat: number;
  lng: number;
}

export interface OsrmRoadRoute {
  distanceKm: number;
  durationMinutes: number;
  path: RouteCoordinate[];
}

/**
 * Parse the public OSRM route response into Kida's normalized route shape.
 * Throws for no-route, malformed, or non-finite responses so callers can
 * fall back safely instead of treating a failed response as a zero-km route.
 */
export function parseOsrmRouteResponse(input: unknown): OsrmRoadRoute {
  if (!input || typeof input !== "object") {
    throw new Error("The routing service returned an invalid response.");
  }

  const payload = input as {
    code?: unknown;
    routes?: Array<{
      distance?: unknown;
      duration?: unknown;
      geometry?: { coordinates?: unknown };
    }>;
  };

  if (payload.code !== "Ok" || !Array.isArray(payload.routes) || payload.routes.length === 0) {
    throw new Error("No drivable road route was found for these locations.");
  }

  const route = payload.routes[0];
  const distanceMeters = Number(route.distance);
  const durationSeconds = Number(route.duration);

  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0 ||
      !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error("The routing service returned an invalid distance or duration.");
  }

  const rawCoordinates = route.geometry?.coordinates;
  const path = Array.isArray(rawCoordinates)
    ? rawCoordinates.flatMap((coordinate): RouteCoordinate[] => {
        if (!Array.isArray(coordinate) || coordinate.length < 2) return [];
        const lng = Number(coordinate[0]);
        const lat = Number(coordinate[1]);
        if (!Number.isFinite(lat) || !Number.isFinite(lng) ||
            lat < -90 || lat > 90 || lng < -180 || lng > 180) return [];
        return [{ lat, lng }];
      })
    : [];

  return {
    distanceKm: Math.round((distanceMeters / 1000) * 10) / 10,
    durationMinutes: Math.max(1, Math.ceil(durationSeconds / 60)),
    path,
  };
}
