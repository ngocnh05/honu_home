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
  Phone,
  User,
  DollarSign,
} from "lucide-react";
import type { Room, RoomStatus, RoomType, CustomService } from "@/types/room";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (room: Omit<Room, "id" | "priceFormatted" | "statusLabel">) => void;
}

const defaultInitialServices: CustomService[] = [
  { id: "s1", name: "Tiền điện", price: 3500, unit: "đ/kWh" },
  { id: "s2", name: "Tiền nước", price: 30000, unit: "đ/khối" },
  { id: "s3", name: "Wifi / Mạng", price: 50000, unit: "đ/phòng" },
  { id: "s4", name: "Cầu thang & Vệ sinh", price: 100000, unit: "đ/người" },
];

const serviceSuggestions = [
  { name: "Phí gửi xe máy", price: 100000, unit: "đ/xe" },
  { name: "Máy giặt chung", price: 50000, unit: "đ/người" },
  { name: "Thang máy", price: 50000, unit: "đ/người" },
  { name: "Phí quản lý", price: 100000, unit: "đ/phòng" },
];

export function AddRoomModal({ isOpen, onClose, onAddRoom }: AddRoomModalProps) {
  // Basic Info
  const [roomNumber, setRoomNumber] = React.useState("");
  const [type, setType] = React.useState<RoomType>("Phòng Đơn");
  const [price, setPrice] = React.useState("2700000");
  const [status, setStatus] = React.useState<RoomStatus>("available");
  const [area, setArea] = React.useState("20");

  // Contract Details (when status === "rented")
  const [tenantName, setTenantName] = React.useState("");
  const [tenantPhone, setTenantPhone] = React.useState("");
  const [startDate, setStartDate] = React.useState("01/01/2026");
  const [endDate, setEndDate] = React.useState("01/01/2027");
  const [deposit, setDeposit] = React.useState("2700000");

  // Dynamic Custom Services List
  const [services, setServices] = React.useState<CustomService[]>(defaultInitialServices);

  if (!isOpen) return null;

  // Add a new empty service row
  const handleAddService = (
    template?: { name: string; price: number; unit: string }
  ) => {
    const newService: CustomService = template
      ? { id: `srv_${Date.now()}_${Math.random()}`, ...template }
      : {
          id: `srv_${Date.now()}`,
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
      alert("Vui lòng nhập số phòng!");
      return;
    }

    // Filter out services with empty names
    const validServices = services.filter((s) => s.name.trim() !== "");

    // Build backward-compatible RoomServices object from list
    const elec = validServices.find((s) => s.name.toLowerCase().includes("điện"));
    const water = validServices.find((s) => s.name.toLowerCase().includes("nước"));
    const wifi = validServices.find((s) => s.name.toLowerCase().includes("wifi") || s.name.toLowerCase().includes("mạng"));
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
      price: Number(price) || 2500000,
      status,
      tenantName: status === "rented" && tenantName.trim() ? tenantName.trim() : "---",
      tenantPhone: status === "rented" ? tenantPhone.trim() : undefined,
      startDate: status === "rented" && startDate.trim() ? startDate.trim() : undefined,
      endDate: status === "rented" && endDate.trim() ? endDate.trim() : "---",
      deposit: status === "rented" ? Number(deposit) || Number(price) : undefined,
      area: Number(area) || 20,
      services: legacyServices,
      customServices: validServices,
    });

    // Reset form
    setRoomNumber("");
    setTenantName("");
    setTenantPhone("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      {/* Modal Container: Rộng ngang (max-w-[880px] / xl:max-w-[940px]) cho vừa mắt và dễ thao tác */}
      <div className="bg-white rounded-3xl w-full max-w-[880px] xl:max-w-[940px] max-h-[92vh] flex flex-col shadow-2xl border border-[#E3EDF6] animate-scaleUp overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 xl:px-8 py-4 border-b border-[#EAF2F8] bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shadow-inner">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#253F5B] tracking-tight">
                Thêm Phòng Mới
              </h3>
              <p className="text-xs text-[#7A92AB] font-medium">
                Cấu hình thông tin phòng, hợp đồng và các khoản dịch vụ linh hoạt
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

        {/* Form Body - 2 Columns Side by Side */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 xl:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
            {/* CỘT TRÁI (5 cột): Thông tin phòng & Hợp đồng */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#253F5B] uppercase tracking-wider pb-1 border-b border-[#EEF4FA]">
                <Layers className="w-4 h-4 text-[#5C84BE]" />
                <span>1. Thông tin phòng</span>
              </div>

              {/* Số Phòng & Loại Phòng */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#253F5B]">Số Phòng *</label>
                  <input
                    type="text"
                    placeholder="VD: P102"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm text-[#253F5B] font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#253F5B]">Loại Phòng</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as RoomType)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs font-bold text-[#253F5B] bg-white cursor-pointer"
                  >
                    <option value="Phòng Đơn">Phòng Đơn</option>
                    <option value="Phòng Đôi">Phòng Đôi</option>
                    <option value="Phòng Ba">Phòng Ba</option>
                  </select>
                </div>
              </div>

              {/* Giá Thuê & Diện Tích */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#253F5B]">Giá Thuê (đ/tháng) *</label>
                  <input
                    type="number"
                    placeholder="2.700.000"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (!deposit || deposit === price) {
                        setDeposit(e.target.value);
                      }
                    }}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm text-[#253F5B] font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#253F5B]">Diện Tích (m²)</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-sm text-[#253F5B]"
                  />
                </div>
              </div>

              {/* Trạng Thái Ban Đầu */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-[#253F5B]">Trạng Thái Ban Đầu</label>
                <div className="grid grid-cols-3 gap-2">
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

              {/* Thông tin Hợp đồng & Khách thuê khi Đang Thuê */}
              {status === "rented" && (
                <div className="p-3.5 rounded-2xl bg-[#F6F9FD] border border-[#DEEBF5] space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#253F5B]">
                    <Calendar className="w-4 h-4 text-[#5C84BE]" />
                    <span>Hợp đồng & Người thuê</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#506A88]">Tên Người Thuê *</label>
                      <input
                        type="text"
                        placeholder="VD: Quý Bình"
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] font-semibold outline-none focus:border-[#5C84BE]"
                        required={status === "rented"}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#506A88]">Số Điện Thoại</label>
                      <input
                        type="tel"
                        placeholder="0987.654.321"
                        value={tenantPhone}
                        onChange={(e) => setTenantPhone(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] outline-none focus:border-[#5C84BE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#506A88]">Ngày Bắt Đầu HĐ</label>
                      <input
                        type="text"
                        placeholder="01/01/2026"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] outline-none focus:border-[#5C84BE]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#506A88]">Hạn Hợp Đồng</label>
                      <input
                        type="text"
                        placeholder="01/01/2027"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] outline-none focus:border-[#5C84BE]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#506A88]">Tiền Đặt Cọc (đ)</label>
                    <input
                      type="number"
                      placeholder="2.700.000"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] font-bold outline-none focus:border-[#5C84BE]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CỘT PHẢI (7 cột): Bảng Dịch Vụ Linh Hoạt (Tên dịch vụ, Đơn giá, Đơn vị tính) */}
            <div className="lg:col-span-7 space-y-3.5 bg-[#F9FBFE] p-4 xl:p-5 rounded-2xl border border-[#DEEBF5]">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4EFF8]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5C84BE]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#253F5B] uppercase tracking-wider">
                      2. Các khoản Dịch vụ của phòng
                    </h4>
                    <p className="text-[11px] text-[#7B92AC]">
                      Nhập tên & giá tùy biến theo từng trọ / cơ sở
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddService()}
                  className="px-3 py-1.5 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Thêm dịch vụ</span>
                </button>
              </div>

              {/* Service Rows List */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {services.map((service, idx) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#DCE8F4] shadow-2xs group hover:border-[#5C84BE] transition-colors"
                  >
                    {/* Tên dịch vụ (Text input tự gõ) */}
                    <div className="flex-1 min-w-[140px]">
                      <input
                        type="text"
                        placeholder="Tên dịch vụ (VD: Điện, Nước...)"
                        value={service.name}
                        onChange={(e) =>
                          handleUpdateService(service.id, "name", e.target.value)
                        }
                        className="w-full h-8 px-2.5 rounded-lg border border-[#E1ECF6] focus:border-[#5C84BE] outline-none text-xs text-[#253F5B] font-semibold"
                      />
                    </div>

                    {/* Đơn giá */}
                    <div className="w-[100px] xl:w-[110px]">
                      <input
                        type="number"
                        placeholder="Đơn giá"
                        value={service.price || ""}
                        onChange={(e) =>
                          handleUpdateService(
                            service.id,
                            "price",
                            Number(e.target.value) || 0
                          )
                        }
                        className="w-full h-8 px-2 rounded-lg border border-[#E1ECF6] focus:border-[#5C84BE] outline-none text-xs text-[#253F5B] font-bold text-right"
                      />
                    </div>

                    {/* Đơn vị tính */}
                    <div className="w-[85px] xl:w-[95px]">
                      <select
                        value={service.unit}
                        onChange={(e) =>
                          handleUpdateService(service.id, "unit", e.target.value)
                        }
                        className="w-full h-8 px-1.5 rounded-lg border border-[#E1ECF6] focus:border-[#5C84BE] outline-none text-[11px] font-bold text-[#4B6584] bg-white cursor-pointer"
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
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Xóa dịch vụ này"
                      aria-label="Xóa dịch vụ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {services.length === 0 && (
                  <div className="py-6 text-center text-xs text-[#7A93AD] border border-dashed border-[#CFDFEE] rounded-xl bg-white">
                    Chưa có khoản dịch vụ nào. Bấm <b>"+ Thêm dịch vụ"</b> để thêm.
                  </div>
                )}
              </div>

              {/* Gợi ý thêm nhanh dịch vụ phổ biến */}
              <div className="pt-2 border-t border-[#E4EFF8]">
                <p className="text-[11px] font-bold text-[#7A93AD] mb-1.5">
                  Gợi ý thêm nhanh:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {serviceSuggestions.map((sug) => {
                    const isAdded = services.some(
                      (s) => s.name.toLowerCase() === sug.name.toLowerCase()
                    );
                    return (
                      <button
                        key={sug.name}
                        type="button"
                        onClick={() => handleAddService(sug)}
                        disabled={isAdded}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          isAdded
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-[#EAF2F8] text-[#5C84BE] border border-[#D5E4F2] shadow-2xs cursor-pointer active:scale-95"
                        }`}
                      >
                        + {sug.name} ({sug.price.toLocaleString("vi-VN")} {sug.unit})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EAF2F8]">
            <div className="text-xs text-[#7A92AB] font-medium hidden sm:block">
              Đã cấu hình <b className="text-[#253F5B]">{services.length}</b> khoản dịch vụ cho phòng này
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 rounded-xl border border-[#D9E6F2] text-xs font-semibold text-[#5C728C] hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#5C84BE]/20 cursor-pointer active:scale-95 transition-all"
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
