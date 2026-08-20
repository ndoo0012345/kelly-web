import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { MusicTrack, Playlist, RepeatMode } from '../types';
import { musicPlayer } from './music-player';
import { musicDB } from './music-db';
import { extractMetadataFromFile } from './music-metadata';
import { generateCoverArt } from './music-utils';

const VINYL_COVER_STORAGE_KEY = 'kelly_custom_vinyl_cover_v2';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  library: MusicTrack[];
  playlists: Playlist[];
  isLoading: boolean;
  customVinylImage: string | null;
  setCustomVinylImage: (url: string | null) => void;
  uploadVinylImage: (file: File) => Promise<string>;
  uploadTrackCover: (trackId: string, file: File) => Promise<string>;
  updateTrackCover: (trackId: string, coverUrl: string) => Promise<void>;
  resetVinylImage: () => void;
  refreshLibrary: () => Promise<void>;
  playTrack: (track: MusicTrack, newQueue?: MusicTrack[], startAtSeconds?: number) => Promise<void>;
  togglePlayPause: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  next: () => void;
  previous: () => void;
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  toggleFavorite: (trackId: string) => Promise<void>;
  deleteTrack: (trackId: string) => Promise<void>;
  updateMetadata: (track: MusicTrack) => Promise<void>;
  updateTrackMetadata: (track: MusicTrack) => Promise<void>;
  uploadFiles: (files: FileList | File[]) => Promise<MusicTrack[]>;
  importFiles: (files: FileList | File[]) => Promise<{ addedCount: number; errors: string[] }>;
  createPlaylist: (name: string, description?: string) => Promise<Playlist>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  seedDefaultTracks: () => Promise<void>;
  saveProgress: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerState, setPlayerState] = useState(() => musicPlayer.getState());
  const [library, setLibrary] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customVinylImage, setCustomVinylImageState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(VINYL_COVER_STORAGE_KEY) || null;
  });
  const isRestoredRef = useRef(false);

  const setCustomVinylImage = (url: string | null) => {
    setCustomVinylImageState(url);
    if (url) {
      localStorage.setItem(VINYL_COVER_STORAGE_KEY, url);
    } else {
      localStorage.removeItem(VINYL_COVER_STORAGE_KEY);
    }
  };

  const uploadVinylImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setCustomVinylImage(result);
          resolve(result);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading image file'));
      reader.readAsDataURL(file);
    });
  };

  const uploadTrackCover = async (trackId: string, file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        if (result) {
          await updateTrackCover(trackId, result);
          resolve(result);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading image file'));
      reader.readAsDataURL(file);
    });
  };

  const updateTrackCover = async (trackId: string, coverUrl: string): Promise<void> => {
    const track = library.find((t) => t.id === trackId);
    if (!track) return;
    const updated = { ...track, cover: coverUrl, updatedAt: Date.now() };
    await musicDB.addTrack(updated);
    await refreshLibrary();
    if (playerState.currentTrack?.id === trackId) {
      setPlayerState((prev) => ({
        ...prev,
        currentTrack: { ...updated }
      }));
    }
  };

  const resetVinylImage = () => {
    setCustomVinylImage(null);
  };

  const refreshLibrary = useCallback(async () => {
    try {
      const [tracks, pls] = await Promise.all([
        musicDB.getAllTracks(),
        musicDB.getAllPlaylists()
      ]);

      let activeTracks = tracks;
      let activePlaylists = pls;

      if (tracks.length === 0) {
        // Seed default ambient workspace tracks if empty
        activeTracks = await musicDB.seedDefaultTracks();
        activePlaylists = await musicDB.getAllPlaylists();
      }

      setLibrary(activeTracks);
      setPlaylists(activePlaylists);

      if (!isRestoredRef.current && activeTracks.length > 0) {
        musicPlayer.restoreProgressWithTracks(activeTracks);
        setPlayerState({ ...musicPlayer.getState() });
        isRestoredRef.current = true;
      }
    } catch (err) {
      console.warn('Failed to load library from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLibrary();

    const unsubscribe = musicPlayer.subscribe(() => {
      setPlayerState({ ...musicPlayer.getState() });
    });

    return () => {
      unsubscribe();
    };
  }, [refreshLibrary]);

  const playTrack = async (track: MusicTrack, newQueue?: MusicTrack[], startAtSeconds: number = 0) => {
    const queueToUse = newQueue || library;
    await musicPlayer.playTrack(track, queueToUse, startAtSeconds);
  };

  const toggleFavorite = async (trackId: string) => {
    const track = library.find((t) => t.id === trackId);
    if (!track) return;
    const updated = { ...track, favorite: !track.favorite, updatedAt: Date.now() };
    await musicDB.addTrack(updated);
    await refreshLibrary();
  };

  const deleteTrack = async (trackId: string) => {
    await musicDB.deleteTrack(trackId);
    if (playerState.currentTrack?.id === trackId) {
      musicPlayer.pause();
    }
    await refreshLibrary();
  };

  const updateMetadata = async (track: MusicTrack) => {
    await musicDB.addTrack(track);
    await refreshLibrary();
  };

  const uploadFiles = async (files: FileList | File[]): Promise<MusicTrack[]> => {
    const fileList = Array.from(files);
    const addedTracks: MusicTrack[] = [];

    for (const file of fileList) {
      try {
        const metadata = await extractMetadataFromFile(file);
        const cover = metadata.cover || generateCoverArt(metadata.title || file.name, metadata.artist);

        const newTrack: MusicTrack = {
          id: `local-track-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
          artist: metadata.artist || 'Local Artist',
          album: metadata.album || 'Personal Studio',
          genre: metadata.genre || 'Local Audio',
          duration: metadata.duration || 180,
          fileName: file.name,
          mimeType: file.type || 'audio/mpeg',
          size: file.size,
          blob: file,
          cover,
          favorite: false,
          playCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        await musicDB.addTrack(newTrack);
        addedTracks.push(newTrack);
      } catch (err) {
        console.error('Error importing file:', file.name, err);
      }
    }

    await refreshLibrary();
    return addedTracks;
  };

  const importFiles = async (files: FileList | File[]): Promise<{ addedCount: number; errors: string[] }> => {
    const added = await uploadFiles(files);
    return { addedCount: added.length, errors: [] };
  };

  const createPlaylist = async (name: string, description?: string): Promise<Playlist> => {
    const newPl: Playlist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      description,
      trackIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await musicDB.savePlaylist(newPl);
    await refreshLibrary();
    return newPl;
  };

  const deletePlaylist = async (playlistId: string) => {
    await musicDB.deletePlaylist(playlistId);
    await refreshLibrary();
  };

  const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    await musicDB.addTrackToPlaylist(playlistId, trackId);
    await refreshLibrary();
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    await musicDB.removeTrackFromPlaylist(playlistId, trackId);
    await refreshLibrary();
  };

  const seedDefaultTracks = async () => {
    setIsLoading(true);
    await musicDB.seedDefaultTracks();
    await refreshLibrary();
  };

  const value: MusicContextType = {
    currentTrack: playerState.currentTrack,
    queue: playerState.queue,
    isPlaying: playerState.isPlaying,
    currentTime: playerState.currentTime,
    duration: playerState.duration,
    volume: playerState.volume,
    isMuted: playerState.isMuted,
    repeatMode: playerState.repeatMode,
    isShuffled: playerState.isShuffled,
    library,
    playlists,
    isLoading,
    customVinylImage,
    setCustomVinylImage,
    uploadVinylImage,
    uploadTrackCover,
    updateTrackCover,
    resetVinylImage,
    refreshLibrary,
    playTrack,
    togglePlayPause: () => musicPlayer.togglePlayPause(),
    seek: (sec) => musicPlayer.seek(sec),
    setVolume: (vol) => musicPlayer.setVolume(vol),
    toggleMute: () => musicPlayer.toggleMute(),
    toggleShuffle: () => musicPlayer.toggleShuffle(),
    cycleRepeatMode: () => musicPlayer.cycleRepeatMode(),
    next: () => musicPlayer.next(),
    previous: () => musicPlayer.previous(),
    addToQueue: (track) => musicPlayer.addToQueue(track),
    removeFromQueue: (id) => musicPlayer.removeFromQueue(id),
    clearQueue: () => musicPlayer.clearQueue(),
    toggleFavorite,
    deleteTrack,
    updateMetadata,
    updateTrackMetadata: updateMetadata,
    uploadFiles,
    importFiles,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    seedDefaultTracks,
    saveProgress: () => musicPlayer.saveProgress(true)
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
