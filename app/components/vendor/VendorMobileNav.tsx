"use client";

import DashboardMobileNav from "@/app/components/dashboard/DashboardMobileNav";
import { vendorNav } from "./vendor-nav";

// Vendor pages as tabs on small screens
export default function VendorMobileNav() {
  return <DashboardMobileNav nav={vendorNav} homeHref="/vendor" label="Vendor navigation" />;
}
