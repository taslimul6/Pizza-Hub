"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

// Error page: shown when something crashes while a page is loading.
// "Try again" re-renders the page without reloading the whole site.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center px-4 py-16 sm:px-6">
      <section className="mx-auto w-full max-w-[560px] rounded-[2rem] border border-border bg-white p-8 text-center shadow-warm-xl sm:p-12">
        <div
          aria-hidden="true"
          className="mx-auto grid size-28 place-items-center rounded-full bg-primary-100 text-6xl"
        >
          🔥
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Something went wrong
        </p>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">
          We burnt this one
        </h1>
        <p className="mt-3 text-muted-foreground">
          An unexpected error happened while loading this page. Please try again. If it keeps
          happening, come back in a few minutes.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
