import { VerticalSelector } from './VerticalSelector';
import { HeadlineEditor } from './HeadlineEditor';
import { BodyEditor } from './BodyEditor';
import { CtaEditor } from './CtaEditor';
import { ImageGallery } from './ImageGallery';
import { useDriveImages } from '../../hooks/useDriveImages';
import { useAssetStore } from '../../store/assetStore';

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
