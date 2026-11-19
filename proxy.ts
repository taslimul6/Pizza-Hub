import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getRoleHome, isRole } from "@/lib/roles";
import type { Role } from "@/types";

// Each dashboard area belongs to exactly one role.
const areaRole: Record<string, Role> = {
  "/customer": "customer",
  "/vendor": "vendor",
  "/admin": "admin",
};

// Returns the role that owns this path, or null if it is not a dashboard area
// (e.g. "/admin/users" belongs to "admin").
function getAreaRole(pathname: string): Role | null {
  for (const area in areaRole) {
    if (pathname === area || pathname.startsWith(`${area}/`)) {
      return areaRole[area];
    }
  }
  return null;
}

// Runs before the dashboard pages and the sign in / sign up pages:
// 1. Not logged in + dashboard page   -> redirect to /signin
// 2. Logged in + someone else's area  -> redirect to their own area
//    (only admins open /admin, only vendors /vendor, only customers /customer)
// 3. Logged in + /signin or /signup   -> redirect to their own area
//    (this also finishes the Google login, which comes back to /signin)
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({ headers: request.headers });
  const areaOwner = getAreaRole(pathname);

  // 1. Guests cannot open any dashboard page
  if (!session) {
    if (areaOwner) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next(); // guests may see /signin and /signup
  }

  const role = isRole(session.user.role) ? session.user.role : "customer";

  // 2. Logged-in users may only open the area of their own role
  if (areaOwner) {
    if (areaOwner !== role) {
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }
    return NextResponse.next();
  }

  // 3. Logged-in users have no reason to see the sign in / sign up pages
  return NextResponse.redirect(new URL(getRoleHome(role), request.url));
}

// Only these pages go through the proxy
export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/customer/:path*",
    "/vendor/:path*",
    "/admin/:path*",
  ],
};
