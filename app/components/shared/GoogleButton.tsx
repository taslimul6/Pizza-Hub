"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type GoogleButtonProps = {
  label: string; // Button text, e.g. "Sign in with Google"
  role?: string; // Account type for brand-new users (signup page only)
};

// Google login / signup button. Google handles both: if the email is new an
// account is created, if it already exists the user is just signed in.
export default function GoogleButton({ label, role }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    const { error: googleError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      // Only sent on the signup page; new users get "customer" otherwise
      ...(role ? { additionalData: { role } } : {}),
    });
    // On success the browser leaves for Google, so we only get here on error
    if (googleError) {
      setLoading(false);
      setError(googleError.message || "Could not continue with Google.");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-border px-6 py-3 font-bold hover:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* Google "G" logo */}
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
          <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
        {loading ? "Redirecting..." : label}
      </button>
      {error !== "" && (
        <p role="alert" className="mt-2 text-sm font-bold text-primary-600">
          {error}
        </p>
      )}
    </div>
  );
}
