import { MusicTrack, RepeatMode } from '../types';
import { musicDB } from './music-db';

export type PlayerEventListener = () => void;

export interface SavedMusicProgress {
  trackId: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  queueTrackIds: string[];
  lastSavedAt: number;
}

const PROGRESS_STORAGE_KEY = 'kellys_workspace_music_progress';

export class MusicPlayerEngine {
  private static instance: MusicPlayerEngine | null = null;

  private audio: HTMLAudioElement;
  private currentTrack: MusicTrack | null = null;
  private queue: MusicTrack[] = [];
  private history: MusicTrack[] = [];
  private isPlaying: boolean = false;
  private currentTime: number = 0;
  private duration: number = 0;
  private volume: number = 0.8;
  private isMuted: boolean = false;
  private repeatMode: RepeatMode = 'off';
  private isShuffled: boolean = false;
  private listeners: Set<PlayerEventListener> = new Set();
  private objectUrls: Map<string, string> = new Map();
  private lastSaveTime: number = 0;

  // Web Audio API for visualizer
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private isAudioGraphConnected: boolean = false;

  private constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';

    // Load initial cached volume/settings if available
    const saved = this.loadSavedProgress();
    if (saved) {
      this.volume = typeof saved.volume === 'number' ? saved.volume : 0.8;
      this.isMuted = !!saved.isMuted;
      this.repeatMode = saved.repeatMode || 'off';
      this.isShuffled = !!saved.isShuffled;
      this.currentTime = saved.currentTime || 0;
      this.duration = saved.duration || 0;
    }

    this.audio.volume = this.isMuted ? 0 : this.volume;

