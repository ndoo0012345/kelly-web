import React, { useState } from 'react';
import { 
  Home, 
  User, 
  Code2, 
  BookOpen, 
  CalendarDays, 
  Gamepad2, 
  Music, 
  Menu, 
  X, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { NavigationTab } from '../types';
import { useMusic } from '../music/music-state';

interface NavbarProps {
  currentTab?: NavigationTab;
  activeTab?: NavigationTab;
  onSelectTab?: (tab: NavigationTab) => void;
  onTabChange?: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  activeTab, 
  onSelectTab, 
  onTabChange 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPlaying, currentTrack } = useMusic();

  const selected = activeTab || currentTab || 'dashboard';

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'profile', label: 'Profil', icon: User, color: 'text-pink-600 bg-pink-50 border-pink-200' },
    { id: 'informatika', label: 'Informatika', icon: Code2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'bindo', label: 'Bahasa Indonesia', icon: BookOpen, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 'schedule', label: 'Jadwal', icon: CalendarDays, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { id: 'games', label: 'Arcade', icon: Gamepad2, color: 'text-violet-600 bg-violet-50 border-violet-200' },
    { id: 'music', label: 'Music Studio', icon: Music, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    if (onSelectTab) onSelectTab(tab);
    if (onTabChange) onTabChange(tab);
    setMobileMenuOpen(false);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="global-navbar"
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xs transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <button
            id="nav-brand-btn"
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 group text-left focus:outline-none rounded-2xl px-2 py-1 -ml-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 p-[2px] shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-heading font-extrabold text-sm text-violet-700">
                KT
              </div>
            </div>
            <div>
              <div className="font-heading font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1.5 group-hover:text-violet-600 transition-colors">
                <span>Kelly Tham</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-bold border border-violet-200">
                  XI.3
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                SMA Cinta Kasih Tzu Chi
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = selected === item.id;
              const isMusicPlaying = item.id === 'music' && isPlaying;

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `${item.color} border shadow-xs scale-102`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  <span>{item.label}</span>

                  {isMusicPlaying && (
                    <span className="flex h-2 w-2 relative ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Spotify Music Player Badge & Mobile Menu Button */}
          <div className="flex items-center gap-2.5">
            {currentTrack && (
              <button
                id="nav-quick-music-btn"
                onClick={() => handleNavClick('music')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  isPlaying
                    ? 'bg-[#121212] text-[#1DB954] border-black shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Buka Music Studio"
              >
                <div className={`w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{currentTrack.title}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-100 px-4 pt-2 pb-6 space-y-1 animate-fade-in shadow-xl"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selected === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? `${item.color} border shadow-xs`
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.id === 'music' && isPlaying && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                    Memutar
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
