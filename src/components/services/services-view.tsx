"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
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
  Armchair,
  Check,
  Tag,
  Flame,
  Wind,
  Refrigerator,
  Waves,
  SunMedium,
  Utensils,
  Fingerprint,
} from "lucide-react";
import type { ServiceItem, ServiceBillingType, ServicePriceOption } from "@/types/service";
import { initialServices } from "@/lib/mock-data/services";
import { initialBuildings } from "@/lib/mock-data/buildings";
import {
  AmenityItem,
  getAmenities,
  saveAmenities,
  initialAmenities,
} from "@/lib/mock-data/amenities";
import { useSnackbar } from "@/components/common/snackbar";

export function ServicesView() {
  const searchParams = useSearchParams();
  const paramTab = searchParams.get("tab") as ("services" | "amenities") | null;
  const paramBuilding = searchParams.get("buildingId");

  const { success, error } = useSnackbar();

  // Tab State: "services" (Bảng giá dịch vụ) vs "amenities" (Tiện nghi phòng)
  const [activeTab, setActiveTab] = React.useState<"services" | "amenities">(paramTab || "services");

  // SERVICES STATE
  const [services, setServices] = React.useState<ServiceItem[]>(initialServices);
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<string>(paramBuilding || "all");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (paramTab) setActiveTab(paramTab);
  }, [paramTab]);

  React.useEffect(() => {
    if (paramBuilding) setSelectedBuildingId(paramBuilding);
  }, [paramBuilding]);

  // Services Modal State
  const [showModal, setShowModal] = React.useState(false);
  const [editingService, setEditingService] = React.useState<ServiceItem | null>(null);

  // Service Form State
  const [formName, setFormName] = React.useState("");
  const [formBuildingId, setFormBuildingId] = React.useState("all");
  const [formType, setFormType] = React.useState<ServiceBillingType>("meter");
  const [formPrice, setFormPrice] = React.useState("");
  const [formUnit, setFormUnit] = React.useState("đ/kWh");
  const [formDescription, setFormDescription] = React.useState("");
  const [formPriceOptions, setFormPriceOptions] = React.useState<ServicePriceOption[]>([]);

  // Sub-form for adding a price option in service modal
  const [newOptLabel, setNewOptLabel] = React.useState("");
  const [newOptPrice, setNewOptPrice] = React.useState("");
  const [newOptUnit, setNewOptUnit] = React.useState("đ/kWh");
  const [newOptType, setNewOptType] = React.useState<ServiceBillingType>("meter");

  // ==================== AMENITIES STATE ====================
  const [amenities, setAmenities] = React.useState<AmenityItem[]>([]);
  const [amenitySearch, setAmenitySearch] = React.useState("");
  const [showAmenityModal, setShowAmenityModal] = React.useState(false);
  const [editingAmenity, setEditingAmenity] = React.useState<AmenityItem | null>(null);
  const [amenityName, setAmenityName] = React.useState("");
  const [amenityCategory, setAmenityCategory] = React.useState<
    "basic" | "furniture" | "appliance" | "outdoor"
  >("furniture");

  React.useEffect(() => {
    setAmenities(getAmenities());

    const handleStorageChange = () => {
      setAmenities(getAmenities());
    };
    window.addEventListener("honuhome_amenities_changed", handleStorageChange);
    return () => {
      window.removeEventListener("honuhome_amenities_changed", handleStorageChange);
    };
  }, []);

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

  // Filtered Amenities
  const filteredAmenities = React.useMemo(() => {
    return amenities.filter((item) =>
      item.name.toLowerCase().includes(amenitySearch.toLowerCase())
    );
  }, [amenities, amenitySearch]);

  // Open Create Service Modal
  const openCreateModal = () => {
    setEditingService(null);
    setFormName("");
    setFormBuildingId(selectedBuildingId !== "all" ? selectedBuildingId : "all");
    setFormType("meter");
    setFormPrice("3500");
    setFormUnit("đ/kWh");
    setFormDescription("");
    setFormPriceOptions([
      {
        id: `opt_${Date.now()}_1`,
        label: "Tiêu chuẩn",
        price: 3500,
        unit: "đ/kWh",
        type: "meter",
        isDefault: true,
      },
    ]);
    setNewOptLabel("");
    setNewOptPrice("");
    setNewOptUnit("đ/kWh");
    setNewOptType("meter");
    setShowModal(true);
  };

  // Open Edit Service Modal
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

  const handleTypeChange = (type: ServiceBillingType) => {
    setFormType(type);
    if (type === "meter") setFormUnit("đ/kWh");
    else if (type === "per_person") setFormUnit("đ/người");
    else if (type === "per_vehicle") setFormUnit("đ/xe");
    else if (type === "per_room") setFormUnit("đ/phòng");
    else setFormUnit("đ/tháng");
  };

  const handleNewOptTypeChange = (type: ServiceBillingType) => {
    setNewOptType(type);
    if (type === "meter") setNewOptUnit("đ/kWh");
    else if (type === "per_person") setNewOptUnit("đ/người");
    else if (type === "per_vehicle") setNewOptUnit("đ/xe");
    else if (type === "per_room") setNewOptUnit("đ/phòng");
    else setNewOptUnit("đ/tháng");
  };

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

  const handleRemovePriceOption = (optId: string) => {
    if (formPriceOptions.length <= 1) {
      error("Dịch vụ cần có ít nhất 1 mức giá!");
      return;
    }
    setFormPriceOptions((prev) => prev.filter((o) => o.id !== optId));
  };

  const handleSetDefaultOption = (optId: string) => {
    setFormPriceOptions((prev) =>
      prev.map((o) => {
        const isDef = o.id === optId;
        if (isDef) {
          setFormPrice(String(o.price));
          setFormUnit(o.unit);
          setFormType(o.type);
        }
        return { ...o, isDefault: isDef };
      })
    );
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      error("Vui lòng nhập tên dịch vụ");
      return;
    }

    const cleanPrice = Number(formPrice.replace(/\D/g, "")) || 0;
    const buildingName =
      formBuildingId === "all"
        ? "Áp dụng tất cả cơ sở"
        : initialBuildings.find((b) => b.id === formBuildingId)?.name || "Cơ sở";

    const finalOptions =
      formPriceOptions.length > 0
        ? formPriceOptions
        : [
            {
              id: `opt_${Date.now()}`,
              label: "Mặc định",
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

  const handleDeleteService = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${name}"?`)) {
      setServices((prev) => prev.filter((item) => item.id !== id));
      success(`Đã xóa dịch vụ "${name}"`);
    }
  };

  // ==================== AMENITY HANDLERS ====================
  const openCreateAmenityModal = () => {
    setEditingAmenity(null);
    setAmenityName("");
    setAmenityCategory("furniture");
    setShowAmenityModal(true);
  };

  const openEditAmenityModal = (item: AmenityItem) => {
    setEditingAmenity(item);
    setAmenityName(item.name);
    setAmenityCategory(item.category || "furniture");
    setShowAmenityModal(true);
  };

  const handleSubmitAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amenityName.trim()) {
      error("Vui lòng nhập tên tiện nghi!");
      return;
    }

    const trimmed = amenityName.trim();
    if (editingAmenity) {
      const updated = amenities.map((a) =>
        a.id === editingAmenity.id ? { ...a, name: trimmed, category: amenityCategory } : a
      );
      setAmenities(updated);
      saveAmenities(updated);
      success(`Đã cập nhật tiện nghi "${trimmed}"`);
    } else {
      // Check duplicate
      if (amenities.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) {
        error(`Tiện nghi "${trimmed}" đã tồn tại!`);
        return;
      }
      const newItem: AmenityItem = {
        id: `amenity_${Date.now()}`,
        name: trimmed,
        category: amenityCategory,
        isDefault: false,
      };
      const updated = [...amenities, newItem];
      setAmenities(updated);
      saveAmenities(updated);
      success(`Đã thêm tiện nghi "${trimmed}"`);
    }
    setShowAmenityModal(false);
  };

  const handleDeleteAmenity = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tiện nghi "${name}" khỏi danh mục phòng?`)) {
      const updated = amenities.filter((a) => a.id !== id);
      setAmenities(updated);
      saveAmenities(updated);
      success(`Đã xóa tiện nghi "${name}"`);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner transition-colors ${
              activeTab === "services"
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-indigo-50 text-indigo-600 border-indigo-200"
            }`}
          >
            {activeTab === "services" ? (
              <Zap className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <Armchair className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Bảng Dịch Vụ & Tiện Nghi Phòng
              </h1>
              <span className="text-xs font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full border border-[#D8E6F3]">
                {activeTab === "services"
                  ? `${filteredServices.length} dịch vụ`
                  : `${filteredAmenities.length} tiện nghi`}
              </span>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Quản lý tập trung biểu giá dịch vụ cơ sở và danh mục tiện nghi có sẵn để tích chọn nhanh khi tạo/sửa phòng.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F4F8FC] p-1.5 rounded-2xl border border-[#DEEAF4] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "services"
                ? "bg-white text-[#253F5B] shadow-xs ring-1 ring-[#253F5B]/10"
                : "text-[#7A93AD] hover:text-[#253F5B]"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Bảng Giá Dịch Vụ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("amenities")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "amenities"
                ? "bg-white text-[#253F5B] shadow-xs ring-1 ring-[#253F5B]/10"
                : "text-[#7A93AD] hover:text-[#253F5B]"
            }`}
          >
            <Armchair className="w-4 h-4 text-indigo-500" />
            <span>Tiện Nghi Phòng</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: BẢNG GIÁ DỊCH VỤ                                    */}
      {/* ========================================================= */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {/* Controls Bar: Filter Cơ sở & Search */}
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

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Tìm tên dịch vụ, đơn giá..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                />
                <Search className="w-4 h-4 text-[#7A93AD] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="h-10 px-4 rounded-xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Dịch Vụ Mới</span>
              </button>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="group bg-white rounded-3xl border border-[#E3EDF6] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#F0F5FA] text-[#5C84BE] flex items-center justify-center font-bold">
                        {srv.iconName === "Zap" ? (
                          <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                        ) : srv.iconName === "Droplets" ? (
                          <Droplets className="w-5 h-5 text-sky-500 fill-sky-500/20" />
                        ) : srv.iconName === "Bike" ? (
                          <Bike className="w-5 h-5 text-emerald-500" />
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
                        onClick={() => handleDeleteService(srv.id, srv.name)}
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
                      <span className="text-xs text-[#7A93AD] font-semibold block">
                        Đơn giá mặc định:
                      </span>
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
                    {srv.description ||
                      "Dịch vụ phòng trọ áp dụng tự động vào chu kỳ chốt hóa đơn hàng tháng."}
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
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: QUẢN LÝ TIỆN NGHI PHÒNG (THÊM / SỬA / XOÁ)         */}
      {/* ========================================================= */}
      {activeTab === "amenities" && (
        <div className="space-y-6">
          {/* Controls Bar: Đồng nhất bố cục chuẩn với Tab Bảng giá */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E3EDF6] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider bg-[#F4F8FC] px-3.5 py-2 rounded-xl border border-[#E3EDF6]">
                Danh mục tiện nghi sẵn có ({filteredAmenities.length})
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Tìm tên tiện nghi (giường, máy lạnh...)"
                  value={amenitySearch}
                  onChange={(e) => setAmenitySearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                />
                <Search className="w-4 h-4 text-[#7A93AD] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                type="button"
                onClick={openCreateAmenityModal}
                className="h-10 px-4 rounded-xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Tiện Nghi Mới</span>
              </button>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAmenities.map((item) => (
              <div
                key={item.id}
                className="group bg-white p-4 rounded-2xl border-2 border-[#EAF0F6] hover:border-[#5C84BE] shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center shrink-0 border border-[#D5E3F0]">
                    {item.name.toLowerCase().includes("lạnh") ? (
                      <Wind className="w-5 h-5" />
                    ) : item.name.toLowerCase().includes("nóng") ? (
                      <Flame className="w-5 h-5 text-amber-500" />
                    ) : item.name.toLowerCase().includes("giặt") ? (
                      <Waves className="w-5 h-5 text-sky-500" />
                    ) : item.name.toLowerCase().includes("tủ lạnh") ? (
                      <Refrigerator className="w-5 h-5 text-indigo-500" />
                    ) : item.name.toLowerCase().includes("bếp") ? (
                      <Utensils className="w-5 h-5 text-orange-500" />
                    ) : item.name.toLowerCase().includes("khóa") ? (
                      <Fingerprint className="w-5 h-5 text-emerald-600" />
                    ) : item.name.toLowerCase().includes("ban công") ? (
                      <SunMedium className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Armchair className="w-5 h-5 text-[#5C84BE]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-black text-[#253F5B] block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#7A93AD] uppercase tracking-wider">
                      {item.category === "furniture"
                        ? "Nội thất"
                        : item.category === "appliance"
                        ? "Thiết bị điện"
                        : item.category === "outdoor"
                        ? "Không gian / Ban công"
                        : "Cơ bản"}
                    </span>
                  </div>
                </div>

                {/* Actions: Edit & Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditAmenityModal(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#5C84BE] hover:bg-[#F0F5FA] transition-colors cursor-pointer"
                    title="Chỉnh sửa tên tiện nghi"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAmenity(item.id, item.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa tiện nghi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F5FA] border border-[#DEEAF4] flex items-center justify-between text-xs text-[#526579]">
            <span>
              💡 Danh mục tiện nghi này sẽ tự động cập nhật ngay lập tức vào phần <b>Tiện Nghi Sẵn Có Trong Phòng (Tích chọn)</b> ở cả trang Thêm phòng và Sửa phòng.
            </span>
          </div>
        </div>
      )}

      {/* ==================== MODAL THÊM / SỬA TIỆN NGHI ==================== */}
      {showAmenityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-md p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Armchair className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    {editingAmenity ? "Sửa Tiện Nghi Phòng" : "Thêm Tiện Nghi Mới"}
                  </h3>
                  <p className="text-[11px] text-[#7A93AD]">
                    Được dùng để tích chọn nhanh trên danh sách phòng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAmenityModal(false)}
                className="w-8 h-8 rounded-lg bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAmenity} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B]">Tên tiện nghi *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bàn làm việc, Sofa, Máy hút mùi, Lò vi sóng..."
                  value={amenityName}
                  onChange={(e) => setAmenityName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#253F5B]">Phân nhóm tiện nghi</label>
                <select
                  value={amenityCategory}
                  onChange={(e) =>
                    setAmenityCategory(
                      e.target.value as "basic" | "furniture" | "appliance" | "outdoor"
                    )
                  }
                  className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white text-xs font-bold text-[#253F5B] focus:border-[#5C84BE] outline-none cursor-pointer"
                >
                  <option value="furniture">Nội thất (Giường, tủ, bàn ghế...)</option>
                  <option value="appliance">Thiết bị điện tử (Máy lạnh, nóng lạnh, tủ lạnh...)</option>
                  <option value="outdoor">Không gian (Ban công, cửa sổ, giếng trời...)</option>
                  <option value="basic">Tiện ích cơ bản & an ninh (Khóa vân tay, gác lửng...)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F5FA]">
                <button
                  type="button"
                  onClick={() => setShowAmenityModal(false)}
                  className="h-9 px-4 rounded-xl text-xs font-bold text-[#526579] hover:bg-[#F0F5FA] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingAmenity ? "Lưu Tiện Nghi" : "Tạo Mới"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL THÊM / SỬA DỊCH VỤ ==================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-4xl lg:max-w-5xl max-h-[94vh] flex flex-col p-6 sm:p-7 space-y-5 animate-scaleUp overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F5FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-200">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#253F5B]">
                    {editingService ? "Chỉnh Sửa Dịch Vụ & Bảng Mức Giá" : "Thêm Dịch Vụ Phòng Mới"}
                  </h3>
                  <p className="text-xs text-[#7A93AD]">
                    Thiết lập thông tin dịch vụ cơ sở và các tùy chọn giá linh hoạt cho từng phòng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form: 2-Column Wide Layout */}
            <form
              onSubmit={handleSubmitService}
              className="flex-1 flex flex-col justify-between overflow-y-auto pr-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Cột 1: Thông tin cơ bản dịch vụ */}
                <div className="md:col-span-5 space-y-3.5">
                  <div className="flex items-center gap-2 pb-1 border-b border-[#F0F5FA]">
                    <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider">
                      1. Thông Tin Cơ Bản
                    </span>
                  </div>

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
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white text-xs font-bold text-[#253F5B] focus:border-[#5C84BE] outline-none transition-all cursor-pointer"
                    >
                      <option value="all">🌐 Áp dụng cho tất cả cơ sở</option>
                      {initialBuildings.map((b) => (
                        <option key={b.id} value={b.id}>
                          🏢 {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Cách tính phí</label>
                    <select
                      value={formType}
                      onChange={(e) => handleTypeChange(e.target.value as ServiceBillingType)}
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white text-xs font-bold text-[#253F5B] focus:border-[#5C84BE] outline-none transition-all cursor-pointer"
                    >
                      <option value="meter">⚡ Theo công tơ chỉ số (Điện / Nước)</option>
                      <option value="per_person">👤 Theo số người ở (Nước / Rác / Xe)</option>
                      <option value="per_vehicle">🛵 Theo số lượng xe gửi</option>
                      <option value="per_room">🏠 Theo từng phòng (Internet / Rác)</option>
                      <option value="fixed">📌 Cố định hàng tháng</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">
                        Đơn giá mặc định *
                      </label>
                      <input
                        type="text"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="3500"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold font-mono text-[#253F5B] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Đơn vị tính *</label>
                      <input
                        type="text"
                        required
                        value={formUnit}
                        onChange={(e) => setFormUnit(e.target.value)}
                        placeholder="đ/kWh"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-bold text-[#253F5B] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Ghi chú / Mô tả</label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Mô tả quy tắc chốt chỉ số hoặc thời điểm tính phí..."
                      className="w-full p-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs text-[#253F5B] transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Cột 2: Cấu hình các mức giá tùy chọn cho phòng */}
                <div className="md:col-span-7 space-y-3.5 bg-[#F9FBFE] p-4.5 rounded-2xl border border-[#E3EDF6]">
                  <div className="flex items-center justify-between pb-1 border-b border-[#E3EDF6]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#5C84BE]" />
                      <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider">
                        2. Các Mức Giá Tùy Chọn Cho Từng Phòng ({formPriceOptions.length})
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A93AD] font-medium">
                      Tick sao để làm mặc định
                    </span>
                  </div>

                  {/* Danh sách các mức giá hiện tại */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formPriceOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          opt.isDefault
                            ? "bg-amber-50/80 border-amber-300 text-amber-900 shadow-2xs"
                            : "bg-white border-[#E3EDF6] text-[#253F5B] hover:border-[#5C84BE]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleSetDefaultOption(opt.id)}
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors ${
                              opt.isDefault
                                ? "bg-amber-500 text-white"
                                : "border border-slate-300 bg-white text-slate-400 hover:border-amber-400"
                            }`}
                            title="Chọn làm giá mặc định"
                          >
                            ★
                          </button>
                          <div className="min-w-0">
                            <span className="text-xs font-black block truncate">
                              {opt.label}
                            </span>
                            <span className="text-[10px] text-[#7A93AD] font-semibold">
                              {opt.type === "meter"
                                ? "Chỉ số"
                                : opt.type === "per_person"
                                ? "Theo người"
                                : opt.type === "per_vehicle"
                                ? "Theo xe"
                                : "Theo phòng"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-mono text-xs font-black text-[#5C84BE] bg-[#EAF2F8] px-2.5 py-1 rounded-lg">
                            {opt.price.toLocaleString("vi-VN")} {opt.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePriceOption(opt.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Xóa mức giá này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form nhỏ thêm nhanh 1 mức giá */}
                  <div className="pt-2 border-t border-[#E3EDF6] space-y-2">
                    <span className="text-[11px] font-bold text-[#5C84BE] block">
                      + Thêm một mức giá mới vào dịch vụ này:
                    </span>
                    <div className="bg-white p-2.5 rounded-xl border border-[#D9E6F2] space-y-2 shadow-2xs">
                      <div className="grid grid-cols-12 gap-2">
                        <input
                          type="text"
                          placeholder="Tên gói (VD: Sinh viên, Kinh doanh...)"
                          value={newOptLabel}
                          onChange={(e) => setNewOptLabel(e.target.value)}
                          className="col-span-5 h-8 px-2.5 rounded-lg border border-[#D9E6F2] bg-[#F9FBFE] focus:bg-white focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none transition-all"
                        />
                        <input
                          type="text"
                          placeholder="Đơn giá (VD: 100000)"
                          value={newOptPrice}
                          onChange={(e) => setNewOptPrice(e.target.value)}
                          className="col-span-4 h-8 px-2.5 rounded-lg border border-[#D9E6F2] bg-[#F9FBFE] focus:bg-white focus:border-[#5C84BE] text-xs font-bold text-[#253F5B] outline-none transition-all"
                        />
                        <input
                          type="text"
                          placeholder="Đơn vị (đ/người)"
                          value={newOptUnit}
                          onChange={(e) => setNewOptUnit(e.target.value)}
                          className="col-span-3 h-8 px-2 rounded-lg border border-[#D9E6F2] bg-[#F9FBFE] focus:bg-white focus:border-[#5C84BE] text-xs font-medium text-[#253F5B] outline-none transition-all"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#7A93AD]">
                          <span className="text-[11px] font-semibold">Hình thức:</span>
                          <select
                            value={newOptType}
                            onChange={(e) =>
                              handleNewOptTypeChange(e.target.value as ServiceBillingType)
                            }
                            className="h-7 px-2 rounded-lg border border-[#D9E6F2] bg-white text-[11px] font-semibold text-[#253F5B]"
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
                          className="h-7 px-3.5 rounded-lg bg-[#253F5B] hover:bg-[#1B2F44] text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm mức này</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0F5FA] shrink-0">
                <p className="text-xs text-[#7A93AD] hidden sm:block">
                  💡 Các mức giá này sẽ hiển thị trong dropdown chọn gói giá tại trang Thêm / Sửa phòng.
                </p>
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
                    <span>{editingService ? "Lưu Thay Đổi Dịch Vụ" : "Tạo Dịch Vụ Mới"}</span>
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
