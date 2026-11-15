"use client";

import * as React from "react";
import {
  Zap,
  Droplets,
  Wifi,
  Sparkles,
  Bike,
  Plus,
  Search,
  Building2,
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";
import type { ServiceItem, ServiceBillingType } from "@/types/service";
import { initialServices } from "@/lib/mock-data/services";
import { initialBuildings } from "@/lib/mock-data/buildings";
import { useSnackbar } from "@/components/common/snackbar";

export function ServicesView() {
  const { success, error } = useSnackbar();
  const [services, setServices] = React.useState<ServiceItem[]>(initialServices);
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal State
  const [showModal, setShowModal] = React.useState(false);
  const [editingService, setEditingService] = React.useState<ServiceItem | null>(null);

  // Form State
  const [formName, setFormName] = React.useState("");
  const [formBuildingId, setFormBuildingId] = React.useState("all");
  const [formType, setFormType] = React.useState<ServiceBillingType>("meter");
  const [formPrice, setFormPrice] = React.useState("");
  const [formUnit, setFormUnit] = React.useState("đ/kWh");
  const [formDescription, setFormDescription] = React.useState("");

  // Filtered Services
  const filteredServices = React.useMemo(() => {
    return services.filter((srv) => {
      const matchBuilding =
        selectedBuildingId === "all" ||
        srv.buildingId === "all" ||
        srv.buildingId === selectedBuildingId;
      const matchQuery =
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (srv.description && srv.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchBuilding && matchQuery;
    });
  }, [services, selectedBuildingId, searchQuery]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingService(null);
    setFormName("");
    setFormBuildingId(selectedBuildingId !== "all" ? selectedBuildingId : "all");
    setFormType("meter");
    setFormPrice("3500");
    setFormUnit("đ/kWh");
    setFormDescription("");
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormName(service.name);
    setFormBuildingId(service.buildingId);
    setFormType(service.type);
    setFormPrice(String(service.price));
    setFormUnit(service.unit);
    setFormDescription(service.description || "");
    setShowModal(true);
  };

  // Quick unit helper when type changes
  const handleTypeChange = (type: ServiceBillingType) => {
    setFormType(type);
    if (type === "meter") setFormUnit("đ/kWh");
    else if (type === "per_person") setFormUnit("đ/người/tháng");
    else if (type === "per_vehicle") setFormUnit("đ/xe/tháng");
    else if (type === "per_room") setFormUnit("đ/phòng/tháng");
    else setFormUnit("đ/tháng");
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      error("Vui lòng nhập tên dịch vụ");
      return;
    }
    const cleanPrice = Number(formPrice.replace(/\D/g, "")) || 0;
    if (cleanPrice <= 0) {
      error("Vui lòng nhập đơn giá hợp lệ");
      return;
    }

    const bld = initialBuildings.find((b) => b.id === formBuildingId);
    const buildingName = formBuildingId === "all" ? "Áp dụng tất cả cơ sở" : bld?.name || "Cơ sở";

    if (editingService) {
      setServices((prev) =>
        prev.map((item) =>
          item.id === editingService.id
            ? {
                ...item,
                name: formName.trim(),
                buildingId: formBuildingId,
                buildingName,
                type: formType,
                price: cleanPrice,
                priceFormatted: `${cleanPrice.toLocaleString("vi-VN")} ${formUnit}`,
                unit: formUnit,
                description: formDescription,
              }
            : item
        )
      );
      success(`Đã cập nhật dịch vụ "${formName}"`);
    } else {
      const newService: ServiceItem = {
        id: `srv_${Date.now()}`,
        name: formName.trim(),
        buildingId: formBuildingId,
        buildingName,
        type: formType,
        price: cleanPrice,
        priceFormatted: `${cleanPrice.toLocaleString("vi-VN")} ${formUnit}`,
        unit: formUnit,
        description: formDescription,
        isMandatory: true,
        appliedRoomsCount: 45,
      };
      setServices((prev) => [newService, ...prev]);
      success(`Đã thêm dịch vụ "${formName}"`);
    }

    setShowModal(false);
  };

  // Delete Service
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${name}"?`)) {
      setServices((prev) => prev.filter((item) => item.id !== id));
      success(`Đã xóa dịch vụ "${name}"`);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-inner">
            <Zap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Bảng Dịch Vụ & Tiện Ích Phòng
              </h1>
              <span className="text-xs font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full border border-[#D8E6F3]">
                {filteredServices.length} dịch vụ
              </span>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Cấu hình đơn giá điện (3.5k), nước, wifi, gửi xe, vệ sinh tự động tính vào hóa đơn hàng tháng
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="h-11 px-5 rounded-2xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Dịch Vụ Mới</span>
        </button>
      </div>

      {/* 2. Controls Bar: Filter Cơ sở & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E3EDF6] shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedBuildingId("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedBuildingId === "all"
                ? "bg-[#253F5B] text-white shadow-sm"
                : "bg-[#F4F8FC] text-[#526579] hover:bg-[#EAF2F8]"
            }`}
          >
            Tất cả cơ sở
          </button>
          {initialBuildings.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBuildingId(b.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBuildingId === b.id
                  ? "bg-[#253F5B] text-white shadow-sm"
                  : "bg-[#F4F8FC] text-[#526579] hover:bg-[#EAF2F8]"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#7A93AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên dịch vụ, đơn giá..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-medium text-[#253F5B] transition-all"
          />
        </div>
      </div>

      {/* 3. Grid Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-3xl border border-[#E3EDF6] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center font-bold">
                    {srv.type === "meter" ? (
                      <Zap className="w-5 h-5 text-amber-500" />
                    ) : srv.type === "per_vehicle" ? (
                      <Bike className="w-5 h-5 text-emerald-500" />
                    ) : srv.type === "per_person" ? (
                      <Sparkles className="w-5 h-5 text-sky-500" />
                    ) : (
                      <Wifi className="w-5 h-5 text-indigo-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#253F5B]">{srv.name}</h3>
                    <span className="text-[11px] font-semibold text-[#7A93AD] flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>{srv.buildingName}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => openEditModal(srv)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#5C84BE] hover:bg-[#F0F5FA] transition-colors cursor-pointer"
                    title="Chỉnh sửa đơn giá"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(srv.id, srv.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa dịch vụ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-[#F8FBFE] p-3.5 rounded-2xl border border-[#EAF2F8] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#7A93AD] font-semibold block">Đơn giá áp dụng:</span>
                  <span className="text-xl font-black text-[#253F5B] tracking-tight">
                    {srv.price.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <span className="text-xs font-bold text-[#5C84BE] bg-[#EAF2F8] px-2.5 py-1 rounded-lg">
                  / {srv.unit.replace("đ/", "")}
                </span>
              </div>

              <p className="text-xs text-[#526579] line-clamp-2 leading-relaxed">
                {srv.description || "Dịch vụ phòng trọ áp dụng tự động vào chu kỳ chốt hóa đơn hàng tháng."}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-between text-xs">
              <span className="text-[#7A93AD] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Áp dụng {srv.appliedRoomsCount || 45} phòng</span>
              </span>
              <span className="font-bold text-[#5C84BE] bg-[#EAF2F8]/70 px-2 py-0.5 rounded-md text-[10px]">
                {srv.type === "meter"
                  ? "Đo theo công tơ"
                  : srv.type === "per_person"
                  ? "Theo đầu người"
                  : srv.type === "per_vehicle"
                  ? "Theo số lượng xe"
                  : "Cố định phòng"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Thêm / Chỉnh Sửa Dịch Vụ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-md p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-[#253F5B]">
                  {editingService ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Phòng Mới"}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B]">Tên dịch vụ *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Tiền điện, Nước sinh hoạt, Gửi xe..."
                  className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B]">Cơ sở áp dụng</label>
                <select
                  value={formBuildingId}
                  onChange={(e) => setFormBuildingId(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-semibold text-[#253F5B]"
                >
                  <option value="all">Áp dụng cho tất cả cơ sở</option>
                  {initialBuildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Hình thức tính</label>
                  <select
                    value={formType}
                    onChange={(e) => handleTypeChange(e.target.value as ServiceBillingType)}
                    className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-semibold text-[#253F5B]"
                  >
                    <option value="meter">Theo chỉ số (Điện/Nước)</option>
                    <option value="per_person">Theo đầu người</option>
                    <option value="per_vehicle">Theo số xe</option>
                    <option value="per_room">Theo phòng</option>
                    <option value="fixed">Cố định hàng tháng</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#253F5B]">Đơn vị tính</label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="đ/kWh, đ/khối..."
                    className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-semibold text-[#253F5B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B]">Đơn giá (VNĐ) *</label>
                <input
                  type="text"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Ví dụ: 3500, 30000..."
                  className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B]">Mô tả cách tính</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ghi chú chi tiết cách tính hoặc chu kỳ thanh toán..."
                  className="w-full p-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs text-[#253F5B] transition-all resize-none"
                />
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
                  {editingService ? "Lưu Thay Đổi" : "Tạo Dịch Vụ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
