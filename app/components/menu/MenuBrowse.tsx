"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatSlug } from "@/lib/format-slug";
import { getShopLocation } from "@/lib/shop-info";
import type { FeaturedPizza } from "@/types";
import MenuCard from "./MenuCard";

type MenuBrowseProps = {
  categories: string[];
  items: FeaturedPizza[];
};

const selectStyle =
  "h-12 w-full rounded-full border border-input bg-white px-5 text-base outline-none focus-visible:border-ring";

// Search box, category and location filters + the matching item cards
export default function MenuBrowse({ categories, items }: MenuBrowseProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  // Only active items are shown to visitors
  const activeItems = items.filter((item) => item.available);

  // Location list is built from the items we have
  const locations = [
    ...new Set(activeItems.map((item) => getShopLocation(item.shop))),
  ].sort();

  const text = search.trim().toLowerCase();
  const visibleItems = activeItems.filter(
    (item) =>
      item.name.toLowerCase().includes(text) &&
      (category === "all" || item.category === category) &&
      (location === "all" || getShopLocation(item.shop) === location),
  );

  const hasFilters = text !== "" || category !== "all" || location !== "all";

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setLocation("all");
  }

  return (
    <>
      {/* Search + filters */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <Input
          type="search"
          placeholder="Search pizzas by name…"
          aria-label="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Filter by category"
          className={selectStyle}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {formatSlug(c)}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by location"
          className={selectStyle}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="all">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
        {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}{" "}
        found
      </p>

      {visibleItems.length === 0 ? (
        // Empty state
        <div className="rounded-3xl border border-border bg-white p-10 text-center">
          <p className="text-5xl">🍕</p>
          <h2 className="mt-3 font-display text-xl font-bold">
            No items found
          </h2>
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
          {visibleItems.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
