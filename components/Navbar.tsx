'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  UserPlus,
  Menu,
  X,
  Home,
  Wrench,
  HelpCircle,
  ShieldCheck,
  Info,
  Clock,
  LogOut,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  UserSession,
  getStoredUserSession,
  clearUserSession,
  AUTH_CHANGE_EVENT,
} from '@/lib/auth-session';
import { brutalistToast, brutalistConfirm } from '@/lib/popup-service';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  openHistory?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const TOOLS_CONFIG = [
  { id: 'all', name: 'Semua Alat', badge: 'Suite', color: 'bg-zinc-100', path: '/' },
  { id: 'converter', name: 'Konverter File', badge: 'Cepat', color: 'bg-indigo-50', path: '/converter' },
  { id: 'brat', name: 'Brat Generator', badge: 'Viral', color: 'bg-lime-50', path: '/brat' },
  { id: 'iqc', name: 'IQC WhatsApp', badge: 'Teks', color: 'bg-rose-50', path: '/iqc' },
  { id: 'iqcv2', name: 'IQC V2 Media', badge: 'Foto', color: 'bg-emerald-50', path: '/iqcv2' },
  { id: 'chat-story', name: 'AU Chat Story', badge: 'Baru', color: 'bg-fuchsia-50', path: '/chat-story' },
  { id: 'qr', name: 'Generator QR', badge: 'Bersih', color: 'bg-cyan-50', path: '/qr' },
  { id: 'fakett', name: 'TikTok Comment', badge: 'Mockup', color: 'bg-amber-50', path: '/fakett' },
  { id: 'meme', name: 'Meme Indonesia', badge: 'Populer', color: 'bg-orange-50', path: '/meme' },
  { id: 'sarcasm', name: 'Sarkasme AI', badge: 'Gemini', color: 'bg-rose-100', path: '/sarcastic' },
  { id: 'tiktok', name: 'TikTok Downloader', badge: 'HD', color: 'bg-violet-50', path: '/tiktok' },
];

