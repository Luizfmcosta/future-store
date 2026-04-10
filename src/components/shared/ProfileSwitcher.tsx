"use client";

import { shopperNameText, sidebarRailSurfaceClass } from "@/lib/narrativeSidebar";
import {
  SHOPPER_PORTRAIT,
  SHOPPER_PROFILE_ORDER,
  shopperDisplayName,
  shopperTabInitials,
  shopperUsesIconAvatar,
} from "@/lib/shopperPortraits";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import type { ShopperProfileId } from "@/types";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const profileTagKeys = ["tag1", "tag2", "tag3"] as const;

/** Avatares empilhados — coluna estreita para não invadir o logo da loja no TopBar. */
const profileTopClusterWidthCollapsed = "w-[min(3.4375rem,calc(100vw-2rem))]";
/** Foto + bio — largura “cheia” como antes. */
const profileTopClusterWidthExpanded = "w-[min(280px,calc(100vw-2rem))]";

const AUTO_COLLAPSE_AFTER_LEAVE_MS = 8000;

const toggleBtnClass = cn(
  "flex size-[2.1875rem] shrink-0 items-center justify-center rounded-full p-0 text-[#b0b0b4] outline-none transition hover:bg-white/[0.08] hover:text-white",
  ui.floatingChrome.segmentFocus,
);

/** Duração única: altura (grid) + opacidade + caret — evita “travada” e salto do botão no fim do exit. */
const PANEL_MS = 440;
const panelEase = [0.22, 1, 0.36, 1] as const;

const caretMotion = {
  rotate: { duration: PANEL_MS / 1000, ease: panelEase },
};

/**
 * Filled sparkles mark (Lucide `Sparkles` is stroke-only). Same silhouette: star, plus, dot.
 * Inline SVG avoids Turbopack per-icon chunk issues.
 */
function AiProfileSparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <rect x="19" y="2" width="2" height="4" rx="1" />
      <rect x="18" y="3" width="4" height="2" rx="1" />
      <circle cx="4" cy="20" r="2" />
    </svg>
  );
}

/** Inline chevron — avoids Turbopack dev chunk issues with `lucide-react` per-icon modules. */
function ProfileClusterChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Rótulo acessível do perfil ativo — repete o texto do pill selecionado (única ocorrência do nome). */
export const TOPBAR_PROFILE_ACTIVE_LABEL_ID = "topbar-profile-active-label";

function TopBarProfileInitialsMark({
  id,
  active,
  compact,
}: {
  id: ShopperProfileId;
  active: boolean;
  /** `true`: preenche o botão `size-8` da coluna. `false`: disco `size-8` na linha expandida — mesma pintura nos dois. */
  compact: boolean;
}) {
  const shell = cn(
    "relative flex shrink-0 items-center justify-center rounded-full font-semibold tabular-nums leading-none",
    compact ? "size-full min-h-0 text-[19px]" : "size-8 text-[15px]",
    active
      ? "bg-[#323234] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
      : cn(
          "bg-[#141418] text-[#5c5c62] ring-1 ring-inset ring-white/[0.07] transition-colors duration-200",
          "group-hover:bg-[#242428] group-hover:text-[#f0f0f1] group-hover:ring-white/[0.12]",
        ),
  );

  if (shopperUsesIconAvatar(id)) {
    return (
      <span className={shell} aria-hidden>
        <AiProfileSparklesIcon
          className={cn(
            "transition-colors duration-200",
            compact ? "size-[1.3125rem]" : "size-4",
            active ? "text-zinc-200" : "text-zinc-500/55 group-hover:text-zinc-200",
          )}
        />
      </span>
    );
  }

  return (
    <span className={shell} aria-hidden>
      {shopperTabInitials(id)}
    </span>
  );
}

