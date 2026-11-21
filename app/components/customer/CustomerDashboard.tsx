import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Pizza,
  ShoppingBag,
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
import { getShopName } from "@/lib/shop-info";
import type { FeaturedPizza, Order } from "@/types";

const orderBadge: Record<
  string,
  { label: string; variant: "accent" | "secondary" | "muted" | "destructive" }
> = {
  pending: { label: "Pending", variant: "accent" },
  accepted: { label: "Accepted", variant: "secondary" },
  completed: { label: "Delivered", variant: "muted" },
  rejected: { label: "Rejected", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "muted" },
};

const formatDay = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-US", { dateStyle: "medium" });

// Customer home: upcoming delivery, KPIs, recent orders, order mix, picks
export default function CustomerDashboard({
  orders,
  picks,
}: {
  orders: Order[]; // newest first
  picks: FeaturedPizza[]; // featured items to suggest
}) {
  const statusOf = (order: Order) => order.orderDetails.status;
  const count = (status: string) => orders.filter((o) => statusOf(o) === status).length;

  const inProgress = orders.filter((o) => ["pending", "accepted"].includes(statusOf(o)));
  const paid = orders.filter((o) => ["accepted", "completed"].includes(statusOf(o)));
  const spent = paid.reduce((sum, o) => sum + o.orderDetails.total, 0);
  const recent = orders.slice(0, 5);

  // The next order that is on its way (accepted first, then pending)
  const nextUp =
    orders.find((o) => statusOf(o) === "accepted") ?? orders.find((o) => statusOf(o) === "pending");

  const mix = [
    { label: "In progress", value: inProgress.length, color: "bg-accent" },
    { label: "Delivered", value: count("completed"), color: "bg-secondary" },
    { label: "Rejected or cancelled", value: count("rejected") + count("cancelled"), color: "bg-border" },
  ];

  const kpis: Kpi[] = [
    {
      label: "Orders",
      value: number(orders.length),
      sub: "Everything you have ordered",
      icon: ShoppingBag,
      tint: "bg-primary-100 text-primary",
      href: "/customer/myorder",
    },
    {
      label: "In progress",
      value: number(inProgress.length),
      sub: `${number(count("pending"))} waiting · ${number(count("accepted"))} accepted`,
      icon: Clock,
      tint: "bg-accent/30 text-foreground",
      href: "/customer/myorder",
    },
    {
      label: "Delivered",
      value: number(count("completed")),
      sub: "Completed orders",
      icon: CheckCircle2,
      tint: "bg-secondary-100 text-secondary",
      href: "/customer/myorder",
    },
    {
      label: "Total spent",
      value: money(spent),
      sub: "Accepted and delivered orders",
      icon: Wallet,
      tint: "bg-muted text-foreground",
      href: "/customer/myorder",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Next delivery */}
      {nextUp && (
        <AttentionBanner
          icon={Clock}
          title={`${nextUp.orderDetails.quantity} × ${nextUp.orderDetails.itemName} is ${
            statusOf(nextUp) === "accepted" ? "being prepared" : "waiting for the shop"
          }`}
          text={
            nextUp.orderDetails.deliveryDate
              ? `Delivery on ${formatDay(nextUp.orderDetails.deliveryDate)}${
                  nextUp.orderDetails.deliveryAddress ? ` to ${nextUp.orderDetails.deliveryAddress}` : ""
                }.`
              : "We will let the shop know right away."
          }
          action={{ label: "Track orders", href: "/customer/myorder" }}
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
          <Panel title="Recent orders" action={{ label: "View all", href: "/customer/myorder" }}>
            {recent.length === 0 ? (
              <div className="rounded-2xl bg-light p-8 text-center">
                <p className="text-4xl" aria-hidden="true">🍕</p>
                <p className="mt-2 font-bold">No orders yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your first pizza is a few taps away.
                </p>
                <Link href="/menu" className={`${buttonVariants()} mt-4`}>
                  Browse the menu
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
                          {order.vendor?.name ?? getShopName(d.shop)} · {d.size}
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
          {/* Order mix */}
          <Panel title="Your orders" action={{ label: "All orders", href: "/customer/myorder" }}>
            <p className="text-3xl font-extrabold tracking-tight tabular-nums">{number(orders.length)}</p>
            <p className="text-sm text-muted-foreground">
              {orders.length === 1 ? "order" : "orders"} so far
            </p>
            <div
              className="mt-5 flex h-3 overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={mix.map((m) => `${m.label}: ${m.value}`).join(", ")}
            >
              {mix.map((m) =>
                m.value > 0 ? (
                  <span
                    key={m.label}
                    className={`${m.color} h-full`}
                    style={{ width: `${percent(m.value, orders.length)}%` }}
                  />
                ) : null,
              )}
            </div>
            <ul className="mt-4 space-y-2.5">
              {mix.map((m) => (
                <li key={m.label} className="flex items-center gap-3 text-sm">
                  <span aria-hidden="true" className={`size-2.5 rounded-full ${m.color}`} />
                  <span className="flex-1">{m.label}</span>
                  <span className="font-bold tabular-nums">{number(m.value)}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Picks */}
          <Panel title="Hungry again?" action={{ label: "Menu", href: "/menu" }}>
            {picks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Fresh picks will show up here soon.</p>
            ) : (
              <ul className="space-y-3">
                {picks.slice(0, 3).map((pick) => (
                  <li key={pick._id}>
                    <Link
                      href={`/menu/${pick._id}`}
                      className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-muted"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent/30 text-2xl">
                        {pick.emoji ?? <Pizza className="size-5" aria-hidden="true" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold">{pick.itemName}</span>
                        <span className="block text-sm text-muted-foreground tabular-nums">
                          from {money(pick.price)} · {pick.rating} ★
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
