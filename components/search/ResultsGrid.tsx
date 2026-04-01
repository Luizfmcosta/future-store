"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { formatBRL, hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";
import Image from "next/image";
import Link from "next/link";

export function ResultsGrid({ products, profile }: { products: Product[]; profile: ShopperProfileId }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-[#eef1f7]">All matches</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <Card className="overflow-hidden p-0 transition hover:border-white/[0.09]">
              <div className="relative aspect-[16/10] w-full bg-[#060708]">
                {hasMediaUrl(p.heroImage) ? (
                  <Image
                    src={p.heroImage}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width:768px) 100vw, 400px"
                    unoptimized
                  />
                ) : (
                  <EmptyMediaSlot className="absolute inset-0" />
                )}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-medium text-[#8b93a7]">{p.brand}</p>
                  {p.sponsored ? (
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#9aa3b8]">
                      Sponsored
                    </span>
                  ) : null}
                </div>
                <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#f0f3fa]">{p.title}</p>
                <p className="text-[13px] text-[#9aa3b8]">
                  {profile === "marina" ? p.bestFor[0] : p.deliveryETA}
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-[16px] font-semibold">{formatBRL(p.price)}</span>
                  {p.oldPrice ? <span className="text-[13px] text-[#7d869c] line-through">{formatBRL(p.oldPrice)}</span> : null}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
