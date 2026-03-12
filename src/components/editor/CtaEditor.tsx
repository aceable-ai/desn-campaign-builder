import { useAssetStore } from '../../store/assetStore';

export function CtaEditor() {
  const ctaText    = useAssetStore((s) => s.config.ctaText);
  const showCta    = useAssetStore((s) => s.config.showCta);
  const setCtaText = useAssetStore((s) => s.setCtaText);
  const setShowCta = useAssetStore((s) => s.setShowCta);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          CTA
        </label>
        <button
          onClick={() => setShowCta(!showCta)}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${showCta ? 'bg-indigo-500' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${showCta ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>
      {showCta && (
        <input
          type="text"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          placeholder="e.g. Call to Action!"
        />
      )}
    </div>
  );
}
