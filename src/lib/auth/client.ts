import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export async function signOut(redirectTo = "/"): Promise<void> {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message ?? "Sign-out failed");
  if (typeof window !== "undefined") window.location.assign(redirectTo);
}
