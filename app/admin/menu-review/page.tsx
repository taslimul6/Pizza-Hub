import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import AdminMenuList from "@/app/components/admin/AdminMenuList";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { AdminMenuItem } from "@/types";

export const metadata: Metadata = {
  title: "Review Menu Items | PizzaHub",
};

// An item as the API sends it (only the fields we use)
type ApiItem = {
  _id: string;
  itemName: string;
  emoji?: string;
  images?: string[];
  category: string;
  description: string;
  price: number;
  location?: string;
  shop: string;
  vendorName: string;
  vendorEmail: string | null;
  status: AdminMenuItem["status"];
};

// Loads every submitted item, whatever its status
async function Items() {
  // The proxy already keeps non-admins out; this is only a safety net
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return null;

  const raw = await getList<ApiItem>("/admin/menu", { auth: true });

  const items: AdminMenuItem[] = raw.map((item) => ({
    id: item._id,
    name: item.itemName,
    emoji: item.emoji ?? "🍕",
    // Only real web links are shown as pictures
    image: item.images?.find((src) => src.startsWith("http")),
    category: item.category,
    description: item.description,
    price: item.price,
    location: item.location ?? "Not set",
    shop: item.shop,
    vendorName: item.vendorName,
    vendorEmail: item.vendorEmail,
    status: item.status,
    available: item.status === "approved",
  }));

  return <AdminMenuList items={items} />;
}

// Admin only (the proxy redirects everyone else)
export default function ReviewMenuPage() {
  return (
    <>
      <AdminPageHeader
        title="Review menu items"
        description="Approve or reject new items, change the status of live ones and remove anything inappropriate."
      />
        <Suspense
          fallback={
            <div role="status" aria-label="Loading items" className="grid gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-3xl bg-muted" />
              ))}
            </div>
          }
        >
          <Items />
        </Suspense>
    </>
  );
}
