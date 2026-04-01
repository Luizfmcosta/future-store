"use client";

import Link from "next/link";
import { SearchInput } from "@/components/shared/SearchInput";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

type TopBarProps = {
  className?: string;
};

/** Storefront-only chrome — narrative controls live in `NarrativeChrome`. */
export function TopBar({ className }: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 shrink-0 border-b border-white/[0.06] bg-[#0a0c0e]/92 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0a0c0e]/85",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-full flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-2.5">
        <div className="flex min-w-0 shrink-0 items-center sm:h-9">
          <Link
            href="/"
            className={cn(
              "group flex min-h-[40px] min-w-0 shrink-0 items-center rounded-lg px-1 py-0.5 transition-colors duration-150 ease-out hover:bg-white/[0.06] focus-visible:outline-none sm:min-h-0",
              ui.focusRing,
              "focus-visible:rounded-lg"
            )}
            aria-label="Home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local SVG brand asset */}
            <img
              src="/branding/fs-reduced.svg"
              alt=""
              className="h-7 w-auto max-w-[140px] object-contain object-left opacity-[0.95] transition group-hover:opacity-100 sm:h-8"
            />
          </Link>
        </div>
        <SearchInput className="min-w-0 flex-1" compact />
      </div>
    </header>
  );
}
