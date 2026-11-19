import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor | PizzaHub",
};

// Vendor page - blank for now.
export default function VendorPage() {
  return (
    <main className="flex-1 px-4 py-10">
      <h1 className="font-display text-3xl font-black">Vendor</h1>
    </main>
  );
}
