"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  DoorOpen,
  Filter,
  Calendar,
  Building2,
  Users,
  Bike,
  Video,
  TrendingUp,
  AlertCircle,
  Phone,
  Search,
  X,
} from "lucide-react";
import {
  EditActionIcon,
  DeleteActionIcon,
  ViewActionIcon,
} from "@/components/icons/action-icons";
import type { Room, RoomStatus } from "@/types/room";
import { initialRooms } from "@/lib/mock-data/rooms";
import { AddRoomModal } from "@/components/rooms/add-room-modal";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { useSnackbar } from "@/components/common/snackbar";

export function RoomsTable() {
  const { success, error, warning } = useSnackbar();
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [buildingFilter, setBuildingFilter] = React.useState("ALL");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; roomNumber: string } | null>(null);

  const itemsPerPage = 7;

  // Filter logic based on Search Query, Building, Type, Status
  const filteredRooms = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return rooms.filter((r) => {
      const matchSearch =
        !q ||
        r.roomNumber.toLowerCase().includes(q) ||
        (r.tenantName && r.tenantName.toLowerCase().includes(q)) ||
        (r.tenantPhone && r.tenantPhone.toLowerCase().includes(q)) ||
        (r.tenantHometown && r.tenantHometown.toLowerCase().includes(q)) ||
        (r.buildingName && r.buildingName.toLowerCase().includes(q)) ||
        String(r.price).includes(q);

      const matchBuilding =
        buildingFilter === "ALL" || r.buildingId === buildingFilter;
      const matchType = typeFilter === "ALL" || r.type === typeFilter;
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;

      return matchSearch && matchBuilding && matchType && matchStatus;
    });
  }, [rooms, searchQuery, buildingFilter, typeFilter, statusFilter]);

  // Compute aggregate stats based on active building filter
  const stats = React.useMemo(() => {
    const scopeRooms =
      buildingFilter === "ALL"
        ? rooms
        : rooms.filter((r) => r.buildingId === buildingFilter);

    const totalRooms = scopeRooms.length;
    const rentedRooms = scopeRooms.filter((r) => r.status === "rented").length;
    const availableRooms = scopeRooms.filter((r) => r.status === "available").length;
    const maintenanceRooms = scopeRooms.filter((r) => r.status === "maintenance").length;
    const occupancyRate =
      totalRooms > 0 ? ((rentedRooms / totalRooms) * 100).toFixed(0) : "0";

    return {
      totalRooms,
      rentedRooms,
      availableRooms,
      maintenanceRooms,
      occupancyRate,
    };
  }, [rooms, buildingFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage) || 1;
  const paginatedRooms = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(start, start + itemsPerPage);
  }, [filteredRooms, currentPage]);

  const emptyRowsCount =
    paginatedRooms.length > 0 ? itemsPerPage - paginatedRooms.length : 0;

  const handleDeleteRoom = (id: string, roomNum: string) => {
    setDeleteTarget({ id, roomNumber: roomNum });
  };

  const handleConfirmDeleteRoom = () => {
    if (deleteTarget) {
      setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      error(`Đã xóa phòng ${deleteTarget.roomNumber}`);
      setDeleteTarget(null);
    }
  };

  const handleAddRoom = (
    newRoomData: Omit<Room, "id" | "priceFormatted" | "statusLabel">
  ) => {
    const statusLabels: Record<RoomStatus, "Đang Thuê" | "Trống" | "Đang sửa"> = {
      rented: "Đang Thuê",
      available: "Trống",
      maintenance: "Đang sửa",
    };

    const newRoom: Room = {
      ...newRoomData,
      id: `r_${Date.now()}`,
      priceFormatted: `${new Intl.NumberFormat("vi-VN").format(
        newRoomData.price
      )} đ`,
      statusLabel: statusLabels[newRoomData.status],
      endDate:
        newRoomData.endDate ||
        (newRoomData.status === "rented" ? "01/01/2027" : "---"),
    };

    setRooms((prev) => [newRoom, ...prev]);
    success(`Đã thêm phòng ${newRoom.roomNumber}`);
  };

  return (
    <div className="w-full space-y-5 animate-fadeIn pb-12 select-none">
      {/* 1. Top Bar: Tiêu đề trang, 3 Bộ Lọc (Cơ sở, Loại phòng, Trạng thái) & Nút Thêm Phòng */}
      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 bg-white px-7 py-4.5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shadow-inner">
            <DoorOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-[#253F5B] tracking-tight">
                Danh sách phòng
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBF2F9] text-[#5C84BE] text-xs font-bold">
                {filteredRooms.length} / {rooms.length} phòng
              </span>
            </div>
            <p className="text-xs text-[#7B92AC] font-medium mt-0.5">
              Quản lý chi tiết trạng thái, hợp đồng, người thuê và dịch vụ từng căn phòng
            </p>
          </div>
        </div>

        {/* Thanh tìm kiếm thông minh & Các Bộ lọc đặt cạnh Nút Thêm phòng */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Ô Tìm Kiếm Phòng Chuyên Nghiệp */}
          <div className="relative w-full sm:w-64 lg:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm số phòng, khách thuê, SĐT..."
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-[#F4F8FC] hover:bg-[#EAF2F9] focus:bg-white border border-[#D9E6F2] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] placeholder:text-[#94A9C0] outline-none transition-all shadow-2xs"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C84BE] pointer-events-none stroke-[2.3]" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Lọc cơ sở / tòa nhà */}
          <div className="relative min-w-[155px]">
            <select
              value={buildingFilter}
              onChange={(e) => {
                setBuildingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-3.5 pr-8 appearance-none rounded-xl bg-[#F4F8FC] hover:bg-[#EAF2F9] border border-[#D9E6F2] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none cursor-pointer transition-all"
            >
              <option value="ALL">Tất cả cơ sở</option>
              <option value="bld_cg">HonuHome Cầu Giấy</option>
              <option value="bld_md">HonuHome Mỹ Đình</option>
              <option value="bld_cl">HonuHome Đống Đa</option>
            </select>
            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5C84BE] pointer-events-none" />
          </div>

          {/* Lọc loại phòng */}
          <div className="relative min-w-[145px]">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-3.5 pr-8 appearance-none rounded-xl bg-[#F4F8FC] hover:bg-[#EAF2F9] border border-[#D9E6F2] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none cursor-pointer transition-all"
            >
              <option value="ALL">Tất cả loại phòng</option>
              <option value="Phòng Đơn">Phòng Đơn</option>
              <option value="Phòng Đôi">Phòng Đôi</option>
              <option value="Phòng Ba">Phòng Ba</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5C84BE] pointer-events-none" />
          </div>

          {/* Lọc trạng thái */}
          <div className="relative min-w-[145px]">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-3.5 pr-8 appearance-none rounded-xl bg-[#F4F8FC] hover:bg-[#EAF2F9] border border-[#D9E6F2] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none cursor-pointer transition-all"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="rented">Đang Thuê</option>
              <option value="available">Trống</option>
              <option value="maintenance">Đang sửa</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5C84BE] pointer-events-none" />
          </div>

          {/* Nút Thêm phòng mới */}
          <Link
            href="/rooms/create"
            className="h-10 px-5 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-[#5C84BE]/25 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Thêm phòng mới</span>
          </Link>
        </div>
      </div>

      {/* 2. Thống Kê Nhanh (KPIs đồng bộ theo Cơ sở) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
        <div className="bg-white p-4 rounded-2xl border border-[#E3EDF6] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#5C84BE] flex items-center justify-center shrink-0">
            <DoorOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Tổng quy mô</p>
            <p className="text-xl font-extrabold text-[#253F5B]">{stats.totalRooms} phòng</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3EDF6] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Đang cho thuê</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#253F5B]">{stats.rentedRooms}</span>
              <span className="text-xs font-bold text-emerald-600">({stats.occupancyRate}%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3EDF6] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <DoorOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Phòng trống</p>
            <p className="text-xl font-extrabold text-sky-600">{stats.availableRooms} phòng</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3EDF6] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Đang sửa chữa</p>
            <p className="text-xl font-extrabold text-amber-600">{stats.maintenanceRooms} phòng</p>
          </div>
        </div>
      </div>

      {/* 4. Bảng Dữ Liệu Phòng Chuẩn Data Architecture */}
      <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            {/* Header */}
            <thead>
              <tr className="bg-[#F8FBFE] border-b border-[#EAF1F8] text-[12px] font-bold text-[#6B85A1] uppercase tracking-wider h-[54px]">
                <th className="pl-6 w-[55px]">STT</th>
                <th className="px-4 w-[160px]">Số Phòng & Cơ Sở</th>
                <th className="px-4 w-[130px]">Loại & Diện Tích</th>
                <th className="px-4 w-[150px]">Giá Thuê & Cọc</th>
                <th className="px-4 w-[130px]">Trạng Thái</th>
                <th className="px-4 w-[180px]">Người Thuê & SĐT</th>
                <th className="px-4 w-[140px]">Hạn Hợp Đồng</th>
                <th className="px-3 w-[70px] text-center">Video</th>
                <th className="pr-6 text-center w-[120px]">Thao Tác</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-[#F0F5FA]">
              {paginatedRooms.length > 0 ? (
                paginatedRooms.map((room, idx) => {
                  const stt = (currentPage - 1) * itemsPerPage + idx + 1;

                  // Status Badge styles matching Figma
                  const statusConfig = {
                    rented: {
                      badge: "bg-[#b5dda6] text-[#253f5b] font-extrabold",
                      label: "Đang Thuê",
                    },
                    available: {
                      badge: "bg-[#8fbffa] text-[#253f5b] font-extrabold",
                      label: "Trống",
                    },
                    maintenance: {
                      badge: "bg-[#fff9bf] text-[#253f5b] font-extrabold",
                      label: "Đang sửa",
                    },
                  };

                  const currentConfig = statusConfig[room.status];

                  return (
                    <tr
                      key={room.id}
                      className="h-[68px] hover:bg-[#F9FBFE] transition-colors text-sm"
                    >
                      {/* STT */}
                      <td className="pl-6 font-semibold text-[#8FA5BD] text-xs">
                        #{stt.toString().padStart(2, "0")}
                      </td>

                      {/* Số Phòng & Cơ Sở */}
                      <td className="px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[#253F5B] text-base tracking-tight">
                              {room.roomNumber}
                            </span>
                            {room.floor && (
                              <span className="text-[10px] font-bold text-[#5C84BE] bg-[#EAF2F8] px-1.5 py-0.5 rounded-md">
                                T{room.floor}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                            {room.buildingName || "Cầu Giấy"}
                          </span>
                        </div>
                      </td>

                      {/* Loại Phòng & Diện Tích */}
                      <td className="px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#355375] text-xs">
                            {room.type}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {room.area || 20} m²
                          </span>
                        </div>
                      </td>

                      {/* Giá Thuê & Cọc */}
                      <td className="px-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-[#253F5B] text-xs">
                            {room.priceFormatted}
                          </span>
                          {room.status === "rented" && room.deposit ? (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Cọc: {new Intl.NumberFormat("vi-VN").format(room.deposit)} đ
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-300 font-medium italic">
                              Chưa có cọc
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Trạng Thái */}
                      <td className="px-4">
                        <span
                          className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 rounded-[30px] text-xs font-extrabold ${currentConfig.badge}`}
                        >
                          {currentConfig.label}
                        </span>
                      </td>

                      {/* Người Thuê & SĐT */}
                      <td className="px-4">
                        {room.tenantName && room.tenantName !== "---" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#E5EEF7] text-[#5C84BE] font-bold text-xs flex items-center justify-center shrink-0">
                              {room.tenantName.charAt(0)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-[#253F5B] text-xs truncate max-w-[110px]" title={room.tenantName}>
                                {room.tenantName}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                {room.tenantPhone && (
                                  <span className="font-mono">{room.tenantPhone}</span>
                                )}
                                {room.occupantsCount && room.occupantsCount > 0 && (
                                  <span>• {room.occupantsCount} ng</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-[#A2B5CA] italic">
                            Chưa có khách
                          </span>
                        )}
                      </td>

                      {/* Hạn Hợp Đồng */}
                      <td className="px-4">
                        {room.status === "rented" && room.endDate && room.endDate !== "---" ? (
                          <div className="flex items-center gap-1.5 bg-[#F2F7FC] px-2 py-0.5 rounded-lg w-fit border border-[#DCE8F3]">
                            <Calendar className="w-3 h-3 text-[#5C84BE] shrink-0" />
                            <span className="font-bold text-[#253F5B] text-xs font-mono">
                              {room.endDate}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-[#A2B5CA] italic">
                            ---
                          </span>
                        )}
                      </td>

                      {/* Video Quay Phòng */}
                      <td className="px-3 text-center">
                        {room.videoUrl ? (
                          <a
                            href={room.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Xem video quay phòng thực tế"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </td>

                      {/* Thao Tác (1. Sửa riêng page, 2. Xóa, 3. Chi tiết riêng page) */}
                      <td className="pr-6">
                        <div className="flex items-center justify-center gap-2 text-[#757575]">
                          {/* 1. Chỉnh sửa riêng page */}
                          <Link
                            href={`/rooms/${room.roomNumber}/edit`}
                            className="p-1.5 rounded-lg text-[#757575] hover:text-[#5C84BE] hover:bg-[#EBF3FB] transition-all cursor-pointer"
                            title="Chỉnh sửa thông tin phòng (Trang riêng)"
                          >
                            <EditActionIcon className="w-4 h-4" />
                          </Link>

                          {/* 2. Xóa phòng */}
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom(room.id, room.roomNumber)}
                            className="p-1.5 rounded-lg text-[#757575] hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Xóa phòng"
                          >
                            <DeleteActionIcon className="w-4 h-4" />
                          </button>

                          {/* 3. Xem chi tiết riêng page */}
                          <Link
                            href={`/rooms/${room.roomNumber}`}
                            className="p-1.5 rounded-lg text-[#757575] hover:text-[#5C84BE] hover:bg-[#EBF3FB] transition-all cursor-pointer"
                            title="Xem chi tiết phòng (Trang riêng)"
                          >
                            <ViewActionIcon className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Search className="w-6 h-6 stroke-[2]" />
                      </div>
                      <p className="text-sm font-bold text-[#253F5B]">
                        Không tìm thấy phòng nào phù hợp
                      </p>
                      <p className="text-xs text-[#7A93B0]">
                        {searchQuery
                          ? `Không có kết quả khớp với từ khóa "${searchQuery}". Vui lòng thử tìm số phòng hoặc tên khác.`
                          : "Không có phòng nào phù hợp với các bộ lọc hiện tại."}
                      </p>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setCurrentPage(1);
                          }}
                          className="mt-2 text-xs font-bold text-[#5C84BE] hover:underline"
                        >
                          Xóa tìm kiếm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty filler rows to preserve exact constant table height across all pages */}
              {paginatedRooms.length > 0 &&
                Array.from({ length: emptyRowsCount }).map((_, i) => (
                  <tr
                    key={`empty-${i}`}
                    className="h-[68px] border-b border-[#F7FAFD]/80 pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    <td colSpan={9} className="px-5 text-transparent">
                      &nbsp;
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Footer: Phân trang (Pagination) */}
        <div className="h-[64px] px-6 bg-white border-t border-[#EEF4FA] flex items-center justify-between select-none">
          <p className="text-xs font-medium text-[#7D95AF]">
            Hiển thị{" "}
            <span className="font-bold text-[#253F5B]">
              {filteredRooms.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}
            </span>{" "}
            -{" "}
            <span className="font-bold text-[#253F5B]">
              {Math.min(currentPage * itemsPerPage, filteredRooms.length)}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-bold text-[#253F5B]">
              {filteredRooms.length}
            </span>{" "}
            căn phòng
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg bg-white border border-[#DCE8F3] text-[#5C84BE] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center hover:bg-[#F2F8FC] transition-colors cursor-pointer"
                aria-label="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? "bg-[#5C84BE] text-white shadow-sm shadow-[#5C84BE]/25"
                      : "bg-white border border-[#DCE8F3] text-[#526D8A] hover:bg-[#F2F8FC]"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg bg-white border border-[#DCE8F3] text-[#5C84BE] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center hover:bg-[#F2F8FC] transition-colors cursor-pointer"
                aria-label="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Room Modal (Fallback) */}
      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRoom={handleAddRoom}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDeleteRoom}
        title="Xác nhận xóa phòng"
        itemName={deleteTarget ? `Phòng ${deleteTarget.roomNumber}` : undefined}
        description={`Bạn có chắc chắn muốn xóa phòng ${deleteTarget?.roomNumber}? Toàn bộ lịch sử thuê và dữ liệu liên quan sẽ bị xóa khỏi hệ thống.`}
        confirmText="Xóa phòng này"
      />
    </div>
  );
}
