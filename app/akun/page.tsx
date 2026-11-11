'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Edit2, Plus, Wrench, Sticker, Image as ImageIcon, UserPlus, User, Menu, X, Upload, Volume2, VolumeX, Eye, EyeOff, Trash2, Code2, Cloud, Globe } from 'lucide-react';
import { UserSession, getStoredUserSession, saveUserSession, AUTH_CHANGE_EVENT, computeInitials } from '@/lib/auth-session';
import { brutalistToast } from '@/lib/popup-service';
import { motion, AnimatePresence } from 'motion/react';

export default function AccountPage() {
  const [session, setSession] = useState<UserSession | null>(() => getStoredUserSession());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCleanMode, setIsCleanMode] = useState(false);

  const [activeNoteText, setActiveNoteText] = useState<string | null>(() => {
    const s = getStoredUserSession();
    if (s?.note?.text && s?.note?.createdAt) {
      if (Date.now() - new Date(s.note.createdAt).getTime() < 86400000) {
        return s.note.text;
      }
    }
    return null;
  });

  // Nama Besar (Display Name) Terpisah dari Username
  const [editName, setEditName] = useState(() => {
    const s = getStoredUserSession();
    return s?.name || s?.username.replace(/^@+/, '') || 'urxyn';
  });

  const [editUsername, setEditUsername] = useState(() => {
    const s = getStoredUserSession();
    if (!s) return '';
    return s.username.startsWith('@') ? s.username : `@${s.username}`;
  });

  const [editBio, setEditBio] = useState(() => {
    const s = getStoredUserSession();
    return s?.bio || 'Kreator FZTOOLS since 2026. Berkarya tanpa batas 🚀';
  });

  const [bannerPreview, setBannerPreview] = useState<string | null>(() => getStoredUserSession()?.bannerUrl || null);
  const [bannerType, setBannerType] = useState<'video' | 'image'>(() => getStoredUserSession()?.bannerType || 'video');
  const [noteInput, setNoteInput] = useState(() => getStoredUserSession()?.note?.text || '');

  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretInput, setSecretInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('fztools_theme') || 'light';
      const root = document.documentElement;
      root.classList.remove('light', 'dark', 'dim');
      root.classList.add(savedTheme);
      if (savedTheme === 'dark' || savedTheme === 'dim') {
        root.classList.add('dark');
      }
    } catch (e) {}

    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<UserSession | null>;
      const updated = custom.detail || null;
      setSession(updated);
      if (updated) {
        setEditName(updated.name || updated.username.replace(/^@+/, ''));
        setEditUsername(updated.username.startsWith('@') ? updated.username : `@${updated.username}`);
        setEditBio(updated.bio || 'Kreator FZTOOLS since 2026. Berkarya tanpa batas 🚀');
        if (updated.bannerUrl) setBannerPreview(updated.bannerUrl);
        if (updated.bannerType) setBannerType(updated.bannerType);
        if (updated.note?.text) {
          setNoteInput(updated.note.text);
          setActiveNoteText(updated.note.text);
        } else {
          setActiveNoteText(null);
        }
      }
    };
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || bannerType !== 'video') return;
    video.muted = isMuted;
    video.play().catch(() => {
      video.muted = true;
      setIsMuted(true);
      video.play().catch(() => {});
    });
  }, [bannerPreview, bannerType]);

  const handleAvatarTap = () => {
    const now = Date.now();
    if (now - lastTapTime < 500) {
      const nextCount = tapCount + 1;
      if (nextCount >= 5) {
        setTapCount(0);
        setShowSecretModal(true);
      } else {
        setTapCount(nextCount);
      }
    } else {
      setTapCount(1);
    }
    setLastTapTime(now);
  };

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    const h = secretInput.trim().split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0);
    if (h === 53441548) {
      const updated = { ...session, role: 'DEVELOPER', isVerified: true };
      saveUserSession(updated);
      setSession(updated);
      setShowSecretModal(false);
      setSecretInput('');
      brutalistToast('Verified Developer Aktif', 'success');
    } else {
      brutalistToast('Kunci Akses Ditolak', 'error');
      setSecretInput('');
    }
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
      const updated = { ...session, avatarUrl: reader.result as string };
      saveUserSession(updated);
      setSession(updated);
      brutalistToast('Foto profil berhasil diperbarui', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      brutalistToast('Ukuran banner maksimal 10MB', 'error');
      return;
    }
    const isVid = file.type.startsWith('video');
    setBannerType(isVid ? 'video' : 'image');
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
      brutalistToast('Banner berhasil dimuat', 'success');
    };
    reader.readAsDataURL(file);
  };

  const saveProfileChanges = () => {
    if (!session) return;
    const cleanUser = editUsername.trim().replace(/^@+/, '');
    if (!cleanUser) {
      brutalistToast('Username tidak boleh kosong', 'error');
      return;
    }
    const cleanName = editName.trim() || cleanUser;
    const updated: UserSession = {
      ...session,
      name: cleanName,
      username: `@${cleanUser}`,
      initials: computeInitials(cleanUser, cleanName),
      bio: editBio.trim(),
      bannerUrl: bannerPreview || session.bannerUrl,
      bannerType: bannerType || session.bannerType,
    };
    saveUserSession(updated);
    setSession(updated);
    setIsModalOpen(false);
    brutalistToast('Profil berhasil disimpan', 'success');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !noteInput.trim()) return;
    const updated = {
      ...session,
      note: { text: noteInput.trim().slice(0, 60), createdAt: new Date().toISOString() },
    };
    saveUserSession(updated);
    setSession(updated);
    setActiveNoteText(noteInput.trim().slice(0, 60));
    setIsNoteModalOpen(false);
    brutalistToast('Catatan dipasang', 'success');
  };

  const handleDeleteNote = () => {
    if (!session) return;
    const updated = { ...session, note: undefined };
    saveUserSession(updated);
    setSession(updated);
    setActiveNoteText(null);
    setNoteInput('');
    setIsNoteModalOpen(false);
    brutalistToast('Catatan dihapus', 'info');
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  if (!session) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <UserPlus className="w-10 h-10 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Mendaftar ke FZTOOLS</h2>
          <Link href="/daftar" className="block w-full py-3.5 bg-indigo-600 text-white rounded-full font-bold text-sm">
            Gunakan Akun Lokal
          </Link>
        </div>
      </div>
    );
  }

  const currentBannerUrl =
    session.bannerUrl ||
    '/assets/aistudio/From_Klickpin.com-_Fall_outfit_ideas_for_women_that_make_everyday_moments_look_more_intentional_memorable_and_beautifully_styled_for_anyone_planni_a1b1f661.mp4';
  const displayAtUsername = session.username.startsWith('@') ? session.username : `@${session.username}`;
  const displayName = session.name || session.username.replace(/^@+/, '');

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 pb-20 overflow-x-hidden" style={{ fontFamily: 'var(--font-sfpro)' }}>
      {/* BANNER DENGAN FADE RENDAH */}
      <div className="relative w-full h-52 sm:h-64 bg-zinc-900 overflow-hidden">
        {bannerType === 'video' ? (
          <video
            key={currentBannerUrl}
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src={currentBannerUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={currentBannerUrl} alt="Banner" className="w-full h-full object-cover" />
        )}

        <div className="absolute inset-0 bg-black/10" />

        {/* Gradien Fade Halus */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-22 bg-gradient-to-t from-white dark:from-zinc-950 via-white/70 dark:via-zinc-950/70 to-transparent pointer-events-none" />

        {/* TOP BAR ICONS: EDIT PENSIL, KOIN P, USER VISITS, USER+, DAN MENU GARIS 3 */}
        <AnimatePresence>
          {!isCleanMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
              {/* Sisi Kiri: Tombol Pensil Lingkaran & Koin P (Fungsi Audio) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/20 cursor-pointer hover:bg-black/65 transition-colors shadow-sm"
                  title="Edit Banner & Profil"
                >
                  <Edit2 size={16} />
                </button>

                {/* Tombol Koin Kuning P (Fungsi Toggle Suara Video) */}
                <button
                  onClick={toggleSound}
                  className="relative w-9 h-9 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center border-2 border-amber-300 hover:scale-105 transition-transform cursor-pointer shadow-md select-none"
                  title={isMuted ? 'Nyalakan Suara (Koin P)' : 'Matikan Suara (Koin P)'}
                >
                  <span className="font-extrabold text-sm leading-none tracking-tighter">P</span>
                  {!isMuted && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-white" />
                  )}
                </button>
              </div>

              {/* Sisi Kanan: Kunjungan Profil (Pajangan), User+ (Pajangan), dan Garis Tiga (Kembali) */}
              <div className="flex items-center gap-2">
                <div
                  className="relative w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/20 select-none shadow-sm cursor-default"
                  title="Kunjungan Profil"
                >
                  <User size={16} />
                  <span className="absolute -top-1 -right-1 px-1 min-w-[15px] h-3.5 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white/40">
                    5
                  </span>
                </div>

                <div
                  className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/20 select-none shadow-sm cursor-default"
                  title="Temukan Teman"
                >
                  <UserPlus size={16} />
                </div>

                <Link
                  href="/"
                  className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/20 cursor-pointer hover:bg-black/65 transition-colors shadow-sm"
                  title="Kembali ke Beranda"
                >
                  <Menu size={18} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* KONTEN PROFIL */}
      <div className="relative px-4 sm:px-6 max-w-4xl mx-auto -mt-10 sm:-mt-12 z-10 overflow-visible">
        <div className="flex items-start justify-between gap-4">
          {/* Kolom Kiri: Nama Besar, Username + Ceklis Biru Hexagon, Lencana Badge, & Statistik */}
          <div className="min-w-0 flex-1 pr-2">
            {/* Nama Besar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight line-clamp-1">
                {displayName}
              </h1>
            </div>

            {/* Username (@handle) Ditemani Ceklis Biru Hexagon (Lebih Kecil & Dekat) */}
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {displayAtUsername}
              </span>

              {(session.isVerified || session.role === 'DEVELOPER') && (
                <span className="shrink-0 inline-flex items-center" title="Terverifikasi">
                  {/* Ceklis Biru Hexagon Kecil & Rapat (Skala Proporsional 13px) */}
                  <svg className="w-3.5 h-3.5 text-[#20D5EC]" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M10.5 3.3c.9-.5 2.1-.5 3 0l6.2 3.6c.9.5 1.5 1.5 1.5 2.5v7.2c0 1-.5 2-1.5 2.5l-6.2 3.6c-.9.5-2.1.5-3 0l-6.2-3.6c-.9-.5-1.5-1.5-1.5-2.5V9.4c0-1 .5-2 1.5-2.5l6.2-3.6z"
                      fill="#20D5EC"
                    />
                    <path
                      d="M8.5 12.3l2.4 2.4 4.8-4.8"
                      stroke="#FFFFFF"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>

            {/* 3 Lencana Badge Dekat Di Bawah Username */}
            {(session.isVerified || session.role === 'DEVELOPER') && (
              <div className="flex flex-col gap-0.5 mt-1.5 mb-2.5">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <Code2 size={12} className="text-zinc-400 dark:text-zinc-500 shrink-0" /> programmer.verified
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <Cloud size={12} className="text-zinc-400 dark:text-zinc-500 shrink-0" /> cloud.engineer.verified
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <Globe size={12} className="text-zinc-400 dark:text-zinc-500 shrink-0" /> Verified Developer
                </span>
              </div>
            )}

            {/* Statistik TikTok Style: Mengikuti 547 | Pengikut 67,3 rb | Suka 547,2 rb */}
            <div className="flex items-center gap-6 sm:gap-8 mt-3">
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-tight">547</span>
                <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-normal">Mengikuti</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-tight">67,3 rb</span>
                <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-normal">Pengikut</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-tight">547,2 rb</span>
                <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-normal">Suka</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Avatar TikTok + Bubble Chat Menutupi Bagian Atas Foto Profil */}
          <div className="relative shrink-0 flex flex-col items-center">
            {/* Note Speech Bubble: Menutupi Sebagian Atas Avatar */}
            <div
              onClick={() => {
                setNoteInput(activeNoteText || '');
                setIsNoteModalOpen(true);
              }}
              className="relative z-30 mb-[-12px] cursor-pointer select-none"
            >
              <div className="relative bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3.5 py-1.5 rounded-[18px] flex items-center justify-center min-w-[75px] max-w-[135px] shadow-md border border-zinc-200/90 dark:border-zinc-700/90">
                <span className="absolute -bottom-1 right-6 w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-800 border-r border-b border-zinc-200/90 dark:border-zinc-700/90 rotate-45 transform" />
                <span className="relative z-10 text-[11px] font-bold truncate">
                  {activeNoteText ? activeNoteText : 'Ada yang seru?'}
                </span>
              </div>
            </div>

            {/* Avatar Circle */}
            <div className="relative z-10">
              <div
                onClick={handleAvatarTap}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3.5px] border-white dark:border-zinc-950 overflow-hidden bg-zinc-800 shadow-md cursor-pointer"
              >
                {session.avatarUrl ? (
                  <img src={session.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl font-bold text-white">{session.initials}</div>
                )}
              </div>
            </div>

            {/* Tombol Plus Biru Muda */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 z-20 w-7 h-7 sm:w-7.5 sm:h-7.5 bg-[#00C2F3] hover:bg-[#00b0dc] rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center text-white cursor-pointer shadow-md transition-colors"
              title="Ganti Foto Profil"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
          </div>
        </div>

        {/* Bio Kreator */}
        <div className="mt-4 mb-4">
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium whitespace-pre-line">{session.bio}</p>
        </div>

        {/* Action Pills Menu: Icon Dibungkus Lingkaran Gradient Merah Muda & Putih Khas TikTok */}
        <div className="flex overflow-x-auto gap-2.5 no-scrollbar pb-2">
          {/* Studio FZ (TikTok Studio Style: Gradient Pink & White) */}
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-colors shadow-xs"
          >
            <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#FE2C55] via-[#FF3B5C] to-[#FF85A0] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Wrench size={9} strokeWidth={2.5} />
            </span>
            Studio FZ
          </Link>

          {/* Mode Bersih */}
          <button
            onClick={() => setIsCleanMode(!isCleanMode)}
            className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-900 dark:text-white cursor-pointer hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-colors shadow-xs"
          >
            <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#C084FC] flex items-center justify-center text-white shrink-0 shadow-xs">
              {isCleanMode ? <EyeOff size={9} strokeWidth={2.5} /> : <Eye size={9} strokeWidth={2.5} />}
            </span>
            Mode Bersih
          </button>

          {/* IQC Media */}
          <Link
            href="/iqcv2"
            className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-colors shadow-xs"
          >
            <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#10B981] to-[#34D399] flex items-center justify-center text-white shrink-0 shadow-xs">
              <ImageIcon size={9} strokeWidth={2.5} />
            </span>
            IQC Media
          </Link>

          {/* Brat Gen */}
          <Link
            href="/brat"
            className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-colors shadow-xs"
          >
            <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#84CC16] to-[#A3E635] flex items-center justify-center text-black shrink-0 shadow-xs">
              <Sticker size={9} strokeWidth={2.5} />
            </span>
            Brat Gen
          </Link>
        </div>
      </div>

      {/* Modal Edit Profile dengan Kolom Nama Besar & Username Terpisah */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Edit Profil</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} accept="image/*,video/*" className="hidden" />
                <div
                  onClick={() => bannerInputRef.current?.click()}
                  className="w-full h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center cursor-pointer border border-dashed border-zinc-400 overflow-hidden"
                >
                  {bannerPreview ? (
                    bannerType === 'video' ? (
                      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                        <source src={bannerPreview} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="flex items-center text-zinc-400">
                      <Upload size={20} className="mr-2" /> <span className="text-xs">Upload Banner (Max 10MB)</span>
                    </div>
                  )}
                </div>

                {/* Input Nama Tampilan (Nama Besar) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                    Nama Tampilan (Nama Besar)
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 transition-colors"
                    placeholder="Nama tampilan (cth: urxyn)"
                  />
                </div>

                {/* Input Username (@handle) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                    Username (@handle)
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 transition-colors"
                    placeholder="@username"
                  />
                </div>

                {/* Input Bio */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 text-xs text-zinc-900 dark:text-white outline-none border border-zinc-200 dark:border-zinc-700 resize-none focus:border-indigo-500 transition-colors"
                    placeholder="Bio..."
                  />
                </div>

                <button onClick={saveProfileChanges} className="w-full py-3 bg-indigo-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-indigo-500 transition-colors">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Catatan 24 Jam */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsNoteModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <form onSubmit={handleSaveNote} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">Catatan 24 Jam</h3>
              <input
                type="text"
                maxLength={60}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Tulis status..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none border border-zinc-200 dark:border-zinc-700 mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                {activeNoteText && (
                  <button type="button" onClick={handleDeleteNote} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 transition-colors">
                  Pasang
                </button>
              </div>
            </form>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Akses Pengembang */}
      <AnimatePresence>
        {showSecretModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setShowSecretModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <form onSubmit={handleSecretSubmit} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">Akses Pengembang</h3>
              <input
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="Kunci Akses"
                className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none border border-zinc-200 dark:border-zinc-700 mb-4"
                autoFocus
              />
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 transition-colors">
                Verifikasi
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
