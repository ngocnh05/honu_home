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
import type { ServiceItem, ServiceBillingType, ServicePriceOption } from "@/types/service";
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
  const [formPriceOptions, setFormPriceOptions] = React.useState<ServicePriceOption[]>([]);

  // Sub-form for adding a price option in modal
  const [newOptLabel, setNewOptLabel] = React.useState("");
  const [newOptPrice, setNewOptPrice] = React.useState("");
  const [newOptUnit, setNewOptUnit] = React.useState("đ/kWh");
  const [newOptType, setNewOptType] = React.useState<ServiceBillingType>("meter");

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
    setFormPriceOptions([
      { id: `opt_${Date.now()}_1`, label: "Tiêu chuẩn", price: 3500, unit: "đ/kWh", type: "meter", isDefault: true }
    ]);
    setNewOptLabel("");
    setNewOptPrice("");
    setNewOptUnit("đ/kWh");
    setNewOptType("meter");
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
    setFormPriceOptions(
      service.priceOptions && service.priceOptions.length > 0
        ? [...service.priceOptions]
        : [
            {
              id: `opt_${service.id}_default`,
              label: "Mặc định",
              price: service.price,
              unit: service.unit,
              type: service.type,
              isDefault: true,
            },
          ]
    );
    setNewOptLabel("");
    setNewOptPrice("");
    setNewOptUnit(service.unit);
    setNewOptType(service.type);
    setShowModal(true);
  };

  // Quick unit helper when type changes
  const handleTypeChange = (type: ServiceBillingType) => {
    setFormType(type);
    if (type === "meter") setFormUnit("đ/kWh");
    else if (type === "per_person") setFormUnit("đ/người");
    else if (type === "per_vehicle") setFormUnit("đ/xe");
    else if (type === "per_room") setFormUnit("đ/phòng");
    else setFormUnit("đ/tháng");
  };

  // Quick unit helper for sub-form
  const handleNewOptTypeChange = (type: ServiceBillingType) => {
    setNewOptType(type);
    if (type === "meter") setNewOptUnit("đ/kWh");
    else if (type === "per_person") setNewOptUnit("đ/người");
    else if (type === "per_vehicle") setNewOptUnit("đ/xe");
    else if (type === "per_room") setNewOptUnit("đ/phòng");
    else setNewOptUnit("đ/tháng");
  };

  // Add price option
  const handleAddPriceOption = () => {
    if (!newOptLabel.trim()) {
      error("Vui lòng nhập tên mức giá / gói cước");
      return;
    }
    const cleanP = Number(newOptPrice.replace(/\D/g, "")) || 0;
    if (cleanP < 0) {
      error("Đơn giá không hợp lệ");
      return;
    }
    const newOpt: ServicePriceOption = {
      id: `opt_${Date.now()}`,
      label: newOptLabel.trim(),
      price: cleanP,
      unit: newOptUnit.trim() || formUnit,
      type: newOptType,
      isDefault: formPriceOptions.length === 0,
    };
    setFormPriceOptions((prev) => [...prev, newOpt]);
    setNewOptLabel("");
    setNewOptPrice("");
  };

  // Remove price option
  const handleRemovePriceOption = (optId: string) => {
    setFormPriceOptions((prev) => prev.filter((o) => o.id !== optId));
  };

  // Set default option
  const handleSetDefaultOption = (optId: string) => {
    setFormPriceOptions((prev) =>
      prev.map((o) => {
        const isDef = o.id === optId;
        if (isDef) {
          // sync main form price & unit to default option
          setFormPrice(String(o.price));
          setFormUnit(o.unit);
          setFormType(o.type);
        }
        return { ...o, isDefault: isDef };
      })
    );
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      error("Vui lòng nhập tên dịch vụ");
      return;
    }
    const cleanPrice = Number(formPrice.replace(/\D/g, "")) || 0;

    const bld = initialBuildings.find((b) => b.id === formBuildingId);
    const buildingName = formBuildingId === "all" ? "Áp dụng tất cả cơ sở" : bld?.name || "Cơ sở";

    const finalOptions: ServicePriceOption[] = formPriceOptions.length > 0
      ? formPriceOptions
      : [
          {
            id: `opt_${Date.now()}`,
            label: "Tiêu chuẩn",
            price: cleanPrice,
            unit: formUnit,
            type: formType,
            isDefault: true,
          },
        ];

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
                priceOptions: finalOptions,
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
        priceOptions: finalOptions,
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
          {initialBuildings.map((b) => {
            const count = services.filter((s) => s.buildingId === b.id).length;
            return (
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
                {b.name} ({count})
              </button>
            );
          })}
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
                  <span className="text-xs text-[#7A93AD] font-semibold block">Đơn giá mặc định:</span>
                  <span className="text-xl font-black text-[#253F5B] tracking-tight">
                    {srv.price.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <span className="text-xs font-bold text-[#5C84BE] bg-[#EAF2F8] px-2.5 py-1 rounded-lg">
                  / {srv.unit.replace("đ/", "")}
                </span>
              </div>

              {/* Price Options Chips */}
              {srv.priceOptions && srv.priceOptions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-[#7A93AD] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#5C84BE]" />
                    <span>{srv.priceOptions.length} mức giá có thể chọn cho phòng:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {srv.priceOptions.map((opt) => (
                      <span
                        key={opt.id}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
                          opt.isDefault
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-[#F4F8FC] text-[#526579] border-[#DCE8F3]"
                        }`}
                        title={opt.label}
                      >
                        {opt.label}: {opt.price.toLocaleString("vi-VN")} {opt.unit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col p-6 space-y-4 animate-scaleUp overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    {editingService ? "Chỉnh Sửa Dịch Vụ & Mức Giá" : "Thêm Dịch Vụ Phòng Mới"}
                  </h3>
                  <p className="text-[11px] text-[#7A93AD]">
                    Thiết lập dịch vụ cơ sở và các tùy chọn giá cho từng loại phòng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
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
                  <label className="text-xs font-bold text-[#253F5B]">Hình thức mặc định</label>
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
                  <label className="text-xs font-bold text-[#253F5B]">Đơn vị tính mặc định</label>
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
                <label className="text-xs font-bold text-[#253F5B]">Đơn giá mặc định (VNĐ) *</label>
                <input
                  type="text"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Ví dụ: 3500, 30000..."
                  className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                />
              </div>

              {/* 4. Section: Các mức giá / Gói cước có thể lựa chọn cho phòng */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#F8FBFE] border border-[#DEEAF4]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#253F5B] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#5C84BE]" />
                    <span>Các mức giá có thể chọn cho phòng ({formPriceOptions.length})</span>
                  </span>
                  <span className="text-[10px] text-[#7A93AD]">Tích chọn mức làm mặc định</span>
                </div>

                {/* Danh sách các options đã tạo */}
                <div className="space-y-1.5">
                  {formPriceOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E3EDF6] text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="radio"
                          name="defaultOption"
                          checked={opt.isDefault}
                          onChange={() => handleSetDefaultOption(opt.id)}
                          className="w-3.5 h-3.5 text-[#5C84BE] cursor-pointer"
                          title="Đặt làm mặc định"
                        />
                        <span className="font-bold text-[#253F5B] truncate">{opt.label}</span>
                        {opt.isDefault && (
                          <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-extrabold text-[#5C84BE]">
                          {opt.price.toLocaleString("vi-VN")} {opt.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePriceOption(opt.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa mức giá này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {formPriceOptions.length === 0 && (
                    <p className="text-[11px] text-[#7A93AD] italic text-center py-1">
                      Chưa có mức giá riêng biệt. Sẽ dùng đơn giá mặc định ở trên.
                    </p>
                  )}
                </div>

                {/* Form thêm mức giá mới */}
                <div className="pt-2 border-t border-[#EAF2F8] space-y-2">
                  <span className="text-[11px] font-bold text-[#5C84BE] block">
                    + Thêm mức giá / Gói tính tiền khác:
                  </span>
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      type="text"
                      placeholder="Tên gói (VD: Khoán theo người)"
                      value={newOptLabel}
                      onChange={(e) => setNewOptLabel(e.target.value)}
                      className="col-span-6 h-8 px-2.5 rounded-lg border border-[#D9E6F2] bg-white text-xs text-[#253F5B] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Đơn giá (VD: 100000)"
                      value={newOptPrice}
                      onChange={(e) => setNewOptPrice(e.target.value)}
                      className="col-span-3 h-8 px-2 rounded-lg border border-[#D9E6F2] bg-white text-xs text-[#253F5B] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Đơn vị (đ/người)"
                      value={newOptUnit}
                      onChange={(e) => setNewOptUnit(e.target.value)}
                      className="col-span-3 h-8 px-2 rounded-lg border border-[#D9E6F2] bg-white text-xs text-[#253F5B] outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#7A93AD]">
                      <span>Hình thức:</span>
                      <select
                        value={newOptType}
                        onChange={(e) => handleNewOptTypeChange(e.target.value as ServiceBillingType)}
                        className="h-7 px-2 rounded-lg border border-[#D9E6F2] bg-white text-[11px] font-medium text-[#253F5B]"
                      >
                        <option value="meter">Chỉ số (Điện/Nước)</option>
                        <option value="per_person">Theo người</option>
                        <option value="per_vehicle">Theo xe</option>
                        <option value="per_room">Theo phòng</option>
                        <option value="fixed">Cố định</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPriceOption}
                      className="h-7 px-3 rounded-lg bg-[#253F5B] hover:bg-[#1B2F44] text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm mức</span>
                    </button>
                  </div>
                </div>
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

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F0F5FA] shrink-0">
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
