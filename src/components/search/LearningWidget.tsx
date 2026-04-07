"use client";

import { Card } from "@/components/shared/Card";

export function LearningWidget({ title, body, tag }: { title: string; body: string; tag: string }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Compact learning</p>
          <h3 className="mt-2 text-lg font-semibold text-stone-900">{title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-stone-600">{body}</p>
        </div>
        <span className="shrink-0 rounded-full border border-stone-200/90 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
          {tag}
        </span>
      </div>
    </Card>
  );
}
