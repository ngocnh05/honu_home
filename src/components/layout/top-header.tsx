"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, BellRing, ChevronRight, Home } from "lucide-react";

interface TopHeaderProps {
  unreadCount?: number;
}

const routeNames: Record<string, string> = {
  dashboard: "Tổng quan",
  buildings: "Cơ sở / Tòa nhà",
  rooms: "Quản lý phòng",
  create: "Thêm phòng mới",
  contracts: "Hợp đồng",
  tenants: "Khách thuê",
  invoices: "Hóa đơn & Thu tiền",
  services: "Bảng giá dịch vụ",
  maintenance: "Sự cố / Bảo trì",
  reports: "Báo cáo thống kê",
  settings: "Cài đặt",
};

export function TopHeader({ unreadCount = 99 }: TopHeaderProps) {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = React.useState("");

  // Build breadcrumb items from current pathname
  const breadcrumbs = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0 || (parts.length === 1 && parts[0] === "dashboard")) {
      return [{ label: "Tổng quan", href: "/dashboard", isCurrent: true }];
    }

    const items = [
      { label: "Tổng quan", href: "/dashboard", isCurrent: false },
    ];

    let currentPath = "";
    parts.forEach((part, index) => {
      currentPath += `/${part}`;
      const isCurrent = index === parts.length - 1;
      let label = routeNames[part] || decodeURIComponent(part);
      if (index === 1 && parts[0] === "rooms") {
        label = `Phòng ${decodeURIComponent(part)}`;
      }
      items.push({
        label,
        href: currentPath,
        isCurrent,
      });
    });

    return items;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 h-[60px] xl:h-[64px] bg-white border-b border-[#E3EDF6] flex items-center justify-between px-5 xl:px-7 w-full transition-all">
      {/* Left Area: Breadcrumbs + Search Bar */}
      <div className="flex items-center gap-3 xl:gap-4 min-w-0">
        {/* Dynamic Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs xl:text-[13px] text-[#7A93B0] font-medium whitespace-nowrap"
        >
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href + idx}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[#B6C7D8] stroke-[2.2] shrink-0" />
              )}
              {crumb.isCurrent ? (
                <span className="text-[#253F5B] font-bold">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-[#5C84BE] transition-colors flex items-center gap-1"
                >
                  {idx === 0 && (
                    <Home className="w-3.5 h-3.5 stroke-[2] shrink-0 text-[#5C84BE]" />
                  )}
                  <span>{crumb.label}</span>
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Divider */}
        <div className="hidden sm:block h-4 w-px bg-[#D6E3EF] shrink-0" />

        {/* Search Bar - Sleek & Compact Pill */}
        <div className="relative w-[180px] sm:w-[220px] lg:w-[260px] xl:w-[300px]">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm Kiếm..."
            className="w-full h-[36px] xl:h-[38px] pl-3.5 pr-9 rounded-full bg-[#F2F8FC] border border-[#DEEBF5] focus:border-[#5C84BE] focus:bg-white text-xs xl:text-sm text-[#253F5B] placeholder:text-[#A4B3C6] outline-none transition-all duration-200"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#5C84BE] hover:text-[#426ba8] hover:bg-[#E2EFF9] transition-colors cursor-pointer"
            aria-label="Thực hiện tìm kiếm"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.3]" />
          </button>
        </div>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-3 xl:gap-4 shrink-0">
        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            type="button"
            className="relative p-2 rounded-xl text-[#253F5B] hover:bg-[#F2F8FC] hover:text-[#5C84BE] transition-all group cursor-pointer"
            aria-label="Thông báo hệ thống"
          >
            <BellRing className="w-5 h-5 stroke-[2] origin-top group-hover:animate-bell-ring transition-transform" />

            {/* Notification Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-sm animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User Avatar Circle */}
        <div className="w-[36px] h-[36px] xl:w-[40px] xl:h-[40px] rounded-full ring-2 ring-[#5C84BE]/30 bg-gradient-to-tr from-[#5C84BE] to-[#7DA0D0] flex items-center justify-center text-white font-bold text-xs xl:text-sm shadow-sm cursor-pointer hover:ring-[#5C84BE] transition-all">
          NA
        </div>
      </div>
    </header>
  );
}
