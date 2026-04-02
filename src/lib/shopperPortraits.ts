import type { ShopperProfileId } from "@/types";

export const SHOPPER_PORTRAIT: Record<ShopperProfileId, string> = {
  marina:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces",
  ricardo:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&crop=faces",
};

export function shopperDisplayName(id: ShopperProfileId): string {
  return id === "marina" ? "Marina" : "Ricardo";
}
