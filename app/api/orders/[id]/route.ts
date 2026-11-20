import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// PATCH /api/orders/:id  { action: "accept" | "reject" | "complete" }
// Vendor only. The vendor email comes from the session, and the API only
// changes orders that belong to that vendor.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }
  if (session.user.role !== "vendor") {
    return NextResponse.json({ error: "Only vendors can do this" }, { status: 403 });
  }

  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!["accept", "reject", "complete"].includes(body?.action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const res = await fetch(new URL(`/orders/${id}/status`, process.env.API_URL), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, action: body.action }),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Order service is down" }, { status: 502 });
  }
}

// DELETE /api/orders/:id
// Cancels one pending order of the logged-in customer.
// The email comes from the session, so nobody can cancel someone else's order.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const url = new URL(`/orders/${id}`, process.env.API_URL);
  url.searchParams.set("email", session.user.email);

  let res: Response;
  try {
    res = await fetch(url, { method: "DELETE" });
  } catch {
    return NextResponse.json({ error: "Order service is down" }, { status: 502 });
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
