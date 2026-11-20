"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Taken from the login session
  customerName: string;
  customerEmail: string;
  // Order summary
  summary: string;
  total: number;
  // What the customer chose (sent to the server)
  itemId: string;
  size: string;
  crust: string;
  quantity: number;
};

// "1234123412341234" -> "1234 1234 1234 1234"
function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

// "1228" -> "12/28"
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

// Payment popup that opens when the customer clicks "Order now".
// This is the design only: no payment is taken and no card data is stored.
export default function PaymentDialog({
  open,
  onOpenChange,
  customerName,
  customerEmail,
  summary,
  total,
  itemId,
  size,
  crust,
  quantity,
}: PaymentDialogProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paying, setPaying] = useState(false);

  async function handlePay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaying(true);

    try {
      // Only the last 4 card digits are sent; the rest of the card is never saved
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          size,
          crust,
          quantity,
          cardLast4: cardNumber.replace(/D/g, "").slice(-4),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Could not place the order");
        return;
      }

      toast.success("Order placed!", { description: summary });
      // Clear the card form and close the popup
      setCardNumber("");
      setCardName("");
      setExpiry("");
      setCvc("");
      onOpenChange(false);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment details</DialogTitle>
          <DialogDescription>{summary}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePay} className="mt-5 space-y-4">
          {/* Filled from the session, cannot be edited */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pay-name">Name</Label>
              <Input
                id="pay-name"
                value={customerName}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pay-email">Email</Label>
              <Input
                id="pay-email"
                type="email"
                value={customerEmail}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pay-card">Card number</Label>
            <Input
              id="pay-card"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              required
              minLength={19}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pay-card-name">Name on card</Label>
            <Input
              id="pay-card-name"
              autoComplete="cc-name"
              placeholder="As shown on your card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pay-expiry">Expiry</Label>
              <Input
                id="pay-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                required
                minLength={5}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pay-cvc">CVC</Label>
              <Input
                id="pay-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={cvc}
                onChange={(e) =>
                  setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                required
                minLength={3}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={paying}>
            {paying ? "Placing order…" : `Pay $${total.toFixed(2)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            🔒 Demo: no real payment is taken. Only the last 4 digits are saved with your order.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
