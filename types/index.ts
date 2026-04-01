export type ShopperProfileId = "marina" | "ricardo";

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

export type ProductCategory = "tv" | "soundbar" | "accessory";

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

export type SearchIntent = {
  rawQuery: string;
  budget?: number;
  roomDistance?: string;
  roomType?: string;
  sizePreference?: string;
  priority?: "best-value" | "premium" | "cinema" | "sports";
  deliveryNeed?: string;
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
  | "proof"
  | "strip";

export type ScreenId = "home" | "search" | "pdp";
