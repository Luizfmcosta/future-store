import { getSearchViewParam } from "@/components/search/SearchViewTabs";

/** Destino após `runSearch` — preserva `?view=ai` quando já estamos na busca em modo IA. */
export function getSearchResultsPath(pathname: string, searchParams: URLSearchParams): string {
  const onSearch = pathname.startsWith("/search");
  const keepAi = onSearch && getSearchViewParam(searchParams) === "ai";
  return keepAi ? "/search?view=ai" : "/search";
}
