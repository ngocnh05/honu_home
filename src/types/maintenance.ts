export type IncidentCategory =
  | "Điện"
  | "Nước"
  | "Điều hòa"
  | "Khóa cửa / Thẻ từ"
  | "Khác";

export type IncidentPriority = "Khẩn cấp" | "Cao" | "Bình thường";

export type IncidentStatus = "pending" | "in_progress" | "resolved" | "cancelled";

export type CostBearer = "landlord" | "tenant";

export interface IncidentReport {
  id: string;
  roomNumber: string;
  buildingId: string;
  buildingName: string;
  tenantName: string;
  tenantPhone: string;
  title: string;
  category: IncidentCategory;
  description: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  statusLabel: string;
  cost?: number;
  costBearer?: CostBearer; // "landlord": Chủ nhà chịu, "tenant": Tính vào hóa đơn tháng tới
  adminReply?: string; // Tin nhắn phản hồi trực tiếp vào app/web của khách
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
}

export type BuildingMaintenanceCategory =
  | "Thang máy"
  | "Bể nước ngầm & Máy bơm"
  | "Hệ thống PCCC"
  | "Điện tổng & Máy phát"
  | "Điều hòa tòa nhà"
  | "Vệ sinh & Diệt côn trùng"
  | "Khác";

export type MaintenanceScope = "all" | "floors" | "rooms";

export type MaintenanceStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface BuildingMaintenancePlan {
  id: string;
  buildingId: string;
  buildingName: string;
  title: string;
  category: BuildingMaintenanceCategory;
  description: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  scope: MaintenanceScope;
  scopeLabel: string;
  affectedRooms?: string[];
  status: MaintenanceStatus;
  statusLabel: string;
  cost?: number;
  contractorName?: string;
  contractorPhone?: string;
  notifyTenantAccount: boolean;
  notificationSentAt?: string;
  createdAt: string;
}
