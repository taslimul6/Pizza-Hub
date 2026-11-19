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

// A pizza shop card
export type Shop = {
  name: string;
  emoji: string;
  rating: number;
  reviews: string;
  time: string;
  fee: number; // 0 means free delivery
  tags: string[];
  open: boolean;
};

// A menu tab (Pizzas / Sides / Drinks)
export type MenuCategory = {
  id: string;
  label: string;
};

// A menu item card
export type MenuItem = {
  cat: string; // matches MenuCategory.id
  emoji: string;
  name: string;
  desc: string;
  price: number;
  shop: string;
  flag?: string; // small badge such as "Veg" or "Bestseller"
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
