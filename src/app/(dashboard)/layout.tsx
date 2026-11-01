import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { mockDashboardData } from "@/lib/mock-data/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#EAF2F8] flex min-w-[1440px]">
      {/* Sidebar Navigation - Fixed 250px */}
      <Sidebar />

      {/* Main Content Area - Fixed offset 250px */}
      <div className="flex-1 flex flex-col min-w-[1190px] pl-[250px]">
        {/* Top Header with 99 unread notifications */}
        <TopHeader unreadCount={mockDashboardData.unreadNotifications} />

        {/* Page Inner Container */}
        <main className="flex-1 p-8 w-full max-w-[1190px]">
          {children}
        </main>
      </div>
    </div>
  );
}
