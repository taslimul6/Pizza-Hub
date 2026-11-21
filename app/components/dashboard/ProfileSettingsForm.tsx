"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { IMAGE_TYPES, validateImage } from "@/lib/menu-validation";

export type ProfileInfo = {
  name: string;
  email: string;
  role: string;
  image: string | null;
  businessName: string | null; // vendors only
  planLabel: string | null; // vendors only, e.g. "Premium until Dec 21"
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Profile settings: name, photo (ImgBB) and, for vendors, the restaurant name.
// Email, role and plan are shown but cannot be changed here.
export default function ProfileSettingsForm({ profile }: { profile: ProfileInfo }) {
  const router = useRouter();
  const isVendor = profile.role === "vendor";

  const [name, setName] = useState(profile.name);
  const [businessName, setBusinessName] = useState(profile.businessName ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(profile.image ?? "");
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    const imageError = validateImage(file, false);
    if (imageError) {
      toast.error(imageError);
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  function handleRemoveImage() {
    setImage(null);
    setPreview("");
    setRemoveImage(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) return setError("Please enter your name (at least 2 characters).");
    if (isVendor && businessName.trim().length < 2) {
      return setError("Please enter your restaurant name (at least 2 characters).");
    }

    setSaving(true);
    try {
      const body = new FormData();
      body.set("name", name.trim());
      if (isVendor) body.set("businessName", businessName.trim());
      if (image) body.set("image", image);
      if (removeImage) body.set("removeImage", "true");

      const res = await fetch("/api/profile", { method: "PATCH", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.error ?? "Could not save your profile.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Profile updated");
      setImage(null);
      setRemoveImage(false);
      // Refresh the session so the navbar and sidebar show the new name and photo
      authClient.$store.notify("$sessionSignal");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* Photo */}
      <section className="rounded-3xl border border-border bg-white p-6 text-center">
        <h2 className="font-display text-xl font-bold">Profile photo</h2>
        <div className="mx-auto mt-5 grid size-32 place-items-center overflow-hidden rounded-full bg-dark text-3xl font-bold text-light shadow-warm-md">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Profile photo" className="size-full object-cover" />
          ) : (
            initialsOf(name) || "?"
          )}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-600 focus-within:ring-3 focus-within:ring-ring/50">
            <Camera className="size-4" aria-hidden="true" />
            {preview ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept={IMAGE_TYPES.join(",")}
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>
          {preview && (
            <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
              <Trash2 className="size-4" aria-hidden="true" />
              Remove
            </Button>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          JPG, PNG, WEBP or GIF, up to 5 MB. Stored on ImgBB.
        </p>
      </section>

      {/* Details */}
      <section className="space-y-5 rounded-3xl border border-border bg-white p-6 lg:col-span-2">
        <h2 className="font-display text-xl font-bold">Your details</h2>

        <div>
          <Label htmlFor="profile-name" className="mb-1.5 font-bold">
            Full name
          </Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        {isVendor && (
          <div>
            <Label htmlFor="profile-business" className="mb-1.5 font-bold">
              Restaurant name
            </Label>
            <Input
              id="profile-business"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Napoli Slice"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Shown to customers on your menu items and orders.
            </p>
          </div>
        )}

        {/* Read-only account info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <ReadOnly label="Email" value={profile.email} />
          <ReadOnly label="Role" value={profile.role} capitalize />
          {isVendor && profile.planLabel && <ReadOnly label="Plan" value={profile.planLabel} />}
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden="true" />
          Email, role and plan cannot be changed here.
        </p>

        {error !== "" && (
          <p role="alert" className="text-sm font-bold text-primary-600">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </section>
    </form>
  );
}

function ReadOnly({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-bold">{label}</p>
      <p
        className={`flex h-12 items-center rounded-full border border-border bg-muted px-5 text-muted-foreground ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
