"use client";

import { Source, SourceContent, SourceTrigger } from "@/components/ui/source";
import type { AssistantSource } from "@/lib/chatAssistant";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";

export function ChatAssistantSources({ sources }: { sources: AssistantSource[] }) {
  const t = useT();
  if (sources.length === 0) return null;

  return (
    <div className="mt-3 border-t border-stone-200/90 pt-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{t("searchAiPanel.sourcesLabel")}</p>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((s) => (
          <Source key={s.href} href={s.href}>
            <SourceTrigger
              label={s.label}
              showFavicon
              className={cn(
                "max-w-[9.5rem] border border-stone-200/90 bg-stone-50 text-stone-700",
                "hover:border-stone-300 hover:bg-white hover:text-stone-900"
              )}
            />
            <SourceContent
              title={s.title}
              description={s.description}
              className="w-80 border border-stone-200/90 bg-white p-0 text-stone-900 shadow-xl ring-stone-200/40 [&_.text-muted-foreground]:text-stone-500 [&_.text-primary]:text-stone-900"
            />
          </Source>
        ))}
      </div>
    </div>
  );
}
