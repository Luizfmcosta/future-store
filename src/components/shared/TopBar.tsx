"use client";

import { SearchModeTabs } from "@/components/search/SearchModeTabs";
import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { SHOPPER_PORTRAIT } from "@/lib/shopperPortraits";
import { storefrontFloatingControlGlass, ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { LogIn, ShoppingBag } from "lucide-react";
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
      queueMicrotask(() => setOnDark(false));
      return;
    }
    queueMicrotask(() => measure());
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

/** Pixels of `main` scroll over which the header scrim approaches full strength (longer = gentler). */
const HEADER_SCRIM_FADE_SCROLL_PX = 96;

/** 0–1 opacity for the header gradient vs storefront `main` scroll position. */
function useStorefrontMainScrimOpacity(pathname: string) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    /* Search: `main` stays white under the bar — scroll scrim reads as a horizontal band / hairline. */
    if (pathname === "/search") {
      queueMicrotask(() => setOpacity(0));
      return;
    }
    const main = document.querySelector<HTMLElement>("[data-storefront-window] main");
    const read = () => {
      const st = main?.scrollTop ?? 0;
      const linear = Math.min(1, st / HEADER_SCRIM_FADE_SCROLL_PX);
      /* Linear: scrim reaches readable strength sooner (cubic was delaying most of the change). */
      setOpacity(linear);
    };
    queueMicrotask(read);
    if (!main) return;
    main.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      main.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [pathname]);

  return opacity;
}

function signInNoop() {
  /* Demo storefront: account sign-in is not wired. */
}

export function TopBar({ className }: TopBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const openCart = useDemoStore((s) => s.openCart);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const logoOnDark = useTopBarLogoOnDark(pathname);
  const headerScrimOpacity = useStorefrontMainScrimOpacity(pathname);
  const t = useT();

  const isSearchPage = pathname === "/search";
  const searchView = isSearchPage ? getSearchViewParam(searchParams) : "results";

  const logo = (
    <Link
      href="/"
      aria-label={t("topBar.ariaHome")}
      className="inline-flex h-12 max-h-12 shrink-0 items-center overflow-hidden"
    >
      {logoOnDark ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/branding/fs-reduced.svg"
          alt=""
          className={cn(
            "h-full w-auto max-h-12 object-contain object-left transition-[filter,opacity] duration-500",
            "brightness-0 invert opacity-100",
          )}
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "inline-block h-12 w-[calc(3rem*569/316)] max-w-full shrink-0 bg-[#1A1A1A]/90 transition-opacity duration-500",
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
    <div className="flex shrink-0 items-center gap-3">
      {activeProfile === "marina" ? (
        <span
          className={cn(
            /* Same 48×48 footprint as cart; 3px inset lets frosted fill read as a ring between hairline border and photo. */
            "relative inline-flex h-12 w-12 min-h-12 min-w-12 shrink-0 overflow-hidden rounded-full p-[3px]",
            storefrontFloatingControlGlass,
            "transition-[border-color,background-color,box-shadow] duration-200",
          )}
          aria-hidden
        >
          <span className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-full bg-[#1a1a1a]">
            <Image
              src={SHOPPER_PORTRAIT.marina}
              alt=""
              fill
              className="object-cover"
              sizes="42px"
              unoptimized
            />
          </span>
        </span>
      ) : activeProfile === "ricardo" ? (
        <button
          type="button"
          onClick={signInNoop}
          className={cn(
            "relative inline-flex h-12 w-12 min-h-12 min-w-12 shrink-0 items-center justify-center rounded-full",
            "border border-stone-200/55 bg-white/32 text-stone-700 shadow-[0_6px_22px_rgba(15,23,42,0.06)] backdrop-blur-md backdrop-saturate-150",
            "transition-[border-color,background-color,box-shadow] duration-200 hover:border-stone-300/70 hover:bg-white/48 active:bg-white/40",
            ui.home.focusRing,
          )}
          aria-label={t("topBar.signIn")}
        >
          <LogIn className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
      ) : null}

      <button
        type="button"
        onClick={openCart}
        className={cn(
          "relative inline-flex h-12 w-12 min-h-12 min-w-12 shrink-0 items-center justify-center rounded-full text-stone-700",
          storefrontFloatingControlGlass,
          "transition-[border-color,background-color,box-shadow] duration-200 hover:border-stone-300/80 hover:bg-white/92 active:bg-white/94",
          ui.home.focusRing,
        )}
        aria-label={t("common.cart")}
      >
        <ShoppingBag className="size-5" strokeWidth={1.75} aria-hidden />
        {cartLineId ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-stone-900 px-0.5 text-[9px] font-bold text-white">
            1
          </span>
        ) : null}
      </button>
    </div>
  );

  return (
    <header className={cn("absolute left-0 right-0 top-0 z-40", className)}>
      <div className="relative isolate">
        {/* Scrim: inverse of logo treatment — dark fade when the logo is white on the hero, light fade on pale surfaces. */}
        <div
          aria-hidden
          style={{ opacity: headerScrimOpacity }}
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 will-change-[opacity]",
            logoOnDark
              ? "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.54)_32%,rgba(0,0,0,0.2)_58%,transparent_93%)]"
              : "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.78)_26%,rgba(255,255,255,0.42)_48%,rgba(255,255,255,0.12)_76%,transparent_94%)]",
          )}
        />
        <div
          className={cn(
            "relative z-10",
            isSearchPage
              ? "flex w-full items-center gap-x-2 px-4 pb-3.5 pt-5 sm:gap-x-3 sm:px-6 sm:pb-4 sm:pt-6"
              : "flex w-full items-center justify-between px-4 pb-3.5 pt-5 sm:px-6 sm:pb-4 sm:pt-6",
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
      </div>
    </header>
  );
}
