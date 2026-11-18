import { createMiddleware } from "@tanstack/react-start";

/**
 * Authenticate server functions using the session cookie issued by Kida's
 * same-origin Better Auth endpoint. Never accept a user id from the browser.
 */
export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const { assertSameSiteRequest } = await import("./isolation.server");
    const { requireUserId } = await import("./verify.server");
    assertSameSiteRequest();
    const userId = await requireUserId();
    return next({ context: { userId } });
  },
);
