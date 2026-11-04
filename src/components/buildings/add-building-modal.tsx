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
  Camera,
  Trash2,
  ImageIcon,
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

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
        className="bg-white rounded-3xl w-full max-w-4xl xl:max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-[#DCE8F2] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-7 py-4.5 border-b border-[#E8EFF6] bg-[#F7FAFD]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shadow-inner">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#253F5B]">
                {editingBuilding ? "Chỉnh sửa Cơ sở / Tòa nhà" : "Thêm Cơ sở / Tòa nhà Mới"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Cấu hình thông tin cơ sở, quản lý phụ trách và biểu giá dịch vụ mặc định
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 COLUMNS LAYOUT */}
        <form onSubmit={handleSubmit} className="p-7 overflow-y-auto max-h-[calc(92vh-140px)] space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {/* CỘT 1: THÔNG TIN CƠ SỞ & BIỂU GIÁ VẬN HÀNH */}
            <div className="space-y-4">
              {/* Tên & Mã cơ sở */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
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

              {/* Địa chỉ chi tiết */}
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

              {/* Quy mô (Số tầng & Số phòng) - ĐÃ BỎ HOÀN TOÀN MŨI TÊN LÊN XUỐNG */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#5C84BE]" />
                    Tổng số tầng
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(e.target.value.replace(/\D/g, ""))}
                    placeholder="6"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] focus:ring-2 focus:ring-[#5C84BE]/20 text-sm font-medium text-[#253F5B] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#5C84BE]" />
                    Tổng số phòng thiết kế
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value.replace(/\D/g, ""))}
                    placeholder="20"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] focus:ring-2 focus:ring-[#5C84BE]/20 text-sm font-medium text-[#253F5B] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Thông tin Quản lý cơ sở */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E4EDF5] space-y-2.5">
                <div className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Thông tin Người quản lý cơ sở
                </div>
                <div className="grid grid-cols-2 gap-3">
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

              {/* Đơn giá Điện / Nước áp dụng */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E4EDF5] space-y-2.5">
                <div className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Đơn giá Điện / Nước mặc định của cơ sở này
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={waterPriceDisplay}
                          onChange={(e) => handlePriceChange(e.target.value, setWaterPriceDisplay)}
                          className="w-full h-9 pl-2.5 pr-6 rounded-lg border border-[#D2E2F0] focus:border-[#5C84BE] bg-white text-xs font-semibold text-[#253F5B] outline-none transition-all"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">
                          đ
                        </span>
                      </div>
                      <select
                        value={waterUnit}
                        onChange={(e) => setWaterUnit(e.target.value as "m3" | "person" | "room")}
                        className="h-9 px-2 rounded-lg border border-[#D2E2F0] bg-white text-xs font-medium text-[#253F5B] outline-none"
                      >
                        <option value="m3">/m³</option>
                        <option value="person">/người</option>
                        <option value="room">/phòng</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT 2: ẢNH ĐẠI DIỆN & TIỆN ÍCH QUY ĐỊNH */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Upload ảnh đại diện */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#5C84BE]" />
                    Ảnh đại diện tòa nhà
                  </label>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Xóa ảnh
                    </button>
                  )}
                </div>

                {image ? (
                  <div className="relative w-full h-[200px] rounded-2xl overflow-hidden border border-[#D2E2F0] bg-slate-100 group shadow-inner">
                    <img
                      src={image}
                      alt="Xem trước ảnh tòa nhà"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-xs font-bold text-[#253F5B] shadow-md cursor-pointer flex items-center gap-1.5 transition-all active:scale-95">
                        <UploadCloud className="w-4 h-4 text-[#5C84BE]" />
                        Đổi ảnh khác
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="w-full h-[200px] rounded-2xl border-2 border-dashed border-[#CFDFEE] hover:border-[#5C84BE] hover:bg-[#F4F9FD] flex flex-col items-center justify-center text-[#5C84BE] transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF2F8] group-hover:bg-white flex items-center justify-center transition-colors shadow-xs">
                      <UploadCloud className="w-6 h-6 text-[#5C84BE]" />
                    </div>
                    <span className="text-sm font-bold text-[#253F5B] mt-3">
                      Bấm để tải ảnh tòa nhà từ thiết bị
                    </span>
                    <span className="text-xs text-slate-400 font-medium mt-1">
                      Hỗ trợ định dạng PNG, JPG, WEBP
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Ghi chú & tiện ích */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#5C84BE]" />
                  Ghi chú / Tiện ích chung & Quy định tòa nhà
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="VD: Thang máy thẻ từ, giờ giấc tự do không chung chủ, có camera 24/7, hầm để xe rộng..."
                  className="w-full p-3 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-medium text-[#253F5B] outline-none resize-none transition-all"
                />
              </div>

              {/* Trạng thái hoạt động ban đầu */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B]">Trạng thái ban đầu</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("active")}
                    className={`h-10 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      status === "active"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                        : "bg-[#F8FAFD] border-[#D2E2F0] text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    ✓ Đang vận hành
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("maintenance")}
                    className={`h-10 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      status === "maintenance"
                        ? "bg-amber-50 border-amber-500 text-amber-800 shadow-xs"
                        : "bg-[#F8FAFD] border-[#D2E2F0] text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    ⚠️ Đang bảo trì
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#E8EFF6] flex items-center justify-end gap-3">
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
