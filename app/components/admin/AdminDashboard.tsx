import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  CreditCard,
  ReceiptText,
  Sparkles,
  UtensilsCrossed,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { AdminStats, AdminTransaction } from "@/types";

const number = (value: number) => value.toLocaleString("en-US");
const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });
const percent = (part: number, whole: number) =>
  whole === 0 ? 0 : Math.round((part / whole) * 100);

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const paymentBadge: Record<
  AdminTransaction["paymentStatus"],
  { label: string; variant: "secondary" | "accent" | "muted" }
> = {
  paid: { label: "Paid", variant: "secondary" },
  pending: { label: "Pending", variant: "accent" },
  refunded: { label: "Refunded", variant: "muted" },
};

// ---- Small building blocks ----

type Kpi = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  tint: string; // icon chip colors
  href: string;
};

function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.icon;
  return (
    <Link
      href={kpi.href}
      className="group flex h-full flex-col rounded-3xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-warm-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-muted-foreground">{kpi.label}</p>
        <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${kpi.tint}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-sans font-extrabold tracking-tight tabular-nums">{kpi.value}</p>
      <p className="mt-auto flex items-center justify-between gap-2 pt-4 text-sm text-muted-foreground">
        <span className="truncate">{kpi.sub}</span>
        <ArrowRight
          className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </p>
    </Link>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:underline"
          >
            {action.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

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
        <div className="relative overflow-hidden rounded-3xl bg-dark p-6 text-light sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-primary/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-1/3 size-56 rounded-full bg-accent/25 blur-3xl"
          />
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <ClipboardCheck className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-2xl font-black">
                  {number(stats.pendingItems)} menu{" "}
                  {stats.pendingItems === 1 ? "item is" : "items are"} waiting for review
                </p>
                <p className="mt-1 text-light/70">
                  Customers only see items after you approve them.
                </p>
              </div>
            </div>
            <Link
              href="/admin/menu-review"
              className={buttonVariants({ variant: "accent", size: "lg" })}
            >
              Review now
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
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
                          isPlan ? "bg-dark text-light" : "bg-primary-100 text-primary"
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
