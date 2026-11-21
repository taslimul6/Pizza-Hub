import type { Metadata } from "next";
import ProfileSettings from "@/app/components/dashboard/ProfileSettings";

export const metadata: Metadata = {
  title: "Profile Settings | PizzaHub",
};

// Vendor profile settings (the proxy only lets vendors in)
export default function VendorSettingsPage() {
  return <ProfileSettings eyebrow="Vendor" />;
}
