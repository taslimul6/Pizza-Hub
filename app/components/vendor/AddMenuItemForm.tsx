"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatSlug } from "@/lib/format-slug";
import {
  validateImage,
  validateMenuFields,
  type MenuErrors,
} from "@/lib/menu-validation";

const fieldStyle =
  "w-full rounded-2xl border border-input bg-white px-5 text-base outline-none focus-visible:border-ring aria-invalid:border-destructive";

type Errors = MenuErrors;

// Form a vendor uses to add a new menu item. The item is saved as "pending"
// until an admin approves it.
export default function AddMenuItemForm({ categories }: { categories: string[] }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  // Changing this key clears the file input after a successful save
  const [fileKey, setFileKey] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function validate() {
    const next: Errors = validateMenuFields({
      name,
      category,
      description,
      price,
      location,
    });
    const imageError = validateImage(image, true);
    if (imageError) next.image = imageError;
    return next;
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate();
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
      body.set("image", image as File);

      const res = await fetch("/api/menu", { method: "POST", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.code === "FREE_ITEM_LIMIT") {
          // The subscription page explains the limit with a toast
          router.push("/vendor/subscription?limit=reached");
          return;
        }
        toast.error(data.error ?? "Could not add the menu item");
        return;
      }

      toast.success("Menu item submitted", {
        description: "It will appear on the menu after an admin approves it.",
      });
      // Clear the form
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setLocation("");
      setImage(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      setFileKey((key) => key + 1);
      // Go to the manage page, where the new item shows as Pending
      router.push("/vendor/manage");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-3xl border border-border bg-white p-6 sm:p-8"
    >
      <div className="space-y-1.5">
        <Label htmlFor="item-name">Item name</Label>
        <Input
          id="item-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Spicy Pepperoni"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="item-category">Category</Label>
          <select
            id="item-category"
            className={`${fieldStyle} h-12`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-invalid={!!errors.category}
          >
            <option value="">Choose a category</option>
            {categories.map((c) => (
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
          <Label htmlFor="item-price">Price ($)</Label>
          <Input
            id="item-price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="12.99"
            aria-invalid={!!errors.price}
          />
          {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="item-description">Description</Label>
        <textarea
          id="item-description"
          rows={4}
          className={`${fieldStyle} py-3`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is on it? What makes it special?"
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="item-location">Location (area / city)</Label>
        <Input
          id="item-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Downtown, New York"
          aria-invalid={!!errors.location}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="item-image">Item image</Label>
        <input
          key={fileKey}
          id="item-image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          aria-invalid={!!errors.image}
          className="block w-full cursor-pointer rounded-2xl border border-input bg-white p-3 text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-primary-foreground"
        />
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WEBP or GIF, up to 5 MB.
        </p>
        {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Selected item preview"
            className="mt-2 h-40 w-40 rounded-2xl object-cover"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-sm text-muted-foreground">
          New items stay <strong>Pending</strong> until an admin approves them.
        </p>
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Saving…" : "Add menu item"}
        </Button>
      </div>
    </form>
  );
}
