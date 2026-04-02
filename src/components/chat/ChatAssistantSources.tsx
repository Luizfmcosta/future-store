"use client";

import { Source, SourceContent, SourceTrigger } from "@/components/ui/source";
import type { AssistantSource } from "@/lib/chatAssistant";
import { cn } from "@/lib/utils";

export function ChatAssistantSources({ sources }: { sources: AssistantSource[] }) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-3 border-t border-white/[0.06] pt-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">Sources</p>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((s) => (
          <Source key={s.href} href={s.href}>
            <SourceTrigger
              label={s.label}
              showFavicon
              className={cn(
                "max-w-[9.5rem] border border-white/[0.06] bg-white/[0.06] text-[#c8d0dc]",
                "hover:border-white/[0.1] hover:bg-white/[0.1] hover:text-[#eef1f6]"
              )}
            />
            <SourceContent
              title={s.title}
              description={s.description}
              className="w-80 border border-white/[0.08] bg-[#14161c] p-0 text-[#eef1f6] shadow-xl ring-white/10 [&_.text-muted-foreground]:text-[#9ca8b8] [&_.text-primary]:text-[#eef1f6]"
            />
          </Source>
        ))}
      </div>
    </div>
  );
}
