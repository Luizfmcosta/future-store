"use client";

import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { useT } from "@/lib/useT";
import { narrativeSidebarText, sidebarRailSurfaceClass } from "@/lib/narrativeSidebar";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const DEMO_PDP_HREF = "/product/sp-era-300";

function stageButtonClass(active: boolean, light: boolean) {
  return cn(
    narrativeSidebarText,
    "flex min-h-9 w-full items-center justify-center px-2 text-center text-[11px] transition",
    sidebarRailSurfaceClass(active, light),
  );
}

function StageNavInner({ light }: { light: boolean }) {
  const t = useT();
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
    <div className="flex flex-col gap-1" role="navigation" aria-label={t("stageNav.aria")}>
      <Link href="/" scroll={false} className={stageButtonClass(isHome, light)}>
        {t("stageNav.home")}
      </Link>
      <Link href="/search?view=ai" scroll={false} className={stageButtonClass(isSearchChat, light)}>
        {t("stageNav.searchChat")}
      </Link>
      <Link href="/search" scroll={false} className={stageButtonClass(isSerp, light)}>
        {t("stageNav.serp")}
      </Link>
      <Link href={DEMO_PDP_HREF} scroll={false} className={stageButtonClass(isPdp, light)}>
        {t("stageNav.pdp")}
      </Link>
      <button type="button" onClick={() => openCart()} className={stageButtonClass(isCart, light)}>
        {t("stageNav.cart")}
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
