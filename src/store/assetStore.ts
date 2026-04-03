import { create } from 'zustand';
import type { AssetConfig, HeadlineSegment, ImageSlot, Vertical, CanvasSize, ThemeAlignH, ThemeAlignV } from '../types/asset';
import type { EmailConfig, HeaderColorScheme, HeroAlignment, HeroTileCount, TileTag, TileAlignment } from '../types/email';
import type { CampaignRecord } from '../services/airtableApi';

// ─── Headline helpers ─────────────────────────────────────────────────────────

function parseHeadline(text: string): HeadlineSegment[] {
  return text.trim().split(/\s+/).filter(Boolean).map((word) => ({ text: word, highlighted: false }));
}

function groupSegments(words: HeadlineSegment[]): HeadlineSegment[] {
  if (words.length === 0) return [];
  const result: HeadlineSegment[] = [];
  let current = { ...words[0] };
  for (let i = 1; i < words.length; i++) {
    if (words[i].highlighted === current.highlighted) {
      current = { ...current, text: current.text + ' ' + words[i].text };
    } else {
      result.push(current);
      current = { ...words[i] };
    }
  }
  result.push(current);
  return result;
}

// ─── Store interface ──────────────────────────────────────────────────────────

export type AppMode = 'paid' | 'email' | 'queue';

interface AssetStore {
  mode: AppMode;
  setMode: (m: AppMode) => void;

  // Paid/organic config
  config: AssetConfig;
  headlineWords: HeadlineSegment[];
  headlineRaw: string;

  setVertical: (v: Vertical) => void;
  setSize: (s: CanvasSize) => void;
  setCampaignLabel: (label: string) => void;
  setHeadlineRaw: (text: string) => void;
  toggleWordHighlight: (index: number) => void;
  setShowEyebrow: (v: boolean) => void;
  setShowBody: (v: boolean) => void;
  setShowCta: (v: boolean) => void;
  setBodyText: (text: string) => void;
  setCtaText: (text: string) => void;
  setPromoCode: (code: string) => void;
  setPersonImage: (slot: ImageSlot) => void;
  setCourseImage: (slot: ImageSlot) => void;
  setThemeImage: (slot: ImageSlot) => void;
  setPersonColor: (color: string) => void;
  setCourseColor: (color: string) => void;
  setThemeColor: (color: string) => void;
  setThemeAlignH: (h: ThemeAlignH) => void;
  setThemeAlignV: (v: ThemeAlignV) => void;

