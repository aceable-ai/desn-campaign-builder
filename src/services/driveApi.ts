import type { DriveFile } from '../types/asset';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string;
const ROOT_FOLDER_ID = '1bLr-fnyNEGjnLqzQDzQcsU82M2ZcvtpL';

const BASE = 'https://www.googleapis.com/drive/v3';

export interface SubfolderMap {
  people: string;
  course: string;
  objects: string;
}

/**
 * Fetches all subfolders of the root Drive folder and maps them by name.
 * Expects subfolders named "People", "Course", "Objects" (case-insensitive).
 */
export async function fetchSubfolderIds(): Promise<SubfolderMap> {
  const q = encodeURIComponent(
    `'${ROOT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder'`
  );
  const res = await fetch(`${BASE}/files?q=${q}&key=${API_KEY}&fields=files(id,name)`);
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  const data: { files: DriveFile[] } = await res.json();

  const map: Partial<SubfolderMap> = {};
  for (const folder of data.files) {
    const name = folder.name.toLowerCase();
    if (name === 'people') map.people = folder.id;
    else if (name === 'course') map.course = folder.id;
    else if (name === 'objects') map.objects = folder.id;
  }

  if (!map.people || !map.course || !map.objects) {
    throw new Error('Could not find all 3 subfolders (People, Course, Objects) in Drive.');
  }

  return map as SubfolderMap;
}

/**
 * Lists image files in a Drive subfolder.
 * Returns files with id, name, and thumbnailLink.
 */
export async function listDriveImages(folderId: string): Promise<DriveFile[]> {
  const q = encodeURIComponent(
    `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`
  );
  const res = await fetch(
    `${BASE}/files?q=${q}&key=${API_KEY}&fields=files(id,name,thumbnailLink)&pageSize=100`
  );
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  const data: { files: DriveFile[] } = await res.json();
  return data.files;
}

/**
 * Downloads a Drive file and converts it to a base64 data URL.
 * Base64 avoids CORS issues when html-to-image captures the canvas.
 */
export async function driveImageToDataUrl(fileId: string): Promise<string> {
  const res = await fetch(`${BASE}/files/${fileId}?alt=media&key=${API_KEY}`);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a thumbnail link to a usable URL (Drive thumbnail links have a built-in size param).
 * Enlarges to a reasonable grid thumbnail size.
 */
export function enlargeThumbnailUrl(thumbnailLink: string): string {
  return thumbnailLink.replace(/=s\d+$/, '=s200');
}
