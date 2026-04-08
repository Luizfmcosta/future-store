"use client";

import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";
import { narrativeSidebarText } from "@/lib/narrativeSidebar";
import { ProfileSwitcher } from "@/components/shared/ProfileSwitcher";
import { StageNav } from "@/components/shared/StageNav";
import { VisionToggle } from "@/components/shared/VisionToggle";
import { useDemoStore } from "@/store/demoStore";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={cn(narrativeSidebarText, "text-[#7d7d7d]")}>{children}</p>
  );
}

function SidebarHeader() {
  return (
    <header className="flex shrink-0 flex-col items-start gap-1.5 pb-0 pt-0.5">
      <img
        src="/branding/future-store-v2.svg"
        alt="Future Store"
        className="h-[80px] w-auto max-w-full object-contain object-left opacity-95"
      />
    </header>
  );
}

export function NarrativeChrome({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const light = useDemoStore((s) => s.colorMode === "light");
  const t = useT();

  return (
    <aside
      className={cn(
        "flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-b border-white/[0.06] bg-[#121212] text-white",
        "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
        "md:h-dvh md:max-h-dvh md:w-[208px] md:border-b-0 md:border-r md:border-white/[0.06]",
        compact ? "px-5 py-4" : "px-4 py-4 md:px-5 md:py-5",
        className,
      )}
    >
      <SidebarHeader />

      <div className="mt-5 flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto overscroll-y-contain scrollbar-none pb-6 pt-1 md:mt-6 md:gap-4 md:pb-7">
        <div className="space-y-1.5">
          <SectionLabel>{t("narrative.shopper")}</SectionLabel>
          <ProfileSwitcher variant="sidebar" />
        </div>

        <div className="space-y-1.5">
          <SectionLabel>{t("narrative.stage")}</SectionLabel>
          <StageNav light={light} />
        </div>

        <div className="space-y-1.5">
          <SectionLabel>{t("narrative.vision")}</SectionLabel>
          <VisionToggle light={light} />
        </div>
      </div>
    </aside>
  );
}
