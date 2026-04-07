"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { RefineDrawer } from "@/components/search/RefineDrawer";
import { NarrativeChrome } from "@/components/shared/NarrativeChrome";
import { PresenterPanel } from "@/components/shared/PresenterPanel";
import { RayXOverlay } from "@/components/rayx/RayXOverlay";
import { ResizeEdgeHandle } from "@/components/shared/ResizeEdgeHandle";
import { FloatingSearchDock } from "@/components/search/FloatingSearchDock";
import { StorefrontMain } from "@/components/shared/StorefrontMain";
import { StorefrontPortalProvider } from "@/components/shared/StorefrontPortalContext";
import { TopBar } from "@/components/shared/TopBar";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Minimize2 } from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

const AIVisionOverlay = dynamic(
  () => import("@/components/vision/AIVisionOverlay").then((m) => m.AIVisionOverlay),
  { ssr: false },
);

function getFullscreenElement(): Element | null {
  const d = document as Document & { webkitFullscreenElement?: Element | null };
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
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
  const isAboutRoute = pathname === "/about";
  const aiMode = useDemoStore((s) => s.aiMode);
  const setScreen = useDemoStore((s) => s.setCurrentScreen);
  const storefrontRef = useRef<HTMLDivElement>(null);
  const [storefrontPortalMount, setStorefrontPortalMount] = useState<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMd = useMediaQuery("(min-width: 768px)");
  const [storefrontWidth, setStorefrontWidth] = useState(STOREFRONT_DEFAULT);
  const t = useT();

  useEffect(() => {
    if (pathname === "/") setScreen("home");
    else if (pathname.startsWith("/search")) setScreen("search");
    else if (pathname.startsWith("/chat")) setScreen("search");
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

  const exitFullscreen = useCallback(async () => {
    try {
      if (getFullscreenElement()) await exitFullscreenDoc();
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-visible bg-[var(--app-canvas)] md:h-dvh md:max-h-dvh md:flex-row md:overflow-hidden">
      <NarrativeChrome compact className="md:hidden" />

      <NarrativeChrome className="hidden md:block" />

      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-x-visible sm:p-6 md:p-8",
          isAboutRoute ? "p-2" : "p-3",
        )}
      >
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
          {/* Canvas mat (2px); h-full restores scroll height chain for flex/min-h-0. */}
          <div
            className={cn(
              "flex h-full min-h-0 w-full flex-col rounded-[1.75rem] bg-[var(--app-canvas)] p-0.5",
              "shadow-[0_24px_56px_-28px_rgba(0,0,0,0.18)]",
              isFullscreen && "!rounded-none !p-0 shadow-none"
            )}
          >
            <div
              ref={storefrontRef}
              data-storefront-window
              data-home-editorial="true"
              className={cn(
                "relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[calc(1.75rem-2px)] border-0",
                /* #121212 matches HomeFooter — avoids white AA fringe vs canvas at rounded corners. */
                "bg-[#121212]",
                isFullscreen &&
                  "!h-screen !max-h-none !w-screen !max-w-none !rounded-none"
              )}
            >
              {isFullscreen ? (
                <button
                  type="button"
                  onClick={exitFullscreen}
                  className={cn(
                    "absolute left-3 top-3 z-[70] flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-medium backdrop-blur-md transition",
                    "border-stone-200/90 bg-white/90 text-stone-800 hover:bg-stone-50"
                  )}
                  aria-label={t("appShell.exitFullscreen")}
                >
                  <Minimize2 className="h-4 w-4 shrink-0 opacity-90" />
                  {t("appShell.exitFullscreen")}
                </button>
              ) : null}

              <StorefrontPortalProvider mountNode={storefrontPortalMount}>
                <div
                  className={cn(
                    "relative z-10 flex min-h-0 flex-1 flex-col",
                    isFullscreen && "pt-12"
                  )}
                >
                  <TopBar />
                  <div className="relative min-h-0 flex flex-1 flex-col">
                    <Suspense
                      fallback={
                        <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-32 pt-5 sm:px-6 sm:pb-32 sm:pt-6">
                          {children}
                        </main>
                      }
                    >
                      <StorefrontMain>{children}</StorefrontMain>
                    </Suspense>
                    <AnimatePresence>{aiMode ? <AIVisionOverlay key="ai-vision" /> : null}</AnimatePresence>
                  </div>
                  <Suspense fallback={null}>
                    <FloatingSearchDock />
                  </Suspense>
                </div>
                <div
                  ref={setStorefrontPortalMount}
                  className="pointer-events-none absolute inset-0 z-[100]"
                  aria-hidden
                />
              </StorefrontPortalProvider>
            </div>
          </div>

          <ResizeEdgeHandle
            theme="window-light"
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
