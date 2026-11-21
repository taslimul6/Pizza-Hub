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
  itemName: string;
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
  vendorPremium?: boolean; // the vendor has an active Premium plan
  prepTimeMin: number;
  toppings: string[];
  sizes: { label: string; price: number }[];
  crust: string[];
  calories: number;
  images: string[]; // picture links (ImgBB links, or paths on the API server)
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

// An order saved by the API (POST /orders)
export type Order = {
  _id: string;
  name: string;
  email: string;
  customerId: string | null; // ref: user
  vendorId: string | null; // ref: user (null for older seed items)
  // Vendor name and shop at the time of the order
  vendor?: {
    name: string | null;
    shop: string | null;
    location: string | null;
  };
  createdAt: string;
  orderDetails: {
    itemId: string;
    itemName: string;
    shop: string;
    size: string;
    crust: string;
    quantity: number;
    unitPrice: number;
    total: number;
    cardLast4: string;
    // Delivery details (orders placed before they were added do not have them)
    deliveryDate?: string;
    deliveryAddress?: string;
    message?: string;
    // pending | accepted | rejected | cancelled | completed
    status: string;
  };
};