export default function Navbar({
  activeTab,
  setActiveTab,
  openHistory,
}: NavbarProps) {
  const pathname = usePathname();
  const [userSession, setUserSession] = useState<UserSession | null>(() => getStoredUserSession());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);

  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<UserSession | null>;
      setUserSession(custom.detail || null);
    };
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  const handleLogout = async () => {
    const confirmed = await brutalistConfirm(
      'KELUAR DARI SESI',
      'Apakah Anda yakin ingin keluar dari akun ini? Sesi lokal akan dihapus.'
    );
    if (confirmed) {
      clearUserSession();
      brutalistToast('Sesi akun berhasil dihapus.', 'info');
      setIsSidebarOpen(false);
    }
  };

  const getCurrentSectionTitle = () => {
    if (pathname === '/iqcv2') return 'IQC MEDIA';
    if (pathname === '/iqc' || pathname === '/iqctool') return 'IQC TEKS';
    if (pathname === '/brat') return 'BRAT';
    if (pathname === '/converter') return 'KONVERTER';
    if (pathname === '/fakett') return 'TIKTOK';
    if (pathname === '/meme') return 'MEME';
    if (pathname === '/sarcastic') return 'SARKAS AI';
    if (pathname === '/chat-story') return 'AU STORY';
    if (pathname === '/qr') return 'QR';
    if (pathname === '/tiktok') return 'DOWNLOADER';
    if (pathname === '/daftar') return 'DAFTAR';
    if (pathname === '/akun') return 'PROFIL';
    if (pathname === '/tentang') return 'TENTANG';
    if (pathname === '/faq') return 'FAQ';
    if (pathname === '/privasi') return 'PRIVASI';
    return 'FZ SUITE';
  };

  return (
    <>
      <header className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6 w-full flex justify-center pointer-events-none">
        <div className="pointer-events-auto navbar-blur rounded-full py-2 px-3 sm:px-5 flex items-center justify-between gap-3 sm:gap-6 max-w-2xl w-full">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer select-none" title="Beranda FZTOOLS">
            <div className="relative w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-transform shadow-xs group-hover:scale-105 bg-white shrink-0">
              <Image src="/assets/aistudio/Alice_ac18f5a2.jpeg" alt="FZ Logo" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white group-hover:text-indigo-500 transition-colors">FZTOOLS</span>
          </Link>

          <div className="hidden xs:flex items-center gap-2 px-3 py-1 rounded-full glass-circle text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="tracking-widest uppercase">{getCurrentSectionTitle()}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeSwitcher />
            {userSession ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/akun" className="flex items-center gap-2 p-1 pr-3 bg-zinc-900/90 dark:bg-zinc-900/90 hover:bg-zinc-900 text-white rounded-full transition-all cursor-pointer shadow-md border border-white/15" title={`Akun: @${userSession.username}`}>
                  <div className="relative w-7 h-7 rounded-full p-[2px] flex items-center justify-center overflow-hidden shrink-0">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,#6366f1,#ec4899,#8b5cf6,#06b6d4,#6366f1)]" />
                    <div className="relative z-10 w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-bold text-[10px] text-white overflow-hidden">
                      {(userSession as any).avatarUrl ? (
                        <img key={(userSession as any).avatarUrl} src={(userSession as any).avatarUrl} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        userSession.initials
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold max-w-[65px] truncate">@{userSession.username}</span>
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/daftar" className="flex items-center gap-1.5 p-1 pr-3 bg-zinc-900/90 dark:bg-zinc-900/90 hover:bg-zinc-900 text-white rounded-full transition-all cursor-pointer shadow-md border border-white/15">
                  <div className="relative w-7 h-7 rounded-full p-[2px] flex items-center justify-center overflow-hidden shrink-0">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,#6366f1,#ec4899,#8b5cf6,#06b6d4,#6366f1)]" />
                    <div className="relative z-10 w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-white">
                      <UserPlus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Join</span>
                </Link>
              </motion.div>
            )}

            <motion.button onClick={() => setIsSidebarOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-full glass-circle text-zinc-900 dark:text-white transition-all cursor-pointer" aria-label="Buka Menu">
              <Menu className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 220 }} className="relative z-10 w-full max-w-xs sm:max-w-sm bg-white/80 dark:bg-zinc-950/85 backdrop-blur-3xl border-l border-white/20 dark:border-white/10 h-full shadow-[-20px_0_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden will-change-transform transform-gpu">
              <div className="p-5 flex items-center justify-between border-b border-zinc-200/40 dark:border-zinc-800/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full glass-circle flex items-center justify-center text-zinc-900 dark:text-white"><Layers className="w-4 h-4" /></div>
                  <span className="font-bold text-xs uppercase text-zinc-900 dark:text-white tracking-widest">Menu Aplikasi</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 glass-circle text-zinc-400 rounded-full flex items-center justify-center hover:text-rose-500 transition-all cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <div className="space-y-3">
                  {userSession ? (
                    <div className="p-4 rounded-2xl modern-glass-card shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-full p-[2.5px] flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,#6366f1,#ec4899,#8b5cf6,#06b6d4,#6366f1)]" />
                            <div className="relative z-10 w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-bold text-sm text-white overflow-hidden">
                              {(userSession as any).avatarUrl ? (
                                <img key={(userSession as any).avatarUrl} src={(userSession as any).avatarUrl} alt="User" className="w-full h-full object-cover" />
                              ) : (
                                userSession.initials
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">@{userSession.username}</p>
                            <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Sesi Aktif</span>
                          </div>
                        </div>
                        <button onClick={handleLogout} className="p-2 glass-circle text-rose-500 rounded-xl hover:scale-105 transition-all cursor-pointer shadow-xs" title="Keluar Akun"><LogOut className="w-4 h-4" /></button>
                      </div>
                      <Link href="/akun" onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center justify-center py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm">Lihat Profil</Link>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl modern-glass-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 rounded-full p-[2px] flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,#6366f1,#ec4899,#8b5cf6,#06b6d4,#6366f1)]" />
                          <div className="relative z-10 w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-white"><UserPlus className="w-4 h-4" /></div>
                        </div>
                        <div>
                          <p className="font-bold text-[11px] text-zinc-900 dark:text-white uppercase tracking-wider">Akun Kreator</p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Daftar instan untuk menyimpan sesi</p>
                        </div>
                      </div>
                      <Link href="/daftar" onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center justify-center py-2.5 glass-btn-purple rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-md">Mulai Sekarang</Link>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="px-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">Navigasi Utama</p>
                  <Link href="/" onClick={() => setIsSidebarOpen(false)} className={`flex items-center justify-between p-3 rounded-xl transition-all group ${pathname === '/' ? 'glass-circle text-zinc-900 dark:text-white font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white'}`}>
                    <div className="flex items-center gap-3">
                      <Home className={`w-4 h-4 transition-colors ${pathname === '/' ? 'text-indigo-500' : 'group-hover:text-indigo-500'}`} />
                      <span className="text-xs font-bold uppercase tracking-tight">Beranda</span>
                    </div>
                    {pathname === '/' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
                  </Link>

                  <div className="pt-2">
                    <button onClick={() => setIsToolsExpanded(!isToolsExpanded)} className="w-full flex items-center justify-between p-3 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white transition-all group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Wrench className="w-4 h-4 group-hover:text-indigo-500" />
                        <span className="text-xs font-bold uppercase tracking-tight">Semua Tools</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isToolsExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isToolsExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 mt-1 space-y-1">
                          {TOOLS_CONFIG.filter((t) => t.id !== 'all').map((t) => (
                            <Link key={t.id} href={t.path} onClick={() => { if (setActiveTab) setActiveTab(t.id); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${pathname === t.path ? 'glass-btn-purple text-white font-semibold shadow-md' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${pathname === t.path ? 'bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                              <span className="text-[11px] font-bold uppercase tracking-tight">{t.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link href="/akun" onClick={() => setIsSidebarOpen(false)} className={`flex items-center justify-between p-3 rounded-xl transition-all group ${pathname === '/akun' ? 'glass-circle text-zinc-900 dark:text-white font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white'}`}>
                    <div className="flex items-center gap-3">
                      <User className={`w-4 h-4 transition-colors ${pathname === '/akun' ? 'text-indigo-500' : 'group-hover:text-indigo-500'}`} />
                      <span className="text-xs font-bold uppercase tracking-tight">Profil Akun</span>
                    </div>
                  </Link>

                  <div className="pt-4 pb-2">
                    <p className="px-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">Informasi</p>
                    <Link href="/tentang" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white transition-all group">
                      <Info className="w-4 h-4 group-hover:text-indigo-500" />
                      <span className="text-xs font-bold uppercase tracking-tight">Tentang</span>
                    </Link>
                    <Link href="/faq" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white transition-all group">
                      <HelpCircle className="w-4 h-4 group-hover:text-indigo-500" />
                      <span className="text-xs font-bold uppercase tracking-tight">FAQ</span>
                    </Link>
                    <Link href="/privasi" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white transition-all group">
                      <ShieldCheck className="w-4 h-4 group-hover:text-indigo-500" />
                      <span className="text-xs font-bold uppercase tracking-tight">Privasi</span>
                    </Link>
                  </div>

                  {openHistory && (
                    <button onClick={() => { setIsSidebarOpen(false); openHistory(); }} className="w-full flex items-center justify-between p-3 rounded-xl glass-btn-teal transition-all group cursor-pointer mt-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-white" />
                        <span className="text-xs font-bold uppercase tracking-tight text-white">Riwayat Log</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-zinc-200/40 dark:border-zinc-800/40 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xs flex flex-col items-center text-center gap-3">
                <div className="relative w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-md overflow-hidden bg-white">
                  <Image src="/assets/aistudio/Alice_ac18f5a2.jpeg" alt="Footer Logo" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-zinc-900 dark:text-white font-bold text-[10px] uppercase tracking-[0.25em] mb-0.5">FZTOOLS · RIZ UNIVERSE</p>
                  <p className="text-zinc-400 dark:text-zinc-500 text-[9px] font-medium tracking-wider">MODERN CREATIVE SUITE</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
