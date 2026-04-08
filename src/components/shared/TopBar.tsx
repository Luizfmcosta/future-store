"use client";

import { SearchModeTabs } from "@/components/search/SearchModeTabs";
import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { SHOPPER_PORTRAIT } from "@/lib/shopperPortraits";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type TopBarProps = {
  className?: string;
};

/** Height from top of viewport — hero bottom above this band ⇒ logo reads on dark. */
const HERO_LOGO_BAND_PX = 56;

/**
 * Home: dark hero under the bar; logo inverts while hero spans the band.
 * Other routes: light surfaces → gray logo (#232526 mask).
 */
function useTopBarLogoOnDark(pathname: string) {
  const isHome = pathname === "/";
  const measureDarkHero = isHome;
  const [onDark, setOnDark] = useState(measureDarkHero);

  const measure = useCallback(() => {
    if (!measureDarkHero) {
      setOnDark(false);
      return;
    }
    const el = document.getElementById("home-hero");
    if (!el) {
      /* Hero not mounted yet (or strict mode) — keep light logo off dark until we know; default to inverted on hero routes. */
      if (measureDarkHero) setOnDark(true);
      return;
    }
    const { bottom } = el.getBoundingClientRect();
    setOnDark(bottom > HERO_LOGO_BAND_PX);
  }, [measureDarkHero]);

  useEffect(() => {
    if (!measureDarkHero) {
      setOnDark(false);
      return;
    }
    measure();
    const main = document.querySelector<HTMLElement>("[data-storefront-window] main");
    if (main) {
      main.addEventListener("scroll", measure, { passive: true });
    }
    window.addEventListener("resize", measure);
    return () => {
      if (main) {
        main.removeEventListener("scroll", measure);
      }
      window.removeEventListener("resize", measure);
    };
  }, [measure, measureDarkHero]);

  return measureDarkHero ? onDark : false;
}

export function TopBar({ className }: TopBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const openCart = useDemoStore((s) => s.openCart);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const logoOnDark = useTopBarLogoOnDark(pathname);
  const t = useT();

  const isSearchPage = pathname === "/search";
  const searchView = isSearchPage ? getSearchViewParam(searchParams) : "results";

  const logo = (
    <Link
      href="/"
      aria-label={t("topBar.ariaHome")}
      className="inline-flex h-9 max-h-9 shrink-0 items-center overflow-hidden"
    >
      {logoOnDark ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/branding/fs-reduced.svg"
          alt=""
          className={cn(
            "h-full w-auto max-h-9 object-contain object-left transition-[filter,opacity] duration-500",
            "brightness-0 invert opacity-100",
          )}
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "inline-block h-9 w-[calc(2.25rem*569/316)] max-w-full shrink-0 bg-[#1A1A1A]/90 transition-opacity duration-500",
          )}
          style={{
            maskImage: "url(/branding/fs-reduced.svg)",
            WebkitMaskImage: "url(/branding/fs-reduced.svg)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "left center",
          }}
        />
      )}
    </Link>
  );

  const rightActions = (
    <div className="flex shrink-0 items-center gap-1.5">
      {activeProfile === "marina" ? (
        <span
          className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#1a1a1a] ring-1 ring-white/15"
          aria-hidden
        >
          <Image
            src={SHOPPER_PORTRAIT.marina}
            alt=""
            width={36}
            height={36}
            className="size-full object-cover"
            unoptimized
          />
        </span>
      ) : null}

      <button
        type="button"
        onClick={openCart}
        className={cn(
          "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          /* Same glass as `ui.promptInputKit` / floating search — white, border, blur, soft shadow */
          "border border-stone-200/60 bg-white/86 text-stone-700 shadow-[0_8px_28px_rgba(15,23,42,0.08)] backdrop-blur-md backdrop-saturate-150",
          "transition-[border-color,background-color,box-shadow] duration-200 hover:border-stone-300/80 hover:bg-white/92 active:bg-white/94",
          ui.home.focusRing,
        )}
        aria-label={t("common.cart")}
      >
        <ShoppingBag className="size-[17px]" strokeWidth={1.75} aria-hidden />
        {cartLineId ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-stone-900 px-0.5 text-[8px] font-bold text-white">
            1
          </span>
        ) : null}
      </button>
    </div>
  );

  return (
    <header className={cn("absolute left-0 right-0 top-0 z-40", className)}>
      <div
        className={cn(
          isSearchPage
            ? "flex w-full items-center gap-x-2 px-4 py-3.5 sm:gap-x-3 sm:px-6 sm:py-4"
            : "flex w-full items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4",
        )}
      >
        {isSearchPage ? (
          <>
            <div className="flex shrink-0 items-center">{logo}</div>
            <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center px-0.5">
              <SearchModeTabs active={searchView} />
            </div>
            <div className="flex shrink-0 items-center">{rightActions}</div>
          </>
        ) : (
          <>
            {logo}
            {rightActions}
          </>
        )}
      </div>
    </header>
  );
}
