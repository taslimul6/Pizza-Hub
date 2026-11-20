import { Card } from "@/components/ui/card";
import type { Feature } from "@/types";
import SectionHeading from "./SectionHeading";

// The reasons shown in the cards
const features: Feature[] = [
  {
    icon: "🔥",
    title: "Fresh from the oven",
    text: "Every pizza is made to order by local shops, so it reaches you hot, never sitting under a lamp.",
    color: "bg-primary/15",
  },
  {
    icon: "⚡",
    title: "Fast delivery",
    text: "Short distances and live tracking mean most orders arrive in under 30 minutes.",
    color: "bg-accent/40",
  },
  {
    icon: "🌿",
    title: "Quality ingredients",
    text: "Real mozzarella, hand-stretched dough and fresh basil. Shops on PizzaHub are vetted for quality.",
    color: "bg-secondary/15",
  },
  {
    icon: "💳",
    title: "Easy, secure checkout",
    text: "Pay by card or cash in a few taps. Your details stay safe, and prices are clear before you order.",
    color: "bg-accent/40",
  },
  {
    icon: "🏪",
    title: "Support local shops",
    text: "Your order goes straight to neighborhood pizzerias, helping family-run kitchens grow.",
    color: "bg-primary/15",
  },
  {
    icon: "⭐",
    title: "Honest reviews",
    text: "Ratings come from real customers who ordered, so you always pick with confidence.",
    color: "bg-secondary/15",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          center
          eyebrow="Why choose us"
          title="Why Choose PizzaHub?"
          subtitle="We make ordering pizza simple, fast and delicious, for you and for the shops you love."
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title}>
              <Card className="h-full gap-0 rounded-3xl border border-border bg-white p-8 text-base ring-0 transition-shadow hover:shadow-warm-md">
                <div
                  className={`mb-5 grid size-16 place-items-center rounded-2xl text-3xl ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-bold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{feature.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
