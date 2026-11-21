import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";
import MyOrdersList from "@/app/components/orders/MyOrdersList";

export const metadata: Metadata = {
  title: "My Orders | PizzaHub",
};

// Customer only (the proxy redirects everyone else)
export default function MyOrdersPage() {
  return (
    <div className="max-w-[800px]">
      <DashboardPageHeader
        eyebrow="Customer"
        title="My orders"
        description="Everything you have ordered from PizzaHub."
      />
      <Suspense
        fallback={
          <div role="status" aria-label="Loading orders" className="grid gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        }
      >
        <MyOrdersList basePath="/customer/myorder" />
      </Suspense>
    </div>
  );
}
