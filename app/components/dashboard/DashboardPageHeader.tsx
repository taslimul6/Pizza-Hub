import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
  eyebrow: string; // "Admin", "Vendor"
  title: string;
  description?: string;
  actions?: ReactNode; // buttons on the right
};

// Compact page title for the admin and vendor panels
export default function DashboardPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: DashboardPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
