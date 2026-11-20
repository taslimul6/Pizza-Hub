// Types for the admin dashboard.

// One number card in the admin overview
export type AdminStat = {
  label: string;
  value: string;
  icon: string;
  hint: string; // small line under the number
  color: string; // Tailwind background class for the icon box
  href?: string; // optional link to the page that manages it
};

// The numbers returned by GET /stats
export type AdminStats = {
  users: number;
  vendors: number;
  customers: number;
  menuItems: number;
  pendingItems: number;
  transactions: number;
};

// One user in the admin "Manage users" list
export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string; // "customer", "vendor" or "admin"
  blocked: boolean;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
};

// One menu item in the admin "Review menu items" list
export type AdminMenuItem = {
  id: string;
  name: string;
  emoji: string;
  image?: string; // full image URL (ImgBB), if the item has one
  category: string;
  description: string;
  price: number;
  location: string;
  shop: string;
  vendorName: string;
  vendorEmail: string | null; // older items have no vendor email
  status: "pending" | "publish" | "rejected";
  available: boolean;
};

// One row of the admin "Transactions" list (read only)
export type AdminTransaction = {
  id: string;
  vendorName: string;
  vendorEmail: string | null;
  vendorShop: string | null;
  customerName: string;
  customerEmail: string;
  itemName: string;
  amount: number;
  cardLast4: string;
  orderStatus: string;
  paymentStatus: "paid" | "pending" | "refunded";
  createdAt: string;
};
