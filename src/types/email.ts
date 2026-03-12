import type { Vertical, ImageSlot, HeadlineSegment, ThemeAlignH, ThemeAlignV } from './asset';

export interface TileAlignment {
  h: ThemeAlignH;
  v: ThemeAlignV;
}

export type HeaderColorScheme = 'light' | 'dark';
export type HeroAlignment    = 'left' | 'center';
export type HeroTileCount    = 2 | 3 | 4;

export interface TileTag {
  show: boolean;
  text: string;
}

export interface EmailConfig {
  vertical: Vertical;
  headerColorScheme: HeaderColorScheme;

  // Banner strip
  bannerColor: string;
  bannerSaleName: string;
  bannerDiscount: string;
  bannerEmoji: string;

  // Hero copy
  heroAlignment: HeroAlignment;
  showEyebrow: boolean;
  eyebrowText: string;
  headline: HeadlineSegment[];
  showBody: boolean;
  bodyText: string;
  showHighlight: boolean;
  highlightText: string;
  showReviews: boolean;
  showCta: boolean;
  ctaText: string;

  // Body section
  showSecondaryHeadline: boolean;
  secondaryHeadlineText: string;
  bodySectionText: string;
  showBodyCta: boolean;
  bodyCtaStyle: 'primary' | 'secondary';
  bodyCtaText: string;

  // Hero image tiles
  heroTileCount: HeroTileCount;
  tileColors: { t1: string; t2: string; t3: string; t4: string };
  tileImages: { t1: ImageSlot; t2: ImageSlot; t3: ImageSlot; t4: ImageSlot };
  tileTags:   { t1: TileTag;  t2: TileTag;  t3: TileTag;  t4: TileTag  };
  tileAlignments: { t1: TileAlignment; t2: TileAlignment; t3: TileAlignment; t4: TileAlignment };

  // App Download Banner
  showAppBanner: boolean;
  appBannerText: string;

  // Awards Banner
  showAwardsBanner: boolean;
  awardsBannerStyle: 'newsweek' | 'all-awards';
}
