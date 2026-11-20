"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { AdminUser } from "@/types";

const roleFilters = [
  { value: "all", label: "All roles" },
  { value: "customer", label: "Customers" },
  { value: "vendor", label: "Vendors" },
  { value: "admin", label: "Admins" },
];

const roleVariant: Record<string, "accent" | "secondary" | "dark"> = {
  customer: "accent",
  vendor: "secondary",
  admin: "dark",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" });
}

// All users with search, role filter, details popup and block / unblock.
// Changes are saved through /api/users/:id and then the list is reloaded.
export default function UsersList({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [viewing, setViewing] = useState<AdminUser | null>(null);
  // User waiting for the "Block this user?" confirmation
  const [blocking, setBlocking] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);

  const text = search.trim().toLowerCase();
  const visible = users.filter(
    (user) =>
      (role === "all" || user.role === role) &&
      (user.name.toLowerCase().includes(text) ||
        user.email.toLowerCase().includes(text)),
  );

  async function setBlocked(user: AdminUser, blocked: boolean) {
    setBusy(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: blocked }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Could not update the user");
        return false;
      }

      toast.success(blocked ? `${user.name} is blocked` : `${user.name} is unblocked`);
      router.refresh();
      return true;
    } catch {
      toast.error("Network error. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function confirmBlock() {
    if (!blocking) return;
    const ok = await setBlocked(blocking, true);
    if (ok) setBlocking(null);
  }

  // Admins (and yourself) cannot be blocked
  const canBlock = (user: AdminUser) =>
    user.role !== "admin" && user.id !== currentUserId;

  return (
    <>
      {/* Search + role filter */}
      <div className="mb-6 grid gap-3 sm:grid-cols-[2fr_1fr]">
        <Input
          type="search"
          placeholder="Search by name or email…"
          aria-label="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Filter by role"
          className="h-12 w-full rounded-full border border-input bg-white px-5 text-base outline-none focus-visible:border-ring"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {roleFilters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {visible.length} of {users.length} {users.length === 1 ? "user" : "users"}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-border bg-white p-10 text-center">
          <p className="text-5xl">👥</p>
          <h2 className="mt-3 font-display text-xl font-bold">No users found</h2>
          <p className="mt-1 text-muted-foreground">
            Try a different search or role.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {visible.map((user) => (
            <li
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-white p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-bold">{user.name}</h2>
                  <Badge variant={roleVariant[user.role] ?? "muted"} className="capitalize">
                    {user.role}
                  </Badge>
                  <Badge variant={user.isBlocked ? "destructive" : "muted"}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {user.email} · Joined {formatDate(user.createdAt)}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewing(user)}>
                  View details
                </Button>
                {canBlock(user) &&
                  (user.isBlocked ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busy}
                      onClick={() => setBlocked(user, false)}
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={busy}
                      onClick={() => setBlocking(user)}
                    >
                      Block
                    </Button>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Details popup */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.name}</DialogTitle>
                <DialogDescription>{viewing.email}</DialogDescription>
              </DialogHeader>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="font-bold capitalize">{viewing.role}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Account</dt>
                  <dd className="font-bold">{viewing.isBlocked ? "Blocked" : "Active"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email verified</dt>
                  <dd className="font-bold">{viewing.emailVerified ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Joined</dt>
                  <dd className="font-bold">{formatDate(viewing.createdAt)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">User ID</dt>
                  <dd className="break-all font-mono text-xs">{viewing.id}</dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Block confirm popup */}
      <Dialog open={!!blocking} onOpenChange={(open) => !open && setBlocking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block this user?</DialogTitle>
            <DialogDescription>
              {blocking?.name} will be logged out and will not be able to log in
              or use PizzaHub until you unblock them.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setBlocking(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmBlock} disabled={busy}>
              {busy ? "Blocking…" : "Yes, block"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
