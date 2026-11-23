"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { initialRooms } from "@/lib/mock-data/rooms";
import { getServicesByBuildingId } from "@/lib/mock-data/services";
import { useSnackbar } from "@/components/common/snackbar";

export function ContractsView() {
  const searchParams = useSearchParams();
  const paramStatus = searchParams.get("status") as ("all" | ContractStatus) | null;
  const paramBuilding = searchParams.get("buildingId");
  const paramRoom = searchParams.get("roomNumber") || searchParams.get("room");
  const paramNew = searchParams.get("new");

  const { success, error } = useSnackbar();
  const [contracts, setContracts] = React.useState<Contract[]>(initialContracts);
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<string>(paramBuilding || "all");
  const [selectedStatus, setSelectedStatus] = React.useState<"all" | ContractStatus>(paramStatus || "all");
  const [searchQuery, setSearchQuery] = React.useState(paramRoom || "");

  // Modal State
  const [showModal, setShowModal] = React.useState(paramNew === "true");
  const [viewingContract, setViewingContract] = React.useState<Contract | null>(null);

  React.useEffect(() => {
    if (paramStatus) setSelectedStatus(paramStatus);
  }, [paramStatus]);

  React.useEffect(() => {
    if (paramBuilding) setSelectedBuildingId(paramBuilding);
  }, [paramBuilding]);

  React.useEffect(() => {
    if (paramRoom) setSearchQuery(paramRoom);
  }, [paramRoom]);

  React.useEffect(() => {
    if (paramNew === "true") setShowModal(true);
  }, [paramNew]);

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

  // Available rooms for selected building
  const availableRooms = React.useMemo(() => {
    return initialRooms.filter((r) => r.buildingId === formBuildingId);
  }, [formBuildingId]);

  const handleSelectBuilding = (bId: string) => {
    setFormBuildingId(bId);
    const rooms = initialRooms.filter((r) => r.buildingId === bId);
    if (rooms.length > 0) {
      const firstRoom = rooms[0];
      setFormRoomNumber(firstRoom.roomNumber);
      setFormRent(firstRoom.price.toLocaleString("vi-VN"));
      setFormDeposit(firstRoom.price.toLocaleString("vi-VN"));
      if (firstRoom.tenantName && firstRoom.tenantName !== "---") setFormRepName(firstRoom.tenantName);
      if (firstRoom.tenantPhone) setFormRepPhone(firstRoom.tenantPhone);
      if (firstRoom.tenantHometown) setFormRepHometown(firstRoom.tenantHometown);
    }
  };

  const handleSelectRoom = (rNum: string) => {
    setFormRoomNumber(rNum);
    const r = initialRooms.find((rm) => rm.roomNumber === rNum && rm.buildingId === formBuildingId);
    if (r) {
      setFormRent(r.price.toLocaleString("vi-VN"));
      setFormDeposit(r.price.toLocaleString("vi-VN"));
      if (r.tenantName && r.tenantName !== "---") setFormRepName(r.tenantName);
      if (r.tenantPhone) setFormRepPhone(r.tenantPhone);
      if (r.tenantHometown) setFormRepHometown(r.tenantHometown);
    }
  };

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
      services: getServicesByBuildingId(formBuildingId).map((s) => ({
        name: s.name,
        price: s.price,
        unit: s.unit,
      })),
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
                      <Link
                        href={`/rooms/${c.roomNumber}`}
                        className="font-black text-[#5C84BE] bg-[#EAF2F8] hover:bg-[#d5e7f7] px-2.5 py-0.5 rounded-md text-xs transition-colors cursor-pointer"
                        title={`Xem chi tiết phòng ${c.roomNumber}`}
                      >
                        {c.roomNumber}
                      </Link>
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
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col p-6 sm:p-7 space-y-4 animate-scaleUp overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    Chi Tiết Hợp Đồng {viewingContract.id}
                  </h3>
                  <p className="text-xs text-[#7A93AD]">
                    Phòng {viewingContract.roomNumber} • {viewingContract.buildingName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingContract(null)}
                className="w-9 h-9 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thông tin đại diện */}
                <div className="bg-[#F8FBFE] p-4 rounded-2xl border border-[#EAF2F8] space-y-2.5">
                  <span className="text-xs font-bold text-[#5C84BE] uppercase tracking-wider block">
                    Người Đại Diện Ký Hợp Đồng
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
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[#7A93AD] font-semibold text-xs block">Giá thuê phòng</span>
                    <div className="text-lg font-black text-[#253F5B]">
                      {viewingContract.monthlyRent.toLocaleString("vi-VN")} đ
                    </div>
                    <span className="text-[10px] text-[#7A93AD]">Thanh toán ngày {viewingContract.paymentCycleDay} hàng tháng</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-emerald-700 font-semibold text-xs block">Tiền đặt cọc</span>
                    <div className="text-lg font-black text-emerald-800">
                      {viewingContract.deposit.toLocaleString("vi-VN")} đ
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {viewingContract.depositStatus === "paid" ? "✓ Đã thu đủ cọc" : "Chưa thu cọc"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dịch vụ áp dụng */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#253F5B] block">Dịch vụ áp dụng cho hợp đồng:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {viewingContract.services.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F8FBFE] border border-[#EAF2F8] flex flex-col justify-between text-xs"
                    >
                      <span className="font-semibold text-[#253F5B]">{srv.name}</span>
                      <span className="font-extrabold text-[#5C84BE] mt-1">
                        {srv.price.toLocaleString("vi-VN")} {srv.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[#526579] p-3 rounded-xl bg-slate-50 border border-slate-200">
                Ghi chú: {viewingContract.notes || "Hợp đồng có hiệu lực đầy đủ, bàn giao 02 chìa khóa cơ và 01 thẻ từ thang máy."}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#F0F5FA] shrink-0">
              <button
                type="button"
                onClick={() => setViewingContract(null)}
                className="px-5 py-2.5 rounded-xl bg-[#253F5B] hover:bg-[#1B2F44] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo Hợp Đồng Mới (Wide 2-Column Layout - No Scroll) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-4xl lg:max-w-5xl max-h-[94vh] flex flex-col p-6 sm:p-7 space-y-4 animate-scaleUp overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    Tạo Hợp Đồng Thuê Phòng Mới
                  </h3>
                  <p className="text-xs text-[#7A93AD]">
                    Chọn cơ sở, căn phòng và hoàn thiện hợp đồng thuê với đầy đủ người đại diện
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Cột 1: Thông tin phòng & Đại diện */}
                <div className="md:col-span-6 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    1. Căn Phòng & Người Đại Diện
                  </span>

                  {/* Chọn Cơ sở & Chọn Phòng từ danh sách */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Cơ sở *</label>
                      <select
                        value={formBuildingId}
                        onChange={(e) => handleSelectBuilding(e.target.value)}
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
                      <label className="text-xs font-bold text-[#253F5B]">Chọn căn phòng *</label>
                      <select
                        value={formRoomNumber}
                        onChange={(e) => handleSelectRoom(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-bold text-[#253F5B]"
                      >
                        {availableRooms.map((r) => (
                          <option key={r.id} value={r.roomNumber}>
                            Phòng {r.roomNumber} ({r.type} - {r.priceFormatted})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Họ và tên đại diện *</label>
                      <input
                        type="text"
                        required
                        value={formRepName}
                        onChange={(e) => setFormRepName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white text-xs font-bold text-[#253F5B]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        value={formRepPhone}
                        onChange={(e) => setFormRepPhone(e.target.value)}
                        placeholder="0912.345.678"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white text-xs font-bold text-[#253F5B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Số CCCD (12 số)</label>
                      <input
                        type="text"
                        value={formRepIdCard}
                        onChange={(e) => setFormRepIdCard(e.target.value)}
                        placeholder="038202008912"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white text-xs font-mono text-[#253F5B]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Quê quán</label>
                      <input
                        type="text"
                        value={formRepHometown}
                        onChange={(e) => setFormRepHometown(e.target.value)}
                        placeholder="Nghệ An, Hà Nội..."
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white text-xs text-[#253F5B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Cột 2: Thời hạn, Chi phí & Dịch vụ */}
                <div className="md:col-span-6 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    2. Thời Hạn, Chi Phí & Dịch Vụ
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Ngày bắt đầu</label>
                      <input
                        type="text"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        placeholder="01/01/2026"
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Giá thuê (VNĐ/tháng)</label>
                      <input
                        type="text"
                        value={formRent}
                        onChange={(e) => setFormRent(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-black text-[#253F5B]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Tiền cọc (VNĐ)</label>
                      <input
                        type="text"
                        value={formDeposit}
                        onChange={(e) => setFormDeposit(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-black text-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Số người ở</label>
                      <input
                        type="number"
                        value={formOccupants}
                        onChange={(e) => setFormOccupants(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Số xe máy</label>
                      <input
                        type="number"
                        value={formVehicles}
                        onChange={(e) => setFormVehicles(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Ngày chốt bill</label>
                      <input
                        type="number"
                        value={formCycleDay}
                        onChange={(e) => setFormCycleDay(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] text-xs font-bold text-[#5C84BE]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0F5FA] shrink-0">
                <span className="text-xs text-[#7A93AD] hidden sm:block">
                  💡 Hợp đồng sẽ tự động gán khách vào phòng và áp dụng bảng dịch vụ của cơ sở.
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="h-10 px-5 rounded-xl text-xs font-bold text-[#526579] hover:bg-[#F0F5FA] cursor-pointer transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hoàn Tất Hợp Đồng</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
