import type { AppLocale } from "@/lib/locale-types";

/**
 * UI copy: default site language is pt-BR; en-US mirrors former English strings.
 */
export const messages: Record<
  AppLocale,
  Record<string, string | Record<string, string | Record<string, string>>>
> = {
  "pt-BR": {
    metaTitle: "Future Store — vitrine com IA em primeiro lugar",
    metaDescription:
      "Protótipo de vitrine premium e adaptativa — comércio centrado na interface.",
    common: {
      about: "Sobre",
      cart: "Carrinho",
      home: "Início",
      explore: "Explorar",
      buyNow: "Comprar agora",
      tvs: "TVs",
      speakers: "Caixas",
      audio: "Áudio",
      sound: "Som",
      ourProducts: "Nossos produtos",
    },
    topBar: {
      ariaHome: "Início",
    },
    footer: {
      rights: "2026 Future Store. Todos os direitos reservados.",
      languageLabel: "Idioma",
    },
    hero: {
      marina: {
        kicker: "Inspirado por você",
        titleLine1: "Adaptado ao",
        titleLine2: "seu contexto",
        subtitle:
          "Na Future Store, unimos inovação e tradição para elevar seu entretenimento em casa, criando experiências para momentos extraordinários.",
        cta: "Conheça a Future Store",
        featuredEyebrow: "Destaque para você",
      },
      ricardo: {
        kicker: "Inspirado por você",
        titleLine1: "Adaptado ao",
        titleLine2: "seu contexto",
        subtitle:
          "Na Future Store, unimos tecnologia inteligente e preço justo para trazer o melhor som em cada ambiente — feito para salas de estar reais.",
        cta: "Conheça a Future Store",
        featuredEyebrow: "Esta semana",
      },
    },
    proof: {
      marina: "O que donos citam nas avaliações",
      ricardo: "Mais escolhidos agora",
    },
    continueJourney: {
      exploreBrand: "Explorar {brand}",
      headline: "Continue onde\nvocê parou",
      marinaBody:
        "Retomamos sua pesquisa por som de referência: o mesmo modelo em destaque para o seu perfil, com acabamentos para combinar com o ambiente — refine a última milha antes de decidir.",
      ricardoBody:
        "Seguimos da onde você parou: uma escolha prática com bom custo-benefício, pronta para levar som melhor para o dia a dia.",
    },
    compare: {
      marinaHeadline: "Cinema em casa\npremium",
      ricardoHeadline: "Qualidade de som\nincrível",
      marinaBody:
        "Experimente o equilíbrio perfeito entre precisão e imersão em cada cena. Som frontal nítido, surrounds que fecham o palco e profundidade digna de sala dedicada — tudo no mesmo tom acústico.",
      ricardoBody:
        "Experimente som nítido e presente pelo melhor custo-benefício. Configuração simples, desempenho confiável e preço que faz sentido para quem quer evoluir sem complicação.",
      cta: "Explorar",
    },
    curated: {
      marinaHeadline: "Feito para cinema,\nperfeito para você",
      ricardoHeadline: "Feito para valor,\nperfeito para você",
      marinaBody:
        "Explore o contraste entre áudio espacial e som que preenche a sala. Duas filosofias moldadas pela acústica, refinadas para o seu ambiente — como você pesquisa, antes de fechar o carrinho.",
      ricardoBody:
        "Explore nossas opções com melhor custo-benefício e as mais populares da faixa média. Dois caminhos para um som melhor, pensados para orçamentos reais.",
      marinaTierA: "Referência de imersão",
      marinaTierB: "Alternativa sólida",
    },
    merch: {
      headlineLine1: "Som em cada ambiente,",
      headlineLine2: "sem fio",
    },
    spotlight: {},
    floatingSearch: {
      placeholder: "Pergunte qualquer coisa",
    },
    narrative: {
      shopper: "Comprador",
      stage: "Etapa",
      vision: "Visão",
      visionHuman: "Humano",
      visionAi: "IA",
    },
    aiVision: {
      eyebrow: "Visão de IA ativa",
      title: "Como esta página foi construída",
      close: "Fechar",
      closeOverlay: "Fechar visão de IA",
    },
    aboutPage: {
      metaTitle: "Sobre — Future Store",
      metaDescription:
        "Uma loja que se adapta a cada pessoa. Entenda como a IA organiza conteúdo, produtos e ofertas em tempo real.",
      heroTitle: "A loja que muda para cada pessoa",
      heroSubtitle: "Descubra como a IA adapta produtos, conteúdo e ofertas em tempo real — e por que você vê uma versão diferente da mesma vitrine.",
      ctaExplore: "Explorar a experiência",
      ctaAi: "Ativar Visão de IA",
      centralLine: "A loja não é fixa. Ela se adapta a você.",
      multiTitle: "Uma loja, múltiplas experiências",
      multiIntro:
        "A mesma URL pode parecer outra loja: o que muda é a ordem dos blocos, os produtos em destaque e o tom da conversa — tudo de acordo com o contexto.",
      labelMarina: "Perfil premium",
      labelRicardo: "Perfil valor",
      compareHeroMarina: "Hero editorial, foco em imersão e comparações profundas.",
      compareHeroRicardo: "Hero direto, destaque para ofertas e decisão rápida.",
      compareProductsMarina: "Curadoria prioriza referência e faixa alta.",
      compareProductsRicardo: "Curadoria prioriza mais vendidos e melhor custo-benefício.",
      compareToneMarina: "Tom consultivo — espaço para pesquisar antes de comprar.",
      compareToneRicardo: "Tom objetivo — menos fricção, mais clareza de preço.",
      iaDoingTitle: "O que a IA está fazendo",
      blockContentTitle: "Organização do conteúdo",
      blockContentBody:
        "A ordem dos módulos na home muda: continuar, comparativo, prova social e vitrine não são fixos — são reordenados pelo seu perfil e sinais de visita.",
      blockCurationTitle: "Curadoria de produtos",
      blockCurationBody:
        "Os destaques não são genéricos: o sistema combina perfil (ex.: Marina vs Ricardo), histórico local e segmento do funil para escolher o que aparece primeiro.",
      blockPricingTitle: "Estratégia de preço",
      blockPricingBody:
        "Parcelamento, ênfase em faixa de preço e ordenação da vitrine seguem o mesmo contexto — para destacar o que faz sentido naquele momento.",
      blockRankingTitle: "Lógica de ranking",
      blockRankingBody:
        "Na busca, a “melhor correspondência” mistura intenção da consulta, perfil e sinais de economia — não é uma lista estática.",
      visionTitle: "Visão Humana vs Visão de IA",
      visionHumanTitle: "Visão Humana",
      visionHumanBody: "Interface limpa, focada em navegar e comprar — sem camadas explicativas.",
      visionAiTitle: "Visão de IA",
      visionAiBody:
        "Uma camada mostra, em tempo real, por que a página está daquele jeito: organização, curadoria, preço e dados — para a inteligência ficar visível, não escondida.",
      visionCta: "Ativar Visão de IA na loja",
      mockEyebrow: "Visão de IA ativa",
      mockTitle: "Como esta página foi construída",
      mockCard1Title: "Organização do conteúdo",
      mockCard1Body: "Sequência de módulos ajustada ao seu segmento atual.",
      mockCard2Title: "Curadoria de produtos",
      mockCard2Body: "Destaques alinhados ao perfil e ao histórico da sessão.",
      flowTitle: "Como a decisão acontece",
      flowStepUser: "Você",
      flowStepContext: "Contexto",
      flowStepIa: "IA",
      flowStepPage: "Página adaptada",
      flowContextDetail: "Dispositivo, origem do tráfego e comportamento (ex.: primeira ou recorrente visita).",
      flowExample1: "Veio do Instagram → o funil pode priorizar ofertas e clareza de preço.",
      flowExample2: "Usuário recorrente → mais profundidade em comparativos e continuidade de navegação.",
      whyTitle: "Por que isso importa",
      whyUserTitle: "Para quem compra",
      whyUser1: "Encontra o que precisa com menos esforço.",
      whyUser2: "Experiência mais relevante para o momento.",
      whyBizTitle: "Para o negócio",
      whyBiz1: "Mais conversão com a mesma vitrine.",
      whyBiz2: "Menos fricção na descoberta.",
      whyBiz3: "Uso mais inteligente dos dados — com transparência para quem usa a loja.",
      finalTitle: "Experimente a loja que se adapta a você",
      finalCtaStore: "Entrar na loja",
      finalCtaAi: "Ativar Visão de IA",
      pillTransparent: "Transparente",
      pillAdaptive: "Adaptativa",
      pillExplainable: "Explicável",
    },
    stageNav: {
      aria: "Etapa",
      home: "Início",
      searchChat: "Busca/Chat",
      serp: "SERP",
      pdp: "PDP",
      cart: "Carrinho",
    },
    cart: {
      close: "Fechar carrinho",
      label: "Carrinho",
      title: "Complete sua experiência de som",
      inBag: "Na sacola",
      empty: "Seu carrinho está vazio",
      recommendedBundle: "Pacote recomendado",
      premiumAlternative: "Alternativa premium",
      cheaperAlternative: "Alternativa mais acessível",
      extendedPeace: "Tranquilidade ampliada",
      emptyHint: "Adicione uma caixa na página do produto para ver combos contextuais.",
      viewBundlePart: "Ver produto do combo",
      subtotal: "Subtotal",
      checkoutDemo: "Finalizar (demo)",
    },
    appShell: {
      exitFullscreen: "Sair da tela cheia",
    },
    searchOverlay: {
      placeholder: "Pergunte sobre caixas sem fio, portáteis ou acessórios…",
      categoriesHint: "Categorias",
      quickTry: "Experimente",
      relatedOnPdp: "Relacionados nesta página",
      pdpChipsTitle: "Sugestões para este produto",
      close: "Fechar busca",
      similarPicks: "Seleções similares",
      suggestedQuestions: "Perguntas sugeridas",
      warrantyPolicy: "Garantia e política",
      trendingNow: "Em alta",
      quickSearches: "Buscas rápidas",
      searchButton: "Buscar",
      shortcutHint: "para abrir · Enter para buscar",
      placeholderSearch: "Buscar na Future Store…",
      placeholderPdpBrand: "Pergunte sobre {brand}…",
      onThisPage: "Nesta página · ",
      srSearchTitle: "Buscar na Future Store",
      srSearchPdpTitle: "Buscar — {title}",
      ariaSearchQuery: "Consulta de busca",
      closeButton: "Fechar",
      browseCategory: "Explorar {label} — {hint}",
    },
    searchChips: {
      compare: "Compare alternativas a {title}",
      moreTech: "Mais opções {tech} como {brand}",
      moreBrand: "Mais da {brand}",
      delivery: "Entrega, instalação e {returns}",
      soundbarHdmi: "Soundbars e cabos HDMI para {title}",
      speakerExtras: "Acessórios e pareamento para {title}",
      bestFor: "Este modelo serve para {useCase}?",
    },
    searchCategories: {
      tv: "Televisores",
      tvHint: "OLED, QLED, tamanho da sala",
      speaker: "Caixas sem fio",
      speakerHint: "WiFi, Bluetooth, sala ou portátil",
      soundbar: "Soundbars",
      soundbarHint: "Atmos, sala de estar",
      accessory: "Acessórios",
      accessoryHint: "Suportes, HDMI",
    },
    pdp: {
      addToCart: "Adicionar ao carrinho",
      back: "Voltar",
      openSearch: "Abrir busca",
      ask: "Perguntar",
      notFound: "Produto não encontrado.",
      pairTvs: "Combinar com TVs",
      pairSpeakers: "Combinar com caixas",
    },
    socialProof: {
      club: "Future Store Club",
      marinaHeadline: "Clube para\napaixonados por\ncinema em casa",
      ricardoHeadline: "Clube para\ncompradores\ninteligentes",
      marinaBody:
        "Acesso antecipado a lançamentos, guias exclusivos de calibração e preços só para membros em painéis premium e sistemas de som.",
      ricardoBody:
        "Receba alertas de ofertas relâmpago, combos exclusivos e cupons para membros. Sem spam — só economia na sua caixa de entrada.",
    },
    experience: {
      marinaResearch: {
        continueHeadline: "Continue de onde\nvocê parou",
        continueBody:
          "Retomamos o que você estava avaliando: modelos premium e integração com o ambiente — com espaço para comparar especificações antes de decidir.",
        continueCta: "Explorar detalhes",
        compareCta: "Ver comparativo",
        spotlightCta: "Ver ficha técnica",
        merchEyebrow: "Catálogo curado",
        merchLine1: "Alto desempenho",
        merchLine2: "para sua sala",
        socialHeadline: "O que especialistas\ndestacam nas avaliações",
        socialBody:
          "Análises com foco em timbre, cena sonora e integração — para quem pesquisa antes de investir.",
        socialCta: "Ler análises",
      },
      marinaExplore: {
        continueHeadline: "Seu próximo passo\nem áudio",
        continueBody:
          "Quando quiser retomar, seus favoritos e comparativos ficam aqui — comece pelos setups que mais combinam com ambientes integrados.",
        continueCta: "Explorar detalhes",
        compareCta: "Abrir comparativo",
        spotlightCta: "Ver produto",
        merchEyebrow: "Descubra o catálogo",
        merchLine1: "Som em cada ambiente,",
        merchLine2: "sem fio",
        socialHeadline: "Guias e\nreviews técnicos",
        socialBody:
          "Profundidade de conteúdo para quem quer entender drivers, DSP e integração antes de comprar.",
        socialCta: "Explorar conteúdo",
      },
      ricardoSpeed: {
        continueHeadline: "Ofertas em destaque",
        continueBody:
          "Seleção rápida com os modelos mais pedidos agora — preço à vista e parcelamento claro.",
        continueCta: "Ver oferta",
        compareCta: "Comprar agora",
        spotlightCta: "Comprar agora",
        merchEyebrow: "Mais vendidos",
        merchLine1: "Os favoritos",
        merchLine2: "da galera",
        socialHeadline: "Quem comprou,\naprovou",
        socialBody:
          "Milhares de pedidos entregues — ofertas com estoque e entrega rápida.",
        socialCta: "Ver mais vendidos",
      },
      ricardoValue: {
        continueHeadline: "Continue com\no melhor preço",
        continueBody:
          "Retomamos da onde você parou: opções com bom custo-benefício e entrega sem complicação.",
        continueCta: "Comprar agora",
        compareCta: "Ver oferta",
        spotlightCta: "Ver oferta",
        merchEyebrow: "Melhor custo-benefício",
        merchLine1: "Som em cada ambiente,",
        merchLine2: "sem fio",
        socialHeadline: "Os mais escolhidos\nagora",
        socialBody:
          "Ranking por volume de vendas e avaliações — transparência para decidir rápido.",
        socialCta: "Ver mais vendidos",
      },
    },
  },
  "en-US": {
    metaTitle: "Future Store — AI-first storefront",
    metaDescription: "Premium, adaptive storefront prototype — interface-first commerce.",
    common: {
      about: "About",
      cart: "Cart",
      home: "Home",
      explore: "Explore",
      buyNow: "Buy Now",
      tvs: "TVs",
      speakers: "Speakers",
      audio: "Audio",
      sound: "Sound",
      ourProducts: "Our Products",
    },
    topBar: {
      ariaHome: "Home",
    },
    footer: {
      rights: "2026 Future Store. All rights reserved.",
      languageLabel: "Language",
    },
    hero: {
      marina: {
        kicker: "Inspired by You",
        titleLine1: "Designed by",
        titleLine2: "Intelligence",
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
    },
    proof: {
      marina: "What owners cite in reviews",
      ricardo: "Most chosen right now",
    },
    continueJourney: {
      exploreBrand: "Explore {brand}",
      headline: "Continue where\nyou left off",
      marinaBody:
        "We picked up your research thread: the same model highlighted for your profile, with finishes that match your space — refine the last mile before you decide.",
      ricardoBody:
        "Picking up where you left off: a practical, value-smart choice ready to bring better sound to everyday listening.",
    },
    compare: {
      marinaHeadline: "Premium\nhome cinema",
      ricardoHeadline: "Incredible\nsound quality",
      marinaBody:
        "Experience the perfect balance of precision and immersion in every scene. Crisp front sound, matched surrounds, and depth worthy of a dedicated room — all tuned to the same sonic signature.",
      ricardoBody:
        "Experience clear, engaging sound at the best value. Simple setup, reliable performance, and a price that makes sense when you want more without the fuss.",
      cta: "Explore",
    },
    curated: {
      marinaHeadline: "Crafted for cinema,\nperfected for you",
      ricardoHeadline: "Crafted for value,\nperfected for you",
      marinaBody:
        "Explore the depth of spatial audio and the punch of room-filling sound. Two philosophies shaped by acoustics, refined for your room — the way you research before you buy.",
      ricardoBody:
        "Explore our best-value picks and the most popular mid-range options. Two paths to better sound, shaped for real budgets.",
      marinaTierA: "Immersion flagship",
      marinaTierB: "Strong alternative",
    },
    merch: {
      headlineLine1: "Sound in every room,",
      headlineLine2: "without wires",
    },
    spotlight: {},
    floatingSearch: {
      placeholder: "Ask anything",
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
    aboutPage: {
      metaTitle: "About — Future Store",
      metaDescription:
        "A store that adapts to every person. See how AI organizes content, products, and offers in real time.",
      heroTitle: "The store that changes for every person",
      heroSubtitle:
        "See how AI adapts products, content, and offers in real time — and why you see a different version of the same storefront.",
      ctaExplore: "Explore the experience",
      ctaAi: "Turn on AI vision",
      centralLine: "The store isn’t fixed. It adapts to you.",
      multiTitle: "One store, many experiences",
      multiIntro:
        "The same URL can feel like a different shop: what changes is block order, featured products, and the tone of the journey — all driven by context.",
      labelMarina: "Premium profile",
      labelRicardo: "Value profile",
      compareHeroMarina: "Editorial hero focused on immersion and deeper comparison.",
      compareHeroRicardo: "Direct hero highlighting deals and fast decisions.",
      compareProductsMarina: "Curation favors flagship tiers and reference picks.",
      compareProductsRicardo: "Curation favors bestsellers and strong value.",
      compareToneMarina: "Consultative tone — room to research before you buy.",
      compareToneRicardo: "Direct tone — less friction, clearer pricing.",
      iaDoingTitle: "What the AI is doing",
      blockContentTitle: "Content organization",
      blockContentBody:
        "Home module order shifts: continue, compare, social proof, and merchandising aren’t fixed — they’re reordered by profile and visit signals.",
      blockCurationTitle: "Product curation",
      blockCurationBody:
        "Highlights aren’t generic: the system blends profile (e.g. Marina vs Ricardo), local history, and funnel segment to choose what shows first.",
      blockPricingTitle: "Pricing strategy",
      blockPricingBody:
        "Installments, price emphasis, and catalog ordering follow the same context — surfacing what makes sense in that moment.",
      blockRankingTitle: "Ranking logic",
      blockRankingBody:
        "In search, “best match” blends query intent, profile, and savings signals — it isn’t a static list.",
      visionTitle: "Human vision vs AI vision",
      visionHumanTitle: "Human vision",
      visionHumanBody: "A clean interface focused on browsing and buying — no explanatory layers.",
      visionAiTitle: "AI vision",
      visionAiBody:
        "A layer shows, in real time, why the page looks that way: organization, curation, pricing, and data — so intelligence is visible, not hidden.",
      visionCta: "Turn on AI vision in the store",
      mockEyebrow: "AI vision on",
      mockTitle: "How this page was built",
      mockCard1Title: "Content organization",
      mockCard1Body: "Module sequence tuned to your current segment.",
      mockCard2Title: "Product curation",
      mockCard2Body: "Highlights aligned with profile and session history.",
      flowTitle: "How the decision happens",
      flowStepUser: "You",
      flowStepContext: "Context",
      flowStepIa: "AI",
      flowStepPage: "Adapted page",
      flowContextDetail: "Device, traffic source, and behavior (e.g. first vs returning visit).",
      flowExample1: "Came from Instagram → the funnel may prioritize deals and price clarity.",
      flowExample2: "Returning visitor → more depth in comparisons and journey continuity.",
      whyTitle: "Why it matters",
      whyUserTitle: "For shoppers",
      whyUser1: "Find what you need with less effort.",
      whyUser2: "A more relevant experience for the moment.",
      whyBizTitle: "For the business",
      whyBiz1: "More conversion from the same storefront.",
      whyBiz2: "Less friction in discovery.",
      whyBiz3: "Smarter use of data — with transparency for people using the store.",
      finalTitle: "Try the store that adapts to you",
      finalCtaStore: "Enter the store",
      finalCtaAi: "Turn on AI vision",
      pillTransparent: "Transparent",
      pillAdaptive: "Adaptive",
      pillExplainable: "Explainable",
    },
    stageNav: {
      aria: "Stage",
      home: "Home",
      searchChat: "Search/Chat",
      serp: "SERP",
      pdp: "PDP",
      cart: "Cart",
    },
    cart: {
      close: "Close cart",
      label: "Cart",
      title: "Complete your listening experience",
      inBag: "In bag",
      empty: "Your cart is empty",
      recommendedBundle: "Recommended bundle",
      premiumAlternative: "Premium alternative",
      cheaperAlternative: "Cheaper alternative",
      extendedPeace: "Extended peace of mind",
      emptyHint: "Add a speaker from the PDP to see contextual bundles.",
      viewBundlePart: "View bundle add-on",
      subtotal: "Subtotal",
      checkoutDemo: "Checkout (demo)",
    },
    appShell: {
      exitFullscreen: "Exit fullscreen",
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
      quickSearches: "Quick searches",
      searchButton: "Search",
      shortcutHint: "to open · Enter to search",
      placeholderSearch: "Search Future Store…",
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
      tvHint: "OLED, QLED, room size",
      speaker: "Wireless speakers",
      speakerHint: "WiFi, Bluetooth, room or portable",
      soundbar: "Soundbars",
      soundbarHint: "Atmos, living room",
      accessory: "Accessories",
      accessoryHint: "Mounts, HDMI",
    },
    pdp: {
      addToCart: "Add to cart",
      back: "Back",
      openSearch: "Open search",
      ask: "Ask",
      notFound: "Product not found.",
      pairTvs: "Pair TVs",
      pairSpeakers: "Pair with speakers",
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
        continueHeadline: "Pick up where\nyou left off",
        continueBody:
          "We’re surfacing what you were researching: premium models and room fit — with room to compare specs before you commit.",
        continueCta: "Explore details",
        compareCta: "View comparison",
        spotlightCta: "View specs",
        merchEyebrow: "Curated catalog",
        merchLine1: "High performance",
        merchLine2: "for your room",
        socialHeadline: "What reviewers\ncall out first",
        socialBody:
          "Write-ups focused on imaging, soundstage, and integration — for shoppers who research before they buy.",
        socialCta: "Read reviews",
      },
      marinaExplore: {
        continueHeadline: "Your next step\nin sound",
        continueBody:
          "When you’re ready to continue, favorites and comparisons live here — start with setups built for integrated homes.",
        continueCta: "Explore details",
        compareCta: "Open comparison",
        spotlightCta: "View product",
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
        compareCta: "Buy now",
        spotlightCta: "Buy now",
        merchEyebrow: "Top sellers",
        merchLine1: "Crowd favorites",
        merchLine2: "right now",
        socialHeadline: "Buyers are\nadding these",
        socialBody:
          "High order volume and fast delivery windows — built for quick decisions.",
        socialCta: "See best sellers",
      },
      ricardoValue: {
        continueHeadline: "Keep the best\nprice path",
        continueBody:
          "We’ll pick up where you stopped: strong value picks with straightforward delivery.",
        continueCta: "Buy now",
        compareCta: "See offer",
        spotlightCta: "See offer",
        merchEyebrow: "Best value",
        merchLine1: "Sound in every room,",
        merchLine2: "without wires",
        socialHeadline: "Most chosen\nthis week",
        socialBody:
          "Ranked by sales volume and ratings — transparency for fast decisions.",
        socialCta: "See best sellers",
      },
    },
  },
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Dot-path lookup, e.g. `hero.marina.kicker` or `common.about`. */
export function getMessage(locale: AppLocale, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = messages[locale];

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
