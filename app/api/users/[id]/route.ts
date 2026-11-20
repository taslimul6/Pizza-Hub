import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// PATCH /api/users/:id  { isBlocked: true | false }
// Admin only. Blocks or unblocks a user through the Express API.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Only admins can do this" }, { status: 403 });
  }

  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }
  if (id === session.user.id) {
    return NextResponse.json({ error: "You cannot block yourself" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.isBlocked !== "boolean") {
    return NextResponse.json({ error: "isBlocked must be true or false" }, { status: 400 });
  }

  try {
    const res = await fetch(new URL(`/users/${id}/block`, process.env.API_URL), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: body.isBlocked }),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "User service is down" }, { status: 502 });
  }
}
