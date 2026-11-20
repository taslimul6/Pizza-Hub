import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authFetch } from "@/lib/api-auth";
import { auth } from "@/lib/auth";
import { readMenuForm, uploadToImgbb } from "@/lib/menu-form";

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

  const result = await readMenuForm(form, true);
  if ("error" in result) return bad(result.error);
  const { image, ...values } = result.values;

  // Upload the image file to ImgBB
  let imageUrl: string;
  try {
    imageUrl = await uploadToImgbb(image as File, apiKey);
  } catch {
    return bad("Could not upload the image. Please try again.", 502);
  }

  // Save the item (status "pending" is set by the API)
  let res: Response;
  try {
    // The API knows the vendor from the token
    res = await authFetch("/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemName: values.name,
        category: values.category,
        description: values.description,
        price: values.price,
        location: values.location,
        image: imageUrl,
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
