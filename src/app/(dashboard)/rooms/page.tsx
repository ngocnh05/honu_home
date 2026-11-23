import { Suspense } from "react";
import { RoomsTable } from "@/components/rooms/rooms-table";

export const metadata = {
  title: "Danh Sách Phòng | HonuHome",
  description: "Quản lý danh sách phòng, trạng thái thuê và khách thuê HonuHome",
};

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-[#E3EDF6] shadow-sm animate-pulse">
          <div className="w-10 h-10 rounded-full border-3 border-[#5C84BE] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[#7A93AD]">
            Đang tải danh sách phòng...
          </p>
        </div>
      }
    >
      <RoomsTable />
    </Suspense>
  );
}
