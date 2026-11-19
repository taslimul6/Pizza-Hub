"use client"; // needed because we use useState for the newsletter form

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AppAndNewsletter() {
  // What the user typed in the email box
  const [email, setEmail] = useState("");
  // Message shown under the form, and whether it is an error
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Runs when the newsletter form is submitted
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the page from reloading

    // Very simple email check: needs text, an "@" and a "."
    if (!email.includes("@") || !email.includes(".")) {
      setIsError(true);
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsError(false);
    setMessage("Thanks for subscribing! 🍕");
    setEmail("");
    // TODO: send the email to the backend once it exists
  }

  return (
    <section className="px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-2">
        {/* ===== App download ===== */}
        <div className="flex items-center justify-between gap-6 overflow-hidden rounded-3xl bg-dark p-8 text-white">
          <div>
            <h2 className="font-display text-2xl font-black">
              Pizza in your pocket
            </h2>
            <p className="mt-2 text-white/80">
              Get the PizzaHub app for live order tracking, exclusive app-only
              deals and one-tap reordering.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#"
                className="rounded-xl border border-white/40 px-4 py-2 hover:bg-white/10"
              >
                <small className="block text-xs">Download on the</small>
                <strong>App Store</strong>
              </a>
              <a
                href="#"
                className="rounded-xl border border-white/40 px-4 py-2 hover:bg-white/10"
              >
                <small className="block text-xs">Get it on</small>
                <strong>Google Play</strong>
              </a>
            </div>
          </div>
          {/* Simple phone drawing (decoration only) */}
          <div
            aria-hidden="true"
            className="hidden h-40 w-24 shrink-0 rounded-2xl border-4 border-white/30 bg-primary sm:grid sm:place-items-center sm:text-4xl"
          >
            🍕
          </div>
        </div>

        {/* ===== Newsletter ===== */}
        <Card className="gap-0 rounded-3xl border border-border p-8 text-base ring-0">
          <h3 className="font-display text-2xl font-black">
            Get hot deals in your inbox
          </h3>
          <p className="mt-2 text-muted-foreground">
            Weekly offers, new shop alerts and the occasional pizza joke. No
            spam, unsubscribe anytime.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-wrap gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="min-w-0 flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>

          <p
            role="status"
            className={`mt-3 min-h-6 font-bold ${
              isError ? "text-error" : "text-secondary"
            }`}
          >
            {message}
          </p>
        </Card>
      </div>
    </section>
  );
}
