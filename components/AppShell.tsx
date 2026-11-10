'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HistoryModal from '@/components/HistoryModal';
import AppPopupProvider from '@/components/AppPopupProvider';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export default function AppShell({ 
  children,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}: AppShellProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const pathname = usePathname();
  const isProfile = pathname === '/akun';

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
  }, [pathname]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-100 dark:selection:bg-indigo-900 flex flex-col relative overflow-x-clip" style={{ fontFamily: 'var(--font-sfpro)' }}>
      <AppPopupProvider />

      {!isProfile && (
        <Navbar 
          openHistory={() => setIsHistoryOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      <PageTransition>
        <main className={isProfile ? "flex-1 w-full relative z-10" : "max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-1 w-full relative z-10"}>
          {children}
        </main>
      </PageTransition>

      <Footer />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
