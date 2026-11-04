"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  FileSignature,
  ReceiptText,
  Wrench,
  BarChart3,
  Settings,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Trang chủ",
    href: "/dashboard",
    icon: LayoutDashboard,
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
    icon: FileSignature,
  },
  {
    name: "Hóa Đơn",
    href: "/invoices",
    icon: ReceiptText,
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

  return (
    <aside className="fixed top-0 left-0 bottom-0 z-40 w-[240px] xl:w-[250px] bg-[#EAF2F8] border-r border-[#D2E2F0] flex flex-col justify-between py-4 xl:py-6 px-3.5 xl:px-4 select-none overflow-y-auto overflow-x-hidden">
      {/* Top Header & Logo */}
      <div className="space-y-4 xl:space-y-6">
        <div className="px-3">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-gradient-to-tr from-[#5C84BE] to-[#426ba8] flex items-center justify-center text-white shadow-md shadow-[#5C84BE]/20 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 xl:w-6 xl:h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl xl:text-2xl font-bold tracking-tight text-[#253F5B]">
                HonuHome
              </span>
              <span className="text-[10px] xl:text-[11px] font-semibold text-[#5C84BE] tracking-wider uppercase">
                Property Manager
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 pt-1 xl:pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 xl:px-4 py-2.5 xl:py-3 rounded-2xl text-sm xl:text-[15px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#5C84BE] text-white shadow-md shadow-[#5C84BE]/25 font-semibold"
                    : "text-[#4A6482] hover:bg-[#DCE9F5] hover:text-[#253F5B]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 xl:w-5 xl:h-5 shrink-0 transition-transform",
                    isActive ? "text-white scale-105" : "text-[#5C84BE]"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card (Nguyễn Văn A - Quản Lí) */}
      <div className="pt-3 xl:pt-4 border-t border-[#D2E2F0]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm">
          <div className="relative w-9 h-9 xl:w-11 xl:h-11 rounded-full bg-gradient-to-tr from-[#5C84BE] to-[#88A6D3] flex items-center justify-center text-white font-bold text-sm xl:text-base shadow-inner shrink-0">
            NA
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs xl:text-sm font-bold text-[#253F5B] truncate">
              Nguyễn Văn A
            </span>
            <span className="text-[11px] xl:text-xs text-[#7B93AD] font-medium">
              Quản Lí
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
