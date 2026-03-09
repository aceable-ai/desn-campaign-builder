import type { Vertical, ImageSlot } from './asset';

export interface EmailConfig {
  vertical: Vertical;
  bannerText: string;        // top blue banner + eyebrow, e.g. "Texas Independence Day: 40% off"
  headline: string;
  bodyText: string;
  highlightText: string;    // bold emphasis line, e.g. "Promo Highlight Goes Here"
  ctaText: string;          // primary CTA button
  bullets: string[];        // content section bullet points
  heroImage: ImageSlot;
}
