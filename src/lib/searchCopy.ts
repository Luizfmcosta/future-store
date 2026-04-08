import { formatMessage, getMessage } from "@/lib/messages";
import type { AppLocale } from "@/lib/locale-types";
import { localizeProduct } from "@/lib/product-i18n";
import type { Product } from "@/types";

const QUICK_SEARCHES: Record<AppLocale, string[]> = {
  "pt-BR": [
    "Caixa sem fio para sala de 3 m, melhor custo-benefício",
    "Horizon One ou Trail Mini",
    "Som espacial Dolby Atmos portátil",
    "Trail Max para área externa",
  ],
  "en-US": [
    "Wireless speaker for a 3m living room, best value",
    "Horizon One vs Trail Mini",
    "Spatial audio smart speaker under 5000",
    "Trail Max for patio listening",
  ],
};

export function getQuickSearchQueries(locale: AppLocale): string[] {
  return QUICK_SEARCHES[locale];
}

export type SearchCategoryRow = {
  key: "speaker" | "soundbar" | "accessory";
  label: string;
  hint: string;
};

export function getSearchCategoryRows(locale: AppLocale): SearchCategoryRow[] {
  return [
    {
      key: "speaker",
      label: getMessage(locale, "searchCategories.speaker") ?? "Speakers",
      hint: getMessage(locale, "searchCategories.speakerHint") ?? "",
    },
    {
      key: "soundbar",
      label: getMessage(locale, "searchCategories.soundbar") ?? "",
      hint: getMessage(locale, "searchCategories.soundbarHint") ?? "",
    },
    {
      key: "accessory",
      label: getMessage(locale, "searchCategories.accessory") ?? "",
      hint: getMessage(locale, "searchCategories.accessoryHint") ?? "",
    },
  ];
}

export function buildPdpQuickChips(product: Product, locale: AppLocale): string[] {
  const p = localizeProduct(product, locale);
  const t = (path: string, params?: Record<string, string | number>) => {
    const raw = getMessage(locale, path) ?? path;
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
