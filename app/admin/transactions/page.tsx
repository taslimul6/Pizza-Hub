import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import TransactionsList from "@/app/components/admin/TransactionsList";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { getAdminTransactions } from "@/lib/admin-data";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Transactions | PizzaHub",
};

// Loads every transaction (read only: there is no way to change one)
async function Transactions() {
  // The proxy already keeps non-admins out; this is only a safety net
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return null;

  const transactions = await getAdminTransactions();

  return <TransactionsList transactions={transactions} />;
}

// Admin only (the proxy redirects everyone else)
export default function TransactionsPage() {
  return (
    <>
      <AdminPageHeader
        title="Transactions"
        description="Every payment made on PizzaHub. Payment records are read only."
      />
        <Suspense
          fallback={
            <div role="status" aria-label="Loading transactions" className="grid gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted" />
              ))}
            </div>
          }
        >
          <Transactions />
        </Suspense>
    </>
  );
}
