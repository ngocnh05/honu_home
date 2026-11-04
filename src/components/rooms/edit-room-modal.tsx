"use client";

import * as React from "react";
import {
  X,
  DoorOpen,
  Building2,
  Layers,
  Phone,
  User,
  Zap,
  Calendar,
  Bike,
  Users,
  MapPin,
  Check,
  Video,
  DollarSign,
  Maximize2,
} from "lucide-react";
import type { Room, RoomStatus, RoomType } from "@/types/room";

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onSave: (updatedRoom: Room) => void;
}

export function EditRoomModal({
  isOpen,
  onClose,
  room,
  onSave,
}: EditRoomModalProps) {
  const [buildingId, setBuildingId] = React.useState("bld_cg");
  const [roomNumber, setRoomNumber] = React.useState("");
  const [floor, setFloor] = React.useState("1");
  const [type, setType] = React.useState<RoomType>("Phòng Đơn");
  const [area, setArea] = React.useState("20");
  const [priceDisplay, setPriceDisplay] = React.useState("2.700.000");
  const [depositDisplay, setDepositDisplay] = React.useState("2.700.000");
  const [status, setStatus] = React.useState<RoomStatus>("available");
  const [tenantName, setTenantName] = React.useState("");
  const [tenantPhone, setTenantPhone] = React.useState("");
  const [occupantsCount, setOccupantsCount] = React.useState("1");
  const [vehiclesCount, setVehiclesCount] = React.useState("1");
  const [startDate, setStartDate] = React.useState("01/01/2026");
  const [endDate, setEndDate] = React.useState("01/01/2027");
  const [tenantHometown, setTenantHometown] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (room) {
      setBuildingId(room.buildingId || "bld_cg");
      setRoomNumber(room.roomNumber);
      setFloor((room.floor || 1).toString());
      setType(room.type);
      setArea((room.area || 20).toString());
      setPriceDisplay(
        new Intl.NumberFormat("vi-VN").format(room.price)
      );
      setDepositDisplay(
        new Intl.NumberFormat("vi-VN").format(room.deposit || room.price)
      );
      setStatus(room.status);
      setTenantName(room.tenantName !== "---" ? room.tenantName : "");
      setTenantPhone(room.tenantPhone || "");
      setOccupantsCount((room.occupantsCount || 1).toString());
      setVehiclesCount((room.vehiclesCount || 1).toString());
      setStartDate(room.startDate || "01/01/2026");
      setEndDate(room.endDate && room.endDate !== "---" ? room.endDate : "01/01/2027");
      setTenantHometown(room.tenantHometown || "");
      setVideoUrl(room.videoUrl || "");
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const handlePriceChange = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const rawNumber = val.replace(/\D/g, "");
    if (!rawNumber) {
      setter("");
      return;
    }
    const formatted = new Intl.NumberFormat("vi-VN").format(parseInt(rawNumber, 10));
    setter(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      alert("Vui lòng nhập số phòng!");
      return;
    }

    const priceNum = parseInt(priceDisplay.replace(/\D/g, ""), 10) || 2500000;
    const depositNum = parseInt(depositDisplay.replace(/\D/g, ""), 10) || priceNum;

    const buildingMap: Record<string, string> = {
      bld_cg: "HonuHome Cầu Giấy",
      bld_md: "HonuHome Mỹ Đình",
      bld_cl: "HonuHome Đống Đa",
    };

    const statusLabels: Record<RoomStatus, "Đang Thuê" | "Trống" | "Đang sửa"> = {
      rented: "Đang Thuê",
      available: "Trống",
      maintenance: "Đang sửa",
    };

    const updatedRoom: Room = {
      ...room,
      buildingId,
      buildingName: buildingMap[buildingId] || "HonuHome",
      roomNumber: roomNumber.trim().toUpperCase(),
      floor: parseInt(floor, 10) || 1,
      type,
      area: parseInt(area, 10) || 20,
      price: priceNum,
      priceFormatted: `${new Intl.NumberFormat("vi-VN").format(priceNum)} đ`,
      deposit: status === "rented" ? depositNum : 0,
      status,
      statusLabel: statusLabels[status],
      tenantName: status === "rented" && tenantName.trim() ? tenantName.trim() : "---",
      tenantPhone: status === "rented" ? tenantPhone.trim() : undefined,
      occupantsCount: status === "rented" ? parseInt(occupantsCount, 10) || 1 : 0,
      vehiclesCount: status === "rented" ? parseInt(vehiclesCount, 10) || 0 : 0,
      startDate: status === "rented" ? startDate.trim() : undefined,
      endDate: status === "rented" ? endDate.trim() : "---",
      tenantHometown: status === "rented" ? tenantHometown.trim() : undefined,
      videoUrl: videoUrl.trim() || undefined,
    };

    onSave(updatedRoom);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 xl:p-14 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-[#DCE8F2] overflow-hidden cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-7 py-4.5 border-b border-[#E8EFF6] bg-[#F7FAFD]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shadow-inner">
              <DoorOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#253F5B]">
                  Chỉnh sửa Phòng {room.roomNumber}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EBF2F9] text-[#5C84BE]">
                  {room.buildingName || "Cơ sở Cầu Giấy"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Cập nhật thông số phòng, trạng thái cho thuê, khách thuê và hợp đồng
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

        {/* Modal Body: 2 Columns */}
        <form onSubmit={handleSubmit} className="p-7 overflow-y-auto max-h-[calc(90vh-130px)] space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CỘT TRÁI: THÔNG SỐ VẬT LÝ CỦA PHÒNG */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <DoorOpen className="w-3.5 h-3.5" />
                1. Thông số căn phòng & Biểu giá
              </div>

              {/* Cơ sở */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#5C84BE]" />
                  Thuộc Cơ sở / Tòa nhà *
                </label>
                <select
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] bg-white text-xs font-bold text-[#253F5B] outline-none transition-all cursor-pointer"
                >
                  <option value="bld_cg">HonuHome Cầu Giấy (Số 18, Ngõ 86 Duy Tân)</option>
                  <option value="bld_md">HonuHome Mỹ Đình (Số 5, Ngõ 12 Lê Đức Thọ)</option>
                  <option value="bld_cl">HonuHome Đống Đa (Số 22, Ngõ 91 Chùa Láng)</option>
                </select>
              </div>

              {/* Số phòng, Tầng, Loại phòng */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Số phòng *</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Tầng</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Loại phòng</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as RoomType)}
                    className="w-full h-10 px-2.5 rounded-xl border border-[#D2E2F0] bg-white text-xs font-bold text-[#253F5B] outline-none cursor-pointer"
                  >
                    <option value="Phòng Đơn">Phòng Đơn</option>
                    <option value="Phòng Đôi">Phòng Đôi</option>
                    <option value="Phòng Ba">Phòng Ba</option>
                  </select>
                </div>
              </div>

              {/* Giá thuê, Diện tích, Tiền cọc */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Giá thuê (đ/tháng)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={priceDisplay}
                    onChange={(e) => handlePriceChange(e.target.value, setPriceDisplay)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Diện tích (m²)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={area}
                    onChange={(e) => setArea(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-10 px-3 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Tiền cọc (VNĐ)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={depositDisplay}
                    onChange={(e) => handlePriceChange(e.target.value, setDepositDisplay)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none"
                  />
                </div>
              </div>

              {/* Trạng thái phòng */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B]">Trạng thái phòng</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("available")}
                    className={`h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      status === "available"
                        ? "bg-[#8FBFFA] text-[#253F5B] border-[#5C84BE] shadow-xs"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Trống
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("rented")}
                    className={`h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      status === "rented"
                        ? "bg-[#B5DDA6] text-[#253F5B] border-emerald-500 shadow-xs"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Đang Thuê
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("maintenance")}
                    className={`h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      status === "maintenance"
                        ? "bg-[#FFF9BF] text-[#253F5B] border-amber-400 shadow-xs"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Đang sửa
                  </button>
                </div>
              </div>

              {/* Video URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#5C84BE]" />
                  Link Video quay phòng thực tế (Tùy chọn)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-medium text-[#253F5B] outline-none"
                />
              </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN KHÁCH THUÊ & HỢP ĐỒNG (Nếu đang thuê) */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <User className="w-3.5 h-3.5" />
                2. Thông tin Khách thuê & Hợp đồng
              </div>

              {status !== "rented" ? (
                <div className="p-8 rounded-2xl bg-[#F8FAFD] border border-[#E3EDF6] text-center space-y-2 flex flex-col items-center justify-center min-h-[260px]">
                  <DoorOpen className="w-10 h-10 text-slate-300" />
                  <p className="text-sm font-bold text-[#253F5B]">
                    Phòng đang ở trạng thái {status === "available" ? '"Trống"' : '"Đang sửa"'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Để nhập thông tin người thuê và thời hạn hợp đồng, vui lòng chuyển trạng thái sang <strong>"Đang Thuê"</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5 animate-fadeIn">
                  {/* Họ tên & SĐT */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Người thuê chính *</label>
                      <input
                        type="text"
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                        placeholder="VD: Quý Bình"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Số điện thoại</label>
                      <input
                        type="tel"
                        value={tenantPhone}
                        onChange={(e) => setTenantPhone(e.target.value)}
                        placeholder="VD: 0987.654.321"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none"
                      />
                    </div>
                  </div>

                  {/* Số người & Số xe & Quê quán */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#5C84BE]" />
                        Số người
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={occupantsCount}
                        onChange={(e) => setOccupantsCount(e.target.value.replace(/\D/g, ""))}
                        placeholder="1"
                        className="w-full h-10 px-3 rounded-xl border border-[#D2E2F0] text-xs font-bold text-[#253F5B] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1">
                        <Bike className="w-3 h-3 text-[#5C84BE]" />
                        Số xe máy
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={vehiclesCount}
                        onChange={(e) => setVehiclesCount(e.target.value.replace(/\D/g, ""))}
                        placeholder="1"
                        className="w-full h-10 px-3 rounded-xl border border-[#D2E2F0] text-xs font-bold text-[#253F5B] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#5C84BE]" />
                        Quê quán
                      </label>
                      <input
                        type="text"
                        value={tenantHometown}
                        onChange={(e) => setTenantHometown(e.target.value)}
                        placeholder="VD: Nghệ An"
                        className="w-full h-10 px-3 rounded-xl border border-[#D2E2F0] text-xs font-bold text-[#253F5B] outline-none"
                      />
                    </div>
                  </div>

                  {/* Thời hạn HĐ */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#5C84BE]" />
                        Ngày bắt đầu HĐ
                      </label>
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="01/01/2026"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] text-xs font-medium text-[#253F5B] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#5C84BE]" />
                        Hạn kết thúc HĐ
                      </label>
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="01/01/2027"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D2E2F0] text-xs font-medium text-[#253F5B] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
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
              Lưu thay đổi phòng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
