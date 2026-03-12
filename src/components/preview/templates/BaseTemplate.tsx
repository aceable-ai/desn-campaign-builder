import type { CSSProperties } from 'react';
import { useRef, useState, useLayoutEffect } from 'react';
import type { AssetConfig, ThemeAlignH, ThemeAlignV } from '../../../types/asset';
import { DESIGN_TOKENS } from '../../../constants/sizes';
import aceableLogo          from '../../../assets/logos/aceable.svg?url';
import aceableAgentLogo     from '../../../assets/logos/aceable-agent.svg?url';
import aceableInsuranceLogo from '../../../assets/logos/aceable-insurance.svg?url';
import aceableMortgageLogo  from '../../../assets/logos/aceable-mortgage.svg?url';

const FONT = DESIGN_TOKENS.fontPrimary;

// ─── Logo ─────────────────────────────────────────────────────────────────────

interface LogoProps {
  vertical: AssetConfig['vertical'];
  height?: number;
  style?: CSSProperties;
}

const LOGO_SRCS: Record<AssetConfig['vertical'], string> = {
  'aceable':           aceableLogo,
  'aceable-agent':     aceableAgentLogo,
  'aceable-insurance': aceableInsuranceLogo,
  'aceable-mortgage':  aceableMortgageLogo,
};

export function Logo({ vertical, height = 72, style }: LogoProps) {
  return (
    <img
      src={LOGO_SRCS[vertical]}
      alt={vertical}
      style={{ height, width: 'auto', display: 'block', ...style }}
    />
  );
}

// ─── Eyebrow (Figma-spec: 24px ExtraBold, #43646F, letterSpacing 2px) ────────

interface EyebrowBlockProps {
  text: string;
  style?: CSSProperties;
}

export function EyebrowBlock({ text, style }: EyebrowBlockProps) {
  return (
    <p style={{
      margin: 0, padding: 0,
      fontFamily: FONT,
      fontSize: 24,
      fontWeight: 800,
      lineHeight: '32.736px',
      color: '#43646F',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      ...style,
    }}>
      {text}
    </p>
  );
}

// ─── Campaign label — kept for Portrait/Story/Landscape templates ─────────────

interface CampaignLabelProps {
  text: string;
  fontSize?: number;
  style?: CSSProperties;
}

export function CampaignLabel({ text, fontSize = 32, style }: CampaignLabelProps) {
  return (
    <p style={{
      margin: 0, padding: 0,
      fontFamily: FONT,
      fontSize,
      fontWeight: 800,
      lineHeight: fontSize * 1.25,
      color: DESIGN_TOKENS.text,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      ...style,
    }}>
      {text}
    </p>
  );
}

// ─── Headline (Figma: 56px Black 900, lineHeight 1.364, letterSpacing 0) ──────

interface HeadlineBlockProps {
  segments: AssetConfig['headline'];
  fontSize?: number;
  style?: CSSProperties;
}

export function HeadlineBlock({ segments, fontSize = 56, style }: HeadlineBlockProps) {
  return (
    <p style={{
      margin: 0, padding: 0,
      fontFamily: FONT,
      fontSize,
      fontWeight: 900,
      lineHeight: 1.364,
      color: DESIGN_TOKENS.text,
      letterSpacing: 0,
      ...style,
    }}>
      {segments.map((seg, i) => (
        <span key={i} style={{ color: seg.highlighted ? DESIGN_TOKENS.highlight : DESIGN_TOKENS.text }}>
          {i > 0 ? ' ' : ''}{seg.text}
        </span>
      ))}
    </p>
  );
}

// ─── Body (Figma: 28px SemiBold 600, lineHeight 1.364) ────────────────────────

interface BodyBlockProps {
  text: string;
  fontSize?: number;
  style?: CSSProperties;
}

export function BodyBlock({ text, fontSize = 28, style }: BodyBlockProps) {
  return (
    <p style={{
      margin: 0, padding: 0,
      fontFamily: FONT,
      fontSize,
      fontWeight: 600,
      lineHeight: 1.364,
      color: DESIGN_TOKENS.text,
      ...style,
    }}>
      {text}
    </p>
  );
}

// ─── Dashed CTA Box (Figma: 4px dashed #DB306A, radius 11, pad 24/48) ────────

interface DashedCtaBoxProps {
  ctaText: string;
  fontSize?: number;
  style?: CSSProperties;
}

