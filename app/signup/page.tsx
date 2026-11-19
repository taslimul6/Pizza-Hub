import type { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "../components/signup/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up | PizzaHub",
};

// Selling points shown on the left panel
const perks = [
  "Order from 1,200+ local pizza shops",
  "Track your pizza live, all the way to your door",
  "Exclusive deals and first-order discounts",
  "Restaurants: reach new customers and get weekly payouts",
];

// Sign Up page - layout. The working form is in SignUpForm.
// The left panel is taller than on the Sign In page (bigger pizza, extra
// perk and a review card) so it matches the longer form.
export default function SignUpPage() {
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

          {/* Pizza picture placeholder (bigger than on Sign In) */}
          <div
            aria-hidden="true"
            className="mx-auto grid size-60 place-items-center rounded-full bg-accent/90 text-9xl"
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

          {/* Review card */}
          <figure className="rounded-2xl bg-white/10 p-5">
            <div aria-label="5 out of 5 stars" role="img" className="text-accent">
              ★★★★★
            </div>
            <blockquote className="mt-2 text-white/90">
              “Checkout takes seconds and the delivery fees are always clear.
              Friday pizza night has never been this easy.”
            </blockquote>
            <figcaption className="mt-3 text-sm font-bold">
              Daniel Ortiz · Weekly regular
            </figcaption>
          </figure>
        </aside>

        {/* ===== Right: sign up form ===== */}
        <section className="p-6 sm:p-10">
          <h1 className="font-display text-3xl font-black tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-muted">
            Join PizzaHub and get hot, fresh pizza delivered.
          </p>

          <SignUpForm />

          {/* Link to the other page */}
          <p className="mt-6 text-center text-muted">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-bold text-primary-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
