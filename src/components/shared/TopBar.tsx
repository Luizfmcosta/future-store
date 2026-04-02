"use client";

import { ui } from "@/lib/ui-tokens";
import { shopperDisplayName, SHOPPER_PORTRAIT } from "@/lib/shopperPortraits";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/** Same footprint + corner radius for avatar and cart in the storefront top bar. */
const topBarControl =
  "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg";

type TopBarProps = {
  className?: string;
};

/** Storefront-only chrome — narrative controls live in `NarrativeChrome`. */
export function TopBar({ className }: TopBarProps) {
  const openCart = useDemoStore((s) => s.openCart);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const shopperName = shopperDisplayName(activeProfile);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 shrink-0 border-b border-white/[0.06] bg-[#0a0c0e]/92 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0a0c0e]/85",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-full items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5">
        <div className="flex min-w-0 shrink-0 items-center sm:h-9">
          <Link
            href="/"
            className={cn(
              "group flex min-h-9 min-w-0 shrink-0 items-center rounded-lg px-1 py-0.5 transition-colors duration-150 ease-out hover:bg-white/[0.06] focus-visible:outline-none sm:min-h-0",
              ui.focusRing,
              "focus-visible:rounded-lg"
            )}
            aria-label="Home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local SVG brand asset */}
            <img
              src="/branding/fs-reduced.svg"
              alt=""
              className="h-7 w-auto max-w-[140px] object-contain object-left opacity-[0.95] transition group-hover:opacity-100 sm:h-8"
            />
          </Link>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <div
            className={cn(topBarControl, "border border-white/[0.08]")}
            role="img"
            aria-label={`Active shopper: ${shopperName}`}
          >
            <Image
              src={SHOPPER_PORTRAIT[activeProfile]}
              alt=""
              width={36}
              height={36}
              className="size-full object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={openCart}
            className={cn(
              topBarControl,
              "border border-white/[0.08] bg-white/[0.06] p-2 text-[#9ca8b8] transition-colors hover:border-white/[0.12] hover:bg-white/[0.09] hover:text-[#eef1f6]",
              ui.focusRing,
              "focus-visible:rounded-lg",
            )}
            aria-label="Cart"
          >
            <ShoppingCart className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
            {cartLineId ? (
              <span
                className="absolute right-1 top-1 size-1.5 rounded-full bg-[#e85d5d] ring-2 ring-[#0a0c0e]"
                aria-hidden
              />
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
