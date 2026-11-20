import type { Metadata } from "next";
import { Suspense } from "react";
import MenuBrowse from "@/app/components/menu/MenuBrowse";
import MenuSkeleton from "@/app/components/menu/MenuSkeleton";
import SectionHeading from "@/app/components/homepage/SectionHeading";
import { getList } from "@/lib/api";
import type { FeaturedPizza } from "@/types";

export const metadata: Metadata = {
  title: "Browse Menu | PizzaHub",
  description: "Search and filter pizzas, sides and drinks from local shops.",
};

// Loads the data. It runs inside <Suspense> so the skeleton shows meanwhile.
async function Menu() {
  const [categories, items] = await Promise.all([
    getList<string>("/category"),
    getList<FeaturedPizza>("/"),
  ]);

  if (items.length === 0) {
    return (
      <p className="rounded-3xl border border-border bg-white p-10 text-center text-muted-foreground">
        The menu is not available right now. Please check back soon.
      </p>
    );
  }

  return <MenuBrowse categories={categories} items={items} />;
}

// Public page: anyone can browse without logging in
export default function MenuPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Browse menu"
          title="What are you craving tonight?"
          subtitle="Search by name, or filter by category and location."
        />
        <Suspense fallback={<MenuSkeleton />}>
          <Menu />
        </Suspense>
      </div>
    </main>
  );
}
