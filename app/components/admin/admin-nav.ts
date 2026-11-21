import { ClipboardCheck, LayoutDashboard, ReceiptText, UserCog, Users } from "lucide-react";
import type { DashboardNavSection } from "@/app/components/dashboard/nav";

// The pages of the admin panel (sidebar + mobile tabs)
export const adminNav: DashboardNavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, hint: "Numbers at a glance" },
    ],
  },
  {
    title: "Manage",
    items: [
      { href: "/admin/users", label: "Users", icon: Users, hint: "Search, block, unblock" },
      { href: "/admin/menu-review", label: "Menu review", icon: ClipboardCheck, hint: "Approve or reject items" },
      { href: "/admin/transactions", label: "Transactions", icon: ReceiptText, hint: "Orders and subscriptions" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/admin/settings", label: "Profile settings", icon: UserCog, hint: "Name and photo" },
    ],
  },
];
