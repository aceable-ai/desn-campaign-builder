import type { CanvasSize } from '../types/asset';

export interface SizeDimensions {
  width: number;
  height: number;
  label: string;
}

export const CANVAS_SIZES: Record<CanvasSize, SizeDimensions> = {
  square:    { width: 1080, height: 1080, label: 'Square (1080×1080)'    },
  portrait:  { width: 1080, height: 1350, label: 'Portrait (1080×1350)' },
  story:     { width: 1080, height: 1920, label: 'Story (1080×1920)'    },
  landscape: { width: 1200, height: 628,  label: 'Landscape (1200×628)' },
};

// Exact tokens from Figma — Texas Independence Day Sale 2026
export const DESIGN_TOKENS = {
  // Backgrounds
  background:     '#f1f5fb',
  // Text
  text:           '#21333f',
  // CTA / accent (hot pink from Figma promo code)
  highlight:      '#db306a',
  // Image slot backgrounds — per slot, matching Figma square colors
  personSlotBg:   '#ccf3f7',   // cyan  — tall right column
  courseSlotBg:   '#cad9f7',   // blue  — small left
  themeSlotBg:    '#ffe299',   // yellow — small center
  // Image corner radius
  imageRadius:    18,
  // Fonts
  fontPrimary:    "'Nunito Sans', system-ui, sans-serif",
  fontEmail:      "'Lato', system-ui, sans-serif",
} as const;

// Email-specific tokens from Figma
export const EMAIL_TOKENS = {
  containerWidth: 600,
  bodyBg:         '#ccf3f7',
  sectionBg:      '#ffffff',
  footerBg:       '#f1f5f5',
  awardsBg:       '#f4f9fc',
  bannerBg:       '#2689ca',
  textDark:       '#21333f',
  textBody:       '#43646f',
  textLink:       '#197886',
  eyebrowColor:   '#169aa9',
  accentTeal:     '#12bdcd',
  ctaColor:       '#db306a',
  font:           "'Lato', system-ui, sans-serif",
  fontAlt:        "'Nunito Sans', system-ui, sans-serif",
} as const;
