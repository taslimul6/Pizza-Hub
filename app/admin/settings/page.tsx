import type { Metadata } from "next";
import ProfileSettings from "@/app/components/dashboard/ProfileSettings";

export const metadata: Metadata = {
  title: "Profile Settings | PizzaHub",
};

// Admin profile settings (the proxy only lets admins in)
export default function AdminSettingsPage() {
  return <ProfileSettings eyebrow="Admin" />;
}
