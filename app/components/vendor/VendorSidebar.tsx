"use client";

import { Sparkles, Store } from "lucide-react";
import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";
import { authClient } from "@/lib/auth-client";
import { vendorNav } from "./vendor-nav";

// Vendor panel sidebar. Shows a Premium badge while the vendor's plan is active.
export default function VendorSidebar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const premium =
    user?.subscriptionPlan === "premium" &&
    !!user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date();

  return (
    <DashboardSidebar
      nav={vendorNav}
      homeHref="/vendor"
      roleLabel="Vendor"
      roleIcon={Store}
      extraBadge={
        premium ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-dark px-2.5 py-0.5 text-xs font-bold text-light">
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            Premium
          </span>
        ) : null
      }
    />
  );
}
