"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRing,
  ChevronRight,
  Home,
  Receipt,
  Wrench,
  FileCheck2,
  Building2,
  Settings,
  LogOut,
  User,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface TopHeaderProps {
  unreadCount?: number;
}

const routeNames: Record<string, string> = {
  dashboard: "Tổng quan",
  buildings: "Cơ sở / Tòa nhà",
  rooms: "Quản lý phòng",
  create: "Thêm phòng mới",
  edit: "Chỉnh sửa phòng",
  contracts: "Hợp đồng",
  tenants: "Khách thuê",
  invoices: "Hóa đơn & Thu tiền",
  services: "Bảng giá dịch vụ",
  maintenance: "Sự cố / Bảo trì",
  reports: "Báo cáo thống kê",
  settings: "Cài đặt",
};

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  href: string;
  type: "invoice" | "maintenance" | "contract" | "room";
  unread: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif_1",
    title: "4 hóa đơn chưa thanh toán kỳ 03/2026",
    description: "Tổng tiền 14.850.000 đ cần đôn đốc khách thanh toán",
    time: "10 phút trước",
    href: "/invoices?status=pending",
    type: "invoice",
    unread: true,
  },
  {
    id: "notif_2",
    title: "Yêu cầu sửa chữa mới: Phòng P001",
    description: "Khách báo rò rỉ vòi nước bồn rửa mặt cần thợ kiểm tra",
    time: "45 phút trước",
    href: "/maintenance?room=P001",
    type: "maintenance",
    unread: true,
  },
  {
    id: "notif_3",
    title: "Hợp đồng phòng P072 sắp hết hạn",
    description: "Hạn hợp đồng đến ngày 01/03/2026 (còn 7 ngày)",
    time: "2 giờ trước",
    href: "/contracts?status=expiring_soon",
    type: "contract",
    unread: true,
  },
  {
    id: "notif_4",
    title: "Phòng P155 vừa được đặt cọc",
    description: "Khách đặt cọc 3.900.000 đ, chờ ký hợp đồng chính thức",
    time: "5 giờ trước",
    href: "/rooms/P155",
    type: "room",
    unread: true,
  },
];

export function TopHeader({ unreadCount: initialCount = 4 }: TopHeaderProps) {
  const pathname = usePathname();
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const notificationRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Handle click outside to close dropdowns
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 h-[60px] xl:h-[64px] bg-white border-b border-[#E3EDF6] flex items-center justify-between px-5 xl:px-7 w-full transition-all">
      {/* Left Area: Breadcrumbs */}
      <div className="flex items-center gap-3 xl:gap-4 min-w-0">
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
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-3 xl:gap-4 shrink-0">
        {/* Notification Bell with Popover */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="relative p-2 rounded-xl text-[#253F5B] hover:bg-[#F2F8FC] hover:text-[#5C84BE] transition-all group cursor-pointer"
            aria-label="Thông báo hệ thống"
          >
            <BellRing className="w-5 h-5 stroke-[2] origin-top group-hover:animate-bell-ring transition-transform" />

            {/* Notification Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-sm animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl z-50 p-4 space-y-3 animate-scaleUp">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA]">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#253F5B]">Thông báo</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-200">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-[#5C84BE] hover:underline cursor-pointer"
                  >
                    Đọc tất cả
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {notifications.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === item.id ? { ...n, unread: false } : n
                        )
                      );
                      setIsNotificationOpen(false);
                    }}
                    className={`block p-3 rounded-2xl border transition-all ${
                      item.unread
                        ? "bg-[#F8FBFE] border-[#D9E8F5] hover:bg-[#EEF5FB]"
                        : "bg-white border-[#F0F5FA] hover:bg-slate-50 opacity-75"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#D9E6F2] flex items-center justify-center shrink-0 shadow-2xs">
                        {item.type === "invoice" && (
                          <Receipt className="w-4 h-4 text-rose-500" />
                        )}
                        {item.type === "maintenance" && (
                          <Wrench className="w-4 h-4 text-amber-500" />
                        )}
                        {item.type === "contract" && (
                          <FileCheck2 className="w-4 h-4 text-[#5C84BE]" />
                        )}
                        {item.type === "room" && (
                          <Building2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#253F5B] leading-tight">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#7A93AD] line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                        <span className="text-[10px] text-[#A0B4C8] font-medium block mt-1">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Circle with Profile Popover */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotificationOpen(false);
            }}
            className="w-[36px] h-[36px] xl:w-[40px] xl:h-[40px] rounded-full ring-2 ring-[#5C84BE]/30 bg-gradient-to-tr from-[#5C84BE] to-[#7DA0D0] flex items-center justify-center text-white font-bold text-xs xl:text-sm shadow-sm cursor-pointer hover:ring-[#5C84BE] transition-all"
            aria-label="Tài khoản quản lý"
          >
            NA
          </button>

          {/* Profile Dropdown Panel */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl z-50 p-4 space-y-3 animate-scaleUp">
              {/* User Identity Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#F0F5FA]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5C84BE] to-[#7DA0D0] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  NA
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#253F5B] truncate">
                    Nguyễn Anh
                  </p>
                  <p className="text-[10px] text-[#5C84BE] font-bold">
                    Quản trị viên HonuHome
                  </p>
                  <p className="text-[10px] text-[#7A93AD] truncate">
                    admin@honuhome.vn
                  </p>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="space-y-1 text-xs font-bold text-[#526579]">
                <Link
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F2F8FC] hover:text-[#5C84BE] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#5C84BE]" />
                  <span>Cài đặt hệ thống</span>
                </Link>

                <Link
                  href="/buildings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F2F8FC] hover:text-[#5C84BE] transition-colors"
                >
                  <Building2 className="w-4 h-4 text-[#5C84BE]" />
                  <span>Quản lý cơ sở tòa nhà</span>
                </Link>

                <Link
                  href="/reports"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F2F8FC] hover:text-[#5C84BE] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Báo cáo doanh thu</span>
                </Link>

                <div className="pt-2 border-t border-[#F0F5FA]">
                  <Link
                    href="/login"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
