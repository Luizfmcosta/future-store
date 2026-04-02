"use client";

import { cn } from "@/lib/utils";
import { narrativeSidebarText } from "@/lib/narrativeSidebar";
import { ProfileSwitcher } from "@/components/shared/ProfileSwitcher";
import { StageNav } from "@/components/shared/StageNav";
import { VisionToggle } from "@/components/shared/VisionToggle";
import { useDemoStore } from "@/store/demoStore";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={cn(narrativeSidebarText, "text-[#9aa3b8]")}>{children}</p>
  );
}

function SidebarHeader() {
  return (
    <header className="flex shrink-0 flex-col items-start gap-2 pb-0 pt-1">
      <img
        src="/branding/future-store-v2.svg"
        alt="Future Store"
        className="h-[80px] w-auto max-w-full object-contain object-left"
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

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden border-b border-white/[0.05] bg-[#0e1016] text-white md:w-[220px] md:border-b-0 md:border-r md:border-white/[0.05]",
        compact ? "px-5 py-4" : "px-6 py-5",
        className,
      )}
    >
      <SidebarHeader />

      <div className="mt-8 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
        <div className="space-y-2">
          <SectionLabel>Shopper</SectionLabel>
          <ProfileSwitcher variant="sidebar" />
        </div>

        <div className="space-y-2">
          <SectionLabel>Stage</SectionLabel>
          <StageNav light={light} />
        </div>

        <div className="space-y-2">
          <SectionLabel>Vision</SectionLabel>
          <VisionToggle light={light} />
        </div>
      </div>
    </aside>
  );
}
