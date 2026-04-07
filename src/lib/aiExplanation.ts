import { buildHomeExperience, type HomeSegmentId } from "@/lib/personalization";
import type { AppLocale } from "@/lib/locale-types";
import type { Product } from "@/types";
import { shopperDisplayName } from "@/lib/shopperPortraits";
import type { ShopperProfileId } from "@/types";
import type { ShopperSignals } from "@/types/shopperSignals";
import type { AIExplanation } from "@/types/aiExplanation";
import type { SearchIntent } from "@/types";

export type PageKind = "home" | "search" | "pdp" | "chat";

/** Stable inputs shared across routes — always derived from real store + signals. */
export type AIExplanationUserContext = {
  profile: ShopperProfileId;
  signals: ShopperSignals;
};

/** Route-specific slice — no hardcoded page IDs; callers pass pathname-derived kind. */
export type AIExplanationPageContext = {
  kind: PageKind;
  pathname: string;
  /** PDP only — product id from the route. */
  productId?: string;
  /** Search only — active query / intent. */
  searchQuery?: string;
  intent?: SearchIntent | null;
  /** PDP only — when available for price/tier copy. */
  product?: Product | null;
};

function L(locale: AppLocale, pt: string, en: string): string {
  return locale === "pt-BR" ? pt : en;
}

function segmentLabel(locale: AppLocale, segment: HomeSegmentId): string {
  const m: Record<HomeSegmentId, [string, string]> = {
    marina_research: [
      "Pesquisa premium (Marina + retorno/desktop)",
      "Premium consideration (Marina + returning/desktop)",
    ],
    marina_explore: [
      "Descoberta (Marina + primeiro acesso mobile)",
      "Discovery-first (Marina + first visit on mobile)",
    ],
    ricardo_speed: [
      "Ofertas rápidas (Ricardo + tráfego pago/mobile)",
      "Deal velocity (Ricardo + paid social or mobile)",
    ],
    ricardo_value: [
      "Custo-benefício (Ricardo + valor)",
      "Value framing (Ricardo + popularity)",
    ],
  };
  const [pt, en] = m[segment];
  return L(locale, pt, en);
}

function trafficLabel(locale: AppLocale, ch: ShopperSignals["trafficChannel"]): string {
  const map: Record<ShopperSignals["trafficChannel"], [string, string]> = {
    direct: ["Direto", "Direct"],
    organic: ["Orgânico", "Organic"],
    paid_social: ["Redes sociais (pago)", "Paid social"],
    paid_search: ["Busca paga", "Paid search"],
    other: ["Outro", "Other"],
  };
  const [pt, en] = map[ch];
  return L(locale, pt, en);
}

function curatedSortLabel(
  locale: AppLocale,
  mode: ReturnType<typeof buildHomeExperience>["curatedSort"],
): string {
  const m: Record<typeof mode, [string, string]> = {
    price_desc: [
      "Curadoria prioriza faixa premium na vitrine.",
      "Curation biases toward premium picks in this view.",
    ],
    price_asc: [
      "Curadoria prioriza entrada de gama para decisão rápida.",
      "Curation biases toward entry-level picks for faster decisions.",
    ],
    profile_default: [
      "Curadoria equilibra catálogo com o perfil ativo.",
      "Curation balances catalog with the active profile.",
    ],
  };
  const [pt, en] = m[mode];
  return L(locale, pt, en);
}

function merchSortLabel(
  locale: AppLocale,
  mode: ReturnType<typeof buildHomeExperience>["merchSort"],
): string {
  const m: Record<typeof mode, [string, string]> = {
    price_desc: [
      "Faixa de preço ordenada do maior para o menor.",
      "Price ordering emphasizes higher tiers first.",
    ],
    price_asc: [
      "Faixa de preço ordenada do menor para o maior.",
      "Price ordering emphasizes accessible tiers first.",
    ],
    default: [
      "Destaques de merch seguem o catálogo padrão do segmento.",
      "Merch highlights follow the segment’s default catalog ordering.",
    ],
  };
  const [pt, en] = m[mode];
  return L(locale, pt, en);
}

