import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatSlug } from "@/lib/format-slug";
import { getShopLocation, getShopName } from "@/lib/shop-info";
import type { FeaturedPizza } from "@/types";

// One item on the browse menu page
export default function MenuCard({ item }: { item: FeaturedPizza }) {
  return (
    <Card className="h-full gap-0 rounded-3xl border border-border bg-white py-0 ring-0 transition-shadow hover:shadow-warm-md">
      {/* Picture area (emoji placeholder until we have photos) */}
      <div className="relative grid h-40 place-items-center bg-accent/30 text-6xl">
        {item.emoji}
        {item.flag && (
          <Badge variant="secondary" className="absolute left-3 top-3">
            {item.flag}
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold">{item.name}</h3>
          <Badge variant="accent" className="shrink-0 text-sm">
            {item.rating} ★
          </Badge>
        </div>

        <p className="mt-1 text-sm font-bold text-primary">
          {formatSlug(item.category)}
        </p>

        <p className="mt-3 text-sm text-muted-foreground">
          📍 {getShopLocation(item.shop)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          🏪 {getShopName(item.shop)} · {item.prepTimeMin} min prep
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-xl font-bold text-primary">
            ${item.price.toFixed(2)}
          </p>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/menu/${item.slug}`} />}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
