"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Hides its content inside the admin panel (used for the marketing footer,
// so the admin panel feels like an app, not a web page).
export default function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return children;
}
