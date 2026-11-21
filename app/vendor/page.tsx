import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PlusCircle, ShoppingBag } from "lucide-react";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";
import VendorDashboard from "@/app/components/vendor/VendorDashboard";
import { buttonVariants } from "@/components/ui/button";
import { getList, getObject } from "@/lib/api";
import type { ItemStatus, Order, VendorSubscription } from "@/types";

export const metadata: Metadata = {
  title: "Vendor Dashboard | PizzaHub",
};

// Loads the plan, the menu items and the orders (the vendor token is sent along)
async function Dashboard() {
  const [subscription, items, orders] = await Promise.all([
    getObject<VendorSubscription>("/subscription", { auth: true }),
    getList<{ status: ItemStatus }>("/menu/mine", { auth: true }),
    getList<Order>("/orders/vendor", { auth: true }),
  ]);

  if (!subscription) {
    return (
      <p className="rounded-3xl border border-border bg-white p-10 text-center text-muted-foreground">
        Your dashboard could not be loaded right now. Please try again soon.
      </p>
    );
  }

  return (
    <VendorDashboard
      subscription={subscription}
      itemStatuses={items.map((item) => item.status)}
      orders={orders}
    />
  );
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

// Vendor only (the proxy redirects everyone else). The sidebar comes from layout.tsx.
export default function VendorPage() {
  return (
    <>
      <DashboardPageHeader
        eyebrow="Vendor"
        title="Dashboard"
        description="Your kitchen at a glance: orders, menu and plan."
        actions={
          <>
            <Link href="/vendor/orders" className={buttonVariants({ variant: "outline" })}>
              <ShoppingBag className="size-4" aria-hidden="true" />
              Orders
            </Link>
            <Link href="/vendor/addMenu" className={buttonVariants()}>
              <PlusCircle className="size-4" aria-hidden="true" />
              Add menu item
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
