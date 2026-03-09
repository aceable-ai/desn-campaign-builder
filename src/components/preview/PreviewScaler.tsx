import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  naturalWidth: number;
  naturalHeight: number;
  children: ReactNode;
}

/**
 * Scales its children (rendered at full resolution) to fit the available space
 * using CSS transform: scale(). The preview and the export are the same DOM nodes —
 * no pixel drift between what you see and what you download.
 */
export function PreviewScaler({ naturalWidth, naturalHeight, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scaleX = width / naturalWidth;
      const scaleY = height / naturalHeight;
      setScale(Math.min(scaleX, scaleY, 1)); // never upscale
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [naturalWidth, naturalHeight]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: naturalWidth,
          height: naturalHeight,
          transformOrigin: 'center center',
          transform: `scale(${scale})`,
          flexShrink: 0,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
