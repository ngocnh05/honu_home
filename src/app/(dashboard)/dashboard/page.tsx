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
    <div className="space-y-6 xl:space-y-8 animate-fadeIn pb-12 w-full">
      {/* Welcome Greeting Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl xl:text-3xl font-extrabold text-[#253F5B] tracking-tight">
            Xin chào, {managerName}
          </h1>
          <span className="text-2xl xl:text-3xl">👋</span>
        </div>
        <p className="text-sm xl:text-base text-[#67829E] font-medium flex items-center gap-1.5">
          <span>Chúc bạn một ngày mới tốt lành</span>
          <span>😊</span>
        </p>
      </div>

      {/* 4 Summary KPI Cards - Responsive Grid 2x2 on small, 4 cols on laptop/desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 w-full">
        <KpiCard
          label="Tổng số phòng"
          value={kpis.totalRooms}
          icon={Building2}
          variant="primary"
        />
        <KpiCard
          label="Đang Thuê"
          value={kpis.occupiedRooms}
          icon={UserCheck}
          variant="success"
        />
        <KpiCard
          label="Phòng Trống"
          value={kpis.availableRooms}
          icon={KeyRound}
          variant="warning"
        />
        <KpiCard
          label="Tỷ lệ lấp đầy"
          value={kpis.occupancyRate}
          icon={TrendingUp}
          variant="info"
        />
      </div>

      {/* Bottom Section: Revenue Chart (approx 50%) + Invoices (25%) + Maintenance (25%) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 xl:gap-6 w-full items-stretch">
        {/* Monthly Revenue Chart: 6/12 on xl desktop/laptop, 2 cols on md */}
        <div className="col-span-1 md:col-span-2 xl:col-span-6 w-full">
          <RevenueChart
            data={monthlyRevenue.chartData}
            totalFormatted={monthlyRevenue.totalFormatted}
          />
        </div>

        {/* Unpaid Invoices Widget: 3/12 on xl, 1 col on md */}
        <div className="col-span-1 md:col-span-1 xl:col-span-3 w-full">
          <UnpaidInvoicesCard summary={unpaidInvoices} />
        </div>

        {/* Maintenance Requests Widget: 3/12 on xl, 1 col on md */}
        <div className="col-span-1 md:col-span-1 xl:col-span-3 w-full">
          <MaintenanceCard summary={maintenance} />
        </div>
      </div>
    </div>
  );
}
