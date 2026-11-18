import { createFileRoute } from "@tanstack/react-router";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
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
          Use one Kida account for your profile, bookings and support history.
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
        ) : (
          <EmailPasswordForm callbackURL="/" />
        )}
      </section>
    </main>
  );
}
