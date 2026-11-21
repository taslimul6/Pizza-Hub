import type { Metadata } from "next";
import ProfileSettings from "@/app/components/dashboard/ProfileSettings";

export const metadata: Metadata = {
  title: "Profile Settings | PizzaHub",
};

// Customer profile settings (the proxy only lets customers in)
export default function CustomerSettingsPage() {
  return <ProfileSettings eyebrow="Customer" />;
}
