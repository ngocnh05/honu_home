"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  MapPin,
  Layers,
  DoorOpen,
  UserCheck,
  Zap,
  Droplets,
  Edit,
  Trash2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Phone,
} from "lucide-react";
import type { Building, NewBuildingInput } from "@/types/building";
import { initialBuildings } from "@/lib/mock-data/buildings";
import { AddBuildingModal } from "./add-building-modal";

export function BuildingsView() {
  const [buildings, setBuildings] = React.useState<Building[]>(initialBuildings);
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBuilding, setEditingBuilding] = React.useState<Building | null>(null);

  // Compute aggregate KPIs
  const stats = React.useMemo(() => {
    const totalBuildings = buildings.length;
    const totalRooms = buildings.reduce((acc, b) => acc + b.totalRooms, 0);
    const occupiedRooms = buildings.reduce((acc, b) => acc + b.occupiedRooms, 0);
    const availableRooms = buildings.reduce((acc, b) => acc + b.availableRooms, 0);
    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : "0";

    return {
      totalBuildings,
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate,
    };
  }, [buildings]);

  // Filtered buildings
  const filteredBuildings = React.useMemo(() => {
    return buildings.filter((b) => {
      return statusFilter === "ALL" || b.status === statusFilter;
    });
  }, [buildings, statusFilter]);

  const handleAddBuilding = (data: NewBuildingInput) => {
    if (editingBuilding) {
      setBuildings((prev) =>
        prev.map((b) =>
          b.id === editingBuilding.id
            ? {
                ...b,
                ...data,
                statusLabel: data.status === "active" ? "Đang vận hành" : "Đang bảo trì",
              }
            : b
        )
      );
      setEditingBuilding(null);
    } else {
      const newBuilding: Building = {
        ...data,
        id: `bld_${Date.now()}`,
        occupiedRooms: 0,
        availableRooms: data.totalRooms,
        maintenanceRooms: 0,
        statusLabel: data.status === "active" ? "Đang vận hành" : "Đang bảo trì",
        createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date()),
      };
      setBuildings((prev) => [newBuilding, ...prev]);
    }
  };

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa cơ sở "${name}" khỏi hệ thống?`)) {
      setBuildings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-12 select-none">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shadow-inner">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-[#253F5B] tracking-tight">
                Cơ sở / Tòa nhà
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBF2F9] text-[#5C84BE] text-xs font-bold">
                {buildings.length} cơ sở
              </span>
            </div>
            <p className="text-xs text-[#7B92AC] font-medium mt-0.5">
              Quản lý danh sách các tòa nhà trọ, biểu giá dịch vụ và tỷ lệ lấp đầy từng cơ sở
            </p>
          </div>
        </div>

        {/* Right Toolbar: Lọc trạng thái + Nút Thêm Cơ Sở */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#F1F6FB] rounded-xl border border-[#DEEBF5]">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-white text-[#253F5B] shadow-sm"
                  : "text-[#627D98] hover:text-[#253F5B]"
              }`}
            >
              Tất cả ({buildings.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "active"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-[#627D98] hover:text-[#253F5B]"
              }`}
            >
              Đang vận hành
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("maintenance")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "maintenance"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-[#627D98] hover:text-[#253F5B]"
              }`}
            >
              Bảo trì
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingBuilding(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] text-white font-semibold text-xs transition-all shadow-md shadow-[#5C84BE]/25 cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Thêm Cơ Sở Mới
          </button>
        </div>
      </div>

      {/* 2. Aggregate KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#5C84BE] flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#7A93B0]">Tổng số cơ sở</p>
            <p className="text-2xl font-extrabold text-[#253F5B]">{stats.totalBuildings}</p>
            <p className="text-[11px] text-[#5C84BE] font-medium">Đang quản lý</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <DoorOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#7A93B0]">Tổng quy mô phòng</p>
            <p className="text-2xl font-extrabold text-[#253F5B]">{stats.totalRooms}</p>
            <p className="text-[11px] text-slate-500 font-medium">Căn hộ / Phòng</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#7A93B0]">Tỷ lệ lấp đầy</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#253F5B]">{stats.occupancyRate}%</span>
              <span className="text-xs font-bold text-emerald-600">({stats.occupiedRooms} thuê)</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Toàn hệ thống</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DoorOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#7A93B0]">Phòng đang trống</p>
            <p className="text-2xl font-extrabold text-amber-600">{stats.availableRooms}</p>
            <p className="text-[11px] text-slate-500 font-medium">Sẵn sàng đón khách</p>
          </div>
        </div>
      </div>

      {/* 3. Buildings Cards Grid */}
      {filteredBuildings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E3EDF6] space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-[#253F5B]">Không tìm thấy cơ sở nào</p>
          <p className="text-xs text-slate-500">Thử tìm kiếm với từ khóa khác hoặc tạo cơ sở mới.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => {
            const occupancy =
              building.totalRooms > 0
                ? Math.round((building.occupiedRooms / building.totalRooms) * 100)
                : 0;

            return (
              <div
                key={building.id}
                className="bg-white rounded-3xl border border-[#E3EDF6] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Building Cover Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={building.image}
                    alt={building.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/20">
                      {building.code}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm ${
                        building.occupiedRooms === building.totalRooms
                          ? "bg-purple-600/90 text-white"
                          : building.status === "active"
                          ? "bg-emerald-500/90 text-white"
                          : "bg-amber-500/90 text-white"
                      }`}
                    >
                      {building.statusLabel}
                    </span>
                  </div>

                  {/* Building Name on bottom of image */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold drop-shadow-md leading-tight line-clamp-1">
                      {building.name}
                    </h3>
                  </div>
                </div>

                {/* Building Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Address */}
                  <div className="flex items-start gap-2 text-slate-600 text-xs">
                    <MapPin className="w-4 h-4 text-[#5C84BE] shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed font-medium">
                      {building.address}
                    </span>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#F6FAFD] border border-[#E3EDF6]">
                    <div className="flex items-center justify-between text-xs font-bold text-[#253F5B]">
                      <span className="flex items-center gap-1.5">
                        <DoorOpen className="w-3.5 h-3.5 text-[#5C84BE]" />
                        Tỷ lệ lấp đầy
                      </span>
                      <span className="text-[#5C84BE]">{occupancy}%</span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-[#5C84BE] to-[#426ba8] transition-all duration-500"
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-0.5">
                      <span className="text-emerald-700">Đang thuê: {building.occupiedRooms}</span>
                      <span className="text-amber-700">Trống: {building.availableRooms}</span>
                      <span className="text-slate-400">Tổng: {building.totalRooms}</span>
                    </div>
                  </div>

                  {/* Manager & Pricing Information */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {/* Floors */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Layers className="w-4 h-4 text-[#5C84BE] shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Quy mô</p>
                        <p className="font-bold text-[#253F5B]">{building.totalFloors} tầng</p>
                      </div>
                    </div>

                    {/* Manager */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-medium">Quản lý</p>
                        <p className="font-bold text-[#253F5B] truncate" title={building.managerName}>
                          {building.managerName}
                        </p>
                      </div>
                    </div>

                    {/* Electricity */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Giá điện</p>
                        <p className="font-bold text-[#253F5B]">
                          {new Intl.NumberFormat("vi-VN").format(building.defaultElectricityPrice)} đ
                        </p>
                      </div>
                    </div>

                    {/* Water */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Giá nước</p>
                        <p className="font-bold text-[#253F5B]">
                          {new Intl.NumberFormat("vi-VN").format(building.defaultWaterPrice)} đ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#EEF3F8] flex items-center justify-between gap-2">
                    <Link
                      href={`/rooms`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#EAF2F8] hover:bg-[#DCE9F5] text-[#253F5B] font-bold text-xs transition-colors cursor-pointer"
                    >
                      <DoorOpen className="w-3.5 h-3.5 text-[#5C84BE]" />
                      Xem danh sách phòng ({building.totalRooms})
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleEdit(building)}
                      className="p-2 rounded-xl text-slate-500 hover:text-[#5C84BE] hover:bg-[#F0F5FA] transition-colors cursor-pointer"
                      title="Chỉnh sửa cơ sở"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(building.id, building.name)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Xóa cơ sở"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddBuildingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBuilding(null);
        }}
        onSubmit={handleAddBuilding}
        editingBuilding={editingBuilding}
      />
    </div>
  );
}
