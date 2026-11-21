import {
  ClipboardCheck,
  CreditCard,
  ReceiptText,
  Sparkles,
  UtensilsCrossed,
  Users,
  Wallet,
} from "lucide-react";
import AttentionBanner from "@/app/components/dashboard/AttentionBanner";
import {
  formatMoney as money,
  formatNumber as number,
  formatShortDate as formatDate,
  percent,
} from "@/app/components/dashboard/format";
import KpiCard, { type Kpi } from "@/app/components/dashboard/KpiCard";
import Panel from "@/app/components/dashboard/Panel";
import { Badge } from "@/components/ui/badge";
import type { AdminStats, AdminTransaction } from "@/types";

const paymentBadge: Record<
  AdminTransaction["paymentStatus"],
  { label: string; variant: "secondary" | "accent" | "muted" }
> = {
  paid: { label: "Paid", variant: "secondary" },
  pending: { label: "Pending", variant: "accent" },
  refunded: { label: "Refunded", variant: "muted" },
};

// ---- The dashboard ----

// Admin home: attention banner, KPIs, recent transactions, user mix, menu health
export default function AdminDashboard({
  stats,
  transactions,
}: {
  stats: AdminStats;
  transactions: AdminTransaction[];
}) {
  const paid = transactions.filter((t) => t.paymentStatus === "paid");
  const revenue = paid.reduce((sum, t) => sum + t.amount, 0);
  const subscriptionRevenue = paid
    .filter((t) => t.type === "subscription")
    .reduce((sum, t) => sum + t.amount, 0);
  const recent = transactions.slice(0, 5);

  const admins = Math.max(stats.users - stats.vendors - stats.customers, 0);
  const userMix = [
    { label: "Customers", value: stats.customers, color: "bg-accent" },
    { label: "Vendors", value: stats.vendors, color: "bg-secondary" },
    { label: "Admins", value: admins, color: "bg-dark" },
  ];

  const reviewed = Math.max(stats.menuItems - stats.pendingItems, 0);

  const kpis: Kpi[] = [
    {
      label: "Revenue (paid)",
      value: money(revenue),
      sub: `${number(paid.length)} paid · ${money(subscriptionRevenue)} from plans`,
      icon: Wallet,
      tint: "bg-secondary-100 text-secondary",
      href: "/admin/transactions",
    },
    {
      label: "Transactions",
      value: number(stats.transactions),
      sub: "Orders and subscriptions",
      icon: ReceiptText,
      tint: "bg-primary-100 text-primary",
      href: "/admin/transactions",
    },
    {
      label: "Menu items",
      value: number(stats.menuItems),
      sub: `${number(stats.pendingItems)} waiting for review`,
      icon: UtensilsCrossed,
      tint: "bg-accent/30 text-foreground",
      href: "/admin/menu-review",
    },
    {
      label: "Registered users",
      value: number(stats.users),
      sub: `${number(stats.vendors)} vendors · ${number(stats.customers)} customers`,
      icon: Users,
      tint: "bg-muted text-foreground",
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Needs attention */}
      {stats.pendingItems > 0 && (
        <AttentionBanner
          icon={ClipboardCheck}
          title={`${number(stats.pendingItems)} menu ${stats.pendingItems === 1 ? "item is" : "items are"} waiting for review`}
          text="Customers only see items after you approve them."
          action={{ label: "Review now", href: "/admin/menu-review" }}
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
        {/* Recent transactions */}
        <div className="lg:col-span-2">
          <Panel title="Recent transactions" action={{ label: "View all", href: "/admin/transactions" }}>
            {recent.length === 0 ? (
              <p className="rounded-2xl bg-light p-8 text-center text-muted-foreground">
                No payments yet. They will show up here.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((t) => {
                  const badge = paymentBadge[t.paymentStatus];
                  const isPlan = t.type === "subscription";
                  return (
                    <li key={t.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
                          isPlan ? "bg-dark text-cream" : "bg-primary-100 text-primary"
                        }`}
                      >
                        {isPlan ? (
                          <Sparkles className="size-5" aria-hidden="true" />
                        ) : (
                          <CreditCard className="size-5" aria-hidden="true" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{t.vendorName}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {isPlan ? "Subscription" : t.customerName ?? "Order"} · {t.itemName}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-bold tabular-nums">{money(t.amount)}</p>
                        <p className="mt-0.5 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                          {formatDate(t.createdAt)}
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
          {/* User mix */}
          <Panel title="Community" action={{ label: "Users", href: "/admin/users" }}>
            <p className="text-3xl font-sans font-extrabold tracking-tight tabular-nums">{number(stats.users)}</p>
            <p className="text-sm text-muted-foreground">registered users</p>

            {/* Stacked bar */}
            <div
              className="mt-5 flex h-3 overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={userMix.map((m) => `${m.label}: ${m.value}`).join(", ")}
            >
              {userMix.map((m) =>
                m.value > 0 ? (
                  <span
                    key={m.label}
                    className={`${m.color} h-full`}
                    style={{ width: `${percent(m.value, stats.users)}%` }}
                  />
                ) : null,
              )}
            </div>

            <ul className="mt-4 space-y-2.5">
              {userMix.map((m) => (
                <li key={m.label} className="flex items-center gap-3 text-sm">
                  <span aria-hidden="true" className={`size-2.5 rounded-full ${m.color}`} />
                  <span className="flex-1">{m.label}</span>
                  <span className="font-bold">{number(m.value)}</span>
                  <span className="w-10 text-right text-muted-foreground">
                    {percent(m.value, stats.users)}%
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Menu health */}
          <Panel title="Menu health" action={{ label: "Review", href: "/admin/menu-review" }}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-sans font-extrabold tracking-tight tabular-nums">
                  {percent(reviewed, stats.menuItems)}%
                </p>
                <p className="text-sm text-muted-foreground">of items reviewed</p>
              </div>
              <p className="text-right text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{number(reviewed)}</span> reviewed
                <br />
                <span className="font-bold text-foreground">{number(stats.pendingItems)}</span>{" "}
                pending
              </p>
            </div>
            <div
              className="mt-4 h-3 overflow-hidden rounded-full bg-accent/40"
              role="img"
              aria-label={`${reviewed} of ${stats.menuItems} items reviewed`}
            >
              <span
                className="block h-full rounded-full bg-secondary"
                style={{ width: `${percent(reviewed, stats.menuItems)}%` }}
              />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
