// Rules for a menu item form. Used by the add form, the edit popup and the
// server routes, so the browser and the server always agree.

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type MenuFields = {
  name: string;
  category: string;
  description: string;
  price: string; // text from the input box
  location: string;
};

export type MenuErrors = Partial<Record<keyof MenuFields | "image", string>>;

// Checks the text fields. Returns an object of messages (empty = all good).
export function validateMenuFields(fields: MenuFields): MenuErrors {
  const errors: MenuErrors = {};
  const name = fields.name.trim();
  const description = fields.description.trim();
  const location = fields.location.trim();
  const price = Number(fields.price);

  if (name.length < 2 || name.length > 60) {
    errors.name = "Enter a name (2 to 60 characters)";
  }
  if (!fields.category) errors.category = "Choose a category";
  if (description.length < 10 || description.length > 500) {
    errors.description = "Write a description (10 to 500 characters)";
  }
  if (!fields.price || !Number.isFinite(price) || price <= 0 || price > 1000) {
    errors.price = "Enter a price above 0 (up to 1000)";
  }
  if (location.length < 2 || location.length > 60) {
    errors.location = "Enter an area or city";
  }
  return errors;
}

// Checks the picture. It is required when adding, optional when editing.
export function validateImage(
  file: File | null,
  required: boolean,
): string | undefined {
  if (!file || file.size === 0) {
    return required ? "Item image is required" : undefined;
  }
  if (!IMAGE_TYPES.includes(file.type)) return "Use a JPG, PNG, WEBP or GIF file";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be 5 MB or smaller";
  return undefined;
}
