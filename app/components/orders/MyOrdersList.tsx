import { headers } from "next/headers";
import Link from "next/link";
import CancelOrderButton from "@/app/components/orders/CancelOrderButton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";
import { getShopName } from "@/lib/shop-info";
import type { Order } from "@/types";

// Show "Nov 20, 2026, 3:45 PM"
function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Loads the orders the logged-in user placed as a customer (customers and admins).
// basePath is the details page folder, e.g. "/customer/myorder" or "/admin/myorder".
// Put it inside <Suspense> because it reads the session.
export default async function MyOrdersList({ basePath }: { basePath: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  // The proxy already blocks guests; this is only a safety net
  if (!session) return null;

  const orders = await getList<Order>("/orders/customer", { auth: true });

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
                <h2 className="text-xl font-bold">
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
              <p className="text-2xl font-extrabold tracking-tight text-primary tabular-nums">
                ${d.total.toFixed(2)}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <Link
                href={`${basePath}/${order._id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                View details &amp; status
              </Link>
              {/* Only pending orders can be cancelled */}
              {d.status === "pending" && (
                <CancelOrderButton
                  orderId={order._id}
                  orderName={`${d.quantity} × ${d.itemName}`}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
