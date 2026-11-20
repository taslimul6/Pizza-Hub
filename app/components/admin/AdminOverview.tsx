import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { AdminStat, AdminStats } from "@/types";

// Turns the numbers from the API into the six cards
function buildCards(data: AdminStats): AdminStat[] {
  const n = (value: number) => value.toLocaleString("en-US");
  return [
  {
    label: "Registered users",
    value: n(data.users),
    icon: "👥",
    hint: "Everyone who has signed up",
    color: "bg-primary/15",
    href: "/admin/users",
  },
  {
    label: "Vendors",
    value: n(data.vendors),
    icon: "🏪",
    hint: "Shops selling on PizzaHub",
    color: "bg-secondary/15",
    href: "/admin/users",
  },
  {
    label: "Customers",
    value: n(data.customers),
    icon: "🍕",
    hint: "People ordering pizza",
    color: "bg-accent/40",
    href: "/admin/users",
  },
  {
    label: "Menu items",
    value: n(data.menuItems),
    icon: "📋",
    hint: "All statuses",
    color: "bg-secondary/15",
    href: "/admin/menu-review",
  },
  {
    label: "Pending menu items",
    value: n(data.pendingItems),
    icon: "⏳",
    hint: "Waiting for your approval",
    color: "bg-accent/40",
    href: "/admin/menu-review",
  },
  {
    label: "Transactions",
    value: n(data.transactions),
    icon: "💳",
    hint: "Orders placed so far",
    color: "bg-primary/15",
    href: "/admin/transactions",
  },
  ];
}

// The six overview cards at the top of the admin dashboard
export default function AdminOverview({ data }: { data: AdminStats }) {
  const stats = buildCards(data);
  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="sr-only">
        Overview
      </h2>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const card = (
            <Card className="h-full gap-0 rounded-3xl border border-border bg-white p-6 text-base ring-0 transition-shadow hover:shadow-warm-md">
              <div className="flex items-center gap-4">
                <div
                  className={`grid size-14 shrink-0 place-items-center rounded-2xl text-2xl ${stat.color}`}
                >
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="font-display text-3xl font-black">
                    {stat.value}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{stat.hint}</p>
            </Card>
          );

          return (
            <li key={stat.label}>
              {stat.href ? (
                <Link
                  href={stat.href}
                  className="block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {card}
                </Link>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
