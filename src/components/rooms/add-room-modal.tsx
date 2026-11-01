"use client";

import * as React from "react";
import { X, Plus, Building2 } from "lucide-react";
import type { Room, RoomStatus, RoomType } from "@/types/room";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (room: Omit<Room, "id" | "priceFormatted" | "statusLabel">) => void;
}

export function AddRoomModal({ isOpen, onClose, onAddRoom }: AddRoomModalProps) {
  const [roomNumber, setRoomNumber] = React.useState("");
  const [type, setType] = React.useState<RoomType>("Phòng Đơn");
  const [price, setPrice] = React.useState("2700000");
  const [status, setStatus] = React.useState<RoomStatus>("available");
  const [tenantName, setTenantName] = React.useState("");
  const [area, setArea] = React.useState("20");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      alert("Vui lòng nhập số phòng!");
      return;
    }

    onAddRoom({
      roomNumber: roomNumber.trim().toUpperCase(),
      type,
      price: Number(price) || 2500000,
      status,
      tenantName: status === "rented" && tenantName.trim() ? tenantName.trim() : "---",
      area: Number(area) || 20,
    });

    // Reset form
    setRoomNumber("");
    setTenantName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-[520px] p-8 shadow-2xl border border-[#E3EDF6] space-y-6 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAF2F8] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#253F5B]">Thêm Phòng Mới</h3>
              <p className="text-xs text-[#7A92AB]">Nhập thông tin chi tiết phòng căn hộ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B]">Số Phòng *</label>
              <input
                type="text"
                placeholder="VD: P102"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-sm text-[#253F5B]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B]">Loại Phòng</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RoomType)}
                className="w-full h-11 px-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-sm text-[#253F5B] bg-white cursor-pointer"
              >
                <option value="Phòng Đơn">Phòng Đơn</option>
                <option value="Phòng Đôi">Phòng Đôi</option>
                <option value="Phòng Ba">Phòng Ba</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B]">Giá Thuê (đ/tháng) *</label>
              <input
                type="number"
                placeholder="2.500.000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-sm text-[#253F5B]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B]">Diện Tích (m²)</label>
              <input
                type="number"
                placeholder="20"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-sm text-[#253F5B]"
              />
            </div>
          </div>

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
                  className={`h-10 rounded-xl text-xs font-bold transition-all border ${
                    status === st.key
                      ? "bg-[#5C84BE] text-white border-[#5C84BE]"
                      : "bg-[#F4F9FD] text-[#4A6482] border-[#D9E6F2] hover:bg-[#E9F3FC]"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {status === "rented" && (
            <div className="space-y-1.5 pt-1 animate-fadeIn">
              <label className="text-xs font-bold text-[#253F5B]">Tên Người Thuê</label>
              <input
                type="text"
                placeholder="Nhập họ và tên người thuê"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] outline-none text-sm text-[#253F5B]"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAF2F8]">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-6 rounded-xl border border-[#D9E6F2] text-sm font-semibold text-[#5C728C] hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-[#5C84BE]/20"
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
