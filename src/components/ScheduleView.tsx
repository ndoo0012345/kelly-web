import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Sparkles, 
  Coffee, 
  Flag, 
  Award,
  Layers,
  Calendar as CalendarIcon
} from 'lucide-react';
import { scheduleData, getDayKeyFromDate, parseTimeToMinutes, DayOfWeek } from '../data/schedule';
import { ScheduleItem } from '../types';
import { getSubjectColor } from '../utils/subject-colors';

export const ScheduleView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => getDayKeyFromDate());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  const todayKey = getDayKeyFromDate();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const days: DayOfWeek[] = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT'];
  const daySchedule = scheduleData[selectedDay] || [];

  return (
    <div id="schedule-view-container" className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white p-6 sm:p-10 shadow-xl shadow-cyan-500/20 border border-white/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/30 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Schedule Pelajaran Kelas XI.3</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-black/20 text-cyan-200 text-xs font-semibold backdrop-blur-md border border-white/10">
                SMA Cinta Kasih Tzu Chi
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              Schedule Belajar & Agenda Harian
            </h1>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-medium">
              Sistem pewarnaan dinamis per mata pelajaran untuk memudahkan memantau jam pelajaran, ruang lab, serta istirahat.
            </p>
          </div>

          {/* Today Indicator */}
          <div className="p-4 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/25 min-w-[200px] text-center md:text-right shadow-lg">
            <div className="text-[11px] text-cyan-200 uppercase font-extrabold tracking-wider mb-1">
              Hari Ini
            </div>
            <div className="font-heading font-black text-2xl text-white">
              {todayKey}
            </div>
            <div className="text-xs text-white/80 mt-1 font-medium">
              {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </div>
          </div>
        </div>
      </section>

      {/* Control Tabs: Day Selector & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {days.map((day) => {
            const isToday = day === todayKey;
            const isSelected = selectedDay === day && viewMode === 'day';

            return (
              <button
                key={day}
                id={`schedule-tab-${day.toLowerCase()}`}
                onClick={() => {
                  setSelectedDay(day);
                  setViewMode('day');
                }}
                className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-102'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{day}</span>
                {isToday && (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-500'}`} title="Hari ini" />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setViewMode('day')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'day' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Rincian Harian
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'week' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Grid 5 Hari
          </button>
        </div>
      </div>

      {/* View: Single Day Detail with Dynamic Subject Colors */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
              <span>Schedule Hari {selectedDay}</span>
              {selectedDay === todayKey && (
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                  Hari Ini
                </span>
              )}
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              {daySchedule.length} Sesi Schedule
            </span>
          </div>

          <div className="space-y-3.5">
            {daySchedule.map((item) => {
              const startM = parseTimeToMinutes(item.startTime);
              const endM = parseTimeToMinutes(item.endTime);
              const isToday = selectedDay === todayKey;
              const isOngoing = isToday && currentTimeMinutes >= startM && currentTimeMinutes < endM;
              const colorStyle = getSubjectColor(item.subject, item.type === 'event');

              if (item.type === 'event') {
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                      isOngoing
                        ? 'bg-amber-100 border-amber-300 ring-2 ring-amber-400 shadow-md'
                        : 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-200/70 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
                        {item.label?.includes('Upacara') ? (
                          <Flag className="w-5 h-5 text-indigo-700" />
                        ) : (
                          <Coffee className="w-5 h-5 text-amber-700" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-900">
                          {item.label}
                        </h4>
                        {item.room && (
                          <p className="text-xs text-slate-600 mt-0.5 font-medium">{item.room}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700 flex-shrink-0">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{item.time}</span>
                      {isOngoing && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
                          Sedang Berlangsung
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl bg-white border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                    isOngoing
                      ? 'border-indigo-600 ring-2 ring-indigo-500/40 shadow-lg'
                      : `${colorStyle.border} shadow-sm hover:shadow-md`
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    {/* JP badge with subject color */}
                    <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-heading flex-shrink-0 shadow-xs ${colorStyle.iconBg}`}>
                      <span className="text-[9px] uppercase font-bold">JP</span>
                      <span className="text-base font-black leading-none">{item.jp}</span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-heading font-extrabold text-base ${colorStyle.text}`}>
                          {item.subject}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${colorStyle.badge}`}>
                          {item.subject}
                        </span>
                        {isOngoing && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black animate-pulse">
                            Sedang Berlangsung
                          </span>
                        )}
                      </div>

                      {item.kd && (
                        <p className="text-xs text-slate-600 leading-snug font-medium">
                          {item.kd}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                        {item.room && (
                          <div className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{item.room}</span>
                          </div>
                        )}
                        {item.teacher && (
                          <div className="flex items-center gap-1 font-medium">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.teacher}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Time Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>{item.time}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Durasi: 45 Menit / JP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View: 5-Day Weekly Grid Overview with colorful badges */}
      {viewMode === 'week' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {days.map((day) => {
              const sched = scheduleData[day] || [];
              const isToday = day === todayKey;

              return (
                <div
                  key={day}
                  className={`p-4 rounded-3xl bg-white border flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow ${
                    isToday ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{day}</span>
                        {isToday && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Hari Ini</span>}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {sched.map((it) => {
                        const col = getSubjectColor(it.subject, it.type === 'event');
                        return (
                          <div
                            key={it.id}
                            className={`p-2.5 rounded-2xl text-xs border transition-colors ${
                              it.type === 'event'
                                ? 'bg-amber-50/80 border-amber-200 text-amber-900 text-[11px]'
                                : `${col.bg} ${col.border}`
                            }`}
                          >
                            <div className={`font-bold truncate ${it.type === 'event' ? 'text-amber-900' : col.text}`}>
                              {it.type === 'event' ? it.label : it.subject}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5 flex justify-between">
                              <span>{it.time}</span>
                              {it.jp && <span>JP {it.jp}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDay(day);
                      setViewMode('day');
                    }}
                    className="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    Rincian {day}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
