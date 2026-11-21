import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Pizza, ShoppingBag } from "lucide-react";
import CustomerDashboard from "@/app/components/customer/CustomerDashboard";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";
import { buttonVariants } from "@/components/ui/button";
import { getList } from "@/lib/api";
import type { FeaturedPizza, Order } from "@/types";

export const metadata: Metadata = {
  title: "My Dashboard | PizzaHub",
};

// Loads the customer's orders (token sent along) and a few featured items
async function Dashboard() {
  const [orders, picks] = await Promise.all([
    getList<Order>("/orders/customer", { auth: true }),
    getList<FeaturedPizza>("/featured"),
  ]);
  return <CustomerDashboard orders={orders} picks={picks} />;
}

// Loading state that matches the dashboard layout
function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard" className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-96 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
      </div>
    </div>
  );
}

// Customer only (the proxy redirects everyone else). The sidebar comes from layout.tsx.
export default function CustomerPage() {
  return (
    <>
      <DashboardPageHeader
        eyebrow="Customer"
        title="Dashboard"
        description="Your orders, deliveries and a few tasty ideas."
        actions={
          <>
            <Link href="/customer/myorder" className={buttonVariants({ variant: "outline" })}>
              <ShoppingBag className="size-4" aria-hidden="true" />
              My orders
            </Link>
            <Link href="/menu" className={buttonVariants()}>
              <Pizza className="size-4" aria-hidden="true" />
              Order food
            </Link>
          </>
        }
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </>
  );
}
