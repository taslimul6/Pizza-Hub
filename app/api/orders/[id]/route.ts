import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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
