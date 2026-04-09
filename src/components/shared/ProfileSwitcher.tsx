"use client";

import { shopperNameText, sidebarRailSurfaceClass } from "@/lib/narrativeSidebar";
import {
  SHOPPER_PORTRAIT,
  SHOPPER_PROFILE_ORDER,
  shopperDisplayName,
  shopperTabInitials,
} from "@/lib/shopperPortraits";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import type { ShopperProfileId } from "@/types";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const profileTagKeys = ["tag1", "tag2", "tag3"] as const;

/** Avatares empilhados — coluna estreita para não invadir o logo da loja no TopBar. */
const profileTopClusterWidthCollapsed = "w-[min(2.75rem,calc(100vw-2rem))]";
/** Foto + bio — largura “cheia” como antes. */
const profileTopClusterWidthExpanded = "w-[min(248px,calc(100vw-2rem))]";

const toggleBtnClass = cn(
  "flex size-7 shrink-0 items-center justify-center rounded-full p-0 text-[#b0b0b4] outline-none transition hover:bg-white/[0.08] hover:text-white",
  ui.floatingChrome.segmentFocus,
);

/** Duração única: altura (grid) + opacidade + caret — evita “travada” e salto do botão no fim do exit. */
const PANEL_MS = 440;
const panelEase = [0.22, 1, 0.36, 1] as const;

const caretMotion = {
  rotate: { duration: PANEL_MS / 1000, ease: panelEase },
};

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
  /**
   * Ativo: disco sólido + branco. Inativo: fundo mais escuro, texto bem apagado — leitura clara de “desligado”.
   */
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-semibold tabular-nums leading-none text-[13px]",
        compact ? "size-full min-h-0" : "size-8",
        active
          ? "bg-[#323234] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
          : "bg-[#141418] text-[#5c5c62] ring-1 ring-inset ring-white/[0.07]",
      )}
      aria-hidden
    >
      {shopperTabInitials(id)}
    </span>
  );
}

/** Pills + detalhe do perfil num único bloco (mesmo chrome). Ancorado no canto superior: pills em cima; detalhe expande para baixo. */
export function TopBarProfileCluster({ className }: { className?: string }) {
  const t = useT();
  const [expanded, setExpanded] = useState(false);
  const activeProfile = useDemoStore((s) => s.activeProfile);
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
                <ChevronDown className="size-3.5" strokeWidth={2} />
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
                <span className="relative block aspect-square w-[7.25rem] max-w-full shrink-0 overflow-hidden rounded-2xl bg-[#1a1a1a] ring-1 ring-white/[0.08]">
                  <Image
                    src={SHOPPER_PORTRAIT[activeProfile]}
                    alt=""
                    width={116}
                    height={116}
                    className="size-full object-cover"
                    unoptimized
                  />
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profileTagKeys.map((key) => (
                    <span
                      key={`${activeProfile}-${key}`}
                      className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium tracking-tight text-[#d0d0d3]"
                    >
                      {t(`profileCard.${activeProfile}.${key}` as `profileCard.${ShopperProfileId}.${typeof key}`)}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-[12px] font-light leading-relaxed text-[#c8c8cb] [&_strong]:font-medium [&_strong]:text-[#e4e4e6]">
                    {bio}
                  </p>
                  {bio2 ? (
                    <p className="text-[12px] font-light leading-relaxed text-[#9e9ea3]">{bio2}</p>
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
    "flex rounded-full border border-white/[0.06] bg-[#0c0e12]/70 p-0.5 backdrop-blur-md";

  const topBarBtnCollapsed = cn(
    "relative z-10 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full p-0 outline-none transition-colors duration-200",
    ui.floatingChrome.segmentFocus,
  );
  /** Pills em coluna: cada linha ocupa a largura inteira (iniciais + nome). */
  const topBarBtnExpanded = cn(
    "relative z-10 flex w-full min-w-0 shrink-0 flex-row items-center justify-start gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium outline-none transition-colors duration-200 sm:px-2.5 sm:py-1.5 sm:text-[12px]",
    ui.floatingChrome.segmentFocus,
  );

  const btnClass =
    variant === "topBar"
      ? topBarStripCollapsed
        ? topBarBtnCollapsed
        : topBarBtnExpanded
      : "rounded-full px-2 py-1 text-[10px] font-semibold tracking-tight transition-colors sm:px-3 sm:py-1.5 sm:text-[12px]";

  if (variant === "topBar") {
    /* Coluna de avatares: o vidro/blur vem do `clusterShell` no `TopBarProfileCluster`. */
    return (
      <div className={cn("w-full min-w-0", className)}>
        <div
          className={cn(
            /* Sem segundo fundo — o vidro único vem do `clusterShell` no `TopBarProfileCluster`. */
            "relative flex w-full min-w-0 flex-col flex-nowrap items-stretch gap-1.5 overflow-hidden p-1 scrollbar-none",
            topBarStripCollapsed && "items-center",
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
                onClick={() => setProfile(id)}
                className={cn(
                  btnClass,
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
