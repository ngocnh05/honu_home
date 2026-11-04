import { Suspense } from "react";
import type { Metadata } from "next";
import { initialRooms, getRoomByNumber } from "@/lib/mock-data/rooms";
import { EditRoomView } from "@/components/rooms/edit-room-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return initialRooms.map((room) => ({
    id: room.roomNumber,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toUpperCase();
  return {
    title: `Chỉnh sửa phòng ${decodedId} | HonuHome`,
    description: `Cập nhật thông số kỹ thuật, khách thuê và dịch vụ phòng ${decodedId}`,
  };
}

async function EditRoomContent({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const room = getRoomByNumber(decodedId);

  return <EditRoomView room={room} />;
}

export default function EditRoomPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-[#E3EDF6] shadow-sm animate-pulse">
          <div className="w-10 h-10 rounded-full border-3 border-[#5C84BE] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[#7A93AD]">
            Đang tải dữ liệu chỉnh sửa phòng...
          </p>
        </div>
      }
    >
      <EditRoomContent params={params} />
    </Suspense>
  );
}
