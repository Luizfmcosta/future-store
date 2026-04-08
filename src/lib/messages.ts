import type { AppLocale } from "@/lib/locale-types";

/**
 * UI copy: default site language is en-US; pt-BR is the Portuguese variant.
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
      uploadImage: "Enviar imagem",
      voiceInput: "Entrada por voz",
      addAttachment: "Anexar imagem",
      searchPillLabel: "Buscar",
      searchPillHint: "Abrir busca e sugestões",
      moreOptions: "Mais opções",
      sendMessage: "Enviar mensagem",
      cart: "Carrinho",
      home: "Início",
      explore: "Explorar",
      buyNow: "Comprar agora",
      tvs: "TVs",
      speakers: "Caixas",
      audio: "Áudio",
      sound: "Som",
      ourProducts: "Nossos produtos",
      promptSuggestionsAria: "Sugestões de texto que combinam com o que você digitou",
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
      joana: {
        kicker: "Inspirado por você",
        titleLine1: "Adaptado ao",
        titleLine2: "seu contexto",
        subtitle:
          "Na Future Store, equilibramos som envolvente e decisão tranquila — curadoria clara, comparações úteis e produtos que fazem sentido no seu ritmo.",
        cta: "Conheça a Future Store",
        featuredEyebrow: "Para você",
      },
      ricardoPromo: {
        kicker: "Oferta do fim de semana",
        headline: "Caixas de som com até 30% OFF",
        subhead:
          "Portáteis e para sala, Wi‑Fi e Bluetooth, até 12x. Estoque limitado — modelos selecionados.",
        fromLabel: "A partir de",
        cta: "Ver ofertas",
      },
    },
    proof: {
      marina: "O que donos citam nas avaliações",
      ricardo: "Mais escolhidos agora",
      joana: "Destaques que combinam valor e experiência",
    },
    continueJourney: {
      exploreBrand: "Explorar {brand}",
      headline: "Continue onde\nvocê parou",
      marinaBody:
        "Retomamos sua pesquisa por som de referência: o mesmo modelo em destaque para o seu perfil, com acabamentos para combinar com o ambiente — refine a última milha antes de decidir.",
      ricardoBody:
        "Uma escolha prática com bom custo-benefício para trazer som melhor ao dia a dia.",
      joanaBody:
        "Retomamos no meio termo: som forte e design que combina com a sala — com espaço para comparar e decidir sem pressa.",
      ricardoEntryHeadline: "Comece por um modelo\ncom ótimo custo-benefício",
      ricardoEntryBody:
        "Uma entrada leve e portátil da linha: som nítido, uso simples e preço que faz sentido como primeiro passo.",
      ricardoEntryCta: "Ver produto",
    },
    compare: {
      marinaHeadline: "Cinema em casa\npremium",
      ricardoHeadline: "Qualidade de som\nincrível",
      marinaBody:
        "Experimente o equilíbrio perfeito entre precisão e imersão em cada cena. Som frontal nítido, surrounds que fecham o palco e profundidade digna de sala dedicada — tudo no mesmo tom acústico.",
      ricardoBody:
        "Experimente som nítido e presente pelo melhor custo-benefício. Configuração simples, desempenho confiável e preço que faz sentido para quem quer evoluir sem complicação.",
      joanaHeadline: "Som que preenche\na sala com equilíbrio",
      joanaBody:
        "Experimente presença sonora e versatilidade no ponto certo entre referência e praticidade — para ambientes que pedem presença sem excesso.",
      cta: "Explorar",
    },
    curated: {
      marinaHeadline: "Feito para cinema,\nperfeito para você",
      ricardoHeadline: "Feito para valor,\nperfeito para você",
      marinaBody:
        "Explore o contraste entre áudio espacial e som que preenche a sala. Duas filosofias moldadas pela acústica, refinadas para o seu ambiente — como você pesquisa, antes de fechar o carrinho.",
      ricardoBody:
        "Explore nossas opções com melhor custo-benefício e as mais populares da faixa média. Dois caminhos para um som melhor, pensados para orçamentos reais.",
      joanaHeadline: "Feito para ouvir bem,\nsem complicar",
      joanaBody:
        "Duas rotas que equilibram performance e uso real: uma com mais corpo para a sala, outra mais enxuta — você escolhe o que combina com o momento.",
      marinaTierA: "Referência de imersão",
      marinaTierB: "Alternativa sólida",
      joanaTierA: "Presença na sala",
      joanaTierB: "Opção enxuta",
      ricardoPromoHeadline: "Mais vendidos\nna faixa de entrada",
      ricardoPromoBody:
        "Seleção direta: o que mais sai para salas como a sua — sem texto longo, com preço e estoque visíveis.",
    },
    merch: {
      headlineLine1: "Som em cada ambiente,",
      headlineLine2: "sem fio",
      ricardoVolumeLine: "2.340 unidades vendidas este mês em modelos em promoção",
    },
    ricardoTiktok: {
      eyebrow: "Na rede",
      title: "O que outros clientes comentam",
      subline: "Experiências compartilhadas que ajudam você a decidir com mais segurança.",
      embedTitle: "Vídeo do TikTok",
    },
    spotlight: {},
    floatingSearch: {
      placeholder: "Pergunte o que quiser",
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
    stageNav: {
      aria: "Etapa",
      home: "Início",
      searchChat: "Busca/Chat",
      serp: "Resultados",
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
      premiumPairing: "Combinação premium",
      leanerAddOn: "Complemento enxuto",
      bundleEyebrow: "Combo",
      saveAmount: "Economize {amount}",
      details: "Detalhes",
      loyaltyEyebrow: "Associação",
      loyaltyTitle: "Proteção estendida + atendimento prioritário",
      loyaltyBody:
        "Cobertura estruturada para equipamento e instalação — mostrada aqui como sugestão discreta, sem pressão.",
      loyaltyCta: "Ver plano (demo)",
      virtualPremiumMarinaTitle: "Upgrade espacial — Era 300",
      virtualPremiumMarinaBlurb: "Acrescente som espacial de referência ao que você já escolheu.",
      virtualPremiumRicardoTitle: "Caminho de upgrade — Era 300",
      virtualPremiumRicardoBlurb: "Mais clareza e presença sonora em salas amplas.",
      virtualPremiumJoanaTitle: "Upgrade equilibrado — Era 300",
      virtualPremiumJoanaBlurb: "Mais corpo e detalhe para a sala, sem exagerar no pacote.",
      virtualCheaperTitle: "Complemento portátil — {name}",
      virtualCheaperBlurbMarina: "Caixa para levar e estender seu sistema para outros ambientes.",
      virtualCheaperBlurbRicardo: "Mantém a parcela mais acessível com um extra útil.",
      virtualCheaperBlurbJoana: "Complemento prático que equilibra custo e versatilidade.",
      bundleDefBndEraRoamTitle: "Prateleira + portátil — Era 100 + Roam 2",
      bundleDefBndEraRoamBody: "Caixa inteligente para a sala e ultra portátil para o resto do dia",
      bundleDefBndEraPairRoamTitle: "Kit multiambiente — 2 salas Era + Roam",
      bundleDefBndEraPairRoamBody: "Estéreo ou dois cômodos, mais uma caixa de viagem no mesmo pacote",
      bundleDefBndMoveRoamTitle: "Dúo externo — Move 2 + Roam 2",
      bundleDefBndMoveRoamBody: "Força na varanda e backup de bolso para viagens",
      bundleDefBndEraMoveTitle: "Dentro e fora — Era 100 + Move 2",
      bundleDefBndEraMoveBody: "Caixa para o cômodo e som resistente para varanda e viagem",
      bundleDefBndArcSubTitle: "Home theater premium — Arc Ultra + Sub 4",
      bundleDefBndArcSubBody: "Barra Atmos de referência com graves profundos no pacote",
      bundleDefBndBeamRoamTitle: "TV + bolso — Beam (Gen 2) + Roam 2",
      bundleDefBndBeamRoamBody: "Clareza na sala e ultra portátil para o resto do dia",
      bundleDefBndFiveEra300Title: "Hi-fi + espacial — Five + Era 300",
      bundleDefBndFiveEra300Body: "Referência estéreo com line-in e música em Atmos na mesma conta",
    },
    appShell: {
      exitFullscreen: "Sair da tela cheia",
      resizeHandle: "Arrastar para ajustar a largura da vitrine",
      profileSwitcherGroup: "Perfil do comprador",
      widthPresetsGroup: "Largura rápida da vitrine",
      widthPresetMobile: "Mobile",
      widthPresetDesktop: "Desktop",
    },
    profileCard: {
      expand: "Expandir",
      collapse: "Recolher",
      ariaExpand: "Expandir detalhes do perfil",
      ariaCollapse: "Recolher detalhes do perfil",
      sectionAria: "Detalhes do perfil — {name}",
      marina: {
        tag1: "Usuária recorrente",
        tag2: "Desktop",
        tag3: "Som de referência",
        bio: "Pesquisa com calma: compara especificações, reviews técnicos e encaixe no ambiente antes de decidir.",
        bio2: "Prioriza clareza de imagem e som com provas mensuráveis.",
      },
      ricardo: {
        tag1: "Primeiro uso",
        tag2: "Mobile",
        tag3: "Busca por preço",
        bio: "Quer decidir rápido, guiado por ofertas e pelo que está em alta.",
        bio2: "Vê promoções, mais vendidos e opções de melhor custo-benefício.",
      },
      joana: {
        tag1: "Usuária recorrente",
        tag2: "Mobile",
        tag3: "Equilíbrio",
        bio: "Busca som que preencha a sala com bom senso:",
        bio2: "curadoria clara, comparações úteis e decisão sem pressa — valor e experiência no ponto certo.",
      },
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
      placeholderSearch: "Pergunte o que quiser",
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
    searchSerp: {
      modeRegular: "Resultados",
      modeAi: "Chat",
      modeAria: "Resultados e chat",
      intentSummaryTitle: "Resumo da intenção",
      resultsFor: "Resultados para:",
      browseFallback: "Explorar catálogo",
      filterIntentAria: "Abrir filtros",
      filterIntentLabel: "Filtrar",
      intentLabelDistance: "Escuta / distância",
      intentLabelRoom: "Ambiente",
      intentLabelBudget: "Faixa de preço",
      intentLabelPriority: "Prioridade",
      intentLabelDelivery: "Entrega",
      intentRoomDistance3m: "Sala com escuta a ~3 m",
      intentRoomLiving: "Sala de estar",
      intentSizeFlexible: "Flexível — ordenado pela intenção",
      intentSizeCompact: "Caixas compactas e kits na faixa de preço",
      intentSizeRoom3m: "Caixas e soundbars proporcionais ao ambiente (~3 m)",
      intentBudgetUpTo: "Até {amount}",
      intentBudgetFlexible: "Flexível",
      intentDeliveryStandard: "Opções padrão",
      intentDeliverySooner: "Entrega mais rápida, se disponível",
      intentPriorityBestValue: "Melhor custo-benefício",
      intentPriorityPremium: "Referência / premium",
      intentPriorityCinema: "Home theater / imersão",
      intentPrioritySports: "Eventos ao vivo",
      intentGeneralRoom: "Geral",
      bestMatchAiEyebrow: "Melhor opção para seu ambiente e orçamento",
      bestMatchSerpEyebrow: "Melhor resultado",
      compareEyebrow: "Comparar",
      compareTitleMarina: "Três jeitos de equipar — escolha o equilíbrio",
      compareTitleRicardo: "Três opções — caminho mais rápido",
      compareTitleJoana: "Três caminhos — som claro, decisão no seu tempo",
      resultsAllMatches: "Todas as correspondências",
      refineGridButton: "Refinar",
      refineGridAria: "Refinar resultados da busca",
      sponsored: "Patrocinado",
      learningCompact: "Leitura rápida",
      refineEyebrow: "Refinar",
      refineTitle: "Ajustes de intenção",
      refineBody:
        "Em produção, refinamentos reordenariam de forma determinística. Aqui, use o perfil e as sugestões para guiar a narrativa.",
      refineCloseAria: "Fechar",
      compareFitMarinaFlagship: "Som de referência",
      compareFitMarinaPortable: "Portátil e externo",
      compareFitMarinaBalanced: "Som equilibrado para sala",
      compareFitRicardoBudget: "Custo-benefício",
      compareFitRicardoMid: "Faixa média popular",
      compareFitJoanaBalanced: "Equilíbrio sala e valor",
      learningSurroundTitle: "Surround vs estéreo",
      learningSurroundBody:
        "Um kit home theater traz canais traseiros; pares estéreo brilham em música no mesmo ambiente.",
      learningSurroundTag: "2 min de leitura",
      learningPortableTitle: "Portátil vs sala fixa",
      learningPortableBody:
        "Roam e Move foram feitos para levar; os modelos Era ancoram a sala com mais corpo sonoro.",
      learningPortableTag: "Guia rápido",
    },
    chatAssistant: {
      narrativeEmptyIntro: "Ainda não ranqueamos caixas no catálogo para essa pergunta.",
      narrativeEmptyYourAsk: "Sua mensagem: “{preview}”",
      narrativeEmptyHint:
        "Tente incluir orçamento (ex.: até 5000), tamanho da sala (ex.: 3 m), ou interesse em som espacial. As fontes abaixo refletem como veículos de confiança avaliam caixas e soundbars — alinharemos produtos quando a intenção estiver clara.",
      narrativeIntro:
        "Aqui estão {count} destaques ranqueados na Future Store — informados pelo tipo de análise que você encontra em reviews de áudio e comparativos de confiança.",
      narrativeAskLine: "Você perguntou: “{preview}”",
      narrativeBudgetLine: "Sinal de orçamento: cerca de {amount}.",
      narrativeRoomLine: "Ambiente: {room}.",
      narrativePriorityLine: "Prioridade: {priority}.",
      narrativeFooter:
        "Os chips citam essas referências editoriais; os cards são escolhas da Future Store alinhadas a elas.\n\nAbra um card para ver a página do produto ou refine a pergunta abaixo.",
      ctxBudget: "orçamento ~{amount}",
      ctxRoom: "{room}",
      ctxPriority: "{priority}",
      ctxSuffixAsk: " Sua busca mapeia para: {ctx}.",
      catalogNoteHasResults:
        " Os destaques abaixo usam os mesmos sinais que essa cobertura editorial.",
      catalogNoteNoResults:
        " Quando a intenção estiver clara, ranqueamos o catálogo com sinais alinhados a essa cobertura.",
      sourceTecMundoTitle: "TecMundo — reviews e comparativos",
      sourceTecMundoDesc:
        "Análises e rodadas brasileiras que pesam especificações, custo-benefício e uso real de caixas e soundbars.",
      sourceTechTudoTitle: "TechTudo — reviews e guias",
      sourceTechTudoDesc:
        "Comparativos editoriais e ângulos de compra que informam como equilibramos timbre, conectividade e preço.",
      sourceLttTitle: "Linus Tech Tips",
      sourceLttDesc:
        "Testes práticos e debates de bancada que moldam como tratamos Bluetooth, WiFi, bateria e uso em sala.",
      sourceRtingsTitle: "RTINGS — speakers e soundbars",
      sourceRtingsDesc:
        "Medições objetivas de áudio alinhadas aos sinais que usamos para resposta em frequência, imaging e volume.",
    },
    searchAiPanel: {
      emptyState:
        "Digite uma pergunta no campo abaixo ou faça uma busca pela barra superior. Baseamos as sugestões em reviews de confiança e mostramos produtos compatíveis.",
      reasoning: "Raciocínio",
      matchingLine: "Cruzando intenção com produtos e fontes editoriais",
      placeholderReasoning: "Raciocinando…",
      placeholderAsk: "Faça um complemento…",
      ariaMessage: "Mensagem para o modo IA",
      sendAria: "Enviar mensagem",
      topMatches: "Principais resultados",
      sourcesLabel: "Fontes",
    },
    pdp: {
      addToCart: "Adicionar ao carrinho",
      back: "Voltar",
      openSearch: "Abrir busca",
      ask: "Perguntar",
      notFound: "Produto não encontrado.",
      pairTvs: "Combinar com soundbars",
      pairSpeakers: "Combinar com caixas",
      recommendedFor: "Recomendado para:",
      compatibilityEyebrow: "Conectividade",
      compatibilityTitle: "Integração e reprodução",
      compatibilityBody:
        "Rede, Bluetooth e formatos suportados por este modelo — o que você usa no dia a dia para tocar música e integrar à casa.",
    },
    socialProof: {
      club: "Future Store Club",
      marinaHeadline: "Clube para\napaixonados por\ncinema em casa",
      ricardoHeadline: "Clube para\ncompradores\ninteligentes",
      joanaHeadline: "Clube para\nquem quer o melhor\nsem pressa",
      marinaBody:
        "Acesso antecipado a lançamentos, guias exclusivos de calibração e preços só para membros em painéis premium e sistemas de som.",
      ricardoBody:
        "Receba alertas de ofertas relâmpago, combos exclusivos e cupons para membros. Sem spam — só economia na sua caixa de entrada.",
      joanaBody:
        "Conteúdos que conectam especificação e uso real, ofertas selecionadas e lembretes úteis — menos ruído, mais clareza na escolha.",
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
        continueHeadline: "Melhor custo-benefício\nem destaque",
        continueBody:
          "Seleção com preço claro, modelos populares e entrega objetiva — para decidir rápido sem complicação.",
        continueCta: "Ver produto",
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
      tvs: "TVs",
      speakers: "Speakers",
      audio: "Audio",
      sound: "Sound",
      ourProducts: "Our Products",
      promptSuggestionsAria: "Suggested prompts matching what you typed",
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
      joana: {
        kicker: "Inspired by You",
        titleLine1: "Designed by",
        titleLine2: "Intelligence",
        subtitle:
          "At Future Store, we balance immersive sound with a calm path to decide — clear curation, helpful comparisons, and products that fit your pace.",
        cta: "Meet Future Store",
        featuredEyebrow: "For you",
      },
      ricardoPromo: {
        kicker: "Weekend deal",
        headline: "Speakers with up to 30% OFF",
        subhead:
          "Portable and room speakers, Wi‑Fi & Bluetooth, up to 12 installments. Limited stock — selected models.",
        fromLabel: "Starting at",
        cta: "View offers",
      },
    },
    proof: {
      marina: "What owners cite in reviews",
      ricardo: "Most chosen right now",
      joana: "Highlights that blend value and experience",
    },
    continueJourney: {
      exploreBrand: "Explore {brand}",
      headline: "Continue where\nyou left off",
      marinaBody:
        "We picked up your research thread: the same model highlighted for your profile, with finishes that match your space — refine the last mile before you decide.",
      ricardoBody:
        "A practical, value-smart pick for better everyday sound.",
      joanaBody:
        "We meet you in the middle: powerful sound and design that fits the living room — room to compare and decide without rush.",
      ricardoEntryHeadline: "Start with a standout\nvalue pick",
      ricardoEntryBody:
        "A light, portable entry in the range — clear sound, simple setup, and pricing that works as a first step.",
      ricardoEntryCta: "View product",
    },
    compare: {
      marinaHeadline: "Premium\nhome cinema",
      ricardoHeadline: "Incredible\nsound quality",
      marinaBody:
        "Experience the perfect balance of precision and immersion in every scene. Crisp front sound, matched surrounds, and depth worthy of a dedicated room — all tuned to the same sonic signature.",
      ricardoBody:
        "Experience clear, engaging sound at the best value. Simple setup, reliable performance, and a price that makes sense when you want more without the fuss.",
      joanaHeadline: "Sound that fills\nthe room — in balance",
      joanaBody:
        "Feel room-filling presence and versatility between reference and everyday practicality — for spaces that want impact without excess.",
      cta: "Explore",
    },
    curated: {
      marinaHeadline: "Crafted for cinema,\nperfected for you",
      ricardoHeadline: "Crafted for value,\nperfected for you",
      marinaBody:
        "Explore the depth of spatial audio and the punch of room-filling sound. Two philosophies shaped by acoustics, refined for your room — the way you research before you buy.",
      ricardoBody:
        "Explore our best-value picks and the most popular mid-range options. Two paths to better sound, shaped for real budgets.",
      joanaHeadline: "Made to sound great,\nwithout the noise",
      joanaBody:
        "Two routes that balance performance and real life: one with more body for the room, one leaner — you pick what fits the moment.",
      marinaTierA: "Immersion flagship",
      marinaTierB: "Strong alternative",
      joanaTierA: "Presence in the room",
      joanaTierB: "Leaner option",
      ricardoPromoHeadline: "Top sellers\nin the entry range",
      ricardoPromoBody:
        "Straight picks: what moves fastest for rooms like yours — clear price and stock, no long reads.",
    },
    merch: {
      headlineLine1: "Sound in every room,",
      headlineLine2: "without wires",
      ricardoVolumeLine: "2,340 units sold this month on promo models",
    },
    ricardoTiktok: {
      eyebrow: "On social",
      title: "What other shoppers are saying",
      subline: "Shared experiences that help you decide with more confidence.",
      embedTitle: "TikTok video",
    },
    spotlight: {},
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
      premiumPairing: "Premium pairing",
      leanerAddOn: "Leaner add-on",
      bundleEyebrow: "Bundle",
      saveAmount: "Save {amount}",
      details: "Details",
      loyaltyEyebrow: "Membership",
      loyaltyTitle: "Extended protection + priority service",
      loyaltyBody:
        "Structured coverage for hardware and install — surfaced here as a calm upsell, not a hard sell.",
      loyaltyCta: "View plan (demo)",
      virtualPremiumMarinaTitle: "Spatial upgrade — Era 300",
      virtualPremiumMarinaBlurb: "Add flagship spatial audio to your setup",
      virtualPremiumRicardoTitle: "Upgrade path — Era 300",
      virtualPremiumRicardoBlurb: "Step-up clarity for open rooms",
      virtualPremiumJoanaTitle: "Balanced upgrade — Era 300",
      virtualPremiumJoanaBlurb: "More body and detail for the room without overbuilding the bundle.",
      virtualCheaperTitle: "Lean add-on — {name}",
      virtualCheaperBlurbMarina: "Portable speaker to extend your system",
      virtualCheaperBlurbRicardo: "Keeps monthly payment lower",
      virtualCheaperBlurbJoana: "Practical add-on that balances cost and versatility.",
      bundleDefBndEraRoamTitle: "Shelf + portable — Era 100 + Roam 2",
      bundleDefBndEraRoamBody: "Room-filling smart speaker plus an ultra-portable for everywhere else",
      bundleDefBndEraPairRoamTitle: "Whole-home starter — 2-Room Era + Roam",
      bundleDefBndEraPairRoamBody: "Stereo or two rooms, plus a travel speaker in one bundle",
      bundleDefBndMoveRoamTitle: "Outdoor duo — Move 2 + Roam 2",
      bundleDefBndMoveRoamBody: "Patio power and pocketable backup for trips",
      bundleDefBndEraMoveTitle: "Indoor / outdoor — Era 100 + Move 2",
      bundleDefBndEraMoveBody: "Room speaker at home plus weather-ready sound for patio and travel",
      bundleDefBndArcSubTitle: "Premium entertainment — Arc Ultra + Sub 4",
      bundleDefBndArcSubBody: "Flagship Atmos bar with deep low-end in one stack",
      bundleDefBndBeamRoamTitle: "TV + pocket — Beam (Gen 2) + Roam 2",
      bundleDefBndBeamRoamBody: "Living room clarity plus an ultra-portable for everywhere else",
      bundleDefBndFiveEra300Title: "Hi-fi + spatial — Five + Era 300",
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
      joana: {
        tag1: "Returning shopper",
        tag2: "Mobile",
        tag3: "Balanced",
        bio: "Looks for room-filling sound with good judgment: clear curation, useful comparisons, and calm decisions — value and experience in balance.",
        bio2: "",
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
      quickSearches: "Quick searches",
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
      tvHint: "OLED, QLED, room size",
      speaker: "Wireless speakers",
      speakerHint: "WiFi, Bluetooth, room or portable",
      soundbar: "Soundbars",
      soundbarHint: "Atmos, living room",
      accessory: "Accessories",
      accessoryHint: "Mounts, HDMI",
    },
    searchSerp: {
      modeRegular: "Results",
      modeAi: "Chat",
      modeAria: "Results and chat",
      intentSummaryTitle: "Intent summary",
      resultsFor: "Results for:",
      browseFallback: "Browse catalog",
      filterIntentAria: "Open filters",
      filterIntentLabel: "Filter",
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
      compareTitleJoana: "Three paths — clear sound, your pace",
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
      compareFitJoanaBalanced: "Balanced room & value",
      learningSurroundTitle: "Surround vs stereo",
      learningSurroundBody:
        "A home theater set adds rear channels; stereo pairs shine for music in one room.",
      learningSurroundTag: "2 min read",
      learningPortableTitle: "Portable vs room",
      learningPortableBody:
        "Roam and Move are built to move; Era models anchor a room with fuller output.",
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
    },
    searchAiPanel: {
      emptyState:
        "Type a question in the composer below, or run a search from the top bar. We ground picks in trusted reviews and surface matching products.",
      reasoning: "Reasoning",
      matchingLine: "Matching intent to products and editorial sources",
      placeholderReasoning: "Reasoning…",
      placeholderAsk: "Ask a follow-up…",
      ariaMessage: "AI mode message",
      sendAria: "Send message",
      topMatches: "Top matches",
      sourcesLabel: "Sources",
    },
    pdp: {
      addToCart: "Add to cart",
      back: "Back",
      openSearch: "Open search",
      ask: "Ask",
      notFound: "Product not found.",
      pairTvs: "Pair with soundbars",
      pairSpeakers: "Pair with speakers",
      recommendedFor: "Recommended for:",
      compatibilityEyebrow: "Connectivity",
      compatibilityTitle: "Integration & playback",
      compatibilityBody:
        "Network, Bluetooth, and formats this unit supports — what you use day to day to play audio and fit it into your home.",
    },
    socialProof: {
      club: "Future Store Club",
      marinaHeadline: "Club For Home\nCinema Enthusiasts",
      ricardoHeadline: "Club For Smart\nShoppers",
      joanaHeadline: "Club For\nThoughtful\nListeners",
      marinaBody:
        "Get early access to new releases, exclusive calibration guides, and member-only pricing on premium panels and sound systems.",
      ricardoBody:
        "Get notified about flash deals, exclusive bundles, and member-only coupons. No spam, just savings delivered to your inbox.",
      joanaBody:
        "Content that connects specs with real use, curated offers, and helpful nudges — less noise, more clarity in every choice.",
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
        continueHeadline: "Standout value\non display",
        continueBody:
          "Popular picks with transparent pricing and straightforward delivery — decide quickly with no fuss.",
        continueCta: "View product",
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

/** Dot-path lookup, e.g. `hero.marina.kicker` or `common.cart`. */
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
