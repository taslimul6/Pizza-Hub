import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import AdminSignUpForm from "@/app/components/auth/AdminSignUpForm";

export const metadata: Metadata = {
  title: "Admin Sign Up | PizzaHub",
  // keep this page out of search engines
  robots: { index: false, follow: false },
};

// Admin sign up (/auth/admin). Not linked anywhere on the site.
// It needs the secret admin key, so admins cannot be created through public sign up.
export default function AdminSignUpPage() {
  return (
    <main className="flex flex-1 items-center bg-[radial-gradient(800px_460px_at_88%_18%,#ffe7b0,transparent_62%),radial-gradient(640px_380px_at_-4%_100%,#fddcd3,transparent_62%)] dark:bg-none px-4 py-10 sm:px-6 lg:py-16">
      <section className="mx-auto w-full max-w-[480px] rounded-[2rem] border border-border bg-white p-6 shadow-warm-xl sm:p-10">
        <span className="grid size-12 place-items-center rounded-2xl bg-dark text-cream">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-black tracking-tight">
          Create an admin account
        </h1>
        <p className="mt-2 text-muted-foreground">
          You need the secret admin key to continue.
        </p>

        <AdminSignUpForm />

        <p className="mt-6 text-center text-muted-foreground">
          Not an admin?{" "}
          <Link href="/signup" className="font-bold text-primary-600 hover:underline">
            Normal sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
