import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import UsersList from "@/app/components/admin/UsersList";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { getList } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { AdminUser } from "@/types";

export const metadata: Metadata = {
  title: "Manage Users | PizzaHub",
};

// A user as the API sends it (only the fields we use)
type ApiUser = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  isBlocked?: boolean;
  emailVerified?: boolean;
  image?: string;
  createdAt: string;
};

// Loads every user from the API
async function Users() {
  // The proxy already keeps non-admins out; this is only a safety net
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return null;

  const raw = await getList<ApiUser>("/users", { auth: true });

  const users: AdminUser[] = raw.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role ?? "customer",
    isBlocked: user.isBlocked === true,
    emailVerified: user.emailVerified === true,
    image: user.image,
    createdAt: user.createdAt,
  }));

  return <UsersList users={users} currentUserId={session.user.id} />;
}

// Admin only (the proxy redirects everyone else)
export default function ManageUsersPage() {
  return (
    <>
      <AdminPageHeader
        title="Manage users"
        description="Search, view and block or unblock the people on PizzaHub."
      />
        <Suspense
          fallback={
            <div role="status" aria-label="Loading users" className="grid gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-3xl bg-muted" />
              ))}
            </div>
          }
        >
          <Users />
        </Suspense>
    </>
  );
}
