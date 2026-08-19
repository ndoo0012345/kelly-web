import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Upload, 
  Camera, 
  Check, 
  ChefHat, 
  GraduationCap, 
  Instagram, 
  Phone, 
  Mail, 
  Sparkles,
  Save,
  RotateCcw
} from 'lucide-react';
import { ProfileData } from '../types';
import { defaultProfileData } from '../data/profile';

interface ProfileEditModalProps {
  isOpen: boolean;
  profile: ProfileData;
  onClose: () => void;
  onSave: (updated: ProfileData) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarPreview(result);
        setFormData((prev) => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan data profil ke pengaturan bawaan Kelly Tham?')) {
      setFormData(defaultProfileData);
      setAvatarPreview(defaultProfileData.avatarUrl);
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
        id="profile-edit-modal-card"
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Edit Profil Digital
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Sesuaikan informasi profil, kontak resmi, dan foto avatar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-sm text-slate-800">
          {/* Avatar Upload Section (Circular with Live Preview) */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 via-purple-500 to-cyan-400 p-1 shadow-lg ring-4 ring-white">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-white">
                    <span className="font-heading font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-white">
                      KT
                    </span>
                    <span className="text-[9px] text-pink-300 font-bold uppercase">Kelly</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-transform hover:scale-110 cursor-pointer border-2 border-white"
                title="Ganti Foto Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Foto Profil Lingkaran
              </h4>
              <p className="text-xs text-slate-500">
                Unggah gambar foto diri atau gunakan monogram inisial nama secara otomatis.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-violet-600" />
                  <span>Unggah Foto</span>
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview('');
                      setFormData((prev) => ({ ...prev, avatarUrl: '' }));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 transition-colors cursor-pointer"
                  >
                    Gunakan Monogram Default
                  </button>
                )}
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFile}
            className="hidden"
          />

          {/* Basic Info: Name, Nickname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Panggilan *</label>
              <input
                type="text"
                required
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* School & Grade & Major */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Sekolah</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kelas</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Jurusan / Peminatan</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-xs font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Bio / Deskripsi Pribadi</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-xs font-medium text-slate-800 resize-none leading-relaxed"
            />
          </div>

          {/* Social Contacts Section */}
          <div className="space-y-3 pt-2">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Kontak & Media Sosial Resmi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Instagram */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  <span>Instagram</span>
                </label>
                <input
                  type="text"
                  value={formData.contact.instagram}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, instagram: e.target.value }
                  })}
                  placeholder="@kelyl_el"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-xs font-semibold text-slate-900"
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <span className="text-xs">🎵</span>
                  <span>TikTok</span>
                </label>
                <input
                  type="text"
                  value={formData.contact.tiktok}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, tiktok: e.target.value }
                  })}
                  placeholder="@kellyyieee"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-xs font-semibold text-slate-900"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WhatsApp</span>
                </label>
                <input
                  type="text"
                  value={formData.contact.whatsapp}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, whatsapp: e.target.value }
                  })}
                  placeholder="088905602429"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-semibold text-slate-900"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  placeholder="thamkelly616@gmail.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Bawaan</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black shadow-lg shadow-violet-500/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
