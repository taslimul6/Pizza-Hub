import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Pizza } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found | PizzaHub",
};

// Custom 404 page: shown for any address that does not exist
export default function NotFound() {
  return (
    <main className="flex flex-1 items-center bg-[radial-gradient(800px_460px_at_88%_18%,#ffe7b0,transparent_62%),radial-gradient(640px_380px_at_-4%_100%,#fddcd3,transparent_62%)] dark:bg-none px-4 py-16 sm:px-6">
      <section className="mx-auto w-full max-w-[560px] rounded-[2rem] border border-border bg-white p-8 text-center shadow-warm-xl sm:p-12">
        <div
          aria-hidden="true"
          className="mx-auto grid size-28 place-items-center rounded-full bg-accent/90 text-6xl"
        >
          🍕
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">Error 404</p>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">
          This slice is missing
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you are looking for does not exist or may have been moved. Let&apos;s get you
          back to something delicious.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link href="/menu" className={buttonVariants({ variant: "outline", size: "lg" })}>
            <Pizza className="size-4" aria-hidden="true" />
            Browse menu
          </Link>
        </div>
      </section>
    </main>
  );
}
