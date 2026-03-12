import { useAssetStore } from '../../store/assetStore';

export function BodyEditor() {
  const bodyText    = useAssetStore((s) => s.config.bodyText);
  const showBody    = useAssetStore((s) => s.config.showBody);
  const setBodyText = useAssetStore((s) => s.setBodyText);
  const setShowBody = useAssetStore((s) => s.setShowBody);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Supporting Line
        </label>
        <button
          onClick={() => setShowBody(!showBody)}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${showBody ? 'bg-indigo-500' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${showBody ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>
      {showBody && (
        <textarea
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          rows={3}
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          placeholder="Supporting body text…"
        />
      )}
    </div>
  );
}
