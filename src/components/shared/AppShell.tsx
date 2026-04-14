"use client";

import { AgentArchitectureBento } from "@/components/agent/AgentArchitectureBento";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { RefineDrawer } from "@/components/search/RefineDrawer";
import { PresenterPanel } from "@/components/shared/PresenterPanel";
import { RayXOverlay } from "@/components/rayx/RayXOverlay";
import { ResizeEdgeHandle } from "@/components/shared/ResizeEdgeHandle";
import { FloatingSearchDock } from "@/components/search/FloatingSearchDock";
import { StorefrontMain } from "@/components/shared/StorefrontMain";
import { StorefrontPortalProvider } from "@/components/shared/StorefrontPortalContext";
import { TopBarProfileCluster } from "@/components/shared/ProfileSwitcher";
import { ui } from "@/lib/ui-tokens";
import { ResetDemoFloatingControl } from "@/components/shared/ResetDemoFloatingControl";
import { TopBar } from "@/components/shared/TopBar";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useT } from "@/lib/useT";
import {
  clampStorefrontWidth,
  STOREFRONT_FRAME_HEIGHT_DESKTOP,
  STOREFRONT_FRAME_HEIGHT_PHONE,
  STOREFRONT_PHONE_FRAME_MAX_WIDTH,
  STOREFRONT_WIDTH,
} from "@/lib/storefrontViewport";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Minimize2, Monitor, Smartphone } from "lucide-react";
import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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

