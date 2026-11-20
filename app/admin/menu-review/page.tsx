import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import AdminMenuList from "@/app/components/admin/AdminMenuList";
import SectionHeading from "@/app/components/homepage/SectionHeading";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { AdminMenuItem } from "@/types";

export const metadata: Metadata = {
  title: "Review Menu Items | PizzaHub",
};

// An item as the API sends it (only the fields we use)
type ApiItem = {
  _id: string;
  name: string;
  emoji?: string;
  image?: string;
  category: string;
  description: string;
  price: number;
  location?: string;
  shop: string;
  vendor?: { name?: string; email?: string };
  status?: AdminMenuItem["status"]; // older items have no status
  available: boolean;
};

// Loads every submitted item, whatever its status
async function Items() {
  // The proxy already keeps non-admins out; this is only a safety net
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return null;

  const raw = await getList<ApiItem>("/admin/menu");

  const items: AdminMenuItem[] = raw.map((item) => ({
    id: item._id,
    name: item.name,
    emoji: item.emoji ?? "🍕",
    // Only real web links are shown as pictures
    image: item.image?.startsWith("http") ? item.image : undefined,
    category: item.category,
    description: item.description,
    price: item.price,
    location: item.location ?? "Not set",
    shop: item.shop,
    vendorName: item.vendor?.name ?? item.shop,
    vendorEmail: item.vendor?.email ?? null,
    status: item.status ?? "publish",
    available: item.available,
  }));

  return <AdminMenuList items={items} />;
}

// Admin only (the proxy redirects everyone else)
export default function ReviewMenuPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-[1000px]">
        <SectionHeading
          eyebrow="Admin"
          title="Review menu items"
          subtitle="Approve or reject new items, change the status of live ones and remove anything inappropriate."
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
      </div>
    </main>
  );
}
