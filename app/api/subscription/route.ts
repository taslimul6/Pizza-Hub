import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authFetch } from "@/lib/api-auth";
import { auth } from "@/lib/auth";

// POST /api/subscription
// Vendor only. Asks the API for a Stripe Checkout page and returns its url.
// The vendor pays on Stripe's page, so no card details pass through PizzaHub.
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }
  if (session.user.role !== "vendor") {
    return NextResponse.json({ error: "Only vendors can subscribe" }, { status: 403 });
  }

  try {
    const res = await authFetch("/subscription/checkout", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Payment service is down" }, { status: 502 });
  }
}
