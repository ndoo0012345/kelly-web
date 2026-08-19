import React, { useState, useEffect } from 'react';
import { X, Music2, Check, AlertCircle } from 'lucide-react';
import { MusicTrack } from '../types';
import { generateCoverArt } from '../music/music-utils';

interface MetadataModalProps {
  track: MusicTrack | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTrack: MusicTrack) => Promise<void>;
}

export const MetadataModal: React.FC<MetadataModalProps> = ({
  track,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (track) {
      setTitle(track.title || '');
      setArtist(track.artist || '');
      setAlbum(track.album || '');
      setGenre(track.genre || '');
    }
    setError('');
  }, [track, isOpen]);

  if (!isOpen || !track) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul lagu tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    try {
      const newCover = generateCoverArt(title.trim(), artist.trim() || 'Unknown Artist', track.id);
      const updatedTrack: MusicTrack = {
        ...track,
        title: title.trim(),
        artist: artist.trim() || 'Unknown Artist',
        album: album.trim() || 'Single Collection',
        genre: genre.trim() || 'General',
        cover: newCover,
        updatedAt: Date.now()
      };

      await onSave(updatedTrack);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan perubahan metadata.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="metadata-modal-card"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E7EBF5] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="p-4 sm:p-5 border-b border-[#E7EBF5] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2F4874]/10 text-[#2F4874] flex items-center justify-center">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#101826]">
                Edit Metadata Lagu
              </h3>
              <p className="text-xs text-slate-500">Perbarui informasi lagu di IndexedDB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Lagu *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Artis / Penyanyi</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Album</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2F4874] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            Berkas Asli: <span className="font-mono text-slate-600">{track.fileName}</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2F4874] text-white hover:bg-[#1E3153] disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
