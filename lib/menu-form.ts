import { getList } from "@/lib/api";
import { validateImage, validateMenuFields } from "@/lib/menu-validation";

// Server helpers for the menu routes (add and update).

export type MenuValues = {
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image: File | null; // a new picture, if the vendor chose one
};

// Reads and checks the submitted form.
// Returns { error } with a message, or { values } when everything is valid.
export async function readMenuForm(
  form: FormData,
  imageRequired: boolean,
): Promise<{ error: string } | { values: MenuValues }> {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const fields = {
    name: text("name"),
    category: text("category"),
    description: text("description"),
    price: text("price"),
    location: text("location"),
  };

  const errors = validateMenuFields(fields);
  const entry = form.get("image");
  const image = entry instanceof File && entry.size > 0 ? entry : null;
  const imageError = validateImage(image, imageRequired);
  if (imageError) errors.image = imageError;

  const firstError = Object.values(errors)[0];
  if (firstError) return { error: firstError };

  // The category must be one we know
  const categories = await getList<string>("/category");
  if (!categories.includes(fields.category)) {
    return { error: "Please choose a valid category" };
  }

  return { values: { ...fields, price: Number(fields.price), image } };
}

// Uploads a picture to ImgBB and returns its public link.
export async function uploadToImgbb(file: File, apiKey: string) {
  const body = new FormData();
  body.set("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    { method: "POST", body },
  );
  const data = await res.json();
  if (!res.ok || !data?.data?.url) throw new Error("upload failed");
  return data.data.url as string;
}
