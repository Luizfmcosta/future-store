import { getProductById, products } from "@/data/products";
import { DEFAULT_UI_LOCALE, type UiLocale } from "@/lib/locales/types";
import { applyProductPt } from "@/lib/locales/products-pt";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";

function resolveLocale(): UiLocale {
  if (typeof window !== "undefined") {
    return useDemoStore.getState().uiLocale;
  }
  return DEFAULT_UI_LOCALE;
}

export function localizeProduct(product: Product): Product {
  if (resolveLocale() !== "pt") return product;
  return applyProductPt(product);
}

export function localizeProducts(list: Product[]): Product[] {
  return list.map(localizeProduct);
}

export function getProductByIdLocalized(id: string): Product | undefined {
  const p = getProductById(id);
  return p ? localizeProduct(p) : undefined;
}

export function getAllProductsLocalized(): Product[] {
  return localizeProducts(products);
}
