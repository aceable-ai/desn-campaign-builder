/**
 * Story — 1080×1920
 */
import { forwardRef } from 'react';
import type { AssetConfig } from '../../../types/asset';
import { DESIGN_TOKENS } from '../../../constants/sizes';
import {
  Logo, EyebrowBlock, HeadlineBlock, BodyBlock,
  DashedCtaBox, ImageSquare, MortgageDisclaimer,
} from './BaseTemplate';

interface Props { config: AssetConfig }

export const StoryTemplate = forwardRef<HTMLDivElement, Props>(({ config }, ref) => {
  const W = 1080, H = 1920;
  const PAD = 64;

  const gap = 24;
  const colW = 465;
  const colH = 823;
  const smallH = (colH - gap) / 2;

  const ctaFontSize = 46;

  return (
    <div ref={ref} style={{ position: 'relative', width: W, height: H, backgroundColor: DESIGN_TOKENS.background, overflow: 'hidden', fontFamily: DESIGN_TOKENS.fontPrimary }}>

      {/* ── Logo bar ── */}
      <div style={{ width: W, height: 308, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 48, boxSizing: 'border-box' }}>
        <Logo vertical={config.vertical} height={80} />
      </div>

      {/* ── Copy section ── */}
      <div style={{ paddingLeft: PAD, paddingRight: PAD, paddingTop: 80, paddingBottom: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, boxSizing: 'border-box' }}>
        {config.showEyebrow && <EyebrowBlock text={config.campaignLabel} style={{ fontSize: 28, lineHeight: '38px', textAlign: 'center' }} />}
        <HeadlineBlock segments={config.headline} fontSize={72} style={{ textAlign: 'center' }} />
        {config.showBody && <BodyBlock text={config.bodyText} fontSize={36} style={{ textAlign: 'center' }} />}
        <div style={{ paddingTop: 32 }}>
          <DashedCtaBox ctaText={config.ctaText} fontSize={ctaFontSize} />
        </div>
      </div>

      {/* ── Hero Image ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 871, paddingLeft: PAD, paddingRight: PAD, paddingBottom: 48, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap, alignItems: 'flex-start', height: '100%' }}>
          <ImageSquare slot={config.images.person} width={colW} height={colH} bg={config.imageColors.person} borderRadius={18} label="Person" variant="person" />
          <div style={{ display: 'flex', flexDirection: 'column', gap }}>
            <ImageSquare slot={config.images.course} width={colW} height={smallH} bg={config.imageColors.course} borderRadius={16} label="Course" variant="course" />
            <ImageSquare slot={config.images.theme}  width={colW} height={smallH} bg={config.imageColors.theme}  borderRadius={16} label="Theme"  variant="theme" />
          </div>
        </div>
      </div>

      <MortgageDisclaimer vertical={config.vertical} />
    </div>
  );
});

StoryTemplate.displayName = 'StoryTemplate';
