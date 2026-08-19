import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Tag, 
  BookOpen, 
  Code2, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  Paperclip, 
  Download,
  Share2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { TaskItem, TaskStatus } from '../types';

interface TaskDetailModalProps {
  isOpen: boolean;
  task: TaskItem | null;
  onClose: () => void;
  onEdit: (task: TaskItem) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  task,
  onClose,
  onEdit,
  onUpdateStatus,
  onDelete
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  const handleCopyCode = () => {
    if (task.code) {
      navigator.clipboard.writeText(task.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSimulateDownload = (fileName: string) => {
    setDownloadSuccess(fileName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const statusColors: Record<TaskStatus, { bg: string; text: string; border: string }> = {
    'Selesai': {
      bg: 'bg-emerald-50 text-emerald-700',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    'Sedang Dikerjakan': {
      bg: 'bg-amber-50 text-amber-700',
      text: 'text-amber-700',
      border: 'border-amber-200'
    },
    'Belum Dikerjakan': {
      bg: 'bg-slate-100 text-slate-700',
      text: 'text-slate-700',
      border: 'border-slate-300'
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="task-detail-modal-card"
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
      >
        {/* Header Cover & Quick Actions */}
        <div className="relative">
          {task.cover ? (
            <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-slate-900">
              <img 
                src={task.cover} 
                alt={task.title} 
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>
          ) : (
            <div className={`h-36 w-full ${
              task.subject === 'Informatika'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600'
                : 'bg-gradient-to-r from-orange-500 via-pink-600 to-rose-600'
            } relative`}>
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}

          {/* Close & Edit Floating Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Edit Tugas"
            >
              <Edit3 className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subject & Category Floating Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black backdrop-blur-md shadow-sm border ${
                task.subject === 'Informatika'
                  ? 'bg-emerald-500/90 text-white border-emerald-400'
                  : 'bg-orange-500/90 text-white border-orange-400'
              }`}>
                {task.subject}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 text-white/90 text-xs font-bold backdrop-blur-md border border-white/20">
                {task.type}
              </span>
            </div>

            {/* Status Selector Pill */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20">
              {(['Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai'] as TaskStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(task.id, st)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                    task.status === st
                      ? st === 'Selesai'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : st === 'Sedang Dikerjakan'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'bg-slate-300 text-slate-900 shadow-xs'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-slate-800">
          {/* Title & Metadata */}
          <div className="space-y-2">
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
              {task.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Dibuat: {task.date || task.createdAt || 'Juli 2026'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-pink-500" />
                <span className="font-semibold text-slate-700">Tenggat: {task.deadline}</span>
              </div>
              {task.score && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                  <span>Nilai: {task.score}/100</span>
                </div>
              )}
            </div>
          </div>

          {/* Description Summary */}
          {task.description && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
              <span className="font-bold block text-indigo-900 text-[11px] uppercase tracking-wider mb-1">
                Ringkasan Tugas
              </span>
              {task.description}
            </div>
          )}

          {/* Full Article Content */}
          {task.content && (
            <div className="space-y-4 pt-2">
              <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-violet-600" />
                <span>Isi & Materi Pembahasan</span>
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                {task.content}
              </div>
            </div>
          )}

          {/* Code Snippet Box (If Programming / Informatika) */}
          {task.code && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>Implementasi Kode Program</span>
                </h4>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 text-emerald-400 p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 leading-relaxed">
                <pre>{task.code}</pre>
              </div>
            </div>
          )}

          {/* Attachments / Files */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <span>Berkas Lampiran ({task.attachments.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {task.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-all flex-1 min-w-[220px]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{file}</span>
                    </div>
                    <button
                      onClick={() => handleSimulateDownload(file)}
                      className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh</span>
                    </button>
                  </div>
                ))}
              </div>
              {downloadSuccess && (
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>File "{downloadSuccess}" berhasil diunduh ke perangkat Anda.</span>
                </p>
              )}
            </div>
          )}

          {/* External URL Reference */}
          {task.url && (
            <div className="pt-2">
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-violet-100 hover:text-violet-900 text-xs font-bold text-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Tautan Referensi Tugas ({task.url})</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          {onDelete ? (
            <button
              onClick={() => {
                if (confirm(`Hapus tugas "${task.title}"?`)) {
                  onDelete(task.id);
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Tugas</span>
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Data Tugas</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-black text-xs font-black transition-all cursor-pointer shadow-md"
            >
              Tutup Modal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
