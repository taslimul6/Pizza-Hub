import {
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  UserCog,
  UtensilsCrossed,
} from "lucide-react";
import type { DashboardNavSection } from "@/app/components/dashboard/nav";

// The pages of the vendor panel (sidebar + mobile tabs)
export const vendorNav: DashboardNavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/vendor", label: "Dashboard", icon: LayoutDashboard, hint: "Your shop at a glance" },
    ],
  },
  {
    title: "Menu",
    items: [
      { href: "/vendor/manage", label: "Manage menu", icon: UtensilsCrossed, hint: "Items and availability" },
      { href: "/vendor/addMenu", label: "Add item", icon: PlusCircle, hint: "Submit a new dish" },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/vendor/orders", label: "Customer orders", icon: ShoppingBag, hint: "Accept and complete" },
      { href: "/vendor/myorder", label: "My orders", icon: ShoppingCart, hint: "Orders you placed as a customer" },
      { href: "/vendor/subscription", label: "Subscription", icon: Sparkles, hint: "Free or Premium plan" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/vendor/settings", label: "Profile settings", icon: UserCog, hint: "Restaurant name and photo" },
    ],
  },
];