/** Above this browser width, the shell is laid out at 1920 CSS px and scaled up (e.g. 4K ≈ 200% zoom). */
const VIEWPORT_LAYOUT_BASE_PX = 1920;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const aiMode = useDemoStore((s) => s.aiMode);
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const setScreen = useDemoStore((s) => s.setCurrentScreen);
  const storefrontWidth = useDemoStore((s) => s.storefrontWidth);
  const setStorefrontWidth = useDemoStore((s) => s.setStorefrontWidth);
  const storefrontRef = useRef<HTMLDivElement>(null);
  const [storefrontPortalMount, setStorefrontPortalMount] = useState<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMd = useMediaQuery("(min-width: 768px)");
  const t = useT();

  const [viewportLayoutScale, setViewportLayoutScale] = useState(1);
  const setShellViewportLayoutScale = useDemoStore((s) => s.setShellViewportLayoutScale);

  const updateViewportLayoutScale = useCallback(() => {
    if (typeof window === "undefined") return;
    if (getFullscreenElement()) {
      setViewportLayoutScale(1);
      setShellViewportLayoutScale(1);
      return;
    }
    const w = window.innerWidth;
    const next = w > VIEWPORT_LAYOUT_BASE_PX ? w / VIEWPORT_LAYOUT_BASE_PX : 1;
    setViewportLayoutScale(next);
    setShellViewportLayoutScale(next);
  }, [setShellViewportLayoutScale]);

  useLayoutEffect(() => {
    /* Viewport scale must run before paint to avoid a 4K layout flash; internal setState is intentional. */
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with window dimensions before paint
    updateViewportLayoutScale();
    window.addEventListener("resize", updateViewportLayoutScale);
    document.addEventListener("fullscreenchange", updateViewportLayoutScale);
    document.addEventListener("webkitfullscreenchange", updateViewportLayoutScale as EventListener);
    return () => {
      window.removeEventListener("resize", updateViewportLayoutScale);
      document.removeEventListener("fullscreenchange", updateViewportLayoutScale);
      document.removeEventListener("webkitfullscreenchange", updateViewportLayoutScale as EventListener);
    };
  }, [updateViewportLayoutScale]);

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

  const mobilePresetActive =
    isMd && Math.abs(storefrontWidth - STOREFRONT_WIDTH.presetMobile) < 14;
  const desktopPresetActive =
    isMd && Math.abs(storefrontWidth - STOREFRONT_WIDTH.presetDesktop) < 18;
  const presetHighlightVisible = mobilePresetActive || desktopPresetActive;
  const isAiAgent = activeProfile === "aiAgent";
  /** Phone frame height unless wide viewport + wide dragged width (not `xl`/`2xl` on a narrow preset). */
  const storefrontFrameHeightClass =
    !isMd || storefrontWidth <= STOREFRONT_PHONE_FRAME_MAX_WIDTH
      ? STOREFRONT_FRAME_HEIGHT_PHONE
      : STOREFRONT_FRAME_HEIGHT_DESKTOP;

  const scaledChrome = viewportLayoutScale > 1;
  /** Fills the fixed logical height of the scaled shell; avoids `100dvh` (real monitor) blowing past `100dvh/scale` after transform. */
  const storefrontFrameHeightWhenScaledClass =
    "min-h-0 flex-1 basis-0 self-stretch h-full max-h-full";

  return (
    <div
      className={cn(
        "flex h-dvh min-h-0 max-h-dvh w-full flex-col overflow-hidden bg-[var(--app-canvas)]",
        scaledChrome ? "items-center" : "items-stretch",
      )}
    >
      <div
        className={cn(
          "flex min-h-0 flex-col overflow-x-hidden overflow-y-hidden",
          scaledChrome ? "origin-top shrink-0" : "min-w-0 flex-1",
        )}
        style={
          scaledChrome
            ? {
                width: VIEWPORT_LAYOUT_BASE_PX,
                height: `calc(100dvh / ${viewportLayoutScale})`,
                maxHeight: `calc(100dvh / ${viewportLayoutScale})`,
                minHeight: `calc(100dvh / ${viewportLayoutScale})`,
                transform: `scale(${viewportLayoutScale})`,
                transformOrigin: "top center",
                ["--shell-vp-scale" as string]: String(viewportLayoutScale),
              }
            : { width: "100%", height: "100%", minHeight: 0 }
        }
      >
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-hidden",
            isAiAgent
              ? "items-stretch justify-stretch p-0"
              : scaledChrome
                ? "items-stretch justify-stretch px-20 py-3 sm:py-6 md:py-8 2xl:py-12"
                : "items-center justify-center px-20 py-3 sm:py-6 md:py-8 2xl:py-12",
          )}
        >
          <div
            className={cn(
              "relative flex min-w-0 flex-col items-stretch overflow-x-hidden",
              isAiAgent
                ? "h-full min-h-0 w-full max-w-none flex-1"
                : scaledChrome
                  ? "h-full min-h-0 w-full max-w-none flex-1"
                  : "w-full max-w-[440px] md:max-w-none",
            )}
          >
          {isAiAgent ? (
            <AgentArchitectureBento className="h-full min-h-0 w-full flex-1" />
          ) : (
            <>
              <div
                data-storefront-container
                className={cn(
                  "@container relative mx-auto w-full max-w-[440px] overflow-visible",
                  scaledChrome && !isFullscreen
                    ? storefrontFrameHeightWhenScaledClass
                    : storefrontFrameHeightClass,
                  "md:min-w-[340px] md:max-w-[1920px]",
                )}
                style={
                  isMd && !isFullscreen
                    ? {
                        width: storefrontWidth,
                        maxWidth: "100%",
                      }
                    : undefined
                }
              >
                <div
                  className={cn(
                    "flex h-full min-h-0 w-full flex-col rounded-[1.75rem] bg-[var(--app-canvas)] p-0.5",
                    "shadow-[0_24px_56px_-28px_rgba(0,0,0,0.18)]",
                    isFullscreen && "!rounded-none !p-0 shadow-none",
                  )}
                >
                  <div
                    ref={storefrontRef}
                    data-storefront-window
                    data-home-editorial="true"
                    className={cn(
                      "relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[calc(1.75rem-2px)] border-0",
                      "bg-[#121212]",
                      isFullscreen && "!h-screen !max-h-none !w-screen !max-w-none !rounded-none",
                    )}
                  >
                    {isFullscreen ? (
                      <button
                        type="button"
                        onClick={exitFullscreen}
                        className={cn(
                          "absolute left-3 top-3 z-[70] flex items-center gap-2 rounded-lg border px-3 py-2 text-[14px] font-medium backdrop-blur-md transition",
                          "border-stone-200/90 bg-white/90 text-stone-800 hover:bg-stone-50",
                        )}
                        aria-label={t("appShell.exitFullscreen")}
                      >
                        <Minimize2 className="h-4 w-4 shrink-0 opacity-90" />
                        {t("appShell.exitFullscreen")}
                      </button>
                    ) : null}

                    <StorefrontPortalProvider mountNode={storefrontPortalMount}>
                      <div className={cn("relative z-10 flex min-h-0 flex-1 flex-col", isFullscreen && "pt-12")}>
                        <Suspense fallback={null}>
                          <TopBar />
                        </Suspense>
                        <div className="relative min-h-0 flex flex-1 flex-col">
                          <Suspense
                            fallback={
                              <main
                                data-storefront-scroll=""
                                className="min-h-0 flex-1 overflow-y-auto scrollbar-none bg-white px-4 pb-32 pt-5 sm:px-6 sm:pb-32 sm:pt-6"
                              >
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
                      <RayXOverlay />
                      <RefineDrawer />
                      <CartDrawer />
                      <PresenterPanel />
                    </StorefrontPortalProvider>
                  </div>
                </div>
                <ResizeEdgeHandle
                  edge="left"
                  visual="none"
                  theme="window-light"
                  disabled={isFullscreen || !isMd}
                  ariaLabel={t("appShell.resizeHandle")}
                  onDelta={(dx) => setStorefrontWidth((w) => clampStorefrontWidth(w + dx))}
                />
                <ResizeEdgeHandle
                  edge="right"
                  visual="none"
                  theme="window-light"
                  disabled={isFullscreen || !isMd}
                  ariaLabel={t("appShell.resizeHandle")}
                  onDelta={(dx) => setStorefrontWidth((w) => clampStorefrontWidth(w + dx))}
                />
              </div>
            </>
          )}
          </div>
        </div>

        <div
          className={cn(
            /* Above storefront portal (z-[100]), splash (z-[200]), welcome gate (z-[250]). */
            "pointer-events-auto fixed right-4 z-[280] hidden md:flex items-center",
            "top-[max(1rem,env(safe-area-inset-top))]",
            isAiAgent && "!hidden",
          )}
          role="group"
          aria-label={t("appShell.widthPresetsGroup")}
        >
          <div className={cn(ui.glassChrome.clusterShell, "inline-flex min-w-[6.5625rem]")}>
            <div className={ui.glassChrome.widthPresetTrack}>
              <motion.div
                className={cn(
                  "pointer-events-none absolute left-1.5 top-1.5 bottom-1.5 rounded-full",
                  ui.floatingChrome.presetKnob,
                )}
                style={{ width: "calc((100% - 12px) / 2)" }}
                initial={false}
                animate={{
                  x: mobilePresetActive ? 0 : "100%",
                  opacity: presetHighlightVisible ? 1 : 0,
                  scale: presetHighlightVisible ? 1 : 0.92,
                }}
                transition={{
                  type: "spring",
                  stiffness: 520,
                  damping: 34,
                  mass: 0.7,
                  opacity: { duration: 0.2 },
                }}
              />
              <button
                type="button"
                onClick={() => setStorefrontWidth(clampStorefrontWidth(STOREFRONT_WIDTH.presetMobile))}
                className={cn(
                  "relative z-10 flex flex-1 items-center justify-center rounded-full outline-none transition-colors duration-200",
                  ui.floatingChrome.segmentFocus,
                  mobilePresetActive
                    ? "text-white"
                    : ui.floatingChrome.segmentInactive,
                )}
                aria-label={t("appShell.widthPresetMobile")}
                aria-pressed={mobilePresetActive}
              >
                <Smartphone className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setStorefrontWidth(clampStorefrontWidth(STOREFRONT_WIDTH.presetDesktop))}
                className={cn(
                  "relative z-10 flex flex-1 items-center justify-center rounded-full outline-none transition-colors duration-200",
                  ui.floatingChrome.segmentFocus,
                  desktopPresetActive
                    ? "text-white"
                    : ui.floatingChrome.segmentInactive,
                )}
                aria-label={t("appShell.widthPresetDesktop")}
                aria-pressed={desktopPresetActive}
              >
                <Monitor className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-auto fixed left-4 z-[280] top-[max(1rem,env(safe-area-inset-top))]"
          role="group"
          aria-label={t("appShell.profileSwitcherGroup")}
        >
          <TopBarProfileCluster />
        </div>

        <div className="pointer-events-auto fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[280] flex items-center">
          <div className={cn(ui.glassChrome.clusterShell, "inline-flex min-w-0")}>
            <div className={cn(ui.glassChrome.widthPresetTrack, "inline-flex w-auto min-w-[2.8125rem]")}>
              <ResetDemoFloatingControl />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
