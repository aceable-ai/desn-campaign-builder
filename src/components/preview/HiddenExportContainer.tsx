import type { RefObject } from 'react';
import type { AssetConfig } from '../../types/asset';
import { SquareTemplate } from './templates/SquareTemplate';
import { PortraitTemplate } from './templates/PortraitTemplate';
import { StoryTemplate } from './templates/StoryTemplate';
import { LandscapeTemplate } from './templates/LandscapeTemplate';

interface Props {
  config: AssetConfig;
  squareRef: RefObject<HTMLDivElement>;
  portraitRef: RefObject<HTMLDivElement>;
  storyRef: RefObject<HTMLDivElement>;
  landscapeRef: RefObject<HTMLDivElement>;
}

/**
 * Renders all 4 templates off-screen at full resolution for html-to-image export.
 * The visible PreviewPanel renders its own display-only instance for preview.
 */
export function HiddenExportContainer({ config, squareRef, portraitRef, storyRef, landscapeRef }: Props) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: -9999,
        top: 0,
        pointerEvents: 'none',
      }}
    >
      <SquareTemplate    ref={squareRef}    config={config} />
      <PortraitTemplate  ref={portraitRef}  config={config} />
      <StoryTemplate     ref={storyRef}     config={config} />
      <LandscapeTemplate ref={landscapeRef} config={config} />
    </div>
  );
}
