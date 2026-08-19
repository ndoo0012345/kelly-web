import { WeeklySchedule, ScheduleItem, DayOfWeek } from '../types';

export const scheduleMeta = {
  kelas: "XI.3",
  sekolah: "SMA Cinta Kasih Tzu Chi",
  tahunAjaran: "2025/2026"
};

// Data Jadwal Pelajaran XI.3 SMA Cinta Kasih Tzu Chi (sumber: personal-workspace-mu.vercel.app)
export const scheduleData: WeeklySchedule = {
  SENIN: [
    {
      id: 'senin-0',
      type: 'event',
      time: '06:30 - 07:30',
      startTime: '06:30',
      endTime: '07:30',
      label: 'Upacara / Pembiasaan',
      room: 'Lapangan / Kelas',
      isBreak: false
    },
    {
      id: 'senin-1',
      type: 'subject',
      jp: 1,
      time: '07:30 - 08:15',
      startTime: '07:30',
      endTime: '08:15',
      subject: 'Sosiologi-3',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'senin-2',
      type: 'subject',
      jp: 2,
      time: '08:15 - 09:00',
      startTime: '08:15',
      endTime: '09:00',
      subject: 'Sosiologi-3',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'senin-break-1',
      type: 'event',
      time: '09:00 - 09:30',
      startTime: '09:00',
      endTime: '09:30',
      label: 'Istirahat I',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'senin-3',
      type: 'subject',
      jp: 3,
      time: '09:30 - 10:10',
      startTime: '09:30',
      endTime: '10:10',
      subject: 'Mandarin-25',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'senin-4',
      type: 'subject',
      jp: 4,
      time: '10:10 - 10:50',
      startTime: '10:10',
      endTime: '10:50',
      subject: 'Mandarin-25',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'senin-5',
      type: 'subject',
      jp: 5,
      time: '10:50 - 11:30',
      startTime: '10:50',
      endTime: '11:30',
      subject: 'Budi Pekerti-26',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'senin-6',
      type: 'subject',
      jp: 6,
      time: '11:30 - 12:10',
      startTime: '11:30',
      endTime: '12:10',
      subject: 'Budaya Humanis-9',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'senin-break-2',
      type: 'event',
      time: '12:10 - 12:40',
      startTime: '12:10',
      endTime: '12:40',
      label: 'Istirahat II',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'senin-7',
      type: 'subject',
      jp: 7,
      time: '12:40 - 13:20',
      startTime: '12:40',
      endTime: '13:20',
      subject: 'Matematika Wajib-10',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'senin-8',
      type: 'subject',
      jp: 8,
      time: '13:20 - 14:00',
      startTime: '13:20',
      endTime: '14:00',
      subject: 'Ekonomi-4',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'senin-9',
      type: 'subject',
      jp: 9,
      time: '14:00 - 14:40',
      startTime: '14:00',
      endTime: '14:40',
      subject: 'Ekonomi-4',
      room: 'Ruang 11.3',
      isBreak: false
    }
  ],
  SELASA: [
    {
      id: 'selasa-0',
      type: 'event',
      time: '06:30 - 06:45',
      startTime: '06:30',
      endTime: '06:45',
      label: 'Pembiasaan Pagi',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'selasa-1',
      type: 'subject',
      jp: 1,
      time: '06:45 - 07:30',
      startTime: '06:45',
      endTime: '07:30',
      subject: 'Matematika Wajib-10',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'selasa-2',
      type: 'subject',
      jp: 2,
      time: '07:30 - 08:15',
      startTime: '07:30',
      endTime: '08:15',
      subject: 'Matematika Wajib-10',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'selasa-3',
      type: 'subject',
      jp: 3,
      time: '08:15 - 09:00',
      startTime: '08:15',
      endTime: '09:00',
      subject: 'Agama-26',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'selasa-4',
      type: 'subject',
      jp: 4,
      time: '09:00 - 09:45',
      startTime: '09:00',
      endTime: '09:45',
      subject: 'Agama-26',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'selasa-break-1',
      type: 'event',
      time: '09:45 - 10:05',
      startTime: '09:45',
      endTime: '10:05',
      label: 'Istirahat I',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'selasa-5',
      type: 'subject',
      jp: 5,
      time: '10:05 - 10:50',
      startTime: '10:05',
      endTime: '10:50',
      subject: 'Informatika-22',
      room: 'Lab Komputer',
      isBreak: false
    },
    {
      id: 'selasa-6',
      type: 'subject',
      jp: 6,
      time: '10:50 - 11:35',
      startTime: '10:50',
      endTime: '11:35',
      subject: 'Informatika-22',
      room: 'Lab Komputer',
      isBreak: false
    },
    {
      id: 'selasa-break-2',
      type: 'event',
      time: '11:35 - 12:00',
      startTime: '11:35',
      endTime: '12:00',
      label: 'Istirahat II',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'selasa-7',
      type: 'subject',
      jp: 7,
      time: '12:00 - 12:40',
      startTime: '12:00',
      endTime: '12:40',
      subject: 'Ekonomi-4',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'selasa-8',
      type: 'subject',
      jp: 8,
      time: '12:40 - 13:20',
      startTime: '12:40',
      endTime: '13:20',
      subject: 'Ekonomi-4',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'selasa-9',
      type: 'subject',
      jp: 9,
      time: '13:20 - 14:00',
      startTime: '13:20',
      endTime: '14:00',
      subject: 'Sosiologi-3',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'selasa-10',
      type: 'subject',
      jp: 10,
      time: '14:00 - 14:30',
      startTime: '14:00',
      endTime: '14:30',
      subject: 'Sosiologi-3',
      room: 'Ruang 11.3',
      isBreak: false
    }
  ],
  RABU: [
    {
      id: 'rabu-0',
      type: 'event',
      time: '06:30 - 06:45',
      startTime: '06:30',
      endTime: '06:45',
      label: 'Pembiasaan Pagi',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'rabu-1',
      type: 'subject',
      jp: 1,
      time: '06:45 - 07:30',
      startTime: '06:45',
      endTime: '07:30',
      subject: 'Informatika-22',
      room: 'Lab Komputer',
      isBreak: false
    },
    {
      id: 'rabu-2',
      type: 'subject',
      jp: 2,
      time: '07:30 - 08:15',
      startTime: '07:30',
      endTime: '08:15',
      subject: 'Informatika-22',
      room: 'Lab Komputer',
      isBreak: false
    },
    {
      id: 'rabu-3',
      type: 'subject',
      jp: 3,
      time: '08:15 - 09:00',
      startTime: '08:15',
      endTime: '09:00',
      subject: 'Mandarin-25',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'rabu-break-1',
      type: 'event',
      time: '09:00 - 09:30',
      startTime: '09:00',
      endTime: '09:30',
      label: 'Istirahat I',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'rabu-4',
      type: 'subject',
      jp: 4,
      time: '09:30 - 10:10',
      startTime: '09:30',
      endTime: '10:10',
      subject: 'Mandarin-25',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'rabu-5',
      type: 'subject',
      jp: 5,
      time: '10:10 - 10:50',
      startTime: '10:10',
      endTime: '10:50',
      subject: 'Sosiologi-3',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'rabu-6',
      type: 'subject',
      jp: 6,
      time: '10:50 - 11:30',
      startTime: '10:50',
      endTime: '11:30',
      subject: 'Bahasa Indonesia-17',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'rabu-7',
      type: 'subject',
      jp: 7,
      time: '11:30 - 12:10',
      startTime: '11:30',
      endTime: '12:10',
      subject: 'Kokurikuler-4',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'rabu-break-2',
      type: 'event',
      time: '12:10 - 12:40',
      startTime: '12:10',
      endTime: '12:40',
      label: 'Istirahat II',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'rabu-8',
      type: 'subject',
      jp: 8,
      time: '12:40 - 13:20',
      startTime: '12:40',
      endTime: '13:20',
      subject: 'Sejarah-3',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'rabu-9',
      type: 'subject',
      jp: 9,
      time: '13:20 - 14:00',
      startTime: '13:20',
      endTime: '14:00',
      subject: 'Sejarah-3',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'rabu-10',
      type: 'subject',
      jp: 10,
      time: '14:00 - 14:40',
      startTime: '14:00',
      endTime: '14:40',
      subject: 'Seni Budaya-5',
      room: 'Ruang Kesenian',
      isBreak: false
    },
    {
      id: 'rabu-11',
      type: 'subject',
      jp: 11,
      time: '14:40 - 15:20',
      startTime: '14:40',
      endTime: '15:20',
      subject: 'Seni Budaya-5',
      room: 'Ruang Kesenian',
      isBreak: false
    }
  ],
  KAMIS: [
    {
      id: 'kamis-0',
      type: 'event',
      time: '06:30 - 06:45',
      startTime: '06:30',
      endTime: '06:45',
      label: 'Pembiasaan Pagi',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'kamis-1',
      type: 'subject',
      jp: 1,
      time: '06:45 - 07:30',
      startTime: '06:45',
      endTime: '07:30',
      subject: 'Informatika-22',
      room: 'Lab Komputer',
      isBreak: false
    },
    {
      id: 'kamis-2',
      type: 'subject',
      jp: 2,
      time: '07:30 - 08:15',
      startTime: '07:30',
      endTime: '08:15',
      subject: 'Informatika-22',
      room: 'Lab Komputer',
      isBreak: false
    },
    {
      id: 'kamis-3',
      type: 'subject',
      jp: 3,
      time: '08:15 - 09:00',
      startTime: '08:15',
      endTime: '09:00',
      subject: 'Matematika Wajib-10',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'kamis-break-1',
      type: 'event',
      time: '09:00 - 09:30',
      startTime: '09:00',
      endTime: '09:30',
      label: 'Istirahat I',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'kamis-4',
      type: 'subject',
      jp: 4,
      time: '09:30 - 10:15',
      startTime: '09:30',
      endTime: '10:15',
      subject: 'Matematika Wajib-10',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'kamis-5',
      type: 'subject',
      jp: 5,
      time: '10:15 - 11:00',
      startTime: '10:15',
      endTime: '11:00',
      subject: 'PPKN-2',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'kamis-6',
      type: 'subject',
      jp: 6,
      time: '11:00 - 11:45',
      startTime: '11:00',
      endTime: '11:45',
      subject: 'PPKN-2',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'kamis-break-2',
      type: 'event',
      time: '11:45 - 12:30',
      startTime: '11:45',
      endTime: '12:30',
      label: 'Istirahat II',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'kamis-7',
      type: 'subject',
      jp: 7,
      time: '12:30 - 13:15',
      startTime: '12:30',
      endTime: '13:15',
      subject: 'Bahasa Inggris-27',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'kamis-8',
      type: 'subject',
      jp: 8,
      time: '13:15 - 13:55',
      startTime: '13:15',
      endTime: '13:55',
      subject: 'Bahasa Inggris-27',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'kamis-9',
      type: 'subject',
      jp: 9,
      time: '13:55 - 14:35',
      startTime: '13:55',
      endTime: '14:35',
      subject: 'Bahasa Inggris-27',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'kamis-10',
      type: 'subject',
      jp: 10,
      time: '14:35 - 15:15',
      startTime: '14:35',
      endTime: '15:15',
      subject: 'Ekonomi-4',
      room: 'Ruang 11.3',
      isBreak: false
    }
  ],
  JUMAT: [
    {
      id: 'jumat-0',
      type: 'event',
      time: '06:30 - 07:15',
      startTime: '06:30',
      endTime: '07:15',
      label: 'Jumat Bersih / Sehat / Literasi',
      room: 'Lingkungan Sekolah',
      isBreak: false
    },
    {
      id: 'jumat-1',
      type: 'subject',
      jp: 1,
      time: '07:15 - 08:00',
      startTime: '07:15',
      endTime: '08:00',
      subject: 'PKWU-4',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'jumat-2',
      type: 'subject',
      jp: 2,
      time: '08:00 - 08:45',
      startTime: '08:00',
      endTime: '08:45',
      subject: 'PKWU-4',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'jumat-break-1',
      type: 'event',
      time: '08:45 - 09:15',
      startTime: '08:45',
      endTime: '09:15',
      label: 'Istirahat I',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'jumat-3',
      type: 'subject',
      jp: 3,
      time: '09:15 - 10:00',
      startTime: '09:15',
      endTime: '10:00',
      subject: 'PJOK-20',
      room: 'Lapangan Olahraga',
      isBreak: false
    },
    {
      id: 'jumat-4',
      type: 'subject',
      jp: 4,
      time: '10:00 - 10:45',
      startTime: '10:00',
      endTime: '10:45',
      subject: 'PJOK-20 / Konseling-11',
      room: 'Lapangan / Ruang BK',
      isBreak: false
    },
    {
      id: 'jumat-5',
      type: 'event',
      time: '11:35 - 12:30',
      startTime: '11:35',
      endTime: '12:30',
      label: 'Jumat Ibadah',
      room: 'Aula / Tempat Ibadah',
      isBreak: false
    },
    {
      id: 'jumat-break-2',
      type: 'event',
      time: '12:30 - 13:00',
      startTime: '12:30',
      endTime: '13:00',
      label: 'Istirahat II',
      room: 'Kantin',
      isBreak: true
    },
    {
      id: 'jumat-6',
      type: 'subject',
      jp: 6,
      time: '13:00 - 13:45',
      startTime: '13:00',
      endTime: '13:45',
      subject: 'Geografi-14',
      room: 'Ruang 11.3',
      isBreak: false
    },
    {
      id: 'jumat-7',
      type: 'subject',
      jp: 7,
      time: '13:45 - 14:30',
      startTime: '13:45',
      endTime: '14:30',
      subject: 'Geografi-14',
      room: 'Ruang 11.3',
      isBreak: false
    }
  ]
};

