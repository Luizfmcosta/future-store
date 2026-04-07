import type { Product } from "@/types";

function media(name: string): string {
  return `/media/products/${name}`;
}

/**
 * Wireless speaker catalog inspired by the Sonos lineup (names & positioning reference:
 * https://www.sonos.com/en/shop/wireless-speakers). Demo storefront — not affiliated.
 */
export const products: Product[] = [
  {
    id: "sp-era-100",
    sku: "FS-SP-ERA100-BLK",
    category: "speaker",
    title: "Sonos Era 100 — Smart speaker, room-filling sound",
    brand: "Sonos",
    price: 2299,
    installmentText: "12x R$ 191,58 sem juros",
    deliveryETA: "3–5 business days",
    stock: 42,
    reviewStrengths: [
      "Rich stereo sound from a compact footprint",
      "WiFi + Bluetooth; works with voice and the Sonos app",
      "Trueplay tuning adapts to your room",
    ],
    reviewWeaknesses: [
      "For home theater height channels, consider Era 300 or a soundbar",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["WiFi 6", "Bluetooth 5.0", "AirPlay 2", "Line-in with adapter"],
    bestFor: ["Kitchens", "Desks", "Stereo pairs in small rooms"],
    marginTier: "mid",
    sponsored: true,
    heroImage: media("sonos-era-100-lifestyle.png"),
    gallery: [
      media("ba7417c9ec5d2dcf54f46a4b3481eb1d5d55d1b5-2000x2000.avif"),
      media("0d3373d97722b8b9728b95026895d089f9241ae8-1920x1920.avif"),
      media("82ce8697780924b067d289793981db85c83b2b00-2000x2000.avif"),
    ],
  },
  {
    id: "sp-era-300",
    sku: "FS-SP-ERA300-BLK",
    category: "speaker",
    title: "Sonos Era 300 — Spatial audio smart speaker",
    brand: "Sonos",
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
      "Larger footprint than Era 100",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Spatial audio", "WiFi 6", "Bluetooth 5.0", "AirPlay 2"],
    bestFor: ["Living rooms", "Spatial music", "Standalone flagship"],
    marginTier: "high",
    heroImage: media("1dfecdf1513cd96cd28e789adac4957b97adf50b-1800x1800.avif"),
    gallery: [
      media("82ce8697780924b067d289793981db85c83b2b00-2000x2000.avif"),
      media("1178ce56bf752b5183fed1c6429e3a15b6770216-2480x2480.avif"),
    ],
  },
  {
    id: "sp-move-2",
    sku: "FS-SP-MOVE2-BLK",
    category: "speaker",
    title: "Sonos Move 2 — Powerful portable WiFi speaker",
    brand: "Sonos",
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
      "Heavier than Roam for everyday carry",
    ],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Bluetooth", "WiFi", "Line-in", "USB-C"],
    bestFor: ["Patio", "Portable parties", "Room-to-room listening"],
    marginTier: "high",
    heroImage: media("87e816c0a480d8a27c1d379e02e84d84f6db5041-1280x1280.avif"),
    gallery: [
      media("87e816c0a480d8a27c1d379e02e84d84f6db5041-1280x1280.avif"),
      media("110a711ffb1d9ec82743734ef7477a7d400c8d11-2400x2400.avif"),
      media("a2481284c5700c238a123168458f74c2b19e1bed-2379x2379.avif"),
    ],
  },
  {
    id: "sp-roam-2",
    sku: "FS-SP-ROAM2-BLK",
    category: "speaker",
    title: "Sonos Roam 2 — Ultra-portable smart speaker",
    brand: "Sonos",
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
    bestFor: ["Travel", "Gifts", "First Sonos speaker"],
    marginTier: "mid",
    sponsored: true,
    heroImage: media("110a711ffb1d9ec82743734ef7477a7d400c8d11-2400x2400.avif"),
    gallery: [
      media("a2481284c5700c238a123168458f74c2b19e1bed-2379x2379.avif"),
      media("87e816c0a480d8a27c1d379e02e84d84f6db5041-1280x1280.avif"),
    ],
  },
  {
    id: "sp-home-theater",
    sku: "FS-SET-HT-ARC-ERA",
    category: "speaker",
    title: "Sonos Surround Set — Arc + Era surrounds",
    brand: "Sonos",
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
    heroImage: media("1178ce56bf752b5183fed1c6429e3a15b6770216-2480x2480.avif"),
    gallery: [
      media("3cb78a6f04f3125c38ee0c37dfa78c4591916da1-2480x2480.avif"),
      media("1dfecdf1513cd96cd28e789adac4957b97adf50b-1800x1800.avif"),
    ],
  },
  {
    id: "sp-turntable-set",
    sku: "FS-SET-TT-ERA",
    category: "speaker",
    title: "Sonos Listening Set — Turntable + Era 100",
    brand: "Sonos",
    price: 6699,
    installmentText: "12x R$ 558,25 sem juros",
    deliveryETA: "5–7 business days",
    stock: 11,
    reviewStrengths: [
      "Vinyl playback streamed to any Sonos room",
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
    heroImage: media("aa63e8b53815c94ecb60fdde9baeffcbf3fcd8aa-2000x2000.avif"),
    gallery: [
      media("ba7417c9ec5d2dcf54f46a4b3481eb1d5d55d1b5-2000x2000.avif"),
      media("0d3373d97722b8b9728b95026895d089f9241ae8-1920x1920.avif"),
    ],
  },
  {
    id: "sp-era-pair",
    sku: "FS-SET-ERA100X2",
    category: "speaker",
    title: "Sonos 2-Room Set — Era 100 ×2",
    brand: "Sonos",
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
    heroImage: media("77350061ddcfded38dcce31526b3ec45ded63743-1280x1280.avif"),
    gallery: [
      media("82ce8697780924b067d289793981db85c83b2b00-2000x2000.avif"),
      media("ba7417c9ec5d2dcf54f46a4b3481eb1d5d55d1b5-2000x2000.avif"),
    ],
  },
  {
    id: "sp-roam-pair",
    sku: "FS-SET-ROAM2X2",
    category: "speaker",
    title: "Sonos Adventure Set — Roam 2 ×2",
    brand: "Sonos",
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
    heroImage: media("a2481284c5700c238a123168458f74c2b19e1bed-2379x2379.avif"),
    gallery: [
      media("110a711ffb1d9ec82743734ef7477a7d400c8d11-2400x2400.avif"),
      media("87e816c0a480d8a27c1d379e02e84d84f6db5041-1280x1280.avif"),
    ],
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
  },
  {
    id: "sb-arc-ultra",
    sku: "FS-SB-ARCULTRA-BLK",
    category: "soundbar",
    title: "Sonos Arc Ultra — Premium smart soundbar with Sound Motion™",
    brand: "Sonos",
    price: 10999,
    installmentText: "18x R$ 611,06 sem juros",
    deliveryETA: "5–7 business days",
    stock: 14,
    reviewStrengths: [
      "Immersive Dolby Atmos with Sound Motion architecture",
      "eARC and HDMI for modern TVs",
      "Designed to pair with Sub 4 and Era surrounds",
    ],
    reviewWeaknesses: ["Wide footprint — measure your media console first"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Dolby Atmos", "eARC", "HDMI", "WiFi"],
    bestFor: ["Living room TV", "Cinema nights", "Console gaming"],
    marginTier: "high",
    sponsored: true,
    heroImage: media("fe8be07f006292560731a3bfb4481f9758bd44dc-2000x1020.avif"),
    gallery: [
      media("63597b504e8affad7de8e6c7d440011016fe1ff3-2000x1341.avif"),
      media("3cb78a6f04f3125c38ee0c37dfa78c4591916da1-2480x2480.avif"),
    ],
  },
  {
    id: "sb-beam-g2",
    sku: "FS-SB-BEAMG2-BLK",
    category: "soundbar",
    title: "Sonos Beam (Gen 2) — Compact smart soundbar",
    brand: "Sonos",
    price: 4999,
    installmentText: "12x R$ 416,58 sem juros",
    deliveryETA: "3–5 business days",
    stock: 31,
    reviewStrengths: [
      "Atmos height virtualization in a small bar",
      "Great for bedrooms and mid-size TVs",
      "Voice control and Sonos multi-room",
    ],
    reviewWeaknesses: ["For large open plans, consider Arc Ultra"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Dolby Atmos", "eARC", "HDMI", "WiFi"],
    bestFor: ["Bedroom TV", "Apartments", "Everyday streaming"],
    marginTier: "mid",
    heroImage: media("e12ba440b45fc67e970049734783d6fb0b6b20d1-2480x2480.avif"),
    gallery: [
      media("af5c86024d32b2fa5c41cbb81dd909d02878ea12-1510x959.avif"),
      media("b38c2b390ddf8576df36f50a3b9d69774d65a1ef-2000x2000.avif"),
    ],
  },
  {
    id: "sb-ray",
    sku: "FS-SB-RAY-BLK",
    category: "soundbar",
    title: "Sonos Ray — Essential compact soundbar",
    brand: "Sonos",
    price: 2299,
    installmentText: "10x R$ 229,90 sem juros",
    deliveryETA: "3–5 business days",
    stock: 52,
    reviewStrengths: [
      "Clear dialogue boost on a budget",
      "Fits tight consoles and wall mounts easily",
      "Expands into a full Sonos system later",
    ],
    reviewWeaknesses: ["No Atmos — upgrade path is Beam or Arc"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Optical", "HDMI ARC", "WiFi"],
    bestFor: ["Small TVs", "First soundbar", "Offices"],
    marginTier: "mid",
    sponsored: true,
    heroImage: media("b11fda58212ffc54736af5412c8be6e52d976e84-701x509.avif"),
    gallery: [
      media("47a0e60ac5d697e707fcda68c77d9e460c1d5233-732x481.avif"),
      media("ed86978e2f4d10e9a1044cf9d023cd21418f43a7-1920x345.avif"),
    ],
  },
  {
    id: "sp-five",
    sku: "FS-SP-FIVE-WHT",
    category: "speaker",
    title: "Sonos Five — Premium hi-fi wireless speaker",
    brand: "Sonos",
    price: 6499,
    installmentText: "12x R$ 541,58 sem juros",
    deliveryETA: "3–5 business days",
    stock: 22,
    reviewStrengths: [
      "Stereo pair capable for serious listening rooms",
      "Line-in for turntable or DJ gear",
      "Deep, clean output without a separate sub",
    ],
    reviewWeaknesses: ["Larger than Era — plan shelf depth"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["Line-in", "WiFi", "AirPlay 2", "Trueplay"],
    bestFor: ["Hi-fi stacks", "Turntable rigs", "Large kitchens"],
    marginTier: "high",
    heroImage: media("66e3cfe30d0b259876278d17a526295d43f044e5-2480x2480.avif"),
    gallery: [
      media("72e9843281b069391d73240660b11acb66ccdac3-2000x2000.avif"),
      media("a57b2c8d90c191d435490e8bc636b5a582adac03-2000x2000.avif"),
    ],
  },
  {
    id: "sp-sub-4",
    sku: "FS-SP-SUB4-BLK",
    category: "speaker",
    title: "Sonos Sub 4 — Premium wireless subwoofer",
    brand: "Sonos",
    price: 9999,
    installmentText: "18x R$ 555,50 sem juros",
    deliveryETA: "5–7 business days",
    stock: 16,
    reviewStrengths: [
      "Transforms Arc Ultra and Beam with real sub-bass",
      "Dual force-canceling drivers, minimal vibration",
      "Wireless pairing — hide it beside the sofa",
    ],
    reviewWeaknesses: ["Premium investment — Sub Mini covers smaller rooms"],
    returnPolicyShort: "30 days",
    warrantyShort: "24 months manufacturer",
    compatibilityTags: ["WiFi", "Trueplay", "Pairs with Arc", "Pairs with Beam"],
    bestFor: ["Arc Ultra sets", "Action movies", "Electronic music"],
    marginTier: "high",
    heroImage: media("64e817c257b5ed55e7809343c628082a64ea1a7e-2000x2000.avif"),
    gallery: [
      media("15eb79929a07495b06be5ed9c60c2293bc4df9d9-568x1087.avif"),
      media("3a521e77055da0268f5a2ae72a52bab268d40e5a-2480x2480.avif"),
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Primary catalog: wireless speakers (replaces former TV grid). */
export function getSpeakers(): Product[] {
  return products.filter((p) => p.category === "speaker");
}

/** Speakers + soundbars for grids that should mirror the full Sonos-style lineup. */
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
