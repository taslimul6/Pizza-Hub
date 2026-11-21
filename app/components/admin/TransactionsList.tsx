"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { AdminTransaction } from "@/types";

type PaymentStatus = AdminTransaction["paymentStatus"];

// How each payment status looks
const statusInfo: Record<
  PaymentStatus,
  { label: string; variant: "secondary" | "accent" | "muted" }
> = {
  paid: { label: "Paid", variant: "secondary" },
  pending: { label: "Pending", variant: "accent" },
  refunded: { label: "Refunded", variant: "muted" },
};

const filters: { value: "all" | PaymentStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "refunded", label: "Refunded" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const money = (value: number) => `$${value.toFixed(2)}`;

// The transactions table. It is read only on purpose: there are no buttons or
// forms here, and no API that changes a payment. The payment status is worked
// out by the server from the order status.
export default function TransactionsList({
  transactions,
}: {
  transactions: AdminTransaction[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");

  const count = (value: "all" | PaymentStatus) =>
    value === "all"
      ? transactions.length
      : transactions.filter((t) => t.paymentStatus === value).length;

  const text = search.trim().toLowerCase();
  const visible = transactions.filter(
    (t) =>
      (filter === "all" || t.paymentStatus === filter) &&
      [t.vendorName, t.vendorEmail, t.customerName, t.customerEmail, t.itemName, t.plan].some(
        (field) => (field ?? "").toLowerCase().includes(text),
      ),
  );

  // Money that has been paid (refunded and pending payments are not counted)
  const totalPaid = transactions
    .filter((t) => t.paymentStatus === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      {/* Summary */}
      <ul className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Transactions", value: String(transactions.length) },
          { label: "Total paid", value: money(totalPaid) },
          { label: "Pending", value: String(count("pending")) },
          { label: "Refunded", value: String(count("refunded")) },
        ].map((stat) => (
          <li
            key={stat.label}
            className="rounded-3xl border border-border bg-white p-5 text-center"
          >
            <p className="font-display text-2xl font-black text-primary">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </li>
        ))}
      </ul>

      {/* Status filter */}
      <ul className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <li key={f.value}>
            <button
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors ${
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-accent bg-accent/25 text-foreground hover:bg-accent/50"
              }`}
            >
              {f.label} ({count(f.value)})
            </button>
          </li>
        ))}
      </ul>

      <Input
        type="search"
        placeholder="Search by vendor, customer or item…"
        aria-label="Search transactions"
        className="mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-border bg-white p-10 text-center">
          <p className="text-5xl">💳</p>
          <h2 className="mt-3 font-display text-xl font-bold">No transactions found</h2>
          <p className="mt-1 text-muted-foreground">
            {transactions.length === 0
              ? "Payments will show up here when customers place orders."
              : "Try a different search or filter."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {visible.map((t) => {
            const status = statusInfo[t.paymentStatus];
            return (
              <li
                key={t.id}
                className="rounded-3xl border border-border bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-bold">{t.vendorName}</h2>
                      <Badge variant={t.type === "subscription" ? "dark" : "muted"}>
                        {t.type === "subscription" ? "Subscription" : "Order"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.vendorEmail ?? "No vendor email on record"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-black text-primary">
                      {money(t.amount)}
                    </p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="font-bold">{formatDate(t.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      {t.type === "subscription" ? "Subscription plan" : "Order"}
                    </dt>
                    <dd className="font-bold">
                      {t.itemName}{" "}
                      {t.orderStatus && (
                        <span className="font-normal capitalize">({t.orderStatus})</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Paid by</dt>
                    <dd className="font-bold">
                      {t.customerName ?? t.vendorName}
                      <span className="block font-normal text-muted-foreground">
                        card ending {t.cardLast4}
                      </span>
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-xs text-muted-foreground">
                  Transaction #{t.id.slice(-6)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
