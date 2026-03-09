export type Vertical = 'aceable' | 'aceable-agent' | 'aceable-insurance' | 'aceable-mortgage';
export type CanvasSize = 'square' | 'portrait' | 'story' | 'landscape';

export interface HeadlineSegment {
  text: string;
  highlighted: boolean;
}

export interface ImageSlot {
  objectUrl: string | null;
  file: File | null;
}

export interface AssetConfig {
  vertical: Vertical;
  size: CanvasSize;
  showEyebrow: boolean;
  showBody: boolean;
  campaignLabel: string;      // eyebrow text above headline, e.g. "Texas Independence Day Sale"
  headline: HeadlineSegment[];
  bodyText: string;
  ctaText: string;            // line 1 of promo box, e.g. "Get Started Today!"
  promoCode: string;          // line 2 of promo box, e.g. "FOURTH40"
  images: {
    person: ImageSlot;   // tall right column — cyan bg
    course: ImageSlot;   // small left — blue bg
    theme: ImageSlot;    // small center — yellow bg
  };
  imageColors: {
    person: string;
    course: string;
    theme: string;
  };
}

export interface DriveFile {
  id: string;
  name: string;
  thumbnailLink?: string;
}
