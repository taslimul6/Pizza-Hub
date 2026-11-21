"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Panels that look like an app: no marketing footer there
const dashboards = ["/admin", "/vendor", "/customer"];

// Hides its content inside the admin, vendor and customer panels
export default function HideOnDashboard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inDashboard = dashboards.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );
  return inDashboard ? null : children;
}
