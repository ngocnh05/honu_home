export interface AmenityItem {
  id: string;
  name: string;
  icon?: string;
  category?: "basic" | "appliance" | "furniture" | "outdoor";
  isDefault?: boolean;
}

export const initialAmenities: AmenityItem[] = [
  { id: "amenity_giuong", name: "Giường", icon: "Bed", category: "furniture", isDefault: true },
  { id: "amenity_tu_quan_ao", name: "Tủ quần áo", icon: "Armchair", category: "furniture", isDefault: true },
  { id: "amenity_wifi", name: "Wifi", icon: "Wifi", category: "basic", isDefault: true },
  { id: "amenity_may_lanh", name: "Máy lạnh", icon: "Wind", category: "appliance", isDefault: true },
  { id: "amenity_binh_nong_lanh", name: "Bình nóng lạnh", icon: "Flame", category: "appliance", isDefault: true },
  { id: "amenity_tu_lanh", name: "Tủ lạnh", icon: "Refrigerator", category: "appliance", isDefault: false },
  { id: "amenity_may_giat", name: "Máy giặt", icon: "Waves", category: "appliance", isDefault: false },
  { id: "amenity_ban_cong", name: "Ban công", icon: "SunMedium", category: "outdoor", isDefault: false },
  { id: "amenity_bep_nau", name: "Kệ bếp nấu ăn", icon: "Utensils", category: "furniture", isDefault: false },
  { id: "amenity_khoa_van_tay", name: "Khóa vân tay riêng", icon: "Fingerprint", category: "basic", isDefault: false },
  { id: "amenity_gac_lung", name: "Gác lửng cao thoáng", icon: "Building", category: "basic", isDefault: false },
  { id: "amenity_cua_so_thoang", name: "Cửa sổ giếng trời", icon: "Maximize", category: "outdoor", isDefault: false },
];

const STORAGE_KEY = "honuhome_amenities_list";

export function getAmenities(): AmenityItem[] {
  if (typeof window === "undefined") return initialAmenities;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAmenities));
      return initialAmenities;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAmenities;
  } catch {
    return initialAmenities;
  }
}

export function saveAmenities(items: AmenityItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("honuhome_amenities_changed"));
  } catch (err) {
    console.error("Failed to save amenities to localStorage", err);
  }
}
