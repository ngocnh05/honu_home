import * as React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "info";
  href?: string;
  className?: string;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  variant = "primary",
  href,
  className,
}: KpiCardProps) {
  const iconVariants = {
    primary: "bg-[#EAF2F8] text-[#5C84BE]",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    info: "bg-sky-50 text-sky-600",
  };

  const content = (
    <div
      className={cn(
        "bg-white rounded-3xl p-5 xl:p-6 border border-[#E3EDF6] shadow-sm hover:shadow-md transition-all flex flex-col justify-between w-full h-[135px] xl:h-[150px]",
        href && "cursor-pointer group hover:border-[#BFD7EB] hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "w-11 h-11 xl:w-12 xl:h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0",
            iconVariants[variant]
          )}
        >
          <Icon className="w-5 h-5 xl:w-6 xl:h-6 stroke-[2.2]" />
        </div>
        <span className="text-2xl lg:text-[26px] xl:text-3xl font-extrabold text-[#253F5B] tracking-tight group-hover:text-[#5C84BE] transition-colors">
          {value}
        </span>
      </div>

      <p className="text-xs xl:text-sm font-semibold text-[#68819D] tracking-wide truncate group-hover:text-[#253F5B] transition-colors">
        {label}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full">
        {content}
      </Link>
    );
  }

  return content;
}
