export type RoomStatus = "rented" | "available" | "maintenance";
export type RoomType = "Phòng Đơn" | "Phòng Đôi" | "Phòng Ba";

export interface CustomService {
  id: string;
  name: string; // Tên dịch vụ (VD: Điện, Nước, Wifi, Cầu thang, Giặt sấy, Xe máy,...)
  price: number; // Đơn giá
  unit: string; // đ/kWh, đ/khối, đ/người, đ/phòng, đ/xe, đ/tháng
}

export interface RoomServices {
  electricityPrice: number; // đ/kWh (vd: 3500, 3600)
  waterPrice: number; // đơn giá nước
  waterUnit: "m3" | "person" | "room"; // 'm3' (theo số khối), 'person' (theo đầu người), 'room' (cố định theo phòng)
  wifiPrice?: number; // đ/phòng/tháng
  generalServicePrice?: number; // Thang máy, rác, vệ sinh, đèn hành lang
}

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  price: number;
  priceFormatted: string;
  status: RoomStatus;
  statusLabel: "Đang Thuê" | "Trống" | "Đang sửa";
  tenantName: string;
  floor?: number;
  area?: number; // m2
  description?: string;
  startDate?: string;
  endDate?: string;
  deposit?: number; // Tiền đặt cọc
  services?: RoomServices;
  customServices?: CustomService[];
  tenantRole?: string;
  tenantPhone?: string;
  notes?: string;
  amenities?: string[];
}

export interface RoomFilterState {
  searchTerm: string;
  typeFilter: string;
  statusFilter: string;
  currentPage: number;
}
