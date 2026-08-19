import { ProfileData } from '../types';

export const defaultProfileData: ProfileData = {
  name: 'Kelly Tham',
  nickname: 'Kelly',
  role: 'Siswa SMA',
  grade: 'Kelas XI.3',
  major: 'Tata Boga & Informatika',
  school: 'SMA Cinta Kasih Tzu Chi',
  bio: 'Hai! Saya Kelly Tham, siswa kelas XI.3 di SMA Cinta Kasih Tzu Chi. Ini adalah Personal Digital Workspace saya — tempat saya mengelola jadwal belajar, dokumentasi tugas sekolah, koleksi musik lokal, dan ruang kreativitas digital.',
  avatarUrl: '', // Circular avatar with Gen Z gradient & stylish monogram
  badges: [
    '✨ Kelas XI.3',
    '🏫 SMA Cinta Kasih Tzu Chi',
    '🍰 Culinary & Tech Explorer',
    '⚡ Gen Z Digital Workspace'
  ],
  interests: [
    {
      category: 'Kuliner & Pastry Art',
      icon: 'Utensils',
      items: [
        'French Pastry & Choux Paste',
        'Artisan Bread & Viennoiserie',
        'Modern Plating & Food Styling',
        'Eksplorasi Rasa Nusantara'
      ]
    },
    {
      category: 'Informatika & Web Tech',
      icon: 'Code',
      items: [
        'Frontend Web (HTML5, CSS3, JS, React)',
        'Vibe Coding & AI Collaboration',
        'Kriptografi & Keamanan Data',
        'IndexedDB & Local State Engine'
      ]
    },
    {
      category: 'Literasi, Musik & Seni',
      icon: 'Sparkles',
      items: [
        'Analisis Teks Negosiasi & Hikayat',
        'Laporan Observasi Ilmiah',
        'Spotify Lo-Fi & Study Beats',
        'Food Photography & Visual Design'
      ]
    }
  ],
  skills: [
    { name: 'Pengolahan Pastry & Bakery', level: 'Mahir', percentage: 90, category: 'culinary' },
    { name: 'Teknik Plating & Presentation', level: 'Menengah', percentage: 85, category: 'culinary' },
    { name: 'Food Hygiene & HACCP', level: 'Mahir', percentage: 92, category: 'culinary' },
    { name: 'Pengembangan Web (HTML, CSS, JS)', level: 'Menengah', percentage: 85, category: 'digital' },
    { name: 'Algoritma & Pemrograman Dasar', level: 'Menengah', percentage: 80, category: 'digital' },
    { name: 'Kriptografi & Logika Digital', level: 'Menengah', percentage: 75, category: 'digital' },
    { name: 'Analisis Kebahasaan & Penulisan Esai', level: 'Tinggi', percentage: 90, category: 'academic' },
    { name: 'Analisis Sastra & Teks Negosiasi', level: 'Mahir', percentage: 88, category: 'academic' }
  ],
  contact: {
    instagram: '@kelyl_el',
    tiktok: '@kellyyieee',
    whatsapp: '088905602429',
    email: 'thamkelly616@gmail.com'
  }
};

export const PROFILE_PIN = '1309';

const PROFILE_STORAGE_KEY = 'kelly_profile_data_v2';

export function loadProfileData(): ProfileData {
  if (typeof window === 'undefined') return defaultProfileData;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return defaultProfileData;
    const parsed = JSON.parse(raw);
    return {
      ...defaultProfileData,
      ...parsed,
      contact: {
        ...defaultProfileData.contact,
        ...(parsed.contact || {})
      }
    };
  } catch (e) {
    console.error('Failed to load profile data:', e);
    return defaultProfileData;
  }
}

export function saveProfileData(data: ProfileData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save profile data:', e);
  }
}

export const profileData = loadProfileData();
