"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatSlug } from "@/lib/format-slug";
import type { MenuQuery, MenuResult } from "@/types";
import MenuCard from "./MenuCard";

const selectStyle =
  "h-12 w-full rounded-full border border-input bg-white px-5 text-base outline-none focus-visible:border-ring";

const sortLabels: Record<MenuQuery["sort"], string> = {
  newest: "Newest first",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  rating: "Top rated",
};

// Search, filters and sort for the Browse Menu page.
// Every change goes into the address (/menu?search=...&sort=price_asc); the
// server page reads it and asks the API (GET /menu?...) for the matching items.
// So a filtered page can be shared, bookmarked and reloaded.
export default function MenuBrowse({ result, query }: { result: MenuResult; query: MenuQuery }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // The search box and the price boxes update the address after a short pause
  const [search, setSearch] = useState(query.search);
  const [minPrice, setMinPrice] = useState(query.minPrice);
  const [maxPrice, setMaxPrice] = useState(query.maxPrice);
  const firstRender = useRef(true);

  // Send the filters to the address (and so to the server)
  function apply(changes: Partial<MenuQuery>) {
    const next = { ...query, search, minPrice, maxPrice, ...changes };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (value && !(key === "sort" && value === "newest")) params.set(key, value);
    }
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  // Wait 400 ms after typing before searching
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => apply({}), 400);
    return () => clearTimeout(timer);
    // apply only changes when these change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, minPrice, maxPrice]);

  const hasFilters =
    query.search !== "" ||
    query.category !== "" ||
    query.location !== "" ||
    query.minPrice !== "" ||
    query.maxPrice !== "" ||
    query.sort !== "newest";

  function clearFilters() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  return (
    <>
      {/* Search + filters */}
      <div className="mb-4 grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search pizzas, sides, drinks…"
            aria-label="Search by name or description"
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter by category"
          className={selectStyle}
          value={query.category}
          onChange={(e) => apply({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {result.categories.map((c) => (
            <option key={c} value={c}>
              {formatSlug(c)}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by location"
          className={selectStyle}
          value={query.location}
          onChange={(e) => apply({ location: e.target.value })}
        >
          <option value="">All locations</option>
          {result.locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort"
          className={selectStyle}
          value={query.sort}
          onChange={(e) => apply({ sort: e.target.value as MenuQuery["sort"] })}
        >
          {(Object.keys(sortLabels) as MenuQuery["sort"][]).map((s) => (
            <option key={s} value={s}>
              {sortLabels[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Price
        </span>
        <Input
          type="number"
          inputMode="decimal"
          min="0"
          placeholder="Min $"
          aria-label="Minimum price"
          className="h-10 w-28"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <span className="text-muted-foreground">to</span>
        <Input
          type="number"
          inputMode="decimal"
          min="0"
          placeholder="Max $"
          aria-label="Maximum price"
          className="h-10 w-28"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Updating results…
          </>
        ) : (
          <>
            {result.total} {result.total === 1 ? "item" : "items"} found
          </>
        )}
      </p>

      <div className={`transition-opacity ${isPending ? "opacity-60" : ""}`}>
        {result.items.length === 0 ? (
          // Empty state
          <div className="rounded-3xl border border-border bg-white p-10 text-center">
            <p className="text-5xl">🍕</p>
            <h2 className="mt-3 font-display text-xl font-bold">No items found</h2>
            <p className="mt-1 text-muted-foreground">
              Try a different search or clear the filters.
            </p>
            {hasFilters && (
              <Button className="mt-5" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
