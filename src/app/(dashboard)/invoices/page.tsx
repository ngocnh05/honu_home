import { Suspense } from "react";
import { InvoicesView } from "@/components/invoices/invoices-view";

export const metadata = {
  title: "Hóa Đơn & Thu Tiền Hàng Tháng | HonuHome",
  description: "Chốt chỉ số điện/nước hàng tháng, xuất phiếu thu tự động, gửi Zalo và đối soát thanh toán.",
};

export default function InvoicesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-[#E3EDF6] shadow-sm animate-pulse">
          <div className="w-10 h-10 rounded-full border-3 border-[#5C84BE] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[#7A93AD]">
            Đang tải dữ liệu hóa đơn...
          </p>
        </div>
      }
    >
      <InvoicesView />
    </Suspense>
  );
}
