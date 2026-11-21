import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// Dark banner at the top of a dashboard for something that needs action now
export default function AttentionBanner({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-dark p-6 text-cream sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-primary/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 left-1/3 size-56 rounded-full bg-accent/25 blur-3xl"
      />
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-2xl font-black">{title}</p>
            <p className="mt-1 text-cream/70">{text}</p>
          </div>
        </div>
        <Link href={action.href} className={buttonVariants({ variant: "accent", size: "lg" })}>
          {action.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
