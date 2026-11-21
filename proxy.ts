import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getRoleHome, isRole } from "@/lib/roles";
import { safeNext } from "@/lib/safe-next";
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

// Item details (/menu/<id>) are private: only logged-in users may open them.
// The Browse Menu page (/menu) itself stays public.
const isItemPage = (pathname: string) => pathname.startsWith("/menu/");

// Sends a guest to /signin and remembers where they wanted to go (?next=...)
function toSignIn(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const url = new URL("/signin", request.url);
  url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

// Runs before the dashboard pages, the item pages and the sign in / sign up pages:
// 1. Not logged in + dashboard or item page -> /signin?next=<that page>
// 2. Logged in + someone else's area        -> redirect to their own area
//    (only admins open /admin, only vendors /vendor, only customers /customer)
// 3. Logged in + item page                  -> allowed (every role)
// 4. Logged in + /signin or /signup         -> to ?next=... or their own area
//    (this also finishes the Google login, which comes back to /signin)
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({ headers: request.headers });
  const areaOwner = getAreaRole(pathname);

  // 1. Guests cannot open dashboards or item pages
  if (!session) {
    if (areaOwner || isItemPage(pathname)) return toSignIn(request);
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

  // 3. Any logged-in user may open an item page
  if (isItemPage(pathname)) return NextResponse.next();

  // 4. Logged-in users have no reason to see the sign in / sign up pages
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  return NextResponse.redirect(new URL(next ?? getRoleHome(role), request.url));
}

// Only these pages go through the proxy
export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/menu/:id",
    "/customer/:path*",
    "/vendor/:path*",
    "/admin/:path*",
  ],
};
