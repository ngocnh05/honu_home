import { InvoicesView } from "@/components/invoices/invoices-view";

export const metadata = {
  title: "Hóa Đơn & Thu Tiền Hàng Tháng | HonuHome",
  description: "Chốt chỉ số điện/nước hàng tháng, xuất phiếu thu tự động, gửi Zalo và đối soát thanh toán.",
};

export default function InvoicesPage() {
  return <InvoicesView />;
}
