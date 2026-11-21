import { getRequest } from "@tanstack/react-start/server";

/**
 * Fetch-Metadata request isolation — server-only.
 *
 * Preview and production subdomains may share a registrable site while still
 * belonging to different Kida deployments. A SameSite=Lax cookie can accompany
 * same-site requests, so reject scripted cross-site/sibling requests before
 * they reach account-scoped server functions.
 *
 * Allow same-origin requests, non-browser server requests, and top-level GET
 * navigations. Reject cross-site or same-site scripted requests.
 */
export class CrossSiteRequestError extends Error {
  readonly status = 403;

  constructor() {
    super("Forbidden: cross-site request blocked");
    this.name = "CrossSiteRequestError";
  }
}

export function assertSameSiteRequest(): void {
  const request = getRequest();
  if (!request) return;

  const headers = request.headers;
  const site = headers.get("sec-fetch-site");

  if (!site || site === "same-origin" || site === "none") return;

  const destination = headers.get("sec-fetch-dest");
  const isTopLevelGet =
    headers.get("sec-fetch-mode") === "navigate" &&
    request.method === "GET" &&
    destination !== "object" &&
    destination !== "embed";

  if (isTopLevelGet) return;
  throw new CrossSiteRequestError();
}
