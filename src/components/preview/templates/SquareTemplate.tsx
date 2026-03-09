/**
 * Square — 1080×1080 (Figma node 24701:1265)
 *
 * Layout (VERTICAL flex, exact Figma measurements):
 *   Logo Header  169px  — pad 48/64/48/64, centered
 *   Copy Section flex-1 — pad 32/64/32/64, gap 12
 *     [Eyebrow 24px ExtraBold #43646F] (toggle)
 *     [Headline 56px Black #21333F]
 *     [Body 28px SemiBold #21333F]    (toggle)
 *   Hero Frame   600px  — pad 0/60/48/64, gap 24
 *     Left col 608×552 (flex col, gap 24)
 *       CTA container 236px (centers dashed box)
 *       Squares row (292×292 gap 24)
 *     Rectangle  324×552
 */
import { forwardRef } from 'react';
import type { AssetConfig } from '../../../types/asset';
import { DESIGN_TOKENS } from '../../../constants/sizes';
import {
  Logo, EyebrowBlock, HeadlineBlock, BodyBlock,
  DashedCtaBox, ImageSquare, MortgageDisclaimer,
} from './BaseTemplate';

interface Props { config: AssetConfig }

export const SquareTemplate = forwardRef<HTMLDivElement, Props>(({ config }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: 1080,
        height: 1080,
        backgroundColor: '#F1F5FB',
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

      {/* ── Copy Section: flex-1 (= 311px) ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 32,
        paddingRight: 64,
        paddingBottom: 32,
        paddingLeft: 64,
        boxSizing: 'border-box',
        gap: 12,
      }}>
        {config.showEyebrow && <EyebrowBlock text={config.campaignLabel} />}
        <HeadlineBlock segments={config.headline} fontSize={56} />
        {config.showBody && <BodyBlock text={config.bodyText} fontSize={28} />}
      </div>

      {/* ── Hero Frame: 600px ── */}
      {/* inner content: 1080-64-60=956 wide, 600-48=552 tall */}
      <div style={{
        flexShrink: 0,
        height: 600,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 24,
        paddingLeft: 64,
        paddingRight: 60,
        paddingBottom: 48,
        boxSizing: 'border-box',
      }}>

        {/* Left column: 608×552 */}
        {/* Children: CTA container (236) + gap (24) + squares (292) = 552 */}
        <div style={{
          width: 608,
          height: 552,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          {/* CTA container: 236px tall, vertically centers the dashed box */}
          <div style={{
            height: 236,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
            <DashedCtaBox ctaText={config.ctaText} />
          </div>

          {/* Two squares: 292×292 each, 24px gap */}
          <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
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

        {/* Rectangle: 324×552 */}
        <ImageSquare
          slot={config.images.person}
          width={324} height={552}
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

SquareTemplate.displayName = 'SquareTemplate';
