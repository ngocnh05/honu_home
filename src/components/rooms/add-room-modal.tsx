"use client";

import * as React from "react";
import {
  X,
  Plus,
  Building2,
  Calendar,
  Zap,
  Droplets,
  Wifi,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Room, RoomServices, RoomStatus, RoomType } from "@/types/room";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (room: Omit<Room, "id" | "priceFormatted" | "statusLabel">) => void;
}

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

  // Service Pricing (Customizable per room / property)
  const [showServiceConfig, setShowServiceConfig] = React.useState(true);
  const [electricityPrice, setElectricityPrice] = React.useState("3500");
  const [waterUnit, setWaterUnit] = React.useState<"m3" | "person" | "room">("m3");
  const [waterPrice, setWaterPrice] = React.useState("30000");
  const [wifiPrice, setWifiPrice] = React.useState("50000");
  const [generalServicePrice, setGeneralServicePrice] = React.useState("100000");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      alert("Vui lòng nhập số phòng!");
      return;
    }

    const services: RoomServices = {
      electricityPrice: Number(electricityPrice) || 3500,
      waterPrice: Number(waterPrice) || 30000,
      waterUnit,
      wifiPrice: Number(wifiPrice) || 0,
      generalServicePrice: Number(generalServicePrice) || 0,
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
      services,
    });

    // Reset form
    setRoomNumber("");
    setTenantName("");
    setTenantPhone("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-[560px] max-h-[92vh] overflow-y-auto p-6 xl:p-8 shadow-2xl border border-[#E3EDF6] space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAF2F8] pb-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#253F5B]">Thêm Phòng Mới</h3>
              <p className="text-xs text-[#7A92AB]">Nhập thông tin chi tiết phòng & định mức dịch vụ</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#253F5B]">Số Phòng *</label>
              <input
                type="text"
                placeholder="VD: P102"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-sm text-[#253F5B]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#253F5B]">Loại Phòng</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RoomType)}
                className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-sm text-[#253F5B] bg-white cursor-pointer"
              >
                <option value="Phòng Đơn">Phòng Đơn</option>
                <option value="Phòng Đôi">Phòng Đôi</option>
                <option value="Phòng Ba">Phòng Ba</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
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
                className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-sm text-[#253F5B]"
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
                className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-sm text-[#253F5B]"
              />
            </div>
          </div>

          {/* Trạng Thái Ban Đầu */}
          <div className="space-y-1.5">
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

          {/* Section 2: Thông tin Hợp đồng (Khi chọn Đang Thuê) */}
          {status === "rented" && (
            <div className="p-4 rounded-2xl bg-[#F6F9FD] border border-[#DEEBF5] space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#253F5B]">
                <Calendar className="w-4 h-4 text-[#5C84BE]" />
                <span>Thông tin Hợp đồng & Khách thuê</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#506A88]">Tên Người Thuê *</label>
                  <input
                    type="text"
                    placeholder="VD: Quý Bình"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] outline-none focus:border-[#5C84BE]"
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

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#506A88]">Ngày Bắt Đầu</label>
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
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#506A88]">Tiền Đặt Cọc (đ)</label>
                  <input
                    type="number"
                    placeholder="2.700.000"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#D0DFEE] bg-white text-xs text-[#253F5B] outline-none focus:border-[#5C84BE]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Cấu hình Đơn giá Dịch vụ riêng của phòng */}
          <div className="rounded-2xl border border-[#DEEBF5] overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setShowServiceConfig(!showServiceConfig)}
              className="w-full flex items-center justify-between p-3.5 bg-[#F9FBFE] hover:bg-[#F0F6FC] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-xs font-bold text-[#253F5B]">
                    Đơn giá Dịch vụ phòng (Điện, Nước, Dịch vụ chung)
                  </span>
                  <p className="text-[10px] text-[#7B93AD]">
                    Tùy chỉnh riêng cho phòng này hoặc áp dụng theo bảng giá cơ sở
                  </p>
                </div>
              </div>
              {showServiceConfig ? (
                <ChevronUp className="w-4 h-4 text-[#7A93AD]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7A93AD]" />
              )}
            </button>

            {showServiceConfig && (
              <div className="p-4 bg-white space-y-3.5 border-t border-[#EAF2F8] animate-fadeIn">
                {/* 1. Tiền điện */}
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#253F5B]">Giá Điện</span>
                      <p className="text-[10px] text-[#859BB5]">Đơn vị: đ / kWh</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={electricityPrice}
                      onChange={(e) => setElectricityPrice(e.target.value)}
                      placeholder="3500"
                      className="w-full h-9 pl-3 pr-14 rounded-lg border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs text-[#253F5B] font-semibold text-right"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7A93AD]">
                      đ/kWh
                    </span>
                  </div>
                </div>

                {/* 2. Tiền nước */}
                <div className="space-y-1.5 pt-1 border-t border-[#F1F6FB]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <Droplets className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#253F5B]">Giá Nước</span>
                        <p className="text-[10px] text-[#859BB5]">Cách tính & đơn giá</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-[#F0F5FA] p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setWaterUnit("m3");
                          if (waterPrice === "100000" || waterPrice === "150000") setWaterPrice("30000");
                        }}
                        className={`px-2 py-1 rounded-md transition-all ${
                          waterUnit === "m3" ? "bg-white text-[#253F5B] shadow-2xs" : "text-[#7B92AC]"
                        }`}
                      >
                        Khối (m³)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWaterUnit("person");
                          if (waterPrice === "30000") setWaterPrice("100000");
                        }}
                        className={`px-2 py-1 rounded-md transition-all ${
                          waterUnit === "person" ? "bg-white text-[#253F5B] shadow-2xs" : "text-[#7B92AC]"
                        }`}
                      >
                        Đầu người
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWaterUnit("room");
                          if (waterPrice === "30000") setWaterPrice("150000");
                        }}
                        className={`px-2 py-1 rounded-md transition-all ${
                          waterUnit === "room" ? "bg-white text-[#253F5B] shadow-2xs" : "text-[#7B92AC]"
                        }`}
                      >
                        Khoán phòng
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={waterPrice}
                      onChange={(e) => setWaterPrice(e.target.value)}
                      placeholder={waterUnit === "m3" ? "30000" : "100000"}
                      className="w-full h-9 pl-3 pr-20 rounded-lg border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs text-[#253F5B] font-semibold text-right"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7A93AD]">
                      {waterUnit === "m3" ? "đ/khối" : waterUnit === "person" ? "đ/người" : "đ/phòng"}
                    </span>
                  </div>
                </div>

                {/* 3. Dịch vụ chung & Wifi */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#F1F6FB]">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Wifi / Mạng (đ/tháng)</span>
                    </label>
                    <input
                      type="number"
                      value={wifiPrice}
                      onChange={(e) => setWifiPrice(e.target.value)}
                      placeholder="50000"
                      className="w-full h-8 px-2.5 rounded-lg border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs text-[#253F5B] font-semibold text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#506A88] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Cầu thang, Rác, Vệ sinh</span>
                    </label>
                    <input
                      type="number"
                      value={generalServicePrice}
                      onChange={(e) => setGeneralServicePrice(e.target.value)}
                      placeholder="100000"
                      className="w-full h-8 px-2.5 rounded-lg border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-xs text-[#253F5B] font-semibold text-right"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAF2F8]">
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
        </form>
      </div>
    </div>
  );
}
