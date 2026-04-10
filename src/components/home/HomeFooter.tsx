"use client";

import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";

function VtexLogo() {
  return (
    <div
      className="h-6 w-[min(112px,40vw)] shrink-0 bg-[#696969]"
      style={{
        maskImage: "url(/branding/vtex-logo.png)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: "url(/branding/vtex-logo.png)",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
      role="img"
      aria-label="VTEX"
    />
  );
}

export function HomeFooter() {
  const t = useT();

  return (
    <footer className="relative flex flex-col overflow-hidden rounded-b-[calc(1.75rem-2px)] bg-[#121212]">
      {/* Giant watermark logo — #171717 on #121212 */}
      <div className="flex items-end justify-center pt-4 sm:pt-8" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/branding/fs-reduced.svg"
          alt=""
          className="h-auto w-[90%] max-w-none opacity-[0.03]"
        />
      </div>

      {/* Bottom bar — overlaps the logo */}
      <div className="relative z-10 -mt-12 flex flex-col gap-2.5 px-5 pb-5 sm:-mt-16 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:pb-6">
        <p className="text-[15px] font-normal text-[#696969]">{t("footer.rights")}</p>

        <VtexLogo />
      </div>
    </footer>
  );
}

/**
 * Footer plus optional floating-dock inset on `#121212`. With `bleed` (default), cancels `main` horizontal padding
 * so the strip is edge-to-edge on PLP/PDP. Use `bleed={false}` inside a narrow column (e.g. AI chat).
 * Set `dockClearance={false}` when the page already reserves space for the dock (e.g. search AI thread padding)
 * so the block matches home — no extra black slab under the footer.
 */
export function HomeFooterBleed({
  className,
  bleed = true,
  dockClearance = true,
}: {
  className?: string;
  bleed?: boolean;
  /** Extra `#121212` padding below the footer so PLP/PDP scroll clears `FloatingSearchDock`. Omit on AI chat. */
  dockClearance?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0 bg-[#121212]",
        bleed && "-mx-4 sm:-mx-6",
        className,
      )}
    >
      <HomeFooter />
      {dockClearance ? (
        <div className={cn("bg-[#121212]", ui.floatingPromptDockClearance)} aria-hidden />
      ) : null}
    </div>
  );
}
