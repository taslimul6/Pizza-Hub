import { Suspense } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FeaturedPizza } from "@/types";
import SectionHeading from "./SectionHeading";

// Turn "pizzahub-downtown" into "Pizzahub Downtown"
function formatShop(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Get the featured pizzas from the API (URL comes from .env)
async function getFeatured(): Promise<FeaturedPizza[]> {
  const url = process.env.FEATURED_API_URL;
  if (!url) return [];

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    // API is down: show an empty state instead of crashing the page
    return [];
  }
}

async function FeaturedList() {
  const pizzas = await getFeatured();

  if (pizzas.length === 0) {
    return (
      <p className="text-muted-foreground">
        Featured pizzas are not available right now. Please check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pizzas.map((pizza) => (
        <Card
          key={pizza._id}
          className="gap-0 rounded-3xl border border-border py-0 ring-0 transition-shadow hover:shadow-warm-md"
        >
          {/* Picture area (emoji placeholder until we have photos) */}
          <div className="relative grid h-36 place-items-center bg-accent/30 text-6xl">
            {pizza.emoji}
            {pizza.flag && (
              <Badge variant="accent" className="absolute left-3 top-3">
                {pizza.flag}
              </Badge>
            )}
            {pizza.vendorPremium && (
              <Badge variant="dark" className="absolute right-3 top-3">
                ⭐ Premium vendor
              </Badge>
            )}
          </div>

          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-bold">{pizza.itemName}</h3>
              <Badge variant="accent" className="shrink-0 text-sm">
                {pizza.rating} ★
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatShop(pizza.shop)} · {pizza.prepTimeMin} min · from $
              {pizza.price.toFixed(2)}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {pizza.description}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              <li>
                <Badge variant="muted">{pizza.isVeg ? "Veg" : "Non-veg"}</Badge>
              </li>
              {pizza.isSpicy && (
                <li>
                  <Badge variant="muted">Spicy</Badge>
                </li>
              )}
              {pizza.toppings.slice(0, 2).map((topping) => (
                <li key={topping}>
                  <Badge variant="muted">{topping}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function PopularShops() {
  return (
    <section id="shops" className="px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Popular near you"
            title="Local favorites, fired up"
          />
          <Link
            href="/shops"
            className="mb-10 font-bold text-primary-600 hover:underline"
          >
            View all shops →
          </Link>
        </div>

        {/* The API data loads here (Cache Components needs a Suspense boundary) */}
        <Suspense
          fallback={<p className="text-muted-foreground">Loading pizzas…</p>}
        >
          <FeaturedList />
        </Suspense>
      </div>
    </section>
  );
}
