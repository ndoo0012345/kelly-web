import React, { useState } from 'react';
import { 
  Code2, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Filter,
  CheckCircle,
  FileCode,
  Terminal,
  FolderGit2,
  Eye,
  Paperclip
} from 'lucide-react';
import { TaskItem, TaskStatus } from '../types';

interface InformatikaViewProps {
  tasks: TaskItem[];
  onAddTask: () => void;
  onViewTaskDetail: (task: TaskItem) => void;
  onEditTask: (task: TaskItem) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const InformatikaView: React.FC<InformatikaViewProps> = ({
  tasks,
  onAddTask,
  onViewTaskDetail,
  onEditTask,
  onUpdateStatus,
  onDeleteTask
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const infTasks = tasks.filter((t) => t.subject === 'Informatika');

  const filteredTasks = infTasks.filter((task) => {
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completed = infTasks.filter((t) => t.status === 'Selesai').length;
  const inProgress = infTasks.filter((t) => t.status === 'Sedang Dikerjakan').length;
  const pending = infTasks.filter((t) => t.status === 'Belum Dikerjakan').length;
  const total = infTasks.length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div id="informatika-view-container" className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B1120] text-white p-6 sm:p-10 shadow-2xl border border-slate-700/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Mata Pelajaran Informatika</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold backdrop-blur-md border border-white/15">
                Kelas XI.3 SMA Tzu Chi
              </span>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
              Dokumentasi Tugas & Proyek Informatika
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              Data resmi dari personal-workspace-mu.vercel.app mencakup implementasi Kriptografi Caesar Cipher, Vibe Coding, Keamanan Jaringan, dan Algoritma. Klik tugas untuk membuka detail materi & kode lengkap.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/15 min-w-[220px] flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
              <span className="font-bold">Progres Tugas</span>
              <span className="font-black text-emerald-400 font-mono text-sm">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
              <span className="text-emerald-400">{completed} Selesai</span>
              <span className="text-amber-400">{inProgress} Proses</span>
              <span className="text-slate-400">{pending} Tunggu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Bar: Search, Filters, Add Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas, topik, kode..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400 shadow-xs font-medium"
          />
        </div>

        {/* Filter Pills & Add Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `Semua (${infTasks.length})` },
            { id: 'Selesai', label: `Selesai (${completed})` },
            { id: 'Sedang Dikerjakan', label: `Dikerjakan (${inProgress})` },
            { id: 'Belum Dikerjakan', label: `Menunggu (${pending})` },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterStatus(pill.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === pill.id
                  ? 'bg-slate-900 text-emerald-400 shadow-md border border-slate-800'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}

          <button
            id="add-informatika-task-btn"
            onClick={onAddTask}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md ml-auto flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Task List Grid */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-slate-700 text-sm">
            Tidak ada tugas informatika ditemukan
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery ? 'Coba gunakan kata kunci pencarian yang lain.' : 'Mulai tambahkan tugas baru menggunakan tombol di atas.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'Selesai';
            const isInProgress = task.status === 'Sedang Dikerjakan';

            return (
              <div
                key={task.id}
                onClick={() => onViewTaskDetail(task)}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-400 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-extrabold border border-emerald-200">
                      {task.type}
                    </span>

                    {/* Status Dropdown / Switcher */}
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                      className={`text-xs font-black px-3 py-1 rounded-full border focus:outline-none cursor-pointer ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : isInProgress
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                      <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-heading font-black text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium line-clamp-3">
                      {task.description}
                    </p>
                  </div>

                  {/* Metadata Chips & Attachments */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {task.attachments && task.attachments.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        <span>{task.attachments.length} Berkas</span>
                      </span>
                    )}
                    {task.code && (
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-emerald-400 text-[10px] font-mono font-bold">
                        &lt;/&gt; Code
                      </span>
                    )}
                    {task.score && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        Nilai: {task.score}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Dates & Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tenggat: <strong className="text-slate-800 font-bold">{task.deadline}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewTaskDetail(task)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Buka Detail Lengkap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka</span>
                    </button>

                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Edit Tugas"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus tugas "${task.title}"?`)) {
                          onDeleteTask(task.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus Tugas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
