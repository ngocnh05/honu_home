import { ContractsView } from "@/components/contracts/contracts-view";

export const metadata = {
  title: "Quản Lý Hợp Đồng Thuê | HonuHome",
  description: "Theo dõi danh sách hợp đồng, thời hạn thuê, tiền đặt cọc và ngày thanh toán.",
};

export default function ContractsPage() {
  return <ContractsView />;
}
