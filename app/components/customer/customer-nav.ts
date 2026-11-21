import { LayoutDashboard, Pizza, ShoppingBag } from "lucide-react";
import type { DashboardNavSection } from "@/app/components/dashboard/nav";

// The pages of the customer panel (sidebar + mobile tabs)
export const customerNav: DashboardNavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/customer", label: "Dashboard", icon: LayoutDashboard, hint: "Your orders at a glance" },
    ],
  },
  {
    title: "Orders",
    items: [
      { href: "/customer/myorder", label: "My orders", icon: ShoppingBag, hint: "Track or cancel orders" },
    ],
  },
  {
    title: "Explore",
    items: [
      { href: "/menu", label: "Browse menu", icon: Pizza, hint: "Find something tasty" },
    ],
  },
];
