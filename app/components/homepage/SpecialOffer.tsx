"use client"; // needed because we use useState for the "Copied!" message

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const COUPON_CODE = "PIZZA30";

export default function SpecialOffer() {
  // true for a moment after the user copies the code
  const [copied, setCopied] = useState(false);

  // Copy the coupon code to the clipboard
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // hide message after 2 seconds
    } catch {
      // Clipboard can be blocked by the browser - ignore silently
    }
  }

  return (
    <section id="offers" className="px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto grid max-w-[1200px] items-center gap-8 rounded-[2rem] bg-dark p-8 text-cream sm:p-12 md:grid-cols-[1fr_auto]">
        <div>
          <Badge variant="accent" className="h-auto py-1 text-sm">
            🔥 Limited-time offer
          </Badge>
          <h2 className="mt-4 font-display text-3xl font-black sm:text-4xl">
            Your first slice is on us — 30% off.
          </h2>
          <p className="mt-3 max-w-xl text-lg text-cream/80">
            New to PizzaHub? Use this code at checkout and save on your first
            order from any participating shop.
          </p>

          {/* Coupon code + copy button */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <code className="rounded-xl border-2 border-dashed border-accent px-5 py-3 text-xl font-bold tracking-widest">
              {COUPON_CODE}
            </code>
            <Button variant="accent" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy code"}
            </Button>
          </div>
          <p className="mt-4 text-sm text-cream/70">
            Valid on first orders over $15 · max discount $9 · ends Dec 31.
          </p>
        </div>

        {/* Big round badge (hidden on small screens) */}
        <div
          aria-hidden="true"
          className="hidden size-44 rotate-6 place-items-center rounded-full bg-primary text-center md:grid"
        >
          <div>
            <b className="block font-display text-5xl font-black">30%</b>
            <span className="font-bold tracking-widest">OFF</span>
          </div>
        </div>
      </div>
    </section>
  );
}
