import type { Product } from "@/types";

export type MerchSortMode = "default" | "price_asc" | "price_desc";

/** Stable tie-breaker for equal prices. */
export function sortProducts(products: Product[], mode: MerchSortMode): Product[] {
  const copy = [...products];
  if (mode === "default") return copy;
  copy.sort((a, b) => {
    const d = mode === "price_asc" ? a.price - b.price : b.price - a.price;
    if (d !== 0) return d;
    return a.id.localeCompare(b.id);
  });
  return copy;
}
