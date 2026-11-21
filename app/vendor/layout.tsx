import DashboardShell from "@/app/components/dashboard/DashboardShell";
import VendorMobileNav from "@/app/components/vendor/VendorMobileNav";
import VendorSidebar from "@/app/components/vendor/VendorSidebar";

// Vendor panel frame: sidebar (large screens) or tabs (small screens) + the page.
// Only vendors get here (the proxy redirects everyone else).
export default function VendorLayout({ children }: LayoutProps<"/vendor">) {
  return (
    <DashboardShell sidebar={<VendorSidebar />} mobileNav={<VendorMobileNav />}>
      {children}
    </DashboardShell>
  );
}
