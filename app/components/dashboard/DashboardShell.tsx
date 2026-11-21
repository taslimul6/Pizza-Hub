import type { ReactNode } from "react";

// Frame of a dashboard: sidebar on the left (large screens), mobile tabs on top
// (small screens), the page on the right. The top navbar stays above it.
export default function DashboardShell({
  sidebar,
  mobileNav,
  children,
}: {
  sidebar: ReactNode;
  mobileNav: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 bg-light">
      {sidebar}
      <div className="min-w-0 flex-1">
        {mobileNav}
        <main className="px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
