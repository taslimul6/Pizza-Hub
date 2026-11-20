import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import SectionHeading from "@/app/components/homepage/SectionHeading";
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

  const orders = await getList<Order>(
    `/orders/vendor?email=${encodeURIComponent(session.user.email)}`,
  );

  return <VendorOrdersList orders={orders} />;
}

// Vendor only (the proxy redirects everyone else)
export default function VendorOrdersPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-[900px]">
        <SectionHeading
          eyebrow="Vendor"
          title="Incoming orders"
          subtitle="Accept or reject new orders, then mark them completed once delivered."
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
    </main>
  );
}
