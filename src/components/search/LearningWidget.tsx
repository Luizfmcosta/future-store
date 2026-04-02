"use client";

import { Card } from "@/components/shared/Card";

export function LearningWidget({ title, body, tag }: { title: string; body: string; tag: string }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Compact learning</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[#b4bcd1]">{body}</p>
        </div>
        <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-[#c5cce0]">
          {tag}
        </span>
      </div>
    </Card>
  );
}
