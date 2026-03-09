/**
 * Landscape — 1200×628 (Figma node 24701:1207)
 *
 * Layout (HORIZONTAL flex):
 *   Left Side  624px (VERTICAL)
 *     Logo Header  hug — pad 48/64/32/64, left-aligned
 *     Copy         hug — pad 0/64/0/64, gap 12
 *       [Eyebrow 22px] [Headline 48px] [Body 24px]
 *     CTA Wrapper  flex-1 — pad 0/0/48/64, CTA pinned bottom-left
 *   Right Side flex-1=576px (VERTICAL, bottom-aligned)
 *     Hero Image Frame — padRight 64, gap 24
 *       Rectangle   244×512
 *       Squares col 244×512 (two 244×244 stacked, gap 24)
 */
import { forwardRef } from 'react';
import type { AssetConfig } from '../../../types/asset';
import { DESIGN_TOKENS } from '../../../constants/sizes';
import {
  Logo, EyebrowBlock, HeadlineBlock, BodyBlock,
  DashedCtaBox, ImageSquare, MortgageDisclaimer,
} from './BaseTemplate';

interface Props { config: AssetConfig }

export const LandscapeTemplate = forwardRef<HTMLDivElement, Props>(({ config }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: 1200,
        height: 628,
        backgroundColor: DESIGN_TOKENS.background,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        fontFamily: DESIGN_TOKENS.fontPrimary,
      }}
    >
      {/* ── Left Side: 624px wide ── */}
      <div style={{
        width: 624,
        height: 628,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo Header: hugs logo, left-aligned */}
        <div style={{
          paddingLeft: 64,
          paddingRight: 64,
          paddingTop: 48,
          paddingBottom: 32,
          boxSizing: 'border-box',
        }}>
          <Logo vertical={config.vertical} height={61} />
        </div>

        {/* Copy: hugs content, gap 12 */}
        <div style={{
          paddingLeft: 64,
          paddingRight: 64,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxSizing: 'border-box',
        }}>
          {config.showEyebrow && (
            <EyebrowBlock text={config.campaignLabel} style={{ fontSize: 22, lineHeight: '30px' }} />
          )}
          <HeadlineBlock segments={config.headline} fontSize={48} />
          {config.showBody && <BodyBlock text={config.bodyText} fontSize={24} />}
        </div>

        {/* CTA Wrapper: flex-1, CTA pinned to bottom-left */}
        <div style={{
          flex: 1,
          paddingLeft: 64,
          paddingBottom: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          boxSizing: 'border-box',
        }}>
          <DashedCtaBox
            ctaText={config.ctaText}
            fontSize={32}
            style={{
              paddingTop: 18,
              paddingRight: 32,
              paddingBottom: 18,
              paddingLeft: 32,
              borderRadius: 11,
              border: '4px dashed #DB306A',
            }}
          />
        </div>
      </div>

      {/* ── Right Side: flex-1 (=576px), tiles pinned to bottom ── */}
      <div style={{
        flex: 1,
        height: 628,
        paddingTop: 48,
        paddingBottom: 48,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxSizing: 'border-box',
      }}>
        {/* Hero Image Frame: Rectangle + Squares column side by side */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 24,
          paddingRight: 64,
          boxSizing: 'border-box',
        }}>
          {/* Rectangle: 244×512 */}
          <ImageSquare
            slot={config.images.person}
            width={244} height={512}
            bg={config.imageColors.person}
            borderRadius={18}
            label="Person"
            variant="person"
          />

          {/* Squares column: two 244×244 stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <ImageSquare
              slot={config.images.course}
              width={244} height={244}
              bg={config.imageColors.course}
              borderRadius={16}
              label="Course"
              variant="course"
            />
            <ImageSquare
              slot={config.images.theme}
              width={244} height={244}
              bg={config.imageColors.theme}
              borderRadius={16}
              label="Theme"
              variant="theme"
            />
          </div>
        </div>
      </div>

      <MortgageDisclaimer vertical={config.vertical} />
    </div>
  );
});

LandscapeTemplate.displayName = 'LandscapeTemplate';
