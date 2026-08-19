import { generateCoverArt } from './music-utils';

export interface ExtractedMetadata {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  cover?: string;
}

export function parseFilename(filename: string): { artist: string; title: string } {
  // Remove file extension
  const cleanName = filename.replace(/\.[^/.]+$/, '').trim();

  // Pattern: "Artist - Title" or "Artist-Title"
  if (cleanName.includes(' - ')) {
    const parts = cleanName.split(' - ');
    const artist = parts[0].trim() || 'Unknown Artist';
    const title = parts.slice(1).join(' - ').trim() || cleanName;
    return { artist, title };
  } else if (cleanName.includes('-')) {
    const parts = cleanName.split('-');
    const artist = parts[0].trim() || 'Unknown Artist';
    const title = parts.slice(1).join('-').trim() || cleanName;
    return { artist, title };
  }

  // Fallback: title is filename, artist is Unknown Artist
  return {
    artist: 'Kelly’s Study Library',
    title: cleanName || 'Untitled Track'
  };
}

export async function extractAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve) => {
    try {
      const audio = document.createElement('audio');
      const url = URL.createObjectURL(blob);
      audio.src = url;
      audio.preload = 'metadata';

      const cleanup = () => {
        URL.revokeObjectURL(url);
        audio.remove();
      };

      audio.onloadedmetadata = () => {
        const duration = isFinite(audio.duration) ? Math.round(audio.duration) : 180;
        cleanup();
        resolve(duration);
      };

      audio.onerror = () => {
        cleanup();
        resolve(180); // Default estimate if unable to parse in browser sandbox
      };

      // Safety timeout
      setTimeout(() => {
        cleanup();
        resolve(180);
      }, 2000);
    } catch {
      resolve(180);
    }
  });
}

export async function extractMetadataFromFile(file: File): Promise<ExtractedMetadata> {
  const { artist, title } = parseFilename(file.name);
  const duration = await extractAudioDuration(file);
  const cover = generateCoverArt(title, artist);

  return {
    title,
    artist,
    album: 'Kelly Tham Workspace Collection',
    genre: 'Lo-Fi / Study & Focus',
    duration,
    cover
  };
}
