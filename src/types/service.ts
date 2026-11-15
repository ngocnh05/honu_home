export type ServiceBillingType =
  | "meter"         // Theo đồng hồ (điện, nước khối)
  | "fixed"         // Cố định hàng tháng
  | "per_person"    // Tính theo đầu người (vệ sinh, thang máy)
  | "per_vehicle"   // Tính theo số lượng xe
  | "per_room";     // Tính trọn gói theo phòng

export interface ServicePriceOption {
  id: string;
  label: string;          // Ví dụ: "Theo đồng hồ tiêu chuẩn", "Khoán theo đầu người", "Xe điện có sạc"...
  price: number;          // 3500, 30000, 100000...
  unit: string;           // "đ/kWh", "đ/khối", "đ/người", "đ/xe", "đ/phòng"...
  type: ServiceBillingType;
  isDefault?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  buildingId: string;       // "all" hoặc buildingId cụ thể
  buildingName?: string;
  type: ServiceBillingType;
  unit: string;             // kWh, khối, người/tháng, xe/tháng, phòng/tháng
  price: number;
  priceFormatted: string;
  description?: string;
  iconName?: string;
  isMandatory: boolean;     // Bắt buộc hay tùy chọn
  appliedRoomsCount?: number;
  priceOptions?: ServicePriceOption[]; // Các mức giá / gói giá có thể lựa chọn cho phòng
}
