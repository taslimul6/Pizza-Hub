import CustomerMobileNav from "@/app/components/customer/CustomerMobileNav";
import CustomerSidebar from "@/app/components/customer/CustomerSidebar";
import DashboardShell from "@/app/components/dashboard/DashboardShell";

// Customer panel frame: sidebar (large screens) or tabs (small screens) + the page.
// Only customers get here (the proxy redirects everyone else).
export default function CustomerLayout({ children }: LayoutProps<"/customer">) {
  return (
    <DashboardShell sidebar={<CustomerSidebar />} mobileNav={<CustomerMobileNav />}>
      {children}
    </DashboardShell>
  );
}
