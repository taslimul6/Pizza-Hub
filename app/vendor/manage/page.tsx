import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { PlusCircle } from "lucide-react";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";
import ManageMenuList from "@/app/components/vendor/ManageMenuList";
import { buttonVariants } from "@/components/ui/button";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { ItemStatus, VendorMenuItem } from "@/types";

export const metadata: Metadata = {
  title: "Manage Menu | PizzaHub",
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
  status: ItemStatus;
};

// Loads only the logged-in vendor's own items (every status)
async function MyItems() {
  const session = await auth.api.getSession({ headers: await headers() });
  // The proxy already blocks guests; this is only a safety net
  if (!session) return null;

  const [raw, categories] = await Promise.all([
    getList<ApiItem>("/menu/mine", { auth: true }),
    getList<string>("/category"),
  ]);

  const items: VendorMenuItem[] = raw.map((item) => ({
    id: item._id,
    name: item.itemName,
    emoji: item.emoji ?? "🍕",
    // Only real web links are shown as pictures
    image: item.images?.find((src) => src.startsWith("http")),
    category: item.category,
    description: item.description,
    price: item.price,
    location: item.location ?? "Not set",
    status: item.status,
    available: item.status === "approved",
  }));

  return <ManageMenuList items={items} categories={categories} />;
}

// Vendor only (the proxy redirects everyone else)
export default function ManageMenuPage() {
  return (
    <div className="max-w-[900px]">
      <DashboardPageHeader
        eyebrow="Vendor"
        title="Manage menu"
        description="Your items, their approval status and availability."
        actions={
          <Link href="/vendor/addMenu" className={buttonVariants()}>
            <PlusCircle className="size-4" aria-hidden="true" />
            Add menu item
          </Link>
        }
      />

        <Suspense
          fallback={
            <div
              role="status"
              aria-label="Loading your items"
              className="grid gap-4"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-3xl bg-muted" />
              ))}
            </div>
          }
        >
          <MyItems />
        </Suspense>
    </div>
  );
}
