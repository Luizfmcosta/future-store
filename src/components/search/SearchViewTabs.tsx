/** URL + types for `/search` view (AI vs all results). `?view=ai` from links still supported. */

export type SearchView = "results" | "ai";

export function getSearchViewParam(sp: URLSearchParams): SearchView {
  return sp.get("view") === "ai" ? "ai" : "results";
}
