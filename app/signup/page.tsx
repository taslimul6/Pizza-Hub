import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up | PizzaHub",
};

// Account types the user can pick
const accountTypes = [
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Restaurant" },
  { value: "admin", label: "Admin" },
];

// Selling points shown on the left panel
const perks = [
  "Order from 1,200+ local pizza shops",
  "Track your pizza live, all the way to your door",
  "Exclusive deals and first-order discounts",
  "Restaurants: reach new customers and get weekly payouts",
];

// Shared style for all text inputs
const inputClass =
  "h-12 w-full rounded-full border border-border px-5 outline-none focus:border-focus";

// Sign Up page - layout only. The form has no functionality yet.
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

          <form className="mt-8 space-y-5">
            {/* Account type */}
            <fieldset>
              <legend className="mb-1.5 font-bold">I am a...</legend>
              <div className="grid gap-3 min-[440px]:grid-cols-3">
                {accountTypes.map((type, index) => (
                  <label
                    key={type.value}
                    className="flex cursor-pointer items-center gap-2.5 rounded-full border border-border px-4 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary-100"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={type.value}
                      defaultChecked={index === 0}
                      className="accent-primary"
                    />
                    <strong>{type.label}</strong>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Full name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block font-bold">
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Maya Rahman"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block font-bold">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            {/* Password + confirm (side by side on larger screens) */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="mb-1.5 block font-bold">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="confirm" className="mb-1.5 block font-bold">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  placeholder="Repeat password"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5 size-4 accent-primary" />
              <span>
                I agree to the{" "}
                <Link href="#" className="font-bold text-primary-600 hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="font-bold text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3.5 text-lg font-bold text-white hover:bg-primary-600"
            >
              Create account
            </button>
          </form>

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
