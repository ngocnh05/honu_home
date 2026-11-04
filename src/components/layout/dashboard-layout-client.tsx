"use client";

import * as React from "react";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";
import { SnackbarProvider } from "@/components/common/snackbar";

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

      {/* Main Content Area - Transitions padding when sidebar is collapsed (72px) vs expanded (230px/240px) */}
      <div
        className={`flex-1 flex flex-col min-w-0 w-full transition-all duration-300 ease-in-out ${
          isCollapsed ? "pl-[72px]" : "pl-[230px] xl:pl-[240px]"
        }`}
      >
        {/* Top Header with toggle & notifications */}
        <TopHeader unreadCount={unreadCount} />

        {/* Page Inner Container - Perfectly aligned with TopHeader (px-5 xl:px-7), no awkward mx-auto gap */}
        <main className="flex-1 px-5 xl:px-7 py-5 lg:py-6 w-full transition-all">
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
      <SnackbarProvider>
        <DashboardLayoutContent unreadCount={unreadCount}>
          {children}
        </DashboardLayoutContent>
      </SnackbarProvider>
    </SidebarProvider>
  );
}
