import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authFetch } from "@/lib/api-auth";
import { auth } from "@/lib/auth";

// POST /api/subscription/confirm  { sessionId }
// Vendor only. Called when Stripe sends the vendor back. The API checks with
// Stripe that the session is paid and belongs to this vendor before giving Premium.
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }
  if (session.user.role !== "vendor") {
    return NextResponse.json({ error: "Only vendors can subscribe" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const sessionId = body?.sessionId;
  if (typeof sessionId !== "string" || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return NextResponse.json({ error: "Invalid payment session" }, { status: 400 });
  }

  try {
    const res = await authFetch("/subscription/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Payment service is down" }, { status: 502 });
  }
}
