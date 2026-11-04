import { Wrench } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata = {
  title: "Sự cố / Bảo trì | HonuHome",
};

export default function MaintenancePage() {
  return (
    <PlaceholderPage
      title="Sự cố & Lịch Bảo trì"
      description="Tiếp nhận phản ánh hư hỏng thiết bị từ khách thuê, điều phối kỹ thuật và theo dõi chi phí sửa chữa."
      icon={Wrench}
    />
  );
}
