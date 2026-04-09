import type { ShopperProfileId } from "@/types";

/** Order of profiles in the UI switcher (Marina, Ricardo, AI Agent). */
export const SHOPPER_PROFILE_ORDER = ["marina", "ricardo", "aiAgent"] as const satisfies readonly ShopperProfileId[];

/** Photo avatars — human shoppers only; {@link shopperUsesIconAvatar} for AI Agent. */
export const SHOPPER_PORTRAIT: Record<Exclude<ShopperProfileId, "aiAgent">, string> = {
  marina: "/media/avatars/marina.png",
  ricardo: "/media/avatars/ricardo.png",
};

export function shopperUsesIconAvatar(id: ShopperProfileId): id is "aiAgent" {
  return id === "aiAgent";
}

export function shopperDisplayName(id: ShopperProfileId): string {
  switch (id) {
    case "marina":
      return "Marina";
    case "ricardo":
      return "Ricardo";
    case "aiAgent":
      return "AI Agent";
    default:
      return id;
  }
}

/** Iniciais para avatar placeholder (tabs, chips): duas letras se nome composto; senão a inicial. */
export function shopperTabInitials(id: ShopperProfileId): string {
  if (id === "aiAgent") return "AI";
  const name = shopperDisplayName(id).trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase();
  }
  return name.slice(0, 1).toUpperCase();
}
