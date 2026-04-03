import { useState } from 'react';
import { useAirtableQueue } from '../../hooks/useAirtableQueue';
import { useAssetStore } from '../../store/assetStore';
import { getEmailsFromFigma, parseFigmaUrl } from '../../services/figmaApi';
import type { CampaignRecord } from '../../services/airtableApi';

const VERTICAL_LABEL: Record<string, string> = {
  'aceable':           'Drivers Ed',
  'aceable-agent':     'Real Estate',
  'aceable-insurance': 'Insurance',
  'aceable-mortgage':  'Mortgage',
};

const VERTICAL_COLOR: Record<string, string> = {
  'aceable':           'bg-teal-100 text-teal-700',
  'aceable-agent':     'bg-blue-100 text-blue-700',
  'aceable-insurance': 'bg-purple-100 text-purple-700',
  'aceable-mortgage':  'bg-orange-100 text-orange-700',
};

function QueueCard({ record, onLoad }: { record: CampaignRecord; onLoad: (r: CampaignRecord) => void }) {
  const isFromFigma = record.status === 'Figma';
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${VERTICAL_COLOR[record.vertical] ?? 'bg-gray-100 text-gray-600'}`}>
              {VERTICAL_LABEL[record.vertical] ?? record.vertical}
            </span>
            {isFromFigma && (
              <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                Figma
              </span>
            )}
            <span className="truncate text-xs text-gray-400">{record.campaignName}</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">
            {record.headline || <span className="italic text-gray-400">No headline</span>}
          </p>
          {record.bodyCopy && (
            <p className="text-xs text-gray-500 line-clamp-2">{record.bodyCopy}</p>
          )}
        </div>
        <button
          onClick={() => onLoad(record)}
          className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Load into Builder →
        </button>
      </div>
      {(record.ctaCopy || record.subjectLine) && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400 flex-wrap">
          {record.ctaCopy && <span><span className="font-medium text-gray-500">CTA:</span> {record.ctaCopy}</span>}
          {record.subjectLine && <span><span className="font-medium text-gray-500">Banner:</span> {record.subjectLine}</span>}
        </div>
      )}
    </div>
  );
}

function FigmaImporter({ onImport }: { onImport: (records: CampaignRecord[]) => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = !!parseFigmaUrl(url);

  async function handleImport() {
    const apiToken = import.meta.env.VITE_FIGMA_API_TOKEN as string | undefined;
    if (!apiToken) {
      setError('Add VITE_FIGMA_API_TOKEN to your .env file.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const records = await getEmailsFromFigma(url, apiToken);
      onImport(records);
      setUrl('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to import from Figma');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-3">
      <p className="text-xs font-semibold text-gray-500 mb-2">Import from Figma</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }}
          placeholder="Paste Figma frame URL…"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
        />
        <button
          onClick={handleImport}
          disabled={!isValidUrl || loading}
          className="shrink-0 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
        >
          {loading ? 'Importing images…' : 'Import'}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function QueuePanel() {
  const { records: airtableRecords, loading, error, refresh } = useAirtableQueue();
  const [figmaRecords, setFigmaRecords] = useState<CampaignRecord[]>([]);
  const loadEmailFromAirtable = useAssetStore((s) => s.loadEmailFromAirtable);

  const allRecords = [...figmaRecords, ...airtableRecords];

  function handleFigmaImport(records: CampaignRecord[]) {
    setFigmaRecords((prev) => {
      // Replace any existing figma records from the same file, add new ones
      const filtered = prev.filter((r) => !records.some((n) => n.airtableId === r.airtableId));
      return [...records, ...filtered];
    });
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Email Copy Queue</h2>
          <p className="text-xs text-gray-400">
            {loading ? 'Loading…' : `${allRecords.length} email${allRecords.length !== 1 ? 's' : ''} ready to review`}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={loading ? 'animate-spin' : ''}>
            <path d="M10 6A4 4 0 1 1 6 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 2L8 0M6 2L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh Airtable
        </button>
      </div>

      {/* Figma importer */}
      <FigmaImporter onImport={handleFigmaImport} />

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {error && (
          <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            Airtable: {error}
          </div>
        )}
        {loading && allRecords.length === 0 ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : allRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-3 opacity-40">
              <rect x="6" y="8" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16h16M12 22h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-sm font-medium">Queue is empty</p>
            <p className="text-xs mt-1">Paste a Figma link above, or make sure Airtable records have status "Ready".</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {figmaRecords.length > 0 && (
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">From Figma</p>
            )}
            {figmaRecords.map((record) => (
              <QueueCard key={record.airtableId} record={record} onLoad={loadEmailFromAirtable} />
            ))}
            {airtableRecords.length > 0 && (
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mt-2">From Airtable</p>
            )}
            {airtableRecords.map((record) => (
              <QueueCard key={record.airtableId} record={record} onLoad={loadEmailFromAirtable} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
