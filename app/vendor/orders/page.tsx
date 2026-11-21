import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";
import VendorOrdersList from "@/app/components/vendor/VendorOrdersList";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { Order } from "@/types";

export const metadata: Metadata = {
  title: "Incoming Orders | PizzaHub",
};

// Loads only the orders that belong to the logged-in vendor
async function MyOrders() {
  const session = await auth.api.getSession({ headers: await headers() });
  // The proxy already blocks guests; this is only a safety net
  if (!session) return null;

  const orders = await getList<Order>("/orders/vendor", { auth: true });

  return <VendorOrdersList orders={orders} />;
}

// Vendor only (the proxy redirects everyone else)
export default function VendorOrdersPage() {
  return (
    <div className="max-w-[900px]">
      <DashboardPageHeader
        eyebrow="Vendor"
        title="Incoming orders"
        description="Accept or reject new orders, then mark them completed once delivered."
      />
        <Suspense
          fallback={
            <div role="status" aria-label="Loading orders" className="grid gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-3xl bg-muted" />
              ))}
            </div>
          }
        >
          <MyOrders />
        </Suspense>
    </div>
  );
}
