import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata = {
  title: "Cài đặt | HonuHome",
};

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Cài đặt Hệ thống"
      description="Cấu hình tài khoản, phân quyền quản lý, mẫu in hóa đơn/hợp đồng và tích hợp thông báo."
      icon={Settings}
    />
  );
}
