"use client";

import * as React from "react";
import {
  Wrench,
  Plus,
  Search,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Calendar,
  X,
  BadgeDollarSign,
  User,
  Zap,
  Droplets,
  Wind,
  Key,
  Bell,
  Send,
  ShieldCheck,
  CheckCheck,
  RefreshCw,
  Edit2,
  Trash2,
  Smartphone,
  Megaphone,
  FileText,
  ChevronRight,
  Flame,
  Layers,
  Sparkles,
} from "lucide-react";
import { initialBuildings } from "@/lib/mock-data/buildings";
import { initialRooms } from "@/lib/mock-data/rooms";
import {
  initialIncidents,
  initialMaintenancePlans,
} from "@/lib/mock-data/maintenance";
import type {
  IncidentReport,
  BuildingMaintenancePlan,
  IncidentCategory,
  IncidentPriority,
  IncidentStatus,
  CostBearer,
  BuildingMaintenanceCategory,
  MaintenanceScope,
  MaintenanceStatus,
} from "@/types/maintenance";
import { useSnackbar } from "@/components/common/snackbar";

export function MaintenanceView() {
  const { success, error } = useSnackbar();

  // Active Tab: "incidents" (Sự cố khách báo) | "building_plans" (Kế hoạch bảo trì tòa nhà)
  const [activeTab, setActiveTab] = React.useState<"incidents" | "building_plans">("incidents");

  // Data States
  const [incidents, setIncidents] = React.useState<IncidentReport[]>(initialIncidents);
  const [plans, setPlans] = React.useState<BuildingMaintenancePlan[]>(initialMaintenancePlans);

  // Filters
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<string>("all");
  const [incidentStatusFilter, setIncidentStatusFilter] = React.useState<string>("all");
  const [planStatusFilter, setPlanStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // -------------------------------------------------------------
  // Modals
  // -------------------------------------------------------------
  // Incident Modal (Add or Edit/Respond)
  const [showIncidentModal, setShowIncidentModal] = React.useState(false);
  const [editingIncident, setEditingIncident] = React.useState<IncidentReport | null>(null);

  const [formIncBuildingId, setFormIncBuildingId] = React.useState(initialBuildings[0]?.id || "bld-1");
  const [formIncRoom, setFormIncRoom] = React.useState("P001");
  const [formIncTenantName, setFormIncTenantName] = React.useState("Nguyễn Quý Bình");
  const [formIncTenantPhone, setFormIncTenantPhone] = React.useState("0918.137.153");
  const [formIncTitle, setFormIncTitle] = React.useState("");
  const [formIncCategory, setFormIncCategory] = React.useState<IncidentCategory>("Nước");
  const [formIncPriority, setFormIncPriority] = React.useState<IncidentPriority>("Bình thường");
  const [formIncDesc, setFormIncDesc] = React.useState("");
  const [formIncStatus, setFormIncStatus] = React.useState<IncidentStatus>("pending");
  const [formIncAssignedTo, setFormIncAssignedTo] = React.useState("Kỹ thuật viên");
  const [formIncCost, setFormIncCost] = React.useState("0");
  const [formIncCostBearer, setFormIncCostBearer] = React.useState<CostBearer>("landlord");
  const [formIncAdminReply, setFormIncAdminReply] = React.useState("");

  // Building Maintenance Plan Modal
  const [showPlanModal, setShowPlanModal] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<BuildingMaintenancePlan | null>(null);

  const [formPlanBuildingId, setFormPlanBuildingId] = React.useState(initialBuildings[0]?.id || "bld-1");
  const [formPlanTitle, setFormPlanTitle] = React.useState("");
  const [formPlanCategory, setFormPlanCategory] = React.useState<BuildingMaintenanceCategory>("Thang máy");
  const [formPlanDesc, setFormPlanDesc] = React.useState("");
  const [formPlanDate, setFormPlanDate] = React.useState("20/11/2026");
  const [formPlanStartTime, setFormPlanStartTime] = React.useState("08:30");
  const [formPlanEndTime, setFormPlanEndTime] = React.useState("11:30");
  const [formPlanScope, setFormPlanScope] = React.useState<MaintenanceScope>("all");
  const [formPlanScopeLabel, setFormPlanScopeLabel] = React.useState("Toàn bộ tòa nhà");
  const [formPlanStatus, setFormPlanStatus] = React.useState<MaintenanceStatus>("scheduled");
  const [formPlanCost, setFormPlanCost] = React.useState("2000000");
  const [formPlanContractor, setFormPlanContractor] = React.useState("");
  const [formPlanContractorPhone, setFormPlanContractorPhone] = React.useState("");
  const [formPlanNotify, setFormPlanNotify] = React.useState(true);

  // Available rooms for selected incident building
  const incidentAvailableRooms = React.useMemo(() => {
    return initialRooms.filter((r) => r.buildingId === formIncBuildingId);
  }, [formIncBuildingId]);

  // -------------------------------------------------------------
  // Filtered Lists
  // -------------------------------------------------------------
  const filteredIncidents = React.useMemo(() => {
    return incidents.filter((item) => {
      const matchBuilding = selectedBuildingId === "all" || item.buildingId === selectedBuildingId;
      const matchStatus = incidentStatusFilter === "all" || item.status === incidentStatusFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        item.title.toLowerCase().includes(q) ||
        item.roomNumber.toLowerCase().includes(q) ||
        item.tenantName.toLowerCase().includes(q) ||
        item.buildingName.toLowerCase().includes(q);
      return matchBuilding && matchStatus && matchQuery;
    });
  }, [incidents, selectedBuildingId, incidentStatusFilter, searchQuery]);

  const filteredPlans = React.useMemo(() => {
    return plans.filter((item) => {
      const matchBuilding = selectedBuildingId === "all" || item.buildingId === selectedBuildingId;
      const matchStatus = planStatusFilter === "all" || item.status === planStatusFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.buildingName.toLowerCase().includes(q);
      return matchBuilding && matchStatus && matchQuery;
    });
  }, [plans, selectedBuildingId, planStatusFilter, searchQuery]);

  // -------------------------------------------------------------
  // Open / Close Modal Handlers
  // -------------------------------------------------------------
  const openCreateIncidentModal = () => {
    setEditingIncident(null);
    setFormIncBuildingId(initialBuildings[0]?.id || "bld-1");
    setFormIncRoom("P001");
    setFormIncTenantName("Nguyễn Quý Bình");
    setFormIncTenantPhone("0918.137.153");
    setFormIncTitle("");
    setFormIncCategory("Nước");
    setFormIncPriority("Bình thường");
    setFormIncDesc("");
    setFormIncStatus("pending");
    setFormIncAssignedTo("Đang phân công");
    setFormIncCost("0");
    setFormIncCostBearer("landlord");
    setFormIncAdminReply("");
    setShowIncidentModal(true);
  };

  const openProcessIncidentModal = (inc: IncidentReport) => {
    setEditingIncident(inc);
    setFormIncBuildingId(inc.buildingId);
    setFormIncRoom(inc.roomNumber);
    setFormIncTenantName(inc.tenantName);
    setFormIncTenantPhone(inc.tenantPhone);
    setFormIncTitle(inc.title);
    setFormIncCategory(inc.category);
    setFormIncPriority(inc.priority);
    setFormIncDesc(inc.description);
    setFormIncStatus(inc.status);
    setFormIncAssignedTo(inc.assignedTo || "Kỹ thuật viên");
    setFormIncCost(inc.cost ? inc.cost.toString() : "0");
    setFormIncCostBearer(inc.costBearer || "landlord");
    setFormIncAdminReply(inc.adminReply || "");
    setShowIncidentModal(true);
  };

  const openCreatePlanModal = () => {
    setEditingPlan(null);
    setFormPlanBuildingId(initialBuildings[0]?.id || "bld-1");
    setFormPlanTitle("");
    setFormPlanCategory("Thang máy");
    setFormPlanDesc("");
    setFormPlanDate("20/11/2026");
    setFormPlanStartTime("08:30");
    setFormPlanEndTime("11:30");
    setFormPlanScope("all");
    setFormPlanScopeLabel("Toàn bộ tòa nhà");
    setFormPlanStatus("scheduled");
    setFormPlanCost("2000000");
    setFormPlanContractor("Đội kỹ thuật tòa nhà");
    setFormPlanContractorPhone("0988.112.233");
    setFormPlanNotify(true);
    setShowPlanModal(true);
  };

  const openEditPlanModal = (plan: BuildingMaintenancePlan) => {
    setEditingPlan(plan);
    setFormPlanBuildingId(plan.buildingId);
    setFormPlanTitle(plan.title);
    setFormPlanCategory(plan.category);
    setFormPlanDesc(plan.description);
    setFormPlanDate(plan.scheduledDate);
    setFormPlanStartTime(plan.startTime);
    setFormPlanEndTime(plan.endTime);
    setFormPlanScope(plan.scope);
    setFormPlanScopeLabel(plan.scopeLabel);
    setFormPlanStatus(plan.status);
    setFormPlanCost(plan.cost ? plan.cost.toString() : "0");
    setFormPlanContractor(plan.contractorName || "");
    setFormPlanContractorPhone(plan.contractorPhone || "");
    setFormPlanNotify(plan.notifyTenantAccount);
    setShowPlanModal(true);
  };

  // -------------------------------------------------------------
  // Submit Handlers
  // -------------------------------------------------------------
  const handleSaveIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIncTitle.trim()) {
      error("Vui lòng nhập tiêu đề sự cố");
      return;
    }

    const bld = initialBuildings.find((b) => b.id === formIncBuildingId);
    const parsedCost = parseInt(formIncCost.replace(/\D/g, ""), 10) || 0;

    let statusLabel = "Mới tiếp nhận";
    if (formIncStatus === "in_progress") statusLabel = "Đang sửa chữa";
    if (formIncStatus === "resolved") statusLabel = "Đã hoàn thành";
    if (formIncStatus === "cancelled") statusLabel = "Đã hủy";

    if (editingIncident) {
      setIncidents((prev) =>
        prev.map((item) =>
          item.id === editingIncident.id
            ? {
                ...item,
                buildingId: formIncBuildingId,
                buildingName: bld?.name || item.buildingName,
                roomNumber: formIncRoom,
                tenantName: formIncTenantName,
                tenantPhone: formIncTenantPhone,
                title: formIncTitle.trim(),
                category: formIncCategory,
                priority: formIncPriority,
                description: formIncDesc.trim(),
                status: formIncStatus,
                statusLabel,
                cost: parsedCost,
                costBearer: formIncCostBearer,
                adminReply: formIncAdminReply.trim() || undefined,
                assignedTo: formIncAssignedTo.trim() || undefined,
                resolvedAt: formIncStatus === "resolved" ? new Date().toLocaleDateString("vi-VN") : item.resolvedAt,
              }
            : item
        )
      );
      success(
        `Đã cập nhật sự cố phòng ${formIncRoom}! ${
          formIncAdminReply ? "Đã gửi phản hồi tới Cổng Khách Thuê." : ""
        }`
      );
    } else {
      const newInc: IncidentReport = {
        id: `SC-${String(incidents.length + 1).padStart(3, "0")}`,
        roomNumber: formIncRoom,
        buildingId: formIncBuildingId,
        buildingName: bld?.name || "HonuHome Cầu Giấy",
        tenantName: formIncTenantName,
        tenantPhone: formIncTenantPhone,
        title: formIncTitle.trim(),
        category: formIncCategory,
        description: formIncDesc.trim() || "Cần xử lý sớm",
        priority: formIncPriority,
        status: formIncStatus,
        statusLabel,
        cost: parsedCost,
        costBearer: formIncCostBearer,
        adminReply: formIncAdminReply.trim() || undefined,
        assignedTo: formIncAssignedTo.trim() || "Đang phân công",
        createdAt: new Date().toLocaleDateString("vi-VN"),
      };
      setIncidents((prev) => [newInc, ...prev]);
      success(`Đã tiếp nhận sự cố mới phòng ${formIncRoom}`);
    }

    setShowIncidentModal(false);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPlanTitle.trim()) {
      error("Vui lòng nhập tên công việc bảo trì");
      return;
    }

    const bld = initialBuildings.find((b) => b.id === formPlanBuildingId);
    const parsedCost = parseInt(formPlanCost.replace(/\D/g, ""), 10) || 0;

    let statusLabel = "Đã lên lịch";
    if (formPlanStatus === "in_progress") statusLabel = "Đang thực hiện";
    if (formPlanStatus === "completed") statusLabel = "Đã hoàn thành";
    if (formPlanStatus === "cancelled") statusLabel = "Đã hoãn";

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((item) =>
          item.id === editingPlan.id
            ? {
                ...item,
                buildingId: formPlanBuildingId,
                buildingName: bld?.name || item.buildingName,
                title: formPlanTitle.trim(),
                category: formPlanCategory,
                description: formPlanDesc.trim(),
                scheduledDate: formPlanDate,
                startTime: formPlanStartTime,
                endTime: formPlanEndTime,
                scope: formPlanScope,
                scopeLabel: formPlanScopeLabel.trim() || "Toàn bộ tòa nhà",
                status: formPlanStatus,
                statusLabel,
                cost: parsedCost,
                contractorName: formPlanContractor.trim() || undefined,
                contractorPhone: formPlanContractorPhone.trim() || undefined,
                notifyTenantAccount: formPlanNotify,
              }
            : item
        )
      );
      success("Đã cập nhật kế hoạch bảo trì tòa nhà!");
    } else {
      const newPlan: BuildingMaintenancePlan = {
        id: `BT-${String(plans.length + 101).padStart(3, "0")}`,
        buildingId: formPlanBuildingId,
        buildingName: bld?.name || "HonuHome Cầu Giấy",
        title: formPlanTitle.trim(),
        category: formPlanCategory,
        description: formPlanDesc.trim() || "Bảo dưỡng định kỳ",
        scheduledDate: formPlanDate,
        startTime: formPlanStartTime,
        endTime: formPlanEndTime,
        scope: formPlanScope,
        scopeLabel: formPlanScopeLabel.trim() || "Toàn bộ tòa nhà",
        status: formPlanStatus,
        statusLabel,
        cost: parsedCost,
        contractorName: formPlanContractor.trim() || undefined,
        contractorPhone: formPlanContractorPhone.trim() || undefined,
        notifyTenantAccount: formPlanNotify,
        notificationSentAt: formPlanNotify
          ? `${new Date().toLocaleDateString("vi-VN")} ${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
          : undefined,
        createdAt: new Date().toLocaleDateString("vi-VN"),
      };
      setPlans((prev) => [newPlan, ...prev]);
      success(
        `Đã tạo kế hoạch bảo trì! ${
          formPlanNotify ? "Đã tự động gửi thông báo tới tài khoản khách thuê." : ""
        }`
      );
    }

    setShowPlanModal(false);
  };

  const handleBroadcastNotification = (planId: string, title: string) => {
    const timeStr = `${new Date().toLocaleDateString("vi-VN")} ${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? { ...p, notifyTenantAccount: true, notificationSentAt: timeStr }
          : p
      )
    );
    success(`Đã phát thông báo bảo trì "${title}" tới tất cả tài khoản cư dân!`);
  };

  const handleQuickResolveIncident = (id: string, room: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              status: "resolved",
              statusLabel: "Đã hoàn thành",
              resolvedAt: new Date().toLocaleDateString("vi-VN"),
            }
          : inc
      )
    );
    success(`Đã đánh dấu hoàn thành sự cố phòng ${room}!`);
  };

  const handleDeleteIncident = (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa phiếu sự cố "${title}"?`)) {
      setIncidents((prev) => prev.filter((i) => i.id !== id));
      success("Đã xóa phiếu sự cố");
    }
  };

  const handleDeletePlan = (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa kế hoạch bảo trì "${title}"?`)) {
      setPlans((prev) => prev.filter((p) => p.id !== id));
      success("Đã xóa kế hoạch bảo trì");
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* 1. Header with Tab Switcher & Dynamic Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-7 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-inner">
            <Wrench className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Sự Cố & Kế Hoạch Bảo Trì
              </h1>
              <span className="text-xs font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full border border-[#D8E6F3]">
                {activeTab === "incidents" ? `${incidents.length} sự cố` : `${plans.length} lịch bảo trì`}
              </span>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              {activeTab === "incidents"
                ? "Tiếp nhận phản ánh hỏng hóc từ khách thuê, gửi tin phản hồi & phân bổ chi phí sửa chữa"
                : "Lên lịch bảo dưỡng hạ tầng tòa nhà (Thang máy, PCCC, Bể nước) & phát thông báo tới tài khoản khách"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          {activeTab === "incidents" ? (
            <button
              type="button"
              onClick={openCreateIncidentModal}
              className="h-11 px-5 rounded-2xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tiếp Nhận Sự Cố</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreatePlanModal}
              className="h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Lên Kế Hoạch Bảo Trì</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Dual Tabs Navigation */}
      <div className="flex border-b border-[#E3EDF6] bg-white rounded-2xl px-3 pt-2 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("incidents")}
          className={`flex items-center gap-2.5 px-5 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer ${
            activeTab === "incidents"
              ? "border-[#5C84BE] text-[#5C84BE] bg-[#F4F8FC] rounded-t-xl"
              : "border-transparent text-[#7A93AD] hover:text-[#253F5B]"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Sự Cố Khách Báo (Cần Sửa)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
            {incidents.filter((i) => i.status !== "resolved").length} đang chờ
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("building_plans")}
          className={`flex items-center gap-2.5 px-5 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer ${
            activeTab === "building_plans"
              ? "border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-xl"
              : "border-transparent text-[#7A93AD] hover:text-[#253F5B]"
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Kế Hoạch Bảo Trì Tòa Nhà</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
            {plans.filter((p) => p.status === "scheduled").length} sắp tới
          </span>
        </button>
      </div>

      {/* 3. Filter Bar & Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Status Buttons */}
          {activeTab === "incidents" ? (
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F6F9FD] p-1.5 rounded-2xl border border-[#E2EEF8]">
              {[
                { key: "all", label: "Tất cả" },
                { key: "pending", label: "Mới tiếp nhận" },
                { key: "in_progress", label: "Đang sửa chữa" },
                { key: "resolved", label: "Đã hoàn thành" },
              ].map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setIncidentStatusFilter(st.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    incidentStatusFilter === st.key
                      ? "bg-[#253F5B] text-white shadow-xs"
                      : "text-[#526579] hover:bg-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F6F9FD] p-1.5 rounded-2xl border border-[#E2EEF8]">
              {[
                { key: "all", label: "Tất cả" },
                { key: "scheduled", label: "Đã lên lịch" },
                { key: "in_progress", label: "Đang thực hiện" },
                { key: "completed", label: "Đã hoàn thành" },
              ].map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setPlanStatusFilter(st.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    planStatusFilter === st.key
                      ? "bg-[#253F5B] text-white shadow-xs"
                      : "text-[#526579] hover:bg-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          )}

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#7A93AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "incidents"
                  ? "Tìm phòng, người báo, sự cố..."
                  : "Tìm hạng mục, thang máy, PCCC..."
              }
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
            className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
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
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
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

      {/* 4. TAB 1: INCIDENTS VIEW (Sự cố khách báo) */}
      {activeTab === "incidents" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIncidents.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#E3EDF6] text-slate-400">
                <AlertTriangle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold">Không tìm thấy sự cố nào phù hợp</p>
              </div>
            ) : (
              filteredIncidents.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl border border-[#E3EDF6] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-2.5 py-1 rounded-lg text-xs">
                          Phòng {t.roomNumber}
                        </span>
                        <span className="text-[11px] text-[#7A93AD] font-semibold truncate max-w-[120px]">
                          {t.buildingName}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                          t.priority === "Khẩn cấp"
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : t.priority === "Cao"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#7A93AD] mb-1">
                        <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {t.id}
                        </span>
                        <span>• {t.category}</span>
                      </div>
                      <h3 className="text-base font-black text-[#253F5B] leading-snug">
                        {t.title}
                      </h3>
                      <p className="text-xs text-[#526579] mt-1.5 line-clamp-2">
                        {t.description}
                      </p>
                    </div>

                    {/* Detailed info card */}
                    <div className="p-3 rounded-2xl bg-[#F8FBFE] border border-[#EAF2F8] text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[#7A93AD]">
                        <span>Khách báo:</span>
                        <span className="font-bold text-[#253F5B] flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.tenantName}</span>
                          <a
                            href={`tel:${t.tenantPhone}`}
                            className="text-emerald-600 hover:underline text-[11px]"
                          >
                            ({t.tenantPhone})
                          </a>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#7A93AD]">
                        <span>Thợ / Kỹ thuật:</span>
                        <span className="font-semibold text-[#5C84BE]">{t.assignedTo || "Chưa phân công"}</span>
                      </div>

                      {/* Chi phí & Người chịu chi phí */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#EDF4FA]">
                        <span className="text-[#7A93AD]">Chi phí sửa:</span>
                        <div className="text-right">
                          <strong className="text-rose-600 font-extrabold">
                            {(t.cost || 0).toLocaleString("vi-VN")} đ
                          </strong>
                          <span
                            className={`block text-[10px] font-bold ${
                              t.costBearer === "tenant" ? "text-amber-700" : "text-emerald-700"
                            }`}
                          >
                            {t.costBearer === "tenant" ? "👉 Cộng hóa đơn phòng" : "🛡️ Chủ nhà chịu"}
                          </span>
                        </div>
                      </div>

                      {/* Phản hồi tới Cổng Khách */}
                      {t.adminReply && (
                        <div className="pt-1.5 border-t border-[#EDF4FA]">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700">
                            <Send className="w-3 h-3 text-indigo-500" />
                            <span>Đã nhắn tới Cổng Khách:</span>
                          </div>
                          <p className="text-[11px] text-[#526579] italic mt-0.5 bg-white p-2 rounded-xl border border-indigo-100">
                            &quot;{t.adminReply}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-between">
                    <span className="text-[11px] text-[#7A93AD]">{t.createdAt}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openProcessIncidentModal(t)}
                        className="px-3 py-1.5 rounded-xl bg-[#5C84BE] text-white hover:bg-[#4A72AC] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        title="Xử lý, nhắn tin phản hồi & ghi nhận chi phí"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Xử lý & Phản hồi</span>
                      </button>

                      {t.status !== "resolved" && (
                        <button
                          type="button"
                          onClick={() => handleQuickResolveIncident(t.id, t.roomNumber)}
                          className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                          title="Hoàn thành nhanh"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteIncident(t.id, t.title)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa sự cố"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 2: BUILDING MAINTENANCE PLANS VIEW (Kế hoạch bảo trì tòa nhà) */}
      {activeTab === "building_plans" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPlans.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#E3EDF6] text-slate-400">
                <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold">Không tìm thấy kế hoạch bảo trì nào</p>
              </div>
            ) : (
              filteredPlans.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-[#E3EDF6] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg text-xs">
                          {p.id}
                        </span>
                        <span className="text-xs font-bold text-[#253F5B]">
                          {p.buildingName}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                          p.status === "completed"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : p.status === "in_progress"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {p.statusLabel}
                      </span>
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#EAF2F8] text-[#5C84BE] mb-1.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Hạng mục: {p.category}</span>
                      </div>
                      <h3 className="text-base font-black text-[#253F5B] leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs text-[#526579] mt-1.5">
                        {p.description}
                      </p>
                    </div>

                    {/* Schedule Time & Scope */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FBFE] border border-[#EAF2F8] text-xs space-y-2">
                      <div className="flex items-center justify-between text-[#7A93AD]">
                        <span className="flex items-center gap-1.5 font-bold text-[#253F5B]">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <span>Ngày: {p.scheduledDate}</span>
                        </span>
                        <span className="flex items-center gap-1 font-bold text-[#5C84BE]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{p.startTime} - {p.endTime}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#7A93AD] pt-1.5 border-t border-[#EDF4FA]">
                        <span>Phạm vi ảnh hưởng:</span>
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                          {p.scopeLabel}
                        </span>
                      </div>

                      {p.contractorName && (
                        <div className="flex items-center justify-between text-[#7A93AD]">
                          <span>Đơn vị thi công:</span>
                          <span className="font-semibold text-[#253F5B]">
                            {p.contractorName} {p.contractorPhone && `(${p.contractorPhone})`}
                          </span>
                        </div>
                      )}

                      {p.cost && (
                        <div className="flex items-center justify-between text-[#7A93AD]">
                          <span>Dự toán kinh phí:</span>
                          <strong className="text-indigo-700 font-bold">
                            {p.cost.toLocaleString("vi-VN")} đ
                          </strong>
                        </div>
                      )}

                      {/* Tenant Notification Broadcast Status */}
                      <div className="pt-2 border-t border-[#EDF4FA] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="text-[11px] font-bold text-emerald-700">
                              {p.notifyTenantAccount ? "Đã gửi thông báo tới cư dân" : "Chưa gửi thông báo"}
                            </div>
                            {p.notificationSentAt && (
                              <div className="text-[10px] text-[#7A93AD]">
                                Gửi lúc: {p.notificationSentAt}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBroadcastNotification(p.id, p.title)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="Gửi lại thông báo đẩy tới tài khoản web/app của khách thuê"
                        >
                          <Megaphone className="w-3 h-3 text-emerald-600" />
                          <span>Phát loa TB</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Plan Actions */}
                  <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-between">
                    <span className="text-[11px] text-[#7A93AD]">Tạo ngày: {p.createdAt}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditPlanModal(p)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-[#253F5B] hover:bg-indigo-50 hover:text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlan(p.id, p.title)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa kế hoạch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 1: XỬ LÝ & TIẾP NHẬN SỰ CỐ KHÁCH BÁO (Wide 2-Column - No Scroll) */}
      {/* ============================================================= */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-4xl lg:max-w-5xl max-h-[94vh] flex flex-col p-6 sm:p-7 space-y-4 animate-scaleUp overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    {editingIncident ? `Xử Lý Sự Cố Khách Báo (${editingIncident.id})` : "Tiếp Nhận Sự Cố Khách Báo Mới"}
                  </h3>
                  <p className="text-xs text-[#7A93AD]">
                    Điều phối thợ, cập nhật trạng thái, phân bổ chi phí và nhắn tin phản hồi tới Cổng Khách Thuê
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIncidentModal(false)}
                className="w-9 h-9 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIncident} className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Cột 1: Thông tin phòng & Sự cố do khách báo */}
                <div className="md:col-span-6 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    1. Chi Tiết Sự Cố & Phòng Báo
                  </span>

                  {/* Tòa nhà & Chọn phòng */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Tòa nhà / Cơ sở *</label>
                      <select
                        value={formIncBuildingId}
                        onChange={(e) => {
                          setFormIncBuildingId(e.target.value);
                          const firstRoom = initialRooms.find((r) => r.buildingId === e.target.value);
                          if (firstRoom) setFormIncRoom(firstRoom.roomNumber);
                        }}
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
                      <label className="text-xs font-bold text-[#253F5B]">Phòng gặp sự cố *</label>
                      <select
                        value={formIncRoom}
                        onChange={(e) => setFormIncRoom(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-black text-[#5C84BE]"
                      >
                        {incidentAvailableRooms.map((r) => (
                          <option key={r.id} value={r.roomNumber}>
                            Phòng {r.roomNumber} ({r.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Người báo & SĐT */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Người báo cáo *</label>
                      <input
                        type="text"
                        required
                        value={formIncTenantName}
                        onChange={(e) => setFormIncTenantName(e.target.value)}
                        placeholder="Nguyễn Quý Bình"
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-semibold text-[#253F5B]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Số điện thoại</label>
                      <input
                        type="text"
                        value={formIncTenantPhone}
                        onChange={(e) => setFormIncTenantPhone(e.target.value)}
                        placeholder="0918.137.153"
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-mono text-[#253F5B]"
                      />
                    </div>
                  </div>

                  {/* Danh mục & Mức độ ưu tiên */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Danh mục thiết bị</label>
                      <select
                        value={formIncCategory}
                        onChange={(e) => setFormIncCategory(e.target.value as IncidentCategory)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white font-semibold text-xs text-[#253F5B]"
                      >
                        <option value="Nước">Đường nước / Vòi sen / Bồn cầu</option>
                        <option value="Điện">Hệ thống điện / Đèn / Ổ cắm</option>
                        <option value="Điều hòa">Điều hòa / Bình nóng lạnh</option>
                        <option value="Khóa cửa / Thẻ từ">Khóa cửa / Thẻ thang máy</option>
                        <option value="Khác">Thiết bị nội thất khác</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Mức độ ưu tiên</label>
                      <select
                        value={formIncPriority}
                        onChange={(e) => setFormIncPriority(e.target.value as IncidentPriority)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white font-bold text-xs text-[#253F5B]"
                      >
                        <option value="Bình thường">Bình thường</option>
                        <option value="Cao">Cao (Ảnh hưởng sinh hoạt)</option>
                        <option value="Khẩn cấp">Khẩn cấp (Cháy/Chập/Ngập nước)</option>
                      </select>
                    </div>
                  </div>

                  {/* Tiêu đề & Mô tả chi tiết */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Tiêu đề sự cố *</label>
                    <input
                      type="text"
                      required
                      value={formIncTitle}
                      onChange={(e) => setFormIncTitle(e.target.value)}
                      placeholder="Ví dụ: Vòi sen tắm rò rỉ nước liên tục..."
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-bold text-[#253F5B]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Mô tả chi tiết hiện trạng</label>
                    <textarea
                      rows={2}
                      value={formIncDesc}
                      onChange={(e) => setFormIncDesc(e.target.value)}
                      placeholder="Mô tả cụ thể triệu chứng hỏng hóc để kỹ thuật chuẩn bị linh kiện..."
                      className="w-full p-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs text-[#253F5B] resize-none"
                    />
                  </div>
                </div>

                {/* Cột 2: Điều phối, Trạng thái, Phân bổ chi phí & Tin nhắn phản hồi */}
                <div className="md:col-span-6 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    2. Xử Lý, Phân Bổ Chi Phí & Phản Hồi Khách
                  </span>

                  {/* Trạng thái & Thợ kỹ thuật phụ trách */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Trạng thái xử lý</label>
                      <select
                        value={formIncStatus}
                        onChange={(e) => setFormIncStatus(e.target.value as IncidentStatus)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white font-bold text-xs text-[#253F5B]"
                      >
                        <option value="pending">Mới tiếp nhận</option>
                        <option value="in_progress">Đang sửa chữa</option>
                        <option value="resolved">Đã hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Thợ kỹ thuật phụ trách</label>
                      <input
                        type="text"
                        value={formIncAssignedTo}
                        onChange={(e) => setFormIncAssignedTo(e.target.value)}
                        placeholder="Kỹ thuật Tuấn / Đội điện lạnh..."
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-semibold text-[#253F5B]"
                      />
                    </div>
                  </div>

                  {/* Chi phí sửa chữa & Ai chịu chi phí */}
                  <div className="space-y-2 p-3 rounded-2xl bg-[#F8FBFE] border border-[#EAF2F8]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#253F5B]">Chi phí sửa chữa (VNĐ)</label>
                      <input
                        type="text"
                        value={formIncCost}
                        onChange={(e) => setFormIncCost(e.target.value)}
                        placeholder="0"
                        className="w-36 h-9 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-extrabold text-rose-600 text-right font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#EDF4FA]">
                      <label className="text-xs font-bold text-[#253F5B] block">Người chịu chi phí:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormIncCostBearer("landlord")}
                          className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                            formIncCostBearer === "landlord"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                              : "bg-white border-[#D9E6F2] text-[#526579] hover:bg-slate-50"
                          }`}
                        >
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Chủ nhà chịu</span>
                          </div>
                          <span className="text-[10px] text-[#7A93AD] block mt-0.5">
                            Khấu hao tự nhiên / Thiết bị tòa nhà
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormIncCostBearer("tenant")}
                          className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                            formIncCostBearer === "tenant"
                              ? "bg-amber-50 border-amber-300 text-amber-800 shadow-xs"
                              : "bg-white border-[#D9E6F2] text-[#526579] hover:bg-slate-50"
                          }`}
                        >
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            <BadgeDollarSign className="w-3.5 h-3.5 text-amber-600" />
                            <span>Cộng vào hóa đơn phòng</span>
                          </div>
                          <span className="text-[10px] text-[#7A93AD] block mt-0.5">
                            Khách làm rơi hỏng / Mất thẻ từ
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tin nhắn phản hồi gửi Cổng Khách Thuê */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                        <Send className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Tin nhắn phản hồi tới Cổng Khách Thuê</span>
                      </label>
                      <span className="text-[10px] text-[#7A93AD]">Khách sẽ đọc được trên app/web</span>
                    </div>
                    <textarea
                      rows={3}
                      value={formIncAdminReply}
                      onChange={(e) => setFormIncAdminReply(e.target.value)}
                      placeholder="Ví dụ: BQL đã cử kỹ thuật Tuấn qua xử lý lúc 14h chiều nay, bạn chú ý có người ở phòng nhé..."
                      className="w-full p-3 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:bg-white bg-indigo-50/20 outline-none text-xs text-[#253F5B] transition-all resize-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0F5FA] shrink-0">
                <span className="text-xs text-[#7A93AD] hidden sm:block">
                  💡 Tin nhắn phản hồi sẽ hiển thị trực tiếp khi khách thuê đăng nhập tài khoản.
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowIncidentModal(false)}
                    className="h-10 px-5 rounded-xl text-xs font-bold text-[#526579] hover:bg-[#F0F5FA] cursor-pointer transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingIncident ? "Lưu Thay Đổi & Gửi Phản Hồi" : "Lưu Sự Cố"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 2: LÊN KẾ HOẠCH BẢO TRÌ TÒA NHÀ (Wide 2-Column - No Scroll) */}
      {/* ============================================================= */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-4xl lg:max-w-5xl max-h-[94vh] flex flex-col p-6 sm:p-7 space-y-4 animate-scaleUp overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#253F5B]">
                    {editingPlan ? "Chỉnh Sửa Lịch Bảo Trì Tòa Nhà" : "Lên Kế Hoạch Bảo Trì Tòa Nhà Mới"}
                  </h3>
                  <p className="text-xs text-[#7A93AD]">
                    Bảo dưỡng thang máy, máy bơm nước ngầm, PCCC và phát thông báo vào tài khoản khách thuê
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="w-9 h-9 rounded-xl bg-[#F0F5FA] text-[#7A93AD] hover:text-[#253F5B] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Cột 1: Hạng mục & Thời gian thực hiện */}
                <div className="md:col-span-6 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    1. Hạng Mục & Lịch Thi Công
                  </span>

                  {/* Tòa nhà & Hạng mục */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Tòa nhà / Cơ sở *</label>
                      <select
                        value={formPlanBuildingId}
                        onChange={(e) => setFormPlanBuildingId(e.target.value)}
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
                      <label className="text-xs font-bold text-[#253F5B]">Hạng mục bảo trì *</label>
                      <select
                        value={formPlanCategory}
                        onChange={(e) => setFormPlanCategory(e.target.value as BuildingMaintenanceCategory)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white font-bold text-xs text-[#253F5B]"
                      >
                        <option value="Thang máy">Thang máy tòa nhà</option>
                        <option value="Bể nước ngầm & Máy bơm">Bể nước ngầm & Máy bơm</option>
                        <option value="Hệ thống PCCC">Hệ thống chuông/bình PCCC</option>
                        <option value="Điện tổng & Máy phát">Điện tổng & Máy phát dự phòng</option>
                        <option value="Điều hòa tòa nhà">Dàn nóng điều hòa tòa nhà</option>
                        <option value="Vệ sinh & Diệt côn trùng">Vệ sinh & Diệt côn trùng định kỳ</option>
                        <option value="Khác">Hạ tầng khác</option>
                      </select>
                    </div>
                  </div>

                  {/* Tiêu đề kế hoạch */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Tiêu đề thông báo bảo trì *</label>
                    <input
                      type="text"
                      required
                      value={formPlanTitle}
                      onChange={(e) => setFormPlanTitle(e.target.value)}
                      placeholder="Ví dụ: Bảo dưỡng định kỳ thang máy trục đôi..."
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-bold text-[#253F5B]"
                    />
                  </div>

                  {/* Ngày & Khung giờ thi công */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Ngày thi công</label>
                      <input
                        type="text"
                        value={formPlanDate}
                        onChange={(e) => setFormPlanDate(e.target.value)}
                        placeholder="20/11/2026"
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white text-xs font-semibold text-[#253F5B]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Từ giờ</label>
                      <input
                        type="text"
                        value={formPlanStartTime}
                        onChange={(e) => setFormPlanStartTime(e.target.value)}
                        placeholder="08:30"
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white text-xs font-semibold text-[#253F5B]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Đến giờ</label>
                      <input
                        type="text"
                        value={formPlanEndTime}
                        onChange={(e) => setFormPlanEndTime(e.target.value)}
                        placeholder="11:30"
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white text-xs font-semibold text-[#253F5B]"
                      />
                    </div>
                  </div>

                  {/* Mô tả chi tiết */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Nội dung công việc & lưu ý cư dân</label>
                    <textarea
                      rows={3}
                      value={formPlanDesc}
                      onChange={(e) => setFormPlanDesc(e.target.value)}
                      placeholder="Ghi rõ ảnh hưởng sinh hoạt (ngắt thang máy tạm thời, cắt nước trong buổi sáng, thử còi báo động...)"
                      className="w-full p-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs text-[#253F5B] resize-none"
                    />
                  </div>
                </div>

                {/* Cột 2: Phạm vi ảnh hưởng, Nhà thầu & Thông báo cổng khách */}
                <div className="md:col-span-6 space-y-3.5">
                  <span className="text-xs font-black text-[#253F5B] uppercase tracking-wider block pb-1 border-b border-[#F0F5FA]">
                    2. Phạm Vi Ảnh Hưởng & Phát Thông Báo
                  </span>

                  {/* Phạm vi ảnh hưởng */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Phạm vi ảnh hưởng cư dân</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormPlanScope("all");
                          setFormPlanScopeLabel("Toàn bộ tòa nhà");
                        }}
                        className={`p-2 rounded-xl text-center border text-xs font-bold cursor-pointer transition-all ${
                          formPlanScope === "all"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-white border-[#D9E6F2] text-[#526579] hover:bg-slate-50"
                        }`}
                      >
                        Toàn tòa nhà
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormPlanScope("floors");
                          setFormPlanScopeLabel("Khu vực Tầng 3 và Tầng 4");
                        }}
                        className={`p-2 rounded-xl text-center border text-xs font-bold cursor-pointer transition-all ${
                          formPlanScope === "floors"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-white border-[#D9E6F2] text-[#526579] hover:bg-slate-50"
                        }`}
                      >
                        Theo tầng
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormPlanScope("rooms");
                          setFormPlanScopeLabel("Các phòng trục chẵn");
                        }}
                        className={`p-2 rounded-xl text-center border text-xs font-bold cursor-pointer transition-all ${
                          formPlanScope === "rooms"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-white border-[#D9E6F2] text-[#526579] hover:bg-slate-50"
                        }`}
                      >
                        Cụ thể phòng
                      </button>
                    </div>
                  </div>

                  {/* Tên phạm vi hiển thị */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#253F5B]">Ghi chú phạm vi hiển thị</label>
                    <input
                      type="text"
                      value={formPlanScopeLabel}
                      onChange={(e) => setFormPlanScopeLabel(e.target.value)}
                      placeholder="Toàn bộ tòa nhà (Thang máy tạm dừng)"
                      className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] bg-white outline-none text-xs font-medium text-[#253F5B]"
                    />
                  </div>

                  {/* Đơn vị thi công & Kinh phí */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Đơn vị / Thợ kỹ thuật</label>
                      <input
                        type="text"
                        value={formPlanContractor}
                        onChange={(e) => setFormPlanContractor(e.target.value)}
                        placeholder="Công ty Thang máy..."
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white outline-none text-xs font-medium text-[#253F5B]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#253F5B]">Dự toán chi phí (đ)</label>
                      <input
                        type="text"
                        value={formPlanCost}
                        onChange={(e) => setFormPlanCost(e.target.value)}
                        placeholder="2000000"
                        className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white outline-none text-xs font-mono font-bold text-indigo-700"
                      />
                    </div>
                  </div>

                  {/* Tự động gửi thông báo tới tài khoản khách thuê */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-sky-50/80 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#253F5B]">
                            Tự Động Phát Thông Báo Cư Dân
                          </div>
                          <div className="text-[11px] text-[#7A93AD]">
                            Gửi trực tiếp vào tài khoản web của toàn bộ phòng bị ảnh hưởng
                          </div>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formPlanNotify}
                          onChange={(e) => setFormPlanNotify(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    {formPlanNotify && (
                      <p className="text-[11px] text-emerald-800 bg-white/70 p-2 rounded-xl border border-emerald-100 font-medium">
                        🔔 Hệ thống sẽ tự động ghim thông báo bảo trì lên trang chủ Cổng Khách Thuê trước ngày thi công 3 ngày.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0F5FA] shrink-0">
                <span className="text-xs text-[#7A93AD] hidden sm:block">
                  💡 Kế hoạch bảo trì giúp cư dân chủ động sắp xếp thời gian sinh hoạt.
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="h-10 px-5 rounded-xl text-xs font-bold text-[#526579] hover:bg-[#F0F5FA] cursor-pointer transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingPlan ? "Lưu Thay Đổi" : "Lưu & Phát Lịch Bảo Trì"}</span>
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
