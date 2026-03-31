import { VerticalSelector } from './VerticalSelector';
import { HeadlineEditor } from './HeadlineEditor';
import { BodyEditor } from './BodyEditor';
import { CtaEditor } from './CtaEditor';
import { ImageGallery } from './ImageGallery';
import { useDriveImages } from '../../hooks/useDriveImages';
import { useAssetStore } from '../../store/assetStore';
import { useShuffleImages } from '../../hooks/useShuffleImages';

export function EditorPanel() {
  const { images, loading, error } = useDriveImages();
  const setPersonImage = useAssetStore((s) => s.setPersonImage);
  const setCourseImage = useAssetStore((s) => s.setCourseImage);
  const setThemeImage = useAssetStore((s) => s.setThemeImage);
  const setPersonColor = useAssetStore((s) => s.setPersonColor);
  const setCourseColor = useAssetStore((s) => s.setCourseColor);
  const setThemeColor = useAssetStore((s) => s.setThemeColor);
  const setThemeAlignH = useAssetStore((s) => s.setThemeAlignH);
  const setThemeAlignV = useAssetStore((s) => s.setThemeAlignV);
  const personImage = useAssetStore((s) => s.config.images.person);
  const courseImage = useAssetStore((s) => s.config.images.course);
  const themeImage = useAssetStore((s) => s.config.images.theme);
  const imageColors = useAssetStore((s) => s.config.imageColors);
  const themeAlignH = useAssetStore((s) => s.config.themeAlignH);
  const themeAlignV = useAssetStore((s) => s.config.themeAlignV);
  const headlineRaw = useAssetStore((s) => s.headlineRaw);
  const bodyText    = useAssetStore((s) => s.config.bodyText);

  const { shuffle, shuffling } = useShuffleImages();

  function handleShuffle() {
    const copyText = [headlineRaw, bodyText].join(' ');
    shuffle({
      driveImages: images,
      copyText,
      slots: [
        { category: 'people',  onSelect: setPersonImage },
        { category: 'course',  onSelect: setCourseImage },
        { category: 'objects', onSelect: setThemeImage  },
      ],
    });
  }

  return (
    <aside className="flex h-full w-[380px] flex-shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-5 py-4">
        <h1 className="text-base font-semibold text-gray-900">Campaign Builder</h1>
        <p className="text-xs text-gray-500">Configure once, export all 4 sizes</p>
      </div>

      {/* Form fields */}
      <div className="flex-1 space-y-6 px-5 py-5">
        <VerticalSelector />
        <hr className="border-gray-200" />
        <HeadlineEditor />
        <BodyEditor />
        <CtaEditor />
        <hr className="border-gray-200" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Images</span>
          <button
            onClick={handleShuffle}
            disabled={shuffling || loading || !!error}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {shuffling ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h5l3 3-3 3H4M20 20h-5l-3-3 3-3h5M4 20h5l8-8-3-3" />
              </svg>
            )}
            {shuffling ? 'Shuffling…' : 'Shuffle Images'}
          </button>
        </div>

        <ImageGallery
          label="Person Image"
          files={images.people}
          loading={loading}
          error={error}
          currentSlot={personImage}
          onSelect={setPersonImage}
          selectedColor={imageColors.person}
          onColorChange={setPersonColor}
          filterTags={['adult', 'key', 'license', 'female', 'group', 'halftone', 'laptop', 'male', 'parent', 'phone', 'tablet', 'teen']}
        />

        <ImageGallery
          label="Course Image"
          files={images.course}
          loading={loading}
          error={error}
          currentSlot={courseImage}
          onSelect={setCourseImage}
          selectedColor={imageColors.course}
          onColorChange={setCourseColor}
          filterTags={['halftone', 'laptop', 'left', 'no device', 'phone', 'right', 'tablet']}
        />

        <ImageGallery
          label="Object Image"
          files={images.objects}
          loading={loading}
          error={error}
          currentSlot={themeImage}
          onSelect={setThemeImage}
          searchable
          selectedColor={imageColors.theme}
          onColorChange={setThemeColor}
          alignH={themeAlignH}
          alignV={themeAlignV}
          onAlignHChange={setThemeAlignH}
          onAlignVChange={setThemeAlignV}
        />
      </div>
    </aside>
  );
}
