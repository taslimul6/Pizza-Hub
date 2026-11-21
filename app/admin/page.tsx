import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ClipboardCheck, ReceiptText } from "lucide-react";
import AdminDashboard from "@/app/components/admin/AdminDashboard";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { buttonVariants } from "@/components/ui/button";
import { getAdminTransactions } from "@/lib/admin-data";
import { getObject } from "@/lib/api";
import type { AdminStats } from "@/types";

export const metadata: Metadata = {
  title: "Admin Dashboard | PizzaHub",
};

// Loads the numbers and the latest transactions (admin token is sent along)
async function Dashboard() {
  const [stats, transactions] = await Promise.all([
    getObject<AdminStats>("/stats", { auth: true }),
    getAdminTransactions(),
  ]);

  if (!stats) {
    return (
      <p className="rounded-3xl border border-border bg-white p-10 text-center text-muted-foreground">
        The numbers could not be loaded right now. Please try again soon.
      </p>
    );
  }

  return <AdminDashboard stats={stats} transactions={transactions} />;
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

// Admin only (the proxy redirects everyone else). The sidebar comes from layout.tsx.
export default function AdminPage() {
  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="How PizzaHub is doing today: people, menu and money."
        actions={
          <>
            <Link href="/admin/transactions" className={buttonVariants({ variant: "outline" })}>
              <ReceiptText className="size-4" aria-hidden="true" />
              Transactions
            </Link>
            <Link href="/admin/menu-review" className={buttonVariants()}>
              <ClipboardCheck className="size-4" aria-hidden="true" />
              Review items
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
