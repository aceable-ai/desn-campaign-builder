import { useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { useDriveImages } from '../../hooks/useDriveImages';
import { ImageGallery } from './ImageGallery';
import { VerticalSelector } from './VerticalSelector';
import type { HeroTileCount, TileAlignment } from '../../types/email';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${on ? 'bg-indigo-500' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

export function EmailEditorPanel() {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [heroOpen,   setHeroOpen]   = useState(true);
  const [bodyOpen,   setBodyOpen]   = useState(true);

  const emailConfig               = useAssetStore((s) => s.emailConfig);
  const emailHeadlineWords        = useAssetStore((s) => s.emailHeadlineWords);
  const emailHeadlineRaw          = useAssetStore((s) => s.emailHeadlineRaw);

  const setEmailVertical          = useAssetStore((s) => s.setEmailVertical);
  const setEmailBannerColor       = useAssetStore((s) => s.setEmailBannerColor);
  const setEmailBannerSaleName    = useAssetStore((s) => s.setEmailBannerSaleName);
  const setEmailBannerDiscount    = useAssetStore((s) => s.setEmailBannerDiscount);
  const setEmailBannerEmoji       = useAssetStore((s) => s.setEmailBannerEmoji);
  const setEmailHeaderColorScheme = useAssetStore((s) => s.setEmailHeaderColorScheme);

  const setEmailHeroAlignment     = useAssetStore((s) => s.setEmailHeroAlignment);
  const setEmailShowEyebrow       = useAssetStore((s) => s.setEmailShowEyebrow);
  const setEmailEyebrowText       = useAssetStore((s) => s.setEmailEyebrowText);
  const setEmailHeadlineRaw       = useAssetStore((s) => s.setEmailHeadlineRaw);
  const toggleEmailWordHighlight  = useAssetStore((s) => s.toggleEmailWordHighlight);
  const setEmailShowBody          = useAssetStore((s) => s.setEmailShowBody);
  const setEmailBodyText          = useAssetStore((s) => s.setEmailBodyText);
  const setEmailShowHighlight     = useAssetStore((s) => s.setEmailShowHighlight);
  const setEmailHighlightText     = useAssetStore((s) => s.setEmailHighlightText);
  const setEmailShowReviews       = useAssetStore((s) => s.setEmailShowReviews);
  const setEmailShowCta           = useAssetStore((s) => s.setEmailShowCta);
  const setEmailCtaText           = useAssetStore((s) => s.setEmailCtaText);
  const setEmailShowSecondaryHeadline = useAssetStore((s) => s.setEmailShowSecondaryHeadline);
  const setEmailSecondaryHeadlineText = useAssetStore((s) => s.setEmailSecondaryHeadlineText);
  const setEmailBodySectionText       = useAssetStore((s) => s.setEmailBodySectionText);
  const setEmailShowBodyCta           = useAssetStore((s) => s.setEmailShowBodyCta);
  const setEmailBodyCtaStyle          = useAssetStore((s) => s.setEmailBodyCtaStyle);
  const setEmailBodyCtaText           = useAssetStore((s) => s.setEmailBodyCtaText);
  const setEmailHeroTileCount     = useAssetStore((s) => s.setEmailHeroTileCount);
  const setEmailTileColor         = useAssetStore((s) => s.setEmailTileColor);
  const setEmailTileImage         = useAssetStore((s) => s.setEmailTileImage);
  const setEmailTileTag           = useAssetStore((s) => s.setEmailTileTag);
  const setEmailTileAlignment     = useAssetStore((s) => s.setEmailTileAlignment);
  const setEmailShowAppBanner     = useAssetStore((s) => s.setEmailShowAppBanner);
  const setEmailAppBannerText     = useAssetStore((s) => s.setEmailAppBannerText);
  const setEmailShowAwardsBanner  = useAssetStore((s) => s.setEmailShowAwardsBanner);
  const setEmailAwardsBannerStyle = useAssetStore((s) => s.setEmailAwardsBannerStyle);

  const { images, loading, error } = useDriveImages();

  return (
    <aside className="flex h-full w-[380px] flex-shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-5 py-4">
        <h1 className="text-base font-semibold text-gray-900">Email Builder</h1>
        <p className="text-xs text-gray-500">Design and preview your email</p>
      </div>

      <div className="flex-1 space-y-5 px-5 py-5">
        {/* Vertical */}
        <VerticalSelector value={emailConfig.vertical} onChange={setEmailVertical} />

        {/* Header Color Scheme */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Color Scheme</label>
          <div className="grid grid-cols-2 gap-2">
            {(['light', 'dark'] as const).map((scheme) => (
              <button
                key={scheme}
                onClick={() => setEmailHeaderColorScheme(scheme)}
                className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all capitalize ${
                  emailConfig.headerColorScheme === scheme
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {scheme === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setBannerOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Banner</span>
            <svg className={`h-4 w-4 text-gray-400 transition-transform ${bannerOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>

          {bannerOpen && (
            <div className="space-y-3 border-t border-gray-100 px-4 pb-4 pt-3">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Color</label>
                <div className="flex gap-2">
                  {['#71D7E1', '#DB306A', '#2689CA', '#2CE1AB'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setEmailBannerColor(color)}
                      style={{ backgroundColor: color }}
                      className={`h-8 w-8 rounded-full transition-all ${emailConfig.bannerColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Emoji <span className="font-normal normal-case tracking-normal text-gray-400">(tip: Ctrl+Cmd+Space on Mac)</span></label>
                <input
                  type="text"
                  className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xl shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  value={emailConfig.bannerEmoji}
                  onChange={(e) => setEmailBannerEmoji(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Sale Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  value={emailConfig.bannerSaleName}
                  onChange={(e) => setEmailBannerSaleName(e.target.value)}
                  placeholder="e.g. Sale Name Goes Here"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Discount</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  value={emailConfig.bannerDiscount}
                  onChange={(e) => setEmailBannerDiscount(e.target.value)}
                  placeholder="e.g. XX% off courses"
                />
              </div>
            </div>
          )}
        </div>

        {/* Hero Copy */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setHeroOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Hero Copy</span>
            <svg className={`h-4 w-4 text-gray-400 transition-transform ${heroOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>

          {heroOpen && (
            <div className="space-y-4 border-t border-gray-100 px-4 pb-4 pt-3">

              {/* Alignment */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Alignment</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['left', 'center'] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => setEmailHeroAlignment(a)}
                      className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all capitalize ${
                        emailConfig.heroAlignment === a
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {a === 'left' ? 'Left' : 'Center'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eyebrow */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Eyebrow</label>
                  <Toggle on={emailConfig.showEyebrow} onToggle={() => setEmailShowEyebrow(!emailConfig.showEyebrow)} />
                </div>
                {emailConfig.showEyebrow && (
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={emailConfig.eyebrowText}
                    onChange={(e) => setEmailEyebrowText(e.target.value)}
                    placeholder="e.g. Highlight Text Goes Here"
                  />
                )}
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Headline</label>
                <textarea
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  rows={2}
                  value={emailHeadlineRaw}
                  onChange={(e) => setEmailHeadlineRaw(e.target.value)}
                  placeholder="Type your headline…"
                />
                {emailHeadlineWords.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-400">Click words to highlight in pink:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {emailHeadlineWords.map((word, i) => (
                        <button
                          key={`${word.text}-${i}`}
                          onClick={() => toggleEmailWordHighlight(i)}
                          className={`rounded px-2 py-0.5 text-sm transition-all bg-gray-100 hover:bg-gray-200 ${
                            word.highlighted ? 'font-bold' : 'font-medium text-gray-700'
                          }`}
                          style={word.highlighted ? { color: '#DB306A' } : {}}
                        >
                          {word.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Body Copy */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Supporting Line</label>
                  <Toggle on={emailConfig.showBody} onToggle={() => setEmailShowBody(!emailConfig.showBody)} />
                </div>
                {emailConfig.showBody && (
                  <textarea
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    rows={3}
                    value={emailConfig.bodyText}
                    onChange={(e) => setEmailBodyText(e.target.value)}
                  />
                )}
              </div>

              {/* Promo Highlight */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Promo Highlight</label>
                  <Toggle on={emailConfig.showHighlight} onToggle={() => setEmailShowHighlight(!emailConfig.showHighlight)} />
                </div>
                {emailConfig.showHighlight && (
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={emailConfig.highlightText}
                    onChange={(e) => setEmailHighlightText(e.target.value)}
                    placeholder="e.g. Promo Highlight Goes Here"
                  />
                )}
              </div>

              {/* Reviews */}
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Reviews Widget</label>
                <Toggle on={emailConfig.showReviews} onToggle={() => setEmailShowReviews(!emailConfig.showReviews)} />
              </div>

              {/* CTA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">CTA Button</label>
                  <Toggle on={emailConfig.showCta} onToggle={() => setEmailShowCta(!emailConfig.showCta)} />
                </div>
                {emailConfig.showCta && (
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={emailConfig.ctaText}
                    onChange={(e) => setEmailCtaText(e.target.value)}
                    placeholder="e.g. Call to Action"
                  />
                )}
              </div>

            </div>
          )}
        </div>

        {/* Hero Image */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Hero Image</label>
            <div className="grid grid-cols-3 gap-1.5">
              {([2, 3, 4] as HeroTileCount[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setEmailHeroTileCount(n)}
                  className={`rounded-lg border-2 px-2 py-1 text-xs font-medium transition-all ${
                    emailConfig.heroTileCount === n
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {n} Tiles
                </button>
              ))}
            </div>
          </div>

          {emailConfig.heroTileCount === 2 && (
            <div className="space-y-3">
              {([
                { id: 't1' as const, label: 'Tile 1', files: images.people,  searchable: false, filterTags: ['adult', 'key', 'license', 'female', 'group', 'halftone', 'laptop', 'male', 'parent', 'phone', 'tablet', 'teen'] as string[] },
                { id: 't2' as const, label: 'Tile 2', files: images.people,  searchable: false, filterTags: ['adult', 'key', 'license', 'female', 'group', 'halftone', 'laptop', 'male', 'parent', 'phone', 'tablet', 'teen'] as string[] },
              ]).map(({ id, label, files, searchable, filterTags }) => {
                const tag = emailConfig.tileTags[id];
                return (
                  <ImageGallery key={id} label={label} files={files} loading={loading} error={error}
                    currentSlot={emailConfig.tileImages[id]} onSelect={(s) => setEmailTileImage(id, s)}
                    selectedColor={emailConfig.tileColors[id]} onColorChange={(c) => setEmailTileColor(id, c)}
                    searchable={searchable}
                    filterTags={filterTags}
                    footer={
                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tag</span>
                          <Toggle on={tag.show} onToggle={() => setEmailTileTag(id, { ...tag, show: !tag.show })} />
                        </div>
                        {tag.show && (
                          <input type="text"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            value={tag.text} onChange={(e) => setEmailTileTag(id, { ...tag, text: e.target.value })}
                            placeholder="e.g. Over 1M Customers Served"
                          />
                        )}
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}

          {emailConfig.heroTileCount === 3 && (
            <div className="space-y-3">
              {([
                { id: 't1' as const, label: 'Tile 1', files: images.people,  searchable: false, filterTags: ['adult', 'key', 'license', 'female', 'group', 'halftone', 'laptop', 'male', 'parent', 'phone', 'tablet', 'teen'] as string[], isObject: false },
                { id: 't2' as const, label: 'Tile 2', files: images.course,  searchable: false, filterTags: ['halftone', 'laptop', 'left', 'no device', 'phone', 'right', 'tablet'] as string[], isObject: false },
                { id: 't3' as const, label: 'Tile 3', files: images.objects, searchable: true,  filterTags: undefined, isObject: true  },
              ]).map(({ id, label, files, searchable, filterTags, isObject }) => {
                const tag = emailConfig.tileTags[id];
                return (
                  <ImageGallery key={id} label={label} files={files} loading={loading} error={error}
                    currentSlot={emailConfig.tileImages[id]} onSelect={(s) => setEmailTileImage(id, s)}
                    selectedColor={emailConfig.tileColors[id]} onColorChange={(c) => setEmailTileColor(id, c)}
                    searchable={searchable}
                    filterTags={filterTags}
                    {...(isObject ? {
                      alignH: emailConfig.tileAlignments[id].h,
                      alignV: emailConfig.tileAlignments[id].v,
                      onAlignHChange: (h: TileAlignment['h']) => setEmailTileAlignment(id, { ...emailConfig.tileAlignments[id], h }),
                      onAlignVChange: (v: TileAlignment['v']) => setEmailTileAlignment(id, { ...emailConfig.tileAlignments[id], v }),
                    } : {})}
                    footer={
                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tag</span>
                          <Toggle on={tag.show} onToggle={() => setEmailTileTag(id, { ...tag, show: !tag.show })} />
                        </div>
                        {tag.show && (
                          <input type="text"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            value={tag.text} onChange={(e) => setEmailTileTag(id, { ...tag, text: e.target.value })}
                            placeholder="e.g. Over 1M Customers Served"
                          />
                        )}
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}

          {emailConfig.heroTileCount === 4 && (
            <div className="space-y-3">
              {([
                { id: 't1' as const, label: 'Tile 1', files: images.people,  searchable: false, filterTags: ['adult', 'key', 'license', 'female', 'group', 'halftone', 'laptop', 'male', 'parent', 'phone', 'tablet', 'teen'] as string[], isObject: false },
                { id: 't2' as const, label: 'Tile 2', files: images.course,  searchable: false, filterTags: ['halftone', 'laptop', 'left', 'no device', 'phone', 'right', 'tablet'] as string[], isObject: false },
                { id: 't3' as const, label: 'Tile 3', files: images.objects, searchable: true,  filterTags: undefined, isObject: true  },
                { id: 't4' as const, label: 'Tile 4', files: images.objects, searchable: true,  filterTags: undefined, isObject: true  },
              ]).map(({ id, label, files, searchable, filterTags, isObject }) => {
                const tag = emailConfig.tileTags[id];
                return (
                  <ImageGallery key={id} label={label} files={files} loading={loading} error={error}
                    currentSlot={emailConfig.tileImages[id]} onSelect={(s) => setEmailTileImage(id, s)}
                    selectedColor={emailConfig.tileColors[id]} onColorChange={(c) => setEmailTileColor(id, c)}
                    searchable={searchable}
                    filterTags={filterTags}
                    {...(isObject ? {
                      alignH: emailConfig.tileAlignments[id].h,
                      alignV: emailConfig.tileAlignments[id].v,
                      onAlignHChange: (h: TileAlignment['h']) => setEmailTileAlignment(id, { ...emailConfig.tileAlignments[id], h }),
                      onAlignVChange: (v: TileAlignment['v']) => setEmailTileAlignment(id, { ...emailConfig.tileAlignments[id], v }),
                    } : {})}
                    footer={
                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tag</span>
                          <Toggle on={tag.show} onToggle={() => setEmailTileTag(id, { ...tag, show: !tag.show })} />
                        </div>
                        {tag.show && (
                          <input type="text"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            value={tag.text} onChange={(e) => setEmailTileTag(id, { ...tag, text: e.target.value })}
                            placeholder="e.g. Over 1M Customers Served"
                          />
                        )}
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* App Download Banner */}
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">App Download Banner</span>
            <Toggle on={emailConfig.showAppBanner} onToggle={() => setEmailShowAppBanner(!emailConfig.showAppBanner)} />
          </div>
          {emailConfig.showAppBanner && (
            <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Text</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                value={emailConfig.appBannerText}
                onChange={(e) => setEmailAppBannerText(e.target.value)}
                placeholder="e.g. Download the Aceable Agent App:"
              />
            </div>
          )}
        </div>

        {/* Body Section */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setBodyOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Body</span>
            <svg className={`h-4 w-4 text-gray-400 transition-transform ${bodyOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {bodyOpen && <div className="space-y-4 border-t border-gray-100 px-4 pb-4 pt-3">

            {/* Secondary Headline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Secondary Headline</label>
                <Toggle on={emailConfig.showSecondaryHeadline} onToggle={() => setEmailShowSecondaryHeadline(!emailConfig.showSecondaryHeadline)} />
              </div>
              {emailConfig.showSecondaryHeadline && (
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  value={emailConfig.secondaryHeadlineText}
                  onChange={(e) => setEmailSecondaryHeadlineText(e.target.value)}
                  placeholder="e.g. Why Aceable?"
                />
              )}
            </div>

            {/* Body Copy */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Body Copy</label>
              <textarea
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                rows={4}
                value={emailConfig.bodySectionText}
                onChange={(e) => setEmailBodySectionText(e.target.value)}
                placeholder="Body copy…"
              />
            </div>

            {/* CTA Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">CTA Button</label>
                <Toggle on={emailConfig.showBodyCta} onToggle={() => setEmailShowBodyCta(!emailConfig.showBodyCta)} />
              </div>
              {emailConfig.showBodyCta && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {(['primary', 'secondary'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setEmailBodyCtaStyle(style)}
                        className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all capitalize ${
                          emailConfig.bodyCtaStyle === style
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {style === 'primary' ? 'Primary' : 'Secondary'}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={emailConfig.bodyCtaText}
                    onChange={(e) => setEmailBodyCtaText(e.target.value)}
                    placeholder="e.g. Get Started Today"
                  />
                </>
              )}
            </div>

          </div>}
        </div>

        {/* Awards Banner */}
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Awards Banner</span>
            <Toggle on={emailConfig.showAwardsBanner} onToggle={() => setEmailShowAwardsBanner(!emailConfig.showAwardsBanner)} />
          </div>
          {emailConfig.showAwardsBanner && (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
              {(['newsweek', 'all-awards'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setEmailAwardsBannerStyle(style)}
                  className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all ${
                    emailConfig.awardsBannerStyle === style
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {style === 'newsweek' ? 'Newsweek' : 'All Awards'}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
