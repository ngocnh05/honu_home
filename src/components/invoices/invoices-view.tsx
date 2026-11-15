"use client";

import * as React from "react";
import {
  Receipt,
  Plus,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  QrCode,
  Share2,
  Printer,
  Zap,
  Droplets,
  DollarSign,
  Phone,
  Check,
  X,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  User,
} from "lucide-react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { initialInvoices } from "@/lib/mock-data/invoices";
import { initialBuildings } from "@/lib/mock-data/buildings";
import { initialRooms } from "@/lib/mock-data/rooms";
import { getServicesByBuildingId } from "@/lib/mock-data/services";
import { useSnackbar } from "@/components/common/snackbar";

export function InvoicesView() {
  const { success, error } = useSnackbar();
  const [invoices, setInvoices] = React.useState<Invoice[]>(initialInvoices);
  const [selectedMonth, setSelectedMonth] = React.useState("Tháng 03/2026");
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<"all" | InvoiceStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal State
  const [viewingInvoice, setViewingInvoice] = React.useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  // Form State for Recording New Meter & Invoice
  const [formBuildingId, setFormBuildingId] = React.useState("bld_cg");
  const [formRoomNumber, setFormRoomNumber] = React.useState("P001");
  const [formTenantName, setFormTenantName] = React.useState("Quý Bình");
  const [formTenantPhone, setFormTenantPhone] = React.useState("0918.137.153");
  const [formRoomPrice, setFormRoomPrice] = React.useState("2.700.000");

  // Ngày chốt sổ & Hạn thu tiền
  const [formClosingDate, setFormClosingDate] = React.useState("2026-03-25");
  const [formDueDate, setFormDueDate] = React.useState("2026-03-28");

  // Đơn giá điện & nước theo từng phòng cụ thể
  const [formElecUnitPrice, setFormElecUnitPrice] = React.useState(3500);
  const [formWaterUnitPrice, setFormWaterUnitPrice] = React.useState(30000);

  // Electricity meters
  const [formElecOld, setFormElecOld] = React.useState(1250);
  const [formElecNew, setFormElecNew] = React.useState(1340);

  // Water meters
  const [formWaterOld, setFormWaterOld] = React.useState(48);
  const [formWaterNew, setFormWaterNew] = React.useState(54);

  // Helper date formatter (YYYY-MM-DD -> DD/MM/YYYY)
  const formatIsoToVn = (isoStr: string) => {
    if (!isoStr) return "";
    const parts = isoStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoStr;
  };

  // Helper tìm đơn giá điện & nước riêng của từng phòng (nếu có riêng, không lấy cào bằng)
  const resolveRoomRates = (
    r: (typeof initialRooms)[0],
    defaultElec: number,
    defaultWater: number
  ) => {
    let rElec: number | undefined = r.services?.electricityPrice;
    let rWater: number | undefined = r.services?.waterPrice;
    if (!rElec && r.customServices) {
      const s = r.customServices.find((x) => x.name.toLowerCase().includes("điện"));
      if (s && s.price) rElec = s.price;
    }
    if (!rWater && r.customServices) {
      const s = r.customServices.find((x) => x.name.toLowerCase().includes("nước"));
      if (s && s.price) rWater = s.price;
    }
    return {
      elecPrice: rElec || defaultElec,
      waterPrice: rWater || defaultWater,
    };
  };

  // Available rooms for selected building - CHỈ HIỂN THỊ PHÒNG ĐANG THUÊ (ẨN PHÒNG TRỐNG)
  const availableRooms = React.useMemo(() => {
    return initialRooms.filter(
      (r) =>
        r.buildingId === formBuildingId &&
        r.status === "rented" &&
        r.tenantName &&
        r.tenantName !== "---"
    );
  }, [formBuildingId]);

  // Building services lookup (Tự động lấy đơn giá theo từng cơ sở)
  const currentBuildingServices = React.useMemo(() => {
    return getServicesByBuildingId(formBuildingId);
  }, [formBuildingId]);

  const elecService = currentBuildingServices.find((s) => s.type === "meter" && s.name.toLowerCase().includes("điện"));
  const waterService = currentBuildingServices.find((s) => s.name.toLowerCase().includes("nước"));
  const wifiService = currentBuildingServices.find((s) => s.type === "per_room");

  const defaultBuildingElecPrice = elecService?.price || 3500;
  const defaultBuildingWaterPrice = waterService?.price || 30000;
  const wifiPrice = wifiService?.price || 50000;
  const serviceFee = 100000;
  const parkingFee = 200000;

  const handleSelectBuilding = (bId: string) => {
    setFormBuildingId(bId);
    const bldServices = getServicesByBuildingId(bId);
    const bldElec = bldServices.find((s) => s.type === "meter" && s.name.toLowerCase().includes("điện"))?.price || 3500;
    const bldWater = bldServices.find((s) => s.name.toLowerCase().includes("nước"))?.price || 30000;

    const rooms = initialRooms.filter(
      (r) =>
        r.buildingId === bId &&
        r.status === "rented" &&
        r.tenantName &&
        r.tenantName !== "---"
    );
    if (rooms.length > 0) {
      const firstRoom = rooms[0];
      setFormRoomNumber(firstRoom.roomNumber);
      setFormTenantName(firstRoom.tenantName);
      setFormTenantPhone(firstRoom.tenantPhone || "0912.345.678");
      setFormRoomPrice(firstRoom.price.toLocaleString("vi-VN"));
      setFormElecOld(firstRoom.initialElectricityIndex || 1250);
      setFormElecNew((firstRoom.initialElectricityIndex || 1250) + 85);
      setFormWaterOld(firstRoom.initialWaterIndex || 48);
      setFormWaterNew((firstRoom.initialWaterIndex || 48) + 6);

      const rates = resolveRoomRates(firstRoom, bldElec, bldWater);
      setFormElecUnitPrice(rates.elecPrice);
      setFormWaterUnitPrice(rates.waterPrice);
    } else {
      setFormRoomNumber("");
      setFormTenantName("");
      setFormTenantPhone("");
      setFormRoomPrice("0");
    }
  };

  const handleSelectRoom = (rNum: string) => {
    setFormRoomNumber(rNum);
    const r = initialRooms.find(
      (rm) => rm.roomNumber === rNum && rm.buildingId === formBuildingId
    );
    if (r) {
      setFormTenantName(r.tenantName && r.tenantName !== "---" ? r.tenantName : "Khách thuê");
      setFormTenantPhone(r.tenantPhone || "0912.345.678");
      setFormRoomPrice(r.price.toLocaleString("vi-VN"));
      setFormElecOld(r.initialElectricityIndex || 1250);
      setFormElecNew((r.initialElectricityIndex || 1250) + 85);
      setFormWaterOld(r.initialWaterIndex || 48);
      setFormWaterNew((r.initialWaterIndex || 48) + 6);

      const rates = resolveRoomRates(r, defaultBuildingElecPrice, defaultBuildingWaterPrice);
      setFormElecUnitPrice(rates.elecPrice);
      setFormWaterUnitPrice(rates.waterPrice);
    }
  };

  // Calculations
  const elecUsage = Math.max(0, formElecNew - formElecOld);
  const elecAmount = elecUsage * formElecUnitPrice;

  const waterUsage = Math.max(0, formWaterNew - formWaterOld);
  const waterAmount = waterUsage * formWaterUnitPrice;

  const cleanRoomPrice = Number(formRoomPrice.replace(/\D/g, "")) || 0;
  const totalBillCalculated =
    cleanRoomPrice + elecAmount + waterAmount + wifiPrice + serviceFee + parkingFee;

  // Filtered
  const filteredInvoices = React.useMemo(() => {
    return invoices.filter((inv) => {
      const matchMonth = inv.month === selectedMonth;
      const matchBuilding =
        selectedBuildingId === "all" || inv.buildingId === selectedBuildingId;
      const matchStatus = selectedStatus === "all" || inv.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        inv.id.toLowerCase().includes(q) ||
        inv.roomNumber.toLowerCase().includes(q) ||
        inv.tenantName.toLowerCase().includes(q) ||
        inv.tenantPhone.includes(q);
      return matchMonth && matchBuilding && matchStatus && matchQuery;
    });
  }, [invoices, selectedMonth, selectedBuildingId, selectedStatus, searchQuery]);

  // Statistics
  const totalBilled = filteredInvoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = filteredInvoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalRemaining = filteredInvoices.reduce((acc, i) => acc + i.remainingAmount, 0);
  const paidCount = filteredInvoices.filter((i) => i.status === "paid").length;

  // Mark as paid
  const handleMarkAsPaid = (invId: string) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === invId
          ? {
              ...i,
              status: "paid",
              statusLabel: "Đã thanh toán",
              paidAmount: i.totalAmount,
              remainingAmount: 0,
              paidDate: new Date().toLocaleDateString("vi-VN"),
            }
          : i
      )
    );
    success("Đã đánh dấu thanh toán thành công!");
    if (viewingInvoice && viewingInvoice.id === invId) {
      setViewingInvoice((prev) =>
        prev
          ? {
              ...prev,
              status: "paid",
              statusLabel: "Đã thanh toán",
              paidAmount: prev.totalAmount,
              remainingAmount: 0,
            }
          : null
      );
    }
  };

  // Submit New Invoice
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRoomNumber) {
      error("Vui lòng chọn phòng để chốt hóa đơn!");
      return;
    }
    const bld = initialBuildings.find((b) => b.id === formBuildingId);
    const buildingName = bld?.name || "HonuHome Cầu Giấy";

    const formattedDue = formatIsoToVn(formDueDate) || "28/03/2026";
    const formattedClosing = formatIsoToVn(formClosingDate) || "25/03/2026";

    const newInv: Invoice = {
      id: `INV-2026-03-${formRoomNumber.toUpperCase()}`,
      month: selectedMonth,
      roomNumber: formRoomNumber.trim().toUpperCase(),
      buildingId: formBuildingId,
      buildingName,
      tenantName: formTenantName.trim(),
      tenantPhone: formTenantPhone.trim(),
      roomPrice: cleanRoomPrice,
      electricity: {
        oldIndex: formElecOld,
        newIndex: formElecNew,
        usage: elecUsage,
        unitPrice: formElecUnitPrice,
        amount: elecAmount,
      },
      water: {
        oldIndex: formWaterOld,
        newIndex: formWaterNew,
        usage: waterUsage,
        unitPrice: formWaterUnitPrice,
        amount: waterAmount,
      },
      services: [
        { name: "Internet Wifi", quantity: 1, unit: "phòng", unitPrice: wifiPrice, amount: wifiPrice },
        { name: "Vệ sinh & Thang máy", quantity: 2, unit: "người", unitPrice: 50000, amount: serviceFee },
        { name: "Gửi xe máy", quantity: 2, unit: "xe", unitPrice: 100000, amount: parkingFee },
      ],
      totalAmount: totalBillCalculated,
      paidAmount: 0,
      remainingAmount: totalBillCalculated,
      status: "unpaid",
      statusLabel: "Chờ thanh toán",
      dueDate: formattedDue,
      createdAt: formattedClosing,
      notes: `Chốt số điện nước ngày ${formattedClosing}.`,
    };

    setInvoices((prev) => [newInv, ...prev]);
    success(`Đã xuất hóa đơn ${newInv.id} cho phòng ${newInv.roomNumber}!`);
    setShowCreateModal(false);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shadow-inner">
            <Receipt className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Hóa Đơn Thu Tiền Hàng Tháng
              </h1>
              {/* Month Picker */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full border border-[#D8E6F3] outline-none cursor-pointer"
              >
                <option value="Tháng 03/2026">Tháng 03/2026</option>
                <option value="Tháng 02/2026">Tháng 02/2026</option>
                <option value="Tháng 01/2026">Tháng 01/2026</option>
              </select>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Chốt chỉ số điện/nước hàng tháng, tự động tính tiền phòng + dịch vụ, xuất phiếu thu và mã VietQR
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="h-11 px-5 rounded-2xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Chốt Điện Nước & Ra Hóa Đơn</span>
        </button>
      </div>

      {/* 2. Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7A93AD] font-bold">Tổng doanh thu kỳ này</span>
            <div className="text-2xl font-black text-[#253F5B]">
              {totalBilled.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7A93AD] font-bold">
              Đã thu ({paidCount}/{filteredInvoices.length} phòng)
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {totalPaid.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7A93AD] font-bold">Còn phải thu</span>
            <div className="text-2xl font-black text-rose-600">
              {totalRemaining.toLocaleString("vi-VN")} đ
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
              Tất cả ({invoices.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("paid")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === "paid"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              Đã thanh toán
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("unpaid")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === "unpaid"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              Chờ thanh toán
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("overdue")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === "overdue"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              Quá hạn
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#7A93AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo số phòng, tên khách, SĐT..."
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

      {/* 4. Invoices Table */}
      <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FBFE] border-b border-[#E3EDF6] text-[#526579] font-bold">
                <th className="py-4 px-5">Phòng & Cơ sở</th>
                <th className="py-4 px-4">Khách đại diện</th>
                <th className="py-4 px-4">Tiền phòng</th>
                <th className="py-4 px-4 min-w-[210px]">
                  <div className="flex items-center gap-1.5 text-amber-900">
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Tiền điện</span>
                  </div>
                </th>
                <th className="py-4 px-4 min-w-[210px]">
                  <div className="flex items-center gap-1.5 text-sky-900">
                    <Droplets className="w-3.5 h-3.5 text-sky-600 fill-sky-500" />
                    <span>Tiền nước</span>
                  </div>
                </th>
                <th className="py-4 px-4">Dịch vụ khác</th>
                <th className="py-4 px-4">Tổng hóa đơn</th>
                <th className="py-4 px-4">Trạng thái</th>
                <th className="py-4 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5FA]">
              {filteredInvoices.map((inv) => {
                const otherServicesTotal = inv.services.reduce((a, b) => a + b.amount, 0);
                return (
                  <tr key={inv.id} className="hover:bg-[#F9FBFE] transition-colors">
                    {/* Phòng & Cơ sở */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-[#5C84BE] bg-[#EAF2F8] px-2.5 py-1.5 rounded-xl text-xs shadow-2xs">
                          {inv.roomNumber}
                        </span>
                        <div>
                          <div className="font-bold text-[#253F5B] text-xs">
                            {inv.buildingName}
                          </div>
                          <span className="text-[10px] text-[#7A93AD] font-mono block">
                            {inv.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Khách đại diện */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F0F5FA] border border-[#D9E6F2] flex items-center justify-center text-[#5C84BE] shrink-0 font-bold text-xs">
                          <User className="w-3.5 h-3.5 text-[#5C84BE]" />
                        </div>
                        <div>
                          <div className="font-bold text-[#253F5B] text-xs">{inv.tenantName}</div>
                          <span className="text-[10px] text-[#7A93AD] block">{inv.tenantPhone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tiền phòng */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-[#253F5B] text-xs">
                        {inv.roomPrice.toLocaleString("vi-VN")} đ
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                        Cố định tháng
                      </span>
                    </td>

                    {/* Tiền điện - Thiết kế thẻ trực quan giống Hình 2 */}
                    <td className="py-3.5 px-4">
                      <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                          <span className="flex items-center gap-1 text-[11px] text-amber-900 font-bold">
                            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                            <span>{inv.electricity.unitPrice.toLocaleString("vi-VN")} đ/kWh</span>
                          </span>
                          <span className="text-xs font-black text-amber-950">
                            {inv.electricity.amount.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] bg-white/90 border border-amber-200/70 rounded-lg px-2 py-1 font-medium text-amber-900">
                          <span>Số: {inv.electricity.oldIndex} → {inv.electricity.newIndex}</span>
                          <span className="font-black text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded">
                            {inv.electricity.usage} kWh
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tiền nước - Thiết kế thẻ trực quan giống Hình 2 */}
                    <td className="py-3.5 px-4">
                      <div className="p-2.5 rounded-2xl bg-sky-50/70 border border-sky-200/90 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-sky-950">
                          <span className="flex items-center gap-1 text-[11px] text-sky-900 font-bold">
                            <Droplets className="w-3.5 h-3.5 text-sky-600 fill-sky-500 shrink-0" />
                            <span>{inv.water.unitPrice.toLocaleString("vi-VN")} đ/khối</span>
                          </span>
                          <span className="text-xs font-black text-sky-950">
                            {inv.water.amount.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] bg-white/90 border border-sky-200/70 rounded-lg px-2 py-1 font-medium text-sky-900">
                          <span>Số: {inv.water.oldIndex} → {inv.water.newIndex}</span>
                          <span className="font-black text-sky-800 bg-sky-100/90 px-1.5 py-0.5 rounded">
                            {inv.water.usage} khối
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Dịch vụ khác */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#526579] text-xs">
                        {otherServicesTotal.toLocaleString("vi-VN")} đ
                      </div>
                      <span className="text-[10px] text-[#7A93AD] bg-[#F4F8FC] border border-[#E2EEF8] px-1.5 py-0.5 rounded inline-block mt-0.5">
                        {inv.services.length} dịch vụ
                      </span>
                    </td>

                    {/* Tổng bill */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-sm text-[#253F5B] tracking-tight">
                        {inv.totalAmount.toLocaleString("vi-VN")} đ
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] text-[#7A93AD] bg-[#F0F5FA] px-1.5 py-0.5 rounded font-medium mt-0.5">
                        <Clock className="w-3 h-3 text-[#7A93AD]" />
                        <span>Hạn: {inv.dueDate}</span>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4">
                      {inv.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Đã thu</span>
                        </span>
                      ) : inv.status === "unpaid" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Chờ thu</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Quá hạn</span>
                        </span>
                      )}
                    </td>

                    {/* Xem chi tiết */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setViewingInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl bg-[#F0F5FA] hover:bg-[#E2EEF8] text-[#5C84BE] font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Phiếu thu</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xem Phiếu Thu & Mã QR VietQR */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col p-6 sm:p-7 space-y-4 animate-scaleUp overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    Phiếu Thu Tiền Phòng {viewingInvoice.roomNumber}
                  </h3>
                  <p className="text-xs text-[#7A93AD]">
                    {viewingInvoice.month} • {viewingInvoice.buildingName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingInvoice(null)}
                className="w-9 h-9 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              {/* Chi tiết người nhận & Hạn nộp */}
              <div className="bg-[#F8FBFE] p-4 rounded-2xl border border-[#EAF2F8] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#7A93AD] font-semibold block">Khách đại diện:</span>
                  <span className="text-sm font-black text-[#253F5B]">
                    {viewingInvoice.tenantName}
                  </span>
                  <span className="text-[11px] text-[#526579] block">
                    SĐT: {viewingInvoice.tenantPhone}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#7A93AD] font-semibold block">Hạn nộp tiền:</span>
                  <span className="font-bold text-rose-600">{viewingInvoice.dueDate}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Mã HĐ: {viewingInvoice.id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Bảng kê chi phí */}
                <div className="md:col-span-7 space-y-2 text-xs">
                  <span className="font-bold text-[#253F5B] uppercase tracking-wider text-[11px] block">
                    Chi tiết các khoản thu trong tháng:
                  </span>

                  <div className="space-y-1.5 divide-y divide-[#F0F5FA] border border-[#EAF2F8] rounded-2xl p-3.5 bg-white shadow-2xs">
                    {/* 1. Tiền phòng */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-semibold text-[#526579]">1. Tiền thuê phòng:</span>
                      <span className="font-bold text-[#253F5B]">
                        {viewingInvoice.roomPrice.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    {/* 2. Tiền điện */}
                    <div className="flex items-center justify-between pt-1.5">
                      <div>
                        <span className="font-semibold text-[#526579]">2. Tiền điện sinh hoạt:</span>
                        <span className="text-[10px] text-[#7A93AD] block">
                          {viewingInvoice.electricity.usage} kWh ({viewingInvoice.electricity.oldIndex} → {viewingInvoice.electricity.newIndex}) × 3.500đ
                        </span>
                      </div>
                      <span className="font-bold text-[#253F5B]">
                        {viewingInvoice.electricity.amount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    {/* 3. Tiền nước */}
                    <div className="flex items-center justify-between pt-1.5">
                      <div>
                        <span className="font-semibold text-[#526579]">3. Tiền nước sạch:</span>
                        <span className="text-[10px] text-[#7A93AD] block">
                          {viewingInvoice.water.usage} khối ({viewingInvoice.water.oldIndex} → {viewingInvoice.water.newIndex}) × 30.000đ
                        </span>
                      </div>
                      <span className="font-bold text-[#253F5B]">
                        {viewingInvoice.water.amount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    {/* 4. Dịch vụ kèm theo */}
                    {viewingInvoice.services.map((srv, idx) => (
                      <div key={idx} className="flex items-center justify-between pt-1.5">
                        <div>
                          <span className="font-semibold text-[#526579]">
                            {4 + idx}. {srv.name}:
                          </span>
                          <span className="text-[10px] text-[#7A93AD] block">
                            {srv.quantity} {srv.unit} × {srv.unitPrice.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                        <span className="font-bold text-[#253F5B]">
                          {srv.amount.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ))}

                    {/* Tổng cộng */}
                    <div className="flex items-center justify-between pt-2.5 font-black text-xs text-[#253F5B]">
                      <span>TỔNG CỘNG THANH TOÁN:</span>
                      <span className="text-base text-rose-600">
                        {viewingInvoice.totalAmount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mã VietQR Thanh Toán */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-3 p-4 rounded-2xl bg-[#F8FBFE] border border-[#DEEAF4]">
                  <div>
                    <span className="font-bold text-xs text-[#253F5B] block mb-2">
                      Quét mã VietQR chuyển khoản:
                    </span>
                    <div className="w-full flex items-center justify-center p-3 bg-white rounded-xl border border-[#D9E6F2] shadow-2xs">
                      <QrCode className="w-32 h-32 text-slate-800" />
                    </div>
                  </div>
                  <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-[#E3EDF6]">
                    <p className="text-[#526579]">
                      Ngân hàng: <strong>Techcombank</strong>
                    </p>
                    <p className="text-[#526579]">
                      Số tài khoản: <strong>1903688888</strong>
                    </p>
                    <p className="text-[11px] text-[#7A93AD]">
                      Cú pháp: <strong>{viewingInvoice.roomNumber} {viewingInvoice.month.replace("Tháng ", "T")}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F0F5FA] shrink-0">
              {viewingInvoice.status !== "paid" ? (
                <button
                  type="button"
                  onClick={() => handleMarkAsPaid(viewingInvoice.id)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác nhận Đã Thu Tiền</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hóa đơn đã được thanh toán</span>
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `HonuHome thông báo phiếu thu tiền phòng ${viewingInvoice.roomNumber} - ${viewingInvoice.month}: Tổng tiền: ${viewingInvoice.totalAmount.toLocaleString("vi-VN")} đ. Hạn nộp: ${viewingInvoice.dueDate}.`
                    );
                    success("Đã copy nội dung thông báo gửi Zalo cho khách!");
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#D9E6F2] hover:bg-gray-50 text-xs font-bold text-[#526579] cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Gửi Zalo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#253F5B] hover:bg-[#1B2F44] text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chốt Điện Nước & Ra Hóa Đơn (Wide 2-Column Layout - No Scroll) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-4xl lg:max-w-5xl max-h-[94vh] flex flex-col p-6 sm:p-7 space-y-4 animate-scaleUp overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    Chốt Chỉ Số Điện Nước & Ra Hóa Đơn Thu Tiền
                  </h3>
                  <p className="text-xs text-[#7A93AD]">
                    Chọn phòng để tự động nạp khách thuê, giá phòng, chỉ số cũ và tính tự động tổng tiền
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-9 h-9 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Cột 1: Thông tin phòng & Khách thuê */}
                <div className="md:col-span-5 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    1. Căn Phòng & Kỳ Chốt
                  </span>

                  {/* Chọn Cơ sở & Chọn Phòng (Chỉ hiển thị phòng đang thuê - ẩn phòng trống) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Cơ sở *</label>
                      <select
                        value={formBuildingId}
                        onChange={(e) => handleSelectBuilding(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-semibold text-[#253F5B] cursor-pointer"
                      >
                        {initialBuildings.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">
                        Chọn phòng chốt *{" "}
                        <span className="text-[10px] text-[#7A93AD] font-normal">
                          ({availableRooms.length} đang thuê)
                        </span>
                      </label>
                      <select
                        value={formRoomNumber}
                        onChange={(e) => handleSelectRoom(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-bold text-[#253F5B] cursor-pointer"
                      >
                        {availableRooms.length === 0 ? (
                          <option value="" disabled>
                            Không có phòng đang thuê
                          </option>
                        ) : (
                          availableRooms.map((r) => (
                            <option key={r.id} value={r.roomNumber}>
                              Phòng {r.roomNumber} ({r.tenantName})
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Thông tin tự động từ phòng chọn: Khách đại diện & Giá thuê (Không cần nhập thủ công) */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F6FAFE] to-[#EFF6FD] border border-[#D5E5F5] flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#D8E6F3] flex items-center justify-center text-[#5C84BE] shadow-2xs">
                        <User className="w-4 h-4 text-[#5C84BE]" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#7A93AD] font-bold uppercase tracking-wider block">
                          Khách đại diện
                        </span>
                        <span className="text-xs font-black text-[#253F5B] block">
                          {formTenantName || "Chưa có khách thuê"}
                        </span>
                        {formTenantPhone && (
                          <span className="text-[10px] text-[#7A93AD] block">
                            {formTenantPhone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#7A93AD] font-bold uppercase tracking-wider block">
                        Tiền phòng
                      </span>
                      <span className="text-sm font-black text-[#5C84BE] block">
                        {cleanRoomPrice.toLocaleString("vi-VN")} đ
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold block">
                        Theo hợp đồng
                      </span>
                    </div>
                  </div>

                  {/* Bổ sung Ngày chốt sổ & Hạn thu tiền */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#5C84BE]" />
                        <span>Ngày chốt sổ *</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formClosingDate}
                        onChange={(e) => setFormClosingDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-bold text-[#253F5B] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        <span>Hạn thu tiền *</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formDueDate}
                        onChange={(e) => setFormDueDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-bold text-rose-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Dịch vụ cố định */}
                  <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#EAF2F8] space-y-1.5 text-xs">
                    <span className="font-bold text-[#5C84BE] block text-[11px]">Dịch vụ cố định áp dụng:</span>
                    <div className="flex items-center justify-between text-[#526579]">
                      <span>Internet / Wifi:</span>
                      <span className="font-bold text-[#253F5B]">{wifiPrice.toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div className="flex items-center justify-between text-[#526579]">
                      <span>Vệ sinh & Thang máy:</span>
                      <span className="font-bold text-[#253F5B]">{serviceFee.toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div className="flex items-center justify-between text-[#526579]">
                      <span>Gửi xe máy:</span>
                      <span className="font-bold text-[#253F5B]">{parkingFee.toLocaleString("vi-VN")} đ</span>
                    </div>
                  </div>
                </div>

                {/* Cột 2: Chốt chỉ số tiêu thụ & Tổng tiền */}
                <div className="md:col-span-7 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    2. Chốt Số Điện - Nước & Tổng Hóa Đơn
                  </span>

                  {/* Chốt chỉ số ĐIỆN */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                        <span>Chỉ số ĐIỆN</span>
                        <span className="text-[11px] text-amber-800 font-normal">
                          (Đơn giá phòng:
                        </span>
                        <input
                          type="number"
                          value={formElecUnitPrice}
                          onChange={(e) => setFormElecUnitPrice(Number(e.target.value) || 0)}
                          className="w-16 h-6 px-1 text-center font-black text-amber-950 bg-white border border-amber-300 rounded text-xs outline-none"
                        />
                        <span className="text-[11px] text-amber-800 font-normal">đ/kWh)</span>
                      </div>
                      <span className="text-sm font-black text-amber-900">{elecAmount.toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-[#7A93AD] font-semibold block">Số cũ</label>
                        <input
                          type="number"
                          value={formElecOld}
                          onChange={(e) => setFormElecOld(Number(e.target.value) || 0)}
                          className="w-full h-9 px-2.5 rounded-lg border border-amber-200 bg-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#7A93AD] font-semibold block">Số mới</label>
                        <input
                          type="number"
                          value={formElecNew}
                          onChange={(e) => setFormElecNew(Number(e.target.value) || 0)}
                          className="w-full h-9 px-2.5 rounded-lg border border-amber-300 bg-white text-xs font-black text-amber-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#7A93AD] font-semibold block">Tiêu thụ</label>
                        <div className="w-full h-9 flex items-center justify-center font-black text-xs text-amber-800 bg-amber-100 rounded-lg">
                          {elecUsage} kWh
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chốt chỉ số NƯỚC */}
                  <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Droplets className="w-4 h-4 text-sky-600 fill-sky-500" />
                        <span>Chỉ số NƯỚC</span>
                        <span className="text-[11px] text-sky-800 font-normal">
                          (Đơn giá phòng:
                        </span>
                        <input
                          type="number"
                          value={formWaterUnitPrice}
                          onChange={(e) => setFormWaterUnitPrice(Number(e.target.value) || 0)}
                          className="w-20 h-6 px-1 text-center font-black text-sky-950 bg-white border border-sky-300 rounded text-xs outline-none"
                        />
                        <span className="text-[11px] text-sky-800 font-normal">đ/khối)</span>
                      </div>
                      <span className="text-sm font-black text-sky-950">{waterAmount.toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-[#7A93AD] font-semibold block">Số cũ</label>
                        <input
                          type="number"
                          value={formWaterOld}
                          onChange={(e) => setFormWaterOld(Number(e.target.value) || 0)}
                          className="w-full h-9 px-2.5 rounded-lg border border-sky-200 bg-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#7A93AD] font-semibold block">Số mới</label>
                        <input
                          type="number"
                          value={formWaterNew}
                          onChange={(e) => setFormWaterNew(Number(e.target.value) || 0)}
                          className="w-full h-9 px-2.5 rounded-lg border border-sky-300 bg-white text-xs font-black text-sky-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#7A93AD] font-semibold block">Tiêu thụ</label>
                        <div className="w-full h-9 flex items-center justify-center font-black text-xs text-sky-800 bg-sky-100 rounded-lg">
                          {waterUsage} khối
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tự động tính tổng tiền */}
                  <div className="p-3.5 rounded-2xl bg-[#253F5B] text-white flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-300 block">
                        Tổng hóa đơn (Phòng + Điện + Nước + Wifi + Phí DV + Xe):
                      </span>
                      <div className="text-xl font-black text-emerald-400">
                        {totalBillCalculated.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#EAF2F8] bg-white/10 px-2.5 py-1 rounded-lg">
                      Tự động tính
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0F5FA] shrink-0">
                <span className="text-xs text-[#7A93AD] hidden sm:block">
                  💡 Hóa đơn sau khi xuất sẽ tạo mã VietQR chuyển khoản và sẵn sàng gửi thông báo.
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="h-10 px-5 rounded-xl text-xs font-bold text-[#526579] hover:bg-[#F0F5FA] cursor-pointer transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xuất Hóa Đơn & Lưu</span>
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
