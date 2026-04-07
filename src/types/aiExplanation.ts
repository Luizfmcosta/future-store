/** Insight surfaced in “Visão de IA” — mirrors real personalization inputs. */
export type AIExplanationType = "content" | "curation" | "pricing" | "ranking" | "data";

export type AIExplanation = {
  id: string;
  title: string;
  description: string;
  type: AIExplanationType;
};
