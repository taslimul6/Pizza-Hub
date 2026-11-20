import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import AdminOverview from "@/app/components/admin/AdminOverview";
import SectionHeading from "@/app/components/homepage/SectionHeading";
import { getObject } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { AdminStats } from "@/types";

export const metadata: Metadata = {
  title: "Admin Dashboard | PizzaHub",
};

// Loads the numbers for the overview cards from the API (GET /stats)
async function Overview() {
  // The proxy already keeps non-admins out; this is only a safety net
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return null;

  const data = await getObject<AdminStats>("/stats", { auth: true });

  if (!data) {
    return (
      <p className="rounded-3xl border border-border bg-white p-10 text-center text-muted-foreground">
        The numbers could not be loaded right now. Please try again soon.
      </p>
    );
  }

  return <AdminOverview data={data} />;
}

// Admin only (the proxy redirects everyone else)
export default function AdminPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Admin"
          title="Admin dashboard"
          subtitle="A quick look at users, menu items and transactions across PizzaHub."
        />
        <Suspense
          fallback={
            <ul
              role="status"
              aria-label="Loading overview"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="h-36 animate-pulse rounded-3xl bg-muted" />
              ))}
            </ul>
          }
        >
          <Overview />
        </Suspense>
      </div>
    </main>
  );
}
