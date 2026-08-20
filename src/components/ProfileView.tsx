import React, { useState, useRef } from 'react';
import { 
  User, 
  ChefHat, 
  Sparkles, 
  GraduationCap, 
  Mail, 
  Phone, 
  Instagram, 
  ExternalLink, 
  Copy, 
  Check, 
  Heart, 
  Code, 
  BookOpen, 
  Utensils, 
  Award,
  CheckCircle2,
  Share2,
  Lock,
  Edit3,
  Flame,
  ShieldCheck,
  Camera,
  Upload,
  RotateCcw
} from 'lucide-react';
import { ProfileData } from '../types';
import { useProfile } from '../context/ProfileContext';
import { PinSecurityModal } from './PinSecurityModal';
import { ProfileEditModal } from './ProfileEditModal';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, uploadAvatar, removeAvatar } = useProfile();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleDirectAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar(file);
        setStatusMessage('Foto profil baru berhasil diunggah dan disimpan!');
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err: any) {
        alert('Gagal mengunggah foto profil: ' + err.message);
      }
    }
  };

  const handleSaveProfile = (updated: ProfileData) => {
    updateProfile(updated);
    setStatusMessage('Data profil berhasil diperbarui!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div id="profile-view-container" className="space-y-8 animate-fade-in pb-16">
      {/* Hidden File Input for Direct Avatar Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleDirectAvatarUpload}
        className="hidden"
      />

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-xs sm:text-sm font-bold flex items-center justify-between animate-fade-in shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* PIN Security Modal & Edit Profile Modal */}
      <PinSecurityModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          setIsEditModalOpen(true);
        }}
      />

      <ProfileEditModal
        isOpen={isEditModalOpen}
        profile={profile}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Profile Hero Banner */}
      <section 
        id="profile-hero-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white p-6 sm:p-10 shadow-2xl shadow-pink-500/20 border border-white/20"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
          <button
            id="quick-upload-avatar-btn"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 font-heading font-black text-xs backdrop-blur-md border border-white/30 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
            title="Upload atau ganti foto profil sekarang"
          >
            <Camera className="w-3.5 h-3.5 text-yellow-300 group-hover:text-violet-600 transition-colors" />
            <span>{profile.avatarUrl ? 'Ganti Foto' : 'Upload Foto'}</span>
          </button>

          <button
            id="edit-profile-btn"
            onClick={() => setIsPinModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 font-heading font-black text-xs backdrop-blur-md border border-white/30 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300 group-hover:text-violet-600 transition-colors" />
            <span>Edit Profil</span>
          </button>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Avatar Lingkaran / Circular Profile Picture with Glowing Ring */}
          <div className="relative group flex-shrink-0">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-yellow-300 via-pink-400 to-cyan-300 p-1.5 shadow-2xl ring-4 ring-white/40 cursor-pointer transition-transform duration-300 group-hover:scale-105"
              title="Klik untuk mengunggah atau mengganti foto profil"
            >
              {profile.avatarUrl ? (
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white relative">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Hover Camera Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-xs font-bold gap-1">
                    <Camera className="w-6 h-6 text-yellow-300" />
                    <span>Ganti Foto</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col items-center justify-center text-white border-2 border-white/20 relative">
                  <span className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-white">
                    KT
                  </span>
                  <span className="text-[10px] text-pink-300 font-black tracking-widest uppercase mt-0.5">
                    {profile.nickname || 'Kelly'}
                  </span>
                  {/* Hover Camera Overlay for Monogram */}
                  <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-xs font-bold gap-1">
                    <Upload className="w-6 h-6 text-yellow-300" />
                    <span>Upload Foto</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Camera Action Badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-2 p-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer"
              title="Upload Foto Profil"
            >
              <Camera className="w-4 h-4 text-yellow-300" />
            </button>
          </div>

          {/* Profile Basic Info & Metallic Text Shimmer */}
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md border border-white/30">
                ✨ {profile.grade}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-black/30 text-amber-200 text-xs font-black backdrop-blur-md border border-amber-300/30 flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5" />
                <span>{profile.major}</span>
              </span>
              <span className="px-3.5 py-1 rounded-full bg-white/15 text-white/90 text-xs font-bold backdrop-blur-md border border-white/20">
                🏫 {profile.school}
              </span>
              {profile.avatarUrl && (
                <button
                  onClick={() => {
                    removeAvatar();
                    setStatusMessage('Foto profil dikembalikan ke monogram inisial KT.');
                    setTimeout(() => setStatusMessage(null), 2500);
                  }}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-red-500/80 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Hapus foto dan gunakan inisial KT"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ke KT</span>
                </button>
              )}
            </div>

            {/* Profile Name with Metallic Shimmer Effect */}
            <div className="space-y-1">
              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-metallic drop-shadow-lg">
                {profile.name}
              </h1>
              <p className="text-pink-100 font-bold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1.5">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>"{profile.nickname}" · Student Chef & Creative Vibe Coder</span>
              </p>
            </div>

            <p className="text-white/95 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
              {profile.bio}
            </p>

            {/* Badges List */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              {profile.badges.map((b) => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 shadow-xs"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Academic Info, Social Contacts, Interests, Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Social Contacts */}
        <div className="space-y-6 lg:col-span-1">
          {/* Academic Info Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center shadow-xs font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    Data Akademik
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Status sekolah resmi</p>
                </div>
              </div>

              <button
                onClick={() => setIsPinModalOpen(true)}
                className="text-slate-400 hover:text-violet-600 transition-colors p-1.5 rounded-xl hover:bg-violet-50 cursor-pointer"
                title="Edit data akademik"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Nama Lengkap</span>
                <span className="font-bold text-slate-800">{profile.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Sekolah</span>
                <span className="font-bold text-slate-800">{profile.school}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Kelas</span>
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">{profile.grade}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Peminatan</span>
                <span className="font-bold text-slate-800">{profile.major}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-medium">Tahun Ajaran</span>
                <span className="font-bold text-emerald-600">2025/2026</span>
              </div>
            </div>
          </div>

          {/* Social & Contact Card */}
          <div id="contact-info-card" className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center shadow-xs font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    Sosial & Kontak
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Hubungi Kelly secara langsung</p>
                </div>
              </div>

              <button
                onClick={() => setIsPinModalOpen(true)}
                className="text-slate-400 hover:text-pink-600 transition-colors p-1.5 rounded-xl hover:bg-pink-50 cursor-pointer"
                title="Edit kontak"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Instagram */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/80 flex items-center justify-between transition-all hover:scale-101">
                <a
                  href={`https://instagram.com/${profile.contact.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-pink-600 font-bold uppercase tracking-wider">Instagram</div>
                    <div className="text-xs font-bold text-slate-900 truncate">{profile.contact.instagram}</div>
                  </div>
                </a>
                <button
                  onClick={() => handleCopy(profile.contact.instagram, 'instagram')}
                  className="p-2 text-pink-600 hover:bg-pink-100 rounded-xl transition-colors cursor-pointer"
                  title="Salin username"
                >
                  {copiedItem === 'instagram' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* TikTok */}
              <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between transition-all hover:scale-101 shadow-sm">
                <a
                  href={`https://tiktok.com/@${profile.contact.tiktok.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center shadow-sm flex-shrink-0 font-black text-sm">
                    🎵
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">TikTok</div>
                    <div className="text-xs font-bold text-white truncate">{profile.contact.tiktok}</div>
                  </div>
                </a>
                <button
                  onClick={() => handleCopy(profile.contact.tiktok, 'tiktok')}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Salin username TikTok"
                >
                  {copiedItem === 'tiktok' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* WhatsApp */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between transition-all hover:scale-101">
                <a
                  href={`https://wa.me/62${profile.contact.whatsapp.startsWith('0') ? profile.contact.whatsapp.slice(1) : profile.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">WhatsApp</div>
                    <div className="text-xs font-bold text-slate-900 truncate">{profile.contact.whatsapp}</div>
                  </div>
                </a>
                <button
                  onClick={() => handleCopy(profile.contact.whatsapp, 'whatsapp')}
                  className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
                  title="Salin nomor WhatsApp"
                >
                  {copiedItem === 'whatsapp' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Email */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/80 flex items-center justify-between transition-all hover:scale-101">
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="flex items-center gap-3 flex-1 min-w-0 pr-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Email</div>
                    <div className="text-xs font-bold text-slate-900 truncate">{profile.contact.email}</div>
                  </div>
                </a>
                <button
                  onClick={() => handleCopy(profile.contact.email, 'email')}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors flex-shrink-0 cursor-pointer"
                  title="Salin email"
                >
                  {copiedItem === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interests & Skills Matrix */}
        <div className="space-y-6 lg:col-span-2">
          {/* Interests Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Minat & Eksplorasi Kreatif
                </h3>
                <p className="text-xs text-slate-500 font-medium">Kombinasi seni boga, teknologi, dan literasi</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.interests.map((cat, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 space-y-3 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-700">
                    {cat.icon === 'Utensils' && <Utensils className="w-4 h-4 text-pink-500" />}
                    {cat.icon === 'Code' && <Code className="w-4 h-4 text-emerald-500" />}
                    {cat.icon === 'Sparkles' && <Sparkles className="w-4 h-4 text-amber-500" />}
                    <span>{cat.category}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Competency & Skills Matrix */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Kompetensi & Keahlian Praktik
                </h3>
                <p className="text-xs text-slate-500 font-medium">Tingkat penguasaan keahlian</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {profile.skills.map((skill, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                      skill.category === 'culinary'
                        ? 'text-pink-500'
                        : skill.category === 'digital'
                        ? 'text-emerald-500'
                        : 'text-violet-500'
                    }`} />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {skill.name}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex-shrink-0 ${
                    skill.level === 'Mahir' || skill.level === 'Tinggi'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
