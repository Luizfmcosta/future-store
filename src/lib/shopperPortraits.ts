import type { ShopperProfileId } from "@/types";

/** Order of profiles in the UI switcher (Marina, Ricardo). */
export const SHOPPER_PROFILE_ORDER = ["marina", "ricardo"] as const satisfies readonly ShopperProfileId[];

export const SHOPPER_PORTRAIT: Record<ShopperProfileId, string> = {
  marina: "/media/avatars/marina.png",
  ricardo: "/media/avatars/ricardo.png",
};

export function shopperDisplayName(id: ShopperProfileId): string {
  switch (id) {
    case "marina":
      return "Marina";
    case "ricardo":
      return "Ricardo";
    default:
      return id;
  }
}

/** Iniciais para avatar placeholder (tabs, chips): duas letras se nome composto; senão a inicial. */
export function shopperTabInitials(id: ShopperProfileId): string {
  const name = shopperDisplayName(id).trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase();
  }
  return name.slice(0, 1).toUpperCase();
}
