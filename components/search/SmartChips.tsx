"use client";

import { Chip } from "@/components/shared/Chip";
import type { SearchIntent } from "@/types";
import { useMemo, useState } from "react";

export function SmartChips({ intent }: { intent: SearchIntent }) {
  const [active, setActive] = useState<Record<string, boolean>>({});

  const chips = useMemo(() => {
    const list: { key: string; label: string }[] = [];
    if (intent.budget) list.push({ key: "budget", label: `≤ ${intent.budget.toLocaleString("pt-BR")}` });
    if (intent.roomDistance) list.push({ key: "room", label: intent.roomDistance });
    if (intent.roomType) list.push({ key: "roomType", label: intent.roomType });
    if (intent.priority) list.push({ key: "priority", label: intent.priority });
    if (intent.deliveryNeed) list.push({ key: "delivery", label: intent.deliveryNeed });
    if (intent.useCase?.length) {
      intent.useCase.forEach((u, i) => list.push({ key: `uc-${i}`, label: u }));
    }
    return list;
  }, [intent]);

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <Chip
          key={c.key}
          active={active[c.key]}
          onClick={() => setActive((prev) => ({ ...prev, [c.key]: !prev[c.key] }))}
        >
          {c.label}
        </Chip>
      ))}
    </div>
  );
}
