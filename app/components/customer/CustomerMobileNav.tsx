"use client";

import DashboardMobileNav from "@/app/components/dashboard/DashboardMobileNav";
import { customerNav } from "./customer-nav";

// Customer pages as tabs on small screens
export default function CustomerMobileNav() {
  return <DashboardMobileNav nav={customerNav} homeHref="/customer" label="Customer navigation" />;
}
