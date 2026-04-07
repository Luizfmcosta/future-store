"use client";

import { shopperNameText, sidebarRailSurfaceClass } from "@/lib/narrativeSidebar";
import { SHOPPER_PORTRAIT, SHOPPER_PROFILE_ORDER, shopperDisplayName } from "@/lib/shopperPortraits";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import Image from "next/image";

const narrativeCell =
  "flex h-9 items-center justify-center rounded-lg border border-white/[0.06] bg-[#0c0e12]/80 text-[11px] font-medium tracking-tight transition hover:bg-white/[0.06]";

function SidebarProfileCards({ light }: { light: boolean }) {
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const setProfile = useDemoStore((s) => s.setProfile);

  return (
    <div className="flex w-full flex-col gap-1.5" role="group" aria-label="Shopper profile">
      {SHOPPER_PROFILE_ORDER.map((id) => {
        const active = activeProfile === id;
        const name = shopperDisplayName(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => setProfile(id)}
            className={cn(
              "flex w-full flex-row items-center gap-2.5 px-2.5 py-2 text-left transition",
              sidebarRailSurfaceClass(active, light),
            )}
          >
            <span
              className={cn(
                "relative block size-9 shrink-0 overflow-hidden rounded-lg bg-[#1a1a1a]",
                light ? "ring-1 ring-slate-200/80" : "ring-1 ring-white/[0.08]",
              )}
            >
              <Image
                src={SHOPPER_PORTRAIT[id]}
                alt=""
                width={36}
                height={36}
                className="size-full object-cover"
                unoptimized
              />
            </span>
            <span className={cn(shopperNameText, "min-w-0 flex-1 text-[14px] leading-tight text-inherit")}>
              {name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ProfileSwitcher({
  className,
  variant,
}: {
  className?: string;
  variant?: "default" | "narrative" | "sidebar" | "topBar";
}) {
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const setProfile = useDemoStore((s) => s.setProfile);
  const light = useDemoStore((s) => s.colorMode === "light");

  if (variant === "sidebar") {
    return (
      <div className={className}>
        <SidebarProfileCards light={light} />
      </div>
    );
  }

  if (variant === "narrative") {
    return (
      <div className={cn("grid w-full grid-cols-3 gap-1", className)} role="group" aria-label="Profile">
        {SHOPPER_PROFILE_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setProfile(id)}
            className={cn(
              light
                ? "flex h-9 items-center justify-center rounded-lg border border-slate-200/90 bg-white text-[10px] font-medium tracking-tight shadow-sm transition hover:bg-slate-50 sm:text-[11px]"
                : narrativeCell,
              activeProfile === id
                ? light
                  ? "border-slate-400 bg-slate-100 text-slate-900"
                  : "border-white/[0.14] bg-white/[0.12] text-white"
                : light
                  ? "text-slate-500"
                  : "text-[#b8c0ce]",
            )}
          >
            {shopperDisplayName(id)}
          </button>
        ))}
      </div>
    );
  }

  const pillShell =
    variant === "topBar"
      ? "relative inline-flex h-9 min-w-0 max-w-[min(100%,22rem)] flex-nowrap items-stretch overflow-x-auto rounded-full bg-zinc-900/10 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      : "flex rounded-full border border-white/[0.06] bg-[#0c0e12]/70 p-0.5 backdrop-blur-md";

  const btnClass =
    variant === "topBar"
      ? "relative z-10 flex min-w-[3.25rem] flex-1 basis-0 items-center justify-center rounded-full px-2 text-[11px] font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-canvas)] sm:min-w-0 sm:px-2.5 sm:text-[12px]"
      : "rounded-full px-2 py-1 text-[10px] font-semibold tracking-tight transition-colors sm:px-3 sm:py-1.5 sm:text-[12px]";

  return (
    <div className={cn(pillShell, className)} role="group" aria-label="Profile">
      {SHOPPER_PROFILE_ORDER.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => setProfile(id)}
          className={cn(
            btnClass,
            activeProfile === id
              ? variant === "topBar"
                ? "bg-zinc-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                : "bg-white/[0.12] text-white shadow-inner"
              : variant === "topBar"
                ? "text-zinc-400 hover:text-zinc-200"
                : "text-[#9aa3b8] hover:text-[#dce1ed]",
          )}
        >
          {shopperDisplayName(id)}
        </button>
      ))}
    </div>
  );
}
