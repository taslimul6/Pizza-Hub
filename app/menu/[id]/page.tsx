import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ItemGallery from "@/app/components/menu/ItemGallery";
import OrderPanel from "@/app/components/menu/OrderPanel";
import { Badge } from "@/components/ui/badge";
import { getList } from "@/lib/api";
import { formatSlug } from "@/lib/format-slug";
import { getShopLocation, getShopName } from "@/lib/shop-info";
import type { FeaturedPizza } from "@/types";

export const metadata: Metadata = {
  title: "Item Details | PizzaHub",
};

// Item ids are 24-character hex strings (MongoDB ids)
const validId = /^[a-f0-9]{24}$/i;

// Turn an image path from the API into a full URL
function imageUrl(path: string) {
  return new URL(path, process.env.API_URL).toString();
}

async function ItemDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // A badly formed id can never match an item
  if (!validId.test(id)) notFound();

  const items = await getList<FeaturedPizza>("/");

  // Empty list means the API is down (not that the id is wrong)
  if (items.length === 0) {
    return (
      <p className="rounded-3xl border border-border bg-white p-10 text-center text-muted-foreground">
        We could not load this item right now. Please try again soon.
      </p>
    );
  }

  const item = items.find((i) => i._id === id);
  if (!item) notFound();

  const images = (item.images ?? []).filter(Boolean).map(imageUrl);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ItemGallery name={item.itemName} emoji={item.emoji} images={images} />

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{formatSlug(item.category)}</Badge>
          {item.flag && <Badge variant="secondary">{item.flag}</Badge>}
          <Badge variant="accent">{item.rating} ★</Badge>
        </div>

        <h1 className="mt-3 font-display text-4xl font-black tracking-tight">
          {item.itemName}
        </h1>
        <p className="mt-2 text-2xl font-black text-primary">
          from ${item.price.toFixed(2)}
        </p>
        <p className="mt-4 text-lg text-muted-foreground">{item.description}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {item.toppings.map((topping) => (
            <li key={topping}>
              <Badge variant="muted">{topping}</Badge>
            </li>
          ))}
        </ul>

        {/* Vendor info */}
        <div className="mt-6 rounded-3xl border border-border bg-white p-6">
          <h2 className="font-display text-xl font-bold">Vendor</h2>
          <p className="mt-2 font-bold">🏪 {getShopName(item.shop)}</p>
          <p className="mt-1 text-muted-foreground">
            📍 {getShopLocation(item.shop)}
          </p>
          <p className="mt-1 text-muted-foreground">
            ⏱ {item.prepTimeMin} min prep · {item.calories} kcal
          </p>
        </div>

        <div className="mt-6">
          <OrderPanel item={item} />
        </div>
      </div>
    </div>
  );
}

export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/menu"
          className="mb-6 inline-block font-bold text-primary-600 hover:underline"
        >
          ← Back to menu
        </Link>
        <Suspense
          fallback={
            <div
              role="status"
              aria-label="Loading item"
              className="grid gap-10 lg:grid-cols-2"
            >
              <div className="aspect-[4/3] animate-pulse rounded-3xl bg-muted" />
              <div className="h-96 animate-pulse rounded-3xl bg-muted" />
            </div>
          }
        >
          <ItemDetails params={params} />
        </Suspense>
      </div>
    </main>
  );
}
