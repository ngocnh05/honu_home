"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
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
  BadgeDollarSign,
  Video,
  Play,
  Building2,
  CreditCard,
  Gauge,
  Users,
  Bike,
  MapPin,
  Cake,
} from "lucide-react";
import type { Room, CustomService } from "@/types/room";
import { parseVideoSource } from "@/lib/video-helpers";
import { getServicesByBuildingId } from "@/lib/mock-data/services";

interface RoomDetailViewProps {
  room: Room;
}

export function RoomDetailView({ room }: RoomDetailViewProps) {
  const [activeTab, setActiveTab] = React.useState<"general" | "history" | "notes">(
    "general"
  );
  const [showRenewModal, setShowRenewModal] = React.useState(false);
  const [showTenantModal, setShowTenantModal] = React.useState(false);

  const coverImage = room.image || "/images/rooms/room-demo.png";
  const galleryImages = room.galleryImages && room.galleryImages.length > 0
    ? room.galleryImages
    : [];
  const parsedVideo = parseVideoSource(room.videoUrl);

  // Media slot switcher: "cover" (Hình 1), "video" (Hình 2), or number (0..n for galleryImages = Hình 3, 4, ...)
  const [selectedMediaSlot, setSelectedMediaSlot] = React.useState<"cover" | "video" | number>("cover");

  // Dịch vụ phòng: lấy từ room.customServices hoặc theo cơ sở của phòng
  const activeServices: CustomService[] = React.useMemo(() => {
    if (room.customServices && room.customServices.length > 0) {
      return room.customServices;
    }
    const bldServices = getServicesByBuildingId(room.buildingId || "bld_cg");
    return bldServices.map((s) => ({
      id: s.id,
      name: s.name,
      price: s.price,
      unit: s.unit,
      selectedOptionLabel: s.priceOptions?.[0]?.label,
      type: s.type,
    }));
  }, [room.customServices, room.buildingId]);

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

  const amenities = React.useMemo(() => {
    if (room.amenities && room.amenities.length > 0) {
      return room.amenities.map((name) => ({
        name,
        icon: name.includes("Giường")
          ? "/icons/amenities/bed.svg"
          : name.includes("Tủ")
          ? "/icons/amenities/wardrobe.svg"
          : name.includes("Wifi")
          ? "/icons/amenities/wifi.svg"
          : "/icons/amenities/ac.svg",
      }));
    }
    return [
      { name: "Giường", icon: "/icons/amenities/bed.svg" },
      { name: "Tủ", icon: "/icons/amenities/wardrobe.svg" },
      { name: "Wifi", icon: "/icons/amenities/wifi.svg" },
      { name: "Máy lạnh", icon: "/icons/amenities/ac.svg" },
    ];
  }, [room.amenities]);

  return (
    <div className="w-full space-y-5 animate-fadeIn pb-12 select-none">
      {/* 1. Top Header Bar: Status Badge + Tiêu đề phòng + Nút Sửa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center justify-center px-5 py-2 rounded-[20px] text-base font-extrabold shadow-sm ${currentStatus.bg} ${currentStatus.text}`}
          >
            {currentStatus.label}
          </span>

          {/* Room Title */}
          <div className="flex items-center flex-wrap gap-2.5">
            <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
              Phòng - {room.roomNumber}
            </h1>
            {room.buildingName && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-xl border border-[#D8E6F3]">
                <Building2 className="w-3.5 h-3.5" />
                {room.buildingName}
              </span>
            )}
            {room.floor && (
              <span className="text-xs font-bold text-[#7A93AD] bg-[#F2F6FA] px-2.5 py-1 rounded-lg">
                Tầng {room.floor}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/rooms/${room.roomNumber}/edit`}
            className="h-10 px-4.5 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-[#5C84BE]/25 transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Sửa thông tin phòng</span>
          </Link>
          <span className="text-xs font-semibold text-[#7A93AD]">Mã phòng:</span>
          <span className="font-mono font-bold text-xs text-[#253F5B] bg-[#F2F8FC] px-3 py-2 rounded-xl border border-[#DCE8F3]">
            {room.id}
          </span>
        </div>
      </div>

      {/* 2. Main Detail Card */}
      <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-8 w-full">
        {/* Top Info Section: Ảnh phòng + Gallery + Thông số chi tiết */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Xem trước Hình ảnh & Video theo thứ tự 1.Bìa - 2.Video - 3+.Góc */}
          <div className="col-span-12 lg:col-span-4 space-y-3.5">
            {/* Khung xem trước lớn (Preview Box) */}
            <div className="relative w-full h-[320px] rounded-[28px] overflow-hidden shadow-md border-2 border-[#E3EDF6] bg-slate-900 flex items-center justify-center">
              {selectedMediaSlot === "cover" && (
                <div className="relative w-full h-full group bg-[#F8FBFE]">
                  <Image
                    src={coverImage}
                    alt={`Ảnh phòng ${room.roomNumber}`}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-xl text-center shadow-sm">
                    <p className="text-[11px] font-bold text-[#253F5B] flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#5C84BE]" />
                      <span>Hình 1: Ảnh đại diện chính phòng</span>
                    </p>
                  </div>
                </div>
              )}

              {selectedMediaSlot === "video" && (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  {parsedVideo ? (
                    <>
                      {parsedVideo.type === "youtube" ? (
                        <iframe
                          src={parsedVideo.src}
                          title={`Video phòng ${room.roomNumber}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      ) : (
                        <video
                          key={parsedVideo.src}
                          src={parsedVideo.src}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      )}
                      <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span>Hình 2: Video quay phòng (Cloudinary / MP4)</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-white/90 flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                        <Video className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-white">Chưa có video quay phòng</p>
                      <p className="text-[11px] text-slate-300 max-w-[220px]">
                        Bấm nút &quot;Chỉnh sửa phòng&quot; để bổ sung video Cloudinary hoặc YouTube
                      </p>
                    </div>
                  )}
                </div>
              )}

              {typeof selectedMediaSlot === "number" && galleryImages[selectedMediaSlot] && (
                <div className="relative w-full h-full group bg-[#F8FBFE]">
                  <Image
                    src={galleryImages[selectedMediaSlot]}
                    alt={`Góc phòng ${selectedMediaSlot + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-xl text-center shadow-sm">
                    <p className="text-[11px] font-bold text-[#253F5B] flex items-center justify-center gap-1.5">
                      <span>Hình {selectedMediaSlot + 3}: Ảnh góc phòng</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Dải Thumbnail theo thứ tự: Hình 1 (Bìa) -> Hình 2 (Video ghim) -> Hình 3+ (Ảnh thêm) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#526579]">
                <span>Thư viện media ({2 + galleryImages.length})</span>
                <span className="text-[10px] text-[#7A93AD]">Bấm để xem to / phát video</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {/* 1. HÌNH 1: Ảnh bìa chính */}
                <button
                  type="button"
                  onClick={() => setSelectedMediaSlot("cover")}
                  className={`relative w-full h-[66px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer text-left bg-gray-100 ${
                    selectedMediaSlot === "cover"
                      ? "border-[#5C84BE] ring-2 ring-[#5C84BE]/25 shadow-sm scale-102"
                      : "border-[#D9E6F2] hover:border-slate-400 opacity-90"
                  }`}
                  title="Hình 1: Ảnh đại diện chính"
                >
                  <Image
                    src={coverImage}
                    alt="Hình 1: Ảnh bìa"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md leading-none">
                    Hình 1
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold py-0.5 text-center truncate">
                    Ảnh bìa
                  </div>
                </button>

                {/* 2. HÌNH 2: VIDEO GHIM CỐ ĐỊNH */}
                <button
                  type="button"
                  onClick={() => setSelectedMediaSlot("video")}
                  className={`relative w-full h-[66px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-900 group ${
                    selectedMediaSlot === "video"
                      ? "border-rose-500 ring-2 ring-rose-500/30 shadow-sm scale-102"
                      : "border-[#D9E6F2] hover:border-rose-400"
                  }`}
                  title="Hình 2: Video quay phòng thực tế (Ghim)"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900">
                    <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-3 h-3 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md leading-none shadow-xs">
                    Hình 2
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-xs text-rose-200 text-[8px] font-bold py-0.5 text-center truncate">
                    ▶ Video (Ghim)
                  </div>
                </button>

                {/* 3+. HÌNH 3 TRỞ ĐI: CÁC ẢNH GÓC PHÒNG BỔ SUNG */}
                {galleryImages.map((img, idx) => {
                  const slotNumber = idx + 3;
                  const isSelected = selectedMediaSlot === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedMediaSlot(idx)}
                      className={`relative w-full h-[66px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-gray-100 ${
                        isSelected
                          ? "border-[#5C84BE] ring-2 ring-[#5C84BE]/25 shadow-sm scale-102"
                          : "border-[#D9E6F2] hover:border-slate-400 opacity-90"
                      }`}
                      title={`Hình ${slotNumber}: Ảnh góc phòng`}
                    >
                      <Image
                        src={img}
                        alt={`Hình ${slotNumber}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md leading-none">
                        Hình {slotNumber}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Direct Link to video if available */}
              {room.videoUrl && (
                <div className="pt-2">
                  <a
                    href={room.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                  >
                    <Video className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
                    <span>Mở link video gốc ({parsedVideo?.type === "youtube" ? "YouTube" : "Cloudinary"})</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bảng thông số chi tiết */}
          <div className="col-span-12 lg:col-span-8 space-y-5 pt-1">
            {/* 1. Loại phòng & Tầng */}
            <div className="grid grid-cols-12 items-center border-b border-[#F0F5FA] pb-3.5">
              <span className="col-span-4 text-sm font-semibold text-[#526579]">
                Loại phòng & Tầng
              </span>
              <div className="col-span-8 flex items-center gap-2">
                <span className="text-base font-black text-[#253F5B]">
                  {room.type}
                </span>
                <span className="text-xs font-bold text-[#5C84BE] bg-[#EAF2F8] px-2 py-0.5 rounded-md">
                  Tầng {room.floor || 1}
                </span>
              </div>
            </div>

            {/* 2. Giá thuê & Tiền cọc */}
            <div className="grid grid-cols-12 items-center border-b border-[#F0F5FA] pb-3.5">
              <span className="col-span-4 text-sm font-semibold text-[#526579]">
                Giá thuê & Tiền cọc
              </span>
              <div className="col-span-8 flex flex-wrap items-baseline gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#253F5B] tracking-tight">
                    {room.priceFormatted}
                  </span>
                  <span className="text-xs font-medium text-[#7A93AD]">/tháng</span>
                </div>
                {room.deposit !== undefined && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Cọc: {room.deposit.toLocaleString("vi-VN")} đ
                    {room.depositStatus === "paid" ? " (Đã thu)" : " (Chưa thu)"}
                  </span>
                )}
              </div>
            </div>

            {/* 3. Diện tích */}
            <div className="grid grid-cols-12 items-center border-b border-[#F0F5FA] pb-3.5">
              <span className="col-span-4 text-sm font-semibold text-[#526579]">
                Diện tích phòng
              </span>
              <span className="col-span-8 text-base font-black text-[#253F5B]">
                {room.area || 20} m²
              </span>
            </div>

            {/* 4. Tiện nghi sẵn có */}
            <div className="grid grid-cols-12 items-center border-b border-[#F0F5FA] pb-4">
              <span className="col-span-4 text-sm font-semibold text-[#526579]">
                Tiện nghi trong phòng
              </span>
              <div className="col-span-8 flex flex-wrap items-center gap-2.5">
                {amenities.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 bg-[#F6F9FD] px-3 py-1.5 rounded-xl border border-[#E3EDF6] hover:border-[#5C84BE] transition-colors"
                  >
                    <div className="w-5 h-5 relative shrink-0">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#253F5B]">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Khách thuê hiện tại */}
            <div className="grid grid-cols-12 items-center pt-1">
              <span className="col-span-4 text-sm font-semibold text-[#526579]">
                Khách thuê hiện tại
              </span>
              <div className="col-span-8">
                {room.tenantName !== "---" ? (
                  <div className="bg-[#F8FBFE] p-4 rounded-2xl border border-[#E2EEF8] space-y-3 max-w-[560px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-[#0D99FF]/10 flex items-center justify-center">
                          <Image
                            src="/images/rooms/tenant-avatar.svg"
                            alt={room.tenantName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-[#253F5B]">
                              {room.tenantName}
                            </h4>
                            {room.tenantPhone && (
                              <a
                                href={`tel:${room.tenantPhone}`}
                                className="text-xs font-bold text-[#5C84BE] hover:underline flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-[#D5E3F0]"
                              >
                                <Phone className="w-3 h-3 text-[#5C84BE]" />
                                <span>{room.tenantPhone}</span>
                              </a>
                            )}
                          </div>
                          {room.idCardNumber && (
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5 flex items-center gap-1">
                              <CreditCard className="w-3 h-3 text-[#7A93AD]" />
                              <span>CCCD: {room.idCardNumber}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowTenantModal(true)}
                        className="bg-[#0D99FF] hover:bg-[#0088ee] active:scale-95 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        Xem hồ sơ
                      </button>
                    </div>

                    {/* Nhân khẩu & Quê quán */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E8F1FA] text-xs font-semibold text-[#668099]">
                      {room.tenantHometown && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#5C84BE]" />
                          Quê {room.tenantHometown}
                        </span>
                      )}
                      {room.tenantAge && (
                        <span className="flex items-center gap-1">
                          <Cake className="w-3.5 h-3.5 text-[#5C84BE]" />
                          {room.tenantAge} tuổi
                        </span>
                      )}
                      {room.occupantsCount ? (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#5C84BE]" />
                          {room.occupantsCount} người ở
                        </span>
                      ) : null}
                      {room.vehiclesCount !== undefined ? (
                        <span className="flex items-center gap-1">
                          <Bike className="w-3.5 h-3.5 text-[#5C84BE]" />
                          {room.vehiclesCount} xe máy
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-[#F8FBFE] p-4 rounded-2xl border border-dashed border-[#D2E2F0] max-w-[560px]">
                    <div className="flex items-center gap-3 text-xs font-bold text-[#7A93AD]">
                      <UserCheck className="w-5 h-5 text-[#8FA8C4]" />
                      <span>Phòng hiện đang trống, chưa có người thuê</span>
                    </div>
                    <Link
                      href={`/rooms/${room.roomNumber}/edit`}
                      className="bg-[#5C84BE] hover:bg-[#4B73AD] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                      + Nhập hợp đồng
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Tabs Section */}
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
              Hợp đồng & Dịch vụ
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
              Mô tả & Bàn giao
              {activeTab === "notes" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0D99FF] rounded-full" />
              )}
            </button>
          </div>

          {/* Tab 1: Hợp đồng & Dịch vụ */}
          {activeTab === "general" && (
            <div className="mt-6 bg-[#F8FBFE] border border-[#E3EDF6] rounded-[30px] p-8 space-y-6">
              {/* Thẻ Hợp Đồng & Thanh Toán */}
              <div>
                <h3 className="text-xs font-bold text-[#7A93AD] uppercase tracking-wider mb-3">
                  Thông Tin Hợp Đồng & Chu Kỳ Thanh Toán
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-3.5 rounded-2xl border border-[#E0ECF7]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#7A93AD]">
                      <Calendar className="w-3.5 h-3.5 text-[#0D99FF]" />
                      <span>Bắt đầu thuê</span>
                    </div>
                    <p className="text-base font-black text-[#253F5B] mt-1">
                      {room.startDate || "01/01/2026"}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#E0ECF7]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#7A93AD]">
                      <Clock className="w-3.5 h-3.5 text-[#0D99FF]" />
                      <span>Hết hạn HĐ</span>
                    </div>
                    <p className="text-base font-black text-[#253F5B] mt-1">
                      {room.endDate || "01/01/2027"}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#E0ECF7]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#7A93AD]">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ngày chốt tiền</span>
                    </div>
                    <p className="text-base font-black text-[#253F5B] mt-1">
                      Ngày {room.paymentCycleDay || 28} hàng tháng
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#E0ECF7]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#7A93AD]">
                      <BadgeDollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Chu kỳ đóng tiền</span>
                    </div>
                    <p className="text-base font-black text-[#253F5B] mt-1">
                      {room.paymentCycle || "1 tháng/lần"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chỉ số công tơ ban đầu */}
              <div className="pt-4 border-t border-[#E8F1FA] space-y-3">
                <h4 className="text-xs font-bold text-[#7A93AD] uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#5C84BE]" />
                  <span>Chỉ Số Công Tơ Bàn Giao Ban Đầu</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-2xl border border-[#E3EDF6] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#7A93AD]">Công tơ điện bàn giao</p>
                        <p className="text-base font-black text-[#253F5B]">
                          {room.initialElectricityIndex ?? 1250} kWh
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      Chỉ số gốc
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#E3EDF6] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#7A93AD]">Đồng hồ nước bàn giao</p>
                        <p className="text-base font-black text-[#253F5B]">
                          {room.initialWaterIndex ?? 48} m³
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                      Chỉ số gốc
                    </span>
                  </div>
                </div>
              </div>

              {/* Bảng giá dịch vụ phòng */}
              <div className="pt-4 border-t border-[#E8F1FA] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#7A93AD] uppercase tracking-wider">
                    Bảng giá dịch vụ áp dụng cho căn phòng
                  </h4>
                  <span className="text-xs font-bold text-[#5C84BE] bg-[#EAF2F8] px-2.5 py-0.5 rounded-full">
                    {activeServices.length} khoản dịch vụ
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="bg-white p-3 rounded-2xl border border-[#E3EDF6] flex items-center gap-2.5 shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#7A93AD] font-bold truncate">
                          {srv.name}
                        </p>
                        <p className="text-xs font-extrabold text-[#253F5B] truncate">
                          {srv.price.toLocaleString("vi-VN")} {srv.unit}
                        </p>
                        {srv.selectedOptionLabel && (
                          <p className="text-[10px] text-[#5C84BE] font-semibold truncate" title={srv.selectedOptionLabel}>
                            {srv.selectedOptionLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E8F1FA]">
                <Link
                  href={`/rooms/${room.roomNumber}/edit`}
                  className="px-6 py-2.5 rounded-[15px] border border-[#0D99FF] text-[#0D99FF] hover:bg-[#EBF6FF] active:scale-98 font-black text-sm transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa phòng</span>
                </Link>

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
                      <th className="py-3 px-4">Tiền Cọc</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5FA]">
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-[#253F5B]">
                        HD-2025-0101
                      </td>
                      <td className="py-3 px-4 font-bold text-[#253F5B]">
                        {room.tenantName !== "---" ? room.tenantName : "Nguyễn Văn A"}
                      </td>
                      <td className="py-3 px-4 text-[#526579]">
                        {room.startDate || "01/01/2025"} - {room.endDate || "01/01/2026"}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#253F5B]">
                        {room.priceFormatted}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600">
                        {room.deposit ? `${room.deposit.toLocaleString("vi-VN")} đ` : room.priceFormatted}
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
                      <td className="py-3 px-4 font-medium text-[#7A93AD]">
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

          {/* Tab 3: Mô tả & Bàn giao */}
          {activeTab === "notes" && (
            <div className="mt-6 bg-[#F8FBFE] border border-[#E3EDF6] rounded-[30px] p-6 space-y-5">
              {/* Mô tả phòng */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#253F5B] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0D99FF]" />
                  Mô tả đặc điểm căn hộ
                </h3>
                <div className="bg-white p-4.5 rounded-2xl border border-[#E3EDF6] text-sm text-[#526579] leading-relaxed">
                  {room.description ||
                    `Phòng ở tầng ${room.floor || 1}, không gian sạch sẽ, thoáng mát, có cửa sổ đón gió tự nhiên, nội thất trang bị cơ bản.`}
                </div>
              </div>

              {/* Ghi chú bàn giao & Biên bản */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#253F5B] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0D99FF]" />
                  Ghi chú nội bộ & Biên bản bàn giao tài sản
                </h3>
                <div className="bg-white p-4.5 rounded-2xl border border-[#E3EDF6] text-sm text-[#526579] leading-relaxed">
                  {room.notes ||
                    "Tiền cọc: 1 tháng tiền phòng. Hợp đồng thanh toán ngày 28 hàng tháng. Bàn giao 02 chìa khóa cơ, 01 thẻ từ thang máy. Quy định giữ gìn trật tự sau 23h, không nuôi chó mèo gây ồn ào."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Renew Modal Demo */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E3EDF6] space-y-4">
            <h3 className="text-lg font-black text-[#253F5B]">
              Gia hạn hợp đồng phòng {room.roomNumber}
            </h3>
            <p className="text-xs text-[#7A93AD]">
              Gia hạn thêm thời hạn thuê cho khách thuê hiện tại ({room.tenantName}).
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#253F5B]">Thời hạn gia hạn</label>
              <select className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-bold text-[#253F5B] outline-none">
                <option>Thêm 6 tháng (đến 01/07/2027)</option>
                <option>Thêm 1 năm (đến 01/01/2028)</option>
                <option>Thêm 2 năm (đến 01/01/2029)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRenewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Đã gửi yêu cầu gia hạn hợp đồng phòng ${room.roomNumber}!`);
                  setShowRenewModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0D99FF] text-white hover:bg-[#0088ee] cursor-pointer"
              >
                Xác nhận gia hạn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Modal Demo */}
      {showTenantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E3EDF6] space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-[#0D99FF]/10 flex items-center justify-center">
                <Image
                  src="/images/rooms/tenant-avatar.svg"
                  alt={room.tenantName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#253F5B]">{room.tenantName}</h3>
                <p className="text-xs font-semibold text-[#7A93AD]">
                  Khách thuê phòng {room.roomNumber}
                </p>
              </div>
            </div>

            <div className="space-y-2 bg-[#F8FBFE] p-4 rounded-2xl border border-[#E3EDF6] text-xs">
              <div className="flex justify-between py-1 border-b border-[#EEF4FA]">
                <span className="text-slate-400 font-semibold">Số điện thoại:</span>
                <span className="font-bold text-[#253F5B]">{room.tenantPhone || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EEF4FA]">
                <span className="text-slate-400 font-semibold">Số CCCD / CMND:</span>
                <span className="font-bold text-[#253F5B]">{room.idCardNumber || "038202008912"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EEF4FA]">
                <span className="text-slate-400 font-semibold">Quê quán:</span>
                <span className="font-bold text-[#253F5B]">{room.tenantHometown || "Nghệ An"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EEF4FA]">
                <span className="text-slate-400 font-semibold">Tuổi:</span>
                <span className="font-bold text-[#253F5B]">{room.tenantAge || "22"} tuổi</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-semibold">Quy mô ở:</span>
                <span className="font-bold text-[#253F5B]">
                  {room.occupantsCount || 1} người • {room.vehiclesCount || 1} xe máy
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
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
