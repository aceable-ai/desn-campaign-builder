import { useState, useMemo } from 'react';
import type { DriveFile, ImageSlot } from '../../types/asset';
import { driveImageToDataUrl, enlargeThumbnailUrl } from '../../services/driveApi';

const COLOR_PALETTE = ['#CCF3F7', '#FFE299', '#CAD9F7', '#DBCBFF', '#F9C5C5', '#FFD1A6', '#B6EAD3'];

interface Props {
  label: string;
  files: DriveFile[];
  loading: boolean;
  error: string | null;
  currentSlot: ImageSlot;
  onSelect: (slot: ImageSlot) => void;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  filterTags?: string[];
  searchable?: boolean;
}

export function ImageGallery({ label, files, loading, error, currentSlot, onSelect, selectedColor, onColorChange, filterTags, searchable }: Props) {
  const [open, setOpen] = useState(false);
  const [fetchingId, setFetchingId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  function toggleFilter(tag: string) {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const visibleFiles = useMemo(() => {
    const filtered = searchable
      ? files.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : activeFilters.length === 0
      ? files
      : files.filter((f) =>
          activeFilters.every((tag) => f.name.toLowerCase().includes(tag.toLowerCase()))
        );
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [files, activeFilters, searchQuery, searchable]);

  async function handleSelect(file: DriveFile) {
    if (fetchingId) return;
    setFetchingId(file.id);
    try {
      const dataUrl = await driveImageToDataUrl(file.id);
      onSelect({ objectUrl: dataUrl, file: null });
    } catch (err) {
      console.error('Failed to load image', err);
    } finally {
      setFetchingId(null);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
          {currentSlot.objectUrl && (
            <img
              src={currentSlot.objectUrl}
              alt="Selected"
              className="h-5 w-5 rounded object-cover ring-1 ring-indigo-400"
            />
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Color swatches — always visible when color selection is enabled */}
      {selectedColor !== undefined && onColorChange !== undefined && (
        <div className="flex items-center gap-1.5 px-4 pb-3">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              title={color}
              onClick={() => onColorChange(color)}
              style={{ backgroundColor: color }}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                selectedColor.toUpperCase() === color ? 'border-gray-700 scale-110' : 'border-transparent'
              }`}
            />
          ))}
        </div>
      )}

      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          {/* Selected image preview */}
          {currentSlot.objectUrl && (
            <div className="relative h-20 w-20 overflow-hidden rounded-lg border-2 border-indigo-400">
              <img src={currentSlot.objectUrl} alt="Selected" className="h-full w-full object-cover" />
              <button
                className="absolute right-0.5 top-0.5 rounded bg-black/50 px-1 text-xs text-white"
                onClick={() => onSelect({ objectUrl: null, file: null })}
              >
                ✕
              </button>
            </div>
          )}

          {/* Search bar */}
          {searchable && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search objects…"
                className="w-full rounded-lg border border-gray-200 py-1.5 pl-8 pr-8 text-xs text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
              />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
              )}
            </div>
          )}

          {/* Filter tags */}
          {!searchable && filterTags && filterTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {filterTags.map((tag) => {
                const active = activeFilters.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleFilter(tag)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-400 hover:text-gray-600"
                >
                  clear
                </button>
              )}
            </div>
          )}

          {loading && <p className="text-xs text-gray-400">Loading images from Drive…</p>}
          {error && <div className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700">{error}</div>}
          {!loading && !error && visibleFiles.length === 0 && (
            <p className="text-xs text-gray-400">
              {searchable && searchQuery ? 'No images match your search.' : activeFilters.length > 0 ? 'No images match the selected filters.' : 'No images found in this folder.'}
            </p>
          )}

          {/* Name list */}
          {visibleFiles.length > 0 && (
            <ul className="max-h-48 overflow-y-auto divide-y divide-gray-100 rounded-lg border border-gray-200">
              {visibleFiles.map((file) => {
                const isLoading = fetchingId === file.id;
                return (
                  <li key={file.id}>
                    <button
                      onClick={() => handleSelect(file)}
                      disabled={!!fetchingId}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-indigo-50 disabled:opacity-50 ${isLoading ? 'bg-indigo-50' : ''}`}
                    >
                      {isLoading ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent flex-shrink-0" />
                      ) : (
                        <span className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <span className="truncate text-gray-700">{file.name.replace(/\.[^.]+$/, '')}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
