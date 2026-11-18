"use client"; // needed because we use useState for the search box

import Link from "next/link";
import { useState } from "react";

// Pepperoni positions on the pizza drawing: [x, y, radius]
const pepperoni = [
  [200, 196, 22],
  [276, 152, 24],
  [276, 240, 24],
  [200, 284, 24],
  [124, 240, 24],
  [124, 152, 24],
  [200, 108, 24],
];

// Numbers shown under the buttons
const stats = [
  { value: "1,200+", label: "Local pizza shops" },
  { value: "25 min", label: "Average delivery" },
  { value: "4.8 ★", label: "From 48k reviews" },
];

export default function Hero() {
  // What the user typed in the address box
  const [address, setAddress] = useState("");
  // Error message shown under the search box
  const [error, setError] = useState("");

  // Runs when the search form is submitted
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the page from reloading

    if (address.trim() === "") {
      setError("Please enter your delivery address.");
      return;
    }

    setError("");
    // TODO: search for shops near this address once shop data exists
  }

  return (
    <section className="bg-[radial-gradient(800px_460px_at_88%_18%,#ffe7b0,transparent_62%),radial-gradient(640px_380px_at_-4%_100%,#fddcd3,transparent_62%)] px-4 pb-20 pt-10 sm:px-6 lg:pb-28 lg:pt-16">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ===== Left side: text, search, buttons, stats ===== */}
        <div>
          {/* Small badge above the title */}
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-white py-1.5 pl-2 pr-4 text-sm font-bold">
            <span className="grid size-6 place-items-center rounded-full bg-accent text-xs">
              ⚡
            </span>
            Now delivering in 120+ neighborhoods
          </p>

          <h1 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Hot,{" "}
            <span className="text-primary underline decoration-accent decoration-4 underline-offset-4">
              fresh
            </span>{" "}
            pizza from the shops you love.
          </h1>

          <p className="mt-4 max-w-[52ch] text-lg text-muted">
            Browse menus from local pizzerias, build your order in seconds, and
            track it all the way to your door — usually in about 25 minutes.
          </p>

          {/* Address search */}
          <form
            onSubmit={handleSubmit}
            role="search"
            className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-white py-2 pl-5 pr-2 shadow-warm-md focus-within:border-focus"
          >
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Find pizza near you — enter your address"
              aria-label="Delivery address"
              className="h-12 min-w-0 flex-1 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-3 font-bold text-white hover:bg-primary-600"
            >
              Find pizza
            </button>
          </form>

          {/* Error message (empty space is kept so the layout doesn't jump) */}
          <p role="alert" className="mt-2 min-h-6 pl-5 text-sm text-error">
            {error}
          </p>

          {/* Call-to-action buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/#menu"
              className="rounded-full bg-primary px-7 py-3.5 text-lg font-bold text-white hover:bg-primary-600"
            >
              Order Now
            </Link>
            <Link
              href="/#partner"
              className="rounded-full border-2 border-dark px-7 py-3.5 text-lg font-bold hover:bg-dark hover:text-white"
            >
              Become a Partner
            </Link>
          </div>

          {/* Stats */}
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((stat) => (
              <li key={stat.label} className="flex flex-col">
                <strong className="font-display text-3xl leading-tight">
                  {stat.value}
                </strong>
                <span className="text-sm text-muted">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Right side: pizza picture and floating cards ===== */}
        <div className="relative grid place-items-center">
          {/* Yellow circle behind the pizza */}
          <div className="absolute aspect-square w-[92%] rounded-full bg-accent opacity-35" />

          {/* Pizza drawing (slowly spins) */}
          <svg
            viewBox="0 0 400 400"
            role="img"
            aria-label="Illustration of a pepperoni pizza"
            className="relative w-full max-w-md animate-[spin_90s_linear_infinite] drop-shadow-2xl"
          >
            <circle cx="200" cy="196" r="180" fill="#E0933A" /> {/* crust */}
            <circle cx="200" cy="196" r="152" fill="#D8342A" /> {/* sauce */}
            <circle cx="200" cy="196" r="146" fill="#FFD670" /> {/* cheese */}
            {pepperoni.map(([x, y, r]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#B8281D" />
            ))}
            {/* a few olives */}
            <circle cx="236" cy="150" r="8" fill="#2A1A14" />
            <circle cx="166" cy="244" r="8" fill="#2A1A14" />
            <circle cx="240" cy="234" r="8" fill="#2A1A14" />
            <circle cx="158" cy="150" r="8" fill="#2A1A14" />
          </svg>

          {/* Floating info cards */}
          <div className="absolute left-0 top-[8%] rounded-2xl bg-white px-4 py-2.5 text-sm shadow-warm-xl">
            Out for delivery
            <strong className="block">Arrives in 12 min</strong>
          </div>
          <div className="absolute bottom-[10%] right-0 rounded-2xl bg-white px-4 py-2.5 text-sm shadow-warm-xl">
            Napoli Slice
            <strong className="block">4.9 ★ · 1.2k reviews</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
