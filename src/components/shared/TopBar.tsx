"use client";

import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type TopBarProps = {
  className?: string;
};

/** Height from top of viewport used to decide if the hero still sits behind the logo strip. */
const HOME_LOGO_BAND_PX = 56;

/**
 * Home hero is dark; modules below are light. When the hero has scrolled up so its
 * bottom edge clears this band, the logo switches to #232526 (no pixel sampling — works
 * over video/gradients).
 */
function useHomeHeroLogoOnDark() {
  const [onDark, setOnDark] = useState(true);

  const measure = useCallback(() => {
    const hero = document.getElementById("home-hero");
    if (!hero) return;
    const { bottom } = hero.getBoundingClientRect();
    setOnDark(bottom > HOME_LOGO_BAND_PX);
  }, []);

  useEffect(() => {
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
  }, [measure]);

  return onDark;
}

export function TopBar({ className }: TopBarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const openCart = useDemoStore((s) => s.openCart);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const logoIsOnDark = useHomeHeroLogoOnDark();
  const t = useT();

  if (!isHome) {
    return (
      <header
        className={cn(
          /* Same solid surface as `main` (bg-white) — no translucent bar banding. */
          "sticky top-0 z-40 shrink-0 border-b border-stone-200/90 bg-white",
          className,
        )}
      >
        <div className="mx-auto flex w-full items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3">
          <Link href="/" aria-label={t("topBar.ariaHome")} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/branding/fs-reduced.svg" alt="" className="h-6 w-auto opacity-90 sm:h-7" />
          </Link>
          <div className="flex items-center gap-1.5">
            <nav className="flex items-center rounded-full bg-[#2a2a2a]/75 backdrop-blur-xl">
              <Link
                href="/about"
                className="rounded-full px-4 py-2 text-[12px] font-medium text-white/80 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white sm:text-[13px]"
              >
                {t("common.about")}
              </Link>
            </nav>
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center justify-center rounded-full bg-[#2a2a2a]/75 p-2 text-white/80 backdrop-blur-xl transition-colors hover:bg-[#2a2a2a]/90"
              aria-label={t("common.cart")}
            >
              <Lock className="size-[15px]" strokeWidth={1.5} />
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

  return (
    <header className={cn("absolute left-0 right-0 top-0 z-40", className)}>
      <div className="flex w-full items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4">
        {/* Logo — left side, auto-contrast */}
        <Link href="/" aria-label={t("topBar.ariaHome")} className="shrink-0">
          {logoIsOnDark ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/branding/fs-reduced.svg"
              alt=""
              className={cn(
                "h-6 w-auto transition-[filter,opacity] duration-500 sm:h-7",
                "brightness-0 invert opacity-100",
              )}
            />
          ) : (
            <span
              aria-hidden
              className={cn(
                "inline-block h-6 w-[calc(1.5rem*569/316)] shrink-0 bg-[#232526] opacity-[0.88] transition-opacity duration-500 sm:h-7 sm:w-[calc(1.75rem*569/316)]",
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

        {/* Right side: nav pill + cart — aligned right */}
        <div className="flex items-center gap-1.5">
          <nav className="flex items-center rounded-full bg-[#2a2a2a]/75 backdrop-blur-xl">
            <Link
              href="/about"
              className="rounded-full px-4 py-2 text-[12px] font-medium text-white/80 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white sm:text-[13px]"
            >
              {t("common.about")}
            </Link>
          </nav>

          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center justify-center rounded-full bg-[#2a2a2a]/75 p-2 text-white/80 backdrop-blur-xl transition-colors hover:bg-[#2a2a2a]/90"
            aria-label={t("common.cart")}
          >
            <Lock className="size-[15px]" strokeWidth={1.5} />
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
