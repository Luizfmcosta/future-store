import type { HomeModuleKey } from "@/types";
import type { ShopperProfileId } from "@/types";

export function getHomeModules(profile: ShopperProfileId): HomeModuleKey[] {
  if (profile === "marina") {
    return ["hero", "continue", "curated", "compare", "proof", "strip"];
  }
  return ["hero", "curated", "continue", "proof", "strip", "compare"];
}
