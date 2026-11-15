export type ContractStatus = "active" | "expiring_soon" | "ended" | "pending";

export interface ContractMember {
  id: string;
  fullName: string;
  phone?: string;
  idCardNumber?: string;
  vehiclePlate?: string;
  relationship?: string;
}

export interface ContractService {
  name: string;
  price: number;
  unit: string;
}

export interface Contract {
  id: string;                         // Mã HĐ: "HD-P001-2026"
  roomNumber: string;
  buildingId: string;
  buildingName: string;
  // Người đại diện
  representative: {
    fullName: string;
    phone: string;
    idCardNumber: string;
    hometown: string;
    age: number;
  };
  // Khách ở cùng phòng
  members: ContractMember[];
  startDate: string;                  // Ngày bắt đầu
  endDate: string;                    // Ngày kết thúc
  monthlyRent: number;                // Giá thuê phòng / tháng
  deposit: number;                    // Tiền đặt cọc
  depositStatus: "paid" | "unpaid" | "refunded";
  paymentCycleDay: number;            // Ngày thanh toán hàng tháng (VD: 28)
  paymentCycle: string;               // Chu kỳ thu tiền (1 tháng/lần)
  occupantsCount: number;             // Số người ở
  vehiclesCount: number;              // Số xe đăng ký
  services: ContractService[];        // Dịch vụ kèm theo
  initialElectricityIndex: number;    // Chỉ số điện ban đầu
  initialWaterIndex: number;          // Chỉ số nước ban đầu
  status: ContractStatus;
  statusLabel: string;
  notes?: string;
  createdAt: string;
}
