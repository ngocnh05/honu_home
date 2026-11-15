export type TenantRole = "representative" | "member"; // Người đại diện hợp đồng | Khách ở cùng
export type TenantStatus = "active" | "temporary_leave" | "moved_out";
export type PortalAccountStatus = "active" | "inactive" | "locked";

export interface Tenant {
  id: string;
  fullName: string;
  phone: string;
  idCardNumber: string;         // CCCD 12 số
  hometown: string;             // Quê quán
  age: number;                  // Tuổi
  birthYear?: number;
  gender: "Nam" | "Nữ";
  email?: string;
  role: TenantRole;
  roomNumber: string;           // "P001", "P155"...
  buildingId: string;
  buildingName: string;
  vehiclePlate?: string;        // Biển số xe đăng ký
  startDate: string;            // Ngày bắt đầu vào ở
  endDate?: string;
  status: TenantStatus;
  avatar?: string;
  notes?: string;
  roommatesCount?: number;      // Số người ở cùng phòng

  // Quản lý tài khoản web / app Cổng Khách Thuê (Tenant Portal)
  portalAccountStatus?: PortalAccountStatus; // "active" | "inactive" | "locked"
  portalUsername?: string;                  // Mặc định là SĐT của khách
  lastLoginAt?: string;                     // Ví dụ: "14/11/2026 18:30"
}
