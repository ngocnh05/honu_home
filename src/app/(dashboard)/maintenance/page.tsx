import { MaintenanceView } from "@/components/maintenance/maintenance-view";

export const metadata = {
  title: "Sự Cố & Lịch Bảo Trì | HonuHome",
  description: "Tiếp nhận phản ánh hư hỏng thiết bị từ khách thuê, điều phối kỹ thuật và chi phí sửa chữa.",
};

export default function MaintenancePage() {
  return <MaintenanceView />;
}
