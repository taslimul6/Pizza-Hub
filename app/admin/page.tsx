import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | PizzaHub",
};

// Admin page - blank for now.
export default function AdminPage() {
  return (
    <main className="flex-1 px-4 py-10">
      <h1 className="font-display text-3xl font-black">Admin</h1>
    </main>
  );
}
