"use client";

import { UserRound } from "lucide-react";
import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";
import { customerNav } from "./customer-nav";

// Customer panel sidebar (the layout lives in the shared DashboardSidebar)
export default function CustomerSidebar() {
  return (
    <DashboardSidebar nav={customerNav} homeHref="/customer" roleLabel="Customer" roleIcon={UserRound} />
  );
}
