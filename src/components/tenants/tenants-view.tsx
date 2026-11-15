"use client";

import * as React from "react";
import {
  Users,
  UserCheck,
  User,
  Plus,
  Search,
  Building2,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Bike,
  Edit2,
  Trash2,
  X,
  BadgeCheck,
  CheckCircle2,
  Filter,
} from "lucide-react";
import type { Tenant, TenantRole, TenantStatus } from "@/types/tenant";
import { initialTenants } from "@/lib/mock-data/tenants";
import { initialBuildings } from "@/lib/mock-data/buildings";
import { initialRooms } from "@/lib/mock-data/rooms";
import { useSnackbar } from "@/components/common/snackbar";

export function TenantsView() {
  const { success, error } = useSnackbar();
  const [tenants, setTenants] = React.useState<Tenant[]>(initialTenants);
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<string>("all");
  const [selectedRole, setSelectedRole] = React.useState<"all" | TenantRole>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal State
  const [showModal, setShowModal] = React.useState(false);
  const [editingTenant, setEditingTenant] = React.useState<Tenant | null>(null);

  // Form State
  const [formFullName, setFormFullName] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formIdCard, setFormIdCard] = React.useState("");
  const [formHometown, setFormHometown] = React.useState("");
  const [formAge, setFormAge] = React.useState("22");
  const [formGender, setFormGender] = React.useState<"Nam" | "Nữ">("Nam");
  const [formRole, setFormRole] = React.useState<TenantRole>("representative");
  const [formBuildingId, setFormBuildingId] = React.useState("bld_cg");
  const [formRoomNumber, setFormRoomNumber] = React.useState("P001");
  const [formVehiclePlate, setFormVehiclePlate] = React.useState("");
  const [formStartDate, setFormStartDate] = React.useState("01/01/2026");
  const [formNotes, setFormNotes] = React.useState("");

  // Available rooms for selected building
  const availableRooms = React.useMemo(() => {
    return initialRooms.filter((r) => r.buildingId === formBuildingId);
  }, [formBuildingId]);

  const handleSelectBuilding = (bId: string) => {
    setFormBuildingId(bId);
    const rooms = initialRooms.filter((r) => r.buildingId === bId);
    if (rooms.length > 0) {
      setFormRoomNumber(rooms[0].roomNumber);
    }
  };

  // Filtered tenants
  const filteredTenants = React.useMemo(() => {
    return tenants.filter((t) => {
      const matchBuilding =
        selectedBuildingId === "all" || t.buildingId === selectedBuildingId;
      const matchRole = selectedRole === "all" || t.role === selectedRole;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        t.fullName.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.idCardNumber.includes(q) ||
        t.roomNumber.toLowerCase().includes(q) ||
        t.hometown.toLowerCase().includes(q);
      return matchBuilding && matchRole && matchQuery;
    });
  }, [tenants, selectedBuildingId, selectedRole, searchQuery]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingTenant(null);
    setFormFullName("");
    setFormPhone("");
    setFormIdCard("");
    setFormHometown("Hà Nội");
    setFormAge("23");
    setFormGender("Nam");
    setFormRole("representative");
    setFormBuildingId(selectedBuildingId !== "all" ? selectedBuildingId : "bld_cg");
    setFormRoomNumber("P001");
    setFormVehiclePlate("");
    setFormStartDate("01/01/2026");
    setFormNotes("");
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (t: Tenant) => {
    setEditingTenant(t);
    setFormFullName(t.fullName);
    setFormPhone(t.phone);
    setFormIdCard(t.idCardNumber);
    setFormHometown(t.hometown);
    setFormAge(String(t.age));
    setFormGender(t.gender);
    setFormRole(t.role);
    setFormBuildingId(t.buildingId);
    setFormRoomNumber(t.roomNumber);
    setFormVehiclePlate(t.vehiclePlate || "");
    setFormStartDate(t.startDate);
    setFormNotes(t.notes || "");
    setShowModal(true);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim()) {
      error("Vui lòng nhập họ và tên khách thuê");
      return;
    }
    if (!formPhone.trim()) {
      error("Vui lòng nhập số điện thoại");
      return;
    }

    const bld = initialBuildings.find((b) => b.id === formBuildingId);
    const buildingName = bld?.name || "HonuHome Cầu Giấy";

    if (editingTenant) {
      setTenants((prev) =>
        prev.map((item) =>
          item.id === editingTenant.id
            ? {
                ...item,
                fullName: formFullName.trim(),
                phone: formPhone.trim(),
                idCardNumber: formIdCard.trim(),
                hometown: formHometown.trim(),
                age: Number(formAge) || 20,
                gender: formGender,
                role: formRole,
                buildingId: formBuildingId,
                buildingName,
                roomNumber: formRoomNumber.trim().toUpperCase(),
                vehiclePlate: formVehiclePlate.trim() || undefined,
                startDate: formStartDate,
                notes: formNotes,
              }
            : item
        )
      );
      success(`Đã cập nhật khách thuê "${formFullName}"`);
    } else {
      const newTenant: Tenant = {
        id: `ten_${Date.now()}`,
        fullName: formFullName.trim(),
        phone: formPhone.trim(),
        idCardNumber: formIdCard.trim(),
        hometown: formHometown.trim(),
        age: Number(formAge) || 20,
        gender: formGender,
        role: formRole,
        buildingId: formBuildingId,
        buildingName,
        roomNumber: formRoomNumber.trim().toUpperCase(),
        vehiclePlate: formVehiclePlate.trim() || undefined,
        startDate: formStartDate,
        status: "active",
        notes: formNotes,
      };
      setTenants((prev) => [newTenant, ...prev]);
      success(`Đã thêm khách thuê "${formFullName}"`);
    }

    setShowModal(false);
  };

  // Delete Handler
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khách thuê "${name}"?`)) {
      setTenants((prev) => prev.filter((t) => t.id !== id));
      success(`Đã xóa khách thuê "${name}"`);
    }
  };

  const representativesCount = tenants.filter((t) => t.role === "representative").length;
  const membersCount = tenants.filter((t) => t.role === "member").length;

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-inner">
            <Users className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Quản Lý Hồ Sơ Khách Thuê
              </h1>
              <span className="text-xs font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full border border-[#D8E6F3]">
                {tenants.length} người
              </span>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Phân loại rõ Người đại diện (Chủ HĐ) và Khách ở cùng phòng, CCCD, Quê quán và Phương tiện
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="h-11 px-5 rounded-2xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Khách Thuê</span>
        </button>
      </div>

      {/* 2. Controls & Filter */}
      <div className="bg-white p-4 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Role Tabs */}
          <div className="flex items-center gap-2 bg-[#F6F9FD] p-1.5 rounded-2xl border border-[#E2EEF8] w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setSelectedRole("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === "all"
                  ? "bg-[#253F5B] text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              Tất cả ({tenants.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("representative")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedRole === "representative"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Người đại diện ({representativesCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("member")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedRole === "member"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Khách ở cùng ({membersCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#7A93AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, SĐT, CCCD, số phòng..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-medium text-[#253F5B] transition-all"
            />
          </div>
        </div>

        {/* Building Filter Pills */}
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

      {/* 3. Tenants Table */}
      <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FBFE] border-b border-[#E3EDF6] text-[#526579] font-bold">
                <th className="py-4 px-6">Họ & Tên khách</th>
                <th className="py-4 px-4">Vai trò</th>
                <th className="py-4 px-4">Phòng & Cơ sở</th>
                <th className="py-4 px-4">Số điện thoại</th>
                <th className="py-4 px-4">CCCD / Định danh</th>
                <th className="py-4 px-4">Quê quán & Tuổi</th>
                <th className="py-4 px-4">Xe máy</th>
                <th className="py-4 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5FA]">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Không tìm thấy khách thuê phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-[#F9FBFE] transition-colors group"
                  >
                    {/* Họ tên */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                            t.role === "representative"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-sky-100 text-sky-700"
                          }`}
                        >
                          {t.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-[#253F5B] text-sm">
                            {t.fullName}
                          </div>
                          <span className="text-[10px] text-[#7A93AD]">
                            Vào ở từ: {t.startDate}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Vai trò */}
                    <td className="py-4 px-4">
                      {t.role === "representative" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[11px]">
                          <BadgeCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Người đại diện (Chủ HĐ)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[11px]">
                          <User className="w-3.5 h-3.5 text-sky-500" />
                          <span>Khách ở cùng</span>
                        </span>
                      )}
                    </td>

                    {/* Phòng & Cơ sở */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-2.5 py-0.5 rounded-md">
                          {t.roomNumber}
                        </span>
                        <span className="text-[11px] text-[#7A93AD] font-semibold truncate max-w-[130px]">
                          {t.buildingName}
                        </span>
                      </div>
                    </td>

                    {/* SĐT */}
                    <td className="py-4 px-4">
                      <a
                        href={`tel:${t.phone}`}
                        className="font-bold text-[#253F5B] hover:text-[#5C84BE] flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.phone}</span>
                      </a>
                    </td>

                    {/* CCCD */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-[#526579] bg-[#F4F8FC] px-2 py-0.5 rounded-md border border-[#E3EDF6]">
                        {t.idCardNumber || "---"}
                      </span>
                    </td>

                    {/* Quê & Tuổi */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-[#253F5B] font-semibold">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{t.hometown || "---"}</span>
                        <span className="text-[10px] text-[#7A93AD]">
                          ({t.age} tuổi)
                        </span>
                      </div>
                    </td>

                    {/* Xe */}
                    <td className="py-4 px-4">
                      {t.vehiclePlate ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          <Bike className="w-3 h-3 text-amber-600" />
                          <span>{t.vehiclePlate}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Không</span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#5C84BE] hover:bg-[#F0F5FA] transition-colors cursor-pointer"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id, t.fullName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa khách"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm / Sửa Khách Thuê (Wide 2-Column Layout - No Scroll) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-4xl lg:max-w-5xl max-h-[94vh] flex flex-col p-6 sm:p-7 space-y-4 animate-scaleUp overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    {editingTenant ? "Chỉnh Sửa Hồ Sơ Khách Thuê" : "Thêm Khách Thuê Mới"}
                  </h3>
                  <p className="text-xs text-[#7A93AD]">
                    Quản lý thông tin định danh CCCD, phân bổ phòng ở và vai trò hợp đồng
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

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Cột 1: Thông tin cá nhân & Giấy tờ */}
                <div className="md:col-span-6 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    1. Thông Tin Cá Nhân & Giấy Tờ
                  </span>

                  {/* Vai trò */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Vai trò trong phòng *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormRole("representative")}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          formRole === "representative"
                            ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs"
                            : "border-[#D9E6F2] text-[#526579] hover:bg-gray-50"
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Người đại diện (Chủ HĐ)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormRole("member")}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          formRole === "member"
                            ? "bg-sky-50 border-sky-300 text-sky-700 shadow-2xs"
                            : "border-[#D9E6F2] text-[#526579] hover:bg-gray-50"
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Khách ở cùng phòng</span>
                      </button>
                    </div>
                  </div>

                  {/* Tên & SĐT */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        value={formFullName}
                        onChange={(e) => setFormFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="0912.345.678"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                      />
                    </div>
                  </div>

                  {/* CCCD & Tuổi */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Số CCCD (12 số)</label>
                      <input
                        type="text"
                        value={formIdCard}
                        onChange={(e) => setFormIdCard(e.target.value)}
                        placeholder="038202008912"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Tuổi</label>
                      <input
                        type="number"
                        value={formAge}
                        onChange={(e) => setFormAge(e.target.value)}
                        placeholder="23"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                      />
                    </div>
                  </div>

                  {/* Quê quán */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Quê quán</label>
                    <input
                      type="text"
                      value={formHometown}
                      onChange={(e) => setFormHometown(e.target.value)}
                      placeholder="Nghệ An, Hà Nội, Nam Định..."
                      className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-semibold text-[#253F5B] transition-all"
                    />
                  </div>
                </div>

                {/* Cột 2: Căn phòng phân bổ & Phương tiện */}
                <div className="md:col-span-6 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    2. Căn Phòng Phân Bổ & Xe Cộ
                  </span>

                  {/* Tòa nhà & Chọn phòng từ danh sách */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Thuộc cơ sở *</label>
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
                        onChange={(e) => setFormRoomNumber(e.target.value)}
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

                  {/* Biển số xe & Ngày bắt đầu ở */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Biển số xe máy</label>
                      <input
                        type="text"
                        value={formVehiclePlate}
                        onChange={(e) => setFormVehiclePlate(e.target.value)}
                        placeholder="29-B1 123.45"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Ngày bắt đầu ở</label>
                      <input
                        type="text"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        placeholder="01/01/2026"
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-semibold text-[#253F5B]"
                      />
                    </div>
                  </div>

                  {/* Ghi chú */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Ghi chú khách thuê</label>
                    <textarea
                      rows={2}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Ghi chú về thói quen, công việc hoặc giấy tờ tạm trú..."
                      className="w-full p-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs text-[#253F5B] transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0F5FA] shrink-0">
                <span className="text-xs text-[#7A93AD] hidden sm:block">
                  💡 Khách thuê sẽ được lưu vào danh sách phòng và hiển thị trong hợp đồng tương ứng.
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
                    <span>{editingTenant ? "Lưu Thay Đổi" : "Lưu Khách Thuê"}</span>
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
