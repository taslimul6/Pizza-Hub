"use client"; // needed because we use useState for the category tabs

import { useState } from "react";
import SectionHeading from "./SectionHeading";

// Tab buttons
const categories = [
  { id: "pizzas", label: "Pizzas" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
];

// Sample menu data (will come from a database later)
const menuItems = [
  { cat: "pizzas", emoji: "🍕", name: "Margherita Classica", desc: "San Marzano tomato, mozzarella, fresh basil and olive oil.", price: 11.5, shop: "Napoli Slice", flag: "Veg" },
  { cat: "pizzas", emoji: "🌶️", name: "Spicy Pepperoni", desc: "Double pepperoni, mozzarella, chili flakes and hot honey.", price: 13.95, shop: "The Pepperoni Club", flag: "Bestseller" },
  { cat: "pizzas", emoji: "🥦", name: "Garden Veggie Supreme", desc: "Roasted peppers, onion, mushrooms, olives and basil.", price: 12.95, shop: "Basil & Dough", flag: "Veg" },
  { cat: "pizzas", emoji: "🍗", name: "BBQ Chicken Ranch", desc: "Smoky BBQ sauce, grilled chicken, onion and ranch drizzle.", price: 14.25, shop: "Brooklyn Crust Co." },
  { cat: "sides", emoji: "🥖", name: "Garlic Knots", desc: "Six warm knots brushed with garlic butter, with marinara.", price: 5.5, shop: "Napoli Slice", flag: "Veg" },
  { cat: "sides", emoji: "🍗", name: "Crispy Buffalo Wings", desc: "Eight oven-crisped wings with blue-cheese dip.", price: 8.95, shop: "The Pepperoni Club", flag: "Spicy" },
  { cat: "sides", emoji: "🥗", name: "Caesar Salad", desc: "Crisp romaine, parmesan, croutons and Caesar dressing.", price: 7.25, shop: "Basil & Dough" },
  { cat: "drinks", emoji: "🍋", name: "Italian Lemonade", desc: "Fresh lemon, mint and sparkling water. Served ice cold.", price: 3.75, shop: "Napoli Slice" },
  { cat: "drinks", emoji: "🥤", name: "Classic Cola (500 ml)", desc: "The perfect partner for a hot slice.", price: 2.5, shop: "The Pepperoni Club" },
  { cat: "drinks", emoji: "🍑", name: "Peach Iced Tea", desc: "Black tea brewed daily, lightly sweetened with peach.", price: 3.25, shop: "Basil & Dough" },
];

export default function FeaturedMenu() {
  // Which tab is selected right now
  const [activeCategory, setActiveCategory] = useState("pizzas");

  // Only show items from the selected tab
  const visibleItems = menuItems.filter((item) => item.cat === activeCategory);

  return (
    <section id="menu" className="bg-white px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Browse menu"
          title="What are you craving tonight?"
          subtitle="Hand-picked favorites from our top-rated kitchens."
        />

        {/* Tabs */}
        <div role="tablist" aria-label="Menu categories" className="mb-8 flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              role="tab"
              aria-selected={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-6 py-2.5 font-bold transition-colors ${
                activeCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-sand-100 hover:bg-border"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleItems.map((item) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-3xl border border-border bg-light"
            >
              <div className="relative grid h-32 place-items-center bg-primary-100 text-5xl">
                {item.emoji}
                {item.flag && (
                  <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-white">
                    {item.flag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold">{item.name}</h3>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
                <p className="mt-3 text-sm text-muted">from {item.shop}</p>
                <p className="mt-1 text-lg font-bold text-primary">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
