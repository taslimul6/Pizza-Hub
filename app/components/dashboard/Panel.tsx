import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// White card with a title and an optional "View all"-style link
export default function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:underline"
          >
            {action.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
