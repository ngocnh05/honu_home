"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  Layers,
  Users,
  Bike,
  Calendar,
  MapPin,
  Cake,
  Phone,
  User,
  CheckCircle2,
  Check,
  Building2,
  CreditCard,
  Clock,
  X,
  Video,
  Play,
  Film,
  Zap,
  Droplets,
  Gauge,
  FileText,
  BadgeDollarSign,
  Save,
} from "lucide-react";
import type { Room, RoomStatus, RoomType, CustomService } from "@/types/room";
import { initialBuildings } from "@/lib/mock-data/buildings";
import { getServicesByBuildingId } from "@/lib/mock-data/services";
import { useSnackbar } from "@/components/common/snackbar";
import { parseVideoSource } from "@/lib/video-helpers";

// Format 2700000 -> "2.700.000"
const formatPrice = (val: string | number | undefined): string => {
  if (val === "" || val === undefined || val === null) return "";
  const numStr = String(val).replace(/\D/g, "");
  if (!numStr) return "";
  return Number(numStr).toLocaleString("vi-VN");
};

// Parse "2.700.000" -> 2700000
const parsePrice = (formatted: string | number | undefined): number => {
  if (typeof formatted === "number") return formatted;
  if (!formatted) return 0;
  const clean = String(formatted).replace(/\D/g, "");
  return clean ? Number(clean) : 0;
};

const defaultInitialServices: CustomService[] = [
  { id: "s1", name: "Tiền điện", price: 3500, unit: "đ/kWh" },
  { id: "s2", name: "Tiền nước", price: 30000, unit: "đ/khối" },
  { id: "s3", name: "Wifi / Mạng tốc độ cao", price: 50000, unit: "đ/phòng" },
  { id: "s4", name: "Cầu thang & Vệ sinh chung", price: 100000, unit: "đ/người" },
];

const availableAmenitiesList = [
  { name: "Giường", icon: "/icons/amenities/bed.svg" },
  { name: "Tủ quần áo", icon: "/icons/amenities/wardrobe.svg" },
  { name: "Wifi", icon: "/icons/amenities/wifi.svg" },
  { name: "Máy lạnh", icon: "/icons/amenities/ac.svg" },
  { name: "Bình nóng lạnh", icon: "/icons/amenities/ac.svg" },
  { name: "Tủ lạnh", icon: "/icons/amenities/wardrobe.svg" },
  { name: "Máy giặt", icon: "/icons/amenities/wardrobe.svg" },
  { name: "Ban công", icon: "/icons/amenities/bed.svg" },
];

interface EditRoomViewProps {
  room: Room;
}

