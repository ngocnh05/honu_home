"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PieChart,
  ArrowUpRight,
  BadgeDollarSign,
  Users,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { initialBuildings } from "@/lib/mock-data/buildings";

const monthlyData = [
  { month: "T10/2025", revenue: 142000000, occupancy: 82 },
  { month: "T11/2025", revenue: 148500000, occupancy: 86 },
  { month: "T12/2025", revenue: 155000000, occupancy: 91 },
  { month: "T01/2026", revenue: 152000000, occupancy: 88 },
  { month: "T02/2026", revenue: 160000000, occupancy: 93 },
  { month: "T03/2026", revenue: 164500000, occupancy: 95 },
];

export function ReportsView() {
  const [selectedBuilding, setSelectedBuilding] = React.useState("all");

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 select-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-8 py-5 rounded-3xl border border-[#E3EDF6] shadow-sm w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-inner">
            <BarChart3 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#253F5B] tracking-tight">
                Báo Cáo & Phân Tích Tài Chính
              </h1>
              <span className="text-xs font-extrabold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full border border-[#D8E6F3]">
                Tăng trưởng +8.2%
              </span>
            </div>
            <p className="text-xs text-[#7A93AD] font-medium mt-0.5">
              Theo dõi tỷ lệ lấp đầy phòng, doanh thu thực thu và công nợ trên toàn hệ thống HonuHome
            </p>
          </div>
        </div>

        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="h-11 px-4 rounded-2xl bg-[#F8FBFE] border border-[#D9E6F2] text-xs font-bold text-[#253F5B] outline-none cursor-pointer"
        >
          <option value="all">Tất cả các cơ sở</option>
          {initialBuildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Stat Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-1">
          <span className="text-xs text-[#7A93AD] font-bold">Doanh thu tháng 03/2026</span>
          <div className="text-2xl font-black text-[#253F5B]">164.500.000 đ</div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.2% so với tháng trước</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-1">
          <span className="text-xs text-[#7A93AD] font-bold">Tỷ lệ lấp đầy phòng</span>
          <div className="text-2xl font-black text-indigo-600">95.5%</div>
          <span className="text-[11px] text-[#7A93AD]">43/45 phòng đang thuê</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-1">
          <span className="text-xs text-[#7A93AD] font-bold">Thực thu thành công</span>
          <div className="text-2xl font-black text-emerald-700">148.200.000 đ</div>
          <span className="text-[11px] text-emerald-600 font-bold">90.1% đã thanh toán</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-1">
          <span className="text-xs text-[#7A93AD] font-bold">Công nợ còn lại</span>
          <div className="text-2xl font-black text-rose-600">16.300.000 đ</div>
          <span className="text-[11px] text-rose-500 font-semibold">4 phòng chưa hoàn tất</span>
        </div>
      </div>

      {/* 3. Main Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doanh thu 6 tháng gần nhất */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5FA]">
            <div>
              <h3 className="text-base font-black text-[#253F5B]">Biểu Đồ Doanh Thu 6 Tháng</h3>
              <p className="text-xs text-[#7A93AD]">Tăng trưởng dòng tiền liên tục qua các chu kỳ</p>
            </div>
            <span className="text-xs font-bold text-[#5C84BE] bg-[#EAF2F8] px-3 py-1 rounded-full">
              Đơn vị: VNĐ
            </span>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4">
            {monthlyData.map((d, idx) => {
              const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-[#5C84BE] opacity-0 group-hover:opacity-100 transition-opacity">
                    {(d.revenue / 1000000).toFixed(1)} tr
                  </span>
                  <div className="w-full max-w-[48px] bg-[#EAF2F8] rounded-2xl h-48 relative overflow-hidden flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#5C84BE] to-[#7DA4DD] rounded-2xl transition-all duration-700 group-hover:brightness-110"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#526579]">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cơ cấu nguồn thu */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E3EDF6] shadow-sm space-y-5">
          <div className="pb-3 border-b border-[#F0F5FA]">
            <h3 className="text-base font-black text-[#253F5B]">Cơ Cấu Nguồn Thu</h3>
            <p className="text-xs text-[#7A93AD]">Tỷ trọng từng khoản thu trong tổng bill</p>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: "Tiền thuê phòng gốc", percent: 74, color: "bg-[#5C84BE]" },
              { label: "Tiền điện sinh hoạt", percent: 14, color: "bg-amber-500" },
              { label: "Tiền nước sinh hoạt", percent: 6, color: "bg-sky-500" },
              { label: "Gửi xe máy & Dịch vụ khác", percent: 6, color: "bg-emerald-500" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#253F5B]">{item.label}</span>
                  <span className="text-[#5C84BE]">{item.percent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${item.percent}%` }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#EAF2F8] text-xs text-[#526579] space-y-1 mt-4">
            <span className="font-bold text-[#253F5B] block">Gợi ý tối ưu vận hành:</span>
            <p className="leading-relaxed">
              Tỷ lệ lấp đầy đang ở mức cao (95.5%). Xem xét tăng nhẹ 5-10% giá thuê cho các hợp đồng mới tại cơ sở Cầu Giấy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
