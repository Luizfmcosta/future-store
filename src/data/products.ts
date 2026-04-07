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
    heroImage: media("ba7417c9ec5d2dcf54f46a4b3481eb1d5d55d1b5-2000x2000.avif"),
    gallery: [
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
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Primary catalog: wireless speakers (replaces former TV grid). */
export function getSpeakers(): Product[] {
  return products.filter((p) => p.category === "speaker");
}

/** @deprecated Use getSpeakers — kept for legacy imports during refactors */
export function getTvs(): Product[] {
  return getSpeakers();
}

export function getSoundbars(): Product[] {
  return products.filter((p) => p.category === "soundbar");
}
