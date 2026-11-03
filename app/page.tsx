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
  Search
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
  }, []);

  useEffect(() => {
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

  const filteredTools = TOOLS_CONFIG.filter((tool) => {
    if (tool.id === 'all') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.badge.toLowerCase().includes(q) ||
      tool.id.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      {activeTab === 'all' && !searchQuery && (
        <div className="relative mb-8">
          <div
            aria-hidden="true"
            className="absolute -top-24 sm:-top-32 left-1/2 w-screen h-[calc(100%+6rem)] sm:h-[calc(100%+8rem)] overflow-hidden pointer-events-none z-0"
            style={{
              transform: 'translate3d(-50%, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover transform-gpu will-change-transform"
              style={{
                opacity: 1,
              }}
            >
              <source
                src="/assets/aistudio/From_Klickpin.com-_Fall_outfit_ideas_for_women_that_make_everyday_moments_look_more_intentional_memorable_and_beautifully_styled_for_anyone_planni_a1b1f661.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950 pointer-events-none" />
          </div>

          <div className="relative z-10 pt-6 sm:pt-12 pb-2">
            <div className="max-w-4xl mx-auto text-center px-4 mb-14 sm:mb-20">
              <div className="flex items-center justify-center gap-2 text-xs mb-6 font-medium">
                <span className="uppercase tracking-[0.2em] font-bold text-[10px] text-indigo-300 bg-black/40 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-xs shadow-sm">
                  Paket Kreatif
                </span>
                <span aria-hidden="true" className="text-white/60">·</span>
                <span className="uppercase tracking-[0.2em] font-bold text-[10px] text-white/90 bg-black/40 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-xs shadow-sm">
                  Next.js 15
                </span>
              </div>

              <h1 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
                <span>Alat utilitas untuk </span>
                <span className="inline-block relative overflow-hidden align-top sm:align-baseline text-left">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={targetIndex}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -22 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block text-indigo-300 bg-gradient-to-r from-indigo-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent underline decoration-indigo-400/40 decoration-wavy underline-offset-8"
                    >
                      {ROTATING_TARGETS[targetIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              <div className="min-h-[4rem] sm:min-h-[3.5rem] flex items-center justify-center max-w-2xl mx-auto mb-10">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={subtitleIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="text-base sm:text-xl text-white/95 leading-relaxed font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]"
                  >
                    {ROTATING_SUBTITLES[subtitleIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap justify-center gap-2.5">
                {TOOLS_CONFIG.filter(t => t.id !== 'all').map((t, idx) => (
                  <motion.button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.04 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-btn-purple px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer border border-white/20"
                  >
                    {t.name}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/20 dark:border-white/10 mb-8">
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white drop-shadow-md">
                Direktori Alat
              </h2>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="glass-input rounded-full flex items-center px-4 py-2 flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari alat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none flex-1 text-xs text-zinc-800 dark:text-white placeholder-zinc-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white drop-shadow-md shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {filteredTools.length} MODUL AKTIF
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="mb-6 p-4 modern-glass-card rounded-2xl text-xs font-semibold flex items-center justify-between">
          <span className="text-zinc-600 dark:text-zinc-400">
            Menampilkan {filteredTools.length} hasil untuk pencarian &quot;{searchQuery}&quot;
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer font-bold active:scale-95 transition-transform"
          >
            Reset Pencarian ✕
          </button>
        </div>
      )}

      <section className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className="w-full"
          >
            {activeTab !== 'all' && (
              <motion.button
                onClick={() => setActiveTab('all')}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.98 }}
                className="mb-8 flex items-center gap-2.5 px-4 py-2 glass-circle rounded-xl text-zinc-900 dark:text-white transition-all cursor-pointer font-semibold text-[11px] uppercase tracking-wider group"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>Kembali ke Beranda</span>
              </motion.button>
            )}

            {activeTab === 'all' && !searchQuery && (
              <div className="mb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((t) => (
                    <motion.button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className="modern-glass-card text-left rounded-2xl p-6 group flex flex-col justify-between h-full cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div className="w-10 h-10 rounded-xl glass-circle flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:scale-110 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                            <Zap className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {t.id}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
                          {t.name}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal mb-6">
                          {t.id === 'converter' && 'Konversi cepat format gambar (WEBP, PNG, JPG), encoding Base64, dan manipulasi data JSON/CSV.'}
                          {t.id === 'brat' && 'Buat teks dan animasi GIF bergaya viral Charli XCX brat dengan kustomisasi presisi.'}
                          {t.id === 'iqc' && 'Kartu kutipan pesan WhatsApp gaya iPhone dengan efek blur glassmorphism yang estetik.'}
                          {t.id === 'iqcv2' && 'Generator kartu media iOS dengan pemotongan foto otomatis dan menu konteks interaktif.'}
                          {t.id === 'qr' && 'Buat kode QR modern untuk URL, teks, atau WiFi dengan desain poster yang bersih dan minimalis.'}
                          {t.id === 'fakett' && 'Mockup komentar TikTok realistis dengan foto profil kustom dan metrik interaksi viral.'}
                          {t.id === 'meme' && 'Template meme Indonesia populer untuk pembuatan konten instan.'}
                          {t.id === 'sarcasm' && 'Generator roasting dan sarkasme bertenaga AI untuk sindiran tajam khas netizen.'}
                          {t.id === 'tiktok' && 'Unduh video TikTok tanpa watermark dan audio MP3 kualitas tinggi secara gratis.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors uppercase tracking-widest">
                          Buka Alat
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

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
        </AnimatePresence>
      </section>

      <section className="mt-20 py-12 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl glass-circle flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              Pemrosesan Cepat
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Konversi file berkecepatan tinggi dan generator visual yang diproses langsung di browser Anda.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl glass-circle flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              Privasi Terjaga
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Penyimpanan lokal berbasis sesi memastikan data dan profil Anda tetap terlindungi dan aman.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl glass-circle flex items-center justify-center">
              <Layers className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              Kreativitas Multi-Format
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Format output yang disesuaikan secara proporsional untuk kemudahan berbagi di seluruh platform sosial.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
