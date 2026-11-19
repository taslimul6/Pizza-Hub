"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import GoogleButton from "../shared/GoogleButton";

// Account types the user can pick
const accountTypes = [
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Restaurant" },
  { value: "admin", label: "Admin" },
];

// Shared style for all text inputs
const inputClass =
  "h-12 w-full rounded-full border border-border px-5 outline-none focus:border-focus";

// Sign up form: checks the fields, then creates the account with Better Auth.
export default function SignUpForm() {
  const router = useRouter();

  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    // Simple checks before calling the server
    if (name.trim() === "") {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms and Privacy Policy.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await authClient.signUp.email({
      name: name.trim(),
      email,
      password,
      role,
    });
    setLoading(false);

    if (signUpError) {
      const message = signUpError.message || "Could not create your account.";
      setError(message);
      toast.error(message);
      return;
    }

    // Account created and signed in: show a message, go to the home page
    toast.success("Sign up successful! Welcome to PizzaHub.");
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {/* Account type */}
      <fieldset>
        <legend className="mb-1.5 font-bold">I am a...</legend>
        <div className="grid gap-3 min-[440px]:grid-cols-3">
          {accountTypes.map((type) => (
            <label
              key={type.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-full border border-border px-4 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary-100"
            >
              <input
                type="radio"
                name="role"
                value={type.value}
                checked={role === type.value}
                onChange={() => setRole(type.value)}
                className="accent-primary"
              />
              <strong>{type.label}</strong>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Full name */}
      <div>
        <label htmlFor="name" className="mb-1.5 block font-bold">
          Full name
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Maya Rahman"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block font-bold">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Password + confirm (side by side on larger screens) */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="mb-1.5 block font-bold">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1.5 block font-bold">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 size-4 accent-primary"
        />
        <span>
          I agree to the{" "}
          <Link href="#" className="font-bold text-primary-600 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="font-bold text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>

      {/* Error message */}
      {error !== "" && (
        <p role="alert" className="text-sm font-bold text-primary-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary px-6 py-3.5 text-lg font-bold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton label="Sign up with Google" role={role} />
    </form>
  );
}
