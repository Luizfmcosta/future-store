"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { formatBRL, hasMediaUrl } from "@/lib/utils";
import type { BundleOption } from "@/lib/bundles";
import Image from "next/image";
import Link from "next/link";

export function CheaperOptionCard({ option }: { option: BundleOption }) {
  return (
    <Card className="overflow-hidden bg-white/[0.03] p-0">
      <div className="flex gap-4 p-4">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#060708]">
          {hasMediaUrl(option.soundbar.heroImage) ? (
            <Image src={option.soundbar.heroImage} alt="" fill className="object-contain" sizes="96px" unoptimized />
          ) : (
            <EmptyMediaSlot className="absolute inset-0 rounded-xl" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8b96a8]">Leaner add-on</p>
          <p className="mt-1 text-[14px] font-semibold text-[#f0f3fa]">{option.title}</p>
          <p className="mt-1 text-[18px] font-semibold">{formatBRL(option.comboPrice)}</p>
          <Link href={`/product/${option.soundbar.id}`} className="mt-2 inline-block text-[12px] font-semibold text-[#9ca8b8] transition hover:text-[#eef1f6]">
            Details
          </Link>
        </div>
      </div>
    </Card>
  );
}
