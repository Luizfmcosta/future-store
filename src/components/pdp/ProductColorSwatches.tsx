"use client";

import type { ProductColorOption } from "@/types";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function ProductColorSwatches({
  options,
  value,
  onChange,
}: {
  options: ProductColorOption[];
  value: string;
  onChange: (labelKey: string) => void;
}) {
  const t = useT();
  if (options.length === 0) return null;

  const activeOpt = options.find((o) => o.labelKey === value) ?? options[0]!;
  const activeLabel = t(`pdp.colors.${activeOpt.labelKey}`);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
      <div
        role="radiogroup"
        aria-label={t("pdp.colorLabel")}
        className="flex shrink-0 items-center gap-2"
      >
        {options.map((opt) => {
          const label = t(`pdp.colors.${opt.labelKey}`);
          const selected = value === opt.labelKey;
          return (
            <button
              key={opt.labelKey}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={label}
              title={label}
              onClick={() => onChange(opt.labelKey)}
              className={cn(
                "rounded-full p-0.5 transition-[box-shadow,transform] duration-150",
                selected
                  ? "shadow-[0_0_0_1px_rgba(23,23,23,0.95)]"
                  : "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.12)]",
                "active:scale-[0.96]",
                ui.home.focusRing,
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              )}
            >
              <span
                className="block h-7 w-7 rounded-full border border-black/[0.08] sm:h-8 sm:w-8"
                style={{ backgroundColor: opt.swatchHex }}
              />
            </button>
          );
        })}
      </div>
      <span className="min-w-0 max-w-[min(100%,14rem)] truncate text-[13px] font-medium leading-snug text-neutral-600 sm:max-w-none sm:text-[14px]">
        {activeLabel}
      </span>
    </div>
  );
}
