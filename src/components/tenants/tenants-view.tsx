"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  KeyRound,
  ShieldCheck,
  Send,
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import type { Tenant, TenantRole, TenantStatus, PortalAccountStatus } from "@/types/tenant";
import { initialTenants } from "@/lib/mock-data/tenants";
import { initialBuildings } from "@/lib/mock-data/buildings";
import { initialRooms } from "@/lib/mock-data/rooms";
import { useSnackbar } from "@/components/common/snackbar";

export function TenantsView() {
  const searchParams = useSearchParams();
  const paramBuilding = searchParams.get("buildingId");
  const paramRoom = searchParams.get("room") || searchParams.get("roomNumber");
  const paramRole = searchParams.get("role") as ("all" | TenantRole) | null;

  const { success, error } = useSnackbar();
  const [tenants, setTenants] = React.useState<Tenant[]>(initialTenants);
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<string>(paramBuilding || "all");
  const [selectedRole, setSelectedRole] = React.useState<"all" | TenantRole>(paramRole || "all");
  const [searchQuery, setSearchQuery] = React.useState(paramRoom || "");

  React.useEffect(() => {
    if (paramBuilding) setSelectedBuildingId(paramBuilding);
  }, [paramBuilding]);

  React.useEffect(() => {
    if (paramRoom) setSearchQuery(paramRoom);
  }, [paramRoom]);

  React.useEffect(() => {
    if (paramRole) setSelectedRole(paramRole);
  }, [paramRole]);

  // Modal State
  const [showModal, setShowModal] = React.useState(false);
  const [editingTenant, setEditingTenant] = React.useState<Tenant | null>(null);

  // Dedicated Portal Account Modal State
  const [showAccountModal, setShowAccountModal] = React.useState(false);
  const [accountTenant, setAccountTenant] = React.useState<Tenant | null>(null);
  const [accountUsername, setAccountUsername] = React.useState("");
  const [accountPassword, setAccountPassword] = React.useState("");
  const [accountStatus, setAccountStatus] = React.useState<PortalAccountStatus>("active");
  const [showPassword, setShowPassword] = React.useState(false);

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
  const [formPortalAccount, setFormPortalAccount] = React.useState(true);
  const [formPortalUsername, setFormPortalUsername] = React.useState("");
  const [formPortalPassword, setFormPortalPassword] = React.useState("");
  const [showFormPassword, setShowFormPassword] = React.useState(false);

  // Portal Account Filter
  const [selectedPortalFilter, setSelectedPortalFilter] = React.useState<"all" | "active" | "inactive">("all");

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

  const openAccountModal = (t: Tenant) => {
    setAccountTenant(t);
    setAccountUsername(t.portalUsername || t.phone);
    setAccountPassword(t.portalPassword || `Honu@${t.phone.slice(-4) || Math.floor(1000 + Math.random() * 9000)}`);
    setAccountStatus(t.portalAccountStatus === "locked" ? "locked" : "active");
    setShowPassword(false);
    setShowAccountModal(true);
  };

  const handleCopyAccountCredentials = (tenant: Tenant, customU?: string, customP?: string) => {
    const u = customU || tenant.portalUsername || tenant.phone;
    const p = customP || tenant.portalPassword || `Honu@${tenant.phone.slice(-4)}`;
    const text = `HonuHome - Thông Tin Đăng Nhập Cổng Khách Thuê:
• Khách thuê: ${tenant.fullName}
• Phòng: ${tenant.roomNumber} (${tenant.buildingName})
• Link truy cập: https://portal.honuhome.vn
• Tên đăng nhập: ${u}
• Mật khẩu: ${p}
(Quý khách vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên)`;

    navigator.clipboard.writeText(text);
    success(`Đã copy thông tin tài khoản & mật khẩu của "${tenant.fullName}" để gửi Zalo!`);
  };

  const handleDeletePortalAccount = (tenant: Tenant) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn XÓA TÀI KHOẢN CỔNG KHÁCH của "${tenant.fullName}"?\n\n• Khách sẽ bị thu hồi quyền đăng nhập web và không thể xem hóa đơn hay gửi sự cố qua app nữa.\n• Hồ sơ khách thuê, thông tin hợp đồng và lịch sử phòng vẫn được lưu giữ an toàn.`
      )
    ) {
      setTenants((prev) =>
        prev.map((t) =>
          t.id === tenant.id
            ? {
                ...t,
                portalAccountStatus: "inactive",
                portalUsername: undefined,
                portalPassword: undefined,
              }
            : t
        )
      );
      success(`Đã xóa tài khoản Cổng Khách của "${tenant.fullName}"!`);
      setShowAccountModal(false);
    }
  };

  const handleSaveAccountModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountTenant) return;
    if (!accountUsername.trim()) {
      error("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!accountPassword.trim()) {
      error("Vui lòng nhập mật khẩu");
      return;
    }

    setTenants((prev) =>
      prev.map((t) =>
        t.id === accountTenant.id
          ? {
              ...t,
              portalAccountStatus: accountStatus,
              portalUsername: accountUsername.trim(),
              portalPassword: accountPassword.trim(),
              lastLoginAt: t.lastLoginAt || "Vừa cập nhật",
            }
          : t
      )
    );

    const statusMsg = accountStatus === "locked" ? "Tạm khóa đăng nhập" : "Đang hoạt động";
    success(`Đã cập nhật tài khoản Cổng Khách cho "${accountTenant.fullName}" (${statusMsg})!`);
    setShowAccountModal(false);
  };

  // Filtered tenants
  const filteredTenants = React.useMemo(() => {
    return tenants.filter((t) => {
      const matchBuilding =
        selectedBuildingId === "all" || t.buildingId === selectedBuildingId;
      const matchRole = selectedRole === "all" || t.role === selectedRole;
      const matchPortal =
        selectedPortalFilter === "all" ||
        (selectedPortalFilter === "active" && t.portalAccountStatus === "active") ||
        (selectedPortalFilter === "inactive" && t.portalAccountStatus !== "active");
      const q = searchQuery.toLowerCase();
      const matchQuery =
        t.fullName.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.idCardNumber.includes(q) ||
        t.roomNumber.toLowerCase().includes(q) ||
        t.hometown.toLowerCase().includes(q);
      return matchBuilding && matchRole && matchPortal && matchQuery;
    });
  }, [tenants, selectedBuildingId, selectedRole, selectedPortalFilter, searchQuery]);

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
    setFormPortalAccount(true);
    setFormPortalUsername("");
    setFormPortalPassword(`Honu@${Math.floor(1000 + Math.random() * 9000)}`);
    setShowFormPassword(false);
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
    setFormPortalAccount(t.portalAccountStatus === "active" || t.portalAccountStatus === "locked");
    setFormPortalUsername(t.portalUsername || t.phone);
    setFormPortalPassword(t.portalPassword || `Honu@${t.phone.slice(-4) || "1234"}`);
    setShowFormPassword(false);
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

    const finalPortalUsername = formPortalUsername.trim() || formPhone.trim();
    const finalPortalPassword = formPortalPassword.trim() || `Honu@${formPhone.slice(-4) || "1234"}`;

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
                portalAccountStatus: formPortalAccount
                  ? item.portalAccountStatus === "locked"
                    ? "locked"
                    : "active"
                  : "inactive",
                portalUsername: formPortalAccount ? finalPortalUsername : undefined,
                portalPassword: formPortalAccount ? finalPortalPassword : undefined,
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
        portalAccountStatus: formPortalAccount ? "active" : "inactive",
        portalUsername: formPortalAccount ? finalPortalUsername : undefined,
        portalPassword: formPortalAccount ? finalPortalPassword : undefined,
      };
      setTenants((prev) => [newTenant, ...prev]);
      success(`Đã thêm khách thuê "${formFullName}"${formPortalAccount ? " & kích hoạt tài khoản web" : ""}`);
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

        {/* Building & Portal Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F0F5FA]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#7A93AD] mr-1">Tài khoản Web:</span>
            <button
              type="button"
              onClick={() => setSelectedPortalFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                selectedPortalFilter === "all"
                  ? "bg-[#253F5B] text-white shadow-xs"
                  : "bg-[#F4F8FC] text-[#526579] hover:bg-[#EAF2F8]"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setSelectedPortalFilter("active")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                selectedPortalFilter === "active"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-[#F4F8FC] text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã có tài khoản</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPortalFilter("inactive")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                selectedPortalFilter === "inactive"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-[#F4F8FC] text-amber-700 hover:bg-amber-50"
              }`}
            >
              <span>Chưa cấp tài khoản</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
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
                <th className="py-4 px-4">Tài khoản Cổng Khách</th>
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
                  <td colSpan={9} className="py-12 text-center text-slate-400">
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
                        <Link
                          href={`/rooms/${t.roomNumber}`}
                          className="font-extrabold text-[#5C84BE] bg-[#EAF2F8] hover:bg-[#d5e7f7] px-2.5 py-0.5 rounded-md transition-colors cursor-pointer"
                          title={`Xem chi tiết phòng ${t.roomNumber}`}
                        >
                          {t.roomNumber}
                        </Link>
                        <span className="text-[11px] text-[#7A93AD] font-semibold truncate max-w-[130px]">
                          {t.buildingName}
                        </span>
                      </div>
                    </td>

                    {/* Tài khoản Cổng Khách */}
                    <td className="py-4 px-4">
                      {t.portalAccountStatus === "active" ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Hoạt động</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => openAccountModal(t)}
                              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Sửa / Đổi mật khẩu / Xóa tài khoản"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="text-[#7A93AD] font-mono">TK: {t.portalUsername || t.phone}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyAccountCredentials(t)}
                              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5 cursor-pointer ml-auto"
                              title="Sao chép mật khẩu & thông tin gửi Zalo"
                            >
                              <Copy className="w-2.5 h-2.5" />
                              <span>Gửi Zalo</span>
                            </button>
                          </div>
                        </div>
                      ) : t.portalAccountStatus === "locked" ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                              <Lock className="w-3.5 h-3.5 text-rose-600" />
                              <span>Tạm khóa</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => openAccountModal(t)}
                              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Mở khóa hoặc sửa tài khoản"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">TK: {t.portalUsername || t.phone}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAccountModal(t)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5C84BE] bg-[#F0F5FA] hover:bg-[#5C84BE] hover:text-white border border-[#D9E6F2] hover:border-[#5C84BE] px-2.5 py-1.5 rounded-xl cursor-pointer transition-all shadow-2xs"
                          title="Cấp tài khoản & đặt mật khẩu web"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span>+ Cấp tài khoản</span>
                        </button>
                      )}
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

                  {/* Kích hoạt & Cài đặt Tài khoản Cổng Khách Thuê */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-sky-50/70 border border-indigo-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#253F5B]">Tài Khoản Cổng Khách Thuê</div>
                          <div className="text-[10px] text-[#7A93AD]">Khách đăng nhập xem bill & báo sự cố</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formPortalAccount}
                          onChange={(e) => setFormPortalAccount(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {formPortalAccount && (
                      <div className="pt-2 border-t border-indigo-100/70 grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#253F5B]">Tên đăng nhập</label>
                          <input
                            type="text"
                            value={formPortalUsername || formPhone}
                            onChange={(e) => setFormPortalUsername(e.target.value)}
                            placeholder={formPhone || "0912345678"}
                            className="w-full h-8 px-2.5 rounded-lg border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-mono font-bold text-[#253F5B]"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-[#253F5B]">Mật khẩu</label>
                            <button
                              type="button"
                              onClick={() => {
                                const rand = `Honu@${Math.floor(1000 + Math.random() * 9000)}`;
                                setFormPortalPassword(rand);
                              }}
                              className="text-[10px] text-indigo-600 hover:underline font-bold cursor-pointer"
                            >
                              Tạo MK
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              type={showFormPassword ? "text" : "password"}
                              value={formPortalPassword}
                              onChange={(e) => setFormPortalPassword(e.target.value)}
                              placeholder="Honu@1234"
                              className="w-full h-8 pl-2.5 pr-7 rounded-lg border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-mono font-bold text-[#253F5B]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowFormPassword(!showFormPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showFormPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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

      {/* Modal Chuyên Biệt Quản Lý / Sửa / Xóa Mật Khẩu & Tài Khoản Cổng Khách */}
      {showAccountModal && accountTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-lg p-6 sm:p-7 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100 shadow-inner">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    Quản Lý Tài Khoản Cổng Khách Thuê
                  </h3>
                  <p className="text-xs text-[#7A93AD]">
                    {accountTenant.fullName} • Phòng {accountTenant.roomNumber} ({accountTenant.buildingName})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountModal(false)}
                className="w-8 h-8 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAccountModal} className="space-y-4 text-xs">
              {/* Tên đăng nhập */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#253F5B] block">Tên đăng nhập (Username) *</label>
                <input
                  type="text"
                  required
                  value={accountUsername}
                  onChange={(e) => setAccountUsername(e.target.value)}
                  placeholder="0918.137.153"
                  className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none font-bold text-[#253F5B] font-mono"
                />
                <span className="text-[10px] text-[#7A93AD]">
                  Mặc định dùng Số điện thoại của khách, admin có thể đổi sang tên người dùng khác nếu cần.
                </span>
              </div>

              {/* Mật khẩu & Nút tạo ngẫu nhiên */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#253F5B]">Mật khẩu đăng nhập *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const randPass = `Honu@${Math.floor(1000 + Math.random() * 9000)}`;
                      setAccountPassword(randPass);
                      success(`Đã tạo mật khẩu mới: ${randPass}`);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Tạo ngẫu nhiên</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới..."
                    className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none font-mono font-bold text-[#253F5B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-[#7A93AD]">
                  Admin có thể xóa mật khẩu cũ, gõ mật khẩu mới tùy ý hoặc bấm &quot;Tạo ngẫu nhiên&quot;.
                </span>
              </div>

              {/* Trạng thái tài khoản */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#253F5B] block">Trạng thái tài khoản</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAccountStatus("active")}
                    className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all flex items-center gap-2 ${
                      accountStatus === "active"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                        : "bg-white border-[#D9E6F2] text-[#526579] hover:bg-slate-50"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">Đang hoạt động</div>
                      <div className="text-[10px] text-[#7A93AD]">Khách đăng nhập bình thường</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountStatus("locked")}
                    className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all flex items-center gap-2 ${
                      accountStatus === "locked"
                        ? "bg-rose-50 border-rose-300 text-rose-800 shadow-xs"
                        : "bg-white border-[#D9E6F2] text-[#526579] hover:bg-slate-50"
                    }`}
                  >
                    <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">Tạm khóa tài khoản</div>
                      <div className="text-[10px] text-[#7A93AD]">Chặn truy cập portal</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Lịch sử đăng nhập */}
              {accountTenant.lastLoginAt && (
                <div className="text-[11px] text-[#7A93AD] bg-[#F8FBFE] p-2.5 rounded-xl border border-[#EAF2F8] flex items-center justify-between">
                  <span>Lần đăng nhập gần nhất:</span>
                  <strong className="text-[#253F5B] font-mono">{accountTenant.lastLoginAt}</strong>
                </div>
              )}

              {/* Actions Bar: Xóa tài khoản, Copy Zalo, Lưu thay đổi */}
              <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-between gap-2">
                {accountTenant.portalAccountStatus !== "inactive" && (
                  <button
                    type="button"
                    onClick={() => handleDeletePortalAccount(accountTenant)}
                    className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Xóa tài khoản web của khách (vẫn giữ nguyên hồ sơ phòng & hợp đồng)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa tài khoản</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => handleCopyAccountCredentials(accountTenant, accountUsername, accountPassword)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[#253F5B] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Sao chép thông tin tài khoản và mật khẩu để gửi Zalo"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Copy Zalo</span>
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lưu Tài Khoản</span>
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
