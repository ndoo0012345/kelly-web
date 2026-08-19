import { MusicTrack, MusicPlaylist } from '../types';
import { generateCoverArt } from './music-utils';

const DB_NAME = 'LocalMusicDB';
const DB_VERSION = 2;

// Synthesize a soothing ambient track WAV blob (chords + gentle melodic arpeggio + binaural hum)
export function createAmbientTrackBlob(durationSeconds: number = 30, chordBaseFreq: number = 220): Blob {
  const sampleRate = 16000; // Efficient sample rate for fast generation & small memory footprint
  const totalSamples = sampleRate * durationSeconds;
  const numChannels = 2;
  const buffer = new ArrayBuffer(44 + totalSamples * numChannels * 2);
  const view = new DataView(buffer);

  // WAV Header
  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + totalSamples * numChannels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
  view.setUint16(32, numChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16-bit)
  writeString(36, 'data');
  view.setUint32(40, totalSamples * numChannels * 2, true);

  // Generate pleasant ambient progression
  const chordNotes = [
    [chordBaseFreq * 1.0, chordBaseFreq * 1.25, chordBaseFreq * 1.5], // I
    [chordBaseFreq * 0.75, chordBaseFreq * 0.9375, chordBaseFreq * 1.125], // IV
    [chordBaseFreq * 0.833, chordBaseFreq * 1.04, chordBaseFreq * 1.25], // V
    [chordBaseFreq * 1.125, chordBaseFreq * 1.333, chordBaseFreq * 1.666]  // vi
  ];

  let offset = 44;
  const chordDuration = 4; // seconds per chord

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const chordIndex = Math.floor(t / chordDuration) % chordNotes.length;
    const currentChord = chordNotes[chordIndex];

    // Subtle envelope for smooth chord transitions
    const chordProgress = (t % chordDuration) / chordDuration;
    const envelope = Math.sin(chordProgress * Math.PI);

    // Warm pad oscillator
    let sampleL = 0;
    let sampleR = 0;

    for (let c = 0; c < currentChord.length; c++) {
      const freq = currentChord[c];
      const tone = Math.sin(2 * Math.PI * freq * t) * 0.14;
      const sub = Math.sin(2 * Math.PI * (freq * 0.5) * t) * 0.07;
      const overtone = Math.sin(2 * Math.PI * (freq * 2.01) * t) * 0.03;
      
      const component = (tone + sub + overtone) * envelope;
      sampleL += component;
      sampleR += component * (c % 2 === 0 ? 0.9 : 1.1);
    }

    // Melodic arpeggio sparkle
    const noteSpeed = 0.5; // Note change every 0.5s
    const noteIdx = Math.floor(t / noteSpeed) % 4;
    const noteFreq = currentChord[noteIdx % currentChord.length] * 2;
    const noteEnv = Math.exp(-((t % noteSpeed) * 4));
    const chime = Math.sin(2 * Math.PI * noteFreq * t) * 0.08 * noteEnv;

    sampleL += chime * 0.8;
    sampleR += chime * 1.2;

    // Master fade in / fade out
    let masterGain = 1.0;
    if (t < 2) masterGain = t / 2;
    if (t > durationSeconds - 2) masterGain = (durationSeconds - t) / 2;

    sampleL *= masterGain;
    sampleR *= masterGain;

    // Clamp to 16-bit PCM
    const intSampleL = Math.max(-32768, Math.min(32767, Math.floor(sampleL * 32767)));
    const intSampleR = Math.max(-32768, Math.min(32767, Math.floor(sampleR * 32767)));

    view.setInt16(offset, intSampleL, true);
    view.setInt16(offset + 2, intSampleR, true);
    offset += 4;
  }

  return new Blob([view], { type: 'audio/wav' });
}

export class LocalMusicDatabase {
  private db: IDBDatabase | null = null;
  private isInitializing: Promise<IDBDatabase> | null = null;

