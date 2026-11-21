import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isAPIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { uploadToImgbb } from "@/lib/menu-form";
import { validateImage } from "@/lib/menu-validation";

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

// PATCH /api/profile  (multipart form)
//   name          : 2 to 60 characters
//   businessName  : vendors only, 2 to 80 characters
//   image         : optional new profile photo (uploaded to ImgBB)
//   removeImage   : "true" to remove the current photo
// Only these fields can change. Role, block and plan are never touched here
// (and lib/auth.ts also refuses them on Better Auth's own /update-user).
export async function PATCH(request: Request) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) return bad("Please sign in first", 401);

  const form = await request.formData().catch(() => null);
  if (!form) return bad("Invalid form data");

  const name = String(form.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 60) {
    return bad("Name must be 2 to 60 characters.");
  }

  const changes: { name: string; image?: string | null; businessName?: string } = { name };

  // Restaurant name: vendors only
  if (session.user.role === "vendor") {
    const businessName = String(form.get("businessName") ?? "").trim();
    if (businessName.length < 2 || businessName.length > 80) {
      return bad("Restaurant name must be 2 to 80 characters.");
    }
    changes.businessName = businessName;
  }

  // Profile photo: a new file, or remove the old one
  const entry = form.get("image");
  const file = entry instanceof File && entry.size > 0 ? entry : null;
  if (file) {
    const imageError = validateImage(file, false);
    if (imageError) return bad(imageError);

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) return bad("Image upload is not set up (IMGBB_API_KEY)", 500);
    try {
      changes.image = await uploadToImgbb(file, apiKey);
    } catch {
      return bad("Could not upload the photo. Please try again.", 502);
    }
  } else if (form.get("removeImage") === "true") {
    changes.image = null;
  }

  try {
    await auth.api.updateUser({ headers: requestHeaders, body: changes });
  } catch (err) {
    return bad(isAPIError(err) ? err.message : "Could not save your profile.", 400);
  }

  return NextResponse.json({ message: "Profile updated", image: changes.image });
}
