import { Ban, CheckCircle2, ChefHat, ClipboardList, PackageCheck, XCircle, type LucideIcon } from "lucide-react";
import type { OrderStatusStep } from "@/types";

type Step = {
  status: string;
  title: string;
  text: string;
  icon: LucideIcon;
  tone: "done" | "current" | "todo" | "stopped";
  at: string | null;
};

function formatWhen(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

// Builds the steps to show from the current status and the saved history.
// Normal path: Placed -> Accepted -> Delivered. Rejected or cancelled stop it.
function buildSteps(current: string, history: OrderStatusStep[]): Step[] {
  const when = (status: string) => history.find((h) => h.status === status)?.at ?? null;
  const placed: Step = {
    status: "pending",
    title: "Order placed",
    text: "The restaurant has your order.",
    icon: ClipboardList,
    tone: current === "pending" ? "current" : "done",
    at: when("pending"),
  };

  if (current === "rejected") {
    return [
      { ...placed, tone: "done" },
      { status: "rejected", title: "Rejected by the restaurant", text: "They could not take this order. You were not charged.", icon: XCircle, tone: "stopped", at: when("rejected") },
    ];
  }
  if (current === "cancelled") {
    return [
      { ...placed, tone: "done" },
      { status: "cancelled", title: "Cancelled by you", text: "This order was cancelled before the restaurant accepted it.", icon: Ban, tone: "stopped", at: when("cancelled") },
    ];
  }

  return [
    placed,
    {
      status: "accepted",
      title: "Accepted, being prepared",
      text: "The kitchen is making your order.",
      icon: ChefHat,
      tone: current === "accepted" ? "current" : current === "completed" ? "done" : "todo",
      at: when("accepted"),
    },
    {
      status: "completed",
      title: "Delivered",
      text: "Enjoy your meal!",
      icon: PackageCheck,
      tone: current === "completed" ? "done" : "todo",
      at: when("completed"),
    },
  ];
}

const toneStyles: Record<Step["tone"], { dot: string; title: string }> = {
  done: { dot: "bg-secondary text-secondary-foreground", title: "text-foreground" },
  current: { dot: "bg-primary text-primary-foreground ring-4 ring-primary-100", title: "text-foreground" },
  todo: { dot: "bg-muted text-muted-foreground", title: "text-muted-foreground" },
  stopped: { dot: "bg-destructive text-cream", title: "text-foreground" },
};

// Vertical order status timeline (order details page)
export default function OrderTimeline({
  status,
  history,
}: {
  status: string;
  history: OrderStatusStep[];
}) {
  const steps = buildSteps(status, history);

  return (
    <ol className="relative space-y-6" aria-label="Order status timeline">
      {steps.map((step, index) => {
        const Icon = step.tone === "done" && step.status !== "pending" ? CheckCircle2 : step.icon;
        const style = toneStyles[step.tone];
        const last = index === steps.length - 1;
        return (
          <li key={step.status} className="relative flex gap-4">
            {/* Line to the next step */}
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute top-11 left-5 h-[calc(100%-1.75rem)] w-0.5 -translate-x-1/2 ${
                  step.tone === "done" ? "bg-secondary" : "bg-border"
                }`}
              />
            )}
            <span className={`relative grid size-10 shrink-0 place-items-center rounded-full ${style.dot}`}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="pt-1.5">
              <p className={`font-bold ${style.title}`}>
                {step.title}
                {step.tone === "current" && <span className="sr-only"> (current step)</span>}
              </p>
              <p className="text-sm text-muted-foreground">{step.text}</p>
              {formatWhen(step.at) && (
                <p className="mt-0.5 text-xs text-muted-foreground">{formatWhen(step.at)}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
