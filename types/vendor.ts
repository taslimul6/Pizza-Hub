// Types for the vendor dashboard.

// Approval status of a menu item.
// "pending" and "rejected" items are never shown to customers.
export type ItemStatus = "pending" | "publish" | "rejected";

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
  available: boolean; // vendor can switch an item off (e.g. sold out)
};
