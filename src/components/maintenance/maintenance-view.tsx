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
} from "lucide-react";
import { initialBuildings } from "@/lib/mock-data/buildings";
import { useSnackbar } from "@/components/common/snackbar";

interface MaintenanceTicket {
  id: string;
  roomNumber: string;
  buildingName: string;
  tenantName: string;
  tenantPhone: string;
  title: string;
  category: "Điện" | "Nước" | "Điều hòa" | "Khóa cửa / Thẻ từ" | "Khác";
  description: string;
  priority: "Khẩn cấp" | "Cao" | "Bình thường";
  status: "pending" | "in_progress" | "resolved";
  statusLabel: string;
  cost?: number;
  createdAt: string;
  assignedTo?: string;
}

const mockTickets: MaintenanceTicket[] = [
  {
    id: "SC-001",
    roomNumber: "P001",
    buildingName: "HonuHome Cầu Giấy",
    tenantName: "Quý Bình",
    tenantPhone: "0918.137.153",
    title: "Vòi sen tắm rò rỉ nước",
    category: "Nước",
    description: "Vòi sen tắm nhà vệ sinh bị rỉ nước liên tục gây thất thoát nước.",
    priority: "Bình thường",
    status: "in_progress",
    statusLabel: "Đang sửa chữa",
    cost: 120000,
    createdAt: "14/11/2026",
    assignedTo: "Kỹ thuật Tuấn",
  },
  {
    id: "SC-002",
    roomNumber: "P091",
    buildingName: "HonuHome Cầu Giấy",
    tenantName: "Bùi Thị Mai",
    tenantPhone: "0981.445.678",
    title: "Điều hòa không mát, chảy nước nhẹ",
    category: "Điều hòa",
    description: "Bật 22 độ nhưng gió phả ra không mát, cần bảo dưỡng nạp gas.",
    priority: "Cao",
    status: "pending",
    statusLabel: "Mới tiếp nhận",
    createdAt: "15/11/2026",
    assignedTo: "Chưa phân công",
  },
  {
    id: "SC-003",
    roomNumber: "P044",
    buildingName: "HonuHome Cầu Giấy",
    tenantName: "Hoàng Anh Tuấn",
    tenantPhone: "0942.333.112",
    title: "Thẻ từ thang máy bị kén",
    category: "Khóa cửa / Thẻ từ",
    description: "Thẻ từ quẹt tầng 4 lúc nhận lúc không, xin cấp lại thẻ mới.",
    priority: "Bình thường",
    status: "resolved",
    statusLabel: "Đã hoàn thành",
    cost: 50000,
    createdAt: "10/11/2026",
    assignedTo: "Bảo vệ Nam",
  },
];

