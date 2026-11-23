import { Suspense } from "react";
import { MaintenanceView } from "@/components/maintenance/maintenance-view";

export const metadata = {
  title: "Sự Cố & Lịch Bảo Trì | HonuHome",
  description: "Tiếp nhận phản ánh hư hỏng thiết bị từ khách thuê, điều phối kỹ thuật và chi phí sửa chữa.",
};

export default function MaintenancePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-[#E3EDF6] shadow-sm animate-pulse">
          <div className="w-10 h-10 rounded-full border-3 border-[#5C84BE] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[#7A93AD]">
            Đang tải dữ liệu sự cố & bảo trì...
          </p>
        </div>
      }
    >
      <MaintenanceView />
    </Suspense>
  );
}
