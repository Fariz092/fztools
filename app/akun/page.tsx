'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Edit2, Plus, LogOut, Wrench, Sticker, Image as ImageIcon, Download, PenLine, Settings, UserPlus, FileImage, LayoutGrid } from 'lucide-react';
import { UserSession, getStoredUserSession, saveUserSession, AUTH_CHANGE_EVENT } from '@/lib/auth-session';
import { fetchUserHistory, HistoryItem } from '@/lib/history-service';
import { brutalistToast } from '@/lib/popup-service';
import { motion } from 'motion/react';

export default function AccountPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [activeDays, setActiveDays] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const s = getStoredUserSession();
    setSession(s);
    if (s) {
      setDisplayName(s.username);
      try {
        const registered = new Date(s.registeredAt).getTime();
        const now = new Date().getTime();
        if (!isNaN(registered)) {
          const days = Math.floor((now - registered) / (1000 * 3600 * 24)) + 1;
          setActiveDays(days > 0 ? days : 1);
        }
      } catch (e) {}
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    if (file.size > 2 * 1024 * 1024) {
      brutalistToast('Ukuran gambar maksimal 2MB', 'error');
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

  const saveName = () => {
    if (!session) return;
    if (!displayName.trim()) {
      brutalistToast('Nama tidak boleh kosong', 'error');
      return;
    }
    const updatedSession: UserSession = { ...session, username: displayName.trim() };
    saveUserSession(updatedSession);
    setSession(updatedSession);
    setIsEditing(false);
    brutalistToast('Profil diperbarui', 'success');
  };

  if (!session) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4">
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

  return (
    <div className="w-full min-h-[100dvh] bg-white dark:bg-zinc-950 pb-24">
      <div className="relative w-full h-48 sm:h-64 bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
           <source src="/assets/aistudio/From_Klickpin.com-_Fall_outfit_ideas_for_women_that_make_everyday_moments_look_more_intentional_memorable_and_beautifully_styled_for_anyone_planni_a1b1f661.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => setIsEditing(!isEditing)} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/50 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={openSidebar} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/50 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="absolute -top-12 sm:-top-16 right-4 sm:right-6">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-zinc-950 overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-xl cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {session.avatarUrl ? (
              <img src={session.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl sm:text-4xl font-black text-zinc-400">
                {session.initials}
              </div>
            )}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full border-[2.5px] border-white dark:border-zinc-950 flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg">
            <Plus className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        <div className="pt-3 max-w-[65%] sm:max-w-[70%]">
          {isEditing ? (
            <div className="flex items-center gap-2 mb-1">
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-lg font-bold text-zinc-900 dark:text-white outline-none w-full max-w-[200px]" autoFocus />
              <button onClick={saveName} className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg">Simpan</button>
            </div>
          ) : (
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight line-clamp-1">
              {session.username}
            </h1>
          )}
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">@fz_{session.username.toLowerCase().replace(/\s/g, '')}</p>
        </div>

        <div className="flex items-center gap-6 mt-6">
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">{historyCount}</span>
            <span className="text-[11px] font-medium text-zinc-500">Kreasi</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">{level}</span>
            <span className="text-[11px] font-medium text-zinc-500">Level</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">{activeDays}</span>
            <span className="text-[11px] font-medium text-zinc-500">Hari Aktif</span>
          </div>
        </div>

        <div className="mt-4 mb-6">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
            Kreator FZTOOLS since {session.registeredAt.split(' ')[2] || '2026'}.<br/>
            Berkarya tanpa batas 🚀
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
    </div>
  );
}
