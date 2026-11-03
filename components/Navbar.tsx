'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User, UserPlus, Menu, X, Home, Wrench, HelpCircle,
  ShieldCheck, Info, Clock, LogOut, ChevronRight, Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { UserSession, getStoredUserSession, clearUserSession, AUTH_CHANGE_EVENT } from '@/lib/auth-session';
import { brutalistToast, brutalistConfirm } from '@/lib/popup-service';

export const TOOLS_CONFIG = [
  { id: 'all', name: 'Semua Alat', badge: 'Suite', path: '/' },
  { id: 'converter', name: 'Konverter File', badge: 'Cepat', path: '/converter' },
  { id: 'brat', name: 'Brat Generator', badge: 'Viral', path: '/brat' },
  { id: 'iqc', name: 'IQC WhatsApp', badge: 'Teks', path: '/iqc' },
  { id: 'iqcv2', name: 'IQC V2 Media', badge: 'Foto', path: '/iqcv2' },
  { id: 'qr', name: 'Generator QR', badge: 'Bersih', path: '/qr' },
  { id: 'fakett', name: 'TikTok Comment', badge: 'Mockup', path: '/fakett' },
  { id: 'meme', name: 'Meme Indonesia', badge: 'Populer', path: '/meme' },
  { id: 'sarcasm', name: 'Sarkasme AI', badge: 'Gemini', path: '/sarcastic' },
  { id: 'tiktok', name: 'TikTok Downloader', badge: 'HD', path: '/tiktok' },
];

export default function Navbar({ activeTab, setActiveTab, openHistory }: any) {
  const pathname = usePathname();
  const [userSession, setUserSession] = useState<UserSession | null>(() => getStoredUserSession());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = (e: Event) => setUserSession((e as CustomEvent<UserSession | null>).detail);
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  return (
    <>
      {/* NAVBAR UTAMA */}
      <header className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6 w-full flex justify-center pointer-events-none">
        <div className="pointer-events-auto liquid-glass-pill rounded-full py-2.5 px-4 sm:px-6 flex items-center justify-between gap-4 transition-all max-w-2xl w-full">
          
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-full border border-white/60 overflow-hidden shadow-sm bg-white shrink-0 group-hover:scale-105 transition-transform">
              <Image src="/assets/aistudio/Alice_ac18f5a2.jpeg" alt="FZ Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-white">FZTOOLS</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tombol Menu dengan efek Liquid Circle */}
            <motion.button
              onClick={() => setIsSidebarOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-full glass-circle text-zinc-900 dark:text-white cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Menu className="w-4 h-4 relative z-10" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* SIDEBAR & OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-md"
            />

            {/* Panel Sidebar dengan efek Liquid Glass & Bouncy Spring */}
            <motion.div
              initial={{ x: '100%', borderRadius: '100% 0 0 100%' }}
              animate={{ x: 0, borderRadius: '32px 0 0 32px' }}
              exit={{ x: '100%', borderRadius: '100% 0 0 100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
              className="relative z-10 w-full max-w-sm bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl border-l border-white/50 dark:border-zinc-800 h-full shadow-[-20px_0_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
            >
              {/* Header Sidebar */}
              <div className="p-6 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-300">Menu Alat</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="p-2 glass-circle hover:scale-105 transition-transform cursor-pointer text-zinc-700 dark:text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* List Menu */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 scrollbar-hide">
                {TOOLS_CONFIG.map((t) => {
                  const isActive = pathname === t.path;
                  return (
                    <Link
                      key={t.id}
                      href={t.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                        isActive 
                          ? 'glass-btn-purple shadow-lg shadow-purple-500/20' 
                          : 'bg-white/40 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10 border border-transparent hover:border-white/50 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
                        {t.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-2 py-1 rounded-full ${isActive ? 'bg-black/20 text-white' : 'bg-black/5 dark:bg-white/10 text-zinc-500'}`}>
                          {t.badge}
                        </span>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Footer Sidebar (Opsional - Info User jika ada) */}
              <div className="p-6 border-t border-black/5 dark:border-white/5 bg-white/20 dark:bg-black/20">
                <p className="text-[10px] text-center text-zinc-500 font-medium">
                  FZTOOLS &copy; {new Date().getFullYear()} — Liquid Glass Edition
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
