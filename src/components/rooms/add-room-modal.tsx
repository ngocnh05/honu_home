"use client";

import * as React from "react";
import {
  X,
  Plus,
  Building2,
  Calendar,
  Trash2,
  Sparkles,
  Layers,
  Users,
  Bike,
  CheckCircle2,
  Wrench,
  MapPin,
  User,
  Phone,
  Cake,
} from "lucide-react";
import type { Room, RoomStatus, RoomType, CustomService } from "@/types/room";
import { useSnackbar } from "@/components/common/snackbar";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (room: Omit<Room, "id" | "priceFormatted" | "statusLabel">) => void;
}

// Format 2700000 -> "2.700.000"
const formatPrice = (val: string | number | undefined): string => {
  if (val === "" || val === undefined || val === null) return "";
  const numStr = String(val).replace(/\D/g, "");
  if (!numStr) return "";
  return Number(numStr).toLocaleString("vi-VN");
};

// Parse "2.700.000" -> 2700000 (Number an toàn, không lỗi data)
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

export function AddRoomModal({ isOpen, onClose, onAddRoom }: AddRoomModalProps) {
  const { error } = useSnackbar();
  // Basic Info
  const [roomNumber, setRoomNumber] = React.useState("");
  const [type, setType] = React.useState<RoomType>("Phòng Đơn");
  const [price, setPrice] = React.useState<string>("2.700.000");
  const [status, setStatus] = React.useState<RoomStatus>("available");
  const [area, setArea] = React.useState("20");

  // Contract Details theo đúng thứ tự:
  // Người thuê, Số điện thoại, Số người ở, Số xe, Ngày bắt đầu HĐ, Ngày kết thúc, Tiền đặt cọc, Quê quán, Tuổi
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

  // Close modal on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Add a new empty service row
  const handleAddService = () => {
    const newService: CustomService = {
      id: `srv_${Date.now()}_${Math.random()}`,
      name: "",
      price: 0,
      unit: "đ/tháng",
    };
    setServices((prev) => [...prev, newService]);
  };

  // Remove a service row
  const handleRemoveService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Update a service field
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
      error("Vui lòng nhập số phòng!");
      return;
    }

    const cleanPrice = parsePrice(price) || 2500000;
    const cleanDeposit = parsePrice(deposit) || cleanPrice;

    // Filter out services with empty names
    const validServices = services.filter((s) => s.name.trim() !== "");

    // Build backward-compatible RoomServices object from list
    const elec = validServices.find((s) => s.name.toLowerCase().includes("điện"));
    const water = validServices.find((s) => s.name.toLowerCase().includes("nước"));
    const wifi = validServices.find(
      (s) =>
        s.name.toLowerCase().includes("wifi") ||
        s.name.toLowerCase().includes("mạng")
    );
    const general = validServices.find(
      (s) =>
        s.name.toLowerCase().includes("cầu thang") ||
        s.name.toLowerCase().includes("vệ sinh") ||
        s.name.toLowerCase().includes("quản lý")
    );

    const legacyServices = {
      electricityPrice: elec ? elec.price : 3500,
      waterPrice: water ? water.price : 30000,
      waterUnit: (water?.unit.includes("người")
        ? "person"
        : water?.unit.includes("phòng")
        ? "room"
        : "m3") as "m3" | "person" | "room",
      wifiPrice: wifi ? wifi.price : 50000,
      generalServicePrice: general ? general.price : 100000,
    };

    onAddRoom({
      roomNumber: roomNumber.trim().toUpperCase(),
      type,
      price: cleanPrice,
      status,
      tenantName: status === "rented" && tenantName.trim() ? tenantName.trim() : "---",
      tenantPhone: status === "rented" ? tenantPhone.trim() : undefined,
      startDate: status === "rented" && startDate.trim() ? startDate.trim() : undefined,
      endDate: status === "rented" && endDate.trim() ? endDate.trim() : "---",
      deposit: status === "rented" ? cleanDeposit : undefined,
      area: Number(area) || 20,
      occupantsCount: Number(occupantsCount) || 1,
      vehiclesCount: Number(vehiclesCount) || 0,
      tenantHometown: status === "rented" && tenantHometown.trim() ? tenantHometown.trim() : undefined,
      tenantAge: status === "rented" && tenantAge.trim() ? tenantAge.trim() : undefined,
      services: legacyServices,
      customServices: validServices,
    });

    // Reset form
    setRoomNumber("");
    setTenantName("");
    setTenantPhone("");
    setTenantHometown("");
    setTenantAge("");
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6 sm:p-10 xl:p-14 animate-fadeIn cursor-pointer"
    >
      {/* Modal Container: CỐ ĐỊNH KÍCH THƯỚC TUYỆT ĐỐI (w: 960px, h: 690px), KHÔNG BAO GIỜ BỊ CO DÃN HAY XÊ DỊCH */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-[960px] h-[690px] flex flex-col shadow-2xl border border-[#E3EDF6] animate-scaleUp overflow-hidden cursor-default"
      >
        {/* Header (Cố định shrink-0) */}
        <div className="flex items-center justify-between px-6 xl:px-8 py-4 border-b border-[#EAF2F8] bg-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shadow-inner">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#253F5B] tracking-tight">
                Thêm Phòng Mới
              </h3>
              <p className="text-xs text-[#7A92AB] font-medium mt-0.5">
                Cấu hình thông tin phòng, hợp đồng và bảng giá dịch vụ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Khóa cứng chiều cao (h-[525px]), bên trong chỉ cuộn danh sách dịch vụ, form không bao giờ nở */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between p-6 xl:p-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 xl:gap-8 items-start h-[520px] overflow-hidden">
            {/* CỘT TRÁI (6 cột): Thông tin căn phòng & Hợp đồng */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full pr-1 overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#253F5B] uppercase tracking-wider pb-1.5 border-b border-[#EEF4FA]">
                  <Layers className="w-4 h-4 text-[#5C84BE]" />
                  <span>Thông tin căn phòng</span>
                </div>

                {/* Hàng 1: Số Phòng & Loại Phòng */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Số Phòng *</label>
                    <input
                      type="text"
                      placeholder="VD: P102"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full h-9.5 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm text-[#253F5B] font-semibold transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Loại Phòng</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as RoomType)}
                      className="w-full h-9.5 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs font-bold text-[#253F5B] bg-white cursor-pointer transition-all"
                    >
                      <option value="Phòng Đơn">Phòng Đơn</option>
                      <option value="Phòng Đôi">Phòng Đôi</option>
                      <option value="Phòng Ba">Phòng Ba</option>
                    </select>
                  </div>
                </div>

                {/* Hàng 2: Giá Thuê & Diện Tích */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
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
                        className="w-full h-9.5 pl-3.5 pr-10 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm text-[#253F5B] font-bold text-right transition-all"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-bold pointer-events-none">
                        đ
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Diện Tích (m²)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="20"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full h-9.5 pl-3.5 pr-10 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm text-[#253F5B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A93AD] font-bold pointer-events-none">
                        m²
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hàng 3: Trạng Thái Ban Đầu */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#253F5B]">Trạng Thái Ban Đầu</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { key: "available", label: "Trống" },
                      { key: "rented", label: "Đang Thuê" },
                      { key: "maintenance", label: "Đang sửa" },
                    ].map((st) => (
                      <button
                        type="button"
                        key={st.key}
                        onClick={() => setStatus(st.key as RoomStatus)}
                        className={`h-9 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          status === st.key
                            ? "bg-[#5C84BE] text-white border-[#5C84BE] shadow-xs"
                            : "bg-[#F4F9FD] text-[#4A6482] border-[#D9E6F2] hover:bg-[#E9F3FC]"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* KHỐI HỢP ĐỒNG & KHÁCH THUÊ: CỐ ĐỊNH CHIỀU CAO (h-[265px]), BỎ ĐẾM 1234567, TIỀN CỌC NHỎ GỌN */}
              <div className="h-[265px] pt-1">
                {status === "rented" ? (
                  <div className="h-full p-3.5 rounded-2xl bg-[#F6F9FD] border border-[#DEEBF5] flex flex-col justify-between animate-fadeIn shadow-2xs">
                    {/* Hàng 1: Người thuê & Số điện thoại */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#5C84BE]" />
                          <span>Người thuê *</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Họ và tên khách thuê"
                          value={tenantName}
                          onChange={(e) => setTenantName(e.target.value)}
                          className="w-full h-8 px-2.5 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] font-semibold outline-none focus:border-[#5C84BE]"
                          required={status === "rented"}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#5C84BE]" />
                          <span>Số điện thoại</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="0987.654.321"
                          value={tenantPhone}
                          onChange={(e) => setTenantPhone(e.target.value)}
                          className="w-full h-8 px-2.5 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] outline-none focus:border-[#5C84BE]"
                        />
                      </div>
                    </div>

                    {/* Hàng 2: Số người ở & Số xe */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#5C84BE]" />
                          <span>Số người ở</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="1"
                            value={occupantsCount}
                            onChange={(e) => setOccupantsCount(e.target.value)}
                            className="w-full h-8 px-2.5 pr-12 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] font-semibold outline-none focus:border-[#5C84BE] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7A93AD] font-medium pointer-events-none">
                            người
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1">
                          <Bike className="w-3.5 h-3.5 text-[#5C84BE]" />
                          <span>Số xe</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="1"
                            value={vehiclesCount}
                            onChange={(e) => setVehiclesCount(e.target.value)}
                            className="w-full h-8 px-2.5 pr-10 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] font-semibold outline-none focus:border-[#5C84BE] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7A93AD] font-medium pointer-events-none">
                            xe
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hàng 3: Ngày bắt đầu HĐ & Ngày kết thúc */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#5C84BE]" />
                          <span>Ngày bắt đầu HĐ</span>
                        </label>
                        <input
                          type="text"
                          placeholder="01/01/2026"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full h-8 px-2.5 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] outline-none focus:border-[#5C84BE]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#5C84BE]" />
                          <span>Ngày kết thúc</span>
                        </label>
                        <input
                          type="text"
                          placeholder="01/01/2027"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full h-8 px-2.5 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] outline-none focus:border-[#5C84BE]"
                        />
                      </div>
                    </div>

                    {/* Hàng 4: Tiền đặt cọc nhỏ lại & Quê quán & Tuổi */}
                    <div className="grid grid-cols-12 gap-2.5">
                      {/* Tiền đặt cọc (nhỏ gọn 4 cột) */}
                      <div className="col-span-4 space-y-1">
                        <label className="text-[11px] font-bold text-[#506A88] truncate block">
                          Tiền đặt cọc
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="2.700.000"
                            value={deposit}
                            onChange={(e) => setDeposit(formatPrice(e.target.value))}
                            className="w-full h-8 pl-2 pr-7 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] font-bold outline-none focus:border-[#5C84BE] text-right"
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9.5px] text-[#7A93AD] font-bold pointer-events-none">
                            đ
                          </span>
                        </div>
                      </div>

                      {/* Quê quán (5 cột) */}
                      <div className="col-span-5 space-y-1">
                        <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#5C84BE] shrink-0" />
                          <span>Quê quán</span>
                        </label>
                        <input
                          type="text"
                          placeholder="VD: Hà Nội"
                          value={tenantHometown}
                          onChange={(e) => setTenantHometown(e.target.value)}
                          className="w-full h-8 px-2.5 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] font-semibold outline-none focus:border-[#5C84BE]"
                        />
                      </div>

                      {/* Tuổi (3 cột) */}
                      <div className="col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1 truncate">
                          <Cake className="w-3 h-3 text-[#5C84BE] shrink-0" />
                          <span>Tuổi</span>
                        </label>
                        <input
                          type="number"
                          placeholder="22"
                          value={tenantAge}
                          onChange={(e) => setTenantAge(e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] font-semibold outline-none focus:border-[#5C84BE] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                        />
                      </div>
                    </div>
                  </div>
                ) : status === "available" ? (
                  <div className="h-full rounded-2xl border border-dashed border-[#CFDFEE] bg-[#F8FBFE] flex flex-col items-center justify-center p-6 text-center">
                    <CheckCircle2 className="w-9 h-9 text-emerald-500 mb-2" />
                    <p className="text-sm font-bold text-[#253F5B]">Phòng trống sẵn sàng đón khách</p>
                    <p className="text-xs text-[#7B92AC] mt-1 max-w-[280px]">
                      Chọn nút <b>"Đang Thuê"</b> ở trên nếu phòng đã có khách vào ở để nhập thông tin hợp đồng và khách thuê
                    </p>
                  </div>
                ) : (
                  <div className="h-full rounded-2xl border border-dashed border-[#F3E2A8] bg-[#FFFDF5] flex flex-col items-center justify-center p-6 text-center">
                    <Wrench className="w-9 h-9 text-amber-500 mb-2" />
                    <p className="text-sm font-bold text-[#7A5A00]">Phòng đang bảo trì / sửa chữa</p>
                    <p className="text-xs text-[#9A7D2C] mt-1 max-w-[280px]">
                      Tạm thời không nhận người thuê cho đến khi hoàn tất sửa chữa
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CỘT PHẢI (6 cột): Bảng Dịch Vụ - ĐÃ BỎ THÊM NHANH 1 CHẠM, CUỘN NỘI BỘ, KHÔNG BAO GIỜ KÉO DÃN FORM */}
            <div className="lg:col-span-6 flex flex-col h-full bg-[#F9FBFE] p-5 rounded-2xl border border-[#DEEBF5] overflow-hidden">
              {/* Header Dịch vụ (shrink-0) */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E4EFF8] shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5C84BE]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#253F5B] uppercase tracking-wider">
                      Dịch vụ phòng
                    </h4>
                    <p className="text-[11px] text-[#7B92AC]">
                      Tự gõ tên dịch vụ & đơn giá riêng theo từng trọ
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddService()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Thêm dòng</span>
                </button>
              </div>

              {/* Service Rows List: Cuộn mượt nội bộ bên trong, thêm bao nhiêu dòng cũng không làm giãn form */}
              <div className="flex-1 overflow-y-auto pr-1.5 pt-3 space-y-2.5 min-h-0">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#DCE8F4] shadow-2xs group hover:border-[#5C84BE] transition-colors"
                  >
                    {/* Tên dịch vụ */}
                    <div className="flex-1 min-w-[130px]">
                      <input
                        type="text"
                        placeholder="Tên dịch vụ..."
                        value={service.name}
                        onChange={(e) =>
                          handleUpdateService(service.id, "name", e.target.value)
                        }
                        className="w-full h-8.5 px-3 rounded-lg border border-[#E1ECF6] focus:border-[#5C84BE] outline-none text-xs text-[#253F5B] font-semibold"
                      />
                    </div>

                    {/* Đơn giá */}
                    <div className="w-[100px] xl:w-[110px]">
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
                        className="w-full h-8.5 px-2.5 rounded-lg border border-[#E1ECF6] focus:border-[#5C84BE] outline-none text-xs text-[#253F5B] font-bold text-right"
                      />
                    </div>

                    {/* Đơn vị tính */}
                    <div className="w-[88px] xl:w-[96px]">
                      <select
                        value={service.unit}
                        onChange={(e) =>
                          handleUpdateService(service.id, "unit", e.target.value)
                        }
                        className="w-full h-8.5 px-2 rounded-lg border border-[#E1ECF6] focus:border-[#5C84BE] outline-none text-[11px] font-bold text-[#4B6584] bg-white cursor-pointer"
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
                      className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Xóa dịch vụ này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {services.length === 0 && (
                  <div className="py-12 text-center text-xs text-[#7A93AD] border border-dashed border-[#CFDFEE] rounded-xl bg-white">
                    Chưa có dịch vụ nào. Bấm <b>"+ Thêm dòng"</b> ở trên để tạo.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions (Cố định shrink-0) */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EAF2F8] shrink-0">
            <div className="text-xs text-[#7A92AB] font-medium hidden sm:block">
              Định mức: <b className="text-[#253F5B]">{occupantsCount || 0} người</b> • <b className="text-[#253F5B]">{vehiclesCount || 0} xe</b> • <b className="text-[#253F5B]">{services.length} dịch vụ</b>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="h-10.5 px-6 rounded-xl border border-[#D9E6F2] text-xs font-semibold text-[#5C728C] hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="h-10.5 px-7 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#5C84BE]/20 cursor-pointer active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Tạo Phòng</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
