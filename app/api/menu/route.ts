import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

// POST /api/menu  (multipart form: name, category, description, price, location, image)
// 1. only a logged-in vendor may add items,
// 2. every field is checked again here (the browser checks are only for comfort),
// 3. the image file is uploaded to ImgBB (the API key stays on the server),
// 4. the item is saved by the Express API with status "pending".
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return bad("Please sign in first", 401);
  if (session.user.role !== "vendor") {
    return bad("Only vendors can add menu items", 403);
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) return bad("Image upload is not set up (IMGBB_API_KEY)", 500);

  const form = await request.formData().catch(() => null);
  if (!form) return bad("Invalid form data");

  const name = String(form.get("name") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const location = String(form.get("location") ?? "").trim();
  const price = Number(form.get("price"));
  const image = form.get("image");

  // Validate
  if (name.length < 2 || name.length > 60) {
    return bad("Item name must be 2 to 60 characters");
  }
  if (description.length < 10 || description.length > 500) {
    return bad("Description must be 10 to 500 characters");
  }
  if (location.length < 2 || location.length > 60) {
    return bad("Location must be 2 to 60 characters");
  }
  if (!Number.isFinite(price) || price <= 0 || price > 1000) {
    return bad("Price must be more than 0 and at most 1000");
  }

  const categories = await getList<string>("/category");
  if (!categories.includes(category)) return bad("Please choose a valid category");

  if (!(image instanceof File) || image.size === 0) {
    return bad("Item image is required");
  }
  if (!IMAGE_TYPES.includes(image.type)) {
    return bad("Image must be a JPG, PNG, WEBP or GIF file");
  }
  if (image.size > MAX_IMAGE_SIZE) return bad("Image must be 5 MB or smaller");

  // Upload the image file to ImgBB
  let imageUrl: string;
  try {
    const upload = new FormData();
    upload.set("image", image);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: upload },
    );
    const data = await res.json();
    if (!res.ok || !data?.data?.url) throw new Error("upload failed");
    imageUrl = data.data.url;
  } catch {
    return bad("Could not upload the image. Please try again.", 502);
  }

  // Save the item (status "pending" is set by the API)
  let res: Response;
  try {
    res = await fetch(new URL("/menu", process.env.API_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        description,
        price,
        location,
        image: imageUrl,
        vendor: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        },
      }),
    });
  } catch {
    return bad("Menu service is down", 502);
  }

  if (!res.ok) return bad("Could not save the menu item", 502);

  const saved = await res.json();
  return NextResponse.json(
    { itemId: saved.itemId, status: "pending" },
    { status: 201 },
  );
}
