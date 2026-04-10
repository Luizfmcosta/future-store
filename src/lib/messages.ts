/**
 * UI copy (English). Edit strings here — dot paths match `useT("section.key")`.
 */
export const messages: Record<string, string | Record<string, string | Record<string, string>>> = {
    metaTitle: "Future Store — AI-first storefront",
    metaDescription:
      "Explore how AI transforms customer experience, monetization, and operations in a new era of commerce.",
    common: {
      uploadImage: "Upload image",
      voiceInput: "Voice input",
      addAttachment: "Add image",
      searchPillLabel: "Search",
      searchPillHint: "Open search and suggestions",
      moreOptions: "More options",
      sendMessage: "Send message",
      cart: "Cart",
      home: "Home",
      explore: "Explore",
      buyNow: "Buy Now",
      askProduct: "Ask",
      tvs: "TVs",
      speakers: "Speakers",
      audio: "Audio",
      sound: "Sound",
      ourProducts: "Our Products",
      promptSuggestionsAria: "Suggested prompts matching what you typed",
    },
    topBar: {
      ariaHome: "Home",
      signIn: "Sign in",
    },
    footer: {
      rights: "2026 Future Store. All rights reserved.",
      languageLabel: "Language",
    },
    hero: {
      marina: {
        kicker: "Continue where you left off",
        titleLine1: "Build the dream setup you were exploring, Marina",
        titleLine2: "",
        subtitle:
          "At Future Store, we blend innovation with tradition to elevate your home entertainment, crafting experiences for extraordinary moments.",
        cta: "Meet Future Store",
        featuredEyebrow: "Featured for you",
      },
      ricardo: {
        kicker: "Inspired by You",
        titleLine1: "Designed by",
        titleLine2: "Intelligence",
        subtitle:
          "At Future Store, we blend smart technology with honest pricing to bring you the best sound in every room — crafted for real living rooms.",
        cta: "Meet Future Store",
        featuredEyebrow: "This week",
      },
      ricardoPromo: {
        kicker: "Weekend offers",
        /** \\u00a0 keeps “30% off” together; one line in the Ricardo hero (see `whitespace-nowrap` in `RicardoPromoHero`). */
        headline: "Up to 30%\u00a0off speakers",
        fromLabel: "Starting from",
        cta: "View offers",
      },
    },
    proof: {
      marina: "What owners cite in reviews",
      ricardo: "Most chosen right now",
    },
    continueJourney: {
      exploreBrand: "Explore {brand}",
      headline: "Continue where\nyou left off",
      marinaEyebrow: "A strong foundation for you",
      marinaHeadline: "Start with a soundbar that defines your system",
      marinaProductLine: "Stage Compact soundbar",
      marinaCta: "View product",
      marinaBody:
        "Clear dialogue, balanced sound and easy integration with TVs — a reliable starting point for a home theater setup.",
      ricardoBody:
        "A practical, value-smart pick for better everyday sound.",
      ricardoEntryEyebrow: "Popular right now",
      ricardoEntryHeadline: "A great place to start",
      ricardoEntryProductLine: "Horizon Three wireless speaker",
      ricardoEntryBody:
        "Well-balanced sound, easy setup and one of the most chosen models.",
      ricardoEntryCta: "View product",
    },
    compare: {
      marinaEyebrow: "Because you like eco-friendly materials",
      marinaHeadline: "Consider a standalone\nspeaker instead of a soundbar",
      marinaBody:
        "A single-speaker setup can deliver wide, room-filling sound — while a soundbar is more focused on TV audio. See which approach fits your space better.",
      marinaCta: "View comparison",
      ricardoEyebrow: "More options",
      ricardoHeadline: "Explore the full range\nof speakers",
      ricardoBody:
        "From compact portable models to more powerful setups for your living room — find the one that fits your space and budget.",
      ricardoCta: "Shop speakers",
      cta: "Explore",
    },
    curated: {
      marinaHeadline: "Compare two ways to build your system",
      marinaBody:
        "Different configurations to match your space, expectations and budget.",
      ricardoHeadline: "Best options around\nR$ 2,000",
      ricardoBody:
        "Popular picks with strong performance in this price range.",
      marinaTierA: "Compact setup",
      marinaTierB: "Full surround",
      marinaCardATitle: "Stage Compact + SubStage Mini",
      marinaCardBTitle: "Stage Ultra + sub + rear speakers",
      marinaCardASub: "Home Theater",
      marinaCardBSub: "Living Room TV",
      marinaCardABlurb:
        "Balanced sound with added bass, ideal for smaller living rooms.",
      marinaCardBBlurb:
        "More immersive sound with surround channels and deeper bass for larger spaces.",
      ricardoPromoHeadline: "Best options around\nR$ 2,000",
      ricardoPromoBody:
        "Popular picks with strong performance in this price range.",
    },
    merch: {
      headlineLine1: "Sound in every room,",
      headlineLine2: "without wires",
      ricardoVolumeLine: "2,340 units sold this month on promo models",
      /** Ricardo merch strip — minimal promo pill on cards */
      discountOff: "{pct}% off",
      /** Screen reader: sale vs list on Ricardo merch cards */
      ricardoPromoPriceAria: "Sale price {sale}, was {list} ({pct}% off).",
    },
    ricardoTiktok: {
      eyebrow: "Customer videos",
      title: "See how these speakers actually perform",
      subline: "Real setups, real use — so you know what to expect.",
      embedTitle: "TikTok video",
    },
    spotlight: {
      marinaEyebrow: "How to choose",
      marinaHeadline: "What makes a home theater sound better",
      marinaBody:
        "Understand how soundbars, subwoofers and rear speakers work together — and what to prioritize based on your space.",
      marinaCta: "View guide",
      marinaImageAlt:
        "Wide-angle line drawing of a living room with a TV, soundbar, subwoofer, and speakers around the seating area.",
      ricardoEyebrow: "More power, still simple",
      ricardoHeadline: "Studio Reference wireless speaker",
      ricardoBody:
        "Stereo‑ready hi‑fi wireless speaker with line‑in for turntables and DJ gear—deep, clean output in most rooms without a separate sub.",
      ricardoCta: "View product",
    },
    floatingSearch: {
      placeholder: "Ask anything you want",
    },
    narrative: {
      shopper: "Shopper",
      stage: "Stage",
      vision: "Vision",
      visionHuman: "Human",
      visionAi: "AI",
    },
    aiVision: {
      eyebrow: "AI vision on",
      title: "How this page was built",
      close: "Close",
      closeOverlay: "Close AI vision layer",
    },
    stageNav: {
      aria: "Stage",
      home: "Home",
      searchChat: "Search/Chat",
      serp: "Results",
      pdp: "PDP",
      cart: "Cart",
    },
    cart: {
      close: "Close cart",
      label: "Cart",
      itemInCartAria: "1 item in your cart",
      itemsInCartAria: "{count} items in your cart",
      empty: "Your cart is empty",
      recommendedBundle: "Recommended bundle",
      premiumAlternative: "Premium alternative",
      cheaperAlternative: "Cheaper alternative",
      accessoryTipPortableTitle: "Taking it with you?",
      accessoryTipPortableBody: "A small case helps protect it in your bag.",
      accessoryTipPortableAskSeed:
        "What small case should I use to protect my portable speaker in my bag?",
      accessoryTipTvTitle: "Using this with your TV?",
      accessoryTipTvBody: "A high-speed HDMI cable ensures the best audio connection.",
      accessoryTipTvAskSeed:
        "What high-speed HDMI cable should I use for the best audio connection from my TV?",
      emptyDescription:
        "Your bag is empty. Open a product and tap add to cart to save it here before checkout.",
      continueShopping: "Continue shopping",
      removeLine: "Remove",
      decreaseQuantity: "Decrease quantity",
      increaseQuantity: "Increase quantity",
      viewBundlePart: "View bundle add-on",
      subtotal: "Subtotal",
      quantityLine: "Qty: {qty}",
      checkout: "Checkout",
      premiumPairing: "Premium pairing",
      leanerAddOn: "Leaner add-on",
      bundleEyebrow: "Bundle",
      saveAmount: "Save {amount}",
      details: "Details",
      virtualPremiumMarinaTitle: "Spatial upgrade — Horizon Three",
      virtualPremiumMarinaBlurb: "Add flagship spatial audio to your setup",
      virtualPremiumRicardoTitle: "Upgrade path — Horizon Three",
      virtualPremiumRicardoBlurb: "Step-up clarity for open rooms",
      virtualCheaperTitle: "Lean add-on — {name}",
      virtualCheaperBlurbMarina: "Portable speaker to extend your system",
      virtualCheaperBlurbRicardo: "Keeps monthly payment lower",
      bundleDefBndEraRoamTitle: "Shelf + portable — Horizon One + Trail Mini",
      bundleDefBndEraRoamBody: "Room-filling smart speaker plus an ultra-portable for everywhere else",
      bundleDefBndEraPairRoamTitle: "Whole-home starter — 2-Room Horizon + Trail Mini",
      bundleDefBndEraPairRoamBody: "Stereo or two rooms, plus a travel speaker in one bundle",
      bundleDefBndMoveRoamTitle: "Outdoor duo — Trail Max + Trail Mini",
      bundleDefBndMoveRoamBody: "Patio power and pocketable backup for trips",
      bundleDefBndEraMoveTitle: "Indoor / outdoor — Horizon One + Trail Max",
      bundleDefBndEraMoveBody: "Room speaker at home plus weather-ready sound for patio and travel",
      bundleDefBndArcSubTitle: "Premium entertainment — Stage Ultra + SubStage Pro",
      bundleDefBndArcSubBody: "Flagship Atmos bar with deep low-end in one stack",
      bundleDefBndBeamRoamTitle: "TV + pocket — Stage Compact (Gen 2) + Trail Mini",
      bundleDefBndBeamRoamBody: "Living room clarity plus an ultra-portable for everywhere else",
      bundleDefBndFiveEra300Title: "Hi-fi + spatial — Studio Reference + Horizon Three",
      bundleDefBndFiveEra300Body: "Stereo-capable flagship with line-in plus Atmos music for open plans",
    },
    appShell: {
      exitFullscreen: "Exit fullscreen",
      resizeHandle: "Drag to resize storefront width",
      profileSwitcherGroup: "Shopper profile",
      widthPresetsGroup: "Quick storefront width",
      widthPresetMobile: "Mobile",
      widthPresetDesktop: "Desktop",
    },
    homeWelcome: {
      title: "Welcome",
      tagline: "More personalization. More precision. Less noise.",
      start: "Start",
      ariaResetDemo: "Return to the welcome screen",
    },
    profileCard: {
      expand: "Expand",
      collapse: "Collapse",
      ariaExpand: "Expand profile details",
      ariaCollapse: "Collapse profile details",
      sectionAria: "Profile details — {name}",
      marina: {
        tag1: "Returning shopper",
        tag2: "Desktop",
        tag3: "Reference sound",
        bio: "Researches with care: compares specs, technical reviews, and room fit before buying.",
        bio2: "Prioritizes clear picture and sound with measurable proof.",
      },
      ricardo: {
        tag1: "First visit",
        tag2: "Mobile",
        tag3: "Price-led",
        bio: "Wants fast decisions guided by deals and what’s trending.",
        bio2: "Sees promos, bestsellers, and strong value picks first.",
      },
      aiAgent: {
        tag1: "Architecture demo",
        tag2: "API-first",
        tag3: "Agent-ready",
        bio: "Machine-readable catalog, context APIs, and open protocols built for agentic commerce.",
        bio2: "Unified data investment: catalog, pricing rules, and interoperability standards.",
      },
    },
    agentBento: {
      pageAria: "Agentic commerce architecture overview",
      heroLine1: "One architecture serving several commerce experiences.",
      heroLine2: "AI APIs, Open Agent Protocols, Unified Data.",
      p1: {
        title: "Unified product data",
        agent: "Machine-readable catalog — SKU, price, stock, SLA, specs, bundle rules",
      },
      p2: {
        title: "Context & personalization engine",
        agent: "API context response — query params replace layout; ranked results, no chrome",
      },
      p3: {
        title: "Agent-generated content",
        agent: "Content generation API — prompt templates + catalog data, brand guardrails as rules",
      },
      p4: {
        title: "Dynamic pricing & bundle rules",
        agent: "Negotiation API — price floor, bundle margin, agent-to-agent ruleset",
      },
      p5: {
        title: "Open agent protocols",
        agent: "MCP · A2A · ACP · UCP — standardized agent discovery and interoperability",
      },
    },
    searchOverlay: {
      placeholder: "Ask about wireless speakers, portables, or accessories…",
      categoriesHint: "Categories",
      quickTry: "Try",
      relatedOnPdp: "Related on this page",
      pdpChipsTitle: "Suggestions for this product",
      close: "Close search",
      similarPicks: "Similar picks",
      suggestedQuestions: "Suggested questions",
      warrantyPolicy: "Warranty & policy",
      trendingNow: "Trending now",
      refineSearch: "Refine Search",
      searchButton: "Search",
      shortcutHint: "to open · Enter to search",
      placeholderSearch: "Ask anything you want",
      placeholderPdpBrand: "Ask about {brand}…",
      onThisPage: "On this page · ",
      srSearchTitle: "Search Future Store",
      srSearchPdpTitle: "Search — {title}",
      ariaSearchQuery: "Search query",
      closeButton: "Close",
      browseCategory: "Browse {label} — {hint}",
    },
    searchChips: {
      compare: "Compare alternatives to {title}",
      moreTech: "More {tech} options like {brand}",
      moreBrand: "More from {brand}",
      delivery: "Delivery, install, and {returns}",
      soundbarHdmi: "Soundbars and HDMI setup for {title}",
      speakerExtras: "Accessories and pairing for {title}",
      bestFor: "Is this model right for {useCase}?",
    },
    searchCategories: {
      tv: "Televisions",
      tvHint: "Panel type, room size",
      speaker: "Wireless speakers",
      speakerHint: "WiFi, Bluetooth, room or portable",
      soundbar: "Soundbars",
      soundbarHint: "Atmos, living room",
      accessory: "Accessories",
      accessoryHint: "Mounts, HDMI",
    },
    searchSerp: {
      modeRegular: "Results",
      /** Results tab: PLP adaptation (rank/title) is loading — avoid showing query then swapping to LLM title. */
      plpLoadingAria: "Loading search results",
      modeAi: "Chat",
      modeAria: "Results and chat",
      intentSummaryTitle: "Intent summary",
      resultsFor: "Results for:",
      browseFallback: "Browse catalog",
      /** PLP H1 when query normalizes to “cheap headphones” (see `IntentSummary`). */
      plpTitleCheapHeadphones: "Budget-friendly headphones for you",
      filterIntentAria: "Open filters",
      filterIntentLabel: "Filter",
      filterBarAria: "Filters and sort",
      resultsCountPill: "{count} results",
      filterChipCategory: "Category",
      filterChipOnSale: "On sale",
      filterChipSort: "Sort",
      intentLabelDistance: "Listening / distance",
      intentLabelRoom: "Room",
      intentLabelBudget: "Budget band",
      intentLabelPriority: "Priority",
      intentLabelDelivery: "Delivery",
      intentRoomDistance3m: "~3 m listening distance",
      intentRoomLiving: "Living room",
      intentSizeFlexible: "Flexible — ranked by intent",
      intentSizeCompact: "Compact speakers and bundles in range",
      intentSizeRoom3m: "Speakers and soundbars sized for ~3 m rooms",
      intentBudgetUpTo: "Up to {amount}",
      intentBudgetFlexible: "Flexible",
      intentDeliveryStandard: "Standard options",
      intentDeliverySooner: "Faster delivery when available",
      intentPriorityBestValue: "Best value",
      intentPriorityPremium: "Premium / flagship",
      intentPriorityCinema: "Home theater / immersion",
      intentPrioritySports: "Live events",
      intentGeneralRoom: "General",
      bestMatchAiEyebrow: "Best pick for your room and budget",
      bestMatchSerpEyebrow: "Top result",
      compareEyebrow: "Compare",
      compareTitleMarina: "Three setups — pick your tradeoff",
      compareTitleRicardo: "Three picks — fastest path",
      resultsAllMatches: "All matches",
      refineGridButton: "Refine",
      refineGridAria: "Refine search results",
      sponsored: "Sponsored",
      learningCompact: "Quick read",
      refineEyebrow: "Refine",
      refineTitle: "Intent adjustments",
      refineBody:
        "In production, refinements would re-rank deterministically. Here, use profile + chips to steer the narrative.",
      refineCloseAria: "Close",
      compareFitMarinaFlagship: "Flagship listening",
      compareFitMarinaPortable: "Portable & outdoor",
      compareFitMarinaBalanced: "Balanced room sound",
      compareFitRicardoBudget: "Budget-smart",
      compareFitRicardoMid: "Popular mid tier",
      learningSurroundTitle: "Surround vs stereo",
      learningSurroundBody:
        "A home theater set adds rear channels; stereo pairs shine for music in one room.",
      learningSurroundTag: "2 min read",
      learningPortableTitle: "Portable vs room",
      learningPortableBody:
        "Trail Mini and Trail Max are built to move; Horizon models anchor a room with fuller output.",
      learningPortableTag: "Quick guide",
    },
    chatAssistant: {
      narrativeEmptyIntro: "We couldn’t rank speakers from the catalog for that yet.",
      narrativeEmptyYourAsk: "Your message: “{preview}”",
      narrativeEmptyHint:
        "Try adding a budget (e.g. up to 5000), room size (e.g. 3 m), or spatial-audio interest. The sources below reflect how trusted outlets review speakers and soundbars — we’ll match products once intent is clearer.",
      narrativeIntro:
        "Here are {count} top matches ranked for Future Store — informed by the kind of speaker reviews and comparisons you’ll find from trusted outlets.",
      narrativeAskLine: "You asked: “{preview}”",
      narrativeBudgetLine: "Budget signal: around {amount}.",
      narrativeRoomLine: "Room: {room}.",
      narrativePriorityLine: "Priority: {priority}.",
      narrativeFooter:
        "The source chips cite those editorial standards; the product cards are Future Store picks aligned with them.\n\nOpen a card for the full PDP, or refine your ask below.",
      ctxBudget: "budget ~{amount}",
      ctxRoom: "{room}",
      ctxPriority: "{priority}",
      ctxSuffixAsk: " Your ask maps to: {ctx}.",
      catalogNoteHasResults:
        " Future Store’s top matches below are ranked using signals consistent with this editorial coverage.",
      catalogNoteNoResults:
        " Once your intent is clear, we’ll rank catalog picks using signals consistent with this editorial coverage.",
      sourceTecMundoTitle: "TecMundo — reviews & comparisons",
      sourceTecMundoDesc:
        "Brazilian reviews and roundups we use to weigh specs, price-to-performance, and everyday speaker use.",
      sourceTechTudoTitle: "TechTudo — reviews & guides",
      sourceTechTudoDesc:
        "Editorial comparisons and buying angles that inform how we balance timbre, connectivity, and budget.",
      sourceLttTitle: "Linus Tech Tips",
      sourceLttDesc:
        "Hands-on testing that shapes how we treat Bluetooth, WiFi, battery life, and living-room use.",
      sourceRtingsTitle: "RTINGS — speakers & soundbars",
      sourceRtingsDesc:
        "Measurement-led audio reviews aligned with the signals we use for frequency response, imaging, and output.",
      /** PDP comparison fallback (see chatAssistant). */
      pdpComparisonIntro:
        "Here are 3 top matches ranked for Future Store vs {title}",
      pdpComparisonProfileLine:
        "You asked for other options and based on your profile we are prioritizing {priority}.",
      pdpComparisonPriorityFallback: "best value",
      pdpComparisonCheaper: "{amount} less than what you’re viewing",
      pdpComparisonPricier: "{amount} more than what you’re viewing",
      pdpComparisonSamePrice: "Same price tier as what you’re viewing",
      pdpComparisonNoAlts: "No other catalog matches yet — refine your ask (room, budget, or form factor).",
    },
    searchAiPanel: {
      reasoning: "Reasoning",
      matchingLine: "Matching intent to products and editorial sources",
      placeholderReasoning: "Reasoning…",
      placeholderAsk: "Ask a follow-up…",
      ariaMessage: "AI mode message",
      sendAria: "Send message",
      topMatches: "Top matches",
      followUpHeading: "Follow up",
      sourcesLabel: "Sources",
    },
    pdp: {
      ask: "Ask",
      askHint: "Use Ask in the fixed bottom bar to open chat with this product in context.",
      chatOverlayTitle: "Assistant",
      /** PDP: chat opened from the prompt (comparison-style assistant). Fallback when product is unknown. */
      chatComparisonTitle: "Compare & explore",
      /** PDP comparison sheet title — {title} is the product name on the current PDP. */
      chatComparisonTitleWithProduct: "{title} Comparison",
      /** PDP chat: horizontal product strip (no “Top matches” eyebrow). */
      chatComparisonProductsGroup: "Products to compare",
      chatComparisonAnchorEyebrow: "You’re viewing",
      chatComparisonAlternativesEyebrow: "Other options",
      chatCloseAria: "Close chat",
      searchResultsOverlayTitle: "Search results",
      addToCart: "Add to cart",
      buyNow: "Buy now",
      back: "Back",
      notFound: "Product not found.",
      pairTvs: "Pair with soundbars",
      pairSpeakers: "Pair with speakers",
      descriptionHeading: "About this product",
      colorLabel: "Color",
      quantityLabel: "Quantity",
      decreaseQty: "Decrease quantity",
      increaseQty: "Increase quantity",
      skuLabel: "SKU",
      reviewsCount: "{count} reviews",
      reviewSummaryEyebrow: "Reviews",
      reviewAngleMarina: "Quality and tradeoffs",
      reviewAngleRicardo: "Trust and popularity",
      reviewStrengthsLabel: "Strengths",
      reviewTradeoffsLabel: "Tradeoffs",
      compatibilityEyebrow: "Connectivity",
      compatibilityTitle: "Integration & playback",
      compatibilityBody:
        "Network, Bluetooth, and formats this unit supports — what you use day to day to play audio and fit it into your home.",
      colors: {
        matteBlack: "Matte black",
        lunarWhite: "Lunar white",
        graphite: "Graphite",
        olive: "Olive",
        titanGray: "Titan gray",
        silverMist: "Silver mist",
        gunmetal: "Gunmetal",
      },
      promptHeading: "Ask with this product in context",
      promptHint: "The chip pins this item to your question.",
      promptPlaceholder: "e.g. Is it enough for an open-plan room? Compare to…",
      promptAria: "Question about this product",
      featuresHeading: "Features",
      moreInfo: "More info",
      storyHeadline: "Personal listening, perfected",
      policyReturnsLabel: "Returns",
      policyWarrantyLabel: "Warranty",
      policyHeading: "Warranty and returns",
      compareEyebrow: "Worth considering too",
      idealEyebrow: "Ideal for you",
    },
    socialProof: {
      club: "Future Store Club",
      marinaHeadline: "Club For Home\nCinema Enthusiasts",
      ricardoHeadline: "Club For Smart\nShoppers",
      marinaBody:
        "Get early access to new releases, exclusive calibration guides, and member-only pricing on premium panels and sound systems.",
      ricardoBody:
        "Get notified about flash deals, exclusive bundles, and member-only coupons. No spam, just savings delivered to your inbox.",
    },
    experience: {
      marinaResearch: {
        continueHeadline: "Start with a soundbar that defines your system",
        continueBody:
          "Clear dialogue, balanced sound and easy integration with TVs — a reliable starting point for a home theater setup.",
        continueCta: "View product",
        compareCta: "View comparison",
        spotlightCta: "View guide",
        merchEyebrow: "Explore other options",
        merchLine1: "Different ways to build",
        merchLine2: "your sound setup",
        socialHeadline: "What reviewers\ncall out first",
        socialBody:
          "Write-ups focused on imaging, soundstage, and integration — for shoppers who research before they buy.",
        socialCta: "Read reviews",
      },
      marinaExplore: {
        continueHeadline: "Start with a soundbar that defines your system",
        continueBody:
          "Clear dialogue, balanced sound and easy integration with TVs — a reliable starting point for a home theater setup.",
        continueCta: "View product",
        compareCta: "View comparison",
        spotlightCta: "View guide",
        merchEyebrow: "Browse the line",
        merchLine1: "Sound in every room,",
        merchLine2: "without wires",
        socialHeadline: "Guides &\ntechnical reviews",
        socialBody:
          "Deeper content on drivers, DSP, and ecosystem fit — before you pull the trigger.",
        socialCta: "Browse stories",
      },
      ricardoSpeed: {
        continueHeadline: "Featured deals",
        continueBody:
          "A fast lane to what’s selling now — clear pricing and installments at a glance.",
        continueCta: "See the deal",
        compareCta: "Shop speakers",
        spotlightCta: "View product",
        merchEyebrow: "Compare options",
        merchLine1: "Budget-Friendly Favorites",
        merchLine2: "",
        socialHeadline: "Buyers are\nadding these",
        socialBody:
          "High order volume and fast delivery windows — built for quick decisions.",
        socialCta: "See best sellers",
      },
      ricardoValue: {
        continueHeadline: "Standout value\non display",
        continueBody:
          "Popular picks with transparent pricing and straightforward delivery — decide quickly with no fuss.",
        continueCta: "View product",
        compareCta: "Shop speakers",
        spotlightCta: "View product",
        merchEyebrow: "Compare options",
        merchLine1: "Budget-Friendly Favorites",
        merchLine2: "",
        socialHeadline: "Most chosen\nthis week",
        socialBody:
          "Ranked by sales volume and ratings — transparency for fast decisions.",
        socialCta: "See best sellers",
      },
    },
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Dot-path lookup, e.g. `hero.marina.kicker` or `common.cart`. */
export function getMessage(path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = messages;

  for (const p of parts) {
    if (!isPlainObject(cur) || !(p in cur)) {
      return undefined;
    }
    cur = cur[p];
  }

  return typeof cur === "string" ? cur : undefined;
}

export function formatMessage(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  let s = template;
  for (const [k, v] of Object.entries(params)) {
    s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}
