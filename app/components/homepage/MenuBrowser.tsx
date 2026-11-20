"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatSlug } from "@/lib/format-slug";
import type { FeaturedPizza } from "@/types";

type MenuBrowserProps = {
  categories: string[];
  items: FeaturedPizza[];
};

// Category filter boxes + the items of the selected category
export default function MenuBrowser({ categories, items }: MenuBrowserProps) {
  // "all" means no filter
  const [selected, setSelected] = useState("all");

  const visibleItems =
    selected === "all"
      ? items
      : items.filter((item) => item.category === selected);

  const filters = ["all", ...categories];

  return (
    <>
      <ul className="mb-8 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = filter === selected;
          return (
            <li key={filter}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(filter)}
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-accent bg-accent/25 text-foreground hover:bg-accent/50"
                }`}
              >
                {filter === "all" ? "All" : formatSlug(filter)}
              </button>
            </li>
          );
        })}
      </ul>

      {visibleItems.length === 0 ? (
        <p className="text-muted-foreground">No items in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleItems.map((item) => (
            <Card
              key={item._id}
              className="gap-0 rounded-3xl border border-border bg-light py-0 ring-0"
            >
              <div className="relative grid h-32 place-items-center bg-primary-100 text-5xl">
                {item.emoji}
                {item.flag && (
                  <Badge variant="secondary" className="absolute left-3 top-3">
                    {item.flag}
                  </Badge>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-display text-lg font-bold">{item.itemName}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  from {formatSlug(item.shop)}
                </p>
                <p className="mt-1 text-lg font-bold text-primary">
                  ${item.price.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
