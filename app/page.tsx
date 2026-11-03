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
  ShieldCheck,
  Layers,
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

const ROTATING_TARGETS = [
  'kreator modern.',
  'pegiat digital.',
  'pembuat konten viral.',
  'desainer visual.',
  'generasi kreatif.',
];

const ROTATING_SUBTITLES = [
  'Konversi file instan, pembuat konten viral, dan alat visual estetik yang dirancang dengan presisi dan performa tinggi.',
  'Suite produktivitas praktis berbasis peramban dengan pemrosesan instan tanpa registrasi yang rumit.',
  'Ekspor format stiker WhatsApp 1:1, video TikTok kualitas jernih, dan kode QR vektor siap bagikan.',
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [subtitleIndex, setSubtitleIndex] = useState<number>(0);

  useEffect(() => {
    testConnection();
    const targetInterval = setInterval(() => {
      setTargetIndex((prev) => (prev + 1) % ROTATING_TARGETS.length);
    }, 3200);
    const subInterval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % ROTATING_SUBTITLES.length);
    }, 5500);
    return () => {
      clearInterval(targetInterval);
      clearInterval(subInterval);
    };
  }, []);

  const getToolIcon = (id: string): React.ReactElement => {
    const icons: Record<string, React.ReactElement> = {
      converter: <ArrowRightLeft className="w-5 h-5" />,
      brat: <Type className="w-5 h-5" />,
      iqc: <MessageSquareQuote className="w-5 h-5" />,
      iqcv2: <Smartphone className="w-5 h-5" />,
      qr: <QrCode className="w-5 h-5" />,
      fakett: <MessageCircle className="w-5 h-5" />,
      meme: <Laugh className="w-5 h-5" />,
      sarcasm: <Flame className="w-5 h-5" />,
      tiktok: <Video className="w-5 h-5" />
    };
    return icons[id] || <Zap className="w-5 h-5" />;
  };

  const filteredTools = TOOLS_CONFIG.filter((tool) => {
    if (tool.id === 'all') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return tool.name.toLowerCase().includes(q) || tool.badge.toLowerCase().includes(q) || tool.id.toLowerCase().includes(q);
  });

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {activeTab === 'all' && !searchQuery && (
        <div className="relative mb-8">
          <div aria-hidden="true" className="absolute -top-24 sm:-top-32 left-1/2 w-screen h-[calc(100%+6rem)] sm:h-[calc(100%+8rem)] overflow-hidden pointer-events-none z-0" style={{ transform: 'translate3d(-50%, 0, 0)' }}>
            <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover transform-gpu">
              <source src="/assets/aistudio/From_Klickpin.com-_Fall_outfit_ideas_for_women_that_make_everyday_moments_look_more_intentional_memorable_and_beautifully_styled_for_anyone_planni_a1b1f661.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950 pointer-events-none" />
          </div>

          <div className="relative z-10 pt-12 pb-2">
            <div className="max-w-4xl mx-auto text-center px-4 mb-14 sm:mb-20">
              <h1 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
                <span>Alat utilitas untuk </span>
                <span className="text-indigo-300 underline decoration-indigo-400/40 decoration-wavy underline-offset-8">{ROTATING_TARGETS[targetIndex]}</span>
              </h1>
              <p className="text-base sm:text-xl text-white/95 leading-relaxed font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                {ROTATING_SUBTITLES[subtitleIndex]}
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="relative min-h-[400px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {activeTab === 'all' && !searchQuery && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  whileHover={{ y: -5 }}
                  className="modern-glass-card rounded-3xl p-8 text-left flex flex-col justify-between h-full cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 transition-colors">
                    {getToolIcon(t.id)}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{t.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2">Suite untuk {t.name.toLowerCase()} dengan pemrosesan instan.</p>
                  <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                    Buka Alat <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
          {activeTab !== 'all' && (
            <>
              <button onClick={() => setActiveTab('all')} className="mb-8 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 rounded-xl font-bold text-xs shadow-sm cursor-pointer">
                ← Kembali
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
            </>
          )}
        </motion.div>
      </section>
    </AppShell>
  );
}
