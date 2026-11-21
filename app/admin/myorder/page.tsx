import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";
import MyOrdersList from "@/app/components/orders/MyOrdersList";

export const metadata: Metadata = {
  title: "My Orders | PizzaHub",
};

// Admin only (the proxy redirects everyone else).
// Shows the orders the admin placed themselves, as a customer.
export default function AdminMyOrdersPage() {
  return (
    <div className="max-w-[800px]">
      <DashboardPageHeader
        eyebrow="Admin"
        title="My orders"
        description="Orders you placed yourself as a customer."
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
        <MyOrdersList basePath="/admin/myorder" />
      </Suspense>
    </div>
  );
}
