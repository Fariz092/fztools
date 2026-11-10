'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Edit2, Plus, Wrench, Sticker, Image as ImageIcon, Download, UserPlus, FileImage, LayoutGrid, X, Upload, Video } from 'lucide-react';
import { UserSession, getStoredUserSession, saveUserSession, AUTH_CHANGE_EVENT } from '@/lib/auth-session';
import { fetchUserHistory } from '@/lib/history-service';
import { brutalistToast } from '@/lib/popup-service';
import { motion, AnimatePresence } from 'motion/react';

export default function AccountPage() {
  const [session, setSession] = useState<UserSession | null>(() => getStoredUserSession());
  const [historyCount, setHistoryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerType, setBannerType] = useState<'video' | 'image'>('video');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = getStoredUserSession();
    if (s) {
      setEditUsername(s.username || '');
      setEditBio(s.bio || 'Kreator FZTOOLS since 2026. Berkarya tanpa batas 🚀');
      if (s.bannerUrl) setBannerPreview(s.bannerUrl);
      if (s.bannerType) setBannerType(s.bannerType);
    }

    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<UserSession | null>;
      setSession(custom.detail || null);
    };
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    
    fetchUserHistory().then(data => setHistoryCount(data.length));

    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  const openSidebar = () => {
    window.dispatchEvent(new CustomEvent('fztools_open_sidebar'));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    if (file.size > 2 * 1024 * 1024) {
      brutalistToast('Ukuran avatar maksimal 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updatedSession: UserSession = { ...session, avatarUrl: base64String };
      saveUserSession(updatedSession);
      setSession(updatedSession);
      brutalistToast('Foto profil berhasil diperbarui', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const minSize = 5 * 1024 * 1024;
    const maxSize = 10 * 1024 * 1024;

    if (file.size < minSize || file.size > maxSize) {
      brutalistToast('Ukuran banner harus antara 5MB sampai 10MB', 'error');
      return;
    }

    const isVid = file.type.startsWith('video');
    setBannerType(isVid ? 'video' : 'image');

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setBannerPreview(result);
      brutalistToast('Banner berhasil dimuat ke editor', 'success');
    };
    reader.readAsDataURL(file);
  };

  const saveProfileChanges = () => {
    if (!session) return;
    if (!editUsername.trim()) {
      brutalistToast('Username tidak boleh kosong', 'error');
      return;
    }

    const updatedSession: UserSession = {
      ...session,
      username: editUsername.trim(),
      bio: editBio.trim(),
      bannerUrl: bannerPreview || session.bannerUrl,
      bannerType: bannerType || session.bannerType
    };

    saveUserSession(updatedSession);
    setSession(updatedSession);
    setIsModalOpen(false);
    brutalistToast('Profil berhasil disimpan', 'success');
  };

  if (!session) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-sfpro)' }}>
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-10 h-10 text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Mendaftar ke FZTOOLS</h2>
          <p className="text-xs text-zinc-500 mb-8">Buat profil, sesuaikan avatar, dan nikmati kreasi tanpa batas.</p>
          <Link href="/daftar" className="block w-full py-3.5 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-500 transition-colors">
            Gunakan Akun Lokal
          </Link>
          <Link href="/" className="block mt-4 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const level = Math.floor(historyCount / 5) + 1;
  let activeDays = 1;
  try {
    const registered = new Date(session.registeredAt).getTime();
    const now = new Date().getTime();
    if (!isNaN(registered)) {
      const days = Math.floor((now - registered) / (1000 * 3600 * 24)) + 1;
      activeDays = days > 0 ? days : 1;
    }
  } catch (e) {}

  const currentBannerUrl = session.bannerUrl || "/assets/aistudio/From_Klickpin.com-_Fall_outfit_ideas_for_women_that_make_everyday_moments_look_more_intentional_memorable_and_beautifully_styled_for_anyone_planni_a1b1f661.mp4";
  const currentBannerType = session.bannerType || 'video';

  return (
    <div className="w-full min-h-[100dvh] bg-white dark:bg-zinc-950 pb-24" style={{ fontFamily: 'var(--font-sfpro)' }}>
      
      <div className="relative w-full h-36 sm:h-44 bg-zinc-900 overflow-hidden">
        {currentBannerType === 'video' ? (
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={currentBannerUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={currentBannerUrl} alt="Banner" className="w-full h-full object-cover" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white dark:to-zinc-950" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <button onClick={() => setIsModalOpen(true)} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors cursor-pointer">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={openSidebar} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative px-4 sm:px-6 max-w-4xl mx-auto -mt-10 z-10">
        
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 pb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight line-clamp-1 drop-shadow-sm">
              {session.username}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">@fz_{session.username.toLowerCase().replace(/\s/g, '')}</p>
          </div>

          <div className="relative shrink-0">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-white dark:border-zinc-950 overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-xl cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {session.avatarUrl ? (
                <img src={session.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl sm:text-3xl font-black text-zinc-400">
                  {session.initials}
                </div>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-blue-500 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg cursor-pointer">
              <Plus className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">{historyCount}</span>
            <span className="text-[11px] font-medium text-zinc-500">Kreasi</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">{level}</span>
            <span className="text-[11px] font-medium text-zinc-500">Level</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">{activeDays}</span>
            <span className="text-[11px] font-medium text-zinc-500">Hari Aktif</span>
          </div>
        </div>

        <div className="mt-3 mb-5">
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed whitespace-pre-line">
            {session.bio || `Kreator FZTOOLS since ${session.registeredAt.split(' ')[2] || '2026'}.\nBerkarya tanpa batas 🚀`}
          </p>
        </div>

        <div className="flex overflow-x-auto gap-2.5 no-scrollbar pb-2">
          <Link href="/" className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            <Wrench className="w-3.5 h-3.5 text-pink-500" />
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white">Studio FZ</span>
          </Link>
          <Link href="/iqcv2" className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white">IQC Media</span>
          </Link>
          <Link href="/brat" className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            <Sticker className="w-3.5 h-3.5 text-lime-500" />
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white">Brat Gen</span>
          </Link>
          <Link href="/converter" className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            <FileImage className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white">Konverter</span>
          </Link>
          <Link href="/tiktok" className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            <Download className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white">Unduh TT</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col items-center">
          <LayoutGrid className="w-6 h-6 text-zinc-300 dark:text-zinc-700 mb-3" />
          <p className="text-xs font-bold text-zinc-900 dark:text-white tracking-widest uppercase">Gudang Karya</p>
          <p className="text-[10px] text-zinc-500 mt-1">Kreasi Anda tersimpan di riwayat aktivitas.</p>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Edit Profil & Banner</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Banner (Video / Foto 5MB - 10MB)
                  </label>
                  <div className="relative w-full h-28 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
                    {bannerPreview ? (
                      bannerType === 'video' ? (
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                          <source src={bannerPreview} type="video/mp4" />
                        </video>
                      ) : (
                        <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-400">
                        <Upload className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Klik untuk upload (5MB - 10MB)</span>
                      </div>
                    )}
                  </div>
                  <input ref={bannerInputRef} type="file" accept="image/*,video/*" onChange={handleBannerUpload} className="hidden" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Nama / Username
                  </label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-indigo-500" placeholder="Username Anda" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Bio
                  </label>
                  <textarea rows={3} value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-indigo-500 resize-none" placeholder="Tuliskan bio Anda..." />
                </div>

                <div className="pt-2">
                  <button onClick={saveProfileChanges} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20">
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
