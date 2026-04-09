import { formatMessage, getMessage } from "@/lib/messages";
import type { Product } from "@/types";

const QUICK_SEARCHES: string[] = [
  "Wireless speaker for a 3m living room, best value",
  "Horizon One vs Trail Mini",
  "Spatial audio smart speaker under 5000",
  "Trail Max for patio listening",
];

export function getQuickSearchQueries(): string[] {
  return QUICK_SEARCHES;
}

export type SearchCategoryRow = {
  key: "speaker" | "soundbar" | "accessory";
  label: string;
  hint: string;
};

export function getSearchCategoryRows(): SearchCategoryRow[] {
  return [
    {
      key: "speaker",
      label: getMessage("searchCategories.speaker") ?? "Speakers",
      hint: getMessage("searchCategories.speakerHint") ?? "",
    },
    {
      key: "soundbar",
      label: getMessage("searchCategories.soundbar") ?? "",
      hint: getMessage("searchCategories.soundbarHint") ?? "",
    },
    {
      key: "accessory",
      label: getMessage("searchCategories.accessory") ?? "",
      hint: getMessage("searchCategories.accessoryHint") ?? "",
    },
  ];
}

export function buildPdpQuickChips(product: Product): string[] {
  const p = product;
  const t = (path: string, params?: Record<string, string | number>) => {
    const raw = getMessage(path) ?? path;
    return params ? formatMessage(raw, params) : raw;
  };

  const chips = [
    t("searchChips.compare", { title: p.title }),
    p.technology
      ? t("searchChips.moreTech", { tech: p.technology, brand: p.brand })
      : t("searchChips.moreBrand", { brand: p.brand }),
    t("searchChips.delivery", { returns: p.returnPolicyShort.toLowerCase() }),
    t("searchChips.speakerExtras", { title: p.title }),
    p.bestFor[0]
      ? t("searchChips.bestFor", { useCase: p.bestFor[0].toLowerCase() })
      : "",
  ];
  return chips.filter(Boolean);
}
