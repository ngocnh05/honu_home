"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
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
  Wrench,
  Check,
  Building2,
  ShieldCheck,
  ImageIcon,
  X,
  Video,
} from "lucide-react";
import type { Room, RoomStatus, RoomType, CustomService } from "@/types/room";

// Format 2700000 -> "2.700.000"
const formatPrice = (val: string | number | undefined): string => {
  if (val === "" || val === undefined || val === null) return "";
  const numStr = String(val).replace(/\D/g, "");
  if (!numStr) return "";
  return Number(numStr).toLocaleString("vi-VN");
};

// Parse "2.700.000" -> 2700000 (Number an toàn)
const parsePrice = (formatted: string | number | undefined): number => {
  if (typeof formatted === "number") return formatted;
  if (!formatted) return 0;
  const clean = String(formatted).replace(/\D/g, "");
  return clean ? Number(clean) : 0;
};

const defaultInitialServices: CustomService[] = [
  { id: "s1", name: "Tiền điện", price: 3500, unit: "đ/kWh" },
  { id: "s2", name: "Tiền nước", price: 30000, unit: "đ/khối" },
  { id: "s3", name: "Wifi / Mạng", price: 50000, unit: "đ/phòng" },
  { id: "s4", name: "Cầu thang & Vệ sinh", price: 100000, unit: "đ/người" },
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

export function CreateRoomView() {
  const router = useRouter();

  // Basic Info
  const [buildingId, setBuildingId] = React.useState("bld_cg");
  const [roomNumber, setRoomNumber] = React.useState("");
  const [type, setType] = React.useState<RoomType>("Phòng Đơn");
  const [floor, setFloor] = React.useState<number>(1);
  const [price, setPrice] = React.useState<string>("2.700.000");
  const [area, setArea] = React.useState("20");
  const [description, setDescription] = React.useState(
    "Phòng mới sạch sẽ, thoáng mát, có ban công đón gió tự nhiên, nội thất cơ bản."
  );
  const [status, setStatus] = React.useState<RoomStatus>("available");
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([
    "Giường",
    "Tủ quần áo",
    "Wifi",
    "Máy lạnh",
  ]);

  // Images: Main Cover Image + Sub Gallery Images
  const [coverImage, setCoverImage] = React.useState<string>(
    "/images/rooms/room-demo.png"
  );
  const [galleryImages, setGalleryImages] = React.useState<string[]>([
    "/images/rooms/room-demo.png",
  ]);
  const [videoUrl, setVideoUrl] = React.useState<string>("");

  // Contract Details theo đúng thứ tự:
  // 1. Người thuê, 2. Số điện thoại, 3. Số người ở, 4. Số xe, 5. Ngày bắt đầu HĐ, 6. Ngày kết thúc, 7. Tiền đặt cọc, 8. Quê quán, 9. Tuổi
  const [tenantName, setTenantName] = React.useState("");
  const [tenantPhone, setTenantPhone] = React.useState("");
  const [occupantsCount, setOccupantsCount] = React.useState<string>("1");
  const [vehiclesCount, setVehiclesCount] = React.useState<string>("1");
  const [startDate, setStartDate] = React.useState("01/01/2026");
  const [endDate, setEndDate] = React.useState("01/01/2027");
  const [deposit, setDeposit] = React.useState<string>("2.700.000");
  const [tenantHometown, setTenantHometown] = React.useState("");
  const [tenantAge, setTenantAge] = React.useState("");

  // Dynamic Custom Services List
  const [services, setServices] = React.useState<CustomService[]>(defaultInitialServices);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Toggle amenity selection
  const toggleAmenity = (amenityName: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityName)
        ? prev.filter((a) => a !== amenityName)
        : [...prev, amenityName]
    );
  };

  // Image upload handlers
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
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
  };

  // Service helpers
  const handleAddService = () => {
    const newService: CustomService = {
      id: `srv_${Date.now()}_${Math.random()}`,
      name: "",
      price: 0,
      unit: "đ/tháng",
    };
    setServices((prev) => [...prev, newService]);
  };

  const handleRemoveService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateService = (
    id: string,
    field: keyof CustomService,
    value: string | number
  ) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      alert("Vui lòng nhập số phòng!");
      return;
    }

    setIsSubmitting(true);

    const cleanPrice = parsePrice(price) || 2500000;
    const cleanDeposit = parsePrice(deposit) || cleanPrice;
    const validServices = services.filter((s) => s.name.trim() !== "");

    const newRoom: Partial<Room> = {
      id: `r_${Date.now()}`,
      buildingId,
      roomNumber: roomNumber.trim().toUpperCase(),
      type,
      floor,
      price: cleanPrice,
      priceFormatted: `${cleanPrice.toLocaleString("vi-VN")} đ`,
      status,
      statusLabel:
        status === "rented"
          ? "Đang Thuê"
          : status === "maintenance"
          ? "Đang sửa"
          : "Trống",
      tenantName: status === "rented" && tenantName.trim() ? tenantName.trim() : "---",
      tenantPhone: status === "rented" ? tenantPhone.trim() : undefined,
      startDate: status === "rented" && startDate.trim() ? startDate.trim() : undefined,
      endDate: status === "rented" && endDate.trim() ? endDate.trim() : "---",
      deposit: status === "rented" ? cleanDeposit : undefined,
      area: Number(area) || 20,
      description,
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

    console.log("New Room Created:", newRoom);

    // Navigate back to rooms page
    setTimeout(() => {
      alert(`Đã thêm thành công phòng ${newRoom.roomNumber}!`);
      router.push("/rooms");
    }, 300);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* Top Header Bar (Tương tự Trang Quản Lý Phòng & Chi Tiết Phòng) */}
      <div className="flex items-center justify-between bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shadow-inner">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Thêm Căn Hộ / Phòng Mới
              </h1>
              {roomNumber && (
                <span className="text-sm font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full">
                  Phòng {roomNumber.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Tải ảnh đại diện, ảnh góc phòng, thiết lập giá thuê và dịch vụ
            </p>
          </div>
        </div>

        {/* Trạng Thái Nhanh */}
        <div className="flex items-center gap-2 bg-[#F6F9FD] p-1.5 rounded-2xl border border-[#E2EEF8]">
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
        {/* 3. Main Card: Bộ Sưu Tập Ảnh & Thông Số Chi Tiết (Chuẩn Layout Trang Chi Tiết) */}
        <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-8 w-full">
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (4 cột): QUẢN LÝ BỘ SƯU TẬP ẢNH (Ảnh đại diện + Các ảnh nhỏ) */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0F5FA]">
                <span className="text-xs font-bold text-[#253F5B] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#5C84BE]" />
                  <span>Hình ảnh căn phòng</span>
                </span>
                <span className="text-[11px] text-[#7A93AD]">Tối đa 8 ảnh</span>
              </div>

              {/* Ảnh đại diện chính (Cover Image) */}
              <div className="relative w-full h-[320px] rounded-[28px] overflow-hidden shadow-md border-2 border-[#E3EDF6] group bg-[#F8FBFE]">
                <Image
                  src={coverImage}
                  alt="Ảnh đại diện phòng"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <label className="px-4 py-2 rounded-xl bg-white text-[#253F5B] text-xs font-bold shadow-lg hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#5C84BE]" />
                    <span>Đổi ảnh bìa chính</span>
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
                    <span>Ảnh đại diện chính phòng</span>
                  </p>
                </div>
              </div>

              {/* Các ảnh nhỏ / ảnh góc phòng (Gallery thumbnails) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#526579]">
                  <span>Ảnh chi tiết góc phòng ({galleryImages.length})</span>
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

                {/* Grid các thumbnail */}
                <div className="grid grid-cols-4 gap-2.5">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-[65px] rounded-xl overflow-hidden border border-[#D9E6F2] group shadow-2xs bg-gray-50"
                    >
                      <Image
                        src={img}
                        alt={`Ảnh nhỏ ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                        title="Xóa ảnh này"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Slot bấm thêm ảnh */}
                  {galleryImages.length < 8 && (
                    <label className="w-full h-[65px] rounded-xl border-2 border-dashed border-[#D5E3F0] hover:border-[#5C84BE] hover:bg-[#F4F9FD] flex flex-col items-center justify-center text-[#5C84BE] transition-colors cursor-pointer">
                      <Plus className="w-4 h-4" />
                      <span className="text-[9px] font-bold mt-0.5">+ Ảnh</span>
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

                {/* Video quay phòng thực tế */}
                <div className="space-y-2 pt-3 border-t border-[#EEF4FA]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#5C84BE]" />
                      Video quay phòng thực tế
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Tùy chọn</span>
                  </div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Link video Youtube, TikTok, Drive hoặc file MP4..."
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-medium text-[#253F5B] transition-all placeholder:text-[#A4B3C6]"
                  />
                  <p className="text-[10px] text-slate-400">
                    Giúp khách thuê xem trước toàn cảnh phòng trực quan trước khi chốt thuê
                  </p>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (8 cột): THÔNG SỐ CHI TIẾT CĂN PHÒNG */}
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
                  onChange={(e) => setBuildingId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs font-bold text-[#253F5B] bg-white cursor-pointer transition-all"
                >
                  <option value="bld_cg">HonuHome Cầu Giấy (Số 18, Ngõ 86 Duy Tân, Dịch Vọng Hậu)</option>
                  <option value="bld_md">HonuHome Mỹ Đình (Số 5, Ngõ 12 Lê Đức Thọ, Nam Từ Liêm)</option>
                  <option value="bld_cl">HonuHome Đống Đa (Số 22, Ngõ 91 Chùa Láng, Láng Thượng)</option>
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
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((f) => (
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
                  <label className="text-xs font-bold text-[#253F5B]">Giá Thuê (đ/tháng) *</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="2.700.000"
                      value={price}
                      onChange={(e) => {
                        const formatted = formatPrice(e.target.value);
                        setPrice(formatted);
                        if (!deposit || deposit === price) {
                          setDeposit(formatted);
                        }
                      }}
                      className="w-full h-11 pl-4 pr-12 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-base font-black text-[#253F5B] text-right transition-all"
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

              {/* Hàng 3: Tiện Nghi Phòng (Chọn nhanh) */}
              <div className="space-y-2 pt-1 border-t border-[#F0F5FA]">
                <label className="text-xs font-bold text-[#253F5B] block">
                  Tiện Nghi Phòng (Tích chọn sẵn có trong phòng)
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
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả căn hộ, hướng đón gió, ban công, nội thất..."
                  className="w-full p-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-medium text-[#253F5B] transition-all leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Card: Khách Thuê & Hợp Đồng (Theo đúng 9 trường thứ tự) */}
        <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-6 w-full">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5C84BE]" />
              <div>
                <h3 className="text-base font-bold text-[#253F5B]">
                  Thông Tin Hợp Đồng & Khách Thuê
                </h3>
                <p className="text-xs text-[#7A93AD]">
                  Áp dụng khi phòng đã có khách vào ở (Trạng thái: Đang Thuê)
                </p>
              </div>
            </div>

            {status !== "rented" && (
              <span className="text-xs font-bold text-[#7A93AD] bg-[#F2F8FC] px-3 py-1.5 rounded-xl border border-[#D9E6F2]">
                Phòng hiện tại đang chọn: {status === "available" ? "Trống" : "Đang sửa"}
              </span>
            )}
          </div>

          {status === "rented" ? (
            <div className="space-y-4">
              {/* Hàng 1: Người thuê & Số điện thoại */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Người thuê *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Họ và tên khách thuê"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-semibold text-[#253F5B]"
                    required={status === "rented"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Số điện thoại</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0987.654.321"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-semibold text-[#253F5B]"
                  />
                </div>
              </div>

              {/* Hàng 2: Số người ở & Số xe */}
              <div className="grid grid-cols-2 gap-4">
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
                      className="w-full h-10 px-3.5 pr-14 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-semibold text-[#253F5B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-medium pointer-events-none">
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
                      className="w-full h-10 px-3.5 pr-12 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-semibold text-[#253F5B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-medium pointer-events-none">
                      xe
                    </span>
                  </div>
                </div>
              </div>

              {/* Hàng 3: Ngày bắt đầu HĐ & Ngày kết thúc */}
              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm text-[#253F5B]"
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
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm text-[#253F5B]"
                  />
                </div>
              </div>

              {/* Hàng 4: Tiền đặt cọc & Quê quán & Tuổi */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Tiền đặt cọc</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="2.700.000"
                      value={deposit}
                      onChange={(e) => setDeposit(formatPrice(e.target.value))}
                      className="w-full h-10 pl-3.5 pr-12 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-bold text-[#253F5B] text-right"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-bold pointer-events-none">
                      VNĐ
                    </span>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-5 space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Quê quán</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Hà Nội, Nghệ An, Nam Định..."
                    value={tenantHometown}
                    onChange={(e) => setTenantHometown(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-semibold text-[#253F5B]"
                  />
                </div>

                <div className="col-span-12 sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Cake className="w-3.5 h-3.5 text-[#5C84BE]" />
                    <span>Tuổi</span>
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 22"
                    value={tenantAge}
                    onChange={(e) => setTenantAge(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm font-semibold text-[#253F5B] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-[#CFDFEE] bg-[#F8FBFE] flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
              <p className="text-base font-bold text-[#253F5B]">Phòng trống sẵn sàng đón khách</p>
              <p className="text-xs text-[#7A93AD] mt-1 max-w-[400px]">
                Chọn trạng thái <b>"Đang Thuê"</b> ở trên nếu phòng đã có khách vào ở để nhập thông tin hợp đồng và người thuê
              </p>
            </div>
          )}
        </div>

        {/* 5. Card: Bảng Dịch Vụ Áp Dụng Cho Căn Hộ */}
        <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm p-8 space-y-5 w-full">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#5C84BE]" />
              <div>
                <h3 className="text-base font-bold text-[#253F5B]">
                  Bảng Dịch Vụ & Chi Phí Phòng
                </h3>
                <p className="text-xs text-[#7A93AD]">
                  Tự do nhập tên dịch vụ và định mức giá riêng theo từng cơ sở trọ
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddService}
              className="px-4 py-2 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Thêm khoản dịch vụ</span>
            </button>
          </div>

          {/* Danh sách các dòng dịch vụ */}
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center gap-3 bg-[#F8FBFE] p-3 rounded-2xl border border-[#DEEBF5] hover:border-[#5C84BE] transition-colors"
              >
                {/* Tên dịch vụ */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Tên dịch vụ (VD: Tiền điện, Nước, Giặt sấy...)"
                    value={service.name}
                    onChange={(e) =>
                      handleUpdateService(service.id, "name", e.target.value)
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D5E3F0] focus:border-[#5C84BE] focus:bg-white bg-white outline-none text-xs font-bold text-[#253F5B]"
                  />
                </div>

                {/* Đơn giá (Format chấm 3 số) */}
                <div className="w-[150px] xl:w-[170px]">
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Đơn giá"
                      value={formatPrice(service.price)}
                      onChange={(e) =>
                        handleUpdateService(
                          service.id,
                          "price",
                          parsePrice(e.target.value)
                        )
                      }
                      className="w-full h-10 pl-3 pr-10 rounded-xl border border-[#D5E3F0] focus:border-[#5C84BE] focus:bg-white bg-white outline-none text-xs font-bold text-[#253F5B] text-right"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#7A93AD] font-bold pointer-events-none">
                      đ
                    </span>
                  </div>
                </div>

                {/* Đơn vị tính */}
                <div className="w-[120px] xl:w-[140px]">
                  <select
                    value={service.unit}
                    onChange={(e) =>
                      handleUpdateService(service.id, "unit", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#D5E3F0] focus:border-[#5C84BE] outline-none text-xs font-bold text-[#4B6584] bg-white cursor-pointer"
                  >
                    <option value="đ/kWh">đ/kWh</option>
                    <option value="đ/khối">đ/khối</option>
                    <option value="đ/người">đ/người</option>
                    <option value="đ/phòng">đ/phòng</option>
                    <option value="đ/xe">đ/xe</option>
                    <option value="đ/tháng">đ/tháng</option>
                  </select>
                </div>

                {/* Nút Xóa */}
                <button
                  type="button"
                  onClick={() => handleRemoveService(service.id)}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Xóa dịch vụ này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {services.length === 0 && (
              <div className="py-8 text-center text-xs text-[#7A93AD] border border-dashed border-[#CFDFEE] rounded-2xl bg-[#F8FBFE]">
                Chưa có khoản dịch vụ nào. Bấm <b>"+ Thêm khoản dịch vụ"</b> ở góc phải để tạo.
              </div>
            )}
          </div>
        </div>

        {/* 6. Bottom Sticky Actions Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between bg-white/95 backdrop-blur-md px-8 py-4 rounded-3xl border border-[#E3EDF6] shadow-xl">
          <div className="text-xs text-[#7A93AD] font-medium">
            Phòng: <b className="text-[#253F5B]">{roomNumber || "Chưa đặt"}</b> •{" "}
            Giá: <b className="text-[#253F5B]">{price || 0} đ/tháng</b> •{" "}
            Dịch vụ: <b className="text-[#253F5B]">{services.length} khoản</b>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/rooms"
              className="h-11 px-6 rounded-2xl border border-[#D9E6F2] hover:bg-gray-50 text-xs font-bold text-[#5C728C] transition-all flex items-center justify-center cursor-pointer"
            >
              Hủy bỏ
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 rounded-2xl bg-[#5C84BE] hover:bg-[#4B73AD] active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#5C84BE]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? "Đang lưu..." : "Lưu & Tạo Phòng Mới"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
