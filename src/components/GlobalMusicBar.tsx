import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Heart, 
  ListMusic, 
  Maximize2,
  X,
  Disc3,
  Radio
} from 'lucide-react';
import { useMusic } from '../music/music-state';
import { formatDuration } from '../music/music-utils';
import { Visualizer } from './Visualizer';
import { NavigationTab } from '../types';

interface GlobalMusicBarProps {
  onNavigateToMusic: () => void;
  currentTab: NavigationTab;
}

export const GlobalMusicBar: React.FC<GlobalMusicBarProps> = ({ onNavigateToMusic, currentTab }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    queue,
    customVinylImage,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    next,
    previous,
    toggleFavorite,
    playTrack,
    removeFromQueue,
    clearQueue
  } = useMusic();

  const [showQueueDrawer, setShowQueueDrawer] = useState(false);

  if (!currentTrack) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const vinylCenterImage = customVinylImage || currentTrack.cover;

  return (
    <>
      {/* Queue Drawer Popover (Spotify Dark Theme) */}
      {showQueueDrawer && (
        <div 
          id="music-queue-drawer"
          className="fixed bottom-24 right-4 sm:right-8 z-50 w-80 sm:w-96 max-h-[480px] bg-[#181818]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#282828] flex flex-col overflow-hidden animate-fade-in text-white"
        >
          <div className="p-4 border-b border-[#282828] flex items-center justify-between bg-[#121212]">
            <div className="flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-[#1DB954]" />
              <h3 className="font-heading font-black text-sm text-white">
                Antrean Putar ({queue.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearQueue}
                className="text-xs text-slate-400 hover:text-rose-400 font-semibold px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Kosongkan
              </button>
              <button
                onClick={() => setShowQueueDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-[#282828] max-h-80">
            {queue.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Antrean kosong. Tambahkan lagu dari Music Library.
              </div>
            ) : (
              queue.map((track, idx) => {
                const isCurrent = track.id === currentTrack.id;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className={`flex items-center justify-between p-2 rounded-2xl text-xs transition-colors group ${
                      isCurrent ? 'bg-[#1DB954]/20 text-[#1DB954] font-semibold' : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => playTrack(track)}
                      className="flex items-center gap-3 flex-1 text-left min-w-0 pr-2 cursor-pointer"
                    >
                      {/* Spinning Vinyl in Queue */}
                      <div className={`w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center relative flex-shrink-0 shadow-md ${isCurrent && isPlaying ? 'animate-spin' : ''}`}>
                        <img
                          src={customVinylImage || track.cover}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 absolute border border-slate-900" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold flex items-center gap-1.5">
                          {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping" />}
                          <span>{track.title}</span>
                        </div>
                        <div className="truncate text-[11px] text-slate-400">{track.artist}</div>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatDuration(track.duration)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(track.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity cursor-pointer"
                        title="Hapus dari antrean"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Main Persistent Bottom Player Bar (Spotify Theme) */}
      <div 
        id="global-music-player-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-2xl border-t border-[#242424] shadow-[0_-8px_32px_rgba(0,0,0,0.6)] px-4 py-2.5 sm:px-6 transition-all duration-200 text-white"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
          {/* Top Seek Progress Bar (Spotify Scrubber) */}
          <div className="w-full flex items-center gap-3 group">
            <span className="text-[11px] font-mono text-slate-400 w-9 text-right flex-shrink-0">
              {formatDuration(currentTime)}
            </span>
            <div className="relative flex-1 flex items-center cursor-pointer py-1">
              <input
                id="music-seek-slider"
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#3e3e3e] rounded-lg appearance-none cursor-pointer accent-[#1DB954] focus:outline-none"
                aria-label="Posisi pemutaran"
              />
              <div 
                className="absolute left-0 top-1 h-1.5 bg-[#1DB954] rounded-lg pointer-events-none transition-all group-hover:bg-[#1ed760]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 w-9 flex-shrink-0">
              {formatDuration(duration)}
            </span>
          </div>

          {/* Player Controls & Track Info Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Track Details with SPINNING VINYL DISC */}
            <div className="flex items-center gap-3.5 min-w-0 w-1/4 sm:w-1/3">
              {/* Vinyl Disc Container */}
              <div 
                onClick={onNavigateToMusic}
                className="relative cursor-pointer group/vinyl flex-shrink-0"
                title="Buka Studio Musik & Kustomisasi Vinyl"
              >
                {/* Vinyl Record */}
                <div 
                  className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-black border-2 border-[#282828] shadow-lg flex items-center justify-center relative overflow-hidden transition-transform ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '4s' }}
                >
                  {/* Concentric Vinyl Grooves */}
                  <div className="absolute inset-1 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute inset-2.5 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-4 rounded-full border border-white/10 pointer-events-none" />
                  
                  {/* Center Album Art Label */}
                  <img
                    src={vinylCenterImage}
                    alt=""
                    className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full object-cover z-10 shadow-xs"
                  />
                  {/* Silver Spindle Hole */}
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 absolute z-20 border border-slate-900 shadow-xs" />
                </div>

                {/* Hover overlay icon */}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/vinyl:opacity-100 flex items-center justify-center text-white transition-opacity z-30">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-black text-sm text-white truncate hover:underline cursor-pointer" onClick={onNavigateToMusic} title={currentTrack.title}>
                    {currentTrack.title}
                  </h4>
                  <button
                    id="player-fav-btn"
                    onClick={() => toggleFavorite(currentTrack.id)}
                    className={`p-1 transition-colors cursor-pointer ${
                      currentTrack.favorite ? 'text-[#1DB954]' : 'text-slate-400 hover:text-white'
                    }`}
                    aria-label="Favorit"
                  >
                    <Heart className={`w-4 h-4 ${currentTrack.favorite ? 'fill-[#1DB954] text-[#1DB954]' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 truncate font-medium" title={currentTrack.artist}>
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Center: Playback Buttons & Live Visualizer */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  id="music-shuffle-btn"
                  onClick={toggleShuffle}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    isShuffled ? 'text-[#1DB954]' : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="Acak"
                  title="Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  id="music-prev-btn"
                  onClick={previous}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
                  aria-label="Sebelumnya"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                {/* Big Spotify Green Play/Pause Button */}
                <button
                  id="music-play-pause-btn"
                  onClick={togglePlayPause}
                  className="w-10 h-10 rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760] hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#1DB954]/20 flex items-center justify-center cursor-pointer"
                  aria-label={isPlaying ? 'Jeda' : 'Putar'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  id="music-next-btn"
                  onClick={next}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
                  aria-label="Berikutnya"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                <button
                  id="music-repeat-btn"
                  onClick={cycleRepeatMode}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="Ulangi"
                  title={`Repeat: ${repeatMode}`}
                >
                  {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Right: Volume Slider & Visualizer & Queue Drawer Toggle */}
            <div className="flex items-center justify-end gap-3 w-1/4 sm:w-1/3">
              {/* Mini Audio Visualizer in Bar */}
              <div className="hidden lg:block w-20 h-5">
                <Visualizer isPlaying={isPlaying} barCount={16} color="#1DB954" className="w-full h-full" />
              </div>

              {/* Volume */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  id="music-mute-btn"
                  onClick={toggleMute}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                  aria-label={isMuted ? 'Bunyikan' : 'Bisukan'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  id="music-volume-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 sm:w-20 h-1 bg-[#3e3e3e] rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
                  aria-label="Volume"
                />
              </div>

              {/* Queue Button */}
              <button
                id="music-queue-btn"
                onClick={() => setShowQueueDrawer(!showQueueDrawer)}
                className={`p-2 rounded-xl transition-all cursor-pointer relative ${
                  showQueueDrawer ? 'bg-[#1DB954] text-black font-bold' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Daftar Antrean Putar"
              >
                <ListMusic className="w-4 h-4" />
                {queue.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1DB954] text-black text-[9px] font-black flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
