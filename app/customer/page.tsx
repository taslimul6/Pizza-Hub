import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer | PizzaHub",
};

// Customer page - blank for now.
export default function CustomerPage() {
  return (
    <main className="flex-1 px-4 py-10">
      <h1 className="font-display text-3xl font-black">Customer</h1>
    </main>
  );
}
