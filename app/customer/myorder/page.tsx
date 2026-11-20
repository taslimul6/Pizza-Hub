import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import SectionHeading from "@/app/components/homepage/SectionHeading";
import CancelOrderButton from "@/app/components/orders/CancelOrderButton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";
import { getShopName } from "@/lib/shop-info";
import type { Order } from "@/types";

export const metadata: Metadata = {
  title: "My Orders | PizzaHub",
};

// Show "Nov 20, 2026, 3:45 PM"
function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Loads the logged-in customer's orders (inside <Suspense> because it reads the session)
async function OrderList() {
  const session = await auth.api.getSession({ headers: await headers() });
  // The proxy already blocks guests; this is only a safety net
  if (!session) return null;

  const orders = await getList<Order>(
    `/orders/customer?customerId=${session.user.id}`,
  );

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white p-10 text-center">
        <p className="text-5xl">🍕</p>
        <h2 className="mt-3 font-display text-xl font-bold">No orders yet</h2>
        <p className="mt-1 text-muted-foreground">
          When you place an order it will show up here.
        </p>
        <Link href="/menu" className={`${buttonVariants()} mt-5`}>
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-4">
      {orders.map((order) => {
        const d = order.orderDetails;
        return (
          <li
            key={order._id}
            className="rounded-3xl border border-border bg-white p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">
                  {d.quantity} × {d.itemName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {d.size} · {d.crust} crust · from {getShopName(d.shop)}
                </p>
              </div>
              <Badge variant="accent" className="capitalize">
                {d.status}
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 text-sm text-muted-foreground">
              <div>
                <p>Placed {formatDate(order.createdAt)}</p>
                <p>Card ending {d.cardLast4}</p>
                <p className="mt-1 text-xs">Order #{order._id.slice(-6)}</p>
              </div>
              <p className="text-2xl font-black text-primary">
                ${d.total.toFixed(2)}
              </p>
            </div>

            {/* Only pending orders can be cancelled */}
            {d.status === "pending" && (
              <div className="mt-4 border-t border-border pt-4">
                <CancelOrderButton
                  orderId={order._id}
                  orderName={`${d.quantity} × ${d.itemName}`}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Customer only (the proxy redirects everyone else)
export default function MyOrdersPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-[800px]">
        <SectionHeading
          eyebrow="Customer"
          title="My orders"
          subtitle="Everything you have ordered from PizzaHub."
        />
        <Suspense
          fallback={
            <div role="status" aria-label="Loading orders" className="grid gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-3xl bg-muted"
                />
              ))}
            </div>
          }
        >
          <OrderList />
        </Suspense>
      </div>
    </main>
  );
}
