"use client";

import DashboardMobileNav from "@/app/components/dashboard/DashboardMobileNav";
import { adminNav } from "./admin-nav";

// Admin pages as tabs on small screens
export default function AdminMobileNav() {
  return <DashboardMobileNav nav={adminNav} homeHref="/admin" label="Admin navigation" />;
}
