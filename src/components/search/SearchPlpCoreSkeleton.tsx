"use client";

/** PLP skeleton while `/api/plp-adapt` runs — shared by search page and PDP search overlay. */
export function SearchPlpCoreSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex w-full min-w-0 flex-col gap-3">
        <div className="pt-12 sm:pt-14">
          <div className="h-8 w-[min(100%,22rem)] animate-pulse rounded-md bg-stone-200/80 sm:h-9" />
        </div>
        <div className="-mx-4 flex gap-2 px-4 sm:-mx-6 sm:px-6">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-stone-200/80" />
          <div className="h-9 w-24 animate-pulse rounded-full bg-stone-200/70" />
          <div className="h-9 w-28 animate-pulse rounded-full bg-stone-200/70" />
          <div className="h-9 w-28 animate-pulse rounded-full bg-stone-200/70" />
        </div>
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-stone-100 sm:h-52" />
      <div>
        <div className="mb-2 h-4 w-28 animate-pulse rounded bg-stone-200/70" />
        <div className="flex gap-2.5">
          <div className="h-9 w-40 animate-pulse rounded-full bg-stone-200/70" />
          <div className="h-9 w-36 animate-pulse rounded-full bg-stone-200/70" />
          <div className="h-9 w-44 animate-pulse rounded-full bg-stone-200/70" />
        </div>
      </div>
      <div className="h-14 animate-pulse rounded-xl bg-stone-100" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-stone-100" />
        ))}
      </div>
    </div>
  );
}
