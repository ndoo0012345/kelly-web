import React, { useState, useRef } from 'react';
import { 
  Music, 
  UploadCloud, 
  Play, 
  Pause, 
  Heart, 
  Plus, 
  Trash2, 
  Edit3, 
  ListMusic, 
  Search, 
  SlidersHorizontal, 
  FolderPlus, 
  Volume2, 
  Radio, 
  Sparkles, 
  Disc3, 
  Check, 
  AlertCircle,
  FileAudio,
  MoreVertical,
  ListPlus,
  Compass,
  Image as ImageIcon,
  RotateCcw,
  Palette,
  Upload
} from 'lucide-react';
import { useMusic } from '../music/music-state';
import { MusicTrack, Playlist } from '../types';
import { formatDuration, generateCoverArt } from '../music/music-utils';
import { Visualizer } from './Visualizer';
import { MetadataModal } from './MetadataModal';

export const MusicView: React.FC = () => {
  const {
    library,
    playlists,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    customVinylImage,
    uploadVinylImage,
    uploadTrackCover,
    updateTrackCover,
    resetVinylImage,
    setCustomVinylImage,
    playTrack,
    togglePlayPause,
    toggleFavorite,
    deleteTrack,
    updateMetadata,
    uploadFiles,
    addToQueue,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    seedDefaultTracks,
    isLoading
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showVinylCustomizer, setShowVinylCustomizer] = useState(false);
  const [targetTrackForUpload, setTargetTrackForUpload] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const vinylImageInputRef = useRef<HTMLInputElement | null>(null);
  const trackVinylInputRef = useRef<HTMLInputElement | null>(null);

  // Filter tracks based on active tab & search
  const displayedTracks = library.filter((track) => {
    // Tab filter
    if (activeTab === 'favorites' && !track.favorite) {
      return false;
    }
    if (activeTab !== 'all' && activeTab !== 'favorites') {
      const targetPlaylist = playlists.find((p) => p.id === activeTab);
      if (targetPlaylist && !targetPlaylist.trackIds.includes(track.id)) {
        return false;
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.album.toLowerCase().includes(q) ||
        track.genre?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const added = await uploadFiles(files);
      setStatusMessage(`Berhasil menambahkan ${added.length} file audio ke IndexedDB!`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(`Gagal mengunggah file: ${err.message}`);
    }
  };

  const handleVinylImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (currentTrack) {
          // Update the specific currently playing track vinyl
          await uploadTrackCover(currentTrack.id, file);
          setStatusMessage(`Cover vinyl untuk "${currentTrack.title}" berhasil diperbarui!`);
        } else {
          await uploadVinylImage(file);
          setStatusMessage('Gambar cover piringan vinyl berhasil diperbarui!');
        }
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err: any) {
        alert('Gagal mengunggah gambar vinyl: ' + err.message);
      }
    }
  };

  const handleTrackVinylUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetTrackForUpload) {
      try {
        const track = library.find((t) => t.id === targetTrackForUpload);
        await uploadTrackCover(targetTrackForUpload, file);
        setStatusMessage(`Cover vinyl untuk "${track?.title || 'lagu'}" berhasil diperbarui!`);
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err: any) {
        alert('Gagal mengunggah gambar vinyl track: ' + err.message);
      } finally {
        setTargetTrackForUpload(null);
      }
    }
  };

  const handleApplyPreset = async (presetUrl: string, presetName: string) => {
    if (currentTrack) {
      await updateTrackCover(currentTrack.id, presetUrl);
      setStatusMessage(`Preset "${presetName}" diterapkan ke vinyl "${currentTrack.title}"!`);
    } else {
      setCustomVinylImage(presetUrl);
      setStatusMessage(`Preset "${presetName}" diterapkan ke vinyl turntable!`);
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    await createPlaylist(newPlaylistName.trim(), 'Koleksi playlist musik studi Kelly');
    setNewPlaylistName('');
    setShowNewPlaylistInput(false);
  };

  // Vinyl cover image to show: current track's specific cover, or custom uploaded one, or default vinyl placeholder
  const activeVinylCenter = currentTrack?.cover || customVinylImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80';

  const vinylPresets = [
    { name: 'Spotify Emerald', url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80' },
    { name: 'Neon Cyberpunk', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80' },
    { name: 'Pastry & Vibe', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80' },
    { name: 'Lo-Fi Chill', url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80' }
  ];

  return (
    <div id="music-view-container" className="space-y-8 animate-fade-in pb-16">
      {/* Edit Metadata Modal */}
      <MetadataModal
        track={editingTrack}
        isOpen={!!editingTrack}
        onClose={() => setEditingTrack(null)}
        onSave={async (updated) => {
          await updateMetadata(updated);
          setEditingTrack(null);
        }}
      />

      {/* Music Header & Turntable Hero Section (Spotify Theme) */}
      <section 
        id="music-header-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0d0d0d] text-white p-6 sm:p-10 shadow-2xl border border-[#282828]"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1DB954]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-xs font-black border border-[#1DB954]/30 flex items-center gap-1.5">
                <Disc3 className="w-3.5 h-3.5" />
                <span>Spotify Vibe Turntable</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold backdrop-blur-md border border-white/15">
                ⚡ HTML5 Audio Engine & Vinyl Per Lagu
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Music Studio <span className="text-[#1DB954]">&</span> Vinyl Player
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              Pemutar musik audio lokal bertema Spotify dengan piringan vinyl berputar secara realistis. Anda dapat mengunggah musik favorit serta <strong>mengunggah gambar cover kustom per vinyl untuk setiap lagu</strong>!
            </p>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="upload-track-trigger-btn"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-full bg-[#1DB954] text-black font-heading font-black text-xs sm:text-sm hover:bg-[#1ed760] hover:scale-105 active:scale-95 shadow-lg shadow-[#1DB954]/30 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Unggah Lagu MP3/WAV</span>
              </button>

              <button
                id="custom-vinyl-trigger-btn"
                onClick={() => vinylImageInputRef.current?.click()}
                className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-heading font-bold text-xs sm:text-sm border border-white/25 backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
                title={currentTrack ? `Upload gambar vinyl untuk "${currentTrack.title}"` : 'Upload gambar vinyl'}
              >
                <ImageIcon className="w-4 h-4 text-pink-400" />
                <span>{currentTrack ? 'Ganti Vinyl Lagu Ini' : 'Upload Gambar Vinyl'}</span>
              </button>

              <button
                id="seed-ambient-sample-btn"
                onClick={seedDefaultTracks}
                className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white font-heading font-semibold text-xs border border-white/10 backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Muat Preset Audio</span>
              </button>
            </div>
          </div>

          {/* Current Track Live TURNTABLE Showcase Box */}
          <div className="w-full lg:w-96 rounded-3xl bg-[#181818]/95 backdrop-blur-xl border border-[#282828] p-6 flex flex-col justify-between shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-[#1DB954] uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Turntable Vinyl</span>
                </span>
                {currentTrack && (
                  <span className="px-2 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-bold border border-[#1DB954]/30">
                    Live Vinyl
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => vinylImageInputRef.current?.click()}
                  className="text-slate-400 hover:text-[#1DB954] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Ganti Gambar Vinyl Lagu Ini"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ganti Vinyl</span>
                </button>
                {currentTrack && (
                  <button
                    onClick={() => {
                      const defaultCover = generateCoverArt(currentTrack.title, currentTrack.artist, currentTrack.id);
                      updateTrackCover(currentTrack.id, defaultCover);
                      setStatusMessage(`Cover vinyl "${currentTrack.title}" dikembalikan ke default.`);
                      setTimeout(() => setStatusMessage(null), 2500);
                    }}
                    className="text-slate-400 hover:text-red-400 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset ke Cover Default Lagu"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="py-2 flex flex-col items-center text-center space-y-4">
              {/* Large Spinning Vinyl Turntable with Grooves & Shiny Reflection */}
              <div className="relative group cursor-pointer" onClick={togglePlayPause}>
                <div 
                  className={`w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-black border-4 border-[#282828] shadow-2xl flex items-center justify-center relative overflow-hidden transition-transform ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '4.5s' }}
                >
                  {/* Concentric Vinyl Grooves */}
                  <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute inset-5 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-8 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute inset-11 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-14 rounded-full border border-white/10 pointer-events-none" />

                  {/* Vinyl Sheen/Gloss Highlight Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                  {/* Custom Vinyl / Album Art in the Center */}
                  <img
                    src={activeVinylCenter}
                    alt="Vinyl Center Label"
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover z-10 shadow-lg border-2 border-[#121212]"
                  />

                  {/* Silver Center Spindle */}
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 border-2 border-slate-950 absolute z-20 shadow-inner" />
                </div>

                {/* Play / Pause Center Overlay Button on Hover */}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity z-30">
                  <div className="w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </div>
                </div>
              </div>

              {currentTrack ? (
                <div className="min-w-0 w-full space-y-1">
                  <h4 className="font-heading font-black text-base text-white truncate" title={currentTrack.title}>
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
                  <div className="text-[11px] text-[#1DB954] font-mono font-bold pt-1">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                  </div>
                </div>
              ) : (
                <div className="min-w-0 w-full space-y-1">
                  <h4 className="font-heading font-black text-sm text-white">Turntable Siap Diputar</h4>
                  <p className="text-xs text-slate-400">Pilih lagu dari pustaka di bawah untuk memulai.</p>
                </div>
              )}

              <div className="w-full h-8 flex items-center justify-center">
                <Visualizer isPlaying={isPlaying} barCount={28} className="w-full" color="#1DB954" />
              </div>
            </div>

            {/* Vinyl Presets Selection Strip */}
            <div className="pt-3 border-t border-[#282828] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold flex items-center gap-1">
                  <Palette className="w-3 h-3 text-pink-400" />
                  <span>Preset Vinyl Art</span>
                </span>
                <span className="text-[10px] text-slate-500">{library.length} Lagu Lokal</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {vinylPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(preset.url, preset.name)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                  >
                    <img src={preset.url} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/aac,audio/mpeg,.mp3,.wav,.ogg,.m4a,.aac"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />

      <input
        ref={vinylImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleVinylImageUpload}
        className="hidden"
      />

      <input
        ref={trackVinylInputRef}
        type="file"
        accept="image/*"
        onChange={handleTrackVinylUpload}
        className="hidden"
      />

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-[#1DB954]/15 border border-[#1DB954]/40 text-[#1DB954] text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in shadow-md">
          <Check className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Drag & Drop Upload Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all duration-200 text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
          isDragging
            ? 'border-[#1DB954] bg-[#1DB954]/10 scale-[1.01]'
            : 'border-slate-300 hover:border-[#1DB954] bg-white hover:bg-slate-50/50 shadow-xs'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1DB954] flex items-center justify-center mb-1">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-black text-sm text-slate-900">
          Tarik & Lepas File Musik ke Sini atau Klik untuk Memilih
        </h3>
        <p className="text-xs text-slate-500 max-w-md font-medium">
          Mendukung format <strong>.MP3, .WAV, .OGG, .M4A, .AAC</strong>. Semua lagu tersimpan aman di IndexedDB browser Anda.
        </p>
      </div>

      {/* Library Controls: Search & Playlist Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Playlist & Filter Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#121212] text-[#1DB954] shadow-md border border-black'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Semua Lagu ({library.length})
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#121212] text-[#1DB954] shadow-md border border-black'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Favorit ({library.filter((t) => t.favorite).length})</span>
            </button>

            {/* Custom Playlists */}
            {playlists.map((pl) => (
              <div key={pl.id} className="relative group/pl">
                <button
                  onClick={() => setActiveTab(pl.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === pl.id
                      ? 'bg-[#121212] text-[#1DB954] shadow-md border border-black'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span>{pl.name} ({pl.trackIds.length})</span>
                </button>
              </div>
            ))}

            {/* Create Playlist Button */}
            <button
              onClick={() => setShowNewPlaylistInput(!showNewPlaylistInput)}
              className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1 flex-shrink-0 cursor-pointer"
              title="Buat Playlist Baru"
            >
              <FolderPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Playlist</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lagu, artis, album..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-[#1DB954] focus:outline-none placeholder:text-slate-400 shadow-xs font-medium"
            />
          </div>
        </div>

        {/* New Playlist Creator Input Bar */}
        {showNewPlaylistInput && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center gap-3 animate-fade-in">
            <FolderPlus className="w-5 h-5 text-emerald-600" />
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              placeholder="Masukkan nama playlist baru (cth: Belajar Santai, Pastry Baking Vibe)..."
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleCreatePlaylist}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
            >
              Buat
            </button>
            <button
              onClick={() => setShowNewPlaylistInput(false)}
              className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-medium cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}
      </div>

      {/* Tracks Table (Spotify Layout) */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        {displayedTracks.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <Music className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-slate-700 text-base">
              Tidak ada lagu di bagian ini
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Unggah berkas lagu audio MP3/WAV kamu, atau klik "Muat Preset Audio Studi" untuk mendengarkan lagu instan!
            </p>
            <button
              onClick={seedDefaultTracks}
              className="px-5 py-2.5 rounded-full bg-[#1DB954] text-black text-xs font-bold hover:bg-[#1ed760] transition-colors shadow-md cursor-pointer"
            >
              Muat Preset Musik Studi
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Table Header */}
            <div className="px-6 py-3 bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6 sm:col-span-5">Judul & Vinyl Cover</div>
              <div className="hidden sm:block sm:col-span-3">Album / Genre</div>
              <div className="col-span-3 sm:col-span-2 text-right">Durasi</div>
              <div className="col-span-2 sm:col-span-1 text-right">Aksi</div>
            </div>

            {/* Track Items */}
            {displayedTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  className={`px-4 sm:px-6 py-3.5 grid grid-cols-12 gap-4 items-center text-xs transition-colors group ${
                    isCurrent ? 'bg-emerald-50/70 text-emerald-900 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* # / Play Icon */}
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => playTrack(track)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#1DB954] text-black shadow-md scale-105'
                          : 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Title & Cover with Spinning Vinyl preview & Artist */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <div 
                      onClick={() => {
                        setTargetTrackForUpload(track.id);
                        trackVinylInputRef.current?.click();
                      }}
                      title="Klik untuk upload gambar vinyl untuk lagu ini"
                      className={`w-10 h-10 rounded-full bg-black border border-slate-700 flex items-center justify-center relative flex-shrink-0 shadow-sm cursor-pointer group/vinyl ${
                        isCurrent && isPlaying ? 'animate-spin' : ''
                      }`}
                    >
                      <img
                        src={track.cover || generateCoverArt(track.title, track.artist, track.id)}
                        alt={track.title}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute border border-black" />
                      <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover/vinyl:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Upload className="w-3 h-3 text-[#1DB954]" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-heading font-black text-sm truncate ${
                          isCurrent ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          {track.title}
                        </span>
                        {track.favorite && (
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-slate-500 truncate text-[11px] font-medium">{track.artist}</div>
                    </div>
                  </div>

                  {/* Album / Genre */}
                  <div className="hidden sm:block sm:col-span-3 min-w-0">
                    <div className="text-slate-700 font-medium truncate">{track.album}</div>
                    {track.genre && (
                      <span className="text-[10px] text-slate-400">{track.genre}</span>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="col-span-3 sm:col-span-2 text-right font-mono text-slate-600 text-xs font-bold">
                    {formatDuration(track.duration)}
                  </div>

                  {/* Actions (Upload Vinyl, Favorite, Queue, Edit, Delete) */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setTargetTrackForUpload(track.id);
                        trackVinylInputRef.current?.click();
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#1DB954] hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Upload Gambar Vinyl Lagu Ini"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleFavorite(track.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        track.favorite ? 'text-rose-500 fill-rose-500' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="Favorit"
                    >
                      <Heart className={`w-3.5 h-3.5 ${track.favorite ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => {
                        addToQueue(track);
                        setStatusMessage(`"${track.title}" ditambahkan ke antrean!`);
                        setTimeout(() => setStatusMessage(null), 2500);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Tambah ke Antrean"
                    >
                      <ListPlus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setEditingTrack(track)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Metadata & Vinyl"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus lagu "${track.title}" dari penyimpanan lokal?`)) {
                          deleteTrack(track.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus Lagu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
