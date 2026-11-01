"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  SquarePen,
  Trash2,
  Eye,
  BedDouble,
} from "lucide-react";
import type { Room, RoomStatus } from "@/types/room";
import { initialRooms } from "@/lib/mock-data/rooms";
import { AddRoomModal } from "@/components/rooms/add-room-modal";

export function RoomsTable() {
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const itemsPerPage = 6;

  // Filter logic
  const filteredRooms = React.useMemo(() => {
    return rooms.filter((r) => {
      const matchSearch =
        r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tenantName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = typeFilter === "ALL" || r.type === typeFilter;
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [rooms, searchTerm, typeFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage) || 1;
  const paginatedRooms = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(start, start + itemsPerPage);
  }, [filteredRooms, currentPage]);

  const handleDeleteRoom = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
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
    };

    setRooms((prev) => [newRoom, ...prev]);
  };

  return (
    <div className="w-[1096px] space-y-6 animate-fadeIn pb-16">
      {/* 1. Header Area: Danh sách phòng */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-[#253F5B] tracking-tight">
              Danh sách phòng
            </h1>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <BedDouble className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>
          <p className="text-base text-[#67829E] font-medium flex items-center gap-1.5">
            <span>Chúc bạn một ngày mới tốt lành</span>
            <span>😊</span>
          </p>
        </div>
      </div>

      {/* 2. Search Bar + Nút Thêm Phòng (Figma: 552px input, 165px button) */}
      <div className="flex items-center justify-between">
        {/* Search Input: Frame 7 (552px x 56px) */}
        <div className="relative w-[552px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm Kiếm theo số phòng, loại phòng..."
            className="w-full h-[56px] pl-6 pr-14 rounded-full bg-white border border-[#DEEBF5] focus:border-[#5C84BE] text-base text-[#253F5B] placeholder:text-[#BCC6D5] outline-none shadow-sm transition-all"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-[#5C84BE] hover:bg-[#F2F8FC] transition-colors"
            aria-label="Tìm kiếm phòng"
          >
            <Search className="w-5 h-5 stroke-[2.3]" />
          </button>
        </div>

        {/* Nút + Thêm phòng: Frame 22 (165px x 55px) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-[165px] h-[55px] rounded-2xl bg-[#5C84BE] hover:bg-[#4E75AF] active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md shadow-[#5C84BE]/20 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Thêm phòng</span>
        </button>
      </div>

      {/* 3. Bộ lọc: Tất cả phòng & Trạng Thái (269px x 61px mỗi ô) */}
      <div className="flex items-center gap-6">
        {/* Dropdown 1: Loại phòng */}
        <div className="relative w-[269px]">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-[61px] px-6 appearance-none rounded-2xl bg-white border border-[#DEEBF5] focus:border-[#5C84BE] text-base font-semibold text-[#253F5B] outline-none shadow-sm cursor-pointer"
          >
            <option value="ALL">Tất cả phòng</option>
            <option value="Phòng Đơn">Phòng Đơn</option>
            <option value="Phòng Đôi">Phòng Đôi</option>
            <option value="Phòng Ba">Phòng Ba</option>
          </select>
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C84BE] pointer-events-none" />
        </div>

        {/* Dropdown 2: Trạng thái */}
        <div className="relative w-[269px]">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-[61px] px-6 appearance-none rounded-2xl bg-white border border-[#DEEBF5] focus:border-[#5C84BE] text-base font-semibold text-[#253F5B] outline-none shadow-sm cursor-pointer"
          >
            <option value="ALL">Trạng Thái (Tất cả)</option>
            <option value="rented">Đang Thuê</option>
            <option value="available">Trống</option>
            <option value="maintenance">Đang sửa</option>
          </select>
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C84BE] pointer-events-none" />
        </div>
      </div>

      {/* 4. Bảng Dữ Liệu Phòng - Chuẩn Figma Frame 25: 1075px x 480px */}
      <div className="w-[1075px] bg-white rounded-3xl border border-[#E3EDF6] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#EDF4FA] bg-[#F9FBFE] h-[64px] text-sm font-bold text-[#6D87A4] uppercase tracking-wider">
              <th className="pl-8 w-[80px]">STT</th>
              <th className="px-4 w-[120px]">Số Phòng</th>
              <th className="px-4 w-[160px]">Loại Phòng</th>
              <th className="px-4 w-[180px]">Giá Thuê</th>
              <th className="px-4 w-[160px]">Trạng Thái</th>
              <th className="px-4 w-[180px]">Người Thuê</th>
              <th className="pr-8 text-center w-[160px]">Thao Tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#EDF4FA]">
            {paginatedRooms.length > 0 ? (
              paginatedRooms.map((room, idx) => {
                const stt = (currentPage - 1) * itemsPerPage + idx + 1;

                // Status Badge styles
                const badgeStyles = {
                  rented:
                    "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
                  available:
                    "bg-sky-50 text-sky-700 border-sky-200/80 font-bold",
                  maintenance:
                    "bg-amber-50 text-amber-700 border-amber-200/80 font-bold",
                };

                return (
                  <tr
                    key={room.id}
                    className="h-[68px] hover:bg-[#F8FBFE] transition-colors text-sm font-medium text-[#253F5B]"
                  >
                    {/* STT */}
                    <td className="pl-8 font-semibold text-[#8FA5BD]">{stt}</td>

                    {/* Số Phòng */}
                    <td className="px-4">
                      <span className="font-extrabold text-[#253F5B] text-base">
                        {room.roomNumber}
                      </span>
                    </td>

                    {/* Loại Phòng */}
                    <td className="px-4 text-[#44607F] font-semibold">
                      {room.type}
                    </td>

                    {/* Giá Thuê */}
                    <td className="px-4 font-bold text-[#253F5B]">
                      {room.priceFormatted}
                    </td>

                    {/* Trạng Thái Badge */}
                    <td className="px-4">
                      <span
                        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs border ${
                          badgeStyles[room.status]
                        }`}
                      >
                        {room.statusLabel}
                      </span>
                    </td>

                    {/* Người Thuê */}
                    <td className="px-4 font-semibold text-[#486687]">
                      {room.tenantName}
                    </td>

                    {/* Thao Tác (3 Actions: Sửa, Xóa, Chi tiết) */}
                    <td className="pr-8">
                      <div className="flex items-center justify-center gap-3">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => alert(`Chỉnh sửa phòng ${room.roomNumber}`)}
                          className="p-2 rounded-xl text-[#5C84BE] hover:bg-[#EBF3FB] transition-colors"
                          title="Chỉnh sửa"
                        >
                          <SquarePen className="w-5 h-5 stroke-[2.2]" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Xóa phòng"
                        >
                          <Trash2 className="w-5 h-5 stroke-[2.2]" />
                        </button>

                        {/* View Details Button */}
                        <Link
                          href={`/rooms/${room.roomNumber}`}
                          className="p-2 rounded-xl text-[#627D9B] hover:bg-[#F2F8FD] transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5 stroke-[2.2]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="h-44 text-center text-[#8EA3BA]">
                  Không tìm thấy phòng nào phù hợp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Phân Trang (Pagination: Trang 1, 2, 3...) - Figma Frame 41, 42, 43 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pr-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl bg-white border border-[#E3EDF6] text-[#5C84BE] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center hover:bg-[#F2F8FC] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setCurrentPage(pg)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                currentPage === pg
                  ? "bg-[#5C84BE] text-white shadow-md shadow-[#5C84BE]/25"
                  : "bg-white border border-[#E3EDF6] text-[#486687] hover:bg-[#F2F8FC]"
              }`}
            >
              {pg}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl bg-white border border-[#E3EDF6] text-[#5C84BE] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center hover:bg-[#F2F8FC] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRoom={handleAddRoom}
      />
    </div>
  );
}
