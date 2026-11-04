import { Building2 } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export const metadata = {
  title: "Cơ sở / Tòa nhà | HonuHome",
};

export default function BuildingsPage() {
  return (
    <PlaceholderPage
      title="Quản lý Cơ sở / Tòa nhà"
      description="Quản lý danh sách các tòa nhà, chung cư mini, dãy trọ và thông tin quản lý từng cơ sở."
      icon={Building2}
    />
  );
}
