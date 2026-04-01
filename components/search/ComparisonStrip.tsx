"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { SectionTitle } from "@/components/shared/SectionTitle";
import type { ComparisonCardModel } from "@/lib/recommendations";
import { hasMediaUrl } from "@/lib/utils";
import type { ShopperProfileId } from "@/types";
import Image from "next/image";
import Link from "next/link";

export function ComparisonStrip({ items, profile }: { items: ComparisonCardModel[]; profile: ShopperProfileId }) {
  return (
    <section>
      <SectionTitle
        title={profile === "marina" ? "Three lenses — pick your tradeoff" : "Three picks — fastest path"}
        eyebrow="Compare"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((row) => (
          <Link key={row.product.id} href={`/product/${row.product.id}`}>
            <Card className="flex h-full flex-col overflow-hidden p-0">
              <div className="relative aspect-[16/10] w-full bg-[#060708]">
                {hasMediaUrl(row.product.heroImage) ? (
                  <Image
                    src={row.product.heroImage}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width:768px) 100vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <EmptyMediaSlot className="absolute inset-0" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7d869c]">{row.fit}</p>
                <p className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug text-[#f0f3fa]">{row.product.title}</p>
                <ul className="mt-3 space-y-1.5 text-[12px] text-[#aeb6ca]">
                  {row.pros.map((x) => (
                    <li key={x}>+ {x}</li>
                  ))}
                  {row.tradeoffs.map((x) => (
                    <li key={x} className="text-[#8b93a7]">
                      Δ {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
