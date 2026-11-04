import type { Metadata } from "next";
import { CreateRoomView } from "@/components/rooms/create-room-view";

export const metadata: Metadata = {
  title: "Thêm Căn Hộ / Phòng Mới | HonuHome",
  description: "Tạo phòng mới, tải ảnh phòng và cấu hình bảng giá dịch vụ căn hộ HonuHome",
};

export default function CreateRoomPage() {
  return <CreateRoomView />;
}
