"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Calendar,
  Phone,
  UserCheck,
  FileText,
  Clock,
  Sparkles,
  Edit,
  History,
  CheckCircle2,
  Zap,
  Droplets,
  Wifi,
  ShieldCheck,
  BadgeDollarSign,
} from "lucide-react";
import type { Room } from "@/types/room";

interface RoomDetailViewProps {
  room: Room;
}

export function RoomDetailView({ room }: RoomDetailViewProps) {
  const [activeTab, setActiveTab] = React.useState<"general" | "history" | "notes">(
    "general"
  );
  const [showEditToast, setShowEditToast] = React.useState(false);
  const [showRenewModal, setShowRenewModal] = React.useState(false);
  const [showTenantModal, setShowTenantModal] = React.useState(false);

  // Status Badge styles matching Figma
  const statusBadgeConfig = {
    rented: {
      bg: "bg-[#B5DDA6]",
      text: "text-[#253F5B]",
      label: "Đang thuê",
    },
    available: {
      bg: "bg-[#8FBFFA]",
      text: "text-[#253F5B]",
      label: "Trống",
    },
    maintenance: {
      bg: "bg-[#FFF9BF]",
      text: "text-[#253F5B]",
      label: "Đang sửa",
    },
  };

  const currentStatus = statusBadgeConfig[room.status] || statusBadgeConfig.rented;

  const amenities = [
    { name: "Giường", icon: "/icons/amenities/bed.svg" },
    { name: "Tủ", icon: "/icons/amenities/wardrobe.svg" },
    { name: "Wifi", icon: "/icons/amenities/wifi.svg" },
    { name: "Máy lạnh", icon: "/icons/amenities/ac.svg" },
  ];

  return (
    <div className="w-full space-y-5 animate-fadeIn pb-12 select-none">
      {/* 1. Breadcrumb navigation */}
      <div>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C84BE] hover:text-[#41689E] transition-colors group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Quay lại danh sách phòng</span>
        </Link>
      </div>

      {/* 2. Top Header Bar: Status Badge + Tiêu đề phòng (Chuẩn Figma 37:172, 37:185) */}
      <div className="flex items-center justify-between bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center justify-center px-5 py-2 rounded-[20px] text-base font-extrabold shadow-sm ${currentStatus.bg} ${currentStatus.text}`}
          >
            {currentStatus.label}
          </span>

          {/* Room Title */}
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
              Phòng - {room.roomNumber}
            </h1>
            {room.floor && (
              <span className="text-xs font-bold text-[#7A93AD] bg-[#EAF2F8] px-2.5 py-1 rounded-lg">
                Tầng {room.floor}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#7A93AD]">Mã phòng:</span>
          <span className="font-mono font-bold text-xs text-[#253F5B] bg-[#F2F8FC] px-3 py-1.5 rounded-lg border border-[#DCE8F3]">
            {room.id}
          </span>
        </div>
      </div>

      {/* 3. Main Detail Card (Chuẩn Figma 37:171) */}
      <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-8 w-full">
        {/* Top Info Section: Ảnh phòng (245x377) + Thông số chi tiết */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Ảnh phòng (Figma node 37:218) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col items-center">
            <div className="relative w-[245px] h-[377px] rounded-[30px] overflow-hidden shadow-md border-2 border-[#E3EDF6] group">
              <Image
                src="/images/rooms/room-demo.png"
                alt={`Ảnh phòng ${room.roomNumber}`}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-center shadow-sm">
                <p className="text-[11px] font-bold text-[#253F5B] flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5C84BE]" />
                  <span>Ảnh thực tế phòng {room.roomNumber}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Bảng thông số chi tiết (Figma 37:278 - 37:285) */}
          <div className="col-span-12 lg:col-span-8 space-y-6 pt-1">
            {/* 1. Loại phòng */}
            <div className="grid grid-cols-12 items-center border-b border-[#F0F5FA] pb-4">
              <span className="col-span-4 text-base font-medium text-[#526579]">
                Loại phòng
              </span>
              <span className="col-span-8 text-lg font-black text-[#253F5B]">
                {room.type}
              </span>
            </div>

            {/* 2. Giá thuê */}
            <div className="grid grid-cols-12 items-center border-b border-[#F0F5FA] pb-4">
              <span className="col-span-4 text-base font-medium text-[#526579]">
                Giá thuê
              </span>
              <div className="col-span-8 flex items-baseline gap-2">
                <span className="text-xl font-black text-[#253F5B] tracking-tight">
                  {room.priceFormatted}
                </span>
                <span className="text-sm font-medium text-[#7A93AD]">/tháng</span>
              </div>
            </div>

            {/* 3. Diện tích */}
            <div className="grid grid-cols-12 items-center border-b border-[#F0F5FA] pb-4">
              <span className="col-span-4 text-base font-medium text-[#526579]">
                Diện tích
              </span>
              <span className="col-span-8 text-lg font-black text-[#253F5B]">
                {room.area || 20} m²
              </span>
            </div>

            {/* 4. Tiện nghi (Figma 37:314 - 37:316) */}
            <div className="grid grid-cols-12 items-center border-b border-[#F0F5FA] pb-5">
              <span className="col-span-4 text-base font-medium text-[#526579]">
                Tiện nghi
              </span>
              <div className="col-span-8 flex flex-wrap items-center gap-6">
                {amenities.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 bg-[#F6F9FD] px-3.5 py-2 rounded-2xl border border-[#E3EDF6] hover:border-[#5C84BE] transition-colors"
                  >
                    <div className="w-8 h-8 relative shrink-0">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-bold text-[#253F5B]">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Người thuê hiện tại (Figma 38:201) */}
            <div className="grid grid-cols-12 items-center pt-1">
              <span className="col-span-4 text-base font-medium text-[#526579]">
                Người thuê hiện tại
              </span>
              <div className="col-span-8">
                {room.tenantName !== "---" ? (
                  <div className="flex items-center justify-between bg-[#F8FBFE] p-4 rounded-2xl border border-[#E2EEF8] max-w-[540px]">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-[#0D99FF]/10 flex items-center justify-center">
                        <Image
                          src="/images/rooms/tenant-avatar.svg"
                          alt={room.tenantName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-[#253F5B]">
                          {room.tenantName}
                        </h4>
                        <p className="text-xs font-semibold text-[#7A93AD] mt-0.5">
                          {room.tenantRole || "Sv năm 1 - ĐH Mở"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowTenantModal(true)}
                      className="bg-[#0D99FF] hover:bg-[#0088ee] active:scale-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      Xem hồ sơ
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-[#F8FBFE] p-4 rounded-2xl border border-dashed border-[#D2E2F0] max-w-[540px]">
                    <div className="flex items-center gap-3 text-sm font-bold text-[#7A93AD]">
                      <UserCheck className="w-5 h-5 text-[#8FA8C4]" />
                      <span>Phòng hiện đang trống, chưa có người thuê</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          `Tạo hợp đồng mới cho phòng ${room.roomNumber}`
                        )
                      }
                      className="bg-[#5C84BE] hover:bg-[#4B73AD] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      + Tạo hợp đồng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabs Section (Figma node 38:206 & tabs 38:203 - 38:205) */}
        <div className="pt-4 border-t border-[#EEF4FA]">
          {/* Tabs Bar Header */}
          <div className="flex items-center gap-8 border-b border-[#EAF1F8] pb-1">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`pb-3 text-lg font-black transition-all cursor-pointer relative ${
                activeTab === "general"
                  ? "text-[#0D99FF]"
                  : "text-[#526579] hover:text-[#253F5B]"
              }`}
            >
              Thông tin chung
              {activeTab === "general" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0D99FF] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`pb-3 text-lg font-black transition-all cursor-pointer relative ${
                activeTab === "history"
                  ? "text-[#0D99FF]"
                  : "text-[#526579] hover:text-[#253F5B]"
              }`}
            >
              Lịch sử thuê
              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0D99FF] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              className={`pb-3 text-lg font-black transition-all cursor-pointer relative ${
                activeTab === "notes"
                  ? "text-[#0D99FF]"
                  : "text-[#526579] hover:text-[#253F5B]"
              }`}
            >
              Ghi chú
              {activeTab === "notes" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0D99FF] rounded-full" />
              )}
            </button>
          </div>

          {/* Tab 1: Thông tin chung (Figma 38:206) */}
          {activeTab === "general" && (
            <div className="mt-6 bg-[#F8FBFE] border border-[#E3EDF6] rounded-[30px] p-8 space-y-6">
              {/* Mô tả */}
              <div>
                <h3 className="text-base font-bold text-[#253F5B] mb-2">
                  Mô tả
                </h3>
                <p className="text-base font-medium text-[#526579] leading-relaxed">
                  {room.description ||
                    `Phòng ở tầng ${room.floor || 2}, thoáng mát , có cửa sổ , đầy đủ tiện nghi`}
                </p>
              </div>

              {/* Ngày bắt đầu & Ngày hết hạn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#E8F1FA]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E0ECF7] flex items-center justify-center text-[#0D99FF] shadow-xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#7A93AD]">
                      Ngày bắt đầu thuê
                    </p>
                    <p className="text-lg font-black text-[#253F5B]">
                      {room.startDate || "01/01/2025"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E0ECF7] flex items-center justify-center text-[#0D99FF] shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#7A93AD]">
                      Ngày hết hạn
                    </p>
                    <p className="text-lg font-black text-[#253F5B]">
                      {room.endDate || "01/01/2026"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Đơn giá Dịch vụ & Tiền cọc */}
              <div className="pt-4 border-t border-[#E8F1FA] space-y-3">
                <h4 className="text-xs font-bold text-[#7A93AD] uppercase tracking-wider">
                  Bảng giá dịch vụ phòng & tiền cọc
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Điện */}
                  <div className="bg-white p-3 rounded-2xl border border-[#E3EDF6] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#7A93AD] font-bold">Điện</p>
                      <p className="text-xs font-extrabold text-[#253F5B]">
                        {room.services?.electricityPrice
                          ? `${room.services.electricityPrice.toLocaleString("vi-VN")} đ/kWh`
                          : "3.500 đ/kWh"}
                      </p>
                    </div>
                  </div>

                  {/* Nước */}
                  <div className="bg-white p-3 rounded-2xl border border-[#E3EDF6] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#7A93AD] font-bold">Nước</p>
                      <p className="text-xs font-extrabold text-[#253F5B]">
                        {room.services?.waterPrice
                          ? `${room.services.waterPrice.toLocaleString("vi-VN")} đ/${
                              room.services.waterUnit === "m3"
                                ? "m³"
                                : room.services.waterUnit === "person"
                                ? "người"
                                : "phòng"
                            }`
                          : "30.000 đ/m³"}
                      </p>
                    </div>
                  </div>

                  {/* Dịch vụ / Wifi */}
                  <div className="bg-white p-3 rounded-2xl border border-[#E3EDF6] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#7A93AD] font-bold">Wifi / Dịch vụ</p>
                      <p className="text-xs font-extrabold text-[#253F5B]">
                        {room.services?.wifiPrice
                          ? `${room.services.wifiPrice.toLocaleString("vi-VN")} đ/tháng`
                          : "50.000 đ/tháng"}
                      </p>
                    </div>
                  </div>

                  {/* Tiền cọc */}
                  <div className="bg-white p-3 rounded-2xl border border-[#E3EDF6] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <BadgeDollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#7A93AD] font-bold">Tiền cọc</p>
                      <p className="text-xs font-extrabold text-[#253F5B]">
                        {room.deposit
                          ? `${room.deposit.toLocaleString("vi-VN")} đ`
                          : room.priceFormatted}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Figma 38:186 & 38:188) */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E8F1FA]">
                <button
                  type="button"
                  onClick={() => setShowEditToast(true)}
                  className="px-6 py-2.5 rounded-[15px] border border-[#0D99FF] text-[#0D99FF] hover:bg-[#EBF6FF] active:scale-98 font-black text-sm transition-all cursor-pointer"
                >
                  Chỉnh sửa
                </button>

                <button
                  type="button"
                  onClick={() => setShowRenewModal(true)}
                  className="px-6 py-2.5 rounded-[15px] bg-[#0D99FF] hover:bg-[#0088ee] active:scale-98 text-white font-black text-sm shadow-sm transition-all cursor-pointer"
                >
                  Gia hạn hợp đồng
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Lịch sử thuê */}
          {activeTab === "history" && (
            <div className="mt-6 bg-[#F8FBFE] border border-[#E3EDF6] rounded-[30px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#253F5B] flex items-center gap-2">
                <History className="w-4 h-4 text-[#0D99FF]" />
                Lịch sử các hợp đồng thuê phòng {room.roomNumber}
              </h3>
              <div className="overflow-hidden rounded-2xl border border-[#E3EDF6] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F8FC] border-b border-[#E3EDF6] text-[#6B85A1] font-bold">
                    <tr>
                      <th className="py-3 px-4">Mã HĐ</th>
                      <th className="py-3 px-4">Người Thuê</th>
                      <th className="py-3 px-4">Thời Gian Thuê</th>
                      <th className="py-3 px-4">Giá Thuê</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5FA]">
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-[#253F5B]">
                        HD-2025-0101
                      </td>
                      <td className="py-3 px-4 font-bold text-[#253F5B]">
                        {room.tenantName !== "---"
                          ? room.tenantName
                          : "Nguyễn Văn A"}
                      </td>
                      <td className="py-3 px-4 text-[#526579]">
                        01/01/2025 - 01/01/2026
                      </td>
                      <td className="py-3 px-4 font-bold text-[#253F5B]">
                        {room.priceFormatted}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#B5DDA6] text-[#253F5B]">
                          Đang hiệu lực
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-[#7A93AD]">
                        HD-2024-0012
                      </td>
                      <td className="py-3 px-4 font-medium text-[#526579]">
                        Trần Đình Trọng
                      </td>
                      <td className="py-3 px-4 text-[#7A93AD]">
                        01/01/2024 - 31/12/2024
                      </td>
                      <td className="py-3 px-4 font-medium text-[#526579]">
                        2.400.000 đ
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6EFF8] text-[#526579]">
                          Đã thanh lý
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Ghi chú */}
          {activeTab === "notes" && (
            <div className="mt-6 bg-[#F8FBFE] border border-[#E3EDF6] rounded-[30px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#253F5B] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0D99FF]" />
                Ghi chú nội bộ & Biên bản bàn giao
              </h3>
              <div className="bg-white p-5 rounded-2xl border border-[#E3EDF6] text-sm text-[#526579] space-y-2 leading-relaxed">
                <p>
                  • <strong>Tiền cọc:</strong> Đã thu 1 tháng tiền phòng (
                  {room.priceFormatted}).
                </p>
                <p>
                  • <strong>Bàn giao chìa khóa:</strong> 02 chìa khóa phòng, 01
                  thẻ từ thang máy cho khách.
                </p>
                <p>
                  • <strong>Chỉ số đồng hồ ban đầu:</strong> Điện: 1.250 kWh,
                  Nước: 48 m³.
                </p>
                <p>
                  • <strong>Quy định:</strong> Giữ gìn trật tự sau 23h, không nuôi
                  chó mèo gây ồn ào.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Toast / Notification */}
      {showEditToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#253F5B] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">
            Chức năng chỉnh sửa thông tin phòng {room.roomNumber} đang sẵn sàng!
          </span>
          <button
            onClick={() => setShowEditToast(false)}
            className="ml-3 text-white/70 hover:text-white text-xs font-bold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Renew Modal Demo */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E3EDF6] space-y-4 animate-scaleIn">
            <h3 className="text-lg font-black text-[#253F5B]">
              Gia hạn hợp đồng phòng {room.roomNumber}
            </h3>
            <p className="text-xs text-[#7A93AD]">
              Gia hạn thêm thời gian thuê cho khách <strong>{room.tenantName}</strong>.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#526579]">
                  Kỳ hạn gia hạn
                </label>
                <select className="w-full mt-1 h-10 px-3 bg-[#F4F8FC] border border-[#D9E6F2] rounded-xl text-xs font-bold text-[#253F5B]">
                  <option>6 tháng (Đến 01/07/2026)</option>
                  <option>12 tháng (Đến 01/01/2027)</option>
                  <option>24 tháng (Đến 01/01/2028)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRenewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A93AD] hover:bg-[#F0F5FA] cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Gia hạn hợp đồng thành công!");
                  setShowRenewModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0D99FF] text-white hover:bg-[#0088ee] cursor-pointer"
              >
                Xác nhận gia hạn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Profile Modal */}
      {showTenantModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E3EDF6] space-y-4 animate-scaleIn">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#0D99FF]/10 shrink-0">
                <Image
                  src="/images/rooms/tenant-avatar.svg"
                  alt={room.tenantName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#253F5B]">
                  {room.tenantName}
                </h3>
                <p className="text-xs font-semibold text-[#7A93AD]">
                  {room.tenantRole || "Sv năm 1 - ĐH Mở"}
                </p>
              </div>
            </div>
            <div className="bg-[#F8FBFE] p-4 rounded-2xl border border-[#E3EDF6] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7A93AD]">Số điện thoại:</span>
                <span className="font-bold text-[#253F5B]">
                  {room.tenantPhone || "0912 345 678"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A93AD]">Số CCCD:</span>
                <span className="font-mono font-bold text-[#253F5B]">
                  079203001892
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A93AD]">Quê quán:</span>
                <span className="font-bold text-[#253F5B]">TP. Hồ Chí Minh</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTenantModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5C84BE] text-white hover:bg-[#4B73AD] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