/** Pills + detalhe do perfil num único bloco (mesmo chrome). Ancorado no canto superior: pills em cima; detalhe expande para baixo. */
export function TopBarProfileCluster({ className }: { className?: string }) {
  const t = useT();
  const [expanded, setExpanded] = useState(false);
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const profileClusterExpandNonce = useDemoStore((s) => s.profileClusterExpandNonce);
  const leaveCollapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveCollapseTimer = () => {
    if (leaveCollapseTimerRef.current) {
      clearTimeout(leaveCollapseTimerRef.current);
      leaveCollapseTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (profileClusterExpandNonce === 0) return;
    setExpanded(true);
  }, [profileClusterExpandNonce]);

  useEffect(() => {
    if (!expanded) {
      clearLeaveCollapseTimer();
      return;
    }
    if (typeof window === "undefined") return;
    const main = document.querySelector("[data-storefront-window] main");
    if (!main) return;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setExpanded(false), 100);
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      main.removeEventListener("scroll", onScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [expanded]);

  const onClusterPointerEnter = () => {
    clearLeaveCollapseTimer();
  };

  const onClusterPointerLeave = () => {
    if (!expanded) return;
    clearLeaveCollapseTimer();
    leaveCollapseTimerRef.current = setTimeout(() => {
      setExpanded(false);
      leaveCollapseTimerRef.current = null;
    }, AUTO_COLLAPSE_AFTER_LEAVE_MS);
  };

  useEffect(
    () => () => {
      if (leaveCollapseTimerRef.current) {
        clearTimeout(leaveCollapseTimerRef.current);
        leaveCollapseTimerRef.current = null;
      }
    },
    [],
  );

  const bio = t(`profileCard.${activeProfile}.bio` as `profileCard.${ShopperProfileId}.bio`);
  const bio2 = t(`profileCard.${activeProfile}.bio2` as `profileCard.${ShopperProfileId}.bio`);

  return (
    <div
      className={cn(
        "shrink-0 transition-[width] [transition-duration:var(--panel-ms)] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        expanded ? profileTopClusterWidthExpanded : profileTopClusterWidthCollapsed,
        className,
      )}
      style={{ ["--panel-ms" as string]: `${PANEL_MS}ms` }}
      onPointerEnter={onClusterPointerEnter}
      onPointerLeave={onClusterPointerLeave}
    >
      <section
        className={ui.glassChrome.clusterShell}
        aria-labelledby={TOPBAR_PROFILE_ACTIVE_LABEL_ID}
      >
        <span id={TOPBAR_PROFILE_ACTIVE_LABEL_ID} className="sr-only">
          {shopperDisplayName(activeProfile)}
        </span>
        <div className="flex flex-col overflow-hidden pt-1">
          <ProfileSwitcher variant="topBar" topBarStripCollapsed={!expanded} />
          <div className="flex justify-center px-2 py-0.5">
            <button
              type="button"
              className={toggleBtnClass}
              aria-expanded={expanded}
              aria-controls={expanded ? "profile-detail-body" : undefined}
              aria-label={expanded ? t("profileCard.ariaCollapse") : t("profileCard.ariaExpand")}
              onClick={() => setExpanded((v) => !v)}
            >
              <motion.span
                className="inline-flex will-change-transform"
                initial={false}
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={caretMotion.rotate}
                aria-hidden
              >
                <ProfileClusterChevronDown className="size-[1.125rem]" />
              </motion.span>
            </button>
          </div>
          {/* grid 0fr↔1fr: detalhe abaixo dos pills; o crescimento vai para baixo. */}
          <div
            className={cn(
              "grid overflow-hidden transition-[grid-template-rows] [transition-duration:var(--panel-ms)] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div
              id="profile-detail-body"
              className={cn(
                "min-h-0 overflow-hidden transition-opacity [transition-duration:var(--panel-ms)] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
                expanded ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              aria-hidden={!expanded}
            >
              <div className="flex flex-col gap-3 px-3.5 pb-4 pt-2.5 sm:pb-5">
                <span className="relative flex aspect-square w-[7.25rem] max-w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#1a1a1a] ring-1 ring-white/[0.08]">
                  {shopperUsesIconAvatar(activeProfile) ? (
                    <AiProfileSparklesIcon className="size-[3.25rem] text-zinc-400/90" />
                  ) : (
                    <Image
                      src={SHOPPER_PORTRAIT[activeProfile]}
                      alt=""
                      width={116}
                      height={116}
                      className="size-full object-cover"
                      unoptimized
                    />
                  )}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profileTagKeys.map((key) => (
                    <span
                      key={`${activeProfile}-${key}`}
                      className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[15px] font-medium tracking-tight text-[#d0d0d3]"
                    >
                      {t(`profileCard.${activeProfile}.${key}` as `profileCard.${ShopperProfileId}.${typeof key}`)}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-[15px] font-normal leading-relaxed text-[#c8c8cb] [&_strong]:font-medium [&_strong]:text-[#e4e4e6]">
                    {bio}
                  </p>
                  {bio2 ? (
                    <p className="text-[15px] font-normal leading-relaxed text-[#9e9ea3]">{bio2}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const narrativeCell =
  "flex h-10 items-center justify-center rounded-lg border border-white/[0.06] bg-[#0c0e12]/80 text-[13px] font-medium tracking-tight transition hover:bg-white/[0.06]";

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
                "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#1a1a1a]",
                light ? "ring-1 ring-slate-200/80" : "ring-1 ring-white/[0.08]",
              )}
            >
              {shopperUsesIconAvatar(id) ? (
                <AiProfileSparklesIcon className="size-[1.125rem] text-zinc-500/85" />
              ) : (
                <Image
                  src={SHOPPER_PORTRAIT[id]}
                  alt=""
                  width={36}
                  height={36}
                  className="size-full object-cover"
                  unoptimized
                />
              )}
            </span>
            <span className={cn(shopperNameText, "min-w-0 flex-1 text-[15px] leading-tight text-inherit")}>
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
  /** Só no `topBar`: pills mais compactas quando o painel de bio está fechado. */
  topBarStripCollapsed = true,
}: {
  className?: string;
  variant?: "default" | "narrative" | "sidebar" | "topBar";
  topBarStripCollapsed?: boolean;
}) {
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const setProfile = useDemoStore((s) => s.setProfile);
  const light = useDemoStore((s) => s.colorMode === "light");
  const requestProfileClusterExpand = useDemoStore((s) => s.requestProfileClusterExpand);

  if (variant === "sidebar") {
    return (
      <div className={className}>
        <SidebarProfileCards light={light} />
      </div>
    );
  }

  if (variant === "narrative") {
    return (
      <div className={cn("grid w-full grid-cols-2 gap-1 sm:grid-cols-4", className)} role="group" aria-label="Profile">
        {SHOPPER_PROFILE_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setProfile(id)}
            className={cn(
              light
                ? "flex h-10 items-center justify-center rounded-lg border border-slate-200/90 bg-white text-[14px] font-medium tracking-tight shadow-sm transition hover:bg-slate-50 sm:text-[15px]"
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
    "flex rounded-full border border-white/[0.06] bg-[#0c0e12]/70 p-0.5 backdrop-blur-md";

  const topBarBtnCollapsed = cn(
    "relative z-10 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full p-0 outline-none transition-colors duration-200",
    ui.floatingChrome.segmentFocus,
  );
  /** Pills em coluna: cada linha ocupa a largura inteira (iniciais + nome). */
  const topBarBtnExpanded = cn(
    "relative z-10 flex w-full min-w-0 shrink-0 flex-row items-center justify-start gap-1.5 rounded-full px-2 py-1 text-[13px] font-medium outline-none transition-colors duration-200 sm:px-2.5 sm:py-1.5 sm:text-[15px]",
    ui.floatingChrome.segmentFocus,
  );

  const btnClass =
    variant === "topBar"
      ? topBarStripCollapsed
        ? topBarBtnCollapsed
        : topBarBtnExpanded
      : "rounded-full px-2 py-1 text-[12px] font-semibold tracking-tight transition-colors sm:px-3 sm:py-1.5 sm:text-[14px]";

  if (variant === "topBar") {
    /* Coluna de avatares: o vidro/blur vem do `clusterShell` no `TopBarProfileCluster`. */
    return (
      <div className={cn("w-full min-w-0", className)}>
        <div
          className={cn(
            /* Sem segundo fundo — o vidro único vem do `clusterShell` no `TopBarProfileCluster`. */
            "relative flex w-full min-w-0 flex-col flex-nowrap overflow-hidden scrollbar-none",
            topBarStripCollapsed
              ? "items-center gap-2 p-1.5"
              : "items-stretch gap-1.5 p-1",
          )}
          role="group"
          aria-label="Profile"
        >
          {SHOPPER_PROFILE_ORDER.map((id) => {
            const active = activeProfile === id;
            const name = shopperDisplayName(id);
            return (
              <button
                key={id}
                type="button"
                aria-label={name}
                aria-pressed={active}
                onClick={() => {
                  if (id !== activeProfile) {
                    setProfile(id);
                    requestProfileClusterExpand();
                  }
                }}
                className={cn(
                  btnClass,
                  "group",
                  active && !topBarStripCollapsed && ui.floatingChrome.segmentActive,
                  !active && ui.floatingChrome.segmentInactive,
                  !active &&
                    !topBarStripCollapsed &&
                    "bg-white/[0.04] hover:bg-white/[0.07]",
                )}
              >
                {topBarStripCollapsed ? (
                  <TopBarProfileInitialsMark id={id} active={active} compact />
                ) : (
                  <>
                    <TopBarProfileInitialsMark id={id} active={active} compact={false} />
                    <span className="min-w-0 flex-1 truncate text-left">{name}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

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
              ? "bg-white/[0.12] text-white shadow-inner"
              : "text-[#9aa3b8] hover:text-[#dce1ed]",
          )}
        >
          {shopperDisplayName(id)}
        </button>
      ))}
    </div>
  );
}
