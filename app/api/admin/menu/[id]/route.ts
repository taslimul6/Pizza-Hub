import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };

// Only a logged-in admin may use these routes
async function check(context: Context) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: NextResponse.json({ error: "Please sign in first" }, { status: 401 }) };
  }
  if (session.user.role !== "admin") {
    return { error: NextResponse.json({ error: "Only admins can do this" }, { status: 403 }) };
  }

  const { id } = await context.params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return { error: NextResponse.json({ error: "Invalid item id" }, { status: 400 }) };
  }
  return { id };
}

// Send the request to the Express API and pass its answer back
async function forward(path: string, init: RequestInit) {
  try {
    const res = await fetch(new URL(path, process.env.API_URL), init);
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Menu service is down" }, { status: 502 });
  }
}

// PATCH /api/admin/menu/:id  { status: "publish" | "pending" | "rejected" }
export async function PATCH(request: Request, context: Context) {
  const checked = await check(context);
  if ("error" in checked) return checked.error;

  const body = await request.json().catch(() => null);
  if (!["publish", "pending", "rejected"].includes(body?.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  return forward(`/admin/menu/${checked.id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: body.status }),
  });
}

// DELETE /api/admin/menu/:id
export async function DELETE(_request: Request, context: Context) {
  const checked = await check(context);
  if ("error" in checked) return checked.error;

  return forward(`/admin/menu/${checked.id}`, { method: "DELETE" });
}
