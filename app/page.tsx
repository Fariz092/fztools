'use client';

import React, { useState, useEffect } from 'react';
import { TOOLS_CONFIG } from '@/components/Navbar';
import FileConverterTool from '@/components/tools/FileConverterTool';
import BratTool from '@/components/tools/BratTool';
import IqcTool from '@/components/tools/IqcTool';
import IqcV2Tool from '@/components/tools/IqcV2Tool';
import QrTool from '@/components/tools/QrTool';
import FakeTtCommentTool from '@/components/tools/FakeTtCommentTool';
import IndoMemeTool from '@/components/tools/IndoMemeTool';
import SarcasticMemeTool from '@/components/tools/SarcasticMemeTool';
import TiktokDownloaderTool from '@/components/tools/TiktokDownloaderTool';
import { testConnection } from '@/lib/firebase';
import {
  ArrowRight,
  Zap,
  ArrowRightLeft,
  Type,
  MessageSquareQuote,
  Smartphone,
  QrCode,
  MessageCircle,
  Laugh,
  Flame,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AppShell from '@/components/AppShell';

const ROTATING_TARGETS = ['kreator modern.', 'pegiat digital.', 'pembuat konten viral.'];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [targetIndex, setTargetIndex] = useState<number>(0);

  useEffect(() => {
    testConnection();
    const interval = setInterval(() => {
      setTargetIndex((prev) => (prev + 1) % ROTATING_TARGETS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const getToolIcon = (id: string): React.ReactElement => {
    const icons: Record<string, React.ReactElement> = {
      converter: <ArrowRightLeft className="w-6 h-6" />,
      brat: <Type className="w-6 h-6" />,
      iqc: <MessageSquareQuote className="w-6 h-6" />,
      iqcv2: <Smartphone className="w-6 h-6" />,
      qr: <QrCode className="w-6 h-6" />,
      fakett: <MessageCircle className="w-6 h-6" />,
      meme: <Laugh className="w-6 h-6" />,
      sarcasm: <Flame className="w-6 h-6" />,
      tiktok: <Video className="w-6 h-6" />
    };
    return icons[id] || <Zap className="w-6 h-6" />;
  };

  const filteredTools = TOOLS_CONFIG.filter((t) => t.id !== 'all' && (t.name.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {activeTab === 'all' && !searchQuery && (
        <div className="text-center pt-12 pb-20">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-zinc-900 dark:text-white mb-8 tracking-tight">
            Alat utilitas untuk <br/>
            <span className="text-indigo-600 dark:text-indigo-400">{ROTATING_TARGETS[targetIndex]}</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
            {filteredTools.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                whileHover={{ y: -8, scale: 1.02 }}
                className="modern-glass-card rounded-3xl p-8 text-left flex flex-col gap-4 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white group-hover:scale-110 transition-transform">
                  {getToolIcon(t.id)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">Suite kreator untuk {t.name.toLowerCase()} dengan performa tinggi.</p>
                </div>
                <div className="mt-auto pt-4 flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  Gunakan Sekarang <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {activeTab !== 'all' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button onClick={() => setActiveTab('all')} className="mb-8 text-sm font-bold flex items-center gap-2 hover:text-indigo-600">
            ← Kembali ke Beranda
          </button>
          {activeTab === 'converter' && <FileConverterTool />}
          {activeTab === 'brat' && <BratTool />}
          {activeTab === 'iqc' && <IqcTool />}
          {activeTab === 'iqcv2' && <IqcV2Tool />}
          {activeTab === 'qr' && <QrTool />}
          {activeTab === 'fakett' && <FakeTtCommentTool />}
          {activeTab === 'meme' && <IndoMemeTool />}
          {activeTab === 'sarcasm' && <SarcasticMemeTool />}
          {activeTab === 'tiktok' && <TiktokDownloaderTool />}
        </motion.div>
      )}
    </AppShell>
  );
}
