'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit2, Plus, Wrench, Sticker, Image as ImageIcon, Download, UserPlus, FileImage, LayoutGrid, X, Upload, Volume2, VolumeX, Eye, EyeOff, KeyRound, MessageSquarePlus, Trash2 } from 'lucide-react';
import { UserSession, getStoredUserSession, saveUserSession, AUTH_CHANGE_EVENT } from '@/lib/auth-session';
import { fetchUserHistory } from '@/lib/history-service';
import { brutalistToast } from '@/lib/popup-service';
import { motion, AnimatePresence } from 'motion/react';

export default function AccountPage() {
  const [session, setSession] = useState<UserSession | null>(() => getStoredUserSession());
  const [historyCount, setHistoryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCleanMode, setIsCleanMode] = useState(false);
  
  const [editUsername, setEditUsername] = useState(() => {
    const s = getStoredUserSession();
    if (!s) return '';
    return s.username.startsWith('@') ? s.username : `@${s.username}`;
  });
  const [editBio, setEditBio] = useState(() => {
    const s = getStoredUserSession();
    return s?.bio || 'Kreator FZTOOLS since 2026. Berkarya tanpa batas 🚀';
  });
  const [bannerPreview, setBannerPreview] = useState<string | null>(() => {
    const s = getStoredUserSession();
    return s?.bannerUrl || null;
  });
  const [bannerType, setBannerType] = useState<'video' | 'image'>(() => {
    const s = getStoredUserSession();
    return s?.bannerType || 'video';
  });

  const [noteInput, setNoteInput] = useState(() => {
    const s = getStoredUserSession();
    return s?.note?.text || '';
  });
  const [displayedNote, setDisplayedNote] = useState('');

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
        const formatted = updated.username.startsWith('@') ? updated.username : `@${updated.username}`;
        setEditUsername(formatted);
        setEditBio(updated.bio || 'Kreator FZTOOLS since 2026. Berkarya tanpa batas 🚀');
        if (updated.bannerUrl) setBannerPreview(updated.bannerUrl);
        if (updated.bannerType) setBannerType(updated.bannerType);
        if (updated.note?.text) setNoteInput(updated.note.text);
      }
    };
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    
    fetchUserHistory().then(data => setHistoryCount(data.length));

    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  const currentBannerUrl = session?.bannerUrl || "/assets/aistudio/From_Klickpin.com-_Fall_outfit_ideas_for_women_that_make_everyday_moments_look_more_intentional_memorable_and_beautifully_styled_for_anyone_planni_a1b1f661.mp4";
  const currentBannerType = session?.bannerType || 'video';

  const isNoteValid = Boolean(
    session?.note?.text &&
    session?.note?.createdAt &&
    Date.now() - new Date(session.note.createdAt).getTime() < 24 * 60 * 60 * 1000
  );

  const activeNoteText = isNoteValid ? session?.note?.text : null;

  useEffect(() => {
    if (!activeNoteText) {
      setDisplayedNote('');
      return;
    }
    let idx = 0;
    setDisplayedNote('');
    const timer = setInterval(() => {
      idx++;
      setDisplayedNote(activeNoteText.slice(0, idx));
      if (idx >= activeNoteText.length) {
        clearInterval(timer);
      }
    }, 70);
    return () => clearInterval(timer);
  }, [activeNoteText]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentBannerType !== 'video') return;

    video.muted = isMuted;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    }
  }, [currentBannerUrl, currentBannerType]);

  useEffect(() => {
    const unlockAudio = () => {
      const video = videoRef.current;
      if (video && currentBannerType === 'video' && video.paused) {
        video.play().catch(() => {});
      }
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, [currentBannerType]);

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

  const verifyPasscode = (code: string) => {
    const h = code.trim().split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0);
    return h === 53441548;
  };

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (verifyPasscode(secretInput)) {
      const updated: UserSession = {
        ...session,
        role: 'DEVELOPER',
        isVerified: true
      };
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

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      brutalistToast('Ukuran banner maksimal 10MB', 'error');
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
    const cleanUser = editUsername.trim().replace(/^@+/, '');
    if (!cleanUser) {
      brutalistToast('Username tidak boleh kosong', 'error');
      return;
    }

    const updatedSession: UserSession = {
      ...session,
      username: `@${cleanUser}`,
      bio: editBio.trim(),
      bannerUrl: bannerPreview || session.bannerUrl,
      bannerType: bannerType || session.bannerType
    };

    saveUserSession(updatedSession);
    setSession(updatedSession);
    setIsModalOpen(false);
    brutalistToast('Profil berhasil disimpan', 'success');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (!noteInput.trim()) {
      brutalistToast('Catatan tidak boleh kosong', 'error');
      return;
    }

    const updatedSession: UserSession = {
      ...session,
      note: {
        text: noteInput.trim().slice(0, 60),
        createdAt: new Date().toISOString()
      }
    };

    saveUserSession(updatedSession);
    setSession(updatedSession);
    setIsNoteModalOpen(false);
    brutalistToast('Catatan 24 jam berhasil disimpan', 'success');
  };

  const handleDeleteNote = () => {
    if (!session) return;
    const updatedSession: UserSession = {
      ...session,
      note: undefined
    };
    saveUserSession(updatedSession);
    setSession(updatedSession);
    setNoteInput('');
    setIsNoteModalOpen(false);
    brutalistToast('Catatan berhasil dihapus', 'info');
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        videoRef.current.play().catch(() => {});
      }
    }
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

  const displayAtUsername = session.username.startsWith('@') ? session.username : `@${session.username}`;
  return (
    <div className="w-full min-h-[100dvh] bg-white dark:bg-zinc-950 pb-24" style={{ fontFamily: 'var(--font-sfpro)' }}>
      
      <div className="relative w-full h-44 sm:h-56 bg-zinc-900 overflow-hidden">
        {currentBannerType === 'video' ? (
          <video key={currentBannerUrl} ref={videoRef} autoPlay loop muted={isMuted} playsInline preload="auto" className="w-full h-full object-cover">
            <source src={currentBannerUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={currentBannerUrl} alt="Banner" className="w-full h-full object-cover" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white dark:to-zinc-950" />

        <AnimatePresence>
          {!isCleanMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 right-4 flex items-center justify-between z-20"
            >
              <div className="flex items-center gap-2">
                <button onClick={() => setIsModalOpen(true)} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors cursor-pointer">
                  <Edit2 className="w-4 h-4" />
                </button>
                {currentBannerType === 'video' && (
                  <button onClick={toggleSound} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors cursor-pointer">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                )}
              </div>
              <Link href="/" className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative px-4 sm:px-6 max-w-4xl mx-auto -mt-10 z-10">
        
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight line-clamp-1 drop-shadow-sm">
                {session.username.replace(/^@+/, '')}
              </h1>
              {(session.isVerified || session.role === 'DEVELOPER') && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#20D5EC] text-white shrink-0 shadow-xs ml-0.5">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">{displayAtUsername}</p>
          </div>

          <div className="relative shrink-0">
            <motion.div
              onClick={() => {
                setNoteInput(activeNoteText || '');
                setIsNoteModalOpen(true);
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
              className="absolute -top-12 sm:-top-14 right-2 sm:right-4 z-30 cursor-pointer select-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            >
              <div className="relative bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3.5 py-1.5 rounded-[18px] flex items-center justify-center min-w-[85px] max-w-[130px] sm:max-w-[160px]">
                <span className="absolute -top-1.5 left-2.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-800" />
                <span className="absolute -top-2 left-6 w-4.5 h-4.5 rounded-full bg-white dark:bg-zinc-800" />
                <span className="absolute -top-1.5 right-3 w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-800" />
                <span className="absolute -bottom-1 left-4 w-3 h-3 rounded-full bg-white dark:bg-zinc-800" />
                <span className="absolute -bottom-1 right-6 w-3 h-3 rounded-full bg-white dark:bg-zinc-800" />

                <span className="relative z-10 text-[11px] font-bold truncate">
                  {isNoteValid ? (displayedNote || activeNoteText) : '+ Catatan'}
                </span>
              </div>

              <span className="absolute -bottom-1.5 right-7 w-2 h-2 rounded-full bg-white dark:bg-zinc-800" />
              <span className="absolute -bottom-3 right-5 w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-800" />
            </motion.div>

            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 0.98, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-1.5 sm:-inset-2 pointer-events-none z-0"
              >
                <motion.svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <defs>
                    <linearGradient id="prismatic-aurora" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4338CA" />
                      <stop offset="35%" stopColor="#6366F1" />
                      <stop offset="70%" stopColor="#FB7185" />
                      <stop offset="100%" stopColor="#FDBA74" />
                    </linearGradient>
                  </defs>
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="url(#prismatic-aurora)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    animate={{
                      strokeDasharray: ['25 255', '190 90', '280 0', '130 150', '25 255'],
                      strokeDashoffset: [0, -120, -280, -420, -560],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                </motion.svg>
              </motion.div>

              <div
                onClick={handleAvatarTap}
                className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-white dark:border-zinc-950 overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-xl cursor-pointer select-none active:scale-95 transition-transform"
              >
                {session.avatarUrl ? (
                  <img src={session.avatarUrl} alt="Avatar" className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl sm:text-3xl font-black text-zinc-400">
                    {session.initials}
                  </div>
                )}
              </div>
            </div>

            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 z-20 w-6 h-6 sm:w-7 sm:h-7 bg-blue-500 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg cursor-pointer">
              <Plus className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
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
          <button onClick={() => setIsCleanMode(!isCleanMode)} className={`shrink-0 flex items-center gap-2 px-4 py-2 border rounded-full transition-colors cursor-pointer ${isCleanMode ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800 text-zinc-900 dark:text-white'}`}>
            {isCleanMode ? (
              <EyeOff className="w-3.5 h-3.5 text-white" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            )}
            <span className="text-[11px] font-bold">Mode Bersih</span>
          </button>
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
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Banner (Video / Foto Max 10MB)
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
                        <span className="text-[10px] font-medium">Klik untuk upload (Max 10MB)</span>
                      </div>
                    )}
                  </div>
                  <input ref={bannerInputRef} type="file" accept="image/*,video/*" onChange={handleBannerUpload} className="hidden" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Username
                  </label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-indigo-500" placeholder="@username" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Bio
                  </label>
                  <textarea rows={3} value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-indigo-500 resize-none" placeholder="Tuliskan bio Anda..." />
                </div>

                <div className="pt-2">
                  <button onClick={saveProfileChanges} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer">
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNoteModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.form onSubmit={handleSaveNote} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                    <MessageSquarePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Catatan 24 Jam</h3>
                    <p className="text-[10px] text-zinc-400">Tampil di gelembung awan profil</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsNoteModalOpen(false)} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  maxLength={60}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Ketik status catatan..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
                  autoFocus
                />
                <span className="block text-right text-[10px] text-zinc-400 mt-1">{noteInput.length}/60</span>
              </div>

              <div className="flex gap-2">
                {isNoteValid && (
                  <button type="button" onClick={handleDeleteNote} className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl hover:bg-rose-100 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button type="button" onClick={() => setIsNoteModalOpen(false)} className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-200 cursor-pointer">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 cursor-pointer">
                  Pasang
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSecretModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSecretModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.form onSubmit={handleSecretSubmit} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Akses Pengembang</h3>
                  <p className="text-[11px] text-zinc-400 font-medium">Verifikasi lencana profil</p>
                </div>
              </div>

              <input
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="Masukkan Kunci Akses"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-indigo-500 mb-4"
                autoFocus
              />

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowSecretModal(false)} className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-200 cursor-pointer">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 cursor-pointer">
                  Verifikasi
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
