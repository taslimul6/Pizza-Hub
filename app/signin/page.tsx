import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In | PizzaHub",
};

// Small selling points shown on the left panel
const perks = [
  "Order from 1,200+ local pizza shops",
  "Track your pizza live, all the way to your door",
  "Exclusive deals and first-order discounts",
];

// Sign In page - layout only. The form has no functionality yet.
export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center bg-[radial-gradient(800px_460px_at_88%_18%,#ffe7b0,transparent_62%),radial-gradient(640px_380px_at_-4%_100%,#fddcd3,transparent_62%)] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid w-full max-w-[1000px] overflow-hidden rounded-[2rem] border border-border bg-white shadow-warm-xl lg:grid-cols-2">
        {/* ===== Left: brand panel (hidden on small screens) ===== */}
        <aside className="hidden flex-col justify-between bg-primary p-10 text-white lg:flex">
          <div>
            <p className="font-display text-3xl font-black">
              Pizza<span className="text-accent">Hub</span>
            </p>
            <p className="mt-2 text-lg text-white/90">
              Hot, fresh, and on its way.
            </p>
          </div>

          {/* Pizza picture placeholder */}
          <div
            aria-hidden="true"
            className="mx-auto grid size-48 place-items-center rounded-full bg-accent/90 text-8xl"
          >
            🍕
          </div>

          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex gap-3">
                <span aria-hidden="true" className="text-accent">
                  ✓
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </aside>

        {/* ===== Right: sign in form ===== */}
        <section className="p-6 sm:p-10">
          <h1 className="font-display text-3xl font-black tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-muted">
            Sign in to order your favorite pizza.
          </p>

          <form className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block font-bold">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-full border border-border px-5 outline-none focus:border-focus"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="font-bold">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-sm font-bold text-primary-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-12 w-full rounded-full border border-border px-5 outline-none focus:border-focus"
              />
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="size-4 accent-primary" />
              Remember me
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3.5 text-lg font-bold text-white hover:bg-primary-600"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4 text-sm text-muted">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Sign in with Google (no functionality yet) */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-border px-6 py-3 font-bold hover:bg-sand-100"
          >
            {/* Google "G" logo */}
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
              <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Sign in with Google
          </button>

          {/* Link to the other page */}
          <p className="mt-6 text-center text-muted">
            New to PizzaHub?{" "}
            <Link
              href="/signup"
              className="font-bold text-primary-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
