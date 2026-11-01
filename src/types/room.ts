export type RoomStatus = "rented" | "available" | "maintenance";
export type RoomType = "Phòng Đơn" | "Phòng Đôi" | "Phòng Ba";

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
}

export interface RoomFilterState {
  searchTerm: string;
  typeFilter: string;
  statusFilter: string;
  currentPage: number;
}
