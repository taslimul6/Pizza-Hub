import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export type Kpi = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  tint: string; // icon chip colors, e.g. "bg-primary-100 text-primary"
  href: string;
};

// One number card on a dashboard. The whole card is a link.
export default function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.icon;
  return (
    <Link
      href={kpi.href}
      className="group flex h-full flex-col rounded-3xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-warm-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-muted-foreground">{kpi.label}</p>
        <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${kpi.tint}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight tabular-nums">{kpi.value}</p>
      <p className="mt-auto flex items-center justify-between gap-2 pt-4 text-sm text-muted-foreground">
        <span className="truncate">{kpi.sub}</span>
        <ArrowRight
          className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </p>
    </Link>
  );
}
