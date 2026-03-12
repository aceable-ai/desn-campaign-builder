/**
 * Email template — 600px wide
 * Sections: Header · Banner · Hero · Image Tiles · App Download · One-Column · Awards · Footer
 * Layout specs from Figma: Js9KgRwiWQF3EimhFcnZXi node 18730:5299
 */
import { forwardRef } from 'react';
import type React from 'react';
import type { CSSProperties } from 'react';
import type { EmailConfig, TileTag } from '../../../types/email';
import type { ImageSlot, ThemeAlignH, ThemeAlignV } from '../../../types/asset';
import { EMAIL_TOKENS } from '../../../constants/sizes';
import aceableLogo          from '../../../assets/logos/aceable.svg?url';
import aceableAgentLogo     from '../../../assets/logos/aceable-agent.svg?url';
import aceableInsuranceLogo from '../../../assets/logos/aceable-insurance.svg?url';
import aceableMortgageLogo  from '../../../assets/logos/aceable-mortgage.svg?url';
import trustpilotReviewsLightUrl from '../../../assets/email/trustpilot-reviews-light.svg?url';
import trustpilotReviewsDarkUrl  from '../../../assets/email/trustpilot-reviews-dark.svg?url';
import appStoreBadgeUrl    from '../../../assets/email/badge-app-store.svg?url';
import googlePlayBadgeUrl  from '../../../assets/email/badge-google-play.svg?url';
import awardNewsweekUrl    from '../../../assets/email/award-newsweek.png';
import awardHousingwireUrl from '../../../assets/email/award-housingwire.png';
import awardFortuneUrl     from '../../../assets/email/award-fortune.png';

const F  = EMAIL_TOKENS.font;       // Lato
const FA = EMAIL_TOKENS.fontAlt;    // Nunito Sans
const W  = EMAIL_TOKENS.containerWidth; // 600

interface Props {
  config: EmailConfig;
  tileRef?: React.Ref<HTMLDivElement>;
}

// ── Static maps ─────────────────────────────────────────────────────────────

const LOGO_SRCS: Record<EmailConfig['vertical'], string> = {
  'aceable':           aceableLogo,
  'aceable-agent':     aceableAgentLogo,
  'aceable-insurance': aceableInsuranceLogo,
  'aceable-mortgage':  aceableMortgageLogo,
};

const PHONE_NUMBERS: Partial<Record<EmailConfig['vertical'], string>> = {
  'aceable-mortgage':  '855-550-3040',
  'aceable-insurance': '855-299-6528',
};

const HAS_PHONE_ROW = new Set<EmailConfig['vertical']>(['aceable-mortgage', 'aceable-insurance']);

// ── Small components ────────────────────────────────────────────────────────

function PrimaryBtn({ text }: { text: string }) {
  return (
    <a href="#" style={{
      display: 'inline-block',
      backgroundColor: EMAIL_TOKENS.ctaColor,
      color: '#ffffff',
      fontFamily: F,
      fontSize: 18,
      fontWeight: 700,
      paddingLeft: 40,
      paddingRight: 40,
      paddingTop: 18,
      paddingBottom: 18,
      borderRadius: 100,
      textDecoration: 'none',
      lineHeight: 1,
    }}>{text}</a>
  );
}

