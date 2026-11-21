import AdminMobileNav from "@/app/components/admin/AdminMobileNav";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import DashboardShell from "@/app/components/dashboard/DashboardShell";

// Admin panel frame: sidebar (large screens) or tabs (small screens) + the page.
// Only admins get here (the proxy redirects everyone else).
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <DashboardShell sidebar={<AdminSidebar />} mobileNav={<AdminMobileNav />}>
      {children}
    </DashboardShell>
  );
}