// Helper: Convert "07:30" or "07.30" to total minutes since midnight
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().replace('.', ':');
  const [h, m] = clean.split(':').map((v) => parseInt(v, 10) || 0);
  return h * 60 + m;
}

// Helper: Get day name in Indonesian (SENIN, SELASA, etc.)
export function getDayKeyFromDate(date: Date = new Date()): DayOfWeek {
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  switch (dayIndex) {
    case 1:
      return 'SENIN';
    case 2:
      return 'SELASA';
    case 3:
      return 'RABU';
    case 4:
      return 'KAMIS';
    case 5:
      return 'JUMAT';
    default:
      return 'SENIN'; // Weekend fallback
  }
}

export interface CurrentScheduleStatus {
  dayName: string;
  isTodayWeekend: boolean;
  currentPeriod: ScheduleItem | null;
  nextPeriod: ScheduleItem | null;
  statusText: string;
  timeRemainingMinutes: number | null;
}

export function getCurrentScheduleStatus(now: Date = new Date()): CurrentScheduleStatus {
  const dayIndex = now.getDay();
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = dayNames[dayIndex];

  if (dayIndex === 0 || dayIndex === 6) {
    return {
      dayName,
      isTodayWeekend: true,
      currentPeriod: null,
      nextPeriod: null,
      statusText: 'Akhir Pekan (Hari Libur)',
      timeRemainingMinutes: null
    };
  }

  const dayKey = getDayKeyFromDate(now);
  const daySchedule = scheduleData[dayKey] || [];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentPeriod: ScheduleItem | null = null;
  let nextPeriod: ScheduleItem | null = null;
  let timeRemainingMinutes: number | null = null;

  for (let i = 0; i < daySchedule.length; i++) {
    const item = daySchedule[i];
    const startM = parseTimeToMinutes(item.startTime);
    const endM = parseTimeToMinutes(item.endTime);

    if (currentMinutes >= startM && currentMinutes < endM) {
      currentPeriod = item;
      nextPeriod = daySchedule[i + 1] || null;
      timeRemainingMinutes = endM - currentMinutes;
      return {
        dayName,
        isTodayWeekend: false,
        currentPeriod,
        nextPeriod,
        statusText: `Sedang Berlangsung: ${item.subject || item.label}`,
        timeRemainingMinutes
      };
    }

    if (currentMinutes < startM && !nextPeriod) {
      nextPeriod = item;
      const diff = startM - currentMinutes;
      return {
        dayName,
        isTodayWeekend: false,
        currentPeriod: null,
        nextPeriod,
        statusText: `Pelajaran berikutnya dimulai dalam ${diff} menit`,
        timeRemainingMinutes: diff
      };
    }
  }

  // If before first period
  const firstItem = daySchedule[0];
  if (firstItem && currentMinutes < parseTimeToMinutes(firstItem.startTime)) {
    const diff = parseTimeToMinutes(firstItem.startTime) - currentMinutes;
    return {
      dayName,
      isTodayWeekend: false,
      currentPeriod: null,
      nextPeriod: firstItem,
      statusText: `Sekolah dimulai dalam ${diff} menit`,
      timeRemainingMinutes: diff
    };
  }

  // If after school hours
  return {
    dayName,
    isTodayWeekend: false,
    currentPeriod: null,
    nextPeriod: null,
    statusText: 'Jadwal pelajaran hari ini telah selesai',
    timeRemainingMinutes: null
  };
}

export type { DayOfWeek };
