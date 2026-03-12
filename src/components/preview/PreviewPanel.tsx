import { useState } from 'react';
import type { RefObject } from 'react';
import type { CanvasSize } from '../../types/asset';
import { useAssetStore } from '../../store/assetStore';
import { PreviewScaler } from './PreviewScaler';
import { SquareTemplate } from './templates/SquareTemplate';
import { PortraitTemplate } from './templates/PortraitTemplate';
import { StoryTemplate } from './templates/StoryTemplate';
import { LandscapeTemplate } from './templates/LandscapeTemplate';
import { HiddenExportContainer } from './HiddenExportContainer';
import { CANVAS_SIZES } from '../../constants/sizes';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';

interface Props {
  squareRef: RefObject<HTMLDivElement>;
  portraitRef: RefObject<HTMLDivElement>;
  storyRef: RefObject<HTMLDivElement>;
  landscapeRef: RefObject<HTMLDivElement>;
}

const SIZE_ORDER: CanvasSize[] = ['square', 'portrait', 'story', 'landscape'];

export function PreviewPanel({ squareRef, portraitRef, storyRef, landscapeRef }: Props) {
  const config = useAssetStore((s) => s.config);
  const [isExporting, setIsExporting] = useState(false);
  const [previewSize, setPreviewSize] = useState<CanvasSize>('square');

  const { width, height } = CANVAS_SIZES[previewSize];

  async function handleExport() {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const refs = [
        { ref: squareRef,    name: 'square_1080x1080.png' },
        { ref: portraitRef,  name: 'portrait_1080x1350.png' },
        { ref: storyRef,     name: 'story_1080x1920.png' },
        { ref: landscapeRef, name: 'landscape_1200x628.png' },
      ];
      const options = { style: { transform: 'none' }, cacheBust: true };
      const results = await Promise.all(
        refs.map(({ ref }) => {
          if (!ref.current) throw new Error('Template ref not mounted');
          return toPng(ref.current, options);
        })
      );
      const zip = new JSZip();
      const today = new Date().toISOString().slice(0, 10);
      const folderName = `${config.vertical}_${today}`;
      results.forEach((dataUrl, i) => {
        zip.file(`${folderName}/${refs[i].name}`, dataUrl.split(',')[1], { base64: true });
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed — check the console for details.');
    } finally {
      setIsExporting(false);
    }
  }

  function renderPreview() {
    switch (previewSize) {
      case 'square':    return <SquareTemplate    config={config} />;
      case 'portrait':  return <PortraitTemplate  config={config} />;
      case 'story':     return <StoryTemplate     config={config} />;
      case 'landscape': return <LandscapeTemplate config={config} />;
    }
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#1A1F2E]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#1A1F2E] px-6 py-3">
        <span className="text-sm font-medium text-white/70">Preview</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">Exports all 4 sizes as ZIP</span>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              isExporting
                ? 'cursor-not-allowed bg-white/20 text-white/40'
                : 'bg-[#DB306A] text-white hover:bg-[#c22a5f] active:scale-95'
            }`}
          >
            {isExporting ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Exporting…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v8M4 6l3 3 3-3M1 10v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Export All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Size switcher */}
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#1A1F2E] px-6 py-2">
        {SIZE_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setPreviewSize(s)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
              previewSize === s
                ? 'bg-white/20 text-white'
                : 'text-white/40 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            {CANVAS_SIZES[s].label}
          </button>
        ))}
      </div>

      {/* Scaled preview — display-only, no ref */}
      <div className="flex-1 min-h-0 p-6">
        <PreviewScaler naturalWidth={width} naturalHeight={height}>
          {renderPreview()}
        </PreviewScaler>
      </div>

      {/* Hidden export container — all 4 refs live here */}
      <HiddenExportContainer
        config={config}
        squareRef={squareRef}
        portraitRef={portraitRef}
        storyRef={storyRef}
        landscapeRef={landscapeRef}
      />
    </div>
  );
}
