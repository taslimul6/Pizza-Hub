"use client"; // needed because we use useState (interactive component)

import Link from "next/link";
import { useState } from "react";

// The three roles a logged-in user can have
type Role = "customer" | "vendor" | "admin";

// Props: pass a user to show the logged-in navbar, or nothing for a guest
type NavbarProps = {
  user?: { name: string; role: Role } | null;
  onLogout?: () => void;
};

// Links everyone sees
const commonLinks = [
  { href: "/", label: "Home" },
  { href: "/#menu", label: "Browse Menu" },
];

// Extra links for each role
const roleLinks = {
  customer: [
    { href: "/orders", label: "My Orders" },
    { href: "/cart", label: "Cart" },
  ],
  vendor: [
    { href: "/vendor/restaurant", label: "My Restaurant" },
    { href: "/vendor/menu", label: "Manage Menu" },
    { href: "/vendor/orders", label: "Incoming Orders" },
  ],
  admin: [
    { href: "/admin/users", label: "Manage Users" },
    { href: "/admin/menu-review", label: "Review Menu Items" },
    { href: "/admin/transactions", label: "Transactions" },
  ],
};

export default function Navbar({ user = null, onLogout }: NavbarProps) {
  // State 1: is the mobile menu open?
  const [menuOpen, setMenuOpen] = useState(false);
  // State 2: is the profile dropdown open?
  const [profileOpen, setProfileOpen] = useState(false);

  // Guests get common links; logged-in users also get links for their role
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
                  className="rounded-full px-3.5 py-2 font-medium hover:bg-sand-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            // Logged in: profile button + dropdown (desktop only)
            <div className="relative hidden lg:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="rounded-full border-2 border-border bg-white px-4 py-2 text-sm font-bold hover:border-primary"
              >
                {user.name.split(" ")[0]} ▾
              </button>

              {/* Only show the dropdown when profileOpen is true */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-white p-2 shadow-warm-xl">
                  <p className="px-3 py-2 text-sm text-muted">{user.role}</p>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 hover:bg-sand-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 hover:bg-sand-100"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout?.();
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-error hover:bg-sand-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Guest: Sign In / Sign Up buttons (desktop only)
            <div className="hidden gap-2 lg:flex">
              <Link
                href="/signin"
                className="rounded-full px-5 py-2.5 font-bold hover:bg-sand-100"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary px-5 py-2.5 font-bold text-white hover:bg-primary-600"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Hamburger button (mobile only) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="rounded-xl px-3 py-2 text-2xl hover:bg-sand-100 lg:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu: only shown when menuOpen is true */}
      {menuOpen && (
        <nav className="border-t border-border bg-light p-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 font-medium hover:bg-sand-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid gap-2">
            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
                className="rounded-full border-2 border-dark px-5 py-2.5 font-bold"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-primary px-5 py-2.5 text-center font-bold text-white"
                >
                  Sign Up
                </Link>
                <Link
                  href="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border-2 border-dark px-5 py-2.5 text-center font-bold"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
