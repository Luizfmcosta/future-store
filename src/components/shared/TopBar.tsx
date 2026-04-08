"use client";

import { SHOPPER_PORTRAIT } from "@/lib/shopperPortraits";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const openCart = useDemoStore((s) => s.openCart);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const logoOnDark = useTopBarLogoOnDark(pathname);
  const t = useT();

  return (
    <header className={cn("absolute left-0 right-0 top-0 z-40", className)}>
      <div className="flex w-full items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
        <Link
          href="/"
          aria-label={t("topBar.ariaHome")}
          className="inline-flex h-9 shrink-0 items-center"
        >
          {logoOnDark ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/branding/fs-reduced.svg"
              alt=""
              className={cn(
                "h-[calc(2.25rem*0.95)] w-auto transition-[filter,opacity] duration-500",
                "brightness-0 invert opacity-100",
              )}
            />
          ) : (
            <span
              aria-hidden
              className={cn(
                "inline-block h-[calc(2.25rem*0.95)] w-[calc(2.25rem*0.95*569/316)] shrink-0 bg-[#232526] opacity-[0.88] transition-opacity duration-500",
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

        <div className="flex items-center gap-1.5">
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
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a]/75 text-white/80 backdrop-blur-xl transition-colors hover:bg-[#2a2a2a]/90"
            aria-label={t("common.cart")}
          >
            <ShoppingBag className="size-[17px]" strokeWidth={1.75} />
            {cartLineId ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-white px-0.5 text-[8px] font-bold text-[#1a1a1a]">
                1
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
