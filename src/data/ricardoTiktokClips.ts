/**
 * IDs dos vídeos TikTok (embed v2). Fontes: @techradar, @smarthomesounds, @ochre.g.
 */
export type RicardoTikTokClip = {
  videoId: string;
  /** Display name under the creator avatar on the click-to-load facade. */
  creatorName: string;
  /** Avatar / logo path under `public/`. */
  creatorLogoSrc: string;
};

export const RICARDO_TIKTOK_CLIPS: RicardoTikTokClip[] = [
  {
    videoId: "7615622351094320406",
    creatorName: "TechRadar",
    creatorLogoSrc: "/media/home/tiktok-creators/techradar.png",
  },
  {
    videoId: "7372605162319269153",
    creatorName: "smarthomesounds",
    creatorLogoSrc: "/media/home/tiktok-creators/smarthomesounds.png",
  },
  {
    videoId: "7563160958873488660",
    creatorName: "ochre.g",
    creatorLogoSrc: "/media/home/tiktok-creators/ochre-g.png",
  },
];
