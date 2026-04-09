"use client";

import { filterPromptSuggestionsByQuery } from "@/lib/promptSuggestions";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export type PromptSuggestionRowProps = {
  /** Current composer text — suggestions match as substrings (case-insensitive). */
  query: string;
  pool: readonly string[];
  onSelect: (text: string) => void;
  maxVisible?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * Clickable prompt chips above {@link PromptInput}, filtered by what the user typed.
 * Pattern: [prompt-kit Prompt Suggestion — basic usage](https://www.prompt-kit.com/docs/prompt-suggestion).
 */
export function PromptSuggestionRow({
  query,
  pool,
  onSelect,
  maxVisible = 8,
  disabled = false,
  className,
}: PromptSuggestionRowProps) {
  const t = useT();
  const items = useMemo(
    () => filterPromptSuggestionsByQuery(pool, query, maxVisible),
    [pool, query, maxVisible],
  );

  if (disabled || items.length === 0) return null;

  return (
    <div
      role="list"
      aria-label={t("common.promptSuggestionsAria")}
      className={cn("mb-2 flex flex-wrap gap-1.5 sm:gap-2", className)}
    >
      {items.map((text) => (
        <button
          key={text}
          type="button"
          role="listitem"
          title={text}
          onClick={() => onSelect(text)}
          className={cn(
            "max-w-[min(100%,24rem)] truncate rounded-full border border-stone-200/95 bg-white px-2.5 py-1 text-left text-[15px] font-medium text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-stone-50",
            "sm:max-w-[min(100%,28rem)] sm:px-3 sm:py-1.5",
            ui.home.focusRing,
            "focus-visible:ring-offset-2",
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
