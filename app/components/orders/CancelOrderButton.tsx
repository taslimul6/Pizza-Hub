"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CancelOrderButtonProps = {
  orderId: string;
  orderName: string; // shown in the confirm popup, e.g. "2 × Classic Margherita"
};

// "Cancel order" button with a confirm popup. Only shown for pending orders.
export default function CancelOrderButton({
  orderId,
  orderName,
}: CancelOrderButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Could not cancel the order");
        return;
      }

      toast.success("Order cancelled");
      setOpen(false);
      // Reload the list so the cancelled order disappears
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        Cancel order
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this order?</DialogTitle>
            <DialogDescription>
              {orderName} will be removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Keep order
            </Button>
            <Button
              variant="default"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling…" : "Yes, cancel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
