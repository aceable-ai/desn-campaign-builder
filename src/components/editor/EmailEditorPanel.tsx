import { useAssetStore } from '../../store/assetStore';
import { useDriveImages } from '../../hooks/useDriveImages';
import { ImageGallery } from './ImageGallery';
import { VerticalSelector } from './VerticalSelector';

export function EmailEditorPanel() {
  const emailConfig          = useAssetStore((s) => s.emailConfig);
  const setEmailVertical     = useAssetStore((s) => s.setEmailVertical);
  const setEmailBannerText   = useAssetStore((s) => s.setEmailBannerText);
  const setEmailHeadline     = useAssetStore((s) => s.setEmailHeadline);
  const setEmailBodyText     = useAssetStore((s) => s.setEmailBodyText);
  const setEmailHighlightText = useAssetStore((s) => s.setEmailHighlightText);
  const setEmailCtaText      = useAssetStore((s) => s.setEmailCtaText);
  const setEmailBullets      = useAssetStore((s) => s.setEmailBullets);
  const setEmailHeroImage    = useAssetStore((s) => s.setEmailHeroImage);

  const { images, loading, error } = useDriveImages();

  function handleBulletsChange(text: string) {
    const bullets = text.split('\n').map((b) => b.trim()).filter(Boolean);
    setEmailBullets(bullets);
  }

  // Sync vertical selector — email has its own vertical
  const paidVertical = useAssetStore((s) => s.config.vertical);

  return (
    <aside className="flex h-full w-[380px] flex-shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-5 py-4">
        <h1 className="text-base font-semibold text-gray-900">Email Builder</h1>
        <p className="text-xs text-gray-500">Configure your campaign email</p>
      </div>

      <div className="flex-1 space-y-5 px-5 py-5">
        {/* Vertical */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Brand / Vertical</label>
          <div className="grid grid-cols-2 gap-2">
            {(['aceable', 'aceable-agent', 'aceable-insurance', 'aceable-mortgage'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setEmailVertical(v)}
                className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all truncate ${
                  emailConfig.vertical === v
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Banner / Eyebrow */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Banner / Eyebrow Text</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            value={emailConfig.bannerText}
            onChange={(e) => setEmailBannerText(e.target.value)}
            placeholder="e.g. Texas Independence Day: 40% off"
          />
          <p className="text-xs text-gray-400">Shown in the blue top banner and above the headline</p>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Headline</label>
          <textarea
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            rows={3}
            value={emailConfig.headline}
            onChange={(e) => setEmailHeadline(e.target.value)}
            placeholder="Main headline…"
          />
        </div>

        {/* Body */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Body Copy</label>
          <textarea
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            rows={3}
            value={emailConfig.bodyText}
            onChange={(e) => setEmailBodyText(e.target.value)}
          />
        </div>

        {/* Highlight */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Highlight / Promo Note</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            value={emailConfig.highlightText}
            onChange={(e) => setEmailHighlightText(e.target.value)}
            placeholder="e.g. Sale ends at midnight — use code FOURTH40"
          />
        </div>

        {/* CTA */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">CTA Button Text</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            value={emailConfig.ctaText}
            onChange={(e) => setEmailCtaText(e.target.value)}
            placeholder="e.g. Claim 40% Off"
          />
          <div className="mt-1">
            <span className="inline-block rounded-full px-4 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: '#db306a' }}>
              {emailConfig.ctaText || 'Claim 40% Off'}
            </span>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Bullets */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Bullet Points</label>
          <textarea
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            rows={6}
            value={emailConfig.bullets.join('\n')}
            onChange={(e) => handleBulletsChange(e.target.value)}
            placeholder="One bullet per line…"
          />
        </div>

        <hr className="border-gray-200" />

        {/* Hero image */}
        <ImageGallery
          label="Hero Image (optional)"
          files={images.objects}
          loading={loading}
          error={error}
          currentSlot={emailConfig.heroImage}
          onSelect={setEmailHeroImage}
        />
      </div>
    </aside>
  );
}
