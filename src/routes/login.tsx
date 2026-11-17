import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();

  return (
    <main className="grid min-h-dvh place-items-center bg-[#f5c518] p-6 text-neutral-950">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-500">
          Kida account
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Sign in to Kida</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Your account keeps your profile, bookings and support history together.
        </p>

        {isPending ? (
          <p className="mt-6 text-sm text-neutral-500">Checking your session…</p>
        ) : user ? (
          <div className="mt-6 rounded-2xl border border-neutral-200 p-4">
            <p className="mb-3 text-sm text-neutral-600">You are signed in.</p>
            <UserButton />
            <a className="mt-5 inline-block text-sm font-semibold underline" href="/">
              Return to Kida
            </a>
          </div>
        ) : authEnabled ? (
          <div className="mt-6 flex flex-col gap-3">
            {GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                onClick={() => void signIn(provider.providerId, { callbackURL: "/login" })}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-left text-sm font-semibold transition hover:bg-neutral-50"
              >
                Continue with {provider.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl bg-neutral-100 p-4 text-sm text-neutral-600">
            Account sign-in is not enabled in this build.
          </p>
        )}

        <p className="mt-6 text-xs leading-5 text-neutral-500">
          Phone-number OTP is not active yet. The ride-booking screen still contains a
          demonstration OTP and does not verify a mobile number.
        </p>
      </section>
    </main>
  );
}
