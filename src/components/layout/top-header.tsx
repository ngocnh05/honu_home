"use client";

import * as React from "react";
import { Search, BellRing } from "lucide-react";

interface TopHeaderProps {
  unreadCount?: number;
}

export function TopHeader({ unreadCount = 99 }: TopHeaderProps) {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <header className="sticky top-0 z-30 h-[60px] xl:h-[64px] bg-white border-b border-[#E3EDF6] flex items-center justify-between px-5 xl:px-7 w-full transition-all">
      {/* Left Area: Search Bar */}
      <div className="flex items-center w-full max-w-[360px] lg:max-w-[420px] xl:max-w-[460px]">
        {/* Search Bar - Sleek & Compact Pill: 40px height */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm Kiếm..."
            className="w-full h-[38px] xl:h-[40px] pl-4 pr-11 rounded-full bg-[#F2F8FC] border border-[#DEEBF5] focus:border-[#5C84BE] focus:bg-white text-xs xl:text-sm text-[#253F5B] placeholder:text-[#A4B3C6] outline-none transition-all duration-200"
          />
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[#5C84BE] hover:text-[#426ba8] hover:bg-[#E2EFF9] transition-colors cursor-pointer"
            aria-label="Thực hiện tìm kiếm"
          >
            <Search className="w-4 h-4 stroke-[2.3]" />
          </button>
        </div>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-3 xl:gap-4">
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
