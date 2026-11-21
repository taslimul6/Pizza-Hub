import {
  ClipboardCheck,
  LayoutDashboard,
  ReceiptText,
  Users,
  type LucideIcon,
} from "lucide-react";

// The pages of the admin panel (used by the sidebar and the mobile tabs)
export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  hint: string; // short line under the label in the sidebar
};

export const adminNav: { title: string; items: AdminNavItem[] }[] = [
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
];

// "/admin" is only active on the dashboard itself; the others also match sub-pages
export function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
