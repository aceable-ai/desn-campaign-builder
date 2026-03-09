import { useAssetStore } from '../../store/assetStore';

export function CtaEditor() {
  const ctaText   = useAssetStore((s) => s.config.ctaText);
  const setCtaText = useAssetStore((s) => s.setCtaText);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
        CTA
      </label>
      <input
        type="text"
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        value={ctaText}
        onChange={(e) => setCtaText(e.target.value)}
        placeholder="e.g. Get Started Today!"
      />
    </div>
  );
}
