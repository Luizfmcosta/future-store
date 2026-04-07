"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { useLocale } from "@/context/LocaleContext";
import { localizeProduct } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";
import Image from "next/image";
import Link from "next/link";

export function ChatProductResults({
  products,
  profile,
}: {
  products: Product[];
  profile: ShopperProfileId;
}) {
  const { locale } = useLocale();
  const t = useT();
  if (products.length === 0) return null;

  const shown = products.slice(0, 4);

  return (
    <div className="mt-3 w-full min-w-0 space-y-2 border-t border-stone-200/90 pt-3">
      <p
        id="chat-top-matches-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 sm:text-xs sm:tracking-[0.18em]"
      >
        {t("searchAiPanel.topMatches")}
      </p>
      <div
        role="group"
        aria-labelledby="chat-top-matches-heading"
        className="snap-x snap-mandatory w-full min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] [scrollbar-color:rgba(120,113,108,0.35)_transparent]"
      >
        <ul className="flex w-max list-none items-stretch gap-3 pb-1 pr-1 pt-0.5">
          {shown.map((raw) => {
            const p = localizeProduct(raw, locale);
            return (
              <li
                key={p.id}
                className="flex w-[118px] shrink-0 snap-start snap-always self-stretch sm:w-[132px]"
              >
                <ProductRowCard product={p} profile={profile} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ProductRowCard({ product: p, profile }: { product: Product; profile: ShopperProfileId }) {
  const meta = profile === "marina" ? p.bestFor[0] : p.deliveryETA;
  const label = [p.title, "—", p.brand, "—", formatBRL(p.price), "—", "view product details"].join(" ");

  return (
    <Link
      href={`/product/${p.id}`}
      aria-label={label}
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-col rounded-xl outline-none",
        ui.home.focusRing,
        "focus-visible:rounded-xl"
      )}
    >
      <Card className="flex h-full min-h-0 flex-1 flex-col overflow-hidden p-0 transition hover:border-stone-300/90">
        <div className="relative h-16 w-full shrink-0 bg-[#f5f5f5] sm:h-[4.75rem]">
          {hasMediaUrl(p.heroImage) ? (
            <Image
              src={p.heroImage}
              alt=""
              fill
              className="object-contain p-1"
              sizes="(max-width:640px) 120px, 140px"
              unoptimized
            />
          ) : (
            <EmptyMediaSlot className="absolute inset-0" variant="light" />
          )}
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-2">
          <p className="shrink-0 truncate text-[11px] font-medium leading-snug text-stone-500">{p.brand}</p>
          <div className="mt-1 flex min-h-0 flex-1 flex-col gap-1">
            <p className="shrink-0 text-pretty text-[12px] font-semibold leading-snug text-stone-900 sm:text-[13px]">
              {p.title}
            </p>
            <div className="mt-auto space-y-1 pt-0.5">
              <p className="text-pretty text-[11px] leading-snug text-stone-600 sm:text-[12px]">{meta}</p>
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-[13px] font-semibold tabular-nums leading-none text-stone-900 sm:text-sm">
                  {formatBRL(p.price)}
                </span>
                {p.oldPrice ? (
                  <span className="text-[11px] tabular-nums leading-none text-stone-400 line-through sm:text-xs">
                    {formatBRL(p.oldPrice)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
