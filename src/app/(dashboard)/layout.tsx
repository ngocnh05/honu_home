import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { mockDashboardData } from "@/lib/mock-data/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#EAF2F8] flex w-full">
      {/* Sidebar Navigation - Fixed 250px */}
      <Sidebar />

      {/* Main Content Area - Full width with 250px left margin */}
      <div className="flex-1 flex flex-col min-w-0 pl-[250px] w-full">
        {/* Top Header with 99 unread notifications */}
        <TopHeader unreadCount={mockDashboardData.unreadNotifications} />

        {/* Page Inner Container - Stretches full width with clean padding */}
        <main className="flex-1 p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
