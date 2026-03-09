/**
 * Portrait — 1080×1350 (Figma node 24701:1228)
 *
 * Layout (VERTICAL flex):
 *   Logo Header  169px  — pad 48/64/48/64, centered
 *   Copy Section flex-1 — (=453px) pad 64/64, gap 12, vertically centered
 *     [Eyebrow 28px ExtraBold]  (toggle)
 *     [Headline 64px Black]
 *     [Body 32px SemiBold]      (toggle)
 *   Hero Frame   728px  — pad 0/60/48/64, gap 24
 *     Left col 608×680 (flex col, gap 24)
 *       CTA wrapper flex-1 (=364px) — vertically centers dashed box
 *       Squares row 292px (two 292×292 squares, gap 24)
 *     Rectangle  324×680
 */
import { forwardRef } from 'react';
import type { AssetConfig } from '../../../types/asset';
import { DESIGN_TOKENS } from '../../../constants/sizes';
import {
  Logo, EyebrowBlock, HeadlineBlock, BodyBlock,
  DashedCtaBox, ImageSquare, MortgageDisclaimer,
} from './BaseTemplate';

interface Props { config: AssetConfig }

export const PortraitTemplate = forwardRef<HTMLDivElement, Props>(({ config }, ref) => {
  // Hero inner: 1080-64-60=956 wide, 728-48=680 tall
  // Left col: 608+gap24+rect324 = 956 ✓
  const ctaFontSize = 42;

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: 1080,
        height: 1350,
        backgroundColor: DESIGN_TOKENS.background,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: DESIGN_TOKENS.fontPrimary,
      }}
    >
      {/* ── Logo Header: 169px ── */}
      <div style={{
        flexShrink: 0,
        height: 169,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 48,
        paddingRight: 64,
        paddingBottom: 48,
        paddingLeft: 64,
        boxSizing: 'border-box',
      }}>
        <Logo vertical={config.vertical} height={73} />
      </div>

      {/* ── Copy Section: flex-1 (=453px), content vertically centered ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 64,
        paddingRight: 64,
        boxSizing: 'border-box',
        gap: 12,
      }}>
        {config.showEyebrow && (
          <EyebrowBlock text={config.campaignLabel} style={{ fontSize: 28, lineHeight: '38.192px' }} />
        )}
        <HeadlineBlock segments={config.headline} fontSize={64} />
        {config.showBody && <BodyBlock text={config.bodyText} fontSize={32} />}
      </div>

      {/* ── Hero Frame: 728px ── */}
      {/* inner: 956 wide × 680 tall */}
      <div style={{
        flexShrink: 0,
        height: 728,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 24,
        paddingLeft: 64,
        paddingRight: 60,
        paddingBottom: 48,
        boxSizing: 'border-box',
      }}>
        {/* Left column: 608×680 — CTA floats top, squares pinned bottom */}
        <div style={{
          width: 608,
          height: 680,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          {/* CTA wrapper: fills remaining space (364px), centers the dashed box */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
            <DashedCtaBox ctaText={config.ctaText} fontSize={ctaFontSize} />
          </div>

          {/* Two squares: 292×292, pinned to bottom */}
          <div style={{ flexShrink: 0, display: 'flex', gap: 24 }}>
            <ImageSquare
              slot={config.images.course}
              width={292} height={292}
              bg={config.imageColors.course}
              borderRadius={16}
              label="Course"
              variant="course"
            />
            <ImageSquare
              slot={config.images.theme}
              width={292} height={292}
              bg={config.imageColors.theme}
              borderRadius={16}
              label="Theme"
              variant="theme"
            />
          </div>
        </div>

        {/* Rectangle: 324×680 */}
        <ImageSquare
          slot={config.images.person}
          width={324} height={680}
          bg={config.imageColors.person}
          borderRadius={18}
          label="Person"
          variant="person"
        />
      </div>

      <MortgageDisclaimer vertical={config.vertical} />
    </div>
  );
});

PortraitTemplate.displayName = 'PortraitTemplate';
