import { Suspense } from "react";
import { getList } from "@/lib/api";
import type { FeaturedPizza } from "@/types";
import MenuBrowser from "./MenuBrowser";
import SectionHeading from "./SectionHeading";

async function Menu() {
  const [categories, items] = await Promise.all([
    getList<string>("/category"),
    getList<FeaturedPizza>("/"),
  ]);

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground">
        The menu is not available right now. Please check back soon.
      </p>
    );
  }

  return <MenuBrowser categories={categories} items={items} />;
}

export default function FeaturedMenu() {
  return (
    <section id="menu" className="bg-white px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Browse menu"
          title="What are you craving tonight?"
          subtitle="Pizzas, sides, desserts and more from our top-rated kitchens."
        />

        {/* The API data loads here (Cache Components needs a Suspense boundary) */}
        <Suspense
          fallback={<p className="text-muted-foreground">Loading menu…</p>}
        >
          <Menu />
        </Suspense>
      </div>
    </section>
  );
}
