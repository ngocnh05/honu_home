"use client";

import * as React from "react";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

function DashboardLayoutContent({
  children,
  unreadCount,
}: {
  children: React.ReactNode;
  unreadCount?: number;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#EAF2F8] flex w-full">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area - Transitions padding when sidebar is collapsed (72px) vs expanded (235px/245px) */}
      <div
        className={`flex-1 flex flex-col min-w-0 w-full transition-all duration-300 ease-in-out ${
          isCollapsed ? "pl-[72px]" : "pl-[235px] xl:pl-[245px]"
        }`}
      >
        {/* Top Header with toggle & notifications */}
        <TopHeader unreadCount={unreadCount} />

        {/* Page Inner Container - Responsive padding & max width */}
        <main className="flex-1 p-5 lg:p-7 xl:p-8 w-full max-w-[1440px] mx-auto transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayoutClient({
  children,
  unreadCount,
}: {
  children: React.ReactNode;
  unreadCount?: number;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent unreadCount={unreadCount}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}
