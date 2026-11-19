import { Card } from "@/components/ui/card";
import type { Step } from "@/types";
import SectionHeading from "./SectionHeading";

// The three steps shown in the cards
const steps: Step[] = [
  {
    number: "01",
    icon: "📍",
    title: "Discover shops",
    text: "Enter your address and see the best-rated pizzerias nearby — open now, with live delivery times.",
    color: "bg-primary",
  },
  {
    number: "02",
    icon: "🍕",
    title: "Choose your pizza",
    text: "Browse full menus, customize toppings, add sides and drinks, and check out in a few taps.",
    color: "bg-secondary",
  },
  {
    number: "03",
    icon: "🛵",
    title: "Fast delivery",
    text: "Your pizza leaves the oven and heads straight to you. Track every step on the live map.",
    color: "bg-accent",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-white px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          center
          eyebrow="How it works"
          title="From craving to doorstep in three steps"
          subtitle="No phone calls, no guesswork — just great local pizza, one tap away."
        />

        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number}>
              <Card className="relative h-full gap-0 rounded-3xl border border-border bg-light p-8 text-center text-base ring-0 transition-transform hover:-translate-y-1.5">
                {/* Big faded number in the corner */}
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-3 font-display text-4xl font-black text-border"
                >
                  {step.number}
                </span>
                <div
                  className={`mx-auto mb-5 grid size-20 -rotate-6 place-items-center rounded-3xl text-3xl ${step.color}`}
                >
                  {step.icon}
                </div>
                <h3 className="font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.text}</p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
