import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";
import AddMenuItemForm from "@/app/components/vendor/AddMenuItemForm";
import { redirect } from "next/navigation";
import { getList, getObject } from "@/lib/api";
import type { VendorSubscription } from "@/types";

export const metadata: Metadata = {
  title: "Add Menu Item | PizzaHub",
};

// Loads the category list for the dropdown.
// A Free vendor who already has 3 items cannot create more: they go to the
// subscription page, which shows a toast about the limit.
async function Form() {
  const [plan, categories] = await Promise.all([
    getObject<VendorSubscription>("/subscription", { auth: true }),
    getList<string>("/category"),
  ]);
  if (plan && plan.itemLimit !== null && plan.totalItems >= plan.itemLimit) {
    redirect("/vendor/subscription?limit=reached");
  }

  return <AddMenuItemForm categories={categories} />;
}

// Vendor only (the proxy redirects everyone else)
export default function AddMenuPage() {
  return (
    <div className="max-w-[720px]">
      <DashboardPageHeader
        eyebrow="Vendor"
        title="Add a menu item"
        description="Fill in the details and upload a photo. An admin will review it before it goes live."
      />
        <Suspense
          fallback={
            <div
              role="status"
              aria-label="Loading form"
              className="h-96 animate-pulse rounded-3xl bg-muted"
            />
          }
        >
          <Form />
        </Suspense>
    </div>
  );
}
