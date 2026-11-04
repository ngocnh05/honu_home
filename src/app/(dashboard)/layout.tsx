import { Suspense } from "react";
import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client";
import { mockDashboardData } from "@/lib/mock-data/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutClient unreadCount={mockDashboardData.unreadNotifications}>
      <Suspense fallback={<div className="p-8 text-[#7A93AD]">Đang tải dữ liệu...</div>}>
        {children}
      </Suspense>
    </DashboardLayoutClient>
  );
}
