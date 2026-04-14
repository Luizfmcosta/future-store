"use client";

import { ProductColorSwatches } from "@/components/pdp/ProductColorSwatches";
import { ReviewStars } from "@/components/pdp/ReviewStars";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useT } from "@/lib/useT";
import { cn, formatBRL } from "@/lib/utils";
import type { Product } from "@/types";
import { useDemoStore } from "@/store/demoStore";
import Link from "next/link";

function formatReviewCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}

function firstSentence(text: string): string {
  const m = text.match(/^(.{12,320}?[.!?])(\s|$)/);
  return m ? m[1].trim() : text.slice(0, 220).trim();
}

export function PdpLeadColumn({
  product,
  className,
  selectedColorKey,
  onSelectedColorKeyChange,
}: {
  product: Product;
  className?: string;
  selectedColorKey: string;
  onSelectedColorKeyChange: (labelKey: string) => void;
}) {
  const t = useT();
  const addToCart = useDemoStore((s) => s.addToCart);

  const { average, count } = product.reviewRating;
  const tagline = firstSentence(product.description);

  return (
    <div className={cn("space-y-4 pt-2 sm:space-y-6 sm:pt-4 lg:space-y-5", className)}>
      <div>
        <div className="flex flex-col gap-[8px]">
          <EyebrowPill>{product.brand}</EyebrowPill>
          <h1 className="text-[1.875rem] font-normal leading-[1.12] tracking-tight text-neutral-900 sm:text-[2.75rem] sm:leading-[1.08]">
            {product.title}
          </h1>
        </div>
        <div className="mt-8 flex flex-col gap-[8px] pb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-2xl font-semibold tabular-nums text-neutral-900 sm:text-3xl">{formatBRL(product.price)}</span>
            {product.oldPrice ? (
              <span className="text-lg text-neutral-400 line-through">{formatBRL(product.oldPrice)}</span>
            ) : null}
          </div>
          <p className="text-[15px] text-neutral-500">{product.installmentText}</p>
        </div>
      </div>

      <div className="!mt-0 flex flex-col gap-[8px]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <ReviewStars rating={average} className="gap-1" />
          <span className="text-[15px] font-medium tabular-nums text-neutral-900">
            {average.toFixed(1)}/5
          </span>
          <Link
            href="#pdp-reviews"
            className="text-[15px] font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
          >
            {t("pdp.reviewsCount", { count: formatReviewCount(count) })}
          </Link>
        </div>
        <p className="max-w-[42rem] text-[15px] leading-relaxed text-neutral-600 sm:text-[16px] sm:leading-[1.65]">
          {tagline}
        </p>
      </div>

      {product.colorOptions?.length ? (
        <ProductColorSwatches
          key={product.id}
          options={product.colorOptions}
          value={selectedColorKey}
          onChange={onSelectedColorKeyChange}
        />
      ) : null}

      <p className="text-[15px] text-neutral-500">
        {t("pdp.deliveryAndStock", { delivery: product.deliveryETA, count: product.stock })}
      </p>

      <div className="pt-2 sm:pt-1">
        <button
          type="button"
          onClick={() => {
            addToCart(product.id);
          }}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-neutral-900 px-6 text-[15px] font-semibold tracking-tight text-white transition hover:bg-neutral-800 sm:w-auto sm:min-w-[10.5rem]"
        >
          {t("pdp.buyNow")}
        </button>
      </div>
    </div>
  );
}