export function DashedCtaBox({ ctaText, fontSize = 42, style }: DashedCtaBoxProps) {
  const scale = fontSize / 42;
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (containerRef.current) {
      setSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
    }
  }, [ctaText, fontSize]);

  const strokeWidth = 4 * scale;
  const radius = Math.round(11 * scale);
  const dash = 12 * scale;

  return (
    <div ref={containerRef} style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Math.round(24 * scale),
      paddingRight: Math.round(48 * scale),
      paddingBottom: Math.round(24 * scale),
      paddingLeft: Math.round(48 * scale),
      ...style,
    }}>
      {size.width > 0 && (
        <svg
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
        >
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={size.width - strokeWidth}
            height={size.height - strokeWidth}
            rx={radius}
            fill="none"
            stroke="#DB306A"
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${dash}`}
            strokeLinecap="round"
          />
        </svg>
      )}
      <span style={{
        fontFamily: FONT,
        fontSize,
        fontWeight: 900,
        color: '#DB306A',
        lineHeight: 1.364,
        whiteSpace: 'nowrap',
        letterSpacing: 0,
      }}>
        {ctaText}
      </span>
    </div>
  );
}

// ─── Promo Box — kept for Portrait/Story/Landscape templates ──────────────────

interface PromoBoxProps {
  ctaText: string;
  promoCode: string;
  fontSize?: number;
  style?: CSSProperties;
}

export function PromoBox({ ctaText, promoCode, fontSize = 42, style }: PromoBoxProps) {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      gap: fontSize * 0.15,
      backgroundColor: DESIGN_TOKENS.text,
      borderRadius: 11,
      paddingLeft: fontSize * 1.14,
      paddingRight: fontSize * 1.14,
      paddingTop: fontSize * 0.57,
      paddingBottom: fontSize * 0.57,
      ...style,
    }}>
      <span style={{ fontFamily: FONT, fontSize, fontWeight: 900, color: DESIGN_TOKENS.highlight, lineHeight: 1.364, whiteSpace: 'nowrap' }}>
        {ctaText}
      </span>
      <span style={{ fontFamily: FONT, fontSize, fontWeight: 900, color: '#ffffff', lineHeight: 1.364, whiteSpace: 'nowrap' }}>
        {promoCode}
      </span>
    </div>
  );
}

// ─── Mortgage Disclaimer ──────────────────────────────────────────────────────

interface MortgageDisclaimerProps {
  vertical: AssetConfig['vertical'];
}

export function MortgageDisclaimer({ vertical }: MortgageDisclaimerProps) {
  if (vertical !== 'aceable-mortgage') return null;
  return (
    <p style={{
      position: 'absolute',
      bottom: 12,
      left: 0,
      right: 0,
      margin: 0,
      padding: '0 16px',
      fontFamily: FONT,
      fontSize: 14,
      fontWeight: 400,
      color: '#43646F',
      textAlign: 'center',
      lineHeight: 1.4,
    }}>
      Aceable Mortgage is an approved NMLS Course Provider ID: 1400102
    </p>
  );
}

// ─── Image Slot ───────────────────────────────────────────────────────────────

interface ImageSquareProps {
  slot: AssetConfig['images']['person'];
  width: number;
  height: number;
  bg?: string;
  borderRadius?: number;
  style?: CSSProperties;
  label?: string;
  variant?: 'person' | 'course' | 'theme';
  alignH?: ThemeAlignH;
  alignV?: ThemeAlignV;
}

function getThemeLayout(alignH: ThemeAlignH, alignV: ThemeAlignV, width: number, height: number): {
  justifyContent: CSSProperties['justifyContent'];
  alignItems: CSSProperties['alignItems'];
  imgStyle: CSSProperties;
} {
  const justifyContent = alignH === 'left' ? 'flex-start' : alignH === 'right' ? 'flex-end' : 'center';
  const alignItems = alignV === 'top' ? 'flex-start' : alignV === 'bottom' ? 'flex-end' : 'center';
  const maxWidth  = alignH === 'center' ? width  - 48 : width  - 24;
  const maxHeight = alignV === 'center' ? height - 48 : height - 24;
  return {
    justifyContent,
    alignItems,
    imgStyle: { maxWidth, maxHeight, width: 'auto', height: 'auto', display: 'block' },
  };
}

export function ImageSquare({ slot, width, height, bg = '#e8e0d4', borderRadius = DESIGN_TOKENS.imageRadius, style, label, variant, alignH = 'center', alignV = 'center' }: ImageSquareProps) {
  const themeLayout = variant === 'theme' ? getThemeLayout(alignH, alignV, width, height) : null;

  const imgStyle: CSSProperties =
    variant === 'person'
      ? { marginTop: 12, width: '100%', height: height - 11, objectFit: 'cover' as const, objectPosition: 'top center', display: 'block' }
      : variant === 'course'
      ? { marginTop: 12, width: width - 24, height: 'auto', display: 'block' }
      : variant === 'theme'
      ? themeLayout!.imgStyle
      : { width: '100%', height: '100%', objectFit: 'cover' as const, display: 'block' };

  const justifyContent = variant === 'theme' ? themeLayout!.justifyContent : 'center';
  const alignItems = variant === 'theme'
    ? themeLayout!.alignItems
    : (variant === 'person' || variant === 'course') ? 'flex-start' : 'center';

  return (
    <div style={{
      width, height, borderRadius,
      overflow: 'hidden',
      backgroundColor: bg,
      flexShrink: 0,
      display: 'flex',
      justifyContent: slot.objectUrl ? justifyContent : 'center',
      alignItems: slot.objectUrl ? alignItems : 'center',
      ...style,
    }}>
      {slot.objectUrl ? (
        <img src={slot.objectUrl} alt="" style={imgStyle} />
      ) : (
        <span style={{ fontFamily: FONT, fontSize: Math.max(14, width * 0.08), color: '#8a9ab0', textAlign: 'center', padding: 8 }}>
          {label ?? 'Image'}
        </span>
      )}
    </div>
  );
}
