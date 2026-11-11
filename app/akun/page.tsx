'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Edit2, Plus, Wrench, Sticker, Image as ImageIcon, UserPlus, User, Menu, X, Upload,
  Eye, EyeOff, Trash2, Code2, Cloud, Globe, Lock, Bookmark, Heart, Film
} from 'lucide-react';
import { UserSession, getStoredUserSession, saveUserSession, AUTH_CHANGE_EVENT, computeInitials } from '@/lib/auth-session';
import { HistoryItem, fetchUserHistory } from '@/lib/history-service';
import { brutalistToast } from '@/lib/popup-service';
import { motion, AnimatePresence } from 'motion/react';

// IndexedDB Storage untuk Banner Besar / Video agar tidak terkena limit localStorage
const IDB_NAME = 'fztools_media_db';
const IDB_STORE = 'banners';

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveLargeMedia(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(dataUrl, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('IDB write error:', e);
  }
}

async function getLargeMedia(key: string): Promise<string | null> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export default function AccountPage() {
  const [session, setSession] = useState<UserSession | null>(() => getStoredUserSession());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCleanMode, setIsCleanMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'private' | 'bookmark' | 'liked'>('grid');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const [activeNoteText, setActiveNoteText] = useState<string | null>(() => {
    const s = getStoredUserSession();
    if (s?.note?.text && s?.note?.createdAt) {
      if (Date.now() - new Date(s.note.createdAt).getTime() < 86400000) {
        return s.note.text;
      }
    }
    return null;
  });

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
    return s?.bio || '魚座';
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
    const s = getStoredUserSession();
    if (s?.bannerUrl === 'idb://custom_banner_media') {
      getLargeMedia('custom_banner_media').then((media) => {
        if (media) {
          setBannerPreview(media);
          setSession((prev) => (prev ? { ...prev, bannerUrl: media } : null));
        }
      });
    }

    fetchUserHistory().then((data) => setHistoryItems(data.slice(0, 9))).catch(() => {});
  }, []);

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
        setEditBio(updated.bio || '魚座');
        if (updated.bannerUrl && updated.bannerUrl !== 'idb://custom_banner_media') {
          setBannerPreview(updated.bannerUrl);
        }
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
  }, [bannerPreview, bannerType, isMuted]);

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
    if (file.size > 5 * 1024 * 1024) {
      brutalistToast('Ukuran avatar maksimal 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height, 512);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          const updated = { ...session, avatarUrl: compressed };
          saveUserSession(updated);
          setSession(updated);
          brutalistToast('Foto profil berhasil diperbarui', 'success');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      brutalistToast('Ukuran banner maksimal 25MB', 'error');
      return;
    }

    const isVid = file.type.startsWith('video');
    setBannerType(isVid ? 'video' : 'image');

    const reader = new FileReader();

    if (!isVid) {
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const maxW = 1600;
          const maxH = 900;
          let w = img.width;
          let h = img.height;
          if (w > maxW) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          }
          if (h > maxH) {
            w = Math.round((w * maxH) / h);
            h = maxH;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
            setBannerPreview(compressedUrl);
            brutalistToast('Banner foto siap disimpan', 'success');
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        const vidUrl = reader.result as string;
        setBannerPreview(vidUrl);
        brutalistToast('Banner video siap disimpan', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = async () => {
    if (!session) return;
    const cleanUser = editUsername.trim().replace(/^@+/, '');
    if (!cleanUser) {
      brutalistToast('Username tidak boleh kosong', 'error');
      return;
    }

    const cleanName = editName.trim() || cleanUser;
    const newBanner = bannerPreview || session.bannerUrl;
    const newType = bannerType || session.bannerType;

    const updated: UserSession = {
      ...session,
      name: cleanName,
      username: `@${cleanUser}`,
      initials: computeInitials(cleanUser, cleanName),
      bio: editBio.trim(),
      bannerUrl: newBanner,
      bannerType: newType,
    };

    try {
      saveUserSession(updated);
    } catch {
      try {
        if (newBanner) {
          await saveLargeMedia('custom_banner_media', newBanner);
          const safeSession = { ...updated, bannerUrl: 'idb://custom_banner_media' };
          saveUserSession(safeSession);
        }
      } catch (err) {
        console.error('IDB storage failed:', err);
      }
    }

    setSession(updated);
    setIsModalOpen(false);
    brutalistToast('Banner dan profil berhasil disimpan!', 'success');
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
    bannerPreview ||
    session.bannerUrl ||
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop';
  const displayAtUsername = session.username.startsWith('@') ? session.username : `@${session.username}`;
  const displayName = session.name || session.username.replace(/^@+/, '');

  return (
    <div className="w-full min-h-screen bg-[#0f0f11] flex items-center justify-center p-0 sm:p-4 text-slate-900 dark:text-white selection:bg-pink-500 selection:text-white">
      {/* FRAME CONTAINER PROFILE REPLICA TIKTOK */}
      <main className="w-full max-w-[420px] min-h-screen sm:min-h-[820px] sm:max-h-[900px] bg-white dark:bg-zinc-950 sm:rounded-[36px] shadow-2xl overflow-hidden relative flex flex-col justify-between border-0 sm:border-[6px] sm:border-neutral-800 transition-colors">
        
        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 relative scroll-smooth pb-8 bg-white dark:bg-zinc-950">

          {/* TOP ABSOLUTE BANNER IMAGE WITH CSS FADE MASK (PERSIS REPLICA HTML) */}
          <div className="absolute top-0 inset-x-0 h-[240px] bg-white dark:bg-zinc-950 overflow-hidden select-none z-0">
            {bannerType === 'video' ? (
              <video
                key={currentBannerUrl}
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.05]"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0) 90%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0) 90%)',
                }}
              >
                <source src={currentBannerUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={currentBannerUrl}
                alt="Banner"
                className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.05]"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0) 90%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0) 90%)',
                }}
              />
            )}
          </div>

          {/* TOP BAR NAVIGATION ICONS */}
          <header className="relative top-0 left-0 right-0 flex justify-between items-center px-4 pt-4 z-30 mb-2">
            {/* Left Action Icons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition active:scale-95 cursor-pointer"
                aria-label="Edit Profile"
                title="Edit Banner & Profil"
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={toggleSound}
                className="relative w-8 h-8 rounded-full bg-amber-400 border-[2px] border-amber-200 flex items-center justify-center shadow-sm hover:brightness-105 transition active:scale-95 cursor-pointer select-none"
                aria-label="Points & Audio"
                title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
              >
                <span className="text-white font-black text-xs tracking-tight drop-shadow-sm">P</span>
                {!isMuted && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                )}
              </button>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition active:scale-95 cursor-default select-none"
                  aria-label="Profile views"
                >
                  <User size={18} />
                </button>
                <span className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-800 text-black dark:text-white font-extrabold text-[10px] leading-none px-1.5 py-0.5 rounded-md shadow-sm border border-slate-200 dark:border-zinc-700">
                  5
                </span>
              </div>

              <button
                className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition active:scale-95 cursor-default select-none"
                aria-label="Add friends"
              >
                <UserPlus size={18} />
              </button>

              <Link
                href="/"
                className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition active:scale-95 cursor-pointer"
                aria-label="Menu Kembali"
                title="Kembali ke Beranda"
              >
                <Menu size={18} />
              </Link>
            </div>
          </header>

          {/* MAIN PROFILE DETAILS */}
          <div className="px-5 pt-8 relative z-20">
            <div className="flex justify-between items-start">
              
              {/* LEFT COLUMN: USERNAME & BADGE, HANDLE, STATS */}
              <div className="flex-1 pr-2 pt-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-[32px] sm:text-[34px] font-black tracking-tight text-slate-900 dark:text-white leading-none font-sans line-clamp-1">
                    {displayName}
                  </h1>
                  <span className="bg-[#ff2c55] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm select-none shrink-0">
                    3
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 mt-1.5 mb-2">
                  <p className="text-sm font-bold text-slate-400 dark:text-zinc-500 tracking-normal">
                    {displayAtUsername}
                  </p>
                  {(session.isVerified || session.role === 'DEVELOPER') && (
                    <span title="Terverifikasi" className="inline-flex items-center shrink-0">
                      <svg className="w-4 h-4 text-[#20D5EC]" viewBox="0 0 24 24" fill="none">
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

                {(session.isVerified || session.role === 'DEVELOPER') && (
                  <div className="flex flex-col gap-0.5 mb-3">
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

                <div className="flex items-center space-x-6 my-2 text-left">
                  <div className="cursor-pointer">
                    <div className="text-xl font-black text-slate-900 dark:text-white leading-none">547</div>
                    <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 mt-1">Mengikuti</div>
                  </div>
                  <div className="cursor-pointer">
                    <div className="text-xl font-black text-slate-900 dark:text-white leading-none">67,3 rb</div>
                    <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 mt-1">Pengikut</div>
                  </div>
                  <div className="cursor-pointer">
                    <div className="text-xl font-black text-slate-900 dark:text-white leading-none">547,2 rb</div>
                    <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 mt-1">Suka</div>
                  </div>
                </div>

                <div className="mt-5 mb-4 text-slate-900 dark:text-zinc-100 font-extrabold text-sm sm:text-base tracking-wide whitespace-pre-line">
                  {session.bio || '魚座'}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition active:scale-95 shadow-2xs text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#FF85A0] flex items-center justify-center text-white shrink-0">
                      <Wrench size={9} strokeWidth={2.5} />
                    </span>
                    <span>Studio FZ</span>
                  </Link>

                  <button
                    onClick={() => setIsCleanMode(!isCleanMode)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition active:scale-95 shadow-2xs text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#C084FC] flex items-center justify-center text-white shrink-0">
                      {isCleanMode ? <EyeOff size={9} strokeWidth={2.5} /> : <Eye size={9} strokeWidth={2.5} />}
                    </span>
                    <span>{isCleanMode ? 'Mode Biasa' : 'Mode Bersih'}</span>
                  </button>

                  <Link
                    href="/iqcv2"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition active:scale-95 shadow-2xs text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#10B981] to-[#34D399] flex items-center justify-center text-white shrink-0">
                      <ImageIcon size={9} strokeWidth={2.5} />
                    </span>
                    <span>IQC Media</span>
                  </Link>

                  <Link
                    href="/brat"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition active:scale-95 shadow-2xs text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#84CC16] to-[#A3E635] flex items-center justify-center text-black shrink-0">
                      <Sticker size={9} strokeWidth={2.5} />
                    </span>
                    <span>Brat Gen</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: SPEECH BUBBLE & AVATAR */}
              <div className="relative flex flex-col items-end shrink-0 z-30 pt-0">
                <div
                  onClick={() => {
                    setNoteInput(activeNoteText || '');
                    setIsNoteModalOpen(true);
                  }}
                  className="relative mb-2 mr-1 bg-white dark:bg-zinc-800 px-4 py-2.5 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-md max-w-[130px] text-center transform transition duration-300 select-none cursor-pointer after:content-[''] after:absolute after:-bottom-[6px] after:right-[28px] after:w-3 after:h-3 after:bg-white dark:after:bg-zinc-800 after:rotate-45 after:border-r after:border-b after:border-slate-100 dark:after:border-zinc-700 after:rounded-[2px]"
                >
                  <p className="text-xs font-bold text-slate-600 dark:text-zinc-200 leading-tight">
                    {activeNoteText ? activeNoteText : <>Ada yang<br />seru?</>}
                  </p>
                </div>

                <div className="relative group cursor-pointer z-30 mt-1">
                  <div
                    onClick={handleAvatarTap}
                    className="w-[104px] h-[104px] rounded-full p-[3px] bg-white dark:bg-zinc-900 shadow-lg overflow-hidden border border-slate-100 dark:border-zinc-800"
                  >
                    {session.avatarUrl ? (
                      <img
                        src={session.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full filter brightness-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-2xl font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-zinc-800 rounded-full">
                        {session.initials}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 transform translate-x-0.5 translate-y-0.5 w-7 h-7 rounded-full bg-[#00f2fe] border-2 border-white dark:border-zinc-900 flex items-center justify-center shadow-md hover:brightness-110 active:scale-90 transition cursor-pointer"
                    aria-label="Ganti Avatar"
                    title="Ganti Foto Profil"
                  >
                    <Plus className="w-4 h-4 text-white stroke-[3.5]" />
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
                </div>
              </div>

            </div>

            {/* CONTENT TABS SECTION (TIKTOK STYLE) */}
            <div className="mt-8 border-t border-slate-100 dark:border-zinc-800 pt-3">
              <div className="flex justify-around items-center text-slate-400 dark:text-zinc-600">
                <button
                  onClick={() => setActiveTab('grid')}
                  className={`flex-1 py-2 flex flex-col items-center cursor-pointer transition ${
                    activeTab === 'grid'
                      ? 'border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white'
                      : 'hover:text-slate-600 dark:hover:text-zinc-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 4h5v5H3V4zm7 0h5v5h-5V4zm7 0h5v5h-5V4zM3 11h5v5H3v-5zm7 0h5v5h-5v-5zm7 0h5v5h-5v-5zM3 18h5v5H3v-5zm7 0h5v5h-5v-5zm7 0h5v5h-5v-5z"/>
                  </svg>
                </button>

                <button
                  onClick={() => setActiveTab('private')}
                  className={`flex-1 py-2 flex flex-col items-center cursor-pointer transition ${
                    activeTab === 'private'
                      ? 'border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white'
                      : 'hover:text-slate-600 dark:hover:text-zinc-400'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setActiveTab('bookmark')}
                  className={`flex-1 py-2 flex flex-col items-center cursor-pointer transition ${
                    activeTab === 'bookmark'
                      ? 'border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white'
                      : 'hover:text-slate-600 dark:hover:text-zinc-400'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setActiveTab('liked')}
                  className={`flex-1 py-2 flex flex-col items-center cursor-pointer transition ${
                    activeTab === 'liked'
                      ? 'border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white'
                      : 'hover:text-slate-600 dark:hover:text-zinc-400'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {activeTab === 'grid' && (
                historyItems.length > 0 ? (
                  <div className="grid grid-cols-3 gap-0.5 mt-2 rounded-lg overflow-hidden">
                    {historyItems.map((item) => (
                      <div key={item.id} className="aspect-[3/4] bg-slate-100 dark:bg-zinc-900 relative group overflow-hidden">
                        {item.previewUrl ? (
                          <img src={item.previewUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-2 text-center text-[10px] text-zinc-500 font-bold">
                            {item.title}
                          </div>
                        )}
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                          <Film className="w-2.5 h-2.5" /> {item.fileFormat?.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-0.5 mt-2 bg-slate-50 dark:bg-zinc-900/60 min-h-[160px] rounded-lg items-center justify-center text-slate-300 dark:text-zinc-700">
                    <div className="col-span-3 text-center py-10">
                      <Film className="w-10 h-10 mx-auto text-slate-300 dark:text-zinc-700 mb-2" strokeWidth={1.5} />
                      <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">Belum ada video atau kreasi</p>
                    </div>
                  </div>
                )
              )}

              {activeTab !== 'grid' && (
                <div className="py-12 text-center text-xs font-semibold text-slate-400 dark:text-zinc-500">
                  Tab ini bersifat privat
                </div>
              )}
            </div>

          </div>

        </div>

        {/* BOTTOM NAVIGATION BAR (TIKTOK STYLE) */}
        <nav className="border-t border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 px-4 py-2.5 flex justify-around items-center z-40 shrink-0">
          <Link href="/" className="flex flex-col items-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-[10px] font-semibold mt-0.5">Beranda</span>
          </Link>

          <Link href="/iqcv2" className="flex flex-col items-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="text-[10px] font-semibold mt-0.5">Temukan</span>
          </Link>

          <Link href="/" className="w-11 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold relative shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer">
            <span className="text-lg leading-none">+</span>
          </Link>

          <Link href="/faq" className="flex flex-col items-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
            </svg>
            <span className="text-[10px] font-semibold mt-0.5">Bantuan</span>
          </Link>

          <button className="flex flex-col items-center text-slate-900 dark:text-white font-bold cursor-default">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-[10px] font-bold mt-0.5">Profil</span>
          </button>
        </nav>

      </main>

      {/* MODAL EDIT PROFILE */}
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
                  className="w-full h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center cursor-pointer border border-dashed border-zinc-400 dark:border-zinc-700 overflow-hidden"
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
                      <Upload size={20} className="mr-2" /> <span className="text-xs">Upload Banner (Foto/Video)</span>
                    </div>
                  )}
                </div>

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

                <button onClick={saveProfileChanges} className="w-full py-3 bg-indigo-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-indigo-500 transition-colors cursor-pointer shadow-md">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CATATAN STATUS */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsNoteModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <form onSubmit={handleSaveNote} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">Catatan Status</h3>
              <input
                type="text"
                maxLength={60}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Ada yang seru?..."
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

      {/* MODAL AKSES DEVELOPER */}
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
