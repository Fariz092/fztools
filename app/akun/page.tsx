'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit2, Plus, Wrench, Sticker, Image as ImageIcon, Download, UserPlus, FileImage, LayoutGrid, X, Upload, Volume2, VolumeX, Eye, EyeOff, KeyRound, MessageSquarePlus, Trash2, Code2, Cloud, Globe } from 'lucide-react';
import { UserSession, getStoredUserSession, saveUserSession, AUTH_CHANGE_EVENT } from '@/lib/auth-session';
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

  const [editUsername, setEditUsername] = useState(() => {
    const s = getStoredUserSession();
    if (!s) return '';
    return s.username.startsWith('@') ? s.username.substring(1) : s.username;
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
        setEditUsername(updated.username.startsWith('@') ? updated.username.substring(1) : updated.username);
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
      brutalistToast('Banner berhasil dimuat, klik simpan perubahan', 'success');
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
    const updated = {
      ...session,
      username: `@${cleanUser}`,
      bio: editBio.trim(),
      bannerUrl: bannerPreview || session.bannerUrl,
      bannerType: bannerType || session.bannerType
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
      note: { text: noteInput.trim().slice(0, 60), createdAt: new Date().toISOString() }
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
          <Link href="/daftar" className="block w-full py-3.5 bg-indigo-600 text-white rounded-full font-bold text-sm">Gunakan Akun Lokal</Link>
        </div>
      </div>
    );
  }

  const currentBannerUrl = session.bannerUrl || "/assets/aistudio/From_Klickpin.com-_Fall_outfit_ideas_for_women_that_make_everyday_moments_look_more_intentional_memorable_and_beautifully_styled_for_anyone_planni_a1b1f661.mp4";
  const displayAtUsername = session.username.startsWith('@') ? session.username : `@${session.username}`;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 pb-20 overflow-x-hidden" style={{ fontFamily: 'var(--font-sfpro)' }}>
      <div className="relative w-full h-44 sm:h-56 bg-zinc-900 overflow-hidden">
        {bannerType === 'video' ? (
          <video key={currentBannerUrl} ref={videoRef} autoPlay loop muted={isMuted} playsInline preload="auto" className="w-full h-full object-cover">
            <source src={currentBannerUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={currentBannerUrl} alt="Banner" className="w-full h-full object-cover" />
        )}
        
        <AnimatePresence>
          {!isCleanMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-4 left-4 right-4 flex justify-between z-20">
              <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(true)} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 cursor-pointer"><Edit2 size={16}/></button>
                {bannerType === 'video' && (
                  <button onClick={toggleSound} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 cursor-pointer">{isMuted ? <VolumeX size={16}/> : <Volume2 size={16} className="text-emerald-400"/>}</button>
                )}
              </div>
              <Link href="/" className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 cursor-pointer"><ArrowLeft size={20}/></Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative px-4 sm:px-6 max-w-4xl mx-auto -mt-10 z-10 overflow-visible">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight line-clamp-1">{session.username.replace(/^@+/, '')}</h1>
              {(session.isVerified || session.role === 'DEVELOPER') && (
                <span className="shrink-0 select-none ml-1 inline-flex items-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z" fill="#20D5EC" />
                    <path d="M9 12.2l2.1 2.1 4.4-4.6" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">{displayAtUsername}</p>

            {(session.isVerified || session.role === 'DEVELOPER') && (
              <div className="flex flex-col gap-0.5 mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400"><Code2 size={13}/> programmer.verified</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400"><Cloud size={13}/> cloud.engineer.verified</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400"><Globe size={13}/> Verified Developer</span>
              </div>
            )}
          </div>

          <div className="relative shrink-0">
            <div onClick={() => { setNoteInput(activeNoteText || ''); setIsNoteModalOpen(true); }} className="absolute -top-12 right-2 z-30 cursor-pointer select-none">
              <div className="relative bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3.5 py-1.5 rounded-[18px] flex items-center justify-center min-w-[85px] max-w-[140px] shadow-md border border-zinc-200/80 dark:border-zinc-700/80">
                <span className="absolute -bottom-1 right-5 w-2 h-2 rounded-full bg-white dark:bg-zinc-800 border-r border-b border-zinc-200/80 dark:border-zinc-700/80 rotate-45 transform" />
                <span className="relative z-10 text-[11px] font-bold truncate">{activeNoteText ? activeNoteText : '+ Catatan'}</span>
              </div>
            </div>

            <div className="relative">
              <motion.div animate={{ scale: [1, 1.05, 0.98, 1.04, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -inset-1.5 pointer-events-none z-0">
                <motion.svg className="w-full h-full" viewBox="0 0 100 100" animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                  <defs><linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4338CA" /><stop offset="50%" stopColor="#FB7185" /><stop offset="100%" stopColor="#FDBA74" /></linearGradient></defs>
                  <motion.circle cx="50" cy="50" r="44" fill="none" stroke="url(#aurora)" strokeWidth="3.5" strokeLinecap="round" animate={{ strokeDasharray: ['25 255', '280 0', '25 255'], strokeDashoffset: [0, -280, -560] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                </motion.svg>
              </motion.div>
              <div onClick={handleAvatarTap} className="relative z-10 w-20 h-20 rounded-full border-[3px] border-white dark:border-zinc-950 overflow-hidden bg-zinc-800 shadow-xl cursor-pointer">
                {session.avatarUrl ? <img src={session.avatarUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xl font-bold text-white">{session.initials}</div>}
              </div>
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 z-20 w-6 h-6 bg-blue-500 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center text-white cursor-pointer shadow-md"><Plus size={12} strokeWidth={3}/></button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 font-bold text-zinc-900 dark:text-white">
          <div className="flex flex-col"><span className="text-base">214</span> <span className="text-xs text-zinc-500 font-normal">Mengikuti</span></div>
          <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex flex-col"><span className="text-base">32,33 rb</span> <span className="text-xs text-zinc-500 font-normal">Pengikut</span></div>
          <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex flex-col"><span className="text-base">743,21 rb</span> <span className="text-xs text-zinc-500 font-normal">Suka</span></div>
        </div>

        <div className="mt-3 mb-5">
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium whitespace-pre-line">{session.bio}</p>
        </div>

        <div className="flex overflow-x-auto gap-2.5 no-scrollbar pb-2">
          <Link href="/" className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-900 dark:text-white"><Wrench size={14} className="text-pink-500"/>Studio FZ</Link>
          <button onClick={() => setIsCleanMode(!isCleanMode)} className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-900 dark:text-white cursor-pointer">{isCleanMode ? <EyeOff size={14}/> : <Eye size={14}/>} Mode Bersih</button>
          <Link href="/iqcv2" className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-900 dark:text-white"><ImageIcon size={14} className="text-emerald-500"/>IQC Media</Link>
          <Link href="/brat" className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-900 dark:text-white"><Sticker size={14} className="text-lime-500"/>Brat Gen</Link>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Edit Profil</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
              </div>
              <div className="space-y-4">
                <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} accept="image/*,video/*" className="hidden" />
                <div onClick={() => bannerInputRef.current?.click()} className="w-full h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center cursor-pointer border border-dashed border-zinc-400">
                  <Upload size={20} className="text-zinc-400 mr-2"/> <span className="text-xs text-zinc-500">Upload Banner (Max 10MB)</span>
                </div>
                <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none border border-zinc-200 dark:border-zinc-700" placeholder="@username" />
                <textarea rows={3} value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 text-xs text-zinc-900 dark:text-white outline-none border border-zinc-200 dark:border-zinc-700 resize-none" placeholder="Bio..." />
                <button onClick={saveProfileChanges} className="w-full py-3 bg-indigo-600 text-white font-bold text-xs uppercase rounded-xl">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsNoteModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <form onSubmit={handleSaveNote} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">Catatan 24 Jam</h3>
              <input type="text" maxLength={60} value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Tulis status..." className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none border border-zinc-200 dark:border-zinc-700 mb-4" autoFocus />
              <div className="flex gap-2">
                {activeNoteText && <button type="button" onClick={handleDeleteNote} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><Trash2 size={16}/></button>}
                <button type="button" onClick={() => setIsNoteModalOpen(false)} className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">Pasang</button>
              </div>
            </form>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSecretModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setShowSecretModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <form onSubmit={handleSecretSubmit} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">Akses Pengembang</h3>
              <input type="password" value={secretInput} onChange={(e) => setSecretInput(e.target.value)} placeholder="Kunci Akses" className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none border border-zinc-200 dark:border-zinc-700 mb-4" autoFocus />
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">Verifikasi</button>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
