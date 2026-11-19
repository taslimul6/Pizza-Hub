"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authClient } from "@/lib/auth-client";
import { getRoleHome, isRole } from "@/lib/roles";
import type { AccountType, Role } from "@/types";
import { Separator } from "@/components/ui/separator";
import GoogleButton from "../shared/GoogleButton";

// Account types the user can pick
const accountTypes: AccountType[] = [
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Restaurant" },
  { value: "admin", label: "Admin" },
];

// Sign up form: checks the fields, then creates the account with Better Auth.
export default function SignUpForm() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("customer");
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
    const { data, error: signUpError } = await authClient.signUp.email({
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

    // Account created and signed in: show a message, go to the page for their role
    toast.success("Sign up successful! Welcome to PizzaHub.");
    router.push(getRoleHome(data?.user.role));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {/* Account type */}
      <fieldset>
        <legend className="mb-1.5 font-bold">I am a...</legend>
        <RadioGroup
          value={role}
          onValueChange={(value) => isRole(value) && setRole(value)}
          className="grid gap-3 min-[440px]:grid-cols-3"
        >
          {accountTypes.map((type) => (
            <Label
              key={type.value}
              className="cursor-pointer gap-2.5 rounded-full border border-border px-4 py-3 text-base has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary-100"
            >
              <RadioGroupItem value={type.value} />
              <strong>{type.label}</strong>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      {/* Full name */}
      <div>
        <Label htmlFor="name" className="mb-1.5 text-base font-bold">
          Full name
        </Label>
        <Input
          id="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Maya Rahman"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" className="mb-1.5 text-base font-bold">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password + confirm (side by side on larger screens) */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="password" className="mb-1.5 text-base font-bold">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="confirm" className="mb-1.5 text-base font-bold">
            Confirm password
          </Label>
          <Input
            id="confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked)}
          className="mt-0.5"
        />
        <Label htmlFor="terms" className="block font-normal leading-normal">
          I agree to the{" "}
          <Link href="#" className="font-bold text-primary-600 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="font-bold text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>

      {/* Error message */}
      {error !== "" && (
        <p role="alert" className="text-sm font-bold text-primary-600">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? "Creating account..." : "Create account"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Separator className="flex-1" />
        or
        <Separator className="flex-1" />
      </div>

      <GoogleButton label="Sign up with Google" role={role} />
    </form>
  );
}
