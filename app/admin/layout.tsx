import AdminMobileNav from "@/app/components/admin/AdminMobileNav";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

// Admin panel frame: sidebar on the left (large screens), tabs on top (small
// screens), the page on the right. The top navbar stays above it.
// Only admins get here (the proxy redirects everyone else).
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 bg-light">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminMobileNav />
        <main className="px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
