import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MenuCategory, MenuItem } from "@/types";
import SectionHeading from "./SectionHeading";

// Tab buttons
const categories: MenuCategory[] = [
  { id: "pizzas", label: "Pizzas" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
];

// Sample menu data (will come from a database later)
const menuItems: MenuItem[] = [
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

// The Tabs component remembers the selected tab by itself,
// so this section needs no useState.
export default function FeaturedMenu() {
  return (
    <section id="menu" className="bg-white px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Browse menu"
          title="What are you craving tonight?"
          subtitle="Hand-picked favorites from our top-rated kitchens."
        />

        <Tabs defaultValue="pizzas" className="gap-0">
          {/* Tab buttons */}
          <TabsList
            aria-label="Menu categories"
            className="mb-8 h-auto justify-start gap-2 bg-transparent p-0"
          >
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="h-auto flex-none rounded-full bg-muted px-6 py-2.5 text-base font-bold text-foreground hover:bg-border data-active:bg-primary data-active:text-primary-foreground data-active:hover:bg-primary"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Items of each tab */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="text-base">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {menuItems
                  .filter((item) => item.cat === category.id)
                  .map((item) => (
                    <Card
                      key={item.name}
                      className="gap-0 rounded-3xl border border-border bg-light py-0 ring-0"
                    >
                      <div className="relative grid h-32 place-items-center bg-primary-100 text-5xl">
                        {item.emoji}
                        {item.flag && (
                          <Badge
                            variant="secondary"
                            className="absolute left-3 top-3"
                          >
                            {item.flag}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-display text-lg font-bold">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                          from {item.shop}
                        </p>
                        <p className="mt-1 text-lg font-bold text-primary">
                          ${item.price.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
