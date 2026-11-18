import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

type EmailPasswordFormProps = {
  callbackURL?: string;
};

export function EmailPasswordForm({
  callbackURL = "/",
}: EmailPasswordFormProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const result =
        mode === "sign-in"
          ? await authClient.signIn.email({ email, password, callbackURL })
          : await authClient.signUp.email({
              name: name.trim(),
              email,
              password,
              callbackURL,
            });

      if (result.error) {
        throw new Error(result.error.message || "Authentication failed.");
      }

      window.location.assign(callbackURL);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to complete your Kida account request.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5">
      <form onSubmit={submit} className="grid gap-3">
        {mode === "sign-up" ? (
          <label className="grid gap-1.5 text-sm font-semibold text-neutral-700">
            Full name
            <input
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-base font-normal text-neutral-950 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-yellow-300"
              placeholder="Your full name"
            />
          </label>
        ) : null}

        <label className="grid gap-1.5 text-sm font-semibold text-neutral-700">
          Email address
          <input
            autoComplete="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-base font-normal text-neutral-950 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-yellow-300"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-neutral-700">
          Password
          <input
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-xl border border-neutral-200 bg-white px-3 text-base font-normal text-neutral-950 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-yellow-300"
            placeholder="At least 8 characters"
          />
        </label>

        {error ? (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 min-h-12 rounded-xl bg-neutral-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-50"
        >
          {busy
            ? "Please wait…"
            : mode === "sign-in"
              ? "Sign in"
              : "Create Kida account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-neutral-600">
        {mode === "sign-in" ? "New to Kida?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setError("");
          }}
          className="font-semibold text-neutral-950 underline underline-offset-4"
        >
          {mode === "sign-in" ? "Create an account" : "Sign in instead"}
        </button>
      </p>
      <p className="mt-3 text-xs leading-5 text-neutral-500">
        Use the same Kida account in the customer and Captain apps.
      </p>
    </div>
  );
}
