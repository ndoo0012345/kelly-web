import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Code2, 
  Calendar, 
  Gamepad2, 
  Music, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Play, 
  Pause,
  Disc3,
  User,
  GraduationCap,
  Heart,
  FileCode,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import { TaskItem, NavigationTab, TaskStatus } from '../types';
import { useMusic } from '../music/music-state';
import { formatDuration } from '../music/music-utils';
import { Visualizer } from './Visualizer';
import { getCurrentScheduleStatus, CurrentScheduleStatus } from '../data/schedule';
import { getSubjectColor } from '../utils/subject-colors';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onViewTaskDetail?: (task: TaskItem) => void;
  tasks: TaskItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onViewTaskDetail,
  tasks
}) => {
  const { currentTrack, isPlaying, togglePlayPause, library, playTrack, customVinylImage } = useMusic();

  // Schedule Real-time state
  const [scheduleStatus, setScheduleStatus] = useState<CurrentScheduleStatus>(() => getCurrentScheduleStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setScheduleStatus(getCurrentScheduleStatus());
    }, 15000); // Check every 15s
    return () => clearInterval(timer);
  }, []);

  // Quick stats
  const completedCount = tasks.filter((t) => t.status === 'Selesai').length;
  const inProgressCount = tasks.filter((t) => t.status === 'Sedang Dikerjakan').length;
  const pendingCount = tasks.filter((t) => t.status === 'Belum Dikerjakan').length;
  const upcomingTasks = tasks.slice(0, 4);

  const vinylCenterImage = customVinylImage || currentTrack?.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80';

  return (
    <div id="dashboard-view-container" className="space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Banner (Gen Z Vibrant Color Palette) */}
      <section 
        id="hero-welcome-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-pink-500 to-amber-400 text-white p-6 sm:p-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Identity Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md border border-white/30 flex items-center gap-1.5 shadow-xs">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Kelas XI.3 SMA Cinta Kasih Tzu Chi</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-black backdrop-blur-md border border-white/20">
                🍳 Jurusan Tata Boga
              </span>
            </div>

            {/* Main Greeting with Metallic Shimmer Effect */}
            <div className="space-y-1">
              <h2 className="text-xs uppercase tracking-widest text-pink-100 font-extrabold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Digital Workspace & Portfolio</span>
              </h2>
              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white drop-shadow-sm text-metallic">
                Kelly Tham
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-white/95 text-xs sm:text-sm leading-relaxed font-medium">
              Selamat datang di workspace pribadi saya! Di sini saya mendokumentasikan tugas resmi Informatika & Bahasa Indonesia, jadwal pelajaran XI.3, pemutar piringan vinyl bergaya Spotify, dan game arcade interaktif.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-cta-profile"
                onClick={() => onNavigate('profile')}
                className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-heading font-black text-xs sm:text-sm hover:scale-105 active:scale-95 shadow-lg shadow-black/10 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-violet-600" />
                <span>Lihat Profil Kelly</span>
              </button>

              <button
                id="hero-cta-tasks"
                onClick={() => onNavigate('informatika')}
                className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-heading font-bold text-xs sm:text-sm border border-white/30 backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>Buka Tugas ({tasks.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-cta-games"
                onClick={() => onNavigate('games')}
                className="px-5 py-2.5 rounded-full bg-black/30 hover:bg-black/40 text-amber-200 font-heading font-bold text-xs sm:text-sm border border-amber-300/30 backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-yellow-300" />
                <span>Main Arcade Games</span>
              </button>
            </div>
          </div>

          {/* Right Circular Avatar Monogram */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <div className="relative group cursor-pointer" onClick={() => onNavigate('profile')}>
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-yellow-300 via-pink-400 to-cyan-300 p-1.5 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center text-center p-3 border-2 border-white/20">
                  <div className="font-heading font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-white text-metallic">
                    KT
                  </div>
                  <div className="mt-1 font-black text-xs text-white">
                    Kelly Tham
                  </div>
                  <div className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">
                    Tata Boga XI.3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Action Cards (Bright Gen Z Cards) */}
      <section id="quick-access-cards" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Informatika */}
        <button
          id="card-informatika-link"
          onClick={() => onNavigate('informatika')}
          className="p-5 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-emerald-300 hover:scale-102 transition-all duration-200 text-left group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
            Informatika
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Kriptografi, Coding & Tugas
          </p>
        </button>

        {/* Bahasa Indonesia */}
        <button
          id="card-bindo-link"
          onClick={() => onNavigate('bindo')}
          className="p-5 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-pink-300 hover:scale-102 transition-all duration-200 text-left group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold mb-3 group-hover:bg-pink-600 group-hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-sm text-slate-900 group-hover:text-pink-600 transition-colors">
            Bahasa Indonesia
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Resensi Novel & Esai Karya
          </p>
        </button>

        {/* Jadwal Pelajaran */}
        <button
          id="card-schedule-link"
          onClick={() => onNavigate('schedule')}
          className="p-5 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-indigo-300 hover:scale-102 transition-all duration-200 text-left group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
            Jadwal XI.3
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Live Tracker & Warna Mapel
          </p>
        </button>

        {/* Arcade Games */}
        <button
          id="card-games-link"
          onClick={() => onNavigate('games')}
          className="p-5 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-amber-300 hover:scale-102 transition-all duration-200 text-left group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
            Arcade Games
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            5 Game Mini Seru & Santai
          </p>
        </button>
      </section>

      {/* Main Grid: Live Schedule Status & Spotify Vinyl Widget */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Realtime Schedule Tracker Card */}
        <div 
          id="schedule-status-card"
          className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Status Jadwal Kelas XI.3 Hari Ini
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {scheduleStatus.dayName} · Pembaruan waktu otomatis
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('schedule')}
                className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Lihat Semua Jadwal →
              </button>
            </div>

            {/* Current & Next Status Banner */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ongoing Period */}
              {(() => {
                const ongoingColor = getSubjectColor(scheduleStatus.currentPeriod?.subject, scheduleStatus.currentPeriod?.type === 'event');
                return (
                  <div className={`p-4 rounded-3xl border transition-all ${
                    scheduleStatus.currentPeriod ? `${ongoingColor.bg} ${ongoingColor.border}` : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700 uppercase tracking-wider mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>Sedang Berlangsung</span>
                    </div>
                    {scheduleStatus.currentPeriod ? (
                      <div>
                        <h4 className={`font-heading font-black text-base ${ongoingColor.text}`}>
                          {scheduleStatus.currentPeriod.subject || scheduleStatus.currentPeriod.label}
                        </h4>
                        <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 font-medium">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{scheduleStatus.currentPeriod.time}</span>
                          {scheduleStatus.currentPeriod.jp && (
                            <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-indigo-800 border border-indigo-200 shadow-xs">
                              JP {scheduleStatus.currentPeriod.jp}
                            </span>
                          )}
                        </div>
                        {scheduleStatus.timeRemainingMinutes && (
                          <p className="text-[11px] text-emerald-700 font-bold mt-2">
                            Sisa waktu: {scheduleStatus.timeRemainingMinutes} menit
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 py-2 font-medium">
                        {scheduleStatus.isTodayWeekend
                          ? 'Hari libur akhir pekan! Waktunya relaks & berkarya.'
                          : 'Tidak ada jam pelajaran aktif saat ini.'}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Next Period */}
              {(() => {
                const nextColor = getSubjectColor(scheduleStatus.nextPeriod?.subject, scheduleStatus.nextPeriod?.type === 'event');
                return (
                  <div className={`p-4 rounded-3xl border transition-all ${
                    scheduleStatus.nextPeriod ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                      Pelajaran Berikutnya
                    </div>
                    {scheduleStatus.nextPeriod ? (
                      <div>
                        <h4 className="font-heading font-extrabold text-base text-slate-900">
                          {scheduleStatus.nextPeriod.subject || scheduleStatus.nextPeriod.label}
                        </h4>
                        <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{scheduleStatus.nextPeriod.time}</span>
                          {scheduleStatus.nextPeriod.room && (
                            <span className="text-[11px] text-slate-500 font-medium">
                              ({scheduleStatus.nextPeriod.room})
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 py-2 font-medium">
                        Tidak ada sesi berikutnya untuk hari ini.
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Status: <strong className="text-slate-800 font-bold">{scheduleStatus.statusText}</strong></span>
            <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-lg font-bold">Kelas XI.3 SMA</span>
          </div>
        </div>

        {/* Currently Playing / Spotify Vinyl Widget */}
        <div 
          id="currently-playing-widget"
          className="p-6 rounded-3xl bg-[#121212] text-white shadow-2xl border border-[#282828] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div className="flex items-center gap-2 text-xs font-black text-[#1DB954] uppercase tracking-wider">
                <Disc3 className="w-4 h-4" />
                <span>Spotify Turntable</span>
              </div>
              <button
                onClick={() => onNavigate('music')}
                className="text-xs text-slate-400 hover:text-[#1DB954] transition-colors font-bold cursor-pointer"
              >
                Studio →
              </button>
            </div>

            {currentTrack ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3.5">
                  {/* Spinning Vinyl Disc Mini */}
                  <div 
                    onClick={() => onNavigate('music')}
                    className={`w-14 h-14 rounded-full bg-black border-2 border-slate-700 flex items-center justify-center relative flex-shrink-0 shadow-lg cursor-pointer ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '4s' }}
                  >
                    <img
                      src={vinylCenterImage}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="w-1.5 h-1.5 rounded-full bg-white absolute border border-black" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-black text-sm text-white truncate" title={currentTrack.title}>
                      {currentTrack.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate font-medium">{currentTrack.artist}</p>
                    <p className="text-[10px] text-[#1DB954] font-mono mt-0.5 font-bold">
                      {formatDuration(currentTrack.duration)}
                    </p>
                  </div>
                </div>

                {/* Visualizer */}
                <div className="h-8 flex items-center justify-center">
                  <Visualizer isPlaying={isPlaying} barCount={20} className="w-full" color="#1DB954" />
                </div>

                {/* Quick Toggle */}
                <button
                  onClick={togglePlayPause}
                  className="w-full py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md shadow-[#1DB954]/20 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  <span>{isPlaying ? 'Jeda Musik' : 'Putar Musik'}</span>
                </button>
              </div>
            ) : (
              <div className="mt-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-slate-500">
                  <Disc3 className="w-6 h-6 animate-spin-slow" />
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Belum ada lagu diputar.
                </p>
                {library.length > 0 && (
                  <button
                    onClick={() => playTrack(library[0])}
                    className="px-4 py-2 rounded-full bg-[#1DB954] text-black text-xs font-black hover:bg-[#1ed760] transition-colors cursor-pointer"
                  >
                    Putar Koleksi ({library.length} lagu)
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#282828] text-[11px] text-slate-500 flex items-center justify-between font-mono">
            <span>Spotify Vibe</span>
            <span className="text-[#1DB954] font-bold">Custom Vinyl</span>
          </div>
        </div>
      </section>

      {/* Real Tasks Grid from Official Workspace (Clickable for rich detail modal) */}
      <section id="dashboard-tasks-section" className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-black text-base text-slate-900">
              Daftar Tugas Aktif ({tasks.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Data resmi dari personal-workspace-mu.vercel.app ({completedCount} selesai, {inProgressCount} proses, {pendingCount} antrean)
            </p>
          </div>
          <button
            onClick={() => onNavigate('informatika')}
            className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Semua Tugas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => {
                if (onViewTaskDetail) {
                  onViewTaskDetail(task);
                } else {
                  onNavigate(task.subject === 'Informatika' ? 'informatika' : 'bindo');
                }
              }}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-violet-50/50 border border-slate-200/70 hover:border-violet-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    task.subject === 'Informatika'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-pink-100 text-pink-800 border border-pink-200'
                  }`}>
                    {task.subject}
                  </span>
                  <span className={`text-[10px] font-bold ${
                    task.status === 'Sedang Dikerjakan' ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                  {task.title}
                </h4>
              </div>
              <div className="text-right flex-shrink-0 flex items-center gap-2">
                <div>
                  <div className="text-[11px] font-bold text-slate-700">
                    {task.deadline}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{task.type}</span>
                </div>
                <span className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-violet-600 group-hover:border-violet-200 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
