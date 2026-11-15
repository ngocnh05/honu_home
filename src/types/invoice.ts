export type InvoiceStatus = "paid" | "unpaid" | "overdue";

export interface MeterReading {
  oldIndex: number;
  newIndex: number;
  usage: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceServiceCharge {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;                     // Mã hóa đơn: "INV-2026-03-P001"
  month: string;                  // Kỳ thanh toán: "Tháng 03/2026"
  roomNumber: string;
  buildingId: string;
  buildingName: string;
  tenantName: string;
  tenantPhone: string;
  roomPrice: number;              // Tiền phòng gốc
  electricity: MeterReading;      // Tiền điện theo chỉ số
  water: MeterReading;            // Tiền nước theo chỉ số hoặc định mức
  services: InvoiceServiceCharge[];// Dịch vụ khác (Wifi, xe, vệ sinh...)
  totalAmount: number;            // Tổng tiền phải thanh toán
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  statusLabel: string;
  dueDate: string;                // Hạn thanh toán
  paidDate?: string;
  createdAt: string;
  notes?: string;
}