export function MaintenanceView() {
  const { success, error } = useSnackbar();
  const [tickets, setTickets] = React.useState<MaintenanceTicket[]>(mockTickets);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal
  const [showModal, setShowModal] = React.useState(false);
  const [formRoom, setFormRoom] = React.useState("P001");
  const [formTitle, setFormTitle] = React.useState("");
  const [formCategory, setFormCategory] = React.useState<MaintenanceTicket["category"]>("Điện");
  const [formPriority, setFormPriority] = React.useState<MaintenanceTicket["priority"]>("Bình thường");
  const [formDesc, setFormDesc] = React.useState("");

  const filteredTickets = React.useMemo(() => {
    return tickets.filter((t) => {
      const matchStatus = selectedStatus === "all" || t.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        t.title.toLowerCase().includes(q) ||
        t.roomNumber.toLowerCase().includes(q) ||
        t.tenantName.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [tickets, selectedStatus, searchQuery]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      error("Vui lòng nhập tiêu đề sự cố");
      return;
    }

    const newTicket: MaintenanceTicket = {
      id: `SC-00${tickets.length + 1}`,
      roomNumber: formRoom.trim().toUpperCase(),
      buildingName: "HonuHome Cầu Giấy",
      tenantName: "Khách thuê phòng",
      tenantPhone: "0912.345.678",
      title: formTitle.trim(),
      category: formCategory,
      description: formDesc.trim() || "Cần xử lý sớm",
      priority: formPriority,
      status: "pending",
      statusLabel: "Mới tiếp nhận",
      createdAt: new Date().toLocaleDateString("vi-VN"),
      assignedTo: "Đang điều phối",
    };

    setTickets((prev) => [newTicket, ...prev]);
    success(`Đã tiếp nhận yêu cầu bảo trì phòng ${newTicket.roomNumber}!`);
    setShowModal(false);
    setFormTitle("");
    setFormDesc("");
  };

  const handleResolve = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "resolved", statusLabel: "Đã hoàn thành" } : t
      )
    );
    success("Đã hoàn thành xử lý sự cố!");
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-inner">
            <Wrench className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Sự Cố & Lịch Bảo Trì Căn Hộ
              </h1>
              <span className="text-xs font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full border border-[#D8E6F3]">
                {tickets.length} sự cố
              </span>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Tiếp nhận phản ánh từ khách thuê, điều phối kỹ thuật và theo dõi chi phí sửa chữa
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="h-11 px-5 rounded-2xl bg-[#5C84BE] hover:bg-[#4A72AC] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Báo Sự Cố Mới</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E3EDF6] shadow-sm">
        <div className="flex items-center gap-2 bg-[#F6F9FD] p-1.5 rounded-2xl border border-[#E2EEF8] w-full sm:w-auto">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Mới tiếp nhận" },
            { key: "in_progress", label: "Đang xử lý" },
            { key: "resolved", label: "Đã hoàn thành" },
          ].map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setSelectedStatus(st.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === st.key
                  ? "bg-[#253F5B] text-white shadow-sm"
                  : "text-[#526579] hover:bg-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#7A93AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo phòng, sự cố, khách..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#D9E6F2] focus:border-[#5C84BE] focus:bg-white bg-[#F9FBFE] outline-none text-xs font-medium text-[#253F5B] transition-all"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTickets.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl border border-[#E3EDF6] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="font-black text-[#5C84BE] bg-[#EAF2F8] px-2.5 py-1 rounded-lg text-xs">
                  Phòng {t.roomNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    t.priority === "Khẩn cấp"
                      ? "bg-rose-100 text-rose-700"
                      : t.priority === "Cao"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {t.priority}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-[#253F5B] leading-snug">
                  {t.title}
                </h3>
                <p className="text-xs text-[#526579] mt-1.5 line-clamp-2">
                  {t.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8FBFE] border border-[#EAF2F8] text-xs space-y-1">
                <div className="flex items-center justify-between text-[#7A93AD]">
                  <span>Khách báo:</span>
                  <strong className="text-[#253F5B]">{t.tenantName}</strong>
                </div>
                <div className="flex items-center justify-between text-[#7A93AD]">
                  <span>Phụ trách:</span>
                  <span className="font-semibold text-[#5C84BE]">{t.assignedTo}</span>
                </div>
                {t.cost && (
                  <div className="flex items-center justify-between text-[#7A93AD]">
                    <span>Chi phí:</span>
                    <strong className="text-rose-600">
                      {t.cost.toLocaleString("vi-VN")} đ
                    </strong>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-between">
              <span className="text-[11px] text-[#7A93AD]">{t.createdAt}</span>
              {t.status !== "resolved" ? (
                <button
                  type="button"
                  onClick={() => handleResolve(t.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Xong</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã xử lý</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal báo sự cố */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E3EDF6] shadow-2xl w-full max-w-md p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
              <h3 className="text-base font-black text-[#253F5B]">Tiếp Nhận Sự Cố Mới</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl bg-[#F0F5FA] text-[#7A93AD] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#253F5B] block mb-1">Phòng gặp sự cố *</label>
                <input
                  type="text"
                  required
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  placeholder="P001"
                  className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#253F5B] block mb-1">Loại thiết bị</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-[#D9E6F2] bg-white font-semibold"
                >
                  <option value="Điện">Hệ thống điện / Đèn / Ổ cắm</option>
                  <option value="Nước">Đường nước / Vòi sen / Bồn cầu</option>
                  <option value="Điều hòa">Điều hòa / Bình nóng lạnh</option>
                  <option value="Khóa cửa / Thẻ từ">Khóa cửa / Thẻ thang máy</option>
                  <option value="Khác">Thiết bị nội thất khác</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#253F5B] block mb-1">Mô tả sự cố *</label>
                <textarea
                  rows={3}
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Vòi nước bồn rửa mặt bị rỉ nước liên tục..."
                  className="w-full p-3 rounded-xl border border-[#D9E6F2] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5C84BE] text-white font-bold"
                >
                  Gửi Yêu Cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
