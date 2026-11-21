import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";
import StripeReturn from "@/app/components/vendor/StripeReturn";
import SubscriptionPlans from "@/app/components/vendor/SubscriptionPlans";
import { getObject } from "@/lib/api";
import type { VendorSubscription } from "@/types";

export const metadata: Metadata = {
  title: "Subscription | PizzaHub",
};

// Loads the vendor's plan and active item count (GET /subscription)
async function Plans() {
  const data = await getObject<VendorSubscription>("/subscription", { auth: true });

  if (!data) {
    return (
      <p className="rounded-3xl border border-border bg-white p-10 text-center text-muted-foreground">
        Your plan could not be loaded right now. Please try again soon.
      </p>
    );
  }

  return <SubscriptionPlans data={data} />;
}

// Vendor only (the proxy redirects everyone else)
export default function SubscriptionPage() {
  return (
    <div className="max-w-[900px]">
      <DashboardPageHeader
        eyebrow="Vendor"
        title="Subscription"
        description="Pick the plan that fits your kitchen."
      />
        {/* Confirms the payment when Stripe sends the vendor back */}
        <Suspense>
          <StripeReturn />
        </Suspense>

        <Suspense
          fallback={
            <div role="status" aria-label="Loading your plan" className="grid gap-6">
              <div className="h-28 animate-pulse rounded-3xl bg-muted" />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-96 animate-pulse rounded-3xl bg-muted" />
                <div className="h-96 animate-pulse rounded-3xl bg-muted" />
              </div>
            </div>
          }
        >
          <Plans />
        </Suspense>
    </div>
  );
}
