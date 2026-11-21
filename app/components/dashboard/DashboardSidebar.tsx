"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, LogOut, type LucideIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { isActive, type DashboardNavSection } from "./nav";

type DashboardSidebarProps = {
  nav: DashboardNavSection[];
  homeHref: string; // "/admin" or "/vendor"
  roleLabel: string; // "Admin", "Vendor"
  roleIcon: LucideIcon;
  extraBadge?: ReactNode; // e.g. a Premium badge for vendors
};

// Left sidebar of a dashboard (large screens). Sticks under the top bar.
// Fonts: DM Sans here (the theme's body font). Fraunces is kept for page titles.
export default function DashboardSidebar({
  nav,
  homeHref,
  roleLabel,
  roleIcon: RoleIcon,
  extraBadge,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function onLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const name = session?.user.name ?? "";
  const image = session?.user.image ?? "";
  const email = session?.user.email ?? "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      aria-label={`${roleLabel} navigation`}
      className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-72 shrink-0 flex-col border-r border-border bg-white lg:flex"
    >
      {/* Signed-in user: name + role */}
      <div className="border-b border-border p-5">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-dark text-base font-bold text-light shadow-warm-md"
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="size-full object-cover" />
            ) : isPending ? (
              ""
            ) : (
              initials || roleLabel.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            {isPending ? (
              <div className="space-y-2" aria-hidden="true">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
            ) : (
              <>
                <p className="truncate text-base font-bold leading-tight">{name}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-600">
                    <RoleIcon className="size-3.5" aria-hidden="true" />
                    {roleLabel}
                  </span>
                  {extraBadge}
                </div>
              </>
            )}
          </div>
        </div>
        {email && <p className="mt-3 truncate text-xs text-muted-foreground">{email}</p>}
      </div>

      {/* Sections */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {nav.map((section) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href, homeHref);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${
                        active ? "bg-primary-100 text-primary-600" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {/* Accent bar on the active page */}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute top-2 bottom-2 left-0 w-1 rounded-full bg-primary"
                        />
                      )}
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-white group-hover:text-foreground"
                        }`}
                      >
                        <Icon className="size-4.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold leading-tight">{item.label}</span>
                        <span
                          className={`block truncate text-xs ${
                            active ? "text-primary-600/80" : "text-muted-foreground"
                          }`}
                        >
                          {item.hint}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="space-y-1 border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
        >
          <Globe className="size-4.5 text-muted-foreground" aria-hidden="true" />
          Back to website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-foreground transition-colors hover:bg-primary-100 hover:text-primary-600"
        >
          <LogOut className="size-4.5 text-muted-foreground" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
