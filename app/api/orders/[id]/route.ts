import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authFetch } from "@/lib/api-auth";
import { auth } from "@/lib/auth";

// PATCH /api/orders/:id  { action: "accept" | "reject" | "complete" | "cancel" }
// - accept / reject / complete: vendor only, for orders that belong to that vendor
// - cancel: customer only, for their own pending order (the order stays in the
//   database with the status "cancelled")
// The API reads the user from the token, so nobody can change someone else's order.
export async function PATCH(
  request: Request,
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

  const body = await request.json().catch(() => null);
  const action = body?.action;
  if (!["accept", "reject", "complete", "cancel"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Cancel belongs to the customer, the other actions to the vendor
  const isCancel = action === "cancel";
  const neededRole = isCancel ? "customer" : "vendor";
  if (session.user.role !== neededRole) {
    return NextResponse.json(
      { error: `Only ${neededRole}s can do this` },
      { status: 403 },
    );
  }

  const path = isCancel ? `/orders/${id}/cancel` : `/orders/${id}/status`;
  // The API knows who is asking from the token
  const payload = isCancel ? {} : { action };

  try {
    const res = await authFetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Order service is down" }, { status: 502 });
  }
}
