import { Receipt } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata = {
  title: "Hóa đơn & Thu tiền | HonuHome",
};

export default function InvoicesPage() {
  return (
    <PlaceholderPage
      title="Hóa đơn & Thu tiền hàng tháng"
      description="Chốt chỉ số điện/nước hàng tháng, xuất phiếu thu tự động, gửi Zalo/SMS và đối soát thanh toán."
      icon={Receipt}
    />
  );
}
