import type { Metadata } from "next";
import { Suspense } from "react";
import MenuBrowse from "@/app/components/menu/MenuBrowse";
import MenuSkeleton from "@/app/components/menu/MenuSkeleton";
import SectionHeading from "@/app/components/homepage/SectionHeading";
import { getObject } from "@/lib/api";
import type { MenuQuery, MenuResult } from "@/types";

export const metadata: Metadata = {
  title: "Browse Menu | PizzaHub",
  description: "Search and filter pizzas, sides and drinks from local shops.",
};

const sorts: MenuQuery["sort"][] = ["newest", "price_asc", "price_desc", "rating"];

// Reads the filters from the address (/menu?search=...&sort=price_asc)
function readQuery(params: Record<string, string | string[] | undefined>): MenuQuery {
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value ?? "").trim().slice(0, 60);
  };
  const sort = one("sort") as MenuQuery["sort"];
  return {
    search: one("search"),
    category: one("category"),
    location: one("location"),
    minPrice: one("minPrice"),
    maxPrice: one("maxPrice"),
    sort: sorts.includes(sort) ? sort : "newest",
  };
}

// Loads the matching items from the API. Search, filters and sorting all
// happen on the server (GET /menu?...), not in the browser.
async function Menu({ searchParams }: { searchParams: PageProps<"/menu">["searchParams"] }) {
  const query = readQuery(await searchParams);

  const apiParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value && !(key === "sort" && value === "newest")) apiParams.set(key, value);
  }
  const result = await getObject<MenuResult>(`/menu?${apiParams.toString()}`);

  if (!result) {
    return (
      <p className="rounded-3xl border border-border bg-white p-10 text-center text-muted-foreground">
        The menu is not available right now. Please check back soon.
      </p>
    );
  }

  return <MenuBrowse result={result} query={query} />;
}

// Public page: anyone can browse without logging in
export default function MenuPage({ searchParams }: PageProps<"/menu">) {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Browse menu"
          title="What are you craving tonight?"
          subtitle="Search by name, filter by category, location and price, and sort the results."
        />
        <Suspense fallback={<MenuSkeleton />}>
          <Menu searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
