"use client";

import { ShieldCheck } from "lucide-react";
import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";
import { adminNav } from "./admin-nav";

// Admin panel sidebar (the layout lives in the shared DashboardSidebar)
export default function AdminSidebar() {
  return (
    <DashboardSidebar nav={adminNav} homeHref="/admin" roleLabel="Admin" roleIcon={ShieldCheck} />
  );
}
