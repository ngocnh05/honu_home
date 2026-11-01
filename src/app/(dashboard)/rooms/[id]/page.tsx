import type { Metadata } from "next";
import { initialRooms, getRoomByNumber } from "@/lib/mock-data/rooms";
import { RoomDetailView } from "@/components/rooms/room-detail-view";

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
    title: `Chi tiết phòng ${decodedId} | HonuHome`,
    description: `Thông tin chi tiết, tiện nghi, khách thuê và hợp đồng phòng ${decodedId}`,
  };
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const room = getRoomByNumber(decodedId);

  return <RoomDetailView room={room} />;
}