function ImageTile({ color, slot, variant, width, height, tag, alignH = 'center', alignV = 'center' }: {
  color: string;
  slot: ImageSlot;
  variant: 'person' | 'course' | 'object';
  width: number;
  height: number;
  tag: TileTag;
  alignH?: ThemeAlignH;
  alignV?: ThemeAlignV;
}) {
  const imgStyle: CSSProperties =
    variant === 'person'
      ? { marginTop: 12, width: '100%', height: height - 11, objectFit: 'cover' as const, objectPosition: 'top center', display: 'block' }
      : variant === 'course'
      ? { marginTop: 12, width: width - 24, height: 'auto', display: 'block' }
      : {
          maxWidth:  alignH === 'center' ? width  - 48 : width  - 24,
          maxHeight: alignV === 'center' ? height - 48 : height - 24,
          width: 'auto', height: 'auto', display: 'block',
        };

  const justifyContent = variant !== 'object' ? 'flex-start'
    : alignH === 'left' ? 'flex-start' : alignH === 'right' ? 'flex-end' : 'center';
  const alignItems = variant !== 'object' ? 'flex-start'
    : alignV === 'top' ? 'flex-start' : alignV === 'bottom' ? 'flex-end' : 'center';

  return (
    <div style={{
      width, height, backgroundColor: color, borderRadius: 12, overflow: 'hidden',
      position: 'relative', flexShrink: 0, display: 'flex',
      justifyContent: slot.objectUrl ? justifyContent : 'center',
      alignItems: slot.objectUrl ? alignItems : 'center',
    }}>
      {slot.objectUrl
        ? <img src={slot.objectUrl} alt="" style={imgStyle} />
        : <span style={{ fontFamily: F, fontSize: Math.max(14, width * 0.08), color: '#8a9ab0', textAlign: 'center', padding: 8 }}>{variant.charAt(0).toUpperCase() + variant.slice(1)}</span>
      }
      {tag.show && (
        <div style={{
          position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#ffffff', borderRadius: 100, padding: '8px 12px',
          whiteSpace: 'nowrap', boxShadow: '2px 3px 0 rgba(0,0,0,0.18)',
        }}>
          <span style={{ fontFamily: FA, fontSize: 14, fontWeight: 900, color: '#21333f' }}>{tag.text}</span>
        </div>
      )}
    </div>
  );
}

// ── Main Template ──────────────────────────────────────────────────────────

