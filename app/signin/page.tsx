import type { Metadata } from "next";
import Link from "next/link";
import GoogleButton from "../components/shared/GoogleButton";
import SignInForm from "../components/signin/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | PizzaHub",
};

// Small selling points shown on the left panel
const perks = [
  "Order from 1,200+ local pizza shops",
  "Track your pizza live, all the way to your door",
  "Exclusive deals and first-order discounts",
];

// Sign In page - layout. The working form is in SignInForm.
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

          <SignInForm />

          {/* Divider */}
          <div className="my-6 flex items-center gap-4 text-sm text-muted">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Sign in with Google */}
          <GoogleButton label="Sign in with Google" />

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
