import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import type { FooterColumn } from "@/types";

// Footer link columns. Pages that don't exist yet point to "#".
const columns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "For Customers",
    links: [
      { label: "Browse menu", href: "/menu" },
      { label: "Track an order", href: "#" },
      { label: "Gift cards", href: "#" },
      { label: "Offers & coupons", href: "/#offers" },
    ],
  },
  {
    title: "For Restaurants",
    links: [
      { label: "Partner with us", href: "/#partner" },
      { label: "Vendor login", href: "#" },
      { label: "Resources", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Contact us", href: "#" },
      { label: "Food safety", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-dark px-4 pb-6 pt-14 text-white sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display text-2xl font-black">
              Pizza<span className="text-accent">Hub</span>
            </Link>
            <p className="mt-3 max-w-xs text-white/70">
              PizzaHub connects hungry neighbors with the best local pizzerias —
              hot, fresh and delivered fast. Made with love and plenty of
              mozzarella.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h6 className="font-bold">{column.title}</h6>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <Separator className="mt-12 bg-white/15" />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-sm text-white/70">
          <p>© 2026 PizzaHub, Inc. All rights reserved.</p>
          <ul className="flex gap-5">
            <li><Link href="#" className="hover:text-white">Privacy</Link></li>
            <li><Link href="#" className="hover:text-white">Terms</Link></li>
            <li><Link href="#" className="hover:text-white">Cookies</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
