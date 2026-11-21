import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardPageHeader from "./DashboardPageHeader";
import ProfileSettingsForm, { type ProfileInfo } from "./ProfileSettingsForm";

// Loads the logged-in user and fills the form
async function ProfileLoader() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null; // the proxy already sends guests to sign in

  const user = session.user;
  const premiumUntil =
    user.subscriptionPlan === "premium" && user.subscriptionExpiresAt
      ? new Date(user.subscriptionExpiresAt)
      : null;
  const isPremium = !!premiumUntil && premiumUntil > new Date();

  const profile: ProfileInfo = {
    name: user.name,
    email: user.email,
    role: user.role ?? "customer",
    image: user.image ?? null,
    businessName: user.businessName ?? null,
    planLabel:
      user.role === "vendor"
        ? isPremium
          ? `Premium until ${premiumUntil!.toLocaleDateString("en-US", { dateStyle: "medium" })}`
          : "Free"
        : null,
  };

  return <ProfileSettingsForm profile={profile} />;
}

// The "Profile settings" page of every dashboard (admin, vendor, customer)
export default function ProfileSettings({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="max-w-[1000px]">
      <DashboardPageHeader
        eyebrow={eyebrow}
        title="Profile settings"
        description="Update your name and photo. Vendors can also edit their restaurant name."
      />
      <Suspense
        fallback={
          <div role="status" aria-label="Loading your profile" className="grid gap-6 lg:grid-cols-3">
            <div className="h-80 animate-pulse rounded-3xl bg-muted" />
            <div className="h-80 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
          </div>
        }
      >
        <ProfileLoader />
      </Suspense>
    </div>
  );
}
