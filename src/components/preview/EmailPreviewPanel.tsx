import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useAssetStore } from '../../store/assetStore';
import { EmailTemplate } from './templates/EmailTemplate';
import { EMAIL_TOKENS } from '../../constants/sizes';
import { pushToIterable } from '../../services/iterableExport';

export function EmailPreviewPanel() {
  const emailConfig = useAssetStore((s) => s.emailConfig);
  const [isExporting, setIsExporting] = useState(false);
  const [pushStatus, setPushStatus] = useState<'idle' | 'pushing' | 'success' | 'error'>('idle');
  const templateRef = useRef<HTMLDivElement>(null);
  const tileRef     = useRef<HTMLDivElement>(null);

  async function handleExport() {
    if (isExporting || !tileRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(tileRef.current, {
        style: { transform: 'none', backgroundColor: 'transparent' },
        backgroundColor: undefined,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      const today = new Date().toISOString().slice(0, 10);
      a.download = `hero_tiles_${emailConfig.vertical}_${today}.png`;
      a.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed — check the console.');
    } finally {
      setIsExporting(false);
    }
  }

  async function handlePushToIterable() {
    if (pushStatus === 'pushing' || !tileRef.current || !templateRef.current) return;
    setPushStatus('pushing');
    try {
      const { templateId } = await pushToIterable(tileRef.current, templateRef.current, emailConfig);
      setPushStatus('success');
      const url = templateId
        ? `https://app.iterable.com/templates/${templateId}?projectId=1677`
        : 'https://app.iterable.com/templates?projectId=1677';
      window.open(url, '_blank');
      setTimeout(() => setPushStatus('idle'), 3000);
    } catch (err) {
      console.error('Push to Iterable failed', err);
      setPushStatus('error');
      setTimeout(() => setPushStatus('idle'), 3000);
    }
  }

  const W = EMAIL_TOKENS.containerWidth; // 600

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#1A1F2E]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#1A1F2E] px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white/70">Email Preview</span>
          <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/50">600px wide</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">Exports hero image</span>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              isExporting
                ? 'cursor-not-allowed bg-white/20 text-white/40'
                : 'bg-[#db306a] text-white hover:bg-[#c4285c] active:scale-95'
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
                Export PNG
              </>
            )}
          </button>
          <button
            onClick={handlePushToIterable}
            disabled={pushStatus === 'pushing'}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              pushStatus === 'pushing'  ? 'cursor-not-allowed bg-white/20 text-white/40'
              : pushStatus === 'success' ? 'bg-[#16a34a] text-white'
              : pushStatus === 'error'   ? 'bg-red-500 text-white'
              : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-95'
            }`}
          >
            {pushStatus === 'pushing' ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Pushing…
              </>
            ) : pushStatus === 'success' ? 'Pushed to Iterable ✓'
              : pushStatus === 'error'   ? 'Push failed'
              : 'Push to Iterable'}
          </button>
        </div>
      </div>

      {/* Scrollable preview */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto" style={{ width: W }}>
          <div style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.25)', borderRadius: 4, overflow: 'hidden' }}>
            <EmailTemplate ref={templateRef} tileRef={tileRef} config={emailConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
