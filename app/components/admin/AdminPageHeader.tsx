import type { ReactNode } from "react";
import DashboardPageHeader from "@/app/components/dashboard/DashboardPageHeader";

// Page title for the admin panel
export default function AdminPageHeader(props: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return <DashboardPageHeader eyebrow="Admin" {...props} />;
}
