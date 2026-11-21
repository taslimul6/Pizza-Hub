import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import AttentionBanner from "@/app/components/dashboard/AttentionBanner";
import {
  formatMoney as money,
  formatNumber as number,
  formatShortDate,
  percent,
} from "@/app/components/dashboard/format";
import KpiCard, { type Kpi } from "@/app/components/dashboard/KpiCard";
import Panel from "@/app/components/dashboard/Panel";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { ItemStatus, Order, VendorSubscription } from "@/types";

const orderBadge: Record<
  string,
  { label: string; variant: "accent" | "secondary" | "muted" | "destructive" }
> = {
  pending: { label: "Pending", variant: "accent" },
  accepted: { label: "Accepted", variant: "secondary" },
  completed: { label: "Completed", variant: "muted" },
  rejected: { label: "Rejected", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "muted" },
};

const formatDay = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" });

// Vendor home: new-orders banner, KPIs, recent orders, menu status, plan
export default function VendorDashboard({
  subscription,
  itemStatuses,
  orders,
}: {
  subscription: VendorSubscription;
  itemStatuses: ItemStatus[]; // one entry per menu item
  orders: Order[]; // newest first
}) {
  const statusOf = (order: Order) => order.orderDetails.status;
  const countOrders = (status: string) => orders.filter((o) => statusOf(o) === status).length;

  const pendingOrders = countOrders("pending");
  const paidOrders = orders.filter((o) => ["accepted", "completed"].includes(statusOf(o)));
  const revenue = paidOrders.reduce((sum, o) => sum + o.orderDetails.total, 0);
  const recent = orders.slice(0, 5);

  const countItems = (status: ItemStatus) => itemStatuses.filter((s) => s === status).length;
  const menuMix = [
    { label: "Approved (live)", value: countItems("approved"), color: "bg-secondary" },
    { label: "Pending review", value: countItems("pending"), color: "bg-accent" },
    { label: "Inactive", value: countItems("inactive"), color: "bg-border" },
    { label: "Rejected", value: countItems("rejected"), color: "bg-primary" },
  ];

  const isPremium = subscription.plan === "premium";
  const atLimit =
    subscription.itemLimit !== null && subscription.totalItems >= subscription.itemLimit;

  const kpis: Kpi[] = [
    {
      label: "Revenue",
      value: money(revenue),
      sub: `${number(paidOrders.length)} accepted or completed orders`,
      icon: Wallet,
      tint: "bg-secondary-100 text-secondary",
      href: "/vendor/orders",
    },
    {
      label: "Orders",
      value: number(orders.length),
      sub: `${number(pendingOrders)} new · ${number(countOrders("accepted"))} in progress`,
      icon: ShoppingBag,
      tint: "bg-primary-100 text-primary",
      href: "/vendor/orders",
    },
    {
      label: "Menu items",
      value:
        subscription.itemLimit === null
          ? number(subscription.totalItems)
          : `${number(subscription.totalItems)} / ${subscription.itemLimit}`,
      sub:
        subscription.itemLimit === null
          ? `${number(subscription.activeItems)} live · unlimited on Premium`
          : `${number(subscription.activeItems)} live · Free plan limit`,
      icon: UtensilsCrossed,
      tint: "bg-accent/30 text-foreground",
      href: "/vendor/manage",
    },
    {
      label: "Plan",
      value: isPremium ? "Premium" : "Free",
      sub:
        isPremium && subscription.expiresAt
          ? `Active until ${formatDay(subscription.expiresAt)}`
          : "Upgrade for unlimited items",
      icon: Sparkles,
      tint: isPremium ? "bg-dark text-accent" : "bg-muted text-foreground",
      href: "/vendor/subscription",
    },
  ];

  return (
    <div className="space-y-8">
      {/* New orders */}
      {pendingOrders > 0 && (
        <AttentionBanner
          icon={ShoppingBag}
          title={`${number(pendingOrders)} new ${pendingOrders === 1 ? "order is" : "orders are"} waiting`}
          text="Accept or reject them so your customers know what is happening."
          action={{ label: "Review orders", href: "/vendor/orders" }}
        />
      )}

      {/* KPIs */}
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <li key={kpi.label}>
            <KpiCard kpi={kpi} />
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <Panel title="Recent orders" action={{ label: "View all", href: "/vendor/orders" }}>
            {recent.length === 0 ? (
              <div className="rounded-2xl bg-light p-8 text-center">
                <p className="text-muted-foreground">
                  No orders yet. Once customers order your items they show up here.
                </p>
                <Link href="/vendor/manage" className={`${buttonVariants({ variant: "outline" })} mt-4`}>
                  Check your menu
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((order) => {
                  const d = order.orderDetails;
                  const badge = orderBadge[d.status] ?? { label: d.status, variant: "muted" as const };
                  return (
                    <li key={order._id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-100 text-sm font-bold text-primary tabular-nums">
                        {d.quantity}×
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{d.itemName}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {order.name} · {d.size}
                          {d.deliveryDate ? ` · deliver ${formatShortDate(d.deliveryDate)}` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-bold tabular-nums">{money(d.total)}</p>
                        <p className="mt-0.5 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                          {formatShortDate(order.createdAt)}
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Menu status */}
          <Panel title="Your menu" action={{ label: "Manage", href: "/vendor/manage" }}>
            <p className="text-3xl font-extrabold tracking-tight tabular-nums">
              {number(itemStatuses.length)}
            </p>
            <p className="text-sm text-muted-foreground">
              {itemStatuses.length === 1 ? "item" : "items"} on your menu
            </p>

            <div
              className="mt-5 flex h-3 overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={menuMix.map((m) => `${m.label}: ${m.value}`).join(", ")}
            >
              {menuMix.map((m) =>
                m.value > 0 ? (
                  <span
                    key={m.label}
                    className={`${m.color} h-full`}
                    style={{ width: `${percent(m.value, itemStatuses.length)}%` }}
                  />
                ) : null,
              )}
            </div>

            <ul className="mt-4 space-y-2.5">
              {menuMix.map((m) => (
                <li key={m.label} className="flex items-center gap-3 text-sm">
                  <span aria-hidden="true" className={`size-2.5 rounded-full ${m.color}`} />
                  <span className="flex-1">{m.label}</span>
                  <span className="font-bold tabular-nums">{number(m.value)}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/vendor/addMenu"
              className={`${buttonVariants({ variant: "outline" })} mt-5 w-full`}
            >
              Add a menu item
            </Link>
          </Panel>

          {/* Plan */}
          {isPremium ? (
            <section className="rounded-3xl bg-dark p-6 text-cream">
              <p className="flex items-center gap-2 text-sm font-bold text-accent">
                <Sparkles className="size-4" aria-hidden="true" />
                Premium vendor
              </p>
              <p className="mt-2 font-display text-xl font-bold">Unlimited items and featured placement</p>
              {subscription.expiresAt && (
                <p className="mt-1 text-sm text-cream/70">
                  Active until {formatDay(subscription.expiresAt)}. It does not renew by itself.
                </p>
              )}
              <Link
                href="/vendor/subscription"
                className="mt-4 flex items-center gap-1 text-sm font-bold text-accent hover:underline"
              >
                Renew or view plan
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </section>
          ) : (
            <section className="rounded-3xl border-2 border-primary bg-white p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-primary">
                <Sparkles className="size-4" aria-hidden="true" />
                {atLimit ? "You reached the Free limit" : "Grow with Premium"}
              </p>
              <p className="mt-2 font-display text-xl font-bold">
                Unlimited items, a Premium badge and featured placement
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                ${subscription.price.toFixed(2)} for {subscription.periodDays} days, paid securely with Stripe.
              </p>
              <Link href="/vendor/subscription" className={`${buttonVariants()} mt-4 w-full`}>
                Upgrade to Premium
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
