"use client";

import { Card } from "@/components/shared/Card";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Link from "next/link";

const cellClass =
  "flex min-h-[88px] flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 text-center";

export function CompareModule() {
  const profile = useDemoStore((s) => s.activeProfile);

  const cells =
    profile === "marina"
      ? [
          { k: "Dark room", v: "OLED reference" },
          { k: "Bright room", v: "QLED punch" },
          { k: "Value", v: "LED efficiency" },
        ]
      : [
          { k: "Lowest monthly", v: "50\" campaign" },
          { k: "Best bundle", v: "55\" + bar" },
          { k: "Popular size", v: "65\" mid tier" },
        ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionTitle
        title="Compare before deciding"
        eyebrow="Decision support"
        action={
          <Link
            href="/search"
            className={cn(
              ui.label,
              "shrink-0 rounded-lg px-2 py-1.5 font-semibold text-[#9ca8b8] transition-colors duration-150 ease-out",
              "hover:bg-white/[0.08] hover:text-[#eef1f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white/25"
            )}
          >
            Open search
          </Link>
        }
      />
      <Card className="p-4 sm:p-6">
        <p className={ui.body}>
          {profile === "marina"
            ? "Side-by-side tradeoffs for OLED, QLED, and bright-room LED — with fit notes for ~3m seating."
            : "Three clear picks: best deal, best balance, smallest monthly — without the spec overload."}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {cells.map((c) => (
            <div key={c.k} className={cellClass}>
              <p className={cn(ui.eyebrow, "text-[9px]")}>{c.k}</p>
              <p className="mt-1.5 max-w-[14ch] text-[13px] font-semibold leading-snug text-white">{c.v}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.section>
  );
}
