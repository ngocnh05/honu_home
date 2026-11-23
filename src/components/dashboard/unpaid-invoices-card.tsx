import Link from "next/link";
import { ReceiptText, ChevronRight } from "lucide-react";
import type { UnpaidInvoiceSummary } from "@/types/dashboard";

interface UnpaidInvoicesCardProps {
  summary: UnpaidInvoiceSummary;
}

export function UnpaidInvoicesCard({ summary }: UnpaidInvoicesCardProps) {
  const formattedTotal = new Intl.NumberFormat("vi-VN").format(
    summary.totalAmount
  );

  return (
    <div className="w-full h-full min-h-[360px] xl:min-h-[397px] bg-white rounded-3xl p-5 xl:p-7 border border-[#E3EDF6] shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <p className="text-sm xl:text-base font-bold text-[#253F5B] leading-snug">
          Hóa đơn chưa thanh toán
        </p>
      </div>

      {/* Center Metric Display */}
      <div className="flex flex-col items-center justify-center my-auto space-y-3">
        <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm">
          <ReceiptText className="w-7 h-7 xl:w-8 xl:h-8 stroke-[2.2]" />
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl xl:text-5xl font-black text-[#253F5B]">
            {summary.count}
          </span>
          <span className="text-base xl:text-lg font-bold text-[#718BA6]">Hóa đơn</span>
        </div>

        <div className="px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-2xl bg-[#F6FAFD] border border-[#DEECF6]">
          <p className="text-xs xl:text-sm font-semibold text-[#48637F]">
            Tổng tiền:{" "}
            <span className="text-[#253F5B] font-extrabold">
              {formattedTotal}đ
            </span>
          </p>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href="/invoices?status=pending"
        className="w-full h-11 xl:h-12 rounded-2xl bg-[#5C84BE] hover:bg-[#4D74AD] active:scale-[0.99] text-white font-semibold text-xs xl:text-sm flex items-center justify-center gap-2 shadow-sm shadow-[#5C84BE]/20 transition-all cursor-pointer"
      >
        <span>Xem Chi Tiết</span>
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </Link>
    </div>
  );
}