function formatModuleOrder(locale: AppLocale, order: string[]): string {
  const labels: Record<string, [string, string]> = {
    hero: ["Destaque principal", "Hero"],
    continue: ["Continuar", "Continue"],
    compare: ["Comparativo", "Compare"],
    curated: ["Curado para você", "Curated"],
    spotlight: ["Destaque do produto", "Spotlight"],
    strip: ["Faixa de produtos", "Merch strip"],
  };
  const pretty = order
    .slice(0, 6)
    .map((k) => {
      const pair = labels[k];
      if (!pair) return k;
      return L(locale, pair[0], pair[1]);
    })
    .join(locale === "pt-BR" ? " → " : " → ");
  return pretty;
}

/**
 * Builds contextual explanations from real profile, signals, and route —
 * reusable on Home, Search, and PDP without duplicating page-specific strings.
 */
export function generateAIExplanation(
  userContext: AIExplanationUserContext,
  pageContext: AIExplanationPageContext,
  locale: AppLocale,
): AIExplanation[] {
  const { profile, signals } = userContext;
  const experience = buildHomeExperience(profile, signals);
  const { segment, moduleOrder, curatedSort, merchSort, tone } = experience;
  const visitLine = signals.isReturning
    ? L(
        locale,
        `${signals.visitCount}ª visita detectada. Preferências derivadas do histórico local (sessão).`,
        `Visit #${signals.visitCount} detected. Preferences informed by your local session history.`,
      )
    : L(
        locale,
        "Primeira visita neste dispositivo. Conteúdo otimizado para descoberta rápida.",
        "First visit on this device. Content weighted for fast discovery.",
      );

  const deviceLine = L(
    locale,
    signals.device === "desktop"
      ? "Layout desktop: mais espaço para comparativos e fichas."
      : "Layout mobile: prioridade a fluxos curtos e CTAs acessíveis.",
    signals.device === "desktop"
      ? "Desktop layout: more room for compare blocks and specs."
      : "Mobile layout: short paths and thumb-friendly CTAs.",
  );

  const cards: AIExplanation[] = [];

  if (pageContext.kind === "home") {
    cards.push({
      id: "content-modules",
      type: "content",
      title: L(locale, "Organização do conteúdo", "Content organization"),
      description: L(
        locale,
        `Sequência de módulos para o segmento atual: ${formatModuleOrder(locale, moduleOrder)}. Tom ${tone === "consultative" ? "consultivo" : "direto"} alinhado ao perfil.`,
        `Module order for this segment: ${formatModuleOrder(locale, moduleOrder)}. Tone is ${tone === "consultative" ? "consultative" : "action-oriented"} for the active profile.`,
      ),
    });
  } else if (pageContext.kind === "search") {
    const raw = pageContext.searchQuery?.trim() || pageContext.intent?.rawQuery || "";
    cards.push({
      id: "content-search",
      type: "content",
      title: L(locale, "Organização do conteúdo", "Content organization"),
      description: L(
        locale,
        raw
          ? `Resultados estruturados em resumo de intenção, destaque e grade — consulta ativa: “${raw.slice(0, 120)}${raw.length > 120 ? "…" : ""}”.`
          : "Resultados em camadas: resumo, melhor correspondência e grade — prontos para refinar pela barra flutuante.",
        raw
          ? `Layered results: intent summary, best match, grid — active query: “${raw.slice(0, 120)}${raw.length > 120 ? "…" : ""}”.`
          : "Layered results: summary, best match, and grid — refine via the floating search dock.",
      ),
    });
  } else if (pageContext.kind === "pdp") {
    const p = pageContext.product;
    cards.push({
      id: "content-pdp",
      type: "content",
      title: L(locale, "Organização do conteúdo", "Content organization"),
      description: p
        ? L(
            locale,
            `Ficha do produto prioriza hero, fit para o perfil “${shopperDisplayName(profile)}”, avaliações e políticas — ordem ajustada ao estágio de consideração.`,
            `PDP stacks hero, ${shopperDisplayName(profile)}-aware fit, reviews, and policies — ordered for consideration stage.`,
          )
        : L(
            locale,
            "Ficha do produto segue o modelo editorial da vitrine para este perfil.",
            "Product page follows the storefront editorial model for this profile.",
          ),
    });
  } else {
    cards.push({
      id: "content-chat",
      type: "content",
      title: L(locale, "Organização do conteúdo", "Content organization"),
      description: L(
        locale,
        "Experiência de chat mantém o contexto da vitrine e prioriza próximas perguntas úteis.",
        "Chat keeps storefront context and prioritizes helpful follow-ups.",
      ),
    });
  }

  cards.push({
    id: "curation-segment",
    type: "curation",
    title: L(locale, "Curadoria de produtos", "Product curation"),
    description: L(
      locale,
      `Segmento ativo: ${segmentLabel(locale, segment)}. Compare, continuar e vitrine usam os mesmos sinais de funil.`,
      `Active segment: ${segmentLabel(locale, segment)}. Compare, continue, and curated rails share this funnel signal.`,
    ),
  });

  cards.push({
    id: "pricing-strategy",
    type: "pricing",
    title: L(locale, "Estratégia de preço na vitrine", "Pricing strategy"),
    description: L(
      locale,
      `${curatedSortLabel(locale, curatedSort)} ${merchSortLabel(locale, merchSort)}`,
      `${curatedSortLabel(locale, curatedSort)} ${merchSortLabel(locale, merchSort)}`,
    ),
  });

  if (pageContext.kind === "search" && pageContext.intent) {
    const b = pageContext.intent.budget;
    cards.push({
      id: "ranking-search",
      type: "ranking",
      title: L(locale, "Lógica de ranking", "Ranking logic"),
      description: L(
        locale,
        b
          ? `“Melhor correspondência” combina perfil ${shopperDisplayName(profile)}, intenção parseada e teto de R$ ${b.toLocaleString(locale === "pt-BR" ? "pt-BR" : "en-US")}.`
          : `Ranking prioriza compatibilidade com o perfil ${shopperDisplayName(profile)} e economia declarada na busca.`,
        b
          ? `Best match blends ${shopperDisplayName(profile)} profile, parsed intent, and a budget cap of ${b.toLocaleString(locale === "pt-BR" ? "pt-BR" : "en-US")}.`
          : `Ranking weights ${shopperDisplayName(profile)} fit and savings signals from the query.`,
      ),
    });
  } else {
    cards.push({
      id: "ranking-modules",
      type: "ranking",
      title: L(locale, "Priorização", "Prioritization"),
      description: L(
        locale,
        `Ordem dos blocos na home reflete o segmento (${segment}) — não é uma lista genérica fixa.`,
        `Home block order reflects segment (${segment}) — not a static generic layout.`,
      ),
    });
  }

  const productTier =
    pageContext.product?.marginTier === "high"
      ? L(locale, "margem alta", "high margin tier")
      : pageContext.product?.marginTier === "mid"
        ? L(locale, "margem média", "mid margin tier")
        : pageContext.product?.marginTier === "low"
          ? L(locale, "entrada de gama", "entry margin tier")
          : null;

  const dataDescription = L(
    locale,
    `${visitLine} Canal: ${trafficLabel(locale, signals.trafficChannel)}. ${deviceLine}${
      productTier && pageContext.kind === "pdp"
        ? ` Preço exibido segue o catálogo local; tier comercial: ${productTier}.`
        : ""
    }`,
    `${visitLine} Channel: ${trafficLabel(locale, signals.trafficChannel)}. ${deviceLine}${
      productTier && pageContext.kind === "pdp"
        ? ` Shown price follows local catalog; commercial tier: ${productTier}.`
        : ""
    }`,
  );

  cards.push({
    id: "data-model",
    type: "data",
    title: L(locale, "Modelo de dados", "Data model"),
    description: dataDescription,
  });

  return cards;
}
