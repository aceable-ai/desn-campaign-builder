import { useAssetStore } from '../../store/assetStore';

export function HeadlineEditor() {
  const campaignLabel       = useAssetStore((s) => s.config.campaignLabel);
  const showEyebrow         = useAssetStore((s) => s.config.showEyebrow);
  const headlineRaw         = useAssetStore((s) => s.headlineRaw);
  const headlineWords       = useAssetStore((s) => s.headlineWords);
  const setCampaignLabel    = useAssetStore((s) => s.setCampaignLabel);
  const setShowEyebrow      = useAssetStore((s) => s.setShowEyebrow);
  const setHeadlineRaw      = useAssetStore((s) => s.setHeadlineRaw);
  const toggleWordHighlight = useAssetStore((s) => s.toggleWordHighlight);

  return (
    <div className="space-y-4">
      {/* Eyebrow */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Eyebrow
          </label>
          <button
            onClick={() => setShowEyebrow(!showEyebrow)}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${showEyebrow ? 'bg-indigo-500' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${showEyebrow ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>
        {showEyebrow && (
          <input
            type="text"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            value={campaignLabel}
            onChange={(e) => setCampaignLabel(e.target.value)}
            placeholder="e.g. Texas Independence Day Sale"
          />
        )}
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Headline
        </label>
        <textarea
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          rows={3}
          value={headlineRaw}
          onChange={(e) => setHeadlineRaw(e.target.value)}
          placeholder="Type your headline…"
        />

        {headlineWords.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">Click words to highlight in pink:</p>
            <div className="flex flex-wrap gap-1.5">
              {headlineWords.map((word, i) => (
                <button
                  key={`${word.text}-${i}`}
                  onClick={() => toggleWordHighlight(i)}
                  className={`rounded px-2 py-0.5 text-sm font-medium transition-all ${
                    word.highlighted
                      ? 'ring-1 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={word.highlighted ? { backgroundColor: '#db306a' } : {}}
                >
                  {word.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
