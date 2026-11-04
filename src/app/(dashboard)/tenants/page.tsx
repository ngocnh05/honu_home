import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata = {
  title: "Khách thuê | HonuHome",
};

export default function TenantsPage() {
  return (
    <PlaceholderPage
      title="Hồ sơ Khách thuê"
      description="Quản lý thông tin cá nhân khách thuê, CCCD, thông tin liên hệ, thành viên ở cùng và biển số xe."
      icon={Users}
    />
  );
}
