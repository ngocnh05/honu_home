import { FileCheck2 } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata = {
  title: "Hợp đồng thuê | HonuHome",
};

export default function ContractsPage() {
  return (
    <PlaceholderPage
      title="Quản lý Hợp đồng thuê"
      description="Theo dõi danh sách hợp đồng, thời hạn thuê, tiền đặt cọc và chu kỳ thanh toán."
      icon={FileCheck2}
    />
  );
}
