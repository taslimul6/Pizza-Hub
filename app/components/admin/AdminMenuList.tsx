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
import { Input } from "@/components/ui/input";
import { formatSlug } from "@/lib/format-slug";
import type { AdminMenuItem } from "@/types";

type Status = AdminMenuItem["status"];

// How each status looks
const statusInfo: Record<
  Status,
  { label: string; variant: "secondary" | "accent" | "destructive"; note: string }
> = {
  approved: { label: "Approved", variant: "secondary", note: "Shown on the public menu" },
  inactive: { label: "Inactive", variant: "accent", note: "Switched off, hidden from customers" },
  pending: { label: "Pending", variant: "accent", note: "Waiting for review, hidden from customers" },
  rejected: { label: "Rejected", variant: "destructive", note: "Hidden from customers" },
};

const statusFilters: { value: "all" | Status; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "inactive", label: "Inactive" },
  { value: "rejected", label: "Rejected" },
];

const selectStyle =
  "h-12 w-full rounded-full border border-input bg-white px-5 text-base outline-none focus-visible:border-ring";

// Picture of the item: the uploaded photo, or the emoji if there is none
function ItemPicture({
  item,
  className,
}: {
  item: AdminMenuItem;
  className: string;
}) {
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-accent/30 ${className}`}
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt={item.name} className="size-full object-cover" />
      ) : (
        item.emoji
      )}
    </div>
  );
}

// All submitted menu items with search and filters. The admin can approve,
// reject, unpublish and delete. Changes are saved through /api/admin/menu/:id
// and then the list is reloaded.
export default function AdminMenuList({ items }: { items: AdminMenuItem[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [category, setCategory] = useState("all");
  const [viewing, setViewing] = useState<AdminMenuItem | null>(null);
  const [deleting, setDeleting] = useState<AdminMenuItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const categories = [...new Set(items.map((i) => i.category))].sort();
  const count = (value: "all" | Status) =>
    value === "all" ? items.length : items.filter((i) => i.status === value).length;

  const text = search.trim().toLowerCase();
  const visible = items.filter(
    (item) =>
      (statusFilter === "all" || item.status === statusFilter) &&
      (category === "all" || item.category === category) &&
      [item.name, item.vendorName, item.vendorEmail ?? "", item.shop].some((field) =>
        field.toLowerCase().includes(text),
      ),
  );

  // Send a change to the API, then reload the list
  async function send(item: AdminMenuItem, init: RequestInit, okMessage: string) {
    setBusyId(item.id);
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, init);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return false;
      }
      toast.success(okMessage, { description: item.name });
      router.refresh();
      return true;
    } catch {
      toast.error("Network error. Please try again.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  function setStatus(item: AdminMenuItem, status: Status, okMessage: string) {
    return send(
      item,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
      okMessage,
    );
  }

  async function confirmDelete() {
    if (!deleting) return;
    const ok = await send(deleting, { method: "DELETE" }, "Item deleted");
    if (ok) setDeleting(null);
  }

  return (
    <>
      {/* Status filter with counts */}
      <ul className="mb-4 flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <li key={f.value}>
            <button
              type="button"
              aria-pressed={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors ${
                statusFilter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-accent bg-accent/25 text-foreground hover:bg-accent/50"
              }`}
            >
              {f.label} ({count(f.value)})
            </button>
          </li>
        ))}
      </ul>

      {/* Search + category filter */}
      <div className="mb-6 grid gap-3 sm:grid-cols-[2fr_1fr]">
        <Input
          type="search"
          placeholder="Search by item, vendor or shop…"
          aria-label="Search items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Filter by category"
          className={selectStyle}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {formatSlug(c)}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {visible.length} of {items.length} {items.length === 1 ? "item" : "items"}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-border bg-white p-10 text-center">
          <p className="text-5xl">🍕</p>
          <h2 className="mt-3 font-display text-xl font-bold">No items found</h2>
          <p className="mt-1 text-muted-foreground">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {visible.map((item) => {
            const status = statusInfo[item.status];
            const busy = busyId === item.id;
            return (
              <li
                key={item.id}
                className="rounded-3xl border border-border bg-white p-5"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <ItemPicture item={item} className="size-20 text-4xl" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-bold">{item.name}</h2>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatSlug(item.category)} · 📍 {item.location}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      🏪 {item.vendorName}
                      {item.vendorEmail ? ` · ${item.vendorEmail}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{status.note}</p>
                  </div>

                  <p className="text-xl font-black text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
                  <Button variant="outline" size="sm" onClick={() => setViewing(item)}>
                    View details
                  </Button>

                  {/* Review actions depend on the current status */}
                  {item.status !== "approved" && (
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => setStatus(item, "approved", "Item approved")}
                    >
                      Approve
                    </Button>
                  )}
                  {item.status === "approved" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busy}
                      onClick={() => setStatus(item, "pending", "Moved to pending")}
                    >
                      Unpublish
                    </Button>
                  )}
                  {item.status !== "rejected" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={busy}
                      onClick={() => setStatus(item, "rejected", "Item rejected")}
                    >
                      Reject
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => setDeleting(item)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Details popup */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.name}</DialogTitle>
                <DialogDescription>{formatSlug(viewing.category)}</DialogDescription>
              </DialogHeader>
              <ItemPicture item={viewing} className="mt-4 size-28 text-6xl" />
              <p className="mt-4">{viewing.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Price</dt>
                  <dd className="font-bold">${viewing.price.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="font-bold">{viewing.location}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-bold">{statusInfo[viewing.status].label}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd className="font-bold">
                    {statusInfo[viewing.status].label}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Vendor</dt>
                  <dd className="font-bold">
                    {viewing.vendorName}
                    {viewing.vendorEmail ? ` · ${viewing.vendorEmail}` : ""}
                  </dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm popup */}
      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>
              {deleting?.name} will be removed for good. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Keep item
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={busyId !== null}
            >
              {busyId !== null ? "Deleting…" : "Yes, delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
