"use client";

import { Card } from "@/components/shared/Card";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ui } from "@/lib/ui-tokens";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/data/products";

export function ContinueJourney() {
  const profile = useDemoStore((s) => s.activeProfile);
  const ai = useDemoStore((s) => s.aiMode);
  const id = profile === "marina" ? "tv-aurora-oled-65" : "tv-pulse-led-55";
  const p = getProductById(id);
  if (!p) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionTitle title={profile === "marina" ? "Continue where you left off" : "Most popular right now"} eyebrow="Journey" />
      <Link
        href={`/product/${p.id}`}
        className="group block rounded-2xl outline-none transition-[transform,box-shadow] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060708] active:scale-[0.995]"
      >
        <Card className="flex items-center gap-3 p-4 transition-[background-color,border-color] duration-200 ease-out group-hover:border-white/[0.09] group-hover:bg-[#181a22]/95 sm:gap-4 sm:p-5">
          <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl bg-[#060708] sm:h-[112px] sm:w-[112px]">
            {hasMediaUrl(p.heroImage) ? (
              <Image src={p.heroImage} alt="" fill className="object-contain" sizes="112px" unoptimized />
            ) : (
              <EmptyMediaSlot className="absolute inset-0 rounded-xl" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
            <p className={ui.label}>{p.brand}</p>
            <p className={cn(ui.cardTitle, "mt-1 line-clamp-2")}>{p.title}</p>
            <p className={cn(ui.price, "mt-2")}>{formatBRL(p.price)}</p>
            {ai ? (
              <p className={cn(ui.body, "mt-2 text-[12px]")}>
                {profile === "marina"
                  ? "Aligned with your last session on premium OLED and home theater pairings."
                  : "High volume this week — clear installment path and fast-moving stock."}
              </p>
            ) : (
              <p className={cn(ui.body, "mt-2 text-[12px] text-[#7d869c]")}>Resume browsing</p>
            )}
          </div>
        </Card>
      </Link>
    </motion.section>
  );
}
