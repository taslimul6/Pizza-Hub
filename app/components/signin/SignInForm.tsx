"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { getRoleHome } from "@/lib/roles";

// Sign in form: logs the user in with email and password using Better Auth.
export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (signInError) {
      // Blocked account: send them to the home page, which shows a toast
      if (signInError.code === "ACCOUNT_BLOCKED") {
        router.replace("/?error=ACCOUNT_BLOCKED");
        return;
      }
      const message =
        signInError.message || "Could not sign in. Please try again.";
      setError(message);
      toast.error(message);
      return;
    }

    // Logged in: show a message, go to the page for their role
    toast.success("Signed in successfully. Welcome back!");
    router.push(getRoleHome(data?.user.role));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

      {/* Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label htmlFor="password" className="text-base font-bold">
            Password
          </Label>
          <Link
            href="#"
            className="text-sm font-bold text-primary-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked)}
        />
        <Label htmlFor="remember" className="font-normal">
          Remember me
        </Label>
      </div>

      {/* Error message */}
      {error !== "" && (
        <p role="alert" className="text-sm font-bold text-primary-600">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
