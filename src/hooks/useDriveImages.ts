import { useEffect, useState } from 'react';
import {
  fetchSubfolderIds,
  listDriveImages,
  type SubfolderMap,
} from '../services/driveApi';
import type { DriveFile } from '../types/asset';

export type ImageSlotKey = 'people' | 'course' | 'objects';

interface DriveImagesState {
  subfolders: SubfolderMap | null;
  images: Record<ImageSlotKey, DriveFile[]>;
  loading: boolean;
  error: string | null;
}

export function useDriveImages() {
  const [state, setState] = useState<DriveImagesState>({
    subfolders: null,
    images: { people: [], course: [], objects: [] },
    loading: true,
    error: null,
  });

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      setState((s) => ({
        ...s,
        loading: false,
        error: 'VITE_GOOGLE_API_KEY is not set. Add it to your .env file.',
      }));
      return;
    }

    async function load() {
      try {
        const subfolders = await fetchSubfolderIds();
        const [people, course, objects] = await Promise.all([
          listDriveImages(subfolders.people),
          listDriveImages(subfolders.course),
          listDriveImages(subfolders.objects),
        ]);
        setState({
          subfolders,
          images: { people, course, objects },
          loading: false,
          error: null,
        });
      } catch (err) {
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load Drive images',
        }));
      }
    }

    load();
  }, []);

  return state;
}
