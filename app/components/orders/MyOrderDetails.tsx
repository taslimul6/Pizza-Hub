import Link from "next/link";
import { CalendarDays, MapPin, MessageSquare, Store } from "lucide-react";
import { formatMoney } from "@/app/components/dashboard/format";
import Panel from "@/app/components/dashboard/Panel";
import CancelOrderButton from "@/app/components/orders/CancelOrderButton";
import OrderTimeline from "@/app/components/orders/OrderTimeline";
import { Badge } from "@/components/ui/badge";
import { getObject } from "@/lib/api";
import { getShopName } from "@/lib/shop-info";
import type { OrderWithTimeline } from "@/types";

const statusBadge: Record<string, { label: string; variant: "accent" | "secondary" | "muted" | "destructive" }> = {
  pending: { label: "Pending", variant: "accent" },
  accepted: { label: "Accepted", variant: "secondary" },
  completed: { label: "Delivered", variant: "muted" },
  rejected: { label: "Rejected", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "muted" },
};

const formatDay = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-US", { dateStyle: "full" });

// Loads one order (the API checks it belongs to this user).
// basePath is the list page, e.g. "/customer/myorder" or "/admin/myorder".
export default async function MyOrderDetails({
  params,
  basePath,
}: {
  params: Promise<{ id: string }>;
  basePath: string;
}) {
  const { id } = await params;
  const order = /^[a-f0-9]{24}$/i.test(id)
    ? await getObject<OrderWithTimeline>(`/orders/${id}`, { auth: true })
    : null;

  // Wrong id, someone else's order, or not found
  if (!order) {
    return (
      <div className="rounded-3xl border border-border bg-white p-10 text-center">
        <p className="text-5xl" aria-hidden="true">🧾</p>
        <h2 className="mt-3 font-display text-xl font-bold">Order not found</h2>
        <p className="mt-1 text-muted-foreground">
          This order does not exist or does not belong to your account.
        </p>
        <Link href={basePath} className="mt-5 inline-flex font-bold text-primary-600 hover:underline">
          Back to my orders
        </Link>
      </div>
    );
  }

  const d = order.orderDetails;
  const badge = statusBadge[d.status] ?? { label: d.status, variant: "muted" as const };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Item + delivery */}
      <div className="space-y-6 lg:col-span-2">
        <section className="flex flex-wrap items-center gap-5 rounded-3xl border border-border bg-white p-6">
          <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-accent/30 text-5xl">
            {order.itemImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={order.itemImage} alt={d.itemName} className="size-full object-cover" />
            ) : (
              order.itemEmoji ?? "🍕"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">
                {d.quantity} × {d.itemName}
              </h2>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {d.size} · {d.crust} crust · {formatMoney(d.unitPrice)} each
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Requested on{" "}
              {new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
              {" · "}Order #{order._id.slice(-6)}
            </p>
          </div>
          <p className="text-2xl font-extrabold tracking-tight text-primary tabular-nums">
            {formatMoney(d.total)}
          </p>
        </section>

        <Panel title="Delivery">
          <dl className="grid gap-5 sm:grid-cols-2">
            <Info icon={CalendarDays} label="Delivery date" value={d.deliveryDate ? formatDay(d.deliveryDate) : "Not provided"} />
            <Info icon={MapPin} label="Delivery address" value={d.deliveryAddress || "Not provided"} />
            <Info icon={Store} label="Restaurant" value={order.vendor?.name ?? getShopName(d.shop)} />
            <Info icon={MessageSquare} label="Your message" value={d.message || "No message"} />
          </dl>
        </Panel>

        {d.status === "pending" && (
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-white p-6">
            <p className="text-muted-foreground">
              Changed your mind? You can cancel while the order is still pending.
            </p>
            <CancelOrderButton orderId={order._id} orderName={`${d.quantity} × ${d.itemName}`} />
          </section>
        )}
      </div>

      {/* Timeline */}
      <Panel title="Order status">
        <OrderTimeline status={d.status} history={order.statusHistory} />
      </Panel>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd className="font-bold break-words">{value}</dd>
      </div>
    </div>
  );
}
