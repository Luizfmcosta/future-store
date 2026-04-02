import { SearchPageContent } from "@/components/search/SearchPageContent";
import { Suspense } from "react";

function SearchFallback() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-white/[0.06]" />
      <div className="h-40 animate-pulse rounded-2xl bg-white/[0.04]" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
