import { RoomsTable } from "@/components/rooms/rooms-table";

export const metadata = {
  title: "Danh Sách Phòng | HonuHome",
  description: "Quản lý danh sách phòng, trạng thái thuê và khách thuê HonuHome",
};

export default function RoomsPage() {
  return <RoomsTable />;
}
