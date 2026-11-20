"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getShopName } from "@/lib/shop-info";
import type { Order } from "@/types";

type Action = "accept" | "reject" | "complete";

// How each order status looks
const statusInfo: Record<
  string,
  { label: string; variant: "accent" | "secondary" | "muted" | "destructive" }
> = {
  pending: { label: "Pending", variant: "accent" },
  accepted: { label: "Accepted", variant: "secondary" },
  completed: { label: "Completed", variant: "muted" },
  rejected: { label: "Rejected", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "muted" },
};

const filters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

// "2026-11-24" -> "Nov 24, 2026"
function formatDay(value?: string) {
  if (!value) return "Not provided";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { dateStyle: "medium" });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// The vendor's orders with Accept / Reject (pending) and Complete (accepted).
// Changes are saved through /api/orders/:id and then the list is reloaded.
export default function VendorOrdersList({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  // Order waiting for the "Reject this order?" confirmation
  const [rejecting, setRejecting] = useState<Order | null>(null);

  const statusOf = (order: Order) => order.orderDetails.status;
  const count = (value: string) =>
    value === "all"
      ? orders.length
      : orders.filter((o) => statusOf(o) === value).length;

  const visible =
    filter === "all" ? orders : orders.filter((o) => statusOf(o) === filter);

  async function act(order: Order, action: Action, okMessage: string) {
    setBusyId(order._id);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Could not update the order");
        // The order may have changed already, so show the latest list
        router.refresh();
        return false;
      }

      toast.success(okMessage);
      router.refresh();
      return true;
    } catch {
      toast.error("Network error. Please try again.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function confirmReject() {
    if (!rejecting) return;
    const ok = await act(rejecting, "reject", "Order rejected");
    if (ok) setRejecting(null);
  }

  return (
    <>
      {/* Status filter with counts */}
      <ul className="mb-6 flex flex-wrap gap-2">
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

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-border bg-white p-10 text-center">
          <p className="text-5xl">🧾</p>
          <h2 className="mt-3 font-display text-xl font-bold">No orders here</h2>
          <p className="mt-1 text-muted-foreground">
            {orders.length === 0
              ? "Orders for your items will show up here."
              : "No orders with this status."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {visible.map((order) => {
            const d = order.orderDetails;
            const status = statusInfo[d.status] ?? {
              label: d.status,
              variant: "muted" as const,
            };
            const busy = busyId === order._id;
            return (
              <li
                key={order._id}
                className="rounded-3xl border border-border bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold">
                      {d.quantity} × {d.itemName}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {d.size} · {d.crust} crust · {getShopName(d.shop)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <p className="mt-2 text-2xl font-black text-primary">
                      ${d.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-bold">Customer</dt>
                    <dd className="text-muted-foreground">
                      {order.name}
                      <br />
                      {order.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold">Delivery date</dt>
                    <dd className="text-muted-foreground">
                      {formatDay(d.deliveryDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold">Delivery address</dt>
                    <dd className="text-muted-foreground">
                      {d.deliveryAddress || "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold">Customer message</dt>
                    <dd className="text-muted-foreground">
                      {d.message || "No message"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    Placed {formatDateTime(order.createdAt)} · Order #
                    {order._id.slice(-6)}
                  </p>

                  {/* Only pending orders can be accepted or rejected, and only once.
                      Only accepted orders can be completed. */}
                  {d.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          act(order, "accept", "Order accepted")
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy}
                        onClick={() => setRejecting(order)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {d.status === "accepted" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busy}
                      onClick={() =>
                        act(order, "complete", "Order marked as completed")
                      }
                    >
                      Mark as completed
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Reject confirm popup */}
      <Dialog open={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this order?</DialogTitle>
            <DialogDescription>
              {rejecting?.orderDetails.quantity} × {rejecting?.orderDetails.itemName}{" "}
              for {rejecting?.name}. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Keep order
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={busyId !== null}
            >
              {busyId !== null ? "Rejecting…" : "Yes, reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
