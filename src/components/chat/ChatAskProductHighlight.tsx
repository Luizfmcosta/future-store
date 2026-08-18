"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { ProductBuyNowButton, ProductExploreLink } from "@/components/shared/ProductCtas";
import { localizeProduct } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";
import Image from "next/image";
import Link from "next/link";

/** Single product card under Sources when the shopper attached a product via Ask / prompt chip. */
export function ChatAskProductHighlight({
  product,
  profile,
}: {
  product: Product;
  profile: ShopperProfileId;
}) {
  const t = useT();
  const p = localizeProduct(product);
  const meta = profile === "marina" ? p.bestFor[0] : p.deliveryETA;
  const headingId = "chat-ask-product-heading";

  return (
    <div className="w-full min-w-0 space-y-2">
      <EyebrowPill id={headingId} as="p">
        {t("searchAiPanel.askProductHighlight")}
      </EyebrowPill>
      <div role="group" aria-labelledby={headingId} className="flex w-full justify-start">
        <Card className="flex w-full max-w-[min(100%,26rem)] min-w-0 overflow-hidden rounded-xl p-0 transition hover:border-stone-300/90 sm:max-w-[28rem]">
          <div className="flex w-full items-stretch">
            <AskImageButton
              productLabel={p.title}
              productId={p.id}
              className="relative w-[9.75rem] shrink-0 self-stretch bg-[#f5f5f5] sm:w-44"
            >
              {hasMediaUrl(p.heroImage) ? (
                <Image
                  src={p.heroImage}
                  alt=""
                  fill
                  className="object-contain p-3"
                  sizes="176px"
                  unoptimized
                />
              ) : (
                <EmptyMediaSlot className="absolute inset-0" variant="light" />
              )}
            </AskImageButton>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 border-l border-stone-200/90 p-4 sm:p-5">
              <div className="min-w-0 space-y-1.5">
                <Link
                  href={`/product/${p.id}`}
                  className={cn(
                    "line-clamp-2 text-pretty text-[14px] font-semibold leading-snug text-stone-900 sm:text-[15px]",
                    ui.home.focusRing,
                    "rounded-sm outline-none focus-visible:ring-2",
                  )}
                >
                  {p.title}
                </Link>
                {meta ? (
                  <p className="line-clamp-1 text-[13px] leading-snug text-stone-600">{meta}</p>
                ) : null}
                <div className="flex flex-wrap items-baseline gap-1.5 pt-0.5">
                  <span className="text-[15px] font-semibold tabular-nums text-stone-900">
                    {formatBRL(p.price)}
                  </span>
                  {p.oldPrice ? (
                    <span className="text-[13px] tabular-nums text-stone-400 line-through">
                      {formatBRL(p.oldPrice)}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex min-w-0 gap-2">
                <ProductExploreLink
                  productId={p.id}
                  className={cn(
                    ui.home.focusRing,
                    ui.home.ctaSecondaryOutline,
                    "flex min-h-9 min-w-0 flex-1 items-center justify-center rounded-full px-3 py-1.5 text-center text-[12px] font-medium leading-tight",
                  )}
                >
                  {t("common.explore")}
                </ProductExploreLink>
                <ProductBuyNowButton
                  productId={p.id}
                  className={cn(
                    ui.home.focusRing,
                    ui.home.ctaPrimaryFill,
                    "flex min-h-9 min-w-0 flex-1 items-center justify-center rounded-full px-3 py-1.5 text-center text-[12px] font-medium leading-tight",
                  )}
                >
                  {t("common.buyNow")}
                </ProductBuyNowButton>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
