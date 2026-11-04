"use client";

import * as React from "react";
import {
  X,
  Building2,
  MapPin,
  Layers,
  Phone,
  User,
  Zap,
  Droplets,
  FileText,
  UploadCloud,
  Check,
} from "lucide-react";
import type { Building, NewBuildingInput } from "@/types/building";

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (buildingData: NewBuildingInput) => void;
  editingBuilding?: Building | null;
}

export function AddBuildingModal({
  isOpen,
  onClose,
  onSubmit,
  editingBuilding,
}: AddBuildingModalProps) {
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [totalFloors, setTotalFloors] = React.useState("6");
  const [totalRooms, setTotalRooms] = React.useState("20");
  const [managerName, setManagerName] = React.useState("");
  const [managerPhone, setManagerPhone] = React.useState("");
  const [electricityPriceDisplay, setElectricityPriceDisplay] = React.useState("3.500");
  const [waterPriceDisplay, setWaterPriceDisplay] = React.useState("30.000");
  const [waterUnit, setWaterUnit] = React.useState<"m3" | "person" | "room">("m3");
  const [image, setImage] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [status, setStatus] = React.useState<"active" | "maintenance">("active");

  React.useEffect(() => {
    if (editingBuilding) {
      setName(editingBuilding.name);
      setCode(editingBuilding.code);
      setAddress(editingBuilding.address);
      setTotalFloors(editingBuilding.totalFloors.toString());
      setTotalRooms(editingBuilding.totalRooms.toString());
      setManagerName(editingBuilding.managerName);
      setManagerPhone(editingBuilding.managerPhone);
      setElectricityPriceDisplay(
        new Intl.NumberFormat("vi-VN").format(editingBuilding.defaultElectricityPrice)
      );
      setWaterPriceDisplay(
        new Intl.NumberFormat("vi-VN").format(editingBuilding.defaultWaterPrice)
      );
      setWaterUnit(editingBuilding.defaultWaterUnit);
      setImage(editingBuilding.image || "");
      setNotes(editingBuilding.notes || "");
      setStatus(editingBuilding.status);
    } else {
      setName("");
      setCode("");
      setAddress("");
      setTotalFloors("6");
      setTotalRooms("20");
      setManagerName("");
      setManagerPhone("");
      setElectricityPriceDisplay("3.500");
      setWaterPriceDisplay("30.000");
      setWaterUnit("m3");
      setImage("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80");
      setNotes("");
      setStatus("active");
    }
  }, [editingBuilding, isOpen]);

  if (!isOpen) return null;

  const handlePriceChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const rawNumber = value.replace(/\D/g, "");
    if (!rawNumber) {
      setter("");
      return;
    }
    const formatted = new Intl.NumberFormat("vi-VN").format(parseInt(rawNumber, 10));
    setter(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert("Vui lòng nhập tên tòa nhà và địa chỉ chi tiết!");
      return;
    }

    const electricityNum = parseInt(electricityPriceDisplay.replace(/\D/g, ""), 10) || 3500;
    const waterNum = parseInt(waterPriceDisplay.replace(/\D/g, ""), 10) || 30000;

    onSubmit({
      name: name.trim(),
      code: code.trim() || `HN-${Date.now().toString().slice(-4)}`,
      address: address.trim(),
      totalFloors: parseInt(totalFloors, 10) || 1,
      totalRooms: parseInt(totalRooms, 10) || 1,
      managerName: managerName.trim() || "Chưa phân công",
      managerPhone: managerPhone.trim() || "---",
      defaultElectricityPrice: electricityNum,
      defaultWaterPrice: waterNum,
      defaultWaterUnit: waterUnit,
      status,
      image: image.trim() || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#DCE8F2] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EFF6] bg-[#F7FAFD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shadow-inner">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#253F5B]">
                {editingBuilding ? "Chỉnh sửa Cơ sở / Tòa nhà" : "Thêm Cơ sở / Tòa nhà Mới"}
              </h2>
              <p className="text-xs text-slate-500">
                Cấu hình thông tin cơ sở, quản lý phụ trách và biểu giá dịch vụ mặc định
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* 1. Tên & Mã cơ sở */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#5C84BE]" />
                Tên Cơ sở / Tòa nhà <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: HonuHome Cầu Giấy, CCMN Duy Tân"
                className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] focus:ring-2 focus:ring-[#5C84BE]/20 text-sm font-medium text-[#253F5B] outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B]">Mã cơ sở</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: HN-CG01"
                className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] focus:ring-2 focus:ring-[#5C84BE]/20 text-sm font-medium text-[#253F5B] outline-none transition-all"
              />
            </div>
          </div>

          {/* 2. Địa chỉ chi tiết */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#5C84BE]" />
              Địa chỉ chi tiết <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: Số 18, Ngõ 86 Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội"
              className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] focus:ring-2 focus:ring-[#5C84BE]/20 text-sm font-medium text-[#253F5B] outline-none transition-all"
            />
          </div>

          {/* 3. Quy mô (Số tầng & Số phòng) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#5C84BE]" />
                Tổng số tầng
              </label>
              <input
                type="number"
                min="1"
                value={totalFloors}
                onChange={(e) => setTotalFloors(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] focus:ring-2 focus:ring-[#5C84BE]/20 text-sm font-medium text-[#253F5B] outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#5C84BE]" />
                Tổng số phòng thiết kế
              </label>
              <input
                type="number"
                min="1"
                value={totalRooms}
                onChange={(e) => setTotalRooms(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] focus:ring-2 focus:ring-[#5C84BE]/20 text-sm font-medium text-[#253F5B] outline-none transition-all"
              />
            </div>
          </div>

          {/* 4. Quản lý phụ trách */}
          <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E4EDF5] space-y-3">
            <div className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Thông tin Người quản lý cơ sở
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#253F5B]">Họ và tên Quản lý</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="VD: Trần Anh Tuấn"
                  className="w-full h-9 px-3 rounded-lg border border-[#D2E2F0] focus:border-[#5C84BE] bg-white text-xs font-medium text-[#253F5B] outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#253F5B]">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  value={managerPhone}
                  onChange={(e) => setManagerPhone(e.target.value)}
                  placeholder="VD: 0987.654.321"
                  className="w-full h-9 px-3 rounded-lg border border-[#D2E2F0] focus:border-[#5C84BE] bg-white text-xs font-medium text-[#253F5B] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* 5. Cấu hình bảng giá dịch vụ mặc định của cơ sở */}
          <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E4EDF5] space-y-3">
            <div className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Đơn giá Điện / Nước áp dụng mặc định cho cơ sở này
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#253F5B] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Đơn giá Điện (đ/kWh)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={electricityPriceDisplay}
                    onChange={(e) => handlePriceChange(e.target.value, setElectricityPriceDisplay)}
                    className="w-full h-9 pl-3 pr-14 rounded-lg border border-[#D2E2F0] focus:border-[#5C84BE] bg-white text-xs font-semibold text-[#253F5B] outline-none transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400">
                    đ/kWh
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#253F5B] flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-500" />
                  Đơn giá Nước
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={waterPriceDisplay}
                      onChange={(e) => handlePriceChange(e.target.value, setWaterPriceDisplay)}
                      className="w-full h-9 pl-3 pr-8 rounded-lg border border-[#D2E2F0] focus:border-[#5C84BE] bg-white text-xs font-semibold text-[#253F5B] outline-none transition-all"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400">
                      đ
                    </span>
                  </div>
                  <select
                    value={waterUnit}
                    onChange={(e) => setWaterUnit(e.target.value as "m3" | "person" | "room")}
                    className="h-9 px-2.5 rounded-lg border border-[#D2E2F0] bg-white text-xs font-medium text-[#253F5B] outline-none"
                  >
                    <option value="m3">đ/khối (m³)</option>
                    <option value="person">đ/người/tháng</option>
                    <option value="room">đ/phòng/tháng</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Ảnh đại diện & Ghi chú */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-[#5C84BE]" />
                Đường dẫn ảnh đại diện tòa nhà (URL)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-medium text-[#253F5B] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5C84BE]" />
                Ghi chú / Tiện ích chung của tòa nhà
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Thang máy thẻ từ, giờ giấc tự do không chung chủ, có camera 24/7..."
                className="w-full p-3 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-medium text-[#253F5B] outline-none resize-none"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-[#E8EFF6] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#D2E2F0] hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] text-white text-xs font-bold transition-all shadow-md shadow-[#5C84BE]/25 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              {editingBuilding ? "Lưu thay đổi" : "Tạo Cơ sở Mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
