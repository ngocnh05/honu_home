"use client";

import * as React from "react";
import {
  FileText,
  FileCheck2,
  Plus,
  Search,
  Building2,
  Calendar,
  Users,
  Bike,
  CreditCard,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  X,
  FileSpreadsheet,
  BadgeDollarSign,
  UserCheck,
} from "lucide-react";
import type { Contract, ContractStatus } from "@/types/contract";
import { initialContracts } from "@/lib/mock-data/contracts";
import { initialBuildings } from "@/lib/mock-data/buildings";
import { useSnackbar } from "@/components/common/snackbar";

export function ContractsView() {
  const { success, error } = useSnackbar();
  const [contracts, setContracts] = React.useState<Contract[]>(initialContracts);
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<"all" | ContractStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal State
  const [showModal, setShowModal] = React.useState(false);
  const [viewingContract, setViewingContract] = React.useState<Contract | null>(null);

  // Form State for New Contract
  const [formBuildingId, setFormBuildingId] = React.useState("bld_cg");
  const [formRoomNumber, setFormRoomNumber] = React.useState("P001");
  const [formRepName, setFormRepName] = React.useState("");
  const [formRepPhone, setFormRepPhone] = React.useState("");
  const [formRepIdCard, setFormRepIdCard] = React.useState("");
  const [formRepHometown, setFormRepHometown] = React.useState("");
  const [formStartDate, setFormStartDate] = React.useState("01/01/2026");
  const [formEndDate, setFormEndDate] = React.useState("01/01/2027");
  const [formRent, setFormRent] = React.useState("2.700.000");
  const [formDeposit, setFormDeposit] = React.useState("2.700.000");
  const [formDepositStatus, setFormDepositStatus] = React.useState<"paid" | "unpaid">("paid");
  const [formOccupants, setFormOccupants] = React.useState("1");
  const [formVehicles, setFormVehicles] = React.useState("1");
  const [formCycleDay, setFormCycleDay] = React.useState("28");
  const [formNotes, setFormNotes] = React.useState("");

  // Filtered
  const filteredContracts = React.useMemo(() => {
    return contracts.filter((c) => {
      const matchBuilding =
        selectedBuildingId === "all" || c.buildingId === selectedBuildingId;
      const matchStatus = selectedStatus === "all" || c.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        c.id.toLowerCase().includes(q) ||
        c.roomNumber.toLowerCase().includes(q) ||
        c.representative.fullName.toLowerCase().includes(q) ||
        c.representative.phone.includes(q);
      return matchBuilding && matchStatus && matchQuery;
    });
  }, [contracts, selectedBuildingId, selectedStatus, searchQuery]);

  // Submit Handler
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRepName.trim() || !formRepPhone.trim()) {
      error("Vui lòng điền họ tên và số điện thoại người đại diện");
      return;
    }

    const cleanRent = Number(formRent.replace(/\D/g, "")) || 2500000;
    const cleanDeposit = Number(formDeposit.replace(/\D/g, "")) || cleanRent;
    const bld = initialBuildings.find((b) => b.id === formBuildingId);
    const buildingName = bld?.name || "HonuHome Cầu Giấy";

    const newContract: Contract = {
      id: `HD-${formRoomNumber.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      roomNumber: formRoomNumber.trim().toUpperCase(),
      buildingId: formBuildingId,
      buildingName,
      representative: {
        fullName: formRepName.trim(),
        phone: formRepPhone.trim(),
        idCardNumber: formRepIdCard.trim() || "038202008912",
        hometown: formRepHometown.trim() || "Hà Nội",
        age: 23,
      },
      members: [],
      startDate: formStartDate,
      endDate: formEndDate,
      monthlyRent: cleanRent,
      deposit: cleanDeposit,
      depositStatus: formDepositStatus,
      paymentCycleDay: Number(formCycleDay) || 28,
      paymentCycle: "1 tháng/lần",
      occupantsCount: Number(formOccupants) || 1,
      vehiclesCount: Number(formVehicles) || 1,
      services: [
        { name: "Điện sinh hoạt", price: 3500, unit: "đ/kWh" },
        { name: "Nước sạch", price: 30000, unit: "đ/khối" },
        { name: "Wifi Mesh", price: 50000, unit: "đ/phòng" },
      ],
      initialElectricityIndex: 1250,
      initialWaterIndex: 48,
      status: "active",
      statusLabel: "Đang hiệu lực",
      notes: formNotes,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    setContracts((prev) => [newContract, ...prev]);
    success(`Đã tạo hợp đồng mới ${newContract.id} cho phòng ${newContract.roomNumber}`);
    setShowModal(false);
  };

  const activeCount = contracts.filter((c) => c.status === "active").length;
  const expiringCount = contracts.filter((c) => c.status === "expiring_soon").length;
  const totalDeposit = contracts.reduce((acc, c) => acc + c.deposit, 0);

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-inner">
            <FileCheck2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Quản Lý Hợp Đồng Thuê
              </h1>
              <span className="text-xs font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full border border-[#D8E6F3]">
                {contracts.length} hợp đồng
              </span>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Liên kết chặt chẽ Phòng ↔ Khách đại diện ↔ Bảng dịch vụ ↔ Ngày chốt thanh toán
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="h-11 px-5 rounded-2xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Hợp Đồng Mới</span>
        </button>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7A93AD] font-bold">Đang hiệu lực</span>
            <div className="text-2xl font-black text-[#253F5B]">{activeCount} hợp đồng</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7A93AD] font-bold">Sắp hết hạn (&lt; 30 ngày)</span>
            <div className="text-2xl font-black text-amber-600">{expiringCount} hợp đồng</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center font-bold">
            <BadgeDollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7A93AD] font-bold">Tổng tiền cọc đang giữ</span>
            <div className="text-2xl font-black text-[#253F5B]">
              {totalDeposit.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>
      </div>

      {/* 3. Controls & Filter */}
      <div className="bg-white p-4 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 bg-[#F6F9FD] p-1.5 rounded-2xl border border-[#E2EEF8] w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === "all"
                  ? "bg-[#253F5B] text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              Tất cả ({contracts.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("active")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === "active"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              Đang hiệu lực ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("expiring_soon")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === "expiring_soon"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              Sắp hết hạn ({expiringCount})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#7A93AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã HĐ, tên khách, số phòng..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-medium text-[#253F5B] transition-all"
            />
          </div>
        </div>

        {/* Building Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0F5FA]">
          <span className="text-xs font-bold text-[#7A93AD] mr-1">Cơ sở:</span>
          <button
            type="button"
            onClick={() => setSelectedBuildingId("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              selectedBuildingId === "all"
                ? "bg-[#5C84BE] text-white"
                : "bg-[#F4F8FC] text-[#526579] hover:bg-[#EAF2F8]"
            }`}
          >
            Tất cả
          </button>
          {initialBuildings.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBuildingId(b.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                selectedBuildingId === b.id
                  ? "bg-[#5C84BE] text-white"
                  : "bg-[#F4F8FC] text-[#526579] hover:bg-[#EAF2F8]"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Contracts Table */}
      <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FBFE] border-b border-[#E3EDF6] text-[#526579] font-bold">
                <th className="py-4 px-6">Mã Hợp Đồng</th>
                <th className="py-4 px-4">Căn Hộ</th>
                <th className="py-4 px-4">Người Đại Diện</th>
                <th className="py-4 px-4">Thời Hạn Thuê</th>
                <th className="py-4 px-4">Giá Thuê / Cọc</th>
                <th className="py-4 px-4">Người / Xe</th>
                <th className="py-4 px-4">Trạng Thái</th>
                <th className="py-4 px-4 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5FA]">
              {filteredContracts.map((c) => (
                <tr key={c.id} className="hover:bg-[#F9FBFE] transition-colors">
                  {/* Mã HĐ */}
                  <td className="py-4 px-6">
                    <div className="font-mono font-black text-[#253F5B] text-xs">
                      {c.id}
                    </div>
                    <span className="text-[10px] text-[#7A93AD]">
                      Ký ngày: {c.createdAt}
                    </span>
                  </td>

                  {/* Phòng & Cơ sở */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-[#5C84BE] bg-[#EAF2F8] px-2.5 py-0.5 rounded-md text-xs">
                        {c.roomNumber}
                      </span>
                      <span className="text-[11px] text-[#7A93AD] font-semibold truncate max-w-[130px]">
                        {c.buildingName}
                      </span>
                    </div>
                  </td>

                  {/* Đại diện */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#253F5B] text-xs">
                      {c.representative.fullName}
                    </div>
                    <div className="text-[11px] text-[#7A93AD] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{c.representative.phone}</span>
                    </div>
                  </td>

                  {/* Thời hạn */}
                  <td className="py-4 px-4">
                    <div className="text-[#253F5B] font-bold">
                      {c.startDate} → {c.endDate}
                    </div>
                    <span className="text-[10px] text-[#7A93AD]">
                      Thu tiền ngày {c.paymentCycleDay} hàng tháng
                    </span>
                  </td>

                  {/* Giá & Cọc */}
                  <td className="py-4 px-4">
                    <div className="font-black text-[#253F5B]">
                      {c.monthlyRent.toLocaleString("vi-VN")} đ/tháng
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700">
                      Cọc: {c.deposit.toLocaleString("vi-VN")} đ (Đã thu)
                    </div>
                  </td>

                  {/* Người & Xe */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        <Users className="w-3 h-3 text-slate-600" />
                        <span>{c.occupantsCount} người</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                        <Bike className="w-3 h-3 text-amber-600" />
                        <span>{c.vehiclesCount} xe</span>
                      </span>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-4 px-4">
                    {c.status === "active" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Đang hiệu lực</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                        <span>Sắp hết hạn</span>
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setViewingContract(c)}
                      className="px-3 py-1.5 rounded-xl bg-[#F0F5FA] hover:bg-[#E2EEF8] text-[#5C84BE] font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xem Chi Tiết Hợp Đồng */}
      {viewingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-lg p-6 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
              <div>
                <h3 className="text-base font-black text-[#253F5B]">
                  Hợp Đồng {viewingContract.id}
                </h3>
                <p className="text-xs text-[#7A93AD]">
                  Phòng {viewingContract.roomNumber} - {viewingContract.buildingName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingContract(null)}
                className="w-8 h-8 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thông tin đại diện */}
            <div className="bg-[#F8FBFE] p-4 rounded-2xl border border-[#EAF2F8] space-y-2">
              <span className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider block">
                Người Đại Diện Ký HĐ
              </span>
              <div className="text-sm font-black text-[#253F5B]">
                {viewingContract.representative.fullName} ({viewingContract.representative.age} tuổi)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#526579]">
                <div>SĐT: <strong>{viewingContract.representative.phone}</strong></div>
                <div>CCCD: <strong>{viewingContract.representative.idCardNumber}</strong></div>
                <div>Quê quán: <strong>{viewingContract.representative.hometown}</strong></div>
                <div>Số người ở: <strong>{viewingContract.occupantsCount} người</strong></div>
              </div>
            </div>

            {/* Thông số thuê */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[#7A93AD] font-semibold">Giá thuê phòng</span>
                <div className="text-base font-black text-[#253F5B]">
                  {viewingContract.monthlyRent.toLocaleString("vi-VN")} đ
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-emerald-700 font-semibold">Tiền đặt cọc</span>
                <div className="text-base font-black text-emerald-800">
                  {viewingContract.deposit.toLocaleString("vi-VN")} đ
                </div>
              </div>
            </div>

            {/* Dịch vụ áp dụng */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#253F5B]">Bảng dịch vụ áp dụng:</span>
              <div className="grid grid-cols-2 gap-2">
                {viewingContract.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#F8FBFE] border border-[#EAF2F8] flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-[#253F5B]">{srv.name}</span>
                    <span className="font-bold text-[#5C84BE]">
                      {srv.price.toLocaleString("vi-VN")} {srv.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-[#7A93AD] p-3 rounded-xl bg-slate-50 border border-slate-200">
              {viewingContract.notes || "Hợp đồng có hiệu lực đầy đủ, bàn giao chìa khóa và thẻ từ."}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingContract(null)}
                className="px-5 py-2 rounded-xl bg-[#253F5B] text-white text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo Hợp Đồng Mới */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-lg p-6 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-[#253F5B]">
                  Tạo Hợp Đồng Thuê Phòng Mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Chọn Cơ sở & Phòng */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Thuộc cơ sở *</label>
                  <select
                    value={formBuildingId}
                    onChange={(e) => setFormBuildingId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-semibold text-[#253F5B]"
                  >
                    {initialBuildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Số phòng *</label>
                  <input
                    type="text"
                    required
                    value={formRoomNumber}
                    onChange={(e) => setFormRoomNumber(e.target.value)}
                    placeholder="P001"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                  />
                </div>
              </div>

              {/* Thông tin người đại diện */}
              <div className="space-y-3 pt-2 border-t border-[#F0F5FA]">
                <span className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider block">
                  Người Đại Diện (Chủ HĐ)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Họ & Tên *</label>
                    <input
                      type="text"
                      required
                      value={formRepName}
                      onChange={(e) => setFormRepName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={formRepPhone}
                      onChange={(e) => setFormRepPhone(e.target.value)}
                      placeholder="0912.345.678"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Số CCCD</label>
                    <input
                      type="text"
                      value={formRepIdCard}
                      onChange={(e) => setFormRepIdCard(e.target.value)}
                      placeholder="038202008912"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Quê quán</label>
                    <input
                      type="text"
                      value={formRepHometown}
                      onChange={(e) => setFormRepHometown(e.target.value)}
                      placeholder="Nghệ An, Hà Nội..."
                      className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Thời hạn & Giá */}
              <div className="space-y-3 pt-2 border-t border-[#F0F5FA]">
                <span className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider block">
                  Thời Hạn & Chi Phí
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Ngày bắt đầu</label>
                    <input
                      type="text"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      placeholder="01/01/2026"
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Ngày kết thúc</label>
                    <input
                      type="text"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      placeholder="01/01/2027"
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Giá thuê (VNĐ)</label>
                    <input
                      type="text"
                      value={formRent}
                      onChange={(e) => setFormRent(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-bold text-[#253F5B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Tiền cọc (VNĐ)</label>
                    <input
                      type="text"
                      value={formDeposit}
                      onChange={(e) => setFormDeposit(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-bold text-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Số người ở</label>
                    <input
                      type="number"
                      value={formOccupants}
                      onChange={(e) => setFormOccupants(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Số xe máy</label>
                    <input
                      type="number"
                      value={formVehicles}
                      onChange={(e) => setFormVehicles(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#253F5B]">Ngày thu tiền</label>
                    <input
                      type="number"
                      value={formCycleDay}
                      onChange={(e) => setFormCycleDay(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-bold text-[#5C84BE]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F0F5FA]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#526579] hover:bg-[#F0F5FA] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Hoàn Tất Hợp Đồng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
