import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readMenuForm, uploadToImgbb } from "@/lib/menu-form";

type Context = { params: Promise<{ id: string }> };

// Checks the login + vendor role and the item id.
// The email always comes from the session, so a vendor can only change their own items.
async function check(context: Context) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: NextResponse.json({ error: "Please sign in first" }, { status: 401 }) };
  }
  if (session.user.role !== "vendor") {
    return { error: NextResponse.json({ error: "Only vendors can do this" }, { status: 403 }) };
  }

  const { id } = await context.params;
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return { error: NextResponse.json({ error: "Invalid item id" }, { status: 400 }) };
  }

  return { id, email: session.user.email };
}

// Send the request to the Express API and pass its answer back
async function forward(url: URL, init: RequestInit) {
  try {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Menu service is down" }, { status: 502 });
  }
}

// PATCH /api/menu/:id  { available: true | false }
export async function PATCH(request: Request, context: Context) {
  const checked = await check(context);
  if ("error" in checked) return checked.error;

  const body = await request.json().catch(() => null);
  if (typeof body?.available !== "boolean") {
    return NextResponse.json({ error: "available must be true or false" }, { status: 400 });
  }

  return forward(new URL(`/menu/${checked.id}`, process.env.API_URL), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: checked.email, available: body.available }),
  });
}

// PUT /api/menu/:id  (multipart form: name, category, description, price, location, image?)
// Updates the item. A new picture is optional. The item goes back to "pending".
export async function PUT(request: Request, context: Context) {
  const checked = await check(context);
  if ("error" in checked) return checked.error;

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const result = await readMenuForm(form, false);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { image, ...values } = result.values;

  // Upload the new picture only when the vendor chose one
  let imageUrl: string | undefined;
  if (image) {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Image upload is not set up (IMGBB_API_KEY)" },
        { status: 500 },
      );
    }
    try {
      imageUrl = await uploadToImgbb(image, apiKey);
    } catch {
      return NextResponse.json(
        { error: "Could not upload the image. Please try again." },
        { status: 502 },
      );
    }
  }

  return forward(new URL(`/menu/${checked.id}`, process.env.API_URL), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...values, image: imageUrl, email: checked.email }),
  });
}

// DELETE /api/menu/:id
export async function DELETE(_request: Request, context: Context) {
  const checked = await check(context);
  if ("error" in checked) return checked.error;

  const url = new URL(`/menu/${checked.id}`, process.env.API_URL);
  url.searchParams.set("email", checked.email);
  return forward(url, { method: "DELETE" });
}
