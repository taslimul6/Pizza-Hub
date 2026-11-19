import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Runs before /signin and /signup are rendered.
// If the user is already logged in, send them to the home page instead.
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Only these pages go through the proxy
export const config = {
  matcher: ["/signin", "/signup"],
};
