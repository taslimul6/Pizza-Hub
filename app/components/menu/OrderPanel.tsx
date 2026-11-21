"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { FeaturedPizza } from "@/types";
import PaymentDialog from "./PaymentDialog";

const selectStyle =
  "h-12 w-full rounded-full border border-input bg-white px-5 text-base outline-none focus-visible:border-ring";

// Size / crust / quantity choices and the Order button.
// Only logged-in customers can order; guests are sent to sign in.
export default function OrderPanel({ item }: { item: FeaturedPizza }) {
  const { data: session, isPending } = authClient.useSession();
  // A vendor cannot order their own item
  const isOwnItem = !!session && !!item.vendorId && item.vendorId === session.user.id;

  const [size, setSize] = useState(item.sizes[0]?.label ?? "");
  const [crust, setCrust] = useState(item.crust[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  // Is the payment popup open?
  const [payOpen, setPayOpen] = useState(false);

  const unitPrice =
    item.sizes.find((s) => s.label === size)?.price ?? item.price;
  const total = unitPrice * quantity;

  return (
    <div className="rounded-3xl border border-border bg-white p-6">
      <h2 className="font-display text-xl font-bold">Order this item</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {item.sizes.length > 0 && (
          <label className="block text-sm font-bold">
            Size
            <select
              className={`${selectStyle} mt-1 font-normal`}
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {item.sizes.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label} — ${s.price.toFixed(2)}
                </option>
              ))}
            </select>
          </label>
        )}
        {item.crust.length > 0 && (
          <label className="block text-sm font-bold">
            Crust
            <select
              className={`${selectStyle} mt-1 font-normal`}
              value={crust}
              onChange={(e) => setCrust(e.target.value)}
            >
              {item.crust.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Quantity */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-bold">Quantity</span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => setQuantity((q) => q - 1)}
        >
          −
        </Button>
        <span className="w-6 text-center font-bold" aria-live="polite">
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Increase quantity"
          disabled={quantity >= 10}
          onClick={() => setQuantity((q) => q + 1)}
        >
          +
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-2xl font-black text-primary">${total.toFixed(2)}</p>

        {isPending ? (
          <Button disabled>Checking login…</Button>
        ) : isOwnItem ? (
          // A vendor cannot order their own item
          <Button size="lg" disabled>
            This is your item
          </Button>
        ) : session ? (
          <Button size="lg" onClick={() => setPayOpen(true)}>
            Order now
          </Button>
        ) : (
          <Link href="/signin" className={buttonVariants({ size: "lg" })}>
            Sign in to order
          </Link>
        )}
      </div>

      {session && !isOwnItem && (
        <PaymentDialog
          open={payOpen}
          onOpenChange={setPayOpen}
          customerName={session.user.name}
          customerEmail={session.user.email}
          summary={`${quantity} × ${size} ${item.itemName} (${crust})`}
          total={total}
          itemId={item._id}
          size={size}
          crust={crust}
          quantity={quantity}
        />
      )}

      {isOwnItem && (
        <p className="mt-3 text-sm text-muted-foreground">
          You sell this item, so you cannot order it yourself.
        </p>
      )}

      {!isPending && !session && (
        <p className="mt-3 text-sm text-muted-foreground">
          You need to be logged in to place an order.
        </p>
      )}
    </div>
  );
}
