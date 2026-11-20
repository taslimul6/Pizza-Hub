import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import TransactionsList from "@/app/components/admin/TransactionsList";
import SectionHeading from "@/app/components/homepage/SectionHeading";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";
import { getShopName } from "@/lib/shop-info";
import type { AdminTransaction } from "@/types";

export const metadata: Metadata = {
  title: "Transactions | PizzaHub",
};

// A transaction as the API sends it
type ApiTransaction = {
  _id: string;
  vendor: { name: string | null; email: string | null; shop: string | null };
  customer: { name: string; email: string };
  itemName: string;
  amount: number;
  cardLast4: string;
  orderStatus: string;
  paymentStatus: AdminTransaction["paymentStatus"];
  createdAt: string;
};

// Loads every transaction (read only: there is no way to change one)
async function Transactions() {
  // The proxy already keeps non-admins out; this is only a safety net
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return null;

  const raw = await getList<ApiTransaction>("/admin/transactions", { auth: true });

  const transactions: AdminTransaction[] = raw.map((t) => ({
    id: t._id,
    vendorName: t.vendor.name ?? (t.vendor.shop ? getShopName(t.vendor.shop) : "Unknown vendor"),
    vendorEmail: t.vendor.email,
    vendorShop: t.vendor.shop,
    customerName: t.customer.name,
    customerEmail: t.customer.email,
    itemName: t.itemName,
    amount: t.amount,
    cardLast4: t.cardLast4,
    orderStatus: t.orderStatus,
    paymentStatus: t.paymentStatus,
    createdAt: t.createdAt,
  }));

  return <TransactionsList transactions={transactions} />;
}

// Admin only (the proxy redirects everyone else)
export default function TransactionsPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-[1000px]">
        <SectionHeading
          eyebrow="Admin"
          title="Transactions"
          subtitle="Every payment made on PizzaHub. Payment records are read only."
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
      </div>
    </main>
  );
}