    this.setupAudioListeners();
    this.setupLifecycleListeners();
  }

  public static getInstance(): MusicPlayerEngine {
    if (!MusicPlayerEngine.instance) {
      MusicPlayerEngine.instance = new MusicPlayerEngine();
    }
    return MusicPlayerEngine.instance;
  }

  private loadSavedProgress(): SavedMusicProgress | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SavedMusicProgress;
    } catch (e) {
      console.warn('Failed to load music progress from storage:', e);
      return null;
    }
  }

  public saveProgress(force: boolean = false) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const now = Date.now();
      if (!force && now - this.lastSaveTime < 1000) {
        return; // Throttle saving
      }
      this.lastSaveTime = now;

      const progress: SavedMusicProgress = {
        trackId: this.currentTrack?.id || null,
        currentTime: Math.round(this.currentTime * 10) / 10,
        duration: Math.round(this.duration * 10) / 10,
        volume: this.volume,
        isMuted: this.isMuted,
        repeatMode: this.repeatMode,
        isShuffled: this.isShuffled,
        queueTrackIds: this.queue.map((t) => t.id),
        lastSavedAt: now
      };

      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save music progress:', e);
    }
  }

  public restoreProgressWithTracks(availableTracks: MusicTrack[]) {
    const saved = this.loadSavedProgress();
    if (!saved || availableTracks.length === 0) {
      // Default to first track if available
      if (availableTracks.length > 0 && !this.currentTrack) {
        this.currentTrack = availableTracks[0];
        this.queue = [...availableTracks];
        this.duration = availableTracks[0].duration;
        this.notifyListeners();
      }
      return;
    }

    // Restore queue
    if (saved.queueTrackIds && saved.queueTrackIds.length > 0) {
      const restoredQueue: MusicTrack[] = [];
      for (const id of saved.queueTrackIds) {
        const t = availableTracks.find((track) => track.id === id);
        if (t) restoredQueue.push(t);
      }
      if (restoredQueue.length > 0) {
        this.queue = restoredQueue;
      } else {
        this.queue = [...availableTracks];
      }
    } else {
      this.queue = [...availableTracks];
    }

    // Restore current track
    let trackToRestore: MusicTrack | null = null;
    if (saved.trackId) {
      trackToRestore = availableTracks.find((t) => t.id === saved.trackId) || null;
    }
    if (!trackToRestore && this.queue.length > 0) {
      trackToRestore = this.queue[0];
    }

    if (trackToRestore) {
      this.currentTrack = trackToRestore;
      this.currentTime = saved.currentTime > 0 ? saved.currentTime : 0;
      this.duration = saved.duration > 0 ? saved.duration : trackToRestore.duration;
      this.volume = typeof saved.volume === 'number' ? saved.volume : 0.8;
      this.isMuted = !!saved.isMuted;
      this.repeatMode = saved.repeatMode || 'off';
      this.isShuffled = !!saved.isShuffled;

      const url = this.getAudioUrlForTrack(trackToRestore);
      if (url) {
        this.audio.src = url;
        this.audio.currentTime = this.currentTime;
      }

      this.notifyListeners();
    }
  }

  private setupLifecycleListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeunload', () => {
      this.saveProgress(true);
    });

    window.addEventListener('pagehide', () => {
      this.saveProgress(true);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveProgress(true);
      }
    });
  }

  private setupAudioListeners() {
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.saveProgress(true);
      this.notifyListeners();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.saveProgress(true);
      this.notifyListeners();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.duration = this.audio.duration || (this.currentTrack?.duration || 0);
      this.saveProgress(false);
      this.notifyListeners();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration || (this.currentTrack?.duration || 0);
      if (this.currentTime > 0 && this.audio.currentTime === 0) {
        this.audio.currentTime = this.currentTime;
      }
      this.notifyListeners();
    });

    this.audio.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error:', e);
      this.isPlaying = false;
      this.notifyListeners();
    });
  }

  private initWebAudio() {
    if (this.isAudioGraphConnected) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (!this.sourceNode) {
        this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;

        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        this.isAudioGraphConnected = true;
      }
    } catch (err) {
      console.warn('Web Audio API setup skipped or restricted:', err);
    }
  }

  public subscribe(listener: PlayerEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in player listener:', err);
      }
    });
  }

  private getAudioUrlForTrack(track: MusicTrack): string {
    if (track.audioUrl) return track.audioUrl;

    if (track.blob) {
      if (!this.objectUrls.has(track.id)) {
        const url = URL.createObjectURL(track.blob);
        this.objectUrls.set(track.id, url);
      }
      return this.objectUrls.get(track.id)!;
    }

    return '';
  }

  public async playTrack(track: MusicTrack, newQueue?: MusicTrack[], startAtSeconds: number = 0) {
    this.initWebAudio();

    if (newQueue) {
      this.queue = [...newQueue];
    }

    if (this.currentTrack && this.currentTrack.id !== track.id) {
      this.history.push(this.currentTrack);
      if (this.history.length > 50) this.history.shift();
      this.currentTime = startAtSeconds;
    }

    this.currentTrack = track;
    const url = this.getAudioUrlForTrack(track);

    if (!url) {
      console.error('No valid audio source for track:', track.title);
      return;
    }

    const isDifferentSrc = this.audio.src !== url;
    if (isDifferentSrc) {
      this.audio.src = url;
      this.audio.load();
    }

    if (startAtSeconds > 0) {
      this.audio.currentTime = startAtSeconds;
      this.currentTime = startAtSeconds;
    }

    try {
      await this.audio.play();
      this.isPlaying = true;
      musicDB.incrementPlayCount(track.id);
      this.updateMediaSession(track);
      this.saveProgress(true);
    } catch (err) {
      console.warn('Auto-play was prevented by browser policy, user interaction required:', err);
      this.isPlaying = false;
    }

    this.notifyListeners();
  }

  public togglePlayPause() {
    this.initWebAudio();

    if (!this.currentTrack) {
      if (this.queue.length > 0) {
        this.playTrack(this.queue[0], undefined, this.currentTime);
      }
      return;
    }

    if (this.isPlaying) {
      this.audio.pause();
      this.saveProgress(true);
    } else {
      const url = this.getAudioUrlForTrack(this.currentTrack);
      if (this.audio.src !== url && url) {
        this.audio.src = url;
        this.audio.load();
        if (this.currentTime > 0) {
          this.audio.currentTime = this.currentTime;
        }
      }
      this.audio.play().catch((err) => {
        console.warn('Playback error:', err);
      });
      this.saveProgress(true);
    }
  }

  public pause() {
    this.audio.pause();
    this.saveProgress(true);
  }

  public seek(seconds: number) {
    if (isNaN(seconds)) return;
    const clamped = Math.max(0, Math.min(seconds, this.duration || 1000));
    this.audio.currentTime = clamped;
    this.currentTime = clamped;
    this.saveProgress(true);
    this.notifyListeners();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audio.volume = this.isMuted ? 0 : this.volume;
    this.saveProgress(true);
    this.notifyListeners();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.volume = this.isMuted ? 0 : this.volume;
    this.saveProgress(true);
    this.notifyListeners();
  }

  public toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.saveProgress(true);
    this.notifyListeners();
  }

  public cycleRepeatMode() {
    if (this.repeatMode === 'off') {
      this.repeatMode = 'all';
    } else if (this.repeatMode === 'all') {
      this.repeatMode = 'one';
    } else {
      this.repeatMode = 'off';
    }
    this.saveProgress(true);
    this.notifyListeners();
  }

  public next() {
    if (this.repeatMode === 'one' && this.currentTrack) {
      this.audio.currentTime = 0;
      this.audio.play();
      return;
    }

    if (this.queue.length === 0) return;

    const currentIndex = this.queue.findIndex((t) => t.id === this.currentTrack?.id);

    if (this.isShuffled && this.queue.length > 1) {
      const remaining = this.queue.filter((t) => t.id !== this.currentTrack?.id);
      const randomTrack = remaining[Math.floor(Math.random() * remaining.length)];
      if (randomTrack) {
        this.playTrack(randomTrack);
      }
      return;
    }

    if (currentIndex !== -1 && currentIndex < this.queue.length - 1) {
      this.playTrack(this.queue[currentIndex + 1]);
    } else if (this.repeatMode === 'all' && this.queue.length > 0) {
      this.playTrack(this.queue[0]);
    } else {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.currentTime = 0;
      this.isPlaying = false;
      this.saveProgress(true);
      this.notifyListeners();
    }
  }

  public previous() {
    if (this.currentTime > 3) {
      this.seek(0);
      return;
    }

    if (this.history.length > 0) {
      const prevTrack = this.history.pop();
      if (prevTrack) {
        this.playTrack(prevTrack);
        return;
      }
    }

    const currentIndex = this.queue.findIndex((t) => t.id === this.currentTrack?.id);
    if (currentIndex > 0) {
      this.playTrack(this.queue[currentIndex - 1]);
    } else {
      this.seek(0);
    }
  }

  private handleTrackEnded() {
    if (this.repeatMode === 'one') {
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      this.next();
    }
  }

  // Queue Operations
  public addToQueue(track: MusicTrack) {
    if (!this.queue.some((t) => t.id === track.id)) {
      this.queue.push(track);
      this.saveProgress(true);
      this.notifyListeners();
    }
  }

  public removeFromQueue(trackId: string) {
    this.queue = this.queue.filter((t) => t.id !== trackId);
    this.saveProgress(true);
    this.notifyListeners();
  }

  public clearQueue() {
    this.queue = this.currentTrack ? [this.currentTrack] : [];
    this.saveProgress(true);
    this.notifyListeners();
  }

  public reorderQueue(startIndex: number, endIndex: number) {
    const result = Array.from(this.queue);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    this.queue = result;
    this.saveProgress(true);
    this.notifyListeners();
  }

  // MediaSession API integration for mobile background/lockscreen controls
  private updateMediaSession(track: MusicTrack) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || 'Kelly Tham Digital Workspace',
        artwork: track.cover ? [{ src: track.cover, sizes: '300x300', type: 'image/svg+xml' }] : []
      });

      navigator.mediaSession.setActionHandler('play', () => this.togglePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => this.togglePlayPause());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.previous());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) this.seek(details.seekTime);
      });
    }
  }

  // Visualizer frequency data
  public getFrequencyData(): Uint8Array {
    if (!this.analyser || !this.isPlaying) {
      return new Uint8Array(32);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  // State Getters
  public getState() {
    return {
      currentTrack: this.currentTrack,
      queue: this.queue,
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      volume: this.volume,
      isMuted: this.isMuted,
      repeatMode: this.repeatMode,
      isShuffled: this.isShuffled
    };
  }
}

export const musicPlayer = MusicPlayerEngine.getInstance();
