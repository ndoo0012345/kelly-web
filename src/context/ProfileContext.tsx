import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProfileData } from '../types';
import { defaultProfileData, loadProfileData, saveProfileData } from '../data/profile';

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: ProfileData) => void;
  uploadAvatar: (file: File) => Promise<string>;
  removeAvatar: () => void;
  resetProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(() => loadProfileData());

  useEffect(() => {
    // Listen for storage events across tabs if any
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'kelly_profile_data_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setProfile({ ...defaultProfileData, ...parsed });
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateProfile = (data: ProfileData) => {
    setProfile(data);
    saveProfileData(data);
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Berkas harus berupa gambar (JPG, PNG, WEBP, dll)'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const updated: ProfileData = {
            ...profile,
            avatarUrl: result
          };
          updateProfile(updated);
          resolve(result);
        } else {
          reject(new Error('Gagal membaca berkas gambar'));
        }
      };
      reader.onerror = () => reject(new Error('Terjadi kesalahan saat memproses gambar'));
      reader.readAsDataURL(file);
    });
  };

  const removeAvatar = () => {
    const updated: ProfileData = {
      ...profile,
      avatarUrl: ''
    };
    updateProfile(updated);
  };

  const resetProfile = () => {
    updateProfile(defaultProfileData);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        uploadAvatar,
        removeAvatar,
        resetProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
