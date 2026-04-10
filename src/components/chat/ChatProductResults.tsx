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

export function ChatProductResults({
  products,
  profile,
  followUpSuggestions,
  onFollowUp,
  followUpDisabled,
  showFollowUpSection = true,
  presentation = "default",
  anchorProduct,
}: {
  products: Product[];
  profile: ShopperProfileId;
  /** Shown as chips below top matches; fills the composer when clicked. */
  followUpSuggestions?: readonly string[];
  onFollowUp?: (text: string) => void;
  followUpDisabled?: boolean;
  /** When false, hides follow-up chips (e.g. after the shopper sent another message). */
  showFollowUpSection?: boolean;
  /** PDP chat: larger cards, minimal copy; no top-matches label (follow-ups still shown). */
  presentation?: "default" | "pdpChat";
  /** PDP comparison: product being viewed — shown on its own row above alternatives. */
  anchorProduct?: Product;
}) {
  const t = useT();
  const isPdpChat = presentation === "pdpChat";
  const shown = products.slice(0, isPdpChat ? 3 : 4);
  const followUps = followUpSuggestions?.length ? followUpSuggestions : [];

  const topMatchesHeadingId = "chat-top-matches-heading";
  const anchorEyebrowId = "chat-pdp-anchor-eyebrow";
  const altsEyebrowId = "chat-pdp-alts-eyebrow";

  const anchorP = anchorProduct && isPdpChat ? localizeProduct(anchorProduct) : null;

  if (shown.length === 0 && !anchorP) return null;

  return (
    <div
      className={cn(
        "w-full min-w-0",
        isPdpChat && anchorP ? "space-y-4" : isPdpChat ? "space-y-0" : "space-y-2",
      )}
    >
      {anchorP ? (
        <div className="space-y-2">
          <EyebrowPill id={anchorEyebrowId} as="p">
            {t("pdp.chatComparisonAnchorEyebrow")}
          </EyebrowPill>
          <div className="flex w-full justify-start">
            <div className="w-[200px] shrink-0 sm:w-[228px]">
              <ProductRowCard
                product={anchorP}
                profile={profile}
                presentation="pdpChat"
                showPdpAnchorBuyNow
              />
            </div>
          </div>
        </div>
      ) : null}

      {shown.length > 0 ? (
        <div className="space-y-2">
          {!isPdpChat ? (
            <EyebrowPill id={topMatchesHeadingId}>{t("searchAiPanel.topMatches")}</EyebrowPill>
          ) : anchorP ? (
            <EyebrowPill id={altsEyebrowId} as="p">
              {t("pdp.chatComparisonAlternativesEyebrow")}
            </EyebrowPill>
          ) : null}
          <div
            role="group"
            aria-label={
              isPdpChat && !anchorP ? t("pdp.chatComparisonProductsGroup") : undefined
            }
            aria-labelledby={
              !isPdpChat
                ? topMatchesHeadingId
                : anchorP
                  ? altsEyebrowId
                  : undefined
            }
            className="snap-x snap-mandatory w-full min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-none"
          >
            <ul
              className={cn(
                "flex w-max list-none items-stretch pb-1 pr-1 pt-0.5",
                isPdpChat ? "gap-3.5" : "gap-3",
              )}
            >
              {shown.map((raw) => {
                const p = localizeProduct(raw);
                return (
                  <li
                    key={p.id}
                    className={cn(
                      "flex shrink-0 snap-start snap-always self-stretch",
                      isPdpChat
                        ? "w-[200px] sm:w-[228px]"
                        : "w-[156px] sm:w-[176px]",
                    )}
                  >
                    <ProductRowCard
                      product={p}
                      profile={profile}
                      presentation={presentation}
                      showPdpAlternativesCtas={Boolean(anchorP && isPdpChat)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      {onFollowUp && followUps.length > 0 && showFollowUpSection ? (
        <div className={cn("space-y-2", isPdpChat ? "pt-4 pb-4" : "pt-3")}>
          <EyebrowPill id="chat-followup-heading">
            {t("searchAiPanel.followUpHeading")}
          </EyebrowPill>
          <div className="min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-none">
            <ul
              role="list"
              aria-labelledby="chat-followup-heading"
              className="flex w-max list-none gap-1.5 pb-1 pr-1 pt-0.5 sm:gap-2"
            >
              {followUps.map((text) => (
                <li key={text} className="shrink-0">
                  <button
                    type="button"
                    title={text}
                    disabled={followUpDisabled}
                    onClick={() => onFollowUp(text)}
                    className={cn(
                      "max-w-[min(85vw,22rem)] truncate rounded-full border border-stone-200/95 bg-white px-2.5 py-1 text-left text-[14px] font-medium text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-stone-50",
                      "sm:max-w-[min(75vw,24rem)] sm:px-3 sm:py-1.5",
                      ui.home.focusRing,
                      "focus-visible:ring-offset-2",
                      followUpDisabled && "pointer-events-none opacity-50",
                    )}
                  >
                    {text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProductRowCard({
  product: p,
  profile,
  presentation = "default",
  showPdpAlternativesCtas = false,
  showPdpAnchorBuyNow = false,
}: {
  product: Product;
  profile: ShopperProfileId;
  presentation?: "default" | "pdpChat";
  /** PDP comparison “Other options” row — Buy now + Explore under the price. */
  showPdpAlternativesCtas?: boolean;
  /** PDP comparison “You’re viewing” anchor — Buy now under the price. */
  showPdpAnchorBuyNow?: boolean;
}) {
  const t = useT();
  const isPdpChat = presentation === "pdpChat";
  const meta = profile === "marina" ? p.bestFor[0] : p.deliveryETA;
  const label = [p.title, "—", p.brand, "—", formatBRL(p.price), "—", "view product details"].join(" ");

  const titleClass = cn(
    "shrink-0 text-pretty font-semibold text-stone-900",
    isPdpChat ? "line-clamp-2 text-[13px] leading-snug sm:text-[14px]" : "text-[14px] leading-snug",
  );

  const priceBlock = (
    <div className={cn("mt-auto", !isPdpChat && "space-y-1 pt-0.5")}>
      {!isPdpChat ? (
        <p className="text-pretty text-[14px] leading-snug text-stone-600">{meta}</p>
      ) : null}
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span
          className={cn(
            "font-semibold tabular-nums leading-none text-stone-900",
            isPdpChat ? "text-[15px] sm:text-base" : "text-[14px]",
          )}
        >
          {formatBRL(p.price)}
        </span>
        {p.oldPrice ? (
          <span
            className={cn(
              "tabular-nums leading-none text-stone-400 line-through",
              isPdpChat ? "text-[13px]" : "text-[14px]",
            )}
          >
            {formatBRL(p.oldPrice)}
          </span>
        ) : null}
      </div>
    </div>
  );

  const pdpChatBuyNowClass = cn(
    ui.home.focusRing,
    ui.home.ctaPrimaryFill,
    "flex min-h-9 items-center justify-center rounded-full px-2 py-1.5 text-center text-[12px] font-medium leading-tight sm:text-[13px]",
  );

  const pdpAlternativesCtas =
    showPdpAlternativesCtas && isPdpChat ? (
      <div className="mt-2 flex min-w-0 gap-1.5">
        <ProductBuyNowButton productId={p.id} className={cn(pdpChatBuyNowClass, "min-w-0 flex-1")}>
          {t("common.buyNow")}
        </ProductBuyNowButton>
        <ProductExploreLink
          productId={p.id}
          className={cn(
            ui.home.focusRing,
            ui.home.ctaSecondaryOutline,
            "flex min-h-9 min-w-0 flex-1 items-center justify-center rounded-full px-2 py-1.5 text-center text-[12px] font-medium leading-tight sm:text-[13px]",
          )}
        >
          {t("common.explore")}
        </ProductExploreLink>
      </div>
    ) : null;

  const pdpAnchorBuyNowCta =
    showPdpAnchorBuyNow && isPdpChat && !showPdpAlternativesCtas ? (
      <div className="mt-2 w-full min-w-0">
        <ProductBuyNowButton productId={p.id} className={cn(pdpChatBuyNowClass, "w-full")}>
          {t("common.buyNow")}
        </ProductBuyNowButton>
      </div>
    ) : null;

  return (
    <Card className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-xl p-0 transition hover:border-stone-300/90">
      <AskImageButton
        productLabel={p.title}
        productId={p.id}
        className={cn(
          "w-full shrink-0 bg-[#f5f5f5]",
          isPdpChat ? "h-[7.25rem] sm:h-32" : "h-16 sm:h-[4.75rem]",
        )}
      >
        <div className="relative h-full w-full">
          {hasMediaUrl(p.heroImage) ? (
            <Image
              src={p.heroImage}
              alt=""
              fill
              className="object-contain p-1"
              sizes={isPdpChat ? "(max-width:640px) 200px, 228px" : "(max-width:640px) 156px, 176px"}
              unoptimized
            />
          ) : (
            <EmptyMediaSlot className="absolute inset-0" variant="light" />
          )}
        </div>
      </AskImageButton>
      {showPdpAlternativesCtas && isPdpChat ? (
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col outline-none",
            isPdpChat ? "p-2.5" : "p-2",
          )}
        >
          <div className={cn("flex min-h-0 flex-1 flex-col", isPdpChat ? "gap-1.5" : "gap-1")}>
            <Link
              href={`/product/${p.id}`}
              aria-label={label}
              className={cn(titleClass, ui.home.focusRing, "rounded-sm outline-none focus-visible:ring-2")}
            >
              {p.title}
            </Link>
            {priceBlock}
          </div>
          {pdpAlternativesCtas}
        </div>
      ) : showPdpAnchorBuyNow && isPdpChat ? (
        <div className="flex min-h-0 flex-1 flex-col p-2.5 outline-none">
          <div className={cn("flex min-h-0 flex-1 flex-col gap-1.5")}>
            <Link
              href={`/product/${p.id}`}
              aria-label={label}
              className={cn(titleClass, ui.home.focusRing, "rounded-sm outline-none focus-visible:ring-2")}
            >
              {p.title}
            </Link>
            {priceBlock}
          </div>
          {pdpAnchorBuyNowCta}
        </div>
      ) : (
        <Link
          href={`/product/${p.id}`}
          aria-label={label}
          className={cn(
            "flex min-h-0 flex-1 flex-col outline-none",
            isPdpChat ? "p-2.5" : "p-2",
            ui.home.focusRing,
            "focus-visible:rounded-b-xl",
          )}
        >
          <div className={cn("flex min-h-0 flex-1 flex-col", isPdpChat ? "gap-1.5" : "gap-1")}>
            <p className={titleClass}>{p.title}</p>
            {priceBlock}
          </div>
        </Link>
      )}
    </Card>
  );
}
