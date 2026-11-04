"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  DoorOpen,
  Users,
  FileCheck2,
  Receipt,
  Wrench,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    name: "Trang chủ",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Quản Lí Phòng",
    href: "/rooms",
    icon: DoorOpen,
  },
  {
    name: "Người Thuê",
    href: "/tenants",
    icon: Users,
  },
  {
    name: "Hợp Đồng",
    href: "/contracts",
    icon: FileCheck2,
  },
  {
    name: "Hóa Đơn",
    href: "/invoices",
    icon: Receipt,
  },
  {
    name: "Sự Cố/ Bảo Trì",
    href: "/maintenance",
    icon: Wrench,
  },
  {
    name: "Báo Cáo",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Cài Đặt",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 bottom-0 z-40 bg-[#EAF2F8] border-r border-[#D2E2F0] flex flex-col justify-between py-3 xl:py-4 select-none transition-all duration-300 ease-in-out",
        isCollapsed
          ? "w-[72px] px-2 items-center overflow-visible"
          : "w-[235px] xl:w-[245px] px-3 xl:px-3.5 overflow-y-auto overflow-x-hidden"
      )}
    >
      {/* Top Header & Logo Area */}
      <div className="space-y-2.5 xl:space-y-3 w-full">
        {isCollapsed ? (
          /* COLLAPSED STATE: Logo transforms to Expand Icon on hover with ChatGPT-style tooltip */
          <div className="relative group/logo w-full flex justify-center">
            <button
              type="button"
              onClick={toggleSidebar}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:bg-[#DCE9F5] active:scale-95"
              aria-label="Mở rộng menu"
            >
              {/* Default State: HonuHome Home Logo */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5C84BE] to-[#426ba8] flex items-center justify-center text-white shadow-md shadow-[#5C84BE]/25 transition-all duration-200 group-hover/logo:opacity-0 group-hover/logo:scale-75">
                <Home className="w-5 h-5 stroke-[2.2]" />
              </div>

              {/* Hover State: ChatGPT-style Expand Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover/logo:opacity-100 group-hover/logo:scale-100 transition-all duration-200">
                <div className="w-9 h-9 rounded-xl bg-[#D2E4F3] border border-[#BFD7EB] flex items-center justify-center text-[#253F5B] shadow-sm">
                  <PanelLeftOpen className="w-5 h-5 stroke-[2.4]" />
                </div>
              </div>
            </button>

            {/* ChatGPT-Style Dark Tooltip Pill */}
            <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden group-hover/logo:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D0D0D] text-white text-xs font-medium shadow-2xl z-50 whitespace-nowrap animate-in fade-in duration-150">
              <span>Mở rộng menu</span>
              <span className="bg-[#2D2D2D] px-2 py-0.5 rounded-md text-[10px] text-neutral-300 font-mono font-medium">
                Ctrl+Shift+S
              </span>
              {/* Triangle pointer */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-[1px] border-4 border-transparent border-r-[#0D0D0D]" />
            </div>
          </div>
        ) : (
          /* EXPANDED STATE: Full Brand + Collapse Button */
          <div className="flex items-center justify-between px-1.5 w-full">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 group shrink-0"
              title="HonuHome Property Manager"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5C84BE] to-[#426ba8] flex items-center justify-center text-white shadow-md shadow-[#5C84BE]/20 group-hover:scale-105 transition-transform shrink-0">
                <Home className="w-4 h-4 xl:w-5 xl:h-5 stroke-[2.2]" />
              </div>

              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="text-lg xl:text-xl font-bold tracking-tight text-[#253F5B] leading-tight">
                  HonuHome
                </span>
                <span className="text-[9.5px] xl:text-[10px] font-semibold text-[#5C84BE] tracking-wider uppercase">
                  Property Manager
                </span>
              </div>
            </Link>

            {/* Collapse Toggle Button with ChatGPT-style Tooltip */}
            <div className="relative group/collapse">
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-[#5C84BE] hover:bg-[#DCE9F5] hover:text-[#253F5B] transition-all cursor-pointer shrink-0 active:scale-95"
                aria-label="Thu gọn menu"
              >
                <PanelLeftClose className="w-4 h-4 xl:w-5 xl:h-5 stroke-[2.2]" />
              </button>

              <div className="pointer-events-none absolute right-0 top-[calc(100%+8px)] hidden group-hover/collapse:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D0D0D] text-white text-xs font-medium shadow-2xl z-50 whitespace-nowrap animate-in fade-in duration-150">
                <span>Thu gọn menu</span>
                <span className="bg-[#2D2D2D] px-2 py-0.5 rounded-md text-[10px] text-neutral-300 font-mono font-medium">
                  Ctrl+Shift+S
                </span>
                <div className="absolute bottom-full right-3 border-4 border-transparent border-b-[#0D0D0D]" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links - Snug and well-proportioned to Logo */}
        <nav className="space-y-1 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <div key={item.href} className="relative group/nav w-full">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl text-[13px] xl:text-[14px] font-medium transition-all duration-200",
                    isCollapsed
                      ? "justify-center h-10 w-full px-0"
                      : "gap-2.5 px-3 py-2 xl:py-2.5",
                    isActive
                      ? "bg-[#5C84BE] text-white shadow-sm shadow-[#5C84BE]/25 font-semibold"
                      : "text-[#4A6482] hover:bg-[#DCE9F5] hover:text-[#253F5B]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-[18px] h-[18px] shrink-0 transition-transform",
                      isActive ? "text-white scale-105" : "text-[#5C84BE]"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>

                {/* Nav item tooltip when collapsed */}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden group-hover/nav:flex items-center px-3 py-1.5 rounded-xl bg-[#0D0D0D] text-white text-xs font-medium shadow-2xl z-50 whitespace-nowrap animate-in fade-in duration-150">
                    <span>{item.name}</span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-[1px] border-4 border-transparent border-r-[#0D0D0D]" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card (Nguyễn Văn A - Quản Lí) */}
      <div className="pt-2.5 border-t border-[#D2E2F0] w-full">
        <div className="relative group/user w-full">
          <div
            className={cn(
              "flex items-center rounded-xl bg-white/70 backdrop-blur-sm border border-white shadow-2xs transition-all",
              isCollapsed
                ? "justify-center p-1.5 cursor-pointer hover:bg-white"
                : "gap-2.5 px-2.5 py-1.5"
            )}
          >
            <div className="relative w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-gradient-to-tr from-[#5C84BE] to-[#88A6D3] flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
              NA
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs xl:text-[13px] font-bold text-[#253F5B] truncate leading-tight">
                  Nguyễn Văn A
                </span>
                <span className="text-[10px] xl:text-[11px] text-[#7B93AD] font-medium leading-tight">
                  Quản Lí
                </span>
              </div>
            )}
          </div>

          {/* User Tooltip when collapsed */}
          {isCollapsed && (
            <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden group-hover/user:flex flex-col px-3 py-1.5 rounded-xl bg-[#0D0D0D] text-white text-xs font-medium shadow-2xl z-50 whitespace-nowrap animate-in fade-in duration-150">
              <span className="font-bold text-white">Nguyễn Văn A</span>
              <span className="text-[10px] text-neutral-300">Quản Lí</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-[1px] border-4 border-transparent border-r-[#0D0D0D]" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