export function EditRoomView({ room }: EditRoomViewProps) {
  const router = useRouter();
  const { success } = useSnackbar();

  // 1. Basic Specs initialized from room
  const [buildingId, setBuildingId] = React.useState(room.buildingId || "bld_cg");
  const [roomNumber, setRoomNumber] = React.useState(room.roomNumber || "");
  const [type, setType] = React.useState<RoomType>(room.type || "Phòng Đơn");
  const [floor, setFloor] = React.useState<number>(room.floor || 1);
  const [price, setPrice] = React.useState<string>(formatPrice(room.price) || "2.700.000");
  const [area, setArea] = React.useState<string>(String(room.area || 20));
  const [description, setDescription] = React.useState<string>(
    room.description ||
      `Phòng ở tầng ${room.floor || 1}, thoáng mát, có ban công đón gió tự nhiên, nội thất cơ bản.`
  );
  const [status, setStatus] = React.useState<RoomStatus>(room.status || "available");
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>(
    room.amenities && room.amenities.length > 0
      ? room.amenities
      : ["Giường", "Tủ quần áo", "Wifi", "Máy lạnh"]
  );

  // 2. Images & Video
  const [coverImage, setCoverImage] = React.useState<string>(
    room.image || "/images/rooms/room-demo.png"
  );
  const [galleryImages, setGalleryImages] = React.useState<string[]>(
    room.galleryImages && room.galleryImages.length > 0
      ? room.galleryImages
      : ["/images/rooms/room-demo.png"]
  );
  const [videoUrl, setVideoUrl] = React.useState<string>(room.videoUrl || "");
  // Media slot switcher: "cover" (Hình 1), "video" (Hình 2), or number (0..n for galleryImages = Hình 3, 4, ...)
  const [selectedMediaSlot, setSelectedMediaSlot] = React.useState<"cover" | "video" | number>("cover");

  const parsedVideo = parseVideoSource(videoUrl);

  // 3. Contract & Tenant Details
  const [tenantName, setTenantName] = React.useState(
    room.tenantName && room.tenantName !== "---" ? room.tenantName : ""
  );
  const [tenantPhone, setTenantPhone] = React.useState(room.tenantPhone || "");
  const [idCardNumber, setIdCardNumber] = React.useState(room.idCardNumber || "");
  const [occupantsCount, setOccupantsCount] = React.useState<string>(
    String(room.occupantsCount || 1)
  );
  const [vehiclesCount, setVehiclesCount] = React.useState<string>(
    String(room.vehiclesCount !== undefined ? room.vehiclesCount : 1)
  );
  const [startDate, setStartDate] = React.useState(room.startDate || "01/01/2026");
  const [endDate, setEndDate] = React.useState(
    room.endDate && room.endDate !== "---" ? room.endDate : "01/01/2027"
  );
  const [deposit, setDeposit] = React.useState<string>(
    formatPrice(room.deposit) || formatPrice(room.price) || "2.700.000"
  );
  const [depositStatus, setDepositStatus] = React.useState<"paid" | "unpaid" | "refunded">(
    room.depositStatus || (room.status === "rented" ? "paid" : "unpaid")
  );
  const [paymentCycleDay, setPaymentCycleDay] = React.useState<string>(
    String(room.paymentCycleDay || 28)
  );
  const [paymentCycle, setPaymentCycle] = React.useState<string>(
    room.paymentCycle || "1 tháng/lần"
  );
  const [tenantHometown, setTenantHometown] = React.useState(room.tenantHometown || "");
  const [tenantAge, setTenantAge] = React.useState(String(room.tenantAge || ""));

  // 4. Meters & Services
  const [initialElectricityIndex, setInitialElectricityIndex] = React.useState<string>(
    String(room.initialElectricityIndex ?? 1250)
  );
  const [initialWaterIndex, setInitialWaterIndex] = React.useState<string>(
    String(room.initialWaterIndex ?? 48)
  );
  // Dịch vụ của cơ sở (Mỗi cơ sở có bảng dịch vụ riêng, phòng CHỌN dịch vụ áp dụng)
  const [roomServices, setRoomServices] = React.useState(() => {
    const catalog = getServicesByBuildingId(room.buildingId || "bld_cg");
    const existing = room.customServices || [];
    return catalog.map((s) => {
      const matched = existing.find(
        (e) => e.name.toLowerCase().trim() === s.name.toLowerCase().trim() || e.id === s.id
      );
      return {
        id: s.id,
        name: s.name,
        price: matched ? matched.price : s.price,
        unit: matched ? matched.unit : s.unit,
        type: s.type,
        selected:
          matched !== undefined ||
          s.isMandatory ||
          s.type === "meter" ||
          s.type === "per_room",
      };
    });
  });

  // 5. Notes & Handover
  const [notes, setNotes] = React.useState<string>(
    room.notes ||
      "Tiền cọc: 1 tháng tiền phòng. Hợp đồng thanh toán ngày 28 hàng tháng. Bàn giao 02 chìa khóa cơ, 01 thẻ từ thang máy."
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Toggle amenity selection
  const toggleAmenity = (amenityName: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityName)
        ? prev.filter((a) => a !== amenityName)
        : [...prev, amenityName]
    );
  };

  // Image & Video upload handlers
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
      setSelectedMediaSlot("cover");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setSelectedMediaSlot("video");
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUrls = Array.from(files).map((f) => URL.createObjectURL(f));
      setGalleryImages((prev) => [...prev, ...newUrls].slice(0, 8));
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (selectedMediaSlot === indexToRemove) {
      setSelectedMediaSlot("cover");
    } else if (typeof selectedMediaSlot === "number" && selectedMediaSlot > indexToRemove) {
      setSelectedMediaSlot(selectedMediaSlot - 1);
    }
  };

  // Khi đổi cơ sở: nạp danh mục dịch vụ của cơ sở đó
  const handleBuildingChange = (newBuildingId: string) => {
    setBuildingId(newBuildingId);
    const catalog = getServicesByBuildingId(newBuildingId);
    setRoomServices(
      catalog.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        unit: s.unit,
        type: s.type,
        selected: s.isMandatory || s.type === "meter" || s.type === "per_room",
      }))
    );
  };

  const toggleRoomService = (id: string) => {
    setRoomServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const updateRoomServicePrice = (id: string, price: number) => {
    setRoomServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomNumber.trim()) {
      alert("Vui lòng nhập số phòng!");
      return;
    }

    const cleanPrice = parsePrice(price);
    if (!cleanPrice) {
      alert("Vui lòng nhập giá thuê phòng!");
      return;
    }

    if (status === "rented" && !tenantName.trim()) {
      alert("Phòng đang thuê cần nhập họ tên người thuê!");
      return;
    }

    setIsSubmitting(true);

    const cleanDeposit = parsePrice(deposit);
    const validServices: CustomService[] = roomServices
      .filter((s) => s.selected)
      .map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        unit: s.unit,
      }));

    const selectedBuilding = initialBuildings.find((b) => b.id === buildingId);

    const updatedRoom: Room = {
      ...room,
      buildingId,
      buildingName: selectedBuilding?.name || room.buildingName || "HonuHome Cầu Giấy",
      roomNumber: roomNumber.trim().toUpperCase(),
      type,
      floor: Number(floor) || 1,
      price: cleanPrice,
      priceFormatted: `${formatPrice(cleanPrice)} đ`,
      status,
      statusLabel:
        status === "rented"
          ? "Đang Thuê"
          : status === "available"
          ? "Trống"
          : "Đang sửa",
      tenantName: status === "rented" ? tenantName.trim() : "---",
      tenantPhone: status === "rented" && tenantPhone.trim() ? tenantPhone.trim() : undefined,
      idCardNumber: status === "rented" && idCardNumber.trim() ? idCardNumber.trim() : undefined,
      startDate: status === "rented" && startDate.trim() ? startDate.trim() : undefined,
      endDate: status === "rented" && endDate.trim() ? endDate.trim() : "---",
      deposit: status === "rented" ? cleanDeposit : undefined,
      depositStatus: status === "rented" ? depositStatus : undefined,
      paymentCycleDay: Number(paymentCycleDay) || 28,
      paymentCycle,
      initialElectricityIndex: Number(initialElectricityIndex) || 0,
      initialWaterIndex: Number(initialWaterIndex) || 0,
      area: Number(area) || 20,
      description,
      notes,
      image: coverImage,
      galleryImages,
      videoUrl: videoUrl.trim() || undefined,
      amenities: selectedAmenities,
      occupantsCount: Number(occupantsCount) || 1,
      vehiclesCount: Number(vehiclesCount) || 0,
      tenantHometown: status === "rented" && tenantHometown.trim() ? tenantHometown.trim() : undefined,
      tenantAge: status === "rented" && tenantAge.trim() ? tenantAge.trim() : undefined,
      customServices: validServices,
    };

    console.log("Room Updated Successfully:", updatedRoom);

    success(`Đã lưu thay đổi phòng ${updatedRoom.roomNumber}`);
    setTimeout(() => {
      router.push(`/rooms/${updatedRoom.roomNumber}`);
    }, 350);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* 1. Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shadow-inner">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Chỉnh Sửa Phòng {room.roomNumber}
              </h1>
              <span className="text-xs font-bold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full border border-[#D8E6F3]">
                Mã: {room.id}
              </span>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Cập nhật thông số kỹ thuật, hình ảnh, video, thông tin khách thuê và dịch vụ
            </p>
          </div>
        </div>

        {/* Trạng Thái Nhanh */}
        <div className="flex items-center gap-2 bg-[#F6F9FD] p-1.5 rounded-2xl border border-[#E2EEF8] shrink-0">
          {[
            { key: "available", label: "Trống", color: "bg-[#8FBFFA] text-[#253F5B]" },
            { key: "rented", label: "Đang Thuê", color: "bg-[#B5DDA6] text-[#253F5B]" },
            { key: "maintenance", label: "Đang sửa", color: "bg-[#FFF9BF] text-[#253F5B]" },
          ].map((st) => (
            <button
              type="button"
              key={st.key}
              onClick={() => setStatus(st.key as RoomStatus)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                status === st.key
                  ? `${st.color} shadow-sm scale-105`
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2. Main Card: Bộ Sưu Tập Ảnh & Thông Số Chi Tiết */}
        <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-8 w-full">
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (4 cột): QUẢN LÝ BỘ SƯU TẬP ẢNH & VIDEO */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0F5FA]">
                <span className="text-xs font-bold text-[#253F5B] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#5C84BE]" />
                  <span>Hình ảnh & Video phòng</span>
                </span>
                <span className="text-[11px] text-[#7A93AD]">Tối đa 8 ảnh</span>
              </div>

              {/* Khung xem trước lớn (Preview Box) */}
              <div className="relative w-full h-[320px] rounded-[28px] overflow-hidden shadow-md border-2 border-[#E3EDF6] bg-slate-900 flex items-center justify-center">
                {selectedMediaSlot === "cover" && (
                  <div className="relative w-full h-full group bg-[#F8FBFE]">
                    <Image
                      src={coverImage}
                      alt="Ảnh đại diện phòng"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <label className="px-4 py-2 rounded-xl bg-white text-[#253F5B] text-xs font-bold shadow-lg hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-[#5C84BE]" />
                        <span>Đổi ảnh bìa chính (Hình 1)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
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
                            title="Video quay phòng thực tế"
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
                      <div className="p-6 text-center text-white/90 flex flex-col items-center justify-center gap-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                          <Video className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Hình 2: Video phòng (Ghim)</p>
                          <p className="text-[11px] text-slate-300 max-w-[240px] mt-0.5">
                            Chưa có video. Dán link Cloudinary (mp4), YouTube hoặc tải file video từ máy bên dưới.
                          </p>
                        </div>
                        <label className="mt-1 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Tải video từ máy</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {typeof selectedMediaSlot === "number" && galleryImages[selectedMediaSlot] && (
                  <div className="relative w-full h-full group bg-[#F8FBFE]">
                    <Image
                      src={galleryImages[selectedMediaSlot]}
                      alt={`Hình ${selectedMediaSlot + 3}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-xl text-center shadow-sm">
                      <p className="text-[11px] font-bold text-[#253F5B] flex items-center justify-center gap-1.5">
                        <span>Hình {selectedMediaSlot + 3}: Ảnh chi tiết góc phòng</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dải thumbnail theo thứ tự: Hình 1 (Bìa) -> Hình 2 (Video ghim) -> Hình 3+ (Ảnh thêm) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#526579]">
                  <span>Danh sách ảnh & video ({2 + galleryImages.length})</span>
                  <label className="text-[11px] text-[#5C84BE] hover:underline cursor-pointer flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm ảnh</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {/* 1. HÌNH 1: Ảnh bìa chính */}
                  <button
                    type="button"
                    onClick={() => setSelectedMediaSlot("cover")}
                    className={`relative w-full h-[68px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer text-left bg-gray-100 ${
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
                  <div
                    onClick={() => setSelectedMediaSlot("video")}
                    className={`relative w-full h-[68px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-900 group ${
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
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoUrl("");
                          if (selectedMediaSlot === "video") setSelectedMediaSlot("cover");
                        }}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                        title="Xóa video"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>

                  {/* 3+. HÌNH 3 TRỞ ĐI: CÁC ẢNH GÓC PHÒNG BỔ SUNG */}
                  {galleryImages.map((img, idx) => {
                    const slotNumber = idx + 3;
                    const isSelected = selectedMediaSlot === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedMediaSlot(idx)}
                        className={`relative w-full h-[68px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-gray-100 ${
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
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeGalleryImage(idx);
                          }}
                          className="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                          title="Xóa ảnh này"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Slot bấm thêm ảnh */}
                  {galleryImages.length < 8 && (
                    <label className="w-full h-[68px] rounded-xl border-2 border-dashed border-[#D5E3F0] hover:border-[#5C84BE] hover:bg-[#F4F9FD] flex flex-col items-center justify-center text-[#5C84BE] transition-colors cursor-pointer">
                      <Plus className="w-4 h-4" />
                      <span className="text-[9px] font-bold mt-0.5">+ Thêm ảnh</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Cấu hình Video phòng (Ghim ở Hình 2) */}
              <div className="space-y-2 pt-3 border-t border-[#EEF4FA]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-rose-500" />
                    <span>Cấu hình Video phòng (Ghim ở Hình 2)</span>
                  </span>
                  {videoUrl ? (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Đã có video
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-semibold">Tùy chọn</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      if (e.target.value.trim()) setSelectedMediaSlot("video");
                    }}
                    placeholder="Dán link Cloudinary (mp4), YouTube, TikTok..."
                    className="flex-1 h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-medium text-[#253F5B] transition-all placeholder:text-[#A4B3C6]"
                  />
                  <label
                    className="h-10 px-3 rounded-xl bg-[#F0F5FA] hover:bg-[#E2EEF8] text-[#253F5B] text-xs font-bold border border-[#D9E6F2] cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors"
                    title="Tải file video từ máy tính"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span className="hidden sm:inline">Tải video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Tương lai dùng <strong className="text-slate-600 font-semibold">Cloudinary</strong> lưu trữ video/ảnh miễn phí. Khi dán link hoặc chọn Hình 2, video sẽ phát xem trước trực tiếp tại khung trên.
                </p>
              </div>
            </div>

            {/* CỘT PHẢI (8 cột): THÔNG SỐ CĂN PHÒNG */}
            <div className="col-span-12 lg:col-span-8 space-y-6 pt-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#253F5B] uppercase tracking-wider pb-2 border-b border-[#F0F5FA]">
                <Layers className="w-4 h-4 text-[#5C84BE]" />
                <span>Thông số căn phòng</span>
              </div>

              {/* Thuộc cơ sở / tòa nhà */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#5C84BE]" />
                  <span>Thuộc Cơ sở / Tòa nhà *</span>
                </label>
                <select
                  value={buildingId}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs font-bold text-[#253F5B] bg-white cursor-pointer transition-all"
                >
                  {initialBuildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hàng 1: Số Phòng & Loại Phòng & Tầng */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Số Phòng *</label>
                  <input
                    type="text"
                    placeholder="VD: P102"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-bold text-[#253F5B] transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Loại Phòng</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as RoomType)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs font-bold text-[#253F5B] bg-white cursor-pointer transition-all"
                  >
                    <option value="Phòng Đơn">Phòng Đơn</option>
                    <option value="Phòng Đôi">Phòng Đôi</option>
                    <option value="Phòng Ba">Phòng Ba</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Tầng</label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value) || 1)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs font-bold text-[#253F5B] bg-white cursor-pointer transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => (
                      <option key={f} value={f}>
                        Tầng {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hàng 2: Giá Thuê & Diện Tích */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Giá Thuê Niêm Yết (đ/tháng) *</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="2.700.000"
                      value={price}
                      onChange={(e) => {
                        const formatted = formatPrice(e.target.value);
                        setPrice(formatted);
                      }}
                      className="w-full h-11 pl-4 pr-12 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-base font-black text-[#253F5B] text-right transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-bold pointer-events-none">
                      VNĐ
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Diện Tích (m²)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="20"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full h-11 pl-4 pr-12 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-bold text-[#253F5B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-bold pointer-events-none">
                      m²
                    </span>
                  </div>
                </div>
              </div>

              {/* Hàng 3: Tiện Nghi Phòng */}
              <div className="space-y-2 pt-1 border-t border-[#F0F5FA]">
                <label className="text-xs font-bold text-[#253F5B] block">
                  Tiện Nghi Sẵn Có Trong Phòng (Tích chọn)
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {availableAmenitiesList.map((item) => {
                    const isSelected = selectedAmenities.includes(item.name);
                    return (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => toggleAmenity(item.name)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-[#EAF2F8] border-[#5C84BE] text-[#253F5B] shadow-2xs"
                            : "bg-[#F8FBFE] border-[#DEEAF4] text-[#7A93AD] hover:border-[#B6D0E6]"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                            isSelected
                              ? "bg-[#5C84BE] border-[#5C84BE] text-white"
                              : "border-[#B6D0E6] bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hàng 4: Mô Tả Phòng */}
              <div className="space-y-1.5 pt-1 border-t border-[#F0F5FA]">
                <label className="text-xs font-bold text-[#253F5B]">Mô Tả Căn Hộ</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả căn hộ, hướng đón gió, ban công, nội thất..."
                  className="w-full p-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-medium text-[#253F5B] transition-all leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Card: Khách Thuê & Hợp Đồng (ĐẦY ĐỦ CÁC TRƯỜNG CHUẨN ERD) */}
        <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-6 w-full">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5C84BE]" />
              <div>
                <h3 className="text-base font-bold text-[#253F5B]">
                  Thông Tin Hợp Đồng & Khách Thuê
                </h3>
                <p className="text-xs text-[#7A93AD]">
                  Thiết lập khi phòng đã có khách vào ở (Trạng thái: Đang Thuê)
                </p>
              </div>
            </div>

            {status !== "rented" && (
              <span className="text-xs font-bold text-[#7A93AD] bg-[#F2F8FC] px-3 py-1.5 rounded-xl border border-[#D9E6F2]">
                Phòng hiện đang: {status === "available" ? "Trống" : "Đang sửa"}
              </span>
            )}
          </div>

          {status === "rented" ? (
            <div className="space-y-4">
              {/* Hàng 1: Người thuê, SĐT & CCCD/CMND */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Họ và tên khách thuê *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Văn A"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-semibold text-[#253F5B]"
                    required={status === "rented"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Số điện thoại liên hệ</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="VD: 0987.654.321"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-semibold text-[#253F5B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Số CCCD / CMND</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 038202008912"
                    value={idCardNumber}
                    onChange={(e) => setIdCardNumber(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-semibold text-[#253F5B]"
                  />
                </div>
              </div>

              {/* Hàng 2: Quê quán, Tuổi, Số người & Số xe */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Quê quán</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Hà Nội, Nghệ An..."
                    value={tenantHometown}
                    onChange={(e) => setTenantHometown(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-semibold text-[#253F5B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Cake className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Tuổi</span>
                  </label>
                  <input
                    type="number"
                    placeholder="22"
                    value={tenantAge}
                    onChange={(e) => setTenantAge(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-semibold text-[#253F5B] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Số người ở</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="1"
                      value={occupantsCount}
                      onChange={(e) => setOccupantsCount(e.target.value)}
                      className="w-full h-10 px-3 pr-10 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-semibold text-[#253F5B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#7A93AD] font-medium pointer-events-none">
                      người
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Số xe máy</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="1"
                      value={vehiclesCount}
                      onChange={(e) => setVehiclesCount(e.target.value)}
                      className="w-full h-10 px-3 pr-8 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-semibold text-[#253F5B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#7A93AD] font-medium pointer-events-none">
                      xe
                    </span>
                  </div>
                </div>
              </div>

              {/* Hàng 3: Ngày bắt đầu HĐ, Ngày kết thúc, Ngày chốt tiền, Chu kỳ thanh toán */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Ngày bắt đầu HĐ</span>
                  </label>
                  <input
                    type="text"
                    placeholder="01/01/2026"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs text-[#253F5B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Ngày kết thúc (Hạn HĐ)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="01/01/2027"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs text-[#253F5B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Ngày chốt tiền hàng tháng</span>
                  </label>
                  <select
                    value={paymentCycleDay}
                    onChange={(e) => setPaymentCycleDay(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs font-bold text-[#253F5B] bg-white cursor-pointer"
                  >
                    {[1, 5, 10, 15, 20, 25, 28, 30].map((d) => (
                      <option key={d} value={d}>
                        Ngày {d} hàng tháng
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <BadgeDollarSign className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Chu kỳ đóng tiền</span>
                  </label>
                  <select
                    value={paymentCycle}
                    onChange={(e) => setPaymentCycle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs font-bold text-[#253F5B] bg-white cursor-pointer"
                  >
                    <option value="1 tháng/lần">1 tháng / lần</option>
                    <option value="3 tháng/lần">3 tháng / lần</option>
                    <option value="6 tháng/lần">6 tháng / lần</option>
                    <option value="1 năm/lần">1 năm / lần</option>
                  </select>
                </div>
              </div>

              {/* Hàng 4: Tiền đặt cọc & Trạng thái thu cọc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Tiền Đặt Cọc Hợp Đồng (VNĐ)</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="2.700.000"
                      value={deposit}
                      onChange={(e) => setDeposit(formatPrice(e.target.value))}
                      className="w-full h-10 pl-3.5 pr-12 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-bold text-[#253F5B] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-bold pointer-events-none">
                      VNĐ
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Trạng thái tiền cọc</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDepositStatus("paid")}
                      className={`h-10 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        depositStatus === "paid"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                          : "bg-[#F8FAFD] border-[#D2E2F0] text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      ✓ Đã thu cọc
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositStatus("unpaid")}
                      className={`h-10 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        depositStatus === "unpaid"
                          ? "bg-amber-50 border-amber-500 text-amber-800 shadow-xs"
                          : "bg-[#F8FAFD] border-[#D2E2F0] text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      Chưa thu cọc
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-[#CFDFEE] bg-[#F8FBFE] flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
              <p className="text-base font-bold text-[#253F5B]">Phòng trống sẵn sàng đón khách</p>
              <p className="text-xs text-[#7A93AD] mt-1 max-w-[420px]">
                Chọn trạng thái <b>"Đang Thuê"</b> ở trên nếu phòng đã có khách vào ở để cấu hình hồ sơ người thuê và hợp đồng
              </p>
            </div>
          )}
        </div>

        {/* 4. Card: Chỉ Số Công Tơ Bàn Giao Ban Đầu */}
        <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-4 w-full">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0F5FA]">
            <Gauge className="w-5 h-5 text-[#5C84BE]" />
            <div>
              <h3 className="text-base font-bold text-[#253F5B]">
                Chỉ Số Đồng Hồ Bàn Giao Ban Đầu
              </h3>
              <p className="text-xs text-[#7A93AD]">
                Làm căn cứ để đối chiếu chốt tiền điện & nước trong hóa đơn tháng đầu tiên
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Chỉ số công tơ điện ban đầu</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="1250"
                  value={initialElectricityIndex}
                  onChange={(e) => setInitialElectricityIndex(e.target.value)}
                  className="w-full h-10 px-3.5 pr-14 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-bold text-[#253F5B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-bold pointer-events-none">
                  kWh
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>Chỉ số đồng hồ nước ban đầu</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="48"
                  value={initialWaterIndex}
                  onChange={(e) => setInitialWaterIndex(e.target.value)}
                  className="w-full h-10 px-3.5 pr-12 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-bold text-[#253F5B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-bold pointer-events-none">
                  m³
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Card: Bảng Dịch Vụ Áp Dụng Cho Căn Hộ */}
        <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F5FA]">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-black text-[#253F5B]">
                  Bảng Dịch Vụ Áp Dụng Cho Phòng
                </h3>
                <p className="text-xs text-[#7A93AD]">
                  Mỗi cơ sở có danh mục dịch vụ riêng. Chọn những dịch vụ căn phòng này sử dụng hoặc chỉnh đơn giá riêng nếu có.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#5C84BE] bg-[#EAF2F8] px-3.5 py-1.5 rounded-full border border-[#D8E6F3] self-start sm:self-center">
              Đã chọn {roomServices.filter((s) => s.selected).length}/{roomServices.length} dịch vụ
            </span>
          </div>

          {/* Danh sách checkbox dịch vụ của cơ sở */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {roomServices.map((srv) => (
              <div
                key={srv.id}
                onClick={() => toggleRoomService(srv.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  srv.selected
                    ? "border-[#5C84BE] bg-[#F8FBFE] shadow-2xs"
                    : "border-[#EAF0F6] bg-white opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      srv.selected
                        ? "bg-[#5C84BE] text-white shadow-xs"
                        : "border-2 border-slate-300 bg-white"
                    }`}
                  >
                    {srv.selected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#253F5B] block">
                      {srv.name}
                    </span>
                    <span className="text-[10px] text-[#7A93AD] font-semibold">
                      {srv.type === "meter"
                        ? "Đo theo công tơ"
                        : srv.type === "per_person"
                        ? "Theo đầu người"
                        : srv.type === "per_vehicle"
                        ? "Theo số xe"
                        : "Theo phòng"}
                    </span>
                  </div>
                </div>

                {/* Giá dịch vụ: hiển thị hoặc cho phép điều chỉnh giá riêng cho phòng */}
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={formatPrice(srv.price)}
                      onChange={(e) =>
                        updateRoomServicePrice(srv.id, parsePrice(e.target.value))
                      }
                      disabled={!srv.selected}
                      className={`w-28 h-9 px-2.5 rounded-xl border text-right text-xs font-bold transition-all ${
                        srv.selected
                          ? "bg-white border-[#D5E3F0] text-[#253F5B] focus:border-[#5C84BE]"
                          : "bg-slate-100 border-slate-200 text-slate-400"
                      }`}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#5C84BE] min-w-[55px]">
                    {srv.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F0F5FA] border border-[#DEEAF4] flex items-center justify-between text-xs text-[#526579]">
            <span>
              Cần bổ sung thêm dịch vụ mới cho toàn cơ sở? Quản lý tại trang:
            </span>
            <Link
              href="/services"
              className="font-bold text-[#5C84BE] hover:underline flex items-center gap-1"
            >
              <span>Bảng giá Dịch vụ cơ sở</span> &rarr;
            </Link>
          </div>
        </div>

        {/* 6. Card: Ghi Chú Bàn Giao & Nội Quy Phòng */}
        <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-4 w-full">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0F5FA]">
            <FileText className="w-5 h-5 text-[#5C84BE]" />
            <div>
              <h3 className="text-base font-bold text-[#253F5B]">
                Ghi Chú Bàn Giao & Nội Quy Phòng
              </h3>
              <p className="text-xs text-[#7A93AD]">
                Số lượng chìa khóa cơ, thẻ từ thang máy, tài sản bàn giao và nội quy cần lưu ý
              </p>
            </div>
          </div>

          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="VD: Bàn giao 02 chìa khóa phòng, 01 thẻ từ thang máy cho khách. Tiền cọc giữ 1 tháng. Quy định giữ gìn trật tự sau 23h..."
            className="w-full p-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-medium text-[#253F5B] transition-all leading-relaxed"
          />
        </div>

        {/* 7. Bottom Sticky Actions Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between bg-white/95 backdrop-blur-md px-8 py-4 rounded-3xl border border-[#E3EDF6] shadow-xl">
          <div className="text-xs text-[#7A93AD] font-medium">
            Phòng: <b className="text-[#253F5B]">{roomNumber || room.roomNumber}</b> •{" "}
            Giá: <b className="text-[#253F5B]">{price || 0} đ/tháng</b> •{" "}
            Dịch vụ: <b className="text-[#253F5B]">{roomServices.filter((s) => s.selected).length} khoản</b>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/rooms/${room.roomNumber}`}
              className="h-11 px-6 rounded-2xl border border-[#D9E6F2] hover:bg-gray-50 text-xs font-bold text-[#5C728C] transition-all flex items-center justify-center cursor-pointer"
            >
              Hủy bỏ
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 rounded-2xl bg-[#5C84BE] hover:bg-[#4B73AD] active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#5C84BE]/25 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Đang lưu..." : "Lưu Thông Tin Phòng"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
