export type BuildingStatus = "active" | "maintenance";

export interface Building {
  id: string;
  name: string;
  code: string;
  address: string;
  totalFloors: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  managerName: string;
  managerPhone: string;
  defaultElectricityPrice: number;
  defaultWaterPrice: number;
  defaultWaterUnit: "m3" | "person" | "room";
  status: BuildingStatus;
  statusLabel: string;
  image: string;
  notes?: string;
  createdAt: string;
}

export type NewBuildingInput = Omit<
  Building,
  "id" | "occupiedRooms" | "availableRooms" | "maintenanceRooms" | "statusLabel" | "createdAt"
>;
