"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VendorSubscription } from "@/types";

// What each plan gives (shown on the cards)
const plans = [
  {
    id: "free" as const,
    name: "Free",
    priceLabel: "$0",
    note: "forever",
    features: [
      "Max 3 active menu items",
      "Basic vendor dashboard",
      "Order management",
    ],
  },
  {
    id: "premium" as const,
    name: "Premium",
    priceLabel: "", // filled in from the API
    note: "",
    features: [
      "Unlimited active items",
      "Premium vendor badge on your items",
      "Featured menu placement",
      "All Free features",
    ],
  },
];

function formatDay(value: string) {
  return new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" });
}

// Current plan + the two plan cards. Upgrading sends the vendor to Stripe Checkout.
export default function SubscriptionPlans({ data }: { data: VendorSubscription }) {
  const [redirecting, setRedirecting] = useState(false);

  // Ask the server for a Stripe Checkout page, then go there
  async function goToCheckout() {
    setRedirecting(true);
    try {
      const res = await fetch("/api/subscription", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Could not open the payment page");
        setRedirecting(false);
        return;
      }
      window.location.assign(data.url); // Stripe's secure payment page
    } catch {
      toast.error("Network error. Please try again.");
      setRedirecting(false);
    }
  }
  const isPremium = data.plan === "premium";
  const atLimit = data.activeLimit !== null && data.activeItems >= data.activeLimit;

  return (
    <>
      {/* Current plan */}
      <section
        aria-label="Your plan"
        className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-white p-6"
      >
        <div>
          <p className="text-sm font-bold text-muted-foreground">Your plan</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-black">
              {isPremium ? "Premium" : "Free"}
            </h2>
            {isPremium && <Badge variant="accent">⭐ Premium vendor</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {isPremium && data.expiresAt
              ? `Active until ${formatDay(data.expiresAt)}. It does not renew by itself.`
              : "Upgrade any time to sell more items."}
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl text-primary font-extrabold tracking-tight tabular-nums">
            {data.activeItems}
            {data.activeLimit !== null && (
              <span className="text-xl text-muted-foreground"> / {data.activeLimit}</span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            active {data.activeItems === 1 ? "item" : "items"}
            {data.activeLimit === null && " (unlimited)"}
          </p>
        </div>
      </section>

      {atLimit && (
        <p className="mb-8 rounded-2xl border border-accent bg-accent/25 p-4 text-sm font-bold">
          You have reached the Free limit of {data.activeLimit} active items. Upgrade to
          Premium to switch on more.
        </p>
      )}

      {/* Plan cards */}
      <ul className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const current = plan.id === data.plan;
          const premiumCard = plan.id === "premium";
          return (
            <li
              key={plan.id}
              className={`flex flex-col rounded-3xl border bg-white p-8 ${
                premiumCard ? "border-2 border-primary shadow-warm-md" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-2xl font-black">{plan.name}</h3>
                {current && <Badge variant="secondary">Current plan</Badge>}
                {!current && premiumCard && <Badge variant="accent">Recommended</Badge>}
              </div>

              <p className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight tabular-nums">
                  {premiumCard ? `$${data.price.toFixed(2)}` : plan.priceLabel}
                </span>{" "}
                <span className="text-muted-foreground">
                  {premiumCard ? `/ ${data.periodDays} days` : plan.note}
                </span>
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span aria-hidden="true" className="font-bold text-secondary">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {premiumCard ? (
                  <>
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={redirecting}
                      onClick={goToCheckout}
                    >
                      {redirecting
                        ? "Opening Stripe…"
                        : isPremium
                          ? `Renew for ${data.price.toFixed(2)}`
                          : "Upgrade to Premium"}
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      🔒 You pay on Stripe&apos;s secure page.
                      {isPremium && " Renewing adds 30 days after your current end date."}
                    </p>
                  </>
                ) : current ? (
                  <Link
                    href="/vendor/manage"
                    className={`${buttonVariants({ variant: "outline", size: "lg" })} w-full`}
                  >
                    Manage my menu
                  </Link>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    You go back to Free when Premium ends.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
