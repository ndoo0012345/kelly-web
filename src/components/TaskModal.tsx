import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, Tag, BookOpen, ExternalLink, AlertCircle } from 'lucide-react';
import { TaskItem, TaskStatus, TaskSubject } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskItem) => void;
  onDelete?: (taskId: string) => void;
  initialTask?: TaskItem | null;
  defaultSubject?: TaskSubject;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTask,
  defaultSubject = 'Informatika'
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<TaskSubject>(defaultSubject);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Tugas Praktik');
  const [status, setStatus] = useState<TaskStatus>('Belum Dikerjakan');
  const [date, setDate] = useState('18 Feb 2026');
  const [deadline, setDeadline] = useState('28 Feb 2026');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setSubject(initialTask.subject);
      setDescription(initialTask.description);
      setType(initialTask.type);
      setStatus(initialTask.status);
      setDate(initialTask.date);
      setDeadline(initialTask.deadline);
      setUrl(initialTask.url || '');
    } else {
      setTitle('');
      setSubject(defaultSubject);
      setDescription('');
      setType(defaultSubject === 'Informatika' ? 'Proyek Praktik' : 'Karya Tulis / Esai');
      setStatus('Belum Dikerjakan');
      setDate(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }));
      setDeadline('28 Feb 2026');
      setUrl('');
    }
    setError('');
  }, [initialTask, defaultSubject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul tugas wajib diisi.');
      return;
    }

    const task: TaskItem = {
      id: initialTask?.id || `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      subject,
      description: description.trim(),
      type: type.trim(),
      status,
      date,
      deadline,
      url: url.trim() || undefined,
      metadata: initialTask?.metadata || {
        lastEdited: new Date().toISOString()
      }
    };

    onSave(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="task-modal-card"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E7EBF5] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E7EBF5] flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2F4874]/10 text-[#2F4874] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#101826]">
                {initialTask ? 'Edit Tugas' : 'Tambah Tugas Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Dokumentasikan tugas sekolah ke dalam Digital Workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Subject & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as TaskSubject)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none"
              >
                <option value="Informatika">Informatika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Pengerjaan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none"
              >
                <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Tugas / Proyek *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Membuat Algoritma Sorting Data Web"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Type & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori / Tipe</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Contoh: Tugas Praktik, Resensi, Esai"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tenggat Waktu (Deadline)</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="28 Feb 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi / Detail Tugas</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rincian instruksi guru, file yang perlu disiapkan, atau catatan langkah kerja..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* URL / Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tautan / Referensi Dokumen (Opsional)</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {initialTask && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Yakin ingin menghapus tugas ini?')) {
                    onDelete(initialTask.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
              >
                Hapus Tugas
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2F4874] text-white hover:bg-[#1E3153] shadow-sm transition-all"
              >
                Simpan Tugas
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
