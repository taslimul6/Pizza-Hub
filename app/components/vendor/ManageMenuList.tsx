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
import { formatSlug } from "@/lib/format-slug";
import EditMenuItemDialog from "./EditMenuItemDialog";
import type { ItemStatus, VendorMenuItem } from "@/types";

// How each status looks
const statusInfo: Record<
  ItemStatus,
  { label: string; variant: "secondary" | "accent" | "destructive"; note: string }
> = {
  publish: { label: "Published", variant: "secondary", note: "Visible to customers" },
  pending: { label: "Pending", variant: "accent", note: "Waiting for admin approval, hidden from customers" },
  rejected: { label: "Rejected", variant: "destructive", note: "Rejected by admin, never shown to customers" },
};

// Picture of the item: the uploaded photo, or the emoji if there is none
function ItemPicture({
  item,
  className,
}: {
  item: VendorMenuItem;
  className: string;
}) {
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-accent/30 ${className}`}
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.name}
          className="size-full object-cover"
        />
      ) : (
        item.emoji
      )}
    </div>
  );
}

// The vendor's items: status, availability switch, view / update / delete.
// The items come from the server page; changes are saved through /api/menu/:id
// and then the page is reloaded to show the new data.
export default function ManageMenuList({
  items,
  categories,
}: {
  items: VendorMenuItem[];
  categories: string[];
}) {
  const router = useRouter();
  // Item shown in the details / update / delete popups
  const [viewing, setViewing] = useState<VendorMenuItem | null>(null);
  const [editing, setEditing] = useState<VendorMenuItem | null>(null);
  const [deleting, setDeleting] = useState<VendorMenuItem | null>(null);
  const [busy, setBusy] = useState(false);

  const counts = {
    all: items.length,
    publish: items.filter((i) => i.status === "publish").length,
    pending: items.filter((i) => i.status === "pending").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  // Send a change to the API, then reload the list
  async function send(id: string, init: RequestInit, okMessage: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/menu/${id}`, init);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return false;
      }
      toast.success(okMessage);
      router.refresh();
      return true;
    } catch {
      toast.error("Network error. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function toggleAvailable(item: VendorMenuItem) {
    send(
      item.id,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !item.available }),
      },
      item.available ? "Marked unavailable" : "Marked available",
    );
  }

  async function confirmDelete() {
    if (!deleting) return;
    const ok = await send(deleting.id, { method: "DELETE" }, "Item deleted");
    if (ok) setDeleting(null);
  }

  return (
    <>
      {/* Summary numbers */}
      <ul className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "All items", value: counts.all },
          { label: "Published", value: counts.publish },
          { label: "Pending", value: counts.pending },
          { label: "Rejected", value: counts.rejected },
        ].map((stat) => (
          <li
            key={stat.label}
            className="rounded-3xl border border-border bg-white p-5 text-center"
          >
            <p className="font-display text-3xl font-black text-primary">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-white p-10 text-center">
          <p className="text-5xl">🍕</p>
          <h2 className="mt-3 font-display text-xl font-bold">No items yet</h2>
          <p className="mt-1 text-muted-foreground">
            Add your first menu item to start selling.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {items.map((item) => {
            const status = statusInfo[item.status];
            // Only published items can be switched on for customers
            const canToggle = item.status === "publish";
            return (
              <li
                key={item.id}
                className="rounded-3xl border border-border bg-white p-5"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <ItemPicture item={item} className="size-20 text-4xl" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-bold">
                        {item.name}
                      </h2>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatSlug(item.category)} · 📍 {item.location}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {status.note}
                    </p>
                  </div>

                  <p className="text-xl font-black text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  {/* Availability switch */}
                  <label
                    className={`flex items-center gap-3 text-sm font-bold ${
                      canToggle ? "" : "opacity-50"
                    }`}
                  >
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.available}
                      disabled={!canToggle || busy}
                      onClick={() => toggleAvailable(item)}
                      className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed ${
                        item.available ? "bg-secondary" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition-all ${
                          item.available ? "left-[1.4rem]" : "left-0.5"
                        }`}
                      />
                      <span className="sr-only">Available</span>
                    </button>
                    {item.available ? "Available" : "Unavailable"}
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewing(item)}
                    >
                      View details
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditing(item)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleting(item)}
                    >
                      Delete
                    </Button>
                  </div>
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
                <DialogDescription>
                  {formatSlug(viewing.category)}
                </DialogDescription>
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
                    {viewing.available ? "Available" : "Unavailable"}
                  </dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Update popup */}
      <EditMenuItemDialog
        item={editing}
        categories={categories}
        onClose={() => setEditing(null)}
      />

      {/* Delete confirm popup */}
      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>
              {deleting?.name} will be removed from your menu. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Keep item
            </Button>
            <Button onClick={confirmDelete} disabled={busy}>
              {busy ? "Deleting…" : "Yes, delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
