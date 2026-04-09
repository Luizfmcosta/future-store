import type { Product, ProductColorOption } from "@/types";

/** Local asset under `public/media/products/`. Encodes spaces and special chars. */
function media(name: string): string {
  return `/media/products/${encodeURIComponent(name)}`;
}

const RR = (average: number, count: number) => ({ average, count });

const COLORS_SPEAKER_BW: ProductColorOption[] = [
  { labelKey: "matteBlack", swatchHex: "#1c1c1c" },
  { labelKey: "lunarWhite", swatchHex: "#e8e6e1" },
];
const COLORS_SPEAKER_BW_OLIVE: ProductColorOption[] = [
  ...COLORS_SPEAKER_BW,
  { labelKey: "olive", swatchHex: "#3a4038" },
];
const COLORS_SB: ProductColorOption[] = COLORS_SPEAKER_BW;
const COLORS_TV: ProductColorOption[] = [
  { labelKey: "titanGray", swatchHex: "#4a4f56" },
  { labelKey: "matteBlack", swatchHex: "#1a1d21" },
];

/** Wireless speaker and soundbar catalog — demo storefront. */
export const products: Product[] = [
  {
    id: "sp-era-100",
    sku: "FS-SP-ERA100-BLK",
    category: "speaker",
    title: "Horizon One — Smart speaker, room-filling sound",
    brand: "Future Sound",
    price: 2299,
    installmentText: "12x R$ 191,58 sem juros",
    deliveryETA: "3–5 business days",
    stock: 42,
    reviewStrengths: [
      "Rich stereo sound from a compact footprint",
      "WiFi + Bluetooth; works with voice and the companion app",
      "Trueplay tuning adapts to your room",
    ],
    reviewWeaknesses: [
      "For home theater height channels, consider Horizon Three or a soundbar",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["WiFi 6", "Bluetooth 5.0", "AirPlay 2", "Line-in with adapter"],
    bestFor: ["Kitchens", "Desks", "Stereo pairs in small rooms"],
    marginTier: "mid",
    sponsored: true,
    heroImage: media("Era 100 Wireless Speaker.png"),
    gallery: [
      media("Era 100 Speaker.png"),
      media("Core 100 Speaker.png"),
      media("sonos-era-100-lifestyle.png"),
    ],
    description:
      "Horizon One brings full, balanced stereo sound from a compact cylinder that fits kitchens, desks, and nightstands. Stream over WiFi or Bluetooth, tune the output to your room with Trueplay, and expand later into a stereo pair or multi-room setup.",
    colorOptions: COLORS_SPEAKER_BW_OLIVE,
    reviewRating: RR(4.7, 2140),
  },
  {
    id: "sp-era-300",
    sku: "FS-SP-ERA300-BLK",
    category: "speaker",
    title: "Horizon Three — Spatial audio smart speaker",
    brand: "Future Sound",
    price: 4999,
    installmentText: "12x R$ 416,58 sem juros",
    deliveryETA: "3–5 business days",
    stock: 18,
    reviewStrengths: [
      "Dolby Atmos music and spatial playback",
      "Bold output for open living spaces",
      "Premium acoustic architecture with multiple drivers",
    ],
    reviewWeaknesses: [
      "Larger footprint than Horizon One",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Spatial audio", "WiFi 6", "Bluetooth 5.0", "AirPlay 2"],
    bestFor: ["Living rooms", "Spatial music", "Standalone flagship"],
    marginTier: "high",
    heroImage: media("Era 300 Speaker.png"),
    gallery: [
      media("Stronger sound with more presence in the room.png"),
      media("82ce8697780924b067d289793981db85c83b2b00-2000x2000.avif"),
      media("1178ce56bf752b5183fed1c6429e3a15b6770216-2480x2480.avif"),
    ],
    description:
      "Horizon Three is the flagship room speaker for open living spaces: spatial and Dolby Atmos music, bold output, and a premium driver layout. It is the natural step up when Horizon One is not enough for your room size or listening level.",
    colorOptions: COLORS_SPEAKER_BW_OLIVE,
    reviewRating: RR(4.8, 1622),
  },
  {
    id: "sp-move-2",
    sku: "FS-SP-MOVE2-BLK",
    category: "speaker",
    title: "Trail Max — Powerful portable WiFi speaker",
    brand: "Future Sound",
    price: 4999,
    oldPrice: 5299,
    installmentText: "12x R$ 416,58 sem juros",
    deliveryETA: "3–5 business days",
    stock: 24,
    reviewStrengths: [
      "Up to 24h battery for indoor/outdoor sessions",
      "Stereo playback in a single unit",
      "Weather-resistant for patios and trips",
    ],
    reviewWeaknesses: [
      "Heavier than Trail Mini for everyday carry",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Bluetooth", "WiFi", "Line-in", "USB-C"],
    bestFor: ["Patio", "Portable parties", "Room-to-room listening"],
    marginTier: "high",
    heroImage: media("Move Portable Speaker.png"),
    gallery: [
      media("Move Outdoor Speaker.png"),
      media("sonos-move-2-lifestyle.png"),
      media("87e816c0a480d8a27c1d379e02e84d84f6db5041-1280x1280.avif"),
    ],
    description:
      "Trail Max is the large portable for patios, parties, and room-to-room listening: long battery life, stereo imaging from a single enclosure, and weather resistance for outdoor use. Use it on WiFi at home and Bluetooth on the go.",
    colorOptions: COLORS_SPEAKER_BW,
    reviewRating: RR(4.6, 980),
  },
  {
    id: "sp-roam-2",
    sku: "FS-SP-ROAM2-BLK",
    category: "speaker",
    title: "Trail Mini — Ultra-portable smart speaker",
    brand: "Future Sound",
    price: 1999,
    installmentText: "10x R$ 199,90 sem juros",
    deliveryETA: "3–5 business days",
    stock: 96,
    reviewStrengths: [
      "Pocketable design with clear, punchy sound",
      "Waterproof for pools and showers",
      "Auto Trueplay when paired with the app",
    ],
    reviewWeaknesses: [
      "Not a substitute for full-room speakers",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Bluetooth", "WiFi", "AirPlay 2", "Qi charging compatible"],
    bestFor: ["Travel", "Gifts", "First wireless speaker"],
    marginTier: "mid",
    sponsored: true,
    heroImage: media("Roam 2 Portable Speaker.png"),
    gallery: [
      media("Go Compact Speaker.png"),
      media("Roam Lite Speaker.png"),
      media("Mini One Speaker.png"),
    ],
    description:
      "Trail Mini is pocketable and waterproof—made for travel, gifts, and first-time wireless listening. It punches above its size for casual sessions and pairs with the app for quick Trueplay tuning when you settle it in a new spot.",
    colorOptions: COLORS_SPEAKER_BW_OLIVE,
    reviewRating: RR(4.5, 3420),
  },
  {
    id: "sp-home-theater",
    sku: "FS-SET-HT-ARC-ERA",
    category: "speaker",
    title: "Cinema Surround System — Stage Ultra + rear satellites",
    brand: "Future Sound",
    price: 11499,
    oldPrice: 12199,
    installmentText: "18x R$ 638,83 sem juros",
    deliveryETA: "Scheduled delivery",
    stock: 8,
    reviewStrengths: [
      "Immersive Atmos bar with matched rear speakers",
      "Single-app control for the whole room",
      "Cohesive timbre across front and surround",
    ],
    reviewWeaknesses: [
      "Plan for power and placement for rear speakers",
    ],
    returnPolicyShort: "30 days, white-glove available",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Dolby Atmos", "eARC", "HDMI", "WiFi"],
    bestFor: ["Home theater", "Movie nights", "Console gaming"],
    marginTier: "high",
    heroImage: media("Arc + Sub + Rear Speakers.png"),
    gallery: [
      media("3cb78a6f04f3125c38ee0c37dfa78c4591916da1-2480x2480.avif"),
      media("1dfecdf1513cd96cd28e789adac4957b97adf50b-1800x1800.avif"),
    ],
    description:
      "Cinema Surround System bundles Stage Ultra with matched rear satellites for true surround and Dolby Atmos in one purchase. Control everything from a single app and enjoy cohesive timbre from front to back.",
    colorOptions: COLORS_SB,
    reviewRating: RR(4.7, 412),
  },
  {
    id: "sp-turntable-set",
    sku: "FS-SET-TT-ERA",
    category: "speaker",
    title: "Listening Set — Turntable + Horizon One",
    brand: "Future Sound",
    price: 6699,
    installmentText: "12x R$ 558,25 sem juros",
    deliveryETA: "5–7 business days",
    stock: 11,
    reviewStrengths: [
      "Vinyl playback streamed to any room on your system",
      "Clean, minimal stack with line-in path",
      "Great entry to hi-fi listening",
    ],
    reviewWeaknesses: [
      "Turntable requires level surface and setup",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months on electronics",
    compatibilityTags: ["Line-in", "WiFi", "Bluetooth", "AirPlay 2"],
    bestFor: ["Vinyl lovers", "Living rooms", "Design-led setups"],
    marginTier: "high",
    heroImage: media("Era 100 Speaker.png"),
    gallery: [
      media("A great place to start.png"),
      media("ba7417c9ec5d2dcf54f46a4b3481eb1d5d55d1b5-2000x2000.avif"),
      media("0d3373d97722b8b9728b95026895d089f9241ae8-1920x1920.avif"),
    ],
    description:
      "Listening Set pairs a quality turntable with Horizon One so vinyl reaches every room on your wireless system. The stack stays minimal while giving you a credible hi-fi entry point and a path to expand with more speakers later.",
    colorOptions: COLORS_SPEAKER_BW,
    reviewRating: RR(4.6, 228),
  },
  {
    id: "sp-era-pair",
    sku: "FS-SET-ERA100X2",
    category: "speaker",
    title: "2-Room Set — Horizon One ×2",
    brand: "Future Sound",
    price: 4398,
    oldPrice: 4598,
    installmentText: "12x R$ 366,50 sem juros",
    deliveryETA: "3–5 business days",
    stock: 27,
    reviewStrengths: [
      "Stereo imaging when paired in one room",
      "Or place each in different rooms under one account",
      "Bundle savings vs buying separately",
    ],
    reviewWeaknesses: [
      "Pairing setup takes a few minutes in the app",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Stereo pair", "WiFi", "AirPlay 2"],
    bestFor: ["Stereo listening", "Two-room starter", "Office + bedroom"],
    marginTier: "mid",
    heroImage: media("Era 100 Speaker.png"),
    gallery: [
      media("Stronger sound with more presence in the room.png"),
      media("77350061ddcfded38dcce31526b3ec45ded63743-1280x1280.avif"),
    ],
    description:
      "Two Horizon One units for stereo imaging in one room or one speaker per room under the same account. The bundle saves versus buying separately and is ideal for office plus bedroom or small living stereo setups.",
    colorOptions: COLORS_SPEAKER_BW_OLIVE,
    reviewRating: RR(4.7, 891),
  },
  {
    id: "sp-roam-pair",
    sku: "FS-SET-ROAM2X2",
    category: "speaker",
    title: "Adventure Set — Trail Mini ×2",
    brand: "Future Sound",
    price: 3798,
    oldPrice: 3998,
    installmentText: "12x R$ 316,50 sem juros",
    deliveryETA: "3–5 business days",
    stock: 33,
    reviewStrengths: [
      "Stereo pair for outdoor tables and small rooms",
      "Grab-and-go size for trips",
      "Bundle savings vs two single units",
    ],
    reviewWeaknesses: [
      "Stereo mode needs placement within a few meters",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Stereo pair", "Bluetooth", "Waterproof"],
    bestFor: ["Outdoors", "Travel duo", "Student apartments"],
    marginTier: "mid",
    sponsored: true,
    heroImage: media("Roam 2 Portable Speaker.png"),
    gallery: [
      media("Music that goes with you, wherever you are.png"),
      media("a2481284c5700c238a123168458f74c2b19e1bed-2379x2379.avif"),
    ],
    description:
      "Two Trail Mini speakers for stereo on a table outdoors or flexible placement indoors. Compact travel size makes this bundle popular for students and hosts who want a quick stereo pair without full-size gear.",
    colorOptions: COLORS_SPEAKER_BW_OLIVE,
    reviewRating: RR(4.4, 156),
  },
  /** TVs — entry / mid tier for promo funnels (Ricardo). */
  {
    id: "tv-samsung-crystal-50",
    sku: "FS-TV-SAM-C50",
    category: "tv",
    title: "Samsung Crystal UHD 50\" — Smart TV LED 4K",
    brand: "Samsung",
    price: 2799,
    oldPrice: 3999,
    installmentText: "12x R$ 233,25 sem juros",
    deliveryETA: "5–10 dias úteis",
    stock: 128,
    inches: 50,
    technology: "LED",
    reviewStrengths: [
      "Painel 4K com bom contraste em salas iluminadas",
      "Tizen com apps de streaming e espelhamento",
      "3 HDMI — ideal para console e soundbar",
    ],
    reviewWeaknesses: ["Sem zona local dimming avançada dos modelos QLED superiores"],
    returnPolicyShort: "7 dias (lacrado)",
    warrantyShort: "12 meses fabricante",
    compatibilityTags: ["4K", "HDR10+", "WiFi", "Bluetooth"],
    bestFor: ["Salas compactas", "Séries e filmes", "Primeiro 4K"],
    marginTier: "mid",
    sponsored: true,
    heroImage:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=600&fit=crop&q=80",
    ],
    description:
      "Crystal UHD 50\" balances 4K clarity and smart streaming in a footprint suited to compact living rooms and bedrooms. Multiple HDMI inputs make it easy to add a console and a soundbar without a hub.",
    colorOptions: COLORS_TV,
    reviewRating: RR(4.3, 5620),
  },
  {
    id: "tv-tcl-led-50",
    sku: "FS-TV-TCL-50",
    category: "tv",
    title: "TCL P755 50\" — Google TV LED 4K",
    brand: "TCL",
    price: 3199,
    installmentText: "12x R$ 266,58 sem juros",
    deliveryETA: "4–8 dias úteis",
    stock: 94,
    inches: 50,
    technology: "LED",
    reviewStrengths: [
      "Google TV com busca por voz em português",
      "Boa relação polegada/preço para salas médias",
      "Modo jogo com baixa latência",
    ],
    reviewWeaknesses: ["Alto-falantes básicos — combine com soundbar para filmes"],
    returnPolicyShort: "7 dias (lacrado)",
    warrantyShort: "12 meses fabricante",
    compatibilityTags: ["4K", "Dolby Vision", "WiFi", "Bluetooth"],
    bestFor: ["Streaming diário", "Games casuais", "Quarto grande"],
    marginTier: "mid",
    heroImage:
      "https://images.unsplash.com/photo-1461158534919-315852b3bc76?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1461158534919-315852b3bc76?w=800&h=600&fit=crop&q=80",
    ],
    description:
      "Google TV 50\" with voice search and a strong value for streaming and casual gaming. Low-latency game mode helps consoles feel responsive; plan a soundbar if you want cinema-level audio from the sofa.",
    colorOptions: COLORS_TV,
    reviewRating: RR(4.4, 3180),
  },
  {
    id: "tv-lg-uhd-55",
    sku: "FS-TV-LG-55",
    category: "tv",
    title: "LG UHD 55\" — Smart TV LED 4K",
    brand: "LG",
    price: 3649,
    oldPrice: 4599,
    installmentText: "12x R$ 304,08 sem juros",
    deliveryETA: "5–10 dias úteis",
    stock: 76,
    inches: 55,
    technology: "LED",
    reviewStrengths: [
      "WebOS rápido e controle mágico incluso",
      "55\" confortável a ~2,5 m de distância",
      "Filmmaker Mode para séries com cor natural",
    ],
    reviewWeaknesses: ["Painel IPS — contraste menor que OLED em salas escuras"],
    returnPolicyShort: "7 dias (lacrado)",
    warrantyShort: "12 meses fabricante",
    compatibilityTags: ["4K", "HDR10", "WiFi", "Bluetooth"],
    bestFor: ["Sala de estar", "Esportes", "Famílias"],
    marginTier: "mid",
    sponsored: true,
    heroImage:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop&q=80",
    ],
    description:
      "55\" UHD with webOS and the Magic Remote for quick app switching and pointer control. Filmmaker Mode helps movies look natural in the living room; IPS viewing angles suit wide seating.",
    colorOptions: COLORS_TV,
    reviewRating: RR(4.5, 2890),
  },
  {
    id: "sb-arc-ultra",
    sku: "FS-SB-ARCULTRA-BLK",
    category: "soundbar",
    title: "Stage Ultra — Premium smart soundbar with Sound Motion™",
    brand: "Future Sound",
    price: 10999,
    installmentText: "18x R$ 611,06 sem juros",
    deliveryETA: "5–7 business days",
    stock: 14,
    reviewStrengths: [
      "Immersive Dolby Atmos with Sound Motion architecture",
      "eARC and HDMI for modern TVs",
      "Designed to pair with SubStage Pro and Horizon rear satellites",
    ],
    reviewWeaknesses: ["Wide footprint — measure your media console first"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Dolby Atmos", "eARC", "HDMI", "WiFi"],
    bestFor: ["Living room TV", "Cinema nights", "Console gaming"],
    marginTier: "high",
    sponsored: true,
    heroImage: media("Clearer dialogue and more immersive TV sound.png"),
    gallery: [
      media("fe8be07f006292560731a3bfb4481f9758bd44dc-2000x1020.avif"),
      media("63597b504e8affad7de8e6c7d440011016fe1ff3-2000x1341.avif"),
    ],
    description:
      "Stage Ultra is the premium smart soundbar for large TVs and serious movie nights: Dolby Atmos, Sound Motion architecture, and eARC for full-quality audio from modern sets. Expand with SubStage Pro and wireless surrounds when you are ready.",
    colorOptions: COLORS_SB,
    reviewRating: RR(4.7, 723),
  },
  {
    id: "sb-beam-g2",
    sku: "FS-SB-BEAMG2-BLK",
    category: "soundbar",
    title: "Stage Compact (Gen 2) — Compact smart soundbar",
    brand: "Future Sound",
    price: 4999,
    installmentText: "12x R$ 416,58 sem juros",
    deliveryETA: "3–5 business days",
    stock: 31,
    reviewStrengths: [
      "Atmos height virtualization in a small bar",
      "Great for bedrooms and mid-size TVs",
      "Voice control and whole-home multi-room audio",
    ],
    reviewWeaknesses: ["For large open plans, consider Stage Ultra"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Dolby Atmos", "eARC", "HDMI", "WiFi"],
    bestFor: ["Bedroom TV", "Apartments", "Everyday streaming"],
    marginTier: "mid",
    heroImage: media("Beam Soundbar.png"),
    gallery: [
      media("Beam + Sub Mini.png"),
      media("Beam Compact Soundbar.png"),
      media("Start with a soundbar that defines your system.png"),
    ],
    description:
      "Stage Compact (Gen 2) delivers height virtualization and clearer dialogue in a bar that fits mid-size TVs and bedrooms. It is the sweet spot when Stage Essential is too small and Stage Ultra is too wide for your console.",
    colorOptions: COLORS_SB,
    reviewRating: RR(4.6, 1540),
  },
  {
    id: "sb-ray",
    sku: "FS-SB-RAY-BLK",
    category: "soundbar",
    title: "Stage Essential — Essential compact soundbar",
    brand: "Future Sound",
    price: 2299,
    installmentText: "10x R$ 229,90 sem juros",
    deliveryETA: "3–5 business days",
    stock: 52,
    reviewStrengths: [
      "Clear dialogue boost on a budget",
      "Fits tight consoles and wall mounts easily",
      "Expands into a full multi-room setup later",
    ],
    reviewWeaknesses: ["No Atmos — upgrade path is Stage Compact or Stage Ultra"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Optical", "HDMI ARC", "WiFi"],
    bestFor: ["Small TVs", "First soundbar", "Offices"],
    marginTier: "mid",
    sponsored: true,
    heroImage: media("Ray Compact Soundbar.png"),
    gallery: [
      media("b11fda58212ffc54736af5412c8be6e52d976e84-701x509.avif"),
      media("47a0e60ac5d697e707fcda68c77d9e460c1d5233-732x481.avif"),
    ],
    description:
      "Stage Essential is the affordable dialogue upgrade for smaller TVs and tight furniture. It keeps setup simple with optical or HDMI ARC and leaves a clear upgrade path to Stage Compact or Stage Ultra later.",
    colorOptions: COLORS_SB,
    reviewRating: RR(4.4, 2105),
  },
  {
    id: "sp-five",
    sku: "FS-SP-FIVE-WHT",
    category: "speaker",
    title: "Studio Reference — Premium hi-fi wireless speaker",
    brand: "Future Sound",
    price: 6499,
    installmentText: "12x R$ 541,58 sem juros",
    deliveryETA: "3–5 business days",
    stock: 22,
    reviewStrengths: [
      "Stereo pair capable for serious listening rooms",
      "Line-in for turntable or DJ gear",
      "Deep, clean output without a separate sub",
    ],
    reviewWeaknesses: ["Larger than Horizon line — plan shelf depth"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Line-in", "WiFi", "AirPlay 2", "Trueplay"],
    bestFor: ["Hi-fi stacks", "Turntable rigs", "Large kitchens"],
    marginTier: "high",
    heroImage: media("66e3cfe30d0b259876278d17a526295d43f044e5-2480x2480.avif"),
    gallery: [
      media("Explore the full range of speakers.png"),
      media("72e9843281b069391d73240660b11acb66ccdac3-2000x2000.avif"),
    ],
    description:
      "Studio Reference is the hi-fi wireless speaker for serious listening: stereo pair capable, line-in for turntables or DJ decks, and deep bass without a sub in most rooms. Plan shelf depth—it is larger than Horizon models.",
    colorOptions: COLORS_SPEAKER_BW,
    reviewRating: RR(4.8, 634),
  },
  {
    id: "sp-sub-4",
    sku: "FS-SP-SUB4-BLK",
    category: "speaker",
    title: "SubStage Pro — Premium wireless subwoofer",
    brand: "Future Sound",
    price: 9999,
    installmentText: "18x R$ 555,50 sem juros",
    deliveryETA: "5–7 business days",
    stock: 16,
    reviewStrengths: [
      "Transforms Stage Ultra and Stage Compact with real sub-bass",
      "Dual force-canceling drivers, minimal vibration",
      "Wireless pairing — hide it beside the sofa",
    ],
    reviewWeaknesses: ["Premium investment — SubStage Mini covers smaller rooms"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["WiFi", "Trueplay", "Pairs with Stage Ultra", "Pairs with Stage Compact"],
    bestFor: ["Stage Ultra sets", "Action movies", "Electronic music"],
    marginTier: "high",
    heroImage: media("64e817c257b5ed55e7809343c628082a64ea1a7e-2000x2000.avif"),
    gallery: [
      media("15eb79929a07495b06be5ed9c60c2293bc4df9d9-568x1087.avif"),
      media("3a521e77055da0268f5a2ae72a52bab268d40e5a-2480x2480.avif"),
    ],
    description:
      "SubStage Pro adds authoritative sub-bass to Stage Ultra and Stage Compact systems with force-canceling drivers and wireless pairing. Hide it beside the sofa and enjoy movies and music with real low-end impact.",
    colorOptions: [{ labelKey: "matteBlack", swatchHex: "#1a1a1a" }],
    reviewRating: RR(4.7, 892),
  },
];

/** Curated home cards: UI titles describe a bundle; hero can show bundle art while PDP stays one SKU. */
export function getCuratedMarinaCardHeroOverride(productId: string): string | undefined {
  if (productId === "sb-beam-g2") return media("Beam + Sub Mini.png");
  return undefined;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Primary catalog: wireless speakers (replaces former TV grid). */
export function getSpeakers(): Product[] {
  return products.filter((p) => p.category === "speaker");
}

/** Speakers + soundbars for grids that show the full wireless lineup. */
export function getSpeakersAndSoundbars(): Product[] {
  return products.filter((p) => p.category === "speaker" || p.category === "soundbar");
}

export function getTvs(): Product[] {
  return products.filter((p) => p.category === "tv");
}

/** TVs destacados em oferta (até R$ 5.000) — vitrine Ricardo / campanhas. */
export function getPromoTvsUnder(maxPrice = 5000): Product[] {
  return products
    .filter((p) => p.category === "tv" && p.price <= maxPrice)
    .sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));
}

export function getCheapestPromoTv(): Product | undefined {
  return getPromoTvsUnder()[0];
}

/** Menor preço entre caixas (vitrine / heróis promocionais). */
export function getCheapestPromoSpeaker(): Product | undefined {
  const speakers = getSpeakers();
  if (speakers.length === 0) return undefined;
  return [...speakers].sort((a, b) => a.price - b.price || a.id.localeCompare(b.id))[0];
}

export function getSoundbars(): Product[] {
  return products.filter((p) => p.category === "soundbar");
}
