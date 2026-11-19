import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Benefit } from "@/types";
import SectionHeading from "./SectionHeading";

// Reasons for restaurants to join
const benefits: Benefit[] = [
  { icon: "👥", title: "Reach more customers", text: "Get discovered by hungry locals searching nearby." },
  { icon: "🛎️", title: "Easy order dashboard", text: "Accept, prepare and track orders in one place." },
  { icon: "🍴", title: "Publish menus instantly", text: "Add pizzas, sides and drinks — update any time." },
  { icon: "💰", title: "Fast weekly payouts", text: "Transparent fees and no hidden charges." },
];

export default function VendorCta() {
  return (
    <section id="partner" className="bg-dark px-4 py-16 text-white sm:px-6 lg:py-24">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
        {/* Left: text, benefits, buttons */}
        <div>
          <SectionHeading
            light
            eyebrow="For restaurants"
            title="Grow your pizza business with PizzaHub"
            subtitle="Join over 1,200 local pizzerias reaching new customers every day. Set up your profile in minutes and start taking orders this week."
          />

          <ul className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-xl">
                  {benefit.icon}
                </span>
                <div>
                  <strong className="block">{benefit.title}</strong>
                  <span className="text-sm text-white/70">{benefit.text}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className={buttonVariants({ variant: "accent", size: "lg" })}
            >
              Register your restaurant
            </Link>
            <Link
              href="/partners"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-white/60 text-white hover:bg-white hover:text-dark",
              })}
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Right: picture area with two small stat cards */}
        <div className="relative grid h-80 place-items-center rounded-[2rem] bg-secondary text-8xl sm:h-96">
          👩‍🍳
          <Card className="absolute left-4 top-6 gap-0 rounded-2xl px-4 py-2 text-dark shadow-warm-xl ring-0">
            <strong className="block text-xl">+38%</strong>
            <span className="text-sm text-muted-foreground">
              Avg. order growth
            </span>
          </Card>
          <Card className="absolute bottom-6 right-4 gap-0 rounded-2xl px-4 py-2 text-dark shadow-warm-xl ring-0">
            <strong className="block text-xl">48</strong>
            <span className="text-sm text-muted-foreground">Orders today</span>
          </Card>
        </div>
      </div>
    </section>
  );
}
