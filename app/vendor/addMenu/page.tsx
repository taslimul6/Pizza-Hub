import type { Metadata } from "next";
import { Suspense } from "react";
import SectionHeading from "@/app/components/homepage/SectionHeading";
import AddMenuItemForm from "@/app/components/vendor/AddMenuItemForm";
import { getList } from "@/lib/api";

export const metadata: Metadata = {
  title: "Add Menu Item | PizzaHub",
};

// Loads the category list for the dropdown
async function Form() {
  const categories = await getList<string>("/category");
  return <AddMenuItemForm categories={categories} />;
}

// Vendor only (the proxy redirects everyone else)
export default function AddMenuPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-[720px]">
        <SectionHeading
          eyebrow="Vendor"
          title="Add a menu item"
          subtitle="Fill in the details and upload a photo. An admin will review it before it goes live."
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
    </main>
  );
}
