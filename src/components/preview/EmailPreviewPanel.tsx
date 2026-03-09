import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useAssetStore } from '../../store/assetStore';
import { EmailTemplate } from './templates/EmailTemplate';
import { EMAIL_TOKENS } from '../../constants/sizes';

export function EmailPreviewPanel() {
  const emailConfig = useAssetStore((s) => s.emailConfig);
  const [isExporting, setIsExporting] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  async function handleExport() {
    if (isExporting || !templateRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(templateRef.current, { style: { transform: 'none' }, cacheBust: true });
      const a = document.createElement('a');
      a.href = dataUrl;
      const today = new Date().toISOString().slice(0, 10);
      a.download = `email_${emailConfig.vertical}_${today}.png`;
      a.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed — check the console.');
    } finally {
      setIsExporting(false);
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
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
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
      </div>

      {/* Scrollable preview */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto" style={{ width: W }}>
          <div style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.25)', borderRadius: 4, overflow: 'hidden' }}>
            <EmailTemplate ref={templateRef} config={emailConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
