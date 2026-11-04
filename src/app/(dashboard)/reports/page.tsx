import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata = {
  title: "Báo cáo thống kê | HonuHome",
};

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Báo cáo & Thống kê Tài chính"
      description="Biểu đồ tỷ lệ lấp đầy phòng trống, doanh thu thực tế, công nợ chưa thu và phân tích dòng tiền."
      icon={BarChart3}
    />
  );
}
