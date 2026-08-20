import React, { useState, useEffect, useRef } from 'react';
import { X, Music2, Check, AlertCircle, Image as ImageIcon, Upload, RotateCcw } from 'lucide-react';
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
  const [coverImage, setCoverImage] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (track) {
      setTitle(track.title || '');
      setArtist(track.artist || '');
      setAlbum(track.album || '');
      setGenre(track.genre || '');
      setCoverImage(track.cover || generateCoverArt(track.title, track.artist, track.id));
    }
    setError('');
  }, [track, isOpen]);

  if (!isOpen || !track) return null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCoverImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetCover = () => {
    const defaultCover = generateCoverArt(title || track.title, artist || track.artist, track.id);
    setCoverImage(defaultCover);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul lagu tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    try {
      const finalCover = coverImage || generateCoverArt(title.trim(), artist.trim() || 'Unknown Artist', track.id);
      const updatedTrack: MusicTrack = {
        ...track,
        title: title.trim(),
        artist: artist.trim() || 'Unknown Artist',
        album: album.trim() || 'Single Collection',
        genre: genre.trim() || 'General',
        cover: finalCover,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="metadata-modal-card"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E7EBF5] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="p-4 sm:p-5 border-b border-[#E7EBF5] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#1DB954]/15 text-[#1DB954] flex items-center justify-center">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-900">
                Edit Metadata & Vinyl Lagu
              </h3>
              <p className="text-xs text-slate-500 font-medium">Perbarui info dan gambar cover vinyl untuk lagu ini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Vinyl Image Preview & Upload Row */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="relative group w-16 h-16 rounded-full bg-black border-2 border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              <img 
                src={coverImage || track.cover} 
                alt="Vinyl Cover Preview" 
                className="w-full h-full object-cover" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity"
                title="Ganti Gambar Vinyl"
              >
                <Upload className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="text-xs font-black text-slate-800">
                Gambar Cover Vinyl Lagu
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>Upload Gambar</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetCover}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reset ke cover default"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Lagu *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1DB954] focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Artis / Penyanyi</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1DB954] focus:outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Album</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1DB954] focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1DB954] focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="pt-1 text-xs text-slate-400">
            Berkas Asli: <span className="font-mono text-slate-600 font-semibold">{track.fileName}</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-black bg-[#1DB954] text-black hover:bg-[#1ed760] disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
