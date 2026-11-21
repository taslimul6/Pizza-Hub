// Types for the vendor dashboard.

// Approval status of a menu item.
// Only "approved" items are shown to customers.
export type ItemStatus = "pending" | "approved" | "rejected" | "inactive";

// The vendor's plan, from GET /subscription
export type VendorSubscription = {
  plan: "free" | "premium";
  expiresAt: string | null; // when premium ends (null on free)
  activeItems: number; // approved items right now
  activeLimit: number | null; // 3 on free, null = unlimited
  price: number; // premium price per period
  periodDays: number; // length of one premium period
};

// One menu item in the vendor's "Manage menu" list
export type VendorMenuItem = {
  id: string;
  name: string;
  emoji: string;
  image?: string; // full image URL (ImgBB), if the item has one
  category: string;
  description: string;
  price: number;
  location: string;
  status: ItemStatus;
  available: boolean; // true when approved, false when inactive (switched off)
};
