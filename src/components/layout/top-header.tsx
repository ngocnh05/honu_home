"use client";

import * as React from "react";
import { Search, BellRing } from "lucide-react";

interface TopHeaderProps {
  unreadCount?: number;
}

export function TopHeader({ unreadCount = 99 }: TopHeaderProps) {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <header className="sticky top-0 z-30 h-[76px] xl:h-[96px] bg-white border-b border-[#E3EDF6] flex items-center justify-between px-6 xl:px-8 w-full transition-all">
      {/* Search Bar - Responsive Pill: up to 556px */}
      <div className="relative w-full max-w-[380px] lg:max-w-[480px] xl:max-w-[556px]">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Tìm Kiếm"
          className="w-full h-[46px] xl:h-[54px] pl-5 xl:pl-6 pr-12 xl:pr-14 rounded-full bg-[#F2F8FC] border border-[#DEEBF5] focus:border-[#5C84BE] focus:bg-white text-sm xl:text-base text-[#253F5B] placeholder:text-[#BCC6D5] outline-none transition-all duration-200"
        />
        <button
          type="button"
          className="absolute right-3.5 xl:right-4 top-1/2 -translate-y-1/2 p-1.5 xl:p-2 rounded-full text-[#5C84BE] hover:text-[#426ba8] hover:bg-[#E2EFF9] transition-colors cursor-pointer"
          aria-label="Thực hiện tìm kiếm"
        >
          <Search className="w-4 h-4 xl:w-5 xl:h-5 stroke-[2.3]" />
        </button>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-4 xl:gap-6">
        {/* Notification Bell with Badge 99 */}
        <div className="relative">
          <button
            type="button"
            className="relative p-2.5 xl:p-3 rounded-2xl text-[#253F5B] hover:bg-[#F2F8FC] hover:text-[#5C84BE] transition-all group cursor-pointer"
            aria-label="Thông báo hệ thống"
          >
            <BellRing className="w-5 h-5 xl:w-6 xl:h-6 stroke-[2] origin-top group-hover:animate-bell-ring transition-transform" />

            {/* Notification Badge: 99 */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[22px] xl:min-w-[24px] h-[20px] xl:h-[22px] px-1.5 rounded-full bg-rose-500 text-white text-[10px] xl:text-[11px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-md animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User Avatar Circle */}
        <div className="w-[44px] h-[44px] xl:w-[52px] xl:h-[52px] rounded-full ring-2 ring-[#5C84BE]/30 bg-gradient-to-tr from-[#5C84BE] to-[#7DA0D0] flex items-center justify-center text-white font-bold text-sm xl:text-base shadow-sm cursor-pointer hover:ring-[#5C84BE] transition-all">
          NA
        </div>
      </div>
    </header>
  );
}
