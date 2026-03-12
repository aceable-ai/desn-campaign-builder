import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { useAssetStore } from '../store/assetStore';

export interface ExportRefs {
  squareRef: React.RefObject<HTMLDivElement | null>;
  portraitRef: React.RefObject<HTMLDivElement | null>;
  storyRef: React.RefObject<HTMLDivElement | null>;
  landscapeRef: React.RefObject<HTMLDivElement | null>;
}

export function useExport(): ExportRefs & { exportAll: () => Promise<void>; exporting: boolean } {
  const squareRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const landscapeRef = useRef<HTMLDivElement | null>(null);

  const vertical = useAssetStore((s) => s.config.vertical);
  const exportingRef = useRef(false);

  const exportAll = useCallback(async () => {
    if (exportingRef.current) return;
    exportingRef.current = true;

    const options = { style: { transform: 'none' }, cacheBust: true };

    try {
      const refs = [
        { ref: squareRef,    name: 'square_1080x1080.png' },
        { ref: portraitRef,  name: 'portrait_1080x1350.png' },
        { ref: storyRef,     name: 'story_1080x1920.png' },
        { ref: landscapeRef, name: 'landscape_1200x628.png' },
      ];

      const results = await Promise.all(
        refs.map(({ ref }) => {
          if (!ref.current) throw new Error('Template ref not mounted');
          return toPng(ref.current, options);
        })
      );

      const zip = new JSZip();
      const today = new Date().toISOString().slice(0, 10);
      const folderName = `${vertical}_${today}`;

      results.forEach((dataUrl, i) => {
        const base64 = dataUrl.split(',')[1];
        zip.file(`${folderName}/${refs[i].name}`, base64, { base64: true });
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      exportingRef.current = false;
    }
  }, [vertical]);

  return {
    squareRef,
    portraitRef,
    storyRef,
    landscapeRef,
    exportAll,
    exporting: exportingRef.current,
  };
}