  public async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.isInitializing) return this.isInitializing;

    this.isInitializing = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('tracks')) {
          const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
          trackStore.createIndex('title', 'title', { unique: false });
          trackStore.createIndex('artist', 'artist', { unique: false });
          trackStore.createIndex('favorite', 'favorite', { unique: false });
          trackStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('playlists')) {
          const playlistStore = db.createObjectStore('playlists', { keyPath: 'id' });
          playlistStore.createIndex('name', 'name', { unique: false });
          playlistStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => {
        this.isInitializing = null;
        reject(request.error);
      };
    });

    return this.isInitializing;
  }

  public async seedDefaultTracks(): Promise<MusicTrack[]> {
    const seedTracks: Omit<MusicTrack, 'blob'>[] = [
      {
        id: 'track-seed-01',
        title: 'Morning Pastry Studio (Warm Lo-Fi)',
        artist: 'Kelly Tham Study Sessions',
        album: 'Tata Boga & Coding Sanctuary',
        genre: 'Study Lo-Fi / Chill',
        duration: 30,
        fileName: 'morning_pastry_studio.wav',
        mimeType: 'audio/wav',
        size: 960000,
        favorite: true,
        playCount: 4,
        createdAt: Date.now() - 3600000 * 24,
        updatedAt: Date.now() - 3600000 * 24
      },
      {
        id: 'track-seed-02',
        title: 'Acoustic Rainfall & Algorithm',
        artist: 'Kelly Tham Study Sessions',
        album: 'Informatika XI Sanctuary',
        genre: 'Ambient Piano / Focus',
        duration: 30,
        fileName: 'acoustic_rainfall_algorithm.wav',
        mimeType: 'audio/wav',
        size: 960000,
        favorite: false,
        playCount: 2,
        createdAt: Date.now() - 3600000 * 12,
        updatedAt: Date.now() - 3600000 * 12
      },
      {
        id: 'track-seed-03',
        title: 'Baking at Midnight (Smooth Chords)',
        artist: 'Kelly Tham Study Sessions',
        album: 'Tata Boga & Coding Sanctuary',
        genre: 'Neo-Soul / Ambient',
        duration: 30,
        fileName: 'baking_at_midnight.wav',
        mimeType: 'audio/wav',
        size: 960000,
        favorite: true,
        playCount: 6,
        createdAt: Date.now() - 3600000 * 4,
        updatedAt: Date.now() - 3600000 * 4
      }
    ];

    const freqs = [220, 261.63, 196];
    const created: MusicTrack[] = [];

    for (let i = 0; i < seedTracks.length; i++) {
      const track = seedTracks[i];
      const blob = createAmbientTrackBlob(track.duration, freqs[i]);
      const cover = generateCoverArt(track.title, track.artist, track.id);
      
      const fullTrack: MusicTrack = {
        ...track,
        blob,
        cover
      };

      await this.addTrack(fullTrack);
      created.push(fullTrack);
    }

    // Also create initial playlist if none exists
    const playlists = await this.getAllPlaylists();
    if (playlists.length === 0) {
      await this.savePlaylist({
        id: 'playlist-focus-01',
        name: 'Focus & Study Session',
        description: 'Daftar putar instan untuk menemani tugas dan coding.',
        trackIds: created.map((t) => t.id),
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    return created;
  }

  public async getTrackCount(): Promise<number> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('tracks', 'readonly');
      const store = tx.objectStore('tracks');
      const countReq = store.count();
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => reject(countReq.error);
    });
  }

  public async getAllTracks(): Promise<MusicTrack[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('tracks', 'readonly');
      const store = tx.objectStore('tracks');
      const request = store.getAll();

      request.onsuccess = () => {
        const tracks: MusicTrack[] = request.result || [];
        resolve(tracks);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async getTrackById(id: string): Promise<MusicTrack | null> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('tracks', 'readonly');
      const store = tx.objectStore('tracks');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  public async addTrack(track: MusicTrack): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('tracks', 'readwrite');
      const store = tx.objectStore('tracks');
      const req = store.put(track);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async updateTrack(track: MusicTrack): Promise<void> {
    return this.addTrack(track);
  }

  public async deleteTrack(id: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('tracks', 'readwrite');
      const store = tx.objectStore('tracks');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async toggleFavorite(id: string): Promise<boolean> {
    const track = await this.getTrackById(id);
    if (!track) return false;
    track.favorite = !track.favorite;
    track.updatedAt = Date.now();
    await this.updateTrack(track);
    return track.favorite;
  }

  public async incrementPlayCount(id: string): Promise<void> {
    const track = await this.getTrackById(id);
    if (!track) return;
    track.playCount = (track.playCount || 0) + 1;
    track.updatedAt = Date.now();
    await this.updateTrack(track);
  }

  // Playlists
  public async getAllPlaylists(): Promise<MusicPlaylist[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('playlists', 'readonly');
      const store = tx.objectStore('playlists');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public async savePlaylist(playlist: MusicPlaylist): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('playlists', 'readwrite');
      const store = tx.objectStore('playlists');
      const req = store.put(playlist);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async deletePlaylist(id: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('playlists', 'readwrite');
      const store = tx.objectStore('playlists');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
    const playlists = await this.getAllPlaylists();
    const pl = playlists.find((p) => p.id === playlistId);
    if (!pl) return;
    if (!pl.trackIds.includes(trackId)) {
      pl.trackIds.push(trackId);
      pl.updatedAt = Date.now();
      await this.savePlaylist(pl);
    }
  }

  public async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<void> {
    const playlists = await this.getAllPlaylists();
    const pl = playlists.find((p) => p.id === playlistId);
    if (!pl) return;
    pl.trackIds = pl.trackIds.filter((id) => id !== trackId);
    pl.updatedAt = Date.now();
    await this.savePlaylist(pl);
  }
}

export const musicDB = new LocalMusicDatabase();
