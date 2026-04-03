import { useRef, useState, useEffect } from 'react';
import { EditorPanel } from './components/editor/EditorPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { EmailEditorPanel } from './components/editor/EmailEditorPanel';
import { EmailPreviewPanel } from './components/preview/EmailPreviewPanel';
import { QueuePanel } from './components/queue/QueuePanel';
import { useAssetStore } from './store/assetStore';

type Channel = 'paid' | 'email';

const CHANNELS: { id: Channel; label: string; layouts: string[] }[] = [
  { id: 'paid',  label: 'Paid / Organic', layouts: ['Tiles'] },
  { id: 'email', label: 'Email',          layouts: ['Tiles'] },
];

export default function App() {
  const squareRef    = useRef<HTMLDivElement>(null!);
  const portraitRef  = useRef<HTMLDivElement>(null!);
  const storyRef     = useRef<HTMLDivElement>(null!);
  const landscapeRef = useRef<HTMLDivElement>(null!);

  const mode    = useAssetStore((s) => s.mode);
  const setMode = useAssetStore((s) => s.setMode);

  const [openDropdown, setOpenDropdown] = useState<Channel | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* ── Mode toggle bar ── */}
      <div ref={barRef} className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
        {CHANNELS.map((channel) => (
          <div key={channel.id} className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === channel.id ? null : channel.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                mode === channel.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {channel.label}
              <svg
                width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ transition: 'transform 0.15s', transform: openDropdown === channel.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {openDropdown === channel.id && (
              <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[140px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                {channel.layouts.map((layout) => (
                  <button
                    key={layout}
                    onClick={() => { setMode(channel.id); setOpenDropdown(null); }}
                    className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors hover:bg-gray-50 ${
                      mode === channel.id ? 'font-semibold text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    {layout}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => { setMode('queue'); setOpenDropdown(null); }}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
            mode === 'queue'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="2" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M3 5h6M3 7.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Copy Queue
        </button>
      </div>

      {/* ── Split layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {mode === 'queue' ? (
          <QueuePanel />
        ) : mode === 'paid' ? (
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
