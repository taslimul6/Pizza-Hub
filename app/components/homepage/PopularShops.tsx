import Link from "next/link";
import SectionHeading from "./SectionHeading";

// Sample shop data (will come from a database later)
const shops = [
  { name: "Napoli Slice", emoji: "🍕", rating: 4.9, reviews: "1.2k", time: "20–30 min", fee: 1.49, tags: ["Neapolitan", "Wood-fired"], open: true },
  { name: "Brooklyn Crust Co.", emoji: "🗽", rating: 4.7, reviews: "860", time: "25–35 min", fee: 0, tags: ["New York style", "By the slice"], open: true },
  { name: "Basil & Dough", emoji: "🌿", rating: 4.8, reviews: "640", time: "30–40 min", fee: 2.49, tags: ["Vegetarian", "Organic"], open: true },
  { name: "The Pepperoni Club", emoji: "🌶️", rating: 4.6, reviews: "2.1k", time: "15–25 min", fee: 0.99, tags: ["Pepperoni", "Late night"], open: true },
  { name: "Mamma Rosa's Kitchen", emoji: "👵", rating: 4.9, reviews: "430", time: "35–45 min", fee: 1.99, tags: ["Family size", "Homestyle"], open: false },
  { name: "Fire & Fold", emoji: "🔥", rating: 4.5, reviews: "390", time: "20–30 min", fee: 1.29, tags: ["Calzones", "Stone-baked"], open: true },
];

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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <article
              key={shop.name}
              // Closed shops are faded out
              className={`overflow-hidden rounded-3xl border border-border bg-white transition-shadow hover:shadow-warm-md ${
                shop.open ? "" : "opacity-70"
              }`}
            >
              {/* Picture area (emoji placeholder until we have photos) */}
              <div className="relative grid h-36 place-items-center bg-accent/30 text-6xl">
                {shop.emoji}
                {!shop.open && (
                  <span className="absolute left-3 top-3 rounded-full bg-dark px-3 py-1 text-xs font-bold text-white">
                    Closed
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold">{shop.name}</h3>
                  <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-sm font-bold">
                    {shop.rating} ★
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {shop.reviews} reviews · {shop.time} ·{" "}
                  {shop.fee === 0 ? "Free delivery" : `$${shop.fee.toFixed(2)} delivery`}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {shop.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-sand-100 px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