  // Email config
  emailConfig: EmailConfig;
  emailHeadlineWords: HeadlineSegment[];
  emailHeadlineRaw: string;
  setEmailVertical: (v: Vertical) => void;
  setEmailBannerColor: (c: string) => void;
  setEmailBannerSaleName: (t: string) => void;
  setEmailBannerDiscount: (t: string) => void;
  setEmailBannerEmoji: (t: string) => void;
  setEmailHeroAlignment: (a: HeroAlignment) => void;
  setEmailShowEyebrow: (v: boolean) => void;
  setEmailEyebrowText: (t: string) => void;
  setEmailHeadlineRaw: (text: string) => void;
  toggleEmailWordHighlight: (index: number) => void;
  setEmailShowBody: (v: boolean) => void;
  setEmailBodyText: (t: string) => void;
  setEmailShowHighlight: (v: boolean) => void;
  setEmailHighlightText: (t: string) => void;
  setEmailShowReviews: (v: boolean) => void;
  setEmailShowCta: (v: boolean) => void;
  setEmailCtaText: (t: string) => void;
  setEmailShowSecondaryHeadline: (v: boolean) => void;
  setEmailSecondaryHeadlineText: (t: string) => void;
  setEmailBodySectionText: (t: string) => void;
  setEmailShowBodyCta: (v: boolean) => void;
  setEmailBodyCtaStyle: (s: 'primary' | 'secondary') => void;
  setEmailBodyCtaText: (t: string) => void;
  setEmailHeaderColorScheme: (scheme: HeaderColorScheme) => void;
  setEmailHeroTileCount: (count: HeroTileCount) => void;
  setEmailTileColor: (tile: 't1' | 't2' | 't3' | 't4', color: string) => void;
  setEmailTileImage: (tile: 't1' | 't2' | 't3' | 't4', slot: ImageSlot) => void;
  setEmailTileTag:   (tile: 't1' | 't2' | 't3' | 't4', tag: TileTag) => void;
  setEmailTileAlignment: (tile: 't1' | 't2' | 't3' | 't4', alignment: TileAlignment) => void;
  setEmailShowAppBanner: (v: boolean) => void;
  setEmailAppBannerText: (t: string) => void;
  setEmailShowAwardsBanner: (v: boolean) => void;
  setEmailAwardsBannerStyle: (s: 'newsweek' | 'all-awards') => void;
  loadEmailFromAirtable: (record: CampaignRecord) => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultConfig: AssetConfig = {
  vertical: 'aceable',
  size: 'square',
  showEyebrow: false,
  showBody: true,
  showCta: true,
  campaignLabel: 'Highlight Text Goes Here',
  headline: [
    { text: 'Short', highlighted: false },
    { text: 'Punchy Headline', highlighted: true },
    { text: 'Goes Here', highlighted: false },
  ],
  bodyText: 'Add a supporting line here — two lines max.',
  ctaText: 'Call to Action!',
  promoCode: 'PROMO CODE',
  images: {
    person: { objectUrl: null, file: null },
    course: { objectUrl: null, file: null },
    theme:  { objectUrl: null, file: null },
  },
  imageColors: {
    person: '#CCF3F7',
    course: '#CAD9F7',
    theme:  '#FFE299',
  },
  themeAlignH: 'center',
  themeAlignV: 'center',
};

const defaultWords: HeadlineSegment[] = [
  { text: 'Short',    highlighted: false },
  { text: 'Punchy',   highlighted: true  },
  { text: 'Headline', highlighted: true  },
  { text: 'Goes',     highlighted: false },
  { text: 'Here',     highlighted: false },
];

const defaultEmailHeadlineWords: HeadlineSegment[] = [
  { text: 'Short',    highlighted: false },
  { text: 'Punchy',   highlighted: true  },
  { text: 'Headline', highlighted: true  },
  { text: 'Goes',     highlighted: false },
  { text: 'Here',     highlighted: false },
];

const defaultEmailConfig: EmailConfig = {
  vertical: 'aceable',
  headerColorScheme: 'light',
  bannerColor: '#2689CA',
  bannerSaleName: 'Sale Name Goes Here',
  bannerDiscount: 'XX% off courses',
  bannerEmoji: '⭐️',
  heroAlignment: 'center',
  showEyebrow: false,
  eyebrowText: 'Highlight Text Goes Here',
  headline: groupSegments(defaultEmailHeadlineWords),
  showBody: true,
  bodyText: 'Add a supporting line here — three lines max.',
  showHighlight: false,
  highlightText: 'Promo Highlight Goes Here',
  showReviews: true,
  showCta: true,
  ctaText: 'Call to Action',
  showSecondaryHeadline: true,
  secondaryHeadlineText: 'Short Punchy Headline Goes Here',
  bodySectionText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  showBodyCta: true,
  bodyCtaStyle: 'secondary',
  bodyCtaText: 'Call to Action',
  heroTileCount: 4,
  tileColors: { t1: '#b6ead3', t2: '#ffe299', t3: '#dbcbff', t4: '#ccf3f7' },
  tileImages: {
    t1: { objectUrl: null, file: null },
    t2: { objectUrl: null, file: null },
    t3: { objectUrl: null, file: null },
    t4: { objectUrl: null, file: null },
  },
  tileTags: {
    t1: { show: false, text: 'Over 1M Customers Served' },
    t2: { show: false, text: 'Over 1M Customers Served' },
    t3: { show: false, text: 'Over 1M Customers Served' },
    t4: { show: false, text: 'Over 1M Customers Served' },
  },
  tileAlignments: {
    t1: { h: 'center', v: 'center' },
    t2: { h: 'center', v: 'center' },
    t3: { h: 'center', v: 'center' },
    t4: { h: 'center', v: 'center' },
  },
  showAppBanner: false,
  appBannerText: 'Download the Aceable Agent App:',
  showAwardsBanner: true,
  awardsBannerStyle: 'all-awards',
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAssetStore = create<AssetStore>((set) => ({
  mode: 'paid',
  setMode: (mode) => set({ mode }),

  config: defaultConfig,
  headlineWords: defaultWords,
  headlineRaw: 'Short Punchy Headline Goes Here',

  setVertical: (vertical) =>
    set((s) => ({ config: { ...s.config, vertical } })),

  setSize: (size) =>
    set((s) => ({ config: { ...s.config, size } })),

  setCampaignLabel: (campaignLabel) =>
    set((s) => ({ config: { ...s.config, campaignLabel } })),

  setHeadlineRaw: (text) =>
    set((s) => {
      const words = parseHeadline(text);
      const prevMap = new Map(s.headlineWords.map((w) => [w.text, w.highlighted]));
      const newWords = words.map((w) => ({ ...w, highlighted: prevMap.get(w.text) ?? false }));
      return {
        headlineRaw: text,
        headlineWords: newWords,
        config: { ...s.config, headline: groupSegments(newWords) },
      };
    }),

  toggleWordHighlight: (index) =>
    set((s) => {
      const newWords = s.headlineWords.map((w, i) =>
        i === index ? { ...w, highlighted: !w.highlighted } : w
      );
      return { headlineWords: newWords, config: { ...s.config, headline: groupSegments(newWords) } };
    }),

  setShowEyebrow: (showEyebrow) =>
    set((s) => ({ config: { ...s.config, showEyebrow } })),

  setShowBody: (showBody) =>
    set((s) => ({ config: { ...s.config, showBody } })),

  setShowCta: (showCta) =>
    set((s) => ({ config: { ...s.config, showCta } })),

  setBodyText: (bodyText) =>
    set((s) => ({ config: { ...s.config, bodyText } })),

  setCtaText: (ctaText) =>
    set((s) => ({ config: { ...s.config, ctaText } })),

  setPromoCode: (promoCode) =>
    set((s) => ({ config: { ...s.config, promoCode } })),

  setPersonImage: (slot) =>
    set((s) => ({ config: { ...s.config, images: { ...s.config.images, person: slot } } })),

  setCourseImage: (slot) =>
    set((s) => ({ config: { ...s.config, images: { ...s.config.images, course: slot } } })),

  setThemeImage: (slot) =>
    set((s) => ({ config: { ...s.config, images: { ...s.config.images, theme: slot } } })),

  setPersonColor: (color) =>
    set((s) => ({ config: { ...s.config, imageColors: { ...s.config.imageColors, person: color } } })),

  setCourseColor: (color) =>
    set((s) => ({ config: { ...s.config, imageColors: { ...s.config.imageColors, course: color } } })),

  setThemeColor: (color) =>
    set((s) => ({ config: { ...s.config, imageColors: { ...s.config.imageColors, theme: color } } })),

  setThemeAlignH: (themeAlignH) =>
    set((s) => ({ config: { ...s.config, themeAlignH } })),
  setThemeAlignV: (themeAlignV) =>
    set((s) => ({ config: { ...s.config, themeAlignV } })),

  // Email
  emailConfig: defaultEmailConfig,
  emailHeadlineWords: defaultEmailHeadlineWords,
  emailHeadlineRaw: 'Short Punchy Headline Goes Here',

  setEmailVertical: (vertical) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, vertical } })),

