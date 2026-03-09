import { useRef } from 'react';
import { EditorPanel } from './components/editor/EditorPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { EmailEditorPanel } from './components/editor/EmailEditorPanel';
import { EmailPreviewPanel } from './components/preview/EmailPreviewPanel';
import { useAssetStore } from './store/assetStore';

export default function App() {
  const squareRef    = useRef<HTMLDivElement>(null!);
  const portraitRef  = useRef<HTMLDivElement>(null!);
  const storyRef     = useRef<HTMLDivElement>(null!);
  const landscapeRef = useRef<HTMLDivElement>(null!);

  const mode    = useAssetStore((s) => s.mode);
  const setMode = useAssetStore((s) => s.setMode);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* ── Mode toggle bar ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 bg-white px-4 py-2">
        <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Mode:</span>
        <button
          onClick={() => setMode('paid')}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
            mode === 'paid'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Paid / Organic
        </button>
        <button
          onClick={() => setMode('email')}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
            mode === 'email'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Email
        </button>
      </div>

      {/* ── Split layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {mode === 'paid' ? (
          <>
            <EditorPanel />
            <PreviewPanel
              squareRef={squareRef}
              portraitRef={portraitRef}
              storyRef={storyRef}
              landscapeRef={landscapeRef}
            />
          </>
        ) : (
          <>
            <EmailEditorPanel />
            <EmailPreviewPanel />
          </>
        )}
      </div>
    </div>
  );
}
