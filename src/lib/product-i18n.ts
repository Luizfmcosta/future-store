import { getProductById, products } from "@/data/products";
import type { Product } from "@/types";

/** English-only: product copy lives in `src/data/products.ts`. */

export function localizeProduct(product: Product): Product {
  return product;
}

export function localizeProducts(list: Product[]): Product[] {
  return list;
}

export function getProductByIdLocalized(id: string): Product | undefined {
  return getProductById(id);
}

export function getAllProductsLocalized(): Product[] {
  return products;
}
