import { Suspense } from "react";
import { ContractsView } from "@/components/contracts/contracts-view";

export const metadata = {
  title: "Quản Lý Hợp Đồng Thuê | HonuHome",
  description: "Theo dõi danh sách hợp đồng, thời hạn thuê, tiền đặt cọc và ngày thanh toán.",
};

export default function ContractsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-[#E3EDF6] shadow-sm animate-pulse">
          <div className="w-10 h-10 rounded-full border-3 border-[#5C84BE] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[#7A93AD]">
            Đang tải danh sách hợp đồng...
          </p>
        </div>
      }
    >
      <ContractsView />
    </Suspense>
  );
}
