"use client";

import { useDemoStore } from "@/store/demoStore";
import Link from "next/link";

type Props = {
  productId: string;
  className?: string;
  children: React.ReactNode;
};

/** Navigates to the product PDP — use for every “Explore” (secondary) product CTA. */
export function ProductExploreLink({ productId, className, children }: Props) {
  return (
    <Link href={`/product/${productId}`} className={className}>
      {children}
    </Link>
  );
}

/** Adds the SKU to the demo cart and opens the drawer — use for every “Buy now” product CTA. */
export function ProductBuyNowButton({ productId, className, children }: Props) {
  const addToCart = useDemoStore((s) => s.addToCart);
  return (
    <button type="button" onClick={() => addToCart(productId)} className={className}>
      {children}
    </button>
  );
}
