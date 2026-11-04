import { Zap } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata = {
  title: "Bảng giá dịch vụ | HonuHome",
};

export default function ServicesPage() {
  return (
    <PlaceholderPage
      title="Bảng giá Dịch vụ & Tiện ích"
      description="Cấu hình đơn giá điện, nước, internet, thang máy, phí dịch vụ chung áp dụng theo từng cơ sở."
      icon={Zap}
    />
  );
}
