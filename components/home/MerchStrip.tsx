"use client";

import { getSoundbars } from "@/data/products";
import { HorizontalScroll } from "@/components/shared/HorizontalScroll";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ui } from "@/lib/ui-tokens";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const sectionMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export function MerchStrip() {
  const profile = useDemoStore((s) => s.activeProfile);
  const bars = getSoundbars();
  const sorted =
    profile === "marina"
      ? [...bars].sort((a, b) => b.price - a.price)
      : [...bars].sort((a, b) => a.price - b.price);

  return (
    <motion.section {...sectionMotion}>
      <SectionTitle title={profile === "marina" ? "Pairings for your wall" : "Add sound without complexity"} eyebrow="Sound" />
      <HorizontalScroll>
        {sorted.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="flex-[0_0_85%] max-w-[280px] shrink-0 snap-start sm:flex-[0_0_200px]"
          >
            <div className="flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#060708]">
              <div className="relative aspect-[16/10] w-full shrink-0 bg-[#060708]">
                {hasMediaUrl(p.heroImage) ? (
                  <Image
                    src={p.heroImage}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 440px) 85vw, 200px"
                    unoptimized
                  />
                ) : (
                  <EmptyMediaSlot className="absolute inset-0" />
                )}
              </div>
              <div className="flex min-h-[88px] flex-1 flex-col justify-between border-t border-white/[0.06] bg-[#08090c] p-3.5">
                <p className={cn(ui.cardTitle, "line-clamp-2 min-h-[2.5rem]")}>{p.title}</p>
                <p className={cn(ui.price, "mt-2")}>{formatBRL(p.price)}</p>
              </div>
            </div>
          </Link>
        ))}
      </HorizontalScroll>
    </motion.section>
  );
}