  setEmailBannerColor: (bannerColor) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bannerColor } })),
  setEmailBannerSaleName: (bannerSaleName) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bannerSaleName } })),
  setEmailBannerDiscount: (bannerDiscount) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bannerDiscount } })),
  setEmailBannerEmoji: (bannerEmoji) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bannerEmoji } })),

  setEmailHeroAlignment: (heroAlignment) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, heroAlignment } })),

  setEmailShowEyebrow: (showEyebrow) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, showEyebrow } })),
  setEmailEyebrowText: (eyebrowText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, eyebrowText } })),

  setEmailHeadlineRaw: (text) =>
    set((s) => {
      const words = parseHeadline(text);
      const prevMap = new Map(s.emailHeadlineWords.map((w) => [w.text, w.highlighted]));
      const newWords = words.map((w) => ({ ...w, highlighted: prevMap.get(w.text) ?? false }));
      return {
        emailHeadlineRaw: text,
        emailHeadlineWords: newWords,
        emailConfig: { ...s.emailConfig, headline: groupSegments(newWords) },
      };
    }),

  toggleEmailWordHighlight: (index) =>
    set((s) => {
      const newWords = s.emailHeadlineWords.map((w, i) =>
        i === index ? { ...w, highlighted: !w.highlighted } : w
      );
      return {
        emailHeadlineWords: newWords,
        emailConfig: { ...s.emailConfig, headline: groupSegments(newWords) },
      };
    }),

  setEmailShowBody: (showBody) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, showBody } })),
  setEmailBodyText: (bodyText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bodyText } })),

  setEmailShowHighlight: (showHighlight) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, showHighlight } })),
  setEmailHighlightText: (highlightText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, highlightText } })),

  setEmailShowReviews: (showReviews) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, showReviews } })),
  setEmailShowCta: (showCta) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, showCta } })),

  setEmailCtaText: (ctaText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, ctaText } })),

  setEmailShowSecondaryHeadline: (showSecondaryHeadline) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, showSecondaryHeadline } })),
  setEmailSecondaryHeadlineText: (secondaryHeadlineText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, secondaryHeadlineText } })),
  setEmailBodySectionText: (bodySectionText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bodySectionText } })),
  setEmailShowBodyCta: (showBodyCta) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, showBodyCta } })),
  setEmailBodyCtaStyle: (bodyCtaStyle) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bodyCtaStyle } })),
  setEmailBodyCtaText: (bodyCtaText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bodyCtaText } })),

  setEmailHeaderColorScheme: (headerColorScheme) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, headerColorScheme } })),

  setEmailHeroTileCount: (heroTileCount) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, heroTileCount } })),

  setEmailTileColor: (tile, color) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, tileColors: { ...s.emailConfig.tileColors, [tile]: color } } })),

  setEmailTileImage: (tile, slot) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, tileImages: { ...s.emailConfig.tileImages, [tile]: slot } } })),

  setEmailTileTag: (tile, tag) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, tileTags: { ...s.emailConfig.tileTags, [tile]: tag } } })),

  setEmailTileAlignment: (tile, alignment) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, tileAlignments: { ...s.emailConfig.tileAlignments, [tile]: alignment } } })),

  setEmailShowAppBanner: (showAppBanner) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, showAppBanner } })),
  setEmailAppBannerText: (appBannerText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, appBannerText } })),
  setEmailShowAwardsBanner: (showAwardsBanner) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, showAwardsBanner } })),
  setEmailAwardsBannerStyle: (awardsBannerStyle) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, awardsBannerStyle } })),

  loadEmailFromAirtable: (record) =>
    set((s) => {
      const words = parseHeadline(record.headline);
      // Split "Spring Sale: Up to 50% off courses" → saleName + discount
      const bannerParts = record.subjectLine.split(/:\s*/);
      const bannerSaleName = bannerParts[0]?.trim() ?? record.subjectLine;
      const bannerDiscount = bannerParts[1]?.trim() ?? s.emailConfig.bannerDiscount;
      const heroSlot = record.heroImageUrl
        ? { objectUrl: record.heroImageUrl, file: null }
        : s.emailConfig.tileImages.t1;
      return {
        mode: 'email' as AppMode,
        emailHeadlineRaw: record.headline,
        emailHeadlineWords: words,
        emailConfig: {
          ...s.emailConfig,
          vertical: record.vertical as Vertical,
          headline: groupSegments(words),
          showBody: !!record.bodyCopy,
          bodyText: record.bodyCopy,
          showCta: !!record.ctaCopy,
          ctaText: record.ctaCopy,
          showEyebrow: !!record.previewText,
          eyebrowText: record.previewText,
          bannerSaleName,
          bannerDiscount,
          tileImages: { ...s.emailConfig.tileImages, t1: heroSlot },
        },
      };
    }),
}));