export const EmailTemplate = forwardRef<HTMLDivElement, Props>(({ config, tileRef }, ref) => {
  const isDark = config.headerColorScheme === 'dark';

  const theme = {
    outerBg:      isDark ? '#152028' : EMAIL_TOKENS.bodyBg,
    sectionBg:    isDark ? EMAIL_TOKENS.textDark : '#ffffff',
    awardsBg:     isDark ? EMAIL_TOKENS.textDark : '#f4f9fc',
    footerBg:     isDark ? '#152028' : EMAIL_TOKENS.footerBg,
    divider:      isDark ? 'rgba(255,255,255,0.1)' : '#e8f0f5',
    eyebrow:      isDark ? '#ffffff' : EMAIL_TOKENS.eyebrowColor,
    headline:     isDark ? '#ffffff' : EMAIL_TOKENS.textDark,
    body:         isDark ? 'rgba(255,255,255,0.8)' : EMAIL_TOKENS.textBody,
    footerText:   isDark ? 'rgba(255,255,255,0.6)' : EMAIL_TOKENS.textBody,
    logoFilter:   isDark ? 'brightness(0) invert(1)' : undefined,
    headerBg:     isDark ? EMAIL_TOKENS.textDark : '#ffffff',
    phoneColor:   isDark ? '#ffffff' : EMAIL_TOKENS.eyebrowColor,
    subText:      isDark ? '#ffffff' : EMAIL_TOKENS.textBody,
    headerDivider:isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e8f0f5',
  };

  const hasPhone = HAS_PHONE_ROW.has(config.vertical);
  const phone    = PHONE_NUMBERS[config.vertical];

  return (
    <div ref={ref} style={{ width: W, backgroundColor: theme.outerBg, fontFamily: F }}>

      {/* ── 1. Header ─────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: theme.headerBg }}>
        {hasPhone ? (
          <>
            <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <img src={LOGO_SRCS[config.vertical]} alt={config.vertical}
                style={{ height: 48, width: 'auto', display: 'block', filter: theme.logoFilter }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: FA, fontSize: 18, fontWeight: 600, color: theme.phoneColor, lineHeight: 1.25 }}>{phone}</div>
                <div style={{ fontFamily: FA, fontSize: 14, fontWeight: 400, color: theme.subText, lineHeight: 1.5 }}>Get answers, get started</div>
              </div>
            </div>
            <div style={{ padding: '10px 8px', textAlign: 'center', borderTop: theme.headerDivider }}>
              <span style={{ fontFamily: FA, fontSize: 14, fontWeight: 600, color: theme.subText }}>Formerly Real Estate Institute</span>
            </div>
          </>
        ) : (
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, boxSizing: 'border-box' }}>
            <img src={LOGO_SRCS[config.vertical]} alt={config.vertical}
              style={{ height: 48, width: 'auto', display: 'block', filter: theme.logoFilter }} />
          </div>
        )}
      </div>

      {/* ── 2. Banner ─────────────────────────────────────────────────────── */}
      {(() => {
        const lightBg = new Set(['#2CE1AB', '#71D7E1']);
        const bannerTextColor = lightBg.has(config.bannerColor.toUpperCase()) || lightBg.has(config.bannerColor) ? '#21333f' : '#ffffff';
        return (
          <div style={{
            backgroundColor: config.bannerColor,
            padding: '16px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{config.bannerEmoji}</span>
            <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: bannerTextColor, letterSpacing: 3, textTransform: 'uppercase' }}>
              {config.bannerSaleName}:{' '}
              <span style={{ textDecoration: 'underline' }}>{config.bannerDiscount}</span>
            </span>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{config.bannerEmoji}</span>
          </div>
        );
      })()}

      {/* ── 3. Hero ───────────────────────────────────────────────────────── */}
      {/* 600x647, pt/pb=48, pl/pr=32 */}
      <div style={{ backgroundColor: theme.sectionBg, padding: '48px 32px' }}>
        {/* Aligned copy block */}
        <div style={{ textAlign: config.heroAlignment }}>
          {/* Eyebrow */}
          {config.showEyebrow && (
            <p style={{ margin: '0 0 12px', fontFamily: F, fontSize: 16, fontWeight: 700, color: theme.eyebrow, letterSpacing: 3, textTransform: 'uppercase', lineHeight: 1.25 }}>
              {config.eyebrowText}
            </p>
          )}
          {/* Headline — HeadlineSegment[] with per-word pink highlights */}
          <h1 style={{ margin: '0 0 16px', fontFamily: F, fontSize: 48, fontWeight: 700, color: theme.headline, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            {config.headline.map((seg, i) => (
              <span key={i} style={seg.highlighted ? { color: EMAIL_TOKENS.ctaColor } : {}}>
                {i > 0 ? ' ' : ''}{seg.text}
              </span>
            ))}
          </h1>
          {/* Body */}
          {config.showBody && (
            <p style={{ margin: '0 0 16px', fontFamily: F, fontSize: 18, fontWeight: 200, color: theme.body, lineHeight: 1.5 }}>
              {config.bodyText}
            </p>
          )}
          {/* Promo highlight */}
          {config.showHighlight && (
            <p style={{ margin: '0 0 24px', fontFamily: F, fontSize: 24, fontWeight: 600, color: theme.headline, lineHeight: 1.5 }}>
              {config.highlightText}
            </p>
          )}
        </div>
        {/* Reviews — always centered */}
        {config.showReviews && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img src={isDark ? trustpilotReviewsDarkUrl : trustpilotReviewsLightUrl} alt="Trustpilot reviews" style={{ maxWidth: '100%', height: 'auto', display: 'inline-block' }} />
          </div>
        )}
        {/* CTA — always centered */}
        {config.showCta && (
          <div style={{ textAlign: 'center' }}>
            <PrimaryBtn text={config.ctaText} />
          </div>
        )}
      </div>

      {/* ── 4. Hero Image Tiles ───────────────────────────────────────────── */}
      <div ref={tileRef} style={{ backgroundColor: theme.sectionBg, padding: '48px 32px' }}>
        {config.heroTileCount === 2 && (
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Left — staggered 48px down */}
            <div style={{ paddingTop: 48 }}>
              <ImageTile color={config.tileColors.t1} slot={config.tileImages.t1} variant="person" width={262} height={534} tag={config.tileTags.t1} />
            </div>
            <ImageTile color={config.tileColors.t2} slot={config.tileImages.t2} variant="person" width={262} height={534} tag={config.tileTags.t2} />
          </div>
        )}
        {config.heroTileCount === 3 && (
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Left — staggered 48px down */}
            <div style={{ paddingTop: 48 }}>
              <ImageTile color={config.tileColors.t1} slot={config.tileImages.t1} variant="person" width={262} height={534} tag={config.tileTags.t1} />
            </div>
            {/* Right — two stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ImageTile color={config.tileColors.t2} slot={config.tileImages.t2} variant="course" width={262} height={261} tag={config.tileTags.t2} />
              <ImageTile color={config.tileColors.t3} slot={config.tileImages.t3} variant="object" width={262} height={261} tag={config.tileTags.t3} alignH={config.tileAlignments.t3.h} alignV={config.tileAlignments.t3.v} />
            </div>
          </div>
        )}
        {config.heroTileCount === 4 && (
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Left column — staggered 48px down */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 48 }}>
              <ImageTile color={config.tileColors.t1} slot={config.tileImages.t1} variant="person" width={262} height={261} tag={config.tileTags.t1} />
              <ImageTile color={config.tileColors.t3} slot={config.tileImages.t3} variant="object" width={262} height={261} tag={config.tileTags.t3} alignH={config.tileAlignments.t3.h} alignV={config.tileAlignments.t3.v} />
            </div>
            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ImageTile color={config.tileColors.t2} slot={config.tileImages.t2} variant="course" width={262} height={261} tag={config.tileTags.t2} />
              <ImageTile color={config.tileColors.t4} slot={config.tileImages.t4} variant="object" width={262} height={261} tag={config.tileTags.t4} alignH={config.tileAlignments.t4.h} alignV={config.tileAlignments.t4.v} />
            </div>
          </div>
        )}
      </div>

      {/* ── 5. App Download Banner ────────────────────────────────────────── */}
      {config.showAppBanner && (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontFamily: F, fontSize: 24, fontWeight: 900, color: '#213E3F', lineHeight: 1.25 }}>
            {config.appBannerText}
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
            <img src={appStoreBadgeUrl} alt="Download on the App Store" style={{ height: 60, width: 'auto', display: 'block' }} />
            <img src={googlePlayBadgeUrl} alt="Get it on Google Play" style={{ height: 60, width: 'auto', display: 'block' }} />
          </div>
        </div>
      )}

      {/* ── 6. Body Section ───────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: theme.sectionBg,
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
      }}>
        {/* Content block */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {config.showSecondaryHeadline && (
              <h2 style={{ margin: 0, fontFamily: F, fontSize: 24, fontWeight: 900, color: theme.headline, lineHeight: '30px' }}>
                {config.secondaryHeadlineText}
              </h2>
            )}
            {config.bodySectionText.split('\n\n').map((para, i) => (
              <p key={i} style={{ margin: 0, fontFamily: F, fontSize: 18, fontWeight: 400, color: theme.body, lineHeight: '27px' }}>
                {para}
              </p>
            ))}
          </div>
        </div>
        {/* CTA */}
        {config.showBodyCta && (
          config.bodyCtaStyle === 'primary'
            ? <PrimaryBtn text={config.bodyCtaText} />
            : (
              <a href="#" style={{
                display: 'inline-block',
                backgroundColor: '#ffffff',
                color: EMAIL_TOKENS.ctaColor,
                fontFamily: F,
                fontSize: 18,
                fontWeight: 900,
                paddingLeft: 48,
                paddingRight: 48,
                paddingTop: 18,
                paddingBottom: 18,
                borderRadius: 100,
                textDecoration: 'none',
                lineHeight: 1,
                border: `2px solid ${EMAIL_TOKENS.ctaColor}`,
              }}>{config.bodyCtaText}</a>
            )
        )}
      </div>

      {/* ── 7. Awards Banner ──────────────────────────────────────────────── */}
      {config.showAwardsBanner && (
        config.awardsBannerStyle === 'newsweek' ? (
          <div style={{ backgroundColor: theme.awardsBg, padding: '48px 32px' }}>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {/* Left: Newsweek logo */}
              <div style={{ width: 252, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={awardNewsweekUrl} alt="Newsweek" style={{ width: 252, height: 'auto', display: 'block' }} />
              </div>
              {/* Right: heading + body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h2 style={{ margin: 0, fontFamily: F, fontSize: 24, fontWeight: 900, color: theme.headline, lineHeight: '30px' }}>
                  Trusted. Recognized. Award-Winning.
                </h2>
                <p style={{ margin: 0, fontFamily: F, fontSize: 16, fontWeight: 400, color: theme.body, lineHeight: '24px' }}>
                  Aceable named to Newsweek's 2025 list of America's Best Online Platforms
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: theme.awardsBg, padding: '48px 32px' }}>
            {/* Centered heading */}
            <h2 style={{ margin: '0 0 32px', fontFamily: F, fontSize: 24, fontWeight: 900, color: theme.headline, lineHeight: '30px', textAlign: 'center' }}>
              Trusted. Recognized. Award-Winning.
            </h2>
            {/* 3-column row */}
            <div style={{ display: 'flex', gap: 48 }}>
              {[
                { img: awardNewsweekUrl,    alt: 'Newsweek',    imgH: 55,  desc: 'Newsweek Top Online Learning Provider, 2025' },
                { img: awardHousingwireUrl, alt: 'HousingWire', imgH: 38,  desc: "Hanley-Wood's HousingWire Tech 100, 2025" },
                { img: awardFortuneUrl,     alt: 'Fortune',     imgH: 98,  desc: 'Fortune Best Real Estate School, 2024' },
              ].map((award) => (
                <div key={award.alt} style={{ width: 147, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 147, height: 98, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={award.img} alt={award.alt} style={{ width: 147, height: award.imgH, objectFit: 'contain', display: 'block' }} />
                  </div>
                  <p style={{ margin: 0, fontFamily: F, fontSize: 16, fontWeight: 400, color: theme.body, lineHeight: '24px', textAlign: 'center' }}>
                    {award.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* ── 8. Footer ─────────────────────────────────────────────────────── */}
      {/* 600×238, bg=#F1F5F5, padding=32, gap=24 */}
      <div style={{ backgroundColor: theme.footerBg, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

        {/* App download — vertical, gap=12, centered */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <p style={{ margin: 0, fontFamily: F, fontSize: 14, fontWeight: 900, color: theme.footerText, textAlign: 'center' }}>
            Download the Aceable App:
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <img src={appStoreBadgeUrl}   alt="Download on the App Store" style={{ height: 40, width: 'auto', display: 'block' }} />
            <img src={googlePlayBadgeUrl} alt="Get it on Google Play"     style={{ height: 40, width: 'auto', display: 'block' }} />
          </div>
        </div>

        {/* Social icons — 32×32 each, color #AFC1C6, gap=12, L/R padding=12 */}
        <div style={{ display: 'flex', gap: 12, paddingLeft: 12, paddingRight: 12 }}>
          {/* Facebook */}
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#AFC1C6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </div>
          {/* Instagram */}
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#AFC1C6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#AFC1C6" stroke="none"/></svg>
          </div>
          {/* X / Twitter */}
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#AFC1C6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </div>
          {/* YouTube */}
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#AFC1C6"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
          </div>
        </div>

        {/* Links — horizontal, gap=16, centered */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
          {['Privacy Policy', 'Terms & Conditions', 'Contact Us', 'View In Browser'].map((link, i, arr) => (
            <span key={link} style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
              <a href="#" style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: theme.footerText, textDecoration: 'none', lineHeight: '21px' }}>{link}</a>
              {i < arr.length - 1 && <span style={{ fontFamily: F, fontSize: 14, color: theme.footerText, lineHeight: '21px' }}>|</span>}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
});

EmailTemplate.displayName = 'EmailTemplate';
