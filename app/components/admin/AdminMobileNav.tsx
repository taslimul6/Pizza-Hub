"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav, isActive } from "./admin-nav";

// Admin pages as scrollable tabs (small screens, where the sidebar is hidden)
export default function AdminMobileNav() {
  const pathname = usePathname();
  const items = adminNav.flatMap((section) => section.items);

  return (
    <nav
      aria-label="Admin navigation"
      className="sticky top-16 z-30 border-b border-border bg-white/95 backdrop-blur lg:hidden"
    >
      <ul className="flex gap-2 overflow-x-auto px-4 py-3">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-border"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
