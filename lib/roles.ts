import type { Role } from "@/types";

// Home page for each role. Used to send users to the right place after
// they sign in or sign up.
const roleHome: Record<Role, string> = {
  customer: "/customer",
  vendor: "/vendor",
  admin: "/admin",
};

// True when the text is one of our three roles
export function isRole(role: unknown): role is Role {
  return typeof role === "string" && role in roleHome;
}

// Unknown or missing roles fall back to the customer page
export function getRoleHome(role?: string | null): string {
  return isRole(role) ? roleHome[role] : roleHome.customer;
}
