// Types for the sample data shown on the home page.
// (The data will come from a database later.)

// [x, y, radius] of one pepperoni slice on the pizza drawing
export type PepperoniSpot = [number, number, number];

// A number with a label under the hero buttons
export type Stat = {
  value: string;
  label: string;
};

// A "How it works" card
export type Step = {
  number: string;
  icon: string;
  title: string;
  text: string;
  color: string; // Tailwind background class for the icon box
};

// A featured pizza from the /featured API
export type FeaturedPizza = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  emoji: string;
  category: string; // category slug, e.g. "classic-pizzas"
  shop: string; // shop slug, e.g. "pizzahub-downtown"
  price: number;
  isVeg: boolean;
  isSpicy: boolean;
  flag?: string; // e.g. "Bestseller"
  rating: number;
  available: boolean;
  prepTimeMin: number;
  toppings: string[];
};

// A reason for restaurants to join
export type Benefit = {
  icon: string;
  title: string;
  text: string;
};

// A customer review card
export type Review = {
  name: string;
  meta: string;
  stars: number; // 1 to 5
  text: string;
};

// A "Why choose PizzaHub" card
export type Feature = {
  icon: string;
  title: string;
  text: string;
  color: string; // Tailwind background class for the icon box
};
