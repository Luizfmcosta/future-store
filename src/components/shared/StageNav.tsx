"use client";

import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { narrativeSidebarText, sidebarRailSurfaceClass } from "@/lib/narrativeSidebar";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const DEMO_PDP_HREF = "/product/tv-aurora-oled-65";

function stageButtonClass(active: boolean, light: boolean) {
  return cn(
    narrativeSidebarText,
    "flex min-h-10 w-full items-center justify-center rounded-[10px] px-2 text-center transition",
    sidebarRailSurfaceClass(active, light),
  );
}

function StageNavInner({ light }: { light: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = pathname.startsWith("/search") ? getSearchViewParam(searchParams) : "results";
  const cartOpen = useDemoStore((s) => s.cartDrawerOpen);
  const openCart = useDemoStore((s) => s.openCart);

  const isHome = pathname === "/";
  const isSearchChat = pathname.startsWith("/search") && view === "ai";
  const isSerp = pathname.startsWith("/search") && view !== "ai";
  const isPdp = pathname.startsWith("/product/");
  const isCart = cartOpen;

  return (
    <div className="flex flex-col gap-1.5" role="navigation" aria-label="Stage">
      <Link href="/" scroll={false} className={stageButtonClass(isHome, light)}>
        Home
      </Link>
      <Link href="/search?view=ai" scroll={false} className={stageButtonClass(isSearchChat, light)}>
        Search/Chat
      </Link>
      <Link href="/search" scroll={false} className={stageButtonClass(isSerp, light)}>
        SERP
      </Link>
      <Link href={DEMO_PDP_HREF} scroll={false} className={stageButtonClass(isPdp, light)}>
        PDP
      </Link>
      <button type="button" onClick={() => openCart()} className={stageButtonClass(isCart, light)}>
        Cart
      </button>
    </div>
  );
}

export function StageNav({ light = false }: { light?: boolean }) {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-lg bg-white/[0.04]" aria-hidden />}>
      <StageNavInner light={light} />
    </Suspense>
  );
}
