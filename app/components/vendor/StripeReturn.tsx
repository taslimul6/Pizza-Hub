"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Runs when Stripe sends the vendor back to /vendor/subscription:
//   ?session_id=cs_...  -> ask the server to confirm the payment
//   ?cancelled=1        -> the vendor left the Stripe page without paying
// Then it removes the query from the address and reloads the plan.
export default function StripeReturn() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const cancelled = params.get("cancelled");
  // Only once, even if React runs the effect twice in development
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current || (!sessionId && !cancelled)) return;
    handled.current = true;

    async function confirm() {
      if (cancelled) {
        toast.info("Payment cancelled. You were not charged.");
      } else {
        const id = toast.loading("Confirming your payment…");
        try {
          const res = await fetch("/api/subscription/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            toast.success("Welcome to Premium!", {
              id,
              description: data.expiresAt
                ? `Active until ${new Date(data.expiresAt).toLocaleDateString("en-US", { dateStyle: "medium" })}`
                : undefined,
            });
          } else {
            toast.error(data.error ?? "Could not confirm the payment", { id });
          }
        } catch {
          toast.error("Network error while confirming the payment.", { id });
        }
      }
      router.replace("/vendor/subscription");
      router.refresh();
    }

    confirm();
  }, [sessionId, cancelled, router]);

  return null;
}
