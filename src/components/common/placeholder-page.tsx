import Link from "next/link";
import { LucideIcon, ArrowLeft, Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="w-full py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white border border-[#DCE8F2] rounded-3xl p-10 max-w-lg w-full text-center shadow-sm space-y-5">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#EAF2F8] text-[#5C84BE] flex items-center justify-center">
          <Icon className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
            <Construction className="w-3.5 h-3.5" />
            Đang xây dựng theo mô hình CSDL mới
          </div>
          <h1 className="text-2xl font-bold text-[#253F5B]">{title}</h1>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5C84BE] hover:bg-[#4B73AD] text-white font-medium text-sm transition-all shadow-sm shadow-[#5C84BE]/20 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Về Quản lý phòng
          </Link>
        </div>
      </div>
    </div>
  );
}
