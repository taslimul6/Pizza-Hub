import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { FeaturedPizza } from "@/types";

// POST /api/orders
// The browser sends only the customer's choice. Here on the server we:
// 1. check the login session (name and email come from the session),
// 2. look up the item and work out the price ourselves,
// 3. save the order through the Express API (POST /orders).
// Card details are never sent to the API: only the last 4 digits are kept.
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { itemId, size, crust, quantity, cardLast4, deliveryDate } = body ?? {};
  const deliveryAddress = String(body?.deliveryAddress ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (
    typeof itemId !== "string" ||
    typeof size !== "string" ||
    typeof crust !== "string" ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 10 ||
    !/^\d{4}$/.test(cardLast4)
  ) {
    return NextResponse.json({ error: "Invalid order details" }, { status: 400 });
  }

  // Delivery details: a date that is not in the past, an address, an optional message
  // (one day of slack so time zones cannot reject a valid "today")
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  if (
    typeof deliveryDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate) ||
    deliveryDate < yesterday
  ) {
    return NextResponse.json({ error: "Choose a valid delivery date" }, { status: 400 });
  }
  if (deliveryAddress.length < 5 || deliveryAddress.length > 200) {
    return NextResponse.json(
      { error: "Delivery address must be 5 to 200 characters" },
      { status: 400 },
    );
  }
  if (message.length > 300) {
    return NextResponse.json(
      { error: "Message must be 300 characters or less" },
      { status: 400 },
    );
  }

  // Find the item and its price (never trust a price from the browser)
  const items = await getList<FeaturedPizza>("/");
  const item = items.find((i) => i._id === itemId);
  const chosenSize = item?.sizes.find((s) => s.label === size);

  if (!item || !chosenSize || !item.crust.includes(crust)) {
    return NextResponse.json({ error: "Item is not available" }, { status: 400 });
  }

  const total = Math.round(chosenSize.price * quantity * 100) / 100;

  // Save the order in the Express API
  let res: Response;
  try {
    res = await fetch(new URL("/orders", process.env.API_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: session.user.name,
        customerId: session.user.id,
        email: session.user.email,
        orderDetails: {
          itemId: item._id,
          itemName: item.itemName,
          shop: item.shop,
          size,
          crust,
          quantity,
          unitPrice: chosenSize.price,
          total,
          cardLast4,
          deliveryDate,
          deliveryAddress,
          message,
          status: "pending",
        },
      }),
    });
  } catch {
    return NextResponse.json({ error: "Order service is down" }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Could not save the order" }, { status: 502 });
  }

  const saved = await res.json();
  return NextResponse.json({ orderId: saved.orderId, total }, { status: 201 });
}
