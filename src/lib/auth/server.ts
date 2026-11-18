import { betterAuth } from "better-auth";
import { getCookie } from "@tanstack/react-start/server";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { ensureDbReady, getPglite } from "../db";
import { pgliteDialect } from "./pglite-dialect";
import { emailAndPasswordEnabled } from "./email-password";

void ensureDbReady();

const env = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value || undefined;
};

const localOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://[::1]:8080",
];

const deploymentHosts = [
  env("VERCEL_URL"),
  env("VERCEL_BRANCH_URL"),
  env("VERCEL_PROJECT_PRODUCTION_URL"),
]
  .filter((value): value is string => Boolean(value))
  .map((value) => value.replace(/^https?:\/\//, "").replace(/\/+$/, ""));

const explicitBaseURL = env("BETTER_AUTH_URL");
const allowedHosts = [
  ...new Set([
    ...deploymentHosts,
    "*.vercel.app",
    "localhost",
    "127.0.0.1",
    "[::1]",
  ]),
];

const baseURL = explicitBaseURL ?? {
  allowedHosts,
  protocol: "auto" as const,
  fallback: "http://localhost:8080",
};

const trustedOrigins = [
  ...(explicitBaseURL ? [explicitBaseURL] : []),
  ...deploymentHosts.map((host) => `https://${host}`),
  "https://*.vercel.app",
  ...localOrigins,
];

const databaseUrl = env("DATABASE_URL");
const database = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

const globalAuthRef = globalThis as typeof globalThis & {
  __kidaAuthSecret__?: string;
};
const authSecret =
  globalAuthRef.__kidaAuthSecret__ ??
  (globalAuthRef.__kidaAuthSecret__ =
    env("BETTER_AUTH_SECRET") ?? randomBytes(32).toString("hex"));

export const authConfigured = true;
export const SESSION_TOKEN_COOKIE = "__Host-kida-auth.session_token";

export const auth = betterAuth({
  baseURL,
  secret: authSecret,
  database,
  trustedOrigins,
  emailAndPassword: {
    enabled: emailAndPasswordEnabled,
    requireEmailVerification: false,
  },
  session: {
    cookieCache: { enabled: true, maxAge: 300 },
  },
  advanced: {
    useSecureCookies: false,
    defaultCookieAttributes: {
      secure: true,
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      session_token: { name: SESSION_TOKEN_COOKIE },
      session_data: { name: "__Host-kida-auth.session_data" },
      account_data: { name: "__Host-kida-auth.account_data" },
      dont_remember: { name: "__Host-kida-auth.dont_remember" },
    },
  },
  plugins: [tanstackStartCookies()],
});

export function readSessionToken(): string | null {
  return getCookie(SESSION_TOKEN_COOKIE) ?? null;
}
