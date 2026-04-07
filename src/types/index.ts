export type ShopperProfileId = "marina" | "ricardo" | "joana";

export type ShopperProfile = {
  id: ShopperProfileId;
  name: string;
  device: "desktop" | "mobile";
  segment: "premium-researcher" | "price-first";
  returning: boolean;
  source: string;
  tone: "editorial" | "direct";
  proofPreference: "technical" | "volume";
  merchandisingBias: "premium" | "cost-benefit";
  interests: string[];
};

export type ProductCategory = "tv" | "soundbar" | "speaker" | "accessory";

export type DisplayTechnology = "OLED" | "QLED" | "LED";

export type Product = {
  id: string;
  sku: string;
  category: ProductCategory;
  title: string;
  brand: string;
  price: number;
  oldPrice?: number;
  installmentText: string;
  inches?: number;
  technology?: DisplayTechnology;
  deliveryETA: string;
  stock: number;
  reviewStrengths: string[];
  reviewWeaknesses: string[];
  returnPolicyShort: string;
  warrantyShort: string;
  compatibilityTags: string[];
  bestFor: string[];
  marginTier: "low" | "mid" | "high";
  sponsored?: boolean;
  heroImage: string;
  gallery: string[];
};

/** Semantic keys for SERP / assistant — labels come from `messages` by locale. */
export type SearchIntentRoomDistanceKey = "3m_listening";
export type SearchIntentRoomTypeKey = "living_room";
export type SearchIntentSizePreferenceKey =
  | "flexible"
  | "compact_under_budget"
  | "room_3m_speakers";
export type SearchIntentDeliveryKey = "sooner";

export type SearchIntent = {
  rawQuery: string;
  budget?: number;
  /** Listening context (~3 m from seating) */
  roomDistanceKey?: SearchIntentRoomDistanceKey;
  roomTypeKey?: SearchIntentRoomTypeKey;
  sizePreferenceKey?: SearchIntentSizePreferenceKey;
  priority?: "best-value" | "premium" | "cinema" | "sports";
  deliveryNeedKey?: SearchIntentDeliveryKey;
  /** e.g. spatial / Atmos interest */
  useCase?: string[];
};

export type AgentSurface = {
  sku: string;
  title: string;
  price: number;
  availability: number;
  deliveryPromise: string;
  returns: string;
  compatibility: string[];
  bundleEligible: boolean;
  confidenceScore: number;
};

export type HomeModuleKey =
  | "hero"
  | "continue"
  | "curated"
  | "compare"
  | "spotlight"
  | "strip"
  | "tiktok";

export type ScreenId = "home" | "search" | "pdp";
