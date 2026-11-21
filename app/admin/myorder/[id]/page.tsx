import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";
import MyOrderDetails from "@/app/components/orders/MyOrderDetails";

export const metadata: Metadata = {
  title: "Order Details | PizzaHub",
};

// Admin only (the proxy redirects everyone else)
export default function AdminOrderDetailsPage({ params }: PageProps<"/admin/myorder/[id]">) {
  return (
    <>
      <Link
        href="/admin/myorder"
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        My orders
      </Link>
      <DashboardPageHeader
        eyebrow="Admin"
        title="Order details"
        description="Everything about this order and where it is right now."
      />
      <Suspense
        fallback={
          <div role="status" aria-label="Loading order" className="grid gap-6 lg:grid-cols-3">
            <div className="h-96 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
            <div className="h-96 animate-pulse rounded-3xl bg-muted" />
          </div>
        }
      >
        <MyOrderDetails params={params} basePath="/admin/myorder" />
      </Suspense>
    </>
  );
}
