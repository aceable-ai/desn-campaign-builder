/**
 * Email template — 600px wide
 * Exact layout from Figma "Email 02" frame:
 *   - Header: white bg, logo + phone
 *   - Banner: #2689ca, eyebrow text centered
 *   - Hero: white, eyebrow + headline + body + highlight + CTA button
 *   - Content: white, section header + bullets + CTA
 *   - Footer: #f1f5f5
 */
import { forwardRef } from 'react';
import type { EmailConfig } from '../../../types/email';
import { EMAIL_TOKENS } from '../../../constants/sizes';

const F = EMAIL_TOKENS.font;
const FA = EMAIL_TOKENS.fontAlt;
const W = EMAIL_TOKENS.containerWidth; // 600

interface Props { config: EmailConfig }

// ── Reusable small components ──────────────────────────────────────────────

function LogoText({ vertical, height = 48 }: { vertical: EmailConfig['vertical']; height?: number }) {
  const fs = height * 0.45;
  const labels: Record<EmailConfig['vertical'], { top: string; sub: string }> = {
    'aceable':            { top: 'aceable',   sub: '' },
    'aceable-agent':      { top: 'aceable',   sub: 'agent' },
    'aceable-insurance':  { top: 'aceable',   sub: 'insurance' },
    'aceable-mortgage':   { top: 'aceable',   sub: 'mortgage' },
  };
  const { top, sub } = labels[vertical];
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <span style={{ fontFamily: FA, fontSize: fs, fontWeight: 900, color: EMAIL_TOKENS.accentTeal, lineHeight: 1, letterSpacing: '-0.03em' }}>{top}</span>
      {sub && <span style={{ fontFamily: FA, fontSize: fs * 0.5, fontWeight: 800, color: EMAIL_TOKENS.textDark, lineHeight: 1, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{sub}</span>}
    </div>
  );
}

function CtaButton({ text, href = '#' }: { text: string; href?: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-block',
        backgroundColor: EMAIL_TOKENS.ctaColor,
        color: '#ffffff',
        fontFamily: F,
        fontSize: 18,
        fontWeight: 900,
        lineHeight: 1,
        paddingLeft: 48,
        paddingRight: 48,
        paddingTop: 18,
        paddingBottom: 18,
        borderRadius: 100,
        textDecoration: 'none',
      }}
    >
      {text}
    </a>
  );
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: '#e8f0f5', margin: '0' }} />;
}

// ── Main Template ──────────────────────────────────────────────────────────

export const EmailTemplate = forwardRef<HTMLDivElement, Props>(({ config }, ref) => {
  return (
    <div
      ref={ref}
      style={{ width: W, backgroundColor: EMAIL_TOKENS.bodyBg, fontFamily: F }}
    >

      {/* ── Header ── */}
      <div style={{ backgroundColor: '#ffffff' }}>
        {/* Logo row */}
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <LogoText vertical={config.vertical} height={48} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: FA, fontSize: 18, fontWeight: 900, color: EMAIL_TOKENS.eyebrowColor, lineHeight: 1.25 }}>855-299-6528</div>
            <div style={{ fontFamily: FA, fontSize: 14, fontWeight: 400, color: EMAIL_TOKENS.textBody, lineHeight: 1.5 }}>Get answers, get started</div>
          </div>
        </div>
        <Divider />
        <div style={{ backgroundColor: '#f8fafb', padding: '10px 16px', textAlign: 'center' }}>
          <span style={{ fontFamily: FA, fontSize: 14, fontWeight: 700, color: EMAIL_TOKENS.textBody }}>Formerly Real Estate Institute</span>
        </div>
      </div>

      {/* ── Top Banner ── */}
      <div style={{ backgroundColor: EMAIL_TOKENS.bannerBg, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ fontFamily: F, fontSize: 16, fontWeight: 900, color: '#ffffff', letterSpacing: 3, textAlign: 'center', textTransform: 'uppercase' }}>
          {config.bannerText}
        </span>
      </div>

      {/* ── Hero Section ── */}
      <div style={{ backgroundColor: '#ffffff', padding: '48px 32px', textAlign: 'center' }}>
        {/* Eyebrow */}
        <p style={{ margin: '0 0 12px', fontFamily: F, fontSize: 16, fontWeight: 900, color: EMAIL_TOKENS.eyebrowColor, letterSpacing: 3, textTransform: 'uppercase', lineHeight: 1.25 }}>
          {config.bannerText}
        </p>

        {/* Headline */}
        <h1 style={{ margin: '0 0 24px', fontFamily: F, fontSize: 48, fontWeight: 900, color: EMAIL_TOKENS.textDark, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          {config.headline}
        </h1>

        {/* Body */}
        <p style={{ margin: '0 0 16px', fontFamily: F, fontSize: 18, fontWeight: 400, color: EMAIL_TOKENS.textBody, lineHeight: 1.5 }}>
          {config.bodyText}
        </p>

        {/* Highlight */}
        <p style={{ margin: '0 0 24px', fontFamily: F, fontSize: 24, fontWeight: 700, color: EMAIL_TOKENS.textDark, lineHeight: 1.5 }}>
          {config.highlightText}
        </p>

        {/* Hero image */}
        {config.heroImage.objectUrl && (
          <div style={{ margin: '24px 0', borderRadius: 12, overflow: 'hidden' }}>
            <img src={config.heroImage.objectUrl} alt="" style={{ width: '100%', display: 'block' }} />
          </div>
        )}

        {/* CTA button */}
        <CtaButton text={config.ctaText} />
      </div>

      {/* ── Content / Bullets ── */}
      {config.bullets.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', padding: '48px 32px' }}>
          <Divider />
          <div style={{ paddingTop: 40 }}>
            <h2 style={{ margin: '0 0 24px', fontFamily: F, fontSize: 24, fontWeight: 900, color: EMAIL_TOKENS.textDark, lineHeight: 1.25 }}>
              Why Aceable?
            </h2>
            <ul style={{ margin: '0 0 32px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {config.bullets.map((bullet, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', backgroundColor: EMAIL_TOKENS.accentTeal, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>
                  </span>
                  <span style={{ fontFamily: F, fontSize: 18, fontWeight: 400, color: EMAIL_TOKENS.textBody, lineHeight: 1.5 }}>{bullet}</span>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'center' }}>
              <CtaButton text={config.ctaText} />
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{ backgroundColor: EMAIL_TOKENS.footerBg, padding: '32px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px', fontFamily: F, fontSize: 14, fontWeight: 900, color: EMAIL_TOKENS.textBody }}>
          Download the Aceable App:
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          <span style={{ fontFamily: F, fontSize: 12, color: EMAIL_TOKENS.textBody, border: '1px solid #ccc', borderRadius: 6, padding: '4px 12px' }}>App Store</span>
          <span style={{ fontFamily: F, fontSize: 12, color: EMAIL_TOKENS.textBody, border: '1px solid #ccc', borderRadius: 6, padding: '4px 12px' }}>Google Play</span>
        </div>
        <p style={{ margin: 0, fontFamily: F, fontSize: 12, color: '#9ba8b0', lineHeight: 1.5 }}>
          © {new Date().getFullYear()} Aceable. All rights reserved.<br />
          <a href="#" style={{ color: EMAIL_TOKENS.textLink, textDecoration: 'underline' }}>Unsubscribe</a>
          {' · '}
          <a href="#" style={{ color: EMAIL_TOKENS.textLink, textDecoration: 'underline' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
});

EmailTemplate.displayName = 'EmailTemplate';
