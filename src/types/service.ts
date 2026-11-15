export type ServiceBillingType =
  | "meter"         // Theo đồng hồ (điện, nước khối)
  | "fixed"         // Cố định hàng tháng
  | "per_person"    // Tính theo đầu người (vệ sinh, thang máy)
  | "per_vehicle"   // Tính theo số lượng xe
  | "per_room";     // Tính trọn gói theo phòng

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
}
