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
} from "lucide-react";
import {
  EditActionIcon,
  DeleteActionIcon,
  ViewActionIcon,
} from "@/components/icons/action-icons";
import type { Room, RoomStatus } from "@/types/room";
import { initialRooms } from "@/lib/mock-data/rooms";
import { AddRoomModal } from "@/components/rooms/add-room-modal";

export function RoomsTable() {
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [buildingFilter, setBuildingFilter] = React.useState("ALL");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const itemsPerPage = 7;

  // Filter logic
  const filteredRooms = React.useMemo(() => {
    return rooms.filter((r) => {
      const matchBuilding =
        buildingFilter === "ALL" ||
        r.buildingId === buildingFilter ||
        (!r.buildingId && buildingFilter === "bld_cg"); // default mock rooms to first building
      const matchType = typeFilter === "ALL" || r.type === typeFilter;
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchBuilding && matchType && matchStatus;
    });
  }, [rooms, buildingFilter, typeFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage) || 1;
  const paginatedRooms = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(start, start + itemsPerPage);
  }, [filteredRooms, currentPage]);

  const emptyRowsCount =
    paginatedRooms.length > 0 ? itemsPerPage - paginatedRooms.length : 0;

  const handleDeleteRoom = (id: string, roomNum: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa phòng ${roomNum}?`)) {
      setRooms((prev) => prev.filter((r) => r.id !== id));
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
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-12 select-none">
      {/* 1. Top Bar: Tiêu đề trang & Thanh công cụ gom gọn chuyên nghiệp */}
      <div className="flex items-center justify-between bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        {/* Title & Badge số lượng */}
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
                {rooms.length} phòng
              </span>
            </div>
            <p className="text-xs text-[#7B92AC] font-medium mt-0.5">
              Quản lý chi tiết trạng thái, bảng giá và người thuê căn hộ
            </p>
          </div>
        </div>

        {/* Right Toolbar: Bộ lọc gọn gàng + Nút Thêm Phòng */}
        <div className="flex items-center gap-3">
          {/* Lọc cơ sở / tòa nhà */}
          <div className="relative">
            <select
              value={buildingFilter}
              onChange={(e) => {
                setBuildingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 pl-4 pr-9 appearance-none rounded-xl bg-[#F4F8FC] hover:bg-[#EAF2F9] border border-[#D9E6F2] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none cursor-pointer transition-all"
            >
              <option value="ALL">Tất cả cơ sở</option>
              <option value="bld_cg">HonuHome Cầu Giấy</option>
              <option value="bld_md">HonuHome Mỹ Đình</option>
              <option value="bld_cl">HonuHome Đống Đa</option>
            </select>
            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C84BE] pointer-events-none" />
          </div>

          {/* Lọc loại phòng */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 pl-4 pr-9 appearance-none rounded-xl bg-[#F4F8FC] hover:bg-[#EAF2F9] border border-[#D9E6F2] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none cursor-pointer transition-all"
            >
              <option value="ALL">Tất cả loại phòng</option>
              <option value="Phòng Đơn">Phòng Đơn</option>
              <option value="Phòng Đôi">Phòng Đôi</option>
              <option value="Phòng Ba">Phòng Ba</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C84BE] pointer-events-none" />
          </div>

          {/* Lọc trạng thái */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 pl-4 pr-9 appearance-none rounded-xl bg-[#F4F8FC] hover:bg-[#EAF2F9] border border-[#D9E6F2] focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none cursor-pointer transition-all"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="rented">Đang Thuê</option>
              <option value="available">Trống</option>
              <option value="maintenance">Đang sửa</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5C84BE] pointer-events-none" />
          </div>

          {/* Nút Thêm phòng: Chuyển hướng sang trang riêng /rooms/create */}
          <Link
            href="/rooms/create"
            className="h-11 px-5 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] active:scale-[0.98] text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-[#5C84BE]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Thêm phòng</span>
          </Link>
        </div>
      </div>

      {/* 2. Bảng Dữ Liệu Phòng - Thiết Kế Lại Chuẩn UI Hiện Đại */}
      <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-[#F8FBFE] border-b border-[#EAF1F8] text-[13px] font-bold text-[#6B85A1] uppercase tracking-wider h-[58px]">
              <th className="pl-7 w-[60px]">STT</th>
              <th className="px-5 w-[130px]">Số Phòng</th>
              <th className="px-5 w-[140px]">Loại Phòng</th>
              <th className="px-5 w-[150px]">Giá Thuê</th>
              <th className="px-5 w-[140px]">Trạng Thái</th>
              <th className="px-5 w-[160px]">Người Thuê</th>
              <th className="px-5 w-[160px]">Hạn Hợp Đồng</th>
              <th className="pr-7 text-center w-[130px]">Thao Tác</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#F0F5FA]">
            {paginatedRooms.length > 0 ? (
              paginatedRooms.map((room, idx) => {
                const stt = (currentPage - 1) * itemsPerPage + idx + 1;

                // Status Badge styles matching exact Figma colors
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
                    <td className="pl-7 font-semibold text-[#8FA5BD] text-xs">
                      #{stt.toString().padStart(2, "0")}
                    </td>

                    {/* Số Phòng */}
                    <td className="px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#253F5B] text-base tracking-tight">
                          {room.roomNumber}
                        </span>
                        {room.floor && (
                          <span className="text-[11px] font-semibold text-[#7E96B0] bg-[#EEF4FA] px-1.5 py-0.5 rounded">
                            Tầng {room.floor}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Loại Phòng */}
                    <td className="px-5">
                      <span className="font-semibold text-[#486687]">
                        {room.type}
                      </span>
                      {room.area && (
                        <span className="text-xs text-[#8BA1B8] ml-1.5">
                          ({room.area}m²)
                        </span>
                      )}
                    </td>

                    {/* Giá Thuê */}
                    <td className="px-5">
                      <div className="font-bold text-[#253F5B] tracking-tight">
                        {room.priceFormatted}
                        <span className="text-xs font-normal text-[#8BA1B8]">
                          /tháng
                        </span>
                      </div>
                    </td>

                    {/* Trạng Thái - Chuẩn Figma Pill */}
                    <td className="px-5">
                      <span
                        className={`inline-flex items-center justify-center min-w-[96px] px-3.5 py-1.5 rounded-[30px] text-xs font-extrabold ${currentConfig.badge}`}
                      >
                        {currentConfig.label}
                      </span>
                    </td>

                    {/* Người Thuê */}
                    <td className="px-5">
                      {room.tenantName !== "---" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#E5EEF7] text-[#5C84BE] font-bold text-xs flex items-center justify-center shrink-0">
                            {room.tenantName.charAt(0)}
                          </div>
                          <span className="font-bold text-[#253F5B] truncate max-w-[120px]">
                            {room.tenantName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-[#A2B5CA] italic">
                          Chưa có khách
                        </span>
                      )}
                    </td>

                    {/* Hạn Hợp Đồng (Ngày kết thúc hợp đồng) */}
                    <td className="px-5">
                      {room.status === "rented" && room.endDate && room.endDate !== "---" ? (
                        <div className="flex items-center gap-1.5 bg-[#F2F7FC] px-2.5 py-1 rounded-lg w-fit border border-[#DCE8F3]">
                          <Calendar className="w-3.5 h-3.5 text-[#5C84BE] shrink-0" />
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

                    {/* Thao Tác (Chuẩn Figma theo thứ tự: 1. Sửa, 2. Xóa, 3. Chi tiết) */}
                    <td className="pr-7">
                      <div className="flex items-center justify-center gap-3 text-[#757575]">
                        {/* 1. Chỉnh sửa (reicon:pen-add2) */}
                        <button
                          type="button"
                          onClick={() =>
                            alert(`Chỉnh sửa phòng ${room.roomNumber}`)
                          }
                          className="p-1.5 rounded-lg text-[#757575] hover:text-[#5C84BE] hover:bg-[#EBF3FB] transition-all cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <EditActionIcon className="w-5 h-5" />
                        </button>

                        {/* 2. Xóa phòng (fluent:delete-12-filled) */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteRoom(room.id, room.roomNumber)
                          }
                          className="p-1.5 rounded-lg text-[#757575] hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Xóa phòng"
                        >
                          <DeleteActionIcon className="w-5 h-5" />
                        </button>

                        {/* 3. Xem chi tiết (material-symbols:read-more) */}
                        <Link
                          href={`/rooms/${room.roomNumber}`}
                          className="p-1.5 rounded-lg text-[#757575] hover:text-[#5C84BE] hover:bg-[#EBF3FB] transition-all"
                          title="Xem chi tiết"
                        >
                          <ViewActionIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : null}

            {/* Empty filler rows to preserve exact constant table height across all pages */}
            {paginatedRooms.length > 0 &&
              Array.from({ length: emptyRowsCount }).map((_, i) => (
                <tr
                  key={`empty-${i}`}
                  className="h-[68px] border-b border-[#F7FAFD]/80 pointer-events-none select-none"
                  aria-hidden="true"
                >
                  <td colSpan={8} className="px-5 text-transparent">
                    &nbsp;
                  </td>
                </tr>
              ))}

            {paginatedRooms.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="h-[476px] text-center text-sm font-medium text-[#8EA3BA]"
                >
                  Không tìm thấy phòng nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 3. Table Footer: Thông tin số lượng & Phân trang */}
        <div className="flex items-center justify-between px-7 py-4 bg-[#F8FBFE] border-t border-[#EAF1F8] text-xs font-medium text-[#7A93AD]">
          <div>
            Hiển thị{" "}
            <span className="font-bold text-[#253F5B]">
              {paginatedRooms.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}
            </span>{" "}
            đến{" "}
            <span className="font-bold text-[#253F5B]">
              {Math.min(currentPage * itemsPerPage, filteredRooms.length)}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-bold text-[#253F5B]">
              {filteredRooms.length}
            </span>{" "}
            phòng
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg bg-white border border-[#DCE8F3] text-[#5C84BE] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center hover:bg-[#F2F8FC] transition-colors"
                aria-label="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                    currentPage === pg
                      ? "bg-[#5C84BE] text-white shadow-sm"
                      : "bg-white border border-[#DCE8F3] text-[#486687] hover:bg-[#F2F8FC]"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg bg-white border border-[#DCE8F3] text-[#5C84BE] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center hover:bg-[#F2F8FC] transition-colors"
                aria-label="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRoom={handleAddRoom}
      />
    </div>
  );
}
