import { TaskItem } from '../types';
import { saveTasks, loadTasks } from '../data/tasks';
import { musicDB } from '../music/music-db';

export async function checkAndRunLegacyMigration(): Promise<{
  tasksMigrated: number;
  musicMigrated: number;
  logs: string[];
}> {
  const logs: string[] = [];
  let tasksMigrated = 0;
  let musicMigrated = 0;

  try {
    // 1. Check legacy task storage keys
    const legacyTaskKeys = [
      'tasks',
      'tugas',
      'informatika_tasks',
      'bindo_tasks',
      'kelly_tasks_v1',
      'student_tasks'
    ];

    const currentTasks = loadTasks();
    const existingIds = new Set(currentTasks.map((t) => t.id));
    const mergedTasks: TaskItem[] = [...currentTasks];

    for (const key of legacyTaskKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((item, idx) => {
              const id = item.id || `legacy-${key}-${idx}`;
              if (!existingIds.has(id)) {
                const normalized: TaskItem = {
                  id,
                  title: item.title || item.namaTugas || item.name || 'Tugas Tanpa Judul',
                  subject: item.subject || (item.mataPelajaran === 'B. Indonesia' || key.includes('bindo') ? 'Bahasa Indonesia' : 'Informatika'),
                  description: item.description || item.deskripsi || '',
                  date: item.date || item.tanggal || '10 Feb 2026',
                  deadline: item.deadline || item.tenggat || '28 Feb 2026',
                  status: (item.status === 'done' || item.status === 'Selesai') ? 'Selesai' : (item.status === 'in_progress' || item.status === 'Sedang Dikerjakan') ? 'Sedang Dikerjakan' : 'Belum Dikerjakan',
                  type: item.type || item.kategori || 'Tugas Sekolah',
                  url: item.url || item.link,
                  metadata: item.metadata || {}
                };
                mergedTasks.push(normalized);
                existingIds.add(id);
                tasksMigrated++;
              }
            });
            logs.push(`Dimigrasikan ${parsed.length} tugas dari kunci lama "${key}".`);
          }
        } catch (e) {
          console.warn(`Gagal mem-parsing legacy storage key ${key}:`, e);
        }
      }
    }

    if (tasksMigrated > 0) {
      saveTasks(mergedTasks);
      logs.push(`Berhasil menyimpan ${tasksMigrated} tugas hasil migrasi ke penyimpanan baru.`);
    }

    // 2. Check legacy IndexedDB databases for music (e.g., 'MusicPlayerDB', 'LocalMusic', 'AudioDB')
    if (window.indexedDB && window.indexedDB.databases) {
      try {
        const dbs = await window.indexedDB.databases();
        const legacyNames = ['MusicPlayerDB', 'LocalMusic', 'AudioDB', 'KellyMusic'];

        for (const dbInfo of dbs) {
          if (dbInfo.name && legacyNames.includes(dbInfo.name) && dbInfo.name !== 'LocalMusicDB') {
            logs.push(`Menemukan database musik lama: ${dbInfo.name}`);
            // Safely attempt read
            const legacyReq = indexedDB.open(dbInfo.name);
            legacyReq.onsuccess = async () => {
              const oldDb = legacyReq.result;
              const storeNames = Array.from(oldDb.objectStoreNames);
              for (const sName of storeNames) {
                try {
                  const tx = oldDb.transaction(sName, 'readonly');
                  const store = tx.objectStore(sName);
                  const getAll = store.getAll();
                  getAll.onsuccess = async () => {
                    const items = getAll.result || [];
                    for (const item of items) {
                      if (item && (item.blob || item.audio || item.file || item.title)) {
                        const newTrack = {
                          id: item.id || `legacy-music-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                          title: item.title || item.name || 'Lagu Migrasi',
                          artist: item.artist || item.penyanyi || 'Kelly Tham Library',
                          album: item.album || 'Koleksi Lama',
                          genre: item.genre || 'Musik Belajar',
                          duration: item.duration || 180,
                          fileName: item.fileName || item.filename || 'track.mp3',
                          mimeType: item.mimeType || 'audio/mpeg',
                          size: item.size || 0,
                          blob: item.blob || item.audio || item.file,
                          cover: item.cover,
                          favorite: !!item.favorite,
                          playCount: item.playCount || 0,
                          createdAt: item.createdAt || Date.now(),
                          updatedAt: Date.now()
                        };
                        await musicDB.addTrack(newTrack);
                        musicMigrated++;
                      }
                    }
                  };
                } catch (err) {
                  console.warn('Error reading legacy object store:', err);
                }
              }
            };
          }
        }
      } catch (err) {
        console.warn('IndexedDB database inspection unavailable or restricted:', err);
      }
    }
  } catch (err) {
    console.error('Error during legacy migration check:', err);
    logs.push('Gagal memeriksa beberapa data lama.');
  }

  return { tasksMigrated, musicMigrated, logs };
}

export const runMigrationIfNeeded = checkAndRunLegacyMigration;

