"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatSlug } from "@/lib/format-slug";
import {
  validateImage,
  validateMenuFields,
  type MenuErrors,
} from "@/lib/menu-validation";
import type { VendorMenuItem } from "@/types";

const fieldStyle =
  "w-full rounded-2xl border border-input bg-white px-5 text-base outline-none focus-visible:border-ring aria-invalid:border-destructive";

type EditMenuItemDialogProps = {
  item: VendorMenuItem | null; // null = popup closed
  categories: string[];
  onClose: () => void;
};

// The form fields. It is a separate component so its state starts fresh
// (with the item's current values) every time the popup opens.
function EditForm({
  item,
  categories,
  onClose,
}: {
  item: VendorMenuItem;
  categories: string[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(String(item.price));
  // "Not set" is only a label on the list, so start empty
  const [location, setLocation] = useState(
    item.location === "Not set" ? "" : item.location,
  );
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState<MenuErrors>({});
  const [saving, setSaving] = useState(false);

  // Keep the item's own category in the list even if it is not public yet
  const options = categories.includes(item.category)
    ? categories
    : [item.category, ...categories];

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateMenuFields({ name, category, description, price, location });
    // The picture is optional here: the old one stays if none is chosen
    const imageError = validateImage(image, false);
    if (imageError) found.image = imageError;
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      const body = new FormData();
      body.set("name", name.trim());
      body.set("category", category);
      body.set("description", description.trim());
      body.set("price", price);
      body.set("location", location.trim());
      if (image) body.set("image", image);

      const res = await fetch(`/api/menu/${item.id}`, { method: "PUT", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Could not update the item");
        return;
      }

      toast.success("Item updated", {
        description: "It is pending again until an admin approves the changes.",
      });
      if (preview) URL.revokeObjectURL(preview);
      onClose();
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="edit-name">Item name</Label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="edit-category">Category</Label>
          <select
            id="edit-category"
            className={`${fieldStyle} h-12`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-invalid={!!errors.category}
          >
            {options.map((c) => (
              <option key={c} value={c}>
                {formatSlug(c)}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-price">Price ($)</Label>
          <Input
            id="edit-price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-invalid={!!errors.price}
          />
          {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edit-description">Description</Label>
        <textarea
          id="edit-description"
          rows={4}
          className={`${fieldStyle} py-3`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edit-location">Location (area / city)</Label>
        <Input
          id="edit-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-invalid={!!errors.location}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edit-image">Change picture (optional)</Label>
        <input
          id="edit-image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          aria-invalid={!!errors.image}
          className="block w-full cursor-pointer rounded-2xl border border-input bg-white p-3 text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-primary-foreground"
        />
        {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
        {(preview || item.image) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview || item.image}
            alt="Item picture"
            className="mt-2 h-32 w-32 rounded-2xl object-cover"
          />
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        After you save, the item goes back to <strong>Pending</strong> until an
        admin approves the changes.
      </p>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

// Popup with the update form for one item
export default function EditMenuItemDialog({
  item,
  categories,
  onClose,
}: EditMenuItemDialogProps) {
  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update item</DialogTitle>
          <DialogDescription>Change the details of {item?.name}.</DialogDescription>
        </DialogHeader>
        {/* key = fresh form state for each item */}
        {item && (
          <EditForm
            key={item.id}
            item={item}
            categories={categories}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
