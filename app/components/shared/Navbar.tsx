"use client"; // needed because the navbar reads the login session and has menus

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { getRoleHome, isRole } from "@/lib/roles";
import ThemeToggle from "./ThemeToggle";
import type { NavbarUser, NavLink, Role } from "@/types";

// Links everyone sees
const commonLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
];

// Extra links for each role
const roleLinks: Record<Role, NavLink[]> = {
  customer: [], // customer pages are in the customer sidebar (app/components/customer/customer-nav.ts)
  vendor: [], // vendor pages are in the vendor sidebar (app/components/vendor/vendor-nav.ts)
  admin: [], // admin pages are in the admin sidebar (app/components/admin/admin-nav.ts)
};

export default function Navbar() {
  const router = useRouter();

  // Is the mobile menu (sheet) open?
  const [menuOpen, setMenuOpen] = useState(false);

  // Current login session (comes from Better Auth, updates by itself)
  const { data: session, isPending } = authClient.useSession();
  const user: NavbarUser | null = session
    ? {
        name: session.user.name,
        role: isRole(session.user.role) ? session.user.role : "customer",
        image: session.user.image ?? null,
      }
    : null;

  // Sign out, then go back to the home page
  async function onLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  // Guests get common links; logged-in users also get links for their role.
  // Every role only gets Home and Browse Menu: their pages live in their panel's sidebar.
  const links = user ? [...commonLinks, ...roleLinks[user.role]] : commonLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-light/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl font-black">
          Pizza<span className="text-primary">Hub</span>
        </Link>

        {/* Links (desktop only) */}
        <nav className="hidden flex-1 lg:block">
          <ul className="flex gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "h-10 px-3.5 text-base font-medium",
                  })}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Light / dark mode (all screen sizes) */}
          <ThemeToggle />
          {isPending ? null : user ? (
            // Logged in: profile button + dropdown (desktop only)
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "hidden h-10 border-2 border-border bg-white px-4 text-foreground hover:border-primary hover:bg-white hover:text-foreground lg:inline-flex",
                })}
              >
                {/* Profile photo, or the first letter of the name */}
                <span className="grid size-7 place-items-center overflow-hidden rounded-full bg-dark text-xs font-bold text-cream">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt="" className="size-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
                {user.name.split(" ")[0]} ▾
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2 text-sm capitalize">
                    {user.name} · {user.role}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href={getRoleHome(user.role)} />}
                  className="rounded-lg px-3 py-2 text-base focus:bg-muted focus:text-foreground"
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link href="/settings" />}
                  className="rounded-lg px-3 py-2 text-base focus:bg-muted focus:text-foreground"
                >
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onLogout}
                  className="rounded-lg px-3 py-2 text-base"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Guest: Sign In / Sign Up buttons (desktop only)
            <div className="hidden gap-2 lg:flex">
              <Link
                href="/signin"
                className={buttonVariants({ variant: "ghost" })}
              >
                Sign In
              </Link>
              <Link href="/signup" className={buttonVariants()}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Hamburger button + mobile menu (mobile only) */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle menu"
                  className="text-2xl lg:hidden"
                />
              }
            >
              ☰
            </SheetTrigger>
            <SheetContent side="right" className="bg-light p-4">
              <SheetHeader className="p-0">
                <SheetTitle className="font-display text-2xl font-black">
                  Pizza<span className="text-primary">Hub</span>
                </SheetTitle>
              </SheetHeader>

              <nav>
                <ul className="flex flex-col gap-1">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={buttonVariants({
                          variant: "ghost",
                          className:
                            "h-12 w-full justify-start rounded-xl px-4 font-medium",
                        })}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-2 grid gap-2">
                {isPending ? null : user ? (
                  <>
                    <p className="px-4 py-2 text-center text-sm capitalize text-muted-foreground">
                      {user.name} · {user.role}
                    </p>
                    {/* Same as "Dashboard" in the desktop profile menu (admins reach their panel here) */}
                    <Link
                      href={getRoleHome(user.role)}
                      onClick={() => setMenuOpen(false)}
                      className={buttonVariants()}
                    >
                      {user.role === "admin" ? "Admin panel" : user.role === "vendor" ? "Vendor panel" : "My dashboard"}
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout();
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      onClick={() => setMenuOpen(false)}
                      className={buttonVariants()}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/signin"
                      onClick={() => setMenuOpen(false)}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
