import type { LucideIcon } from "lucide-react";

// Shared types for the admin and vendor panels (sidebar + mobile tabs)

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  hint: string; // short line under the label in the sidebar
};

export type DashboardNavSection = {
  title: string;
  items: DashboardNavItem[];
};

// The panel's home ("/admin", "/vendor") is only active on itself;
// the other links also match their sub-pages.
export function isActive(pathname: string, href: string, homeHref: string) {
  return href === homeHref ? pathname === homeHref : pathname.startsWith(href);
}
