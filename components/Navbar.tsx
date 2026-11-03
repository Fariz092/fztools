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
      <header className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6 w-full flex justify-center pointer-events-none">
        <div className="pointer-events-auto liquid-glass-pill rounded-full py-2.5 px-6 flex items-center justify-between gap-6 transition-all max-w-2xl w-full">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full border border-white/60 overflow-hidden shadow-sm bg-white shrink-0">
              <Image src="/assets/aistudio/Alice_ac18f5a2.jpeg" alt="FZ Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="font-extrabold text-sm text-zinc-900 dark:text-white">FZTOOLS</span>
          </Link>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setIsSidebarOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-full liquid-glass-btn text-zinc-900 dark:text-white cursor-pointer"
            >
              <Menu className="w-4 h-4" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            />
            {/* Sidebar dengan efek Bouncy Liquid */}
            <motion.div
              initial={{ x: '100%', borderRadius: '100% 0 0 100%' }}
              animate={{ x: 0, borderRadius: '40px 0 0 40px' }}
              exit={{ x: '100%', borderRadius: '100% 0 0 100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative z-10 w-full max-w-sm liquid-glass h-full shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-widest">Menu</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/20 rounded-full cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
                {TOOLS_CONFIG.map((t) => (
                  <Link 
                    key={t.id} 
                    href={t.path} 
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between p-4 liquid-glass-btn rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-all"
                  >
                    {t.name}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
