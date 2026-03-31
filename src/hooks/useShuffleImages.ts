import { useState } from 'react';
import { driveImageToDataUrl } from '../services/driveApi';
import type { DriveFile, ImageSlot } from '../types/asset';

function extractKeywords(text: string): string[] {
  return text.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
}

function pickByKeywords(files: DriveFile[], keywords: string[]): DriveFile {
  const scored = files.map((f) => {
    const name = f.name.toLowerCase();
    const score = keywords.filter((w) => name.includes(w)).length;
    return { file: f, score };
  });
  const maxScore = Math.max(...scored.map((s) => s.score));
  const candidates =
    maxScore > 0 ? scored.filter((s) => s.score === maxScore).map((s) => s.file) : files;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

interface ShuffleSlot {
  category: 'people' | 'course' | 'objects';
  onSelect: (slot: ImageSlot) => void;
}

interface ShuffleParams {
  driveImages: { people: DriveFile[]; course: DriveFile[]; objects: DriveFile[] };
  copyText: string;
  slots: ShuffleSlot[];
}

export function useShuffleImages() {
  const [shuffling, setShuffling] = useState(false);

  async function shuffle({ driveImages, copyText, slots }: ShuffleParams) {
    if (shuffling) return;
    setShuffling(true);
    const keywords = extractKeywords(copyText);
    try {
      await Promise.all(
        slots.map(async ({ category, onSelect }) => {
          const files = driveImages[category];
          if (files.length === 0) return;
          const picked = pickByKeywords(files, keywords);
          const dataUrl = await driveImageToDataUrl(picked.id);
          onSelect({ objectUrl: dataUrl, file: null });
        })
      );
    } finally {
      setShuffling(false);
    }
  }

  return { shuffle, shuffling };
}
