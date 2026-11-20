import { formatSlug } from "./format-slug";

// Sample shop locations (the API does not send a location yet).
// Replace with real data when the shop API exists.
const shopLocations: Record<string, string> = {
  "pizzahub-downtown": "Downtown",
  "brooklyn-pizza-house": "Brooklyn",
  "green-oven-pizza": "Green Park",
  "smoky-crust": "Midtown",
  "artisan-pizza-co": "Old Town",
};

export function getShopName(shop: string) {
  return formatSlug(shop);
}

export function getShopLocation(shop: string) {
  return shopLocations[shop] ?? "Location not listed";
}
