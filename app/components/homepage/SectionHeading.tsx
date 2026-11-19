// Reusable heading block used at the top of most home page sections:
// small colored label (eyebrow), big title and an optional sentence below.

import type { SectionHeadingProps } from "@/types";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p
        className={`text-sm font-bold uppercase tracking-widest ${
          light ? "text-accent" : "text-primary"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-lg ${
            light ? "text-white/80" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
