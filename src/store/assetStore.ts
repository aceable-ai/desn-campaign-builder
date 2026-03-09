import { create } from 'zustand';
import type { AssetConfig, HeadlineSegment, ImageSlot, Vertical, CanvasSize } from '../types/asset';
import type { EmailConfig } from '../types/email';

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

export type AppMode = 'paid' | 'email';

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
  setBodyText: (text: string) => void;
  setCtaText: (text: string) => void;
  setPromoCode: (code: string) => void;
  setPersonImage: (slot: ImageSlot) => void;
  setCourseImage: (slot: ImageSlot) => void;
  setThemeImage: (slot: ImageSlot) => void;
  setPersonColor: (color: string) => void;
  setCourseColor: (color: string) => void;
  setThemeColor: (color: string) => void;

  // Email config
  emailConfig: EmailConfig;
  setEmailVertical: (v: Vertical) => void;
  setEmailBannerText: (t: string) => void;
  setEmailHeadline: (t: string) => void;
  setEmailBodyText: (t: string) => void;
  setEmailHighlightText: (t: string) => void;
  setEmailCtaText: (t: string) => void;
  setEmailBullets: (bullets: string[]) => void;
  setEmailHeroImage: (slot: ImageSlot) => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultConfig: AssetConfig = {
  vertical: 'aceable-agent',
  size: 'square',
  showEyebrow: true,
  showBody: true,
  campaignLabel: 'Texas Independence Day Sale',
  headline: [
    { text: 'Your Career', highlighted: false },
    { text: 'Independence', highlighted: true },
    { text: 'Starts Now', highlighted: false },
  ],
  bodyText: 'For 48 hours only, save 40% on your Texas real estate license course.',
  ctaText: 'Get Started Today!',
  promoCode: 'FOURTH40',
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
};

const defaultWords: HeadlineSegment[] = [
  { text: 'Your', highlighted: false },
  { text: 'Career', highlighted: false },
  { text: 'Independence', highlighted: true },
  { text: 'Starts', highlighted: false },
  { text: 'Now', highlighted: false },
];

const defaultEmailConfig: EmailConfig = {
  vertical: 'aceable-agent',
  bannerText: 'Texas Independence Day: 40% off courses',
  headline: 'The Sale Ends Tonight. The Independence Is Forever.',
  bodyText: "For 48 hours only, save 40% on Aceable's Texas real estate license course. Don't miss your chance to start your career.",
  highlightText: 'Sale ends at midnight — use code FOURTH40',
  ctaText: 'Claim 40% Off',
  bullets: [
    '100% online and self-paced',
    'Learn right from your phone',
    'Engaging videos, games, and bite-sized lessons',
    'Study at your own pace, while still having a life',
    'Money-back guarantee after 30 days',
  ],
  heroImage: { objectUrl: null, file: null },
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAssetStore = create<AssetStore>((set) => ({
  mode: 'paid',
  setMode: (mode) => set({ mode }),

  config: defaultConfig,
  headlineWords: defaultWords,
  headlineRaw: 'Your Career Independence Starts Now',

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

  // Email
  emailConfig: defaultEmailConfig,

  setEmailVertical: (vertical) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, vertical } })),

  setEmailBannerText: (bannerText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bannerText } })),

  setEmailHeadline: (headline) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, headline } })),

  setEmailBodyText: (bodyText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bodyText } })),

  setEmailHighlightText: (highlightText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, highlightText } })),

  setEmailCtaText: (ctaText) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, ctaText } })),

  setEmailBullets: (bullets) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, bullets } })),

  setEmailHeroImage: (heroImage) =>
    set((s) => ({ emailConfig: { ...s.emailConfig, heroImage } })),
}));
