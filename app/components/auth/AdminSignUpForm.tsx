"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { checkPassword } from "@/lib/password-rules";

// Admin sign up: needs the secret admin key. The server checks the key,
// creates the account and gives it the admin role. Then we sign in.
export default function AdminSignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (name.trim() === "") return setError("Please enter your full name.");
    const passwordError = checkPassword(password);
    if (passwordError) return setError(passwordError);
    if (adminKey.trim() === "") return setError("Please enter the admin key.");

    setLoading(true);
    try {
      const res = await fetch("/api/admin-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email, password, adminKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.error ?? "Could not create the admin account.";
        setError(message);
        toast.error(message);
        return;
      }

      // Account ready: sign in and open the admin panel
      const { error: signInError } = await authClient.signIn.email({ email, password });
      if (signInError) {
        toast.success("Admin account created. Please sign in.");
        router.push("/signin");
        return;
      }
      toast.success("Admin account created. Welcome!");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <Label htmlFor="admin-name" className="mb-1.5 text-base font-bold">
          Full name
        </Label>
        <Input
          id="admin-name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="admin-email" className="mb-1.5 text-base font-bold">
          Email
        </Label>
        <Input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="admin-password" className="mb-1.5 text-base font-bold">
          Password
        </Label>
        <Input
          id="admin-password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Min 6 characters, upper and lower case"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="admin-key" className="mb-1.5 text-base font-bold">
          Admin key
        </Label>
        <Input
          id="admin-key"
          type="password"
          required
          autoComplete="off"
          placeholder="Secret key from the project owner"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />
      </div>

      {error !== "" && (
        <p role="alert" className="text-sm font-bold text-primary-600">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? "Creating admin account..." : "Create admin account"}
      </Button>
    </form>
  );
}
