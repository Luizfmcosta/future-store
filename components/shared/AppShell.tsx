"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { RefineDrawer } from "@/components/search/RefineDrawer";
import { NarrativeChrome } from "@/components/shared/NarrativeChrome";
import { PresenterPanel } from "@/components/shared/PresenterPanel";
import { RayXOverlay } from "@/components/rayx/RayXOverlay";
import { ResizeEdgeHandle } from "@/components/shared/ResizeEdgeHandle";
import { TopBar } from "@/components/shared/TopBar";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { usePathname } from "next/navigation";
import { Minimize2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function getFullscreenElement(): Element | null {
  const d = document as Document & { webkitFullscreenElement?: Element | null };
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
}

async function requestFullscreenEl(el: HTMLElement) {
  if (el.requestFullscreen) {
    await el.requestFullscreen();
    return;
  }
  const w = el as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
  if (w.webkitRequestFullscreen) await w.webkitRequestFullscreen();
}

async function exitFullscreenDoc() {
  const d = document as Document & { webkitExitFullscreen?: () => Promise<void> };
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }
  if (d.webkitExitFullscreen) await d.webkitExitFullscreen();
}

const STOREFRONT_MIN = 280;
const STOREFRONT_MAX = 800;
const STOREFRONT_DEFAULT = 440;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const setScreen = useDemoStore((s) => s.setCurrentScreen);
  const storefrontRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMd = useMediaQuery("(min-width: 768px)");
  const [storefrontWidth, setStorefrontWidth] = useState(STOREFRONT_DEFAULT);

  useEffect(() => {
    if (pathname === "/") setScreen("home");
    else if (pathname.startsWith("/search")) setScreen("search");
    else if (pathname.startsWith("/product")) setScreen("pdp");
  }, [pathname, setScreen]);

  const syncFullscreen = useCallback(() => {
    const el = storefrontRef.current;
    const fs = getFullscreenElement();
    setIsFullscreen(!!el && fs === el);
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("webkitfullscreenchange", syncFullscreen as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener("webkitfullscreenchange", syncFullscreen as EventListener);
    };
  }, [syncFullscreen]);

  const toggleFullscreen = useCallback(async () => {
    const el = storefrontRef.current;
    if (!el) return;
    try {
      if (!getFullscreenElement()) {
        await requestFullscreenEl(el);
      } else {
        await exitFullscreenDoc();
      }
    } catch {
      /* gesture / unsupported */
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (getFullscreenElement()) await exitFullscreenDoc();
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-visible bg-[var(--app-canvas)] md:flex-row">
      <NarrativeChrome
        compact
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        className="md:hidden"
      />

      <NarrativeChrome
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        className="hidden md:block"
      />

      <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-x-visible p-3 sm:p-6 md:p-8">
        <div
          className={cn(
            "relative mx-auto w-full max-w-[440px] overflow-visible",
            "h-[min(100dvh-7rem,880px)] max-h-[880px] md:h-[min(100dvh-4rem,880px)]",
            "md:min-w-[280px] md:max-w-[800px]"
          )}
          style={
            isMd && !isFullscreen
              ? { width: storefrontWidth }
              : undefined
          }
        >
          <div
            ref={storefrontRef}
            className={cn(
              "relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[#060708] shadow-[0_24px_64px_-32px_rgba(0,0,0,0.65)]",
              isFullscreen && "!h-screen !max-h-none !w-screen !max-w-none !rounded-none border-0 shadow-none"
            )}
          >
            {isFullscreen ? (
              <button
                type="button"
                onClick={exitFullscreen}
                className="absolute left-3 top-3 z-[70] flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#08090c]/92 px-3 py-2 text-[12px] font-medium text-[#e8ecf4] backdrop-blur-md transition hover:bg-[#12151c]/95"
                aria-label="Exit fullscreen"
              >
                <Minimize2 className="h-4 w-4 shrink-0 opacity-90" />
                Exit fullscreen
              </button>
            ) : null}

            <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.03),_transparent_50%)]" />
            </div>

            <div
              className={cn(
                "relative z-10 flex min-h-0 flex-1 flex-col",
                isFullscreen && "pt-12"
              )}
            >
              <TopBar />
              <main className="min-h-0 flex-1 scroll-smooth overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-28 pt-5 sm:px-6 sm:pb-16 sm:pt-6">{children}</main>
            </div>
          </div>

          <ResizeEdgeHandle
            theme="window"
            disabled={isFullscreen || !isMd}
            onDelta={(dx) =>
              setStorefrontWidth((w) =>
                Math.min(STOREFRONT_MAX, Math.max(STOREFRONT_MIN, w + dx))
              )
            }
          />
        </div>
      </div>

      <RayXOverlay />
      <RefineDrawer />
      <CartDrawer />
      <PresenterPanel />
    </div>
  );
}
