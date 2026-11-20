import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// Shown when the item id in /menu/[id] does not exist
export default function ItemNotFound() {
  return (
    <main className="flex-1 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-white p-10 text-center">
        <p className="text-6xl">🍕</p>
        <h1 className="mt-4 font-display text-3xl font-black">Item not found</h1>
        <p className="mt-2 text-muted-foreground">
          We could not find the item you are looking for. The link may be wrong
          or the item may have been removed.
        </p>
        <Link href="/menu" className={`${buttonVariants()} mt-6`}>
          Back to menu
        </Link>
      </div>
    </main>
  );
}
