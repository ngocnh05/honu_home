import { Building2, UserCheck, KeyRound, TrendingUp } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UnpaidInvoicesCard } from "@/components/dashboard/unpaid-invoices-card";
import { MaintenanceCard } from "@/components/dashboard/maintenance-card";
import { mockDashboardData } from "@/lib/mock-data/dashboard";

export const metadata = {
  title: "Bảng Điều Khiển | HonuHome",
  description: "Bảng điều khiển quản lý phòng và doanh thu HonuHome",
};

export default function DashboardPage() {
  const { kpis, monthlyRevenue, unpaidInvoices, maintenance, managerName } =
    mockDashboardData;

  return (
    <div className="space-y-8 animate-fadeIn pb-12 w-[1096px]">
      {/* Welcome Greeting Header - Figma: Frame 2 & Frame 6 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-[#253F5B] tracking-tight">
            Xin chào, {managerName}
          </h1>
          <span className="text-3xl">👋</span>
        </div>
        <p className="text-base text-[#67829E] font-medium flex items-center gap-1.5">
          <span>Chúc bạn một ngày mới tốt lành</span>
          <span>😊</span>
        </p>
      </div>

      {/* 4 Summary KPI Cards - Figma Frame 15: 1096px x 170px, 4 cards 230x150 */}
      <div className="grid grid-cols-4 gap-6 w-[1096px]">
        <KpiCard
          label="Tổng số phòng"
          value={kpis.totalRooms}
          icon={Building2}
          variant="primary"
          className="w-[230px] h-[150px]"
        />
        <KpiCard
          label="Đang Thuê"
          value={kpis.occupiedRooms}
          icon={UserCheck}
          variant="success"
          className="w-[230px] h-[150px]"
        />
        <KpiCard
          label="Phòng Trống"
          value={kpis.availableRooms}
          icon={KeyRound}
          variant="warning"
          className="w-[230px] h-[150px]"
        />
        <KpiCard
          label="Tỷ lệ lấp đầy"
          value={kpis.occupancyRate}
          icon={TrendingUp}
          variant="info"
          className="w-[230px] h-[150px]"
        />
      </div>

      {/* Bottom Section: Revenue Chart (502px) + Invoices (245px) + Maintenance (245px) */}
      <div className="flex items-start gap-6 w-[1096px]">
        {/* Monthly Revenue Chart - Figma 35:82: 502px x 397px */}
        <div className="w-[502px] shrink-0">
          <RevenueChart
            data={monthlyRevenue.chartData}
            totalFormatted={monthlyRevenue.totalFormatted}
          />
        </div>

        {/* Unpaid Invoices Widget - Figma 36:193: 245px x 397px */}
        <div className="w-[245px] shrink-0">
          <UnpaidInvoicesCard summary={unpaidInvoices} />
        </div>

        {/* Maintenance Requests Widget - Figma 36:183: 245px x 397px */}
        <div className="w-[245px] shrink-0">
          <MaintenanceCard summary={maintenance} />
        </div>
      </div>
    </div>
  );
}
