export type NavigationTab = 
  | 'dashboard'
  | 'profile'
  | 'informatika'
  | 'bindo'
  | 'schedule'
  | 'games'
  | 'music';

export interface ProfileData {
  name: string;
  nickname: string;
  role: string;
  grade: string;
  major: string;
  school: string;
  bio: string;
  avatarUrl: string;
  badges: string[];
  interests: {
    category: string;
    items: string[];
    icon: string;
  }[];
  skills: {
    name: string;
    level: string;
    percentage?: number;
    category: 'culinary' | 'digital' | 'academic';
  }[];
  contact: {
    instagram: string;
    tiktok: string;
    whatsapp: string;
    email: string;
  };
}

export type ScheduleItemType = 'event' | 'subject';

export interface ScheduleItem {
  id: string;
  type: ScheduleItemType;
  time: string; // e.g. "07.30 - 08.15"
  startTime: string; // "07:30"
  endTime: string; // "08:15"
  jp?: number; // Jam Pelajaran
  label?: string; // For events like "Upacara Bendera", "Istirahat"
  subject?: string;
  kd?: string; // Kompetensi Dasar code and description
  room?: string;
  teacher?: string;
  isBreak?: boolean;
}

export type DayOfWeek = 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT';

export interface WeeklySchedule {
  SENIN: ScheduleItem[];
  SELASA: ScheduleItem[];
  RABU: ScheduleItem[];
  KAMIS: ScheduleItem[];
  JUMAT: ScheduleItem[];
}

export type TaskStatus = 'Belum Dikerjakan' | 'Sedang Dikerjakan' | 'Selesai';
export type TaskSubject = 'Informatika' | 'Bahasa Indonesia';

export interface TaskItem {
  id: string;
  title: string;
  subject: TaskSubject;
  category?: string;
  description: string;
  content?: string;
  code?: string;
  cover?: string;
  date: string;
  deadline: string;
  status: TaskStatus;
  type: string; // e.g. "Artikel", "Teori / Analisis", "Pemrograman", "Hikayat", "Laporan Hasil Observasi", "Teks Negosiasi"
  attachments?: string[];
  url?: string;
  file?: string;
  score?: number;
  metadata?: Record<string, any>;
  createdAt?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre?: string;
  duration: number; // in seconds
  fileName: string;
  mimeType: string;
  size: number;
  blob?: Blob;
  audioUrl?: string; // Local Object URL
  cover?: string; // Base64 data URL or generated SVG
  favorite?: boolean;
  playCount?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  trackIds: string[];
  createdAt: number;
  updatedAt: number;
}

export type MusicPlaylist = Playlist;

export type RepeatMode = 'off' | 'all' | 'one';
