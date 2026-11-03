'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import {
  Info,
  Zap,
  ShieldCheck,
  Layers,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto py-4 sm:py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-indigo-500 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl shadow-zinc-200/20 dark:shadow-black/20 overflow-hidden mb-8">
          <div className="p-6 sm:p-10 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-600 dark:text-indigo-400">
                Filosofi & Desain
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
              Tentang FZTOOLS Suite
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
              Platform utilitas dan generator konten kreatif dengan estetika minimalis modern, dirancang untuk performa tinggi, bebas hambatan, dan privasi 100% lokal pada peramban Anda.
            </p>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl backdrop-blur-md">
                <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-1.5 text-zinc-900 dark:text-white">
                  Pemrosesan Cepat
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Konversi gambar dan rendering visual diproses langsung secara instan pada memori Canvas peramban.
                </p>
              </div>

              <div className="p-5 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl backdrop-blur-md">
                <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-1.5 text-zinc-900 dark:text-white">
                  Privasi Terjamin
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Foto dan dokumen Anda tidak diunggah ke pihak ketiga. Seluruh pemrosesan berjalan di sisi klien.
                </p>
              </div>

              <div className="p-5 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl backdrop-blur-md">
                <div className="w-9 h-9 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center mb-3">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-1.5 text-zinc-900 dark:text-white">
                  Estetika Bersih
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Antarmuka glassmorphism halus dengan transisi mulus dan tipografi proporsional untuk kenyamanan visual.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
                Koleksi Alat Kreatif & Utilitas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl">
                  <p className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                    IQC & IQC v2 Generator
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Generator screenshot pesan WhatsApp iOS autentik dengan latar blur, pill reaksi, dan menu konteks estetik.
                  </p>
                </div>

                <div className="p-4 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl">
                  <p className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                    Brat & Brat GIF Generator
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Generator teks viral tipografi blur hijau khas brat dengan opsi ekspor animasi GIF dan stiker statis.
                  </p>
                </div>

                <div className="p-4 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl">
                  <p className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                    Konverter Berkas & Base64
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Ubah format PNG, JPEG, WEBP, konversi Base64, dan manipulasi data JSON/CSV berkecepatan tinggi.
                  </p>
                </div>

                <div className="p-4 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl">
                  <p className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                    TikTok Downloader & Mockup
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Unduh video TikTok tanpa watermark dan buat tangkapan layar komentar realistis untuk konten kreatif.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/iqc"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
              >
                <span>Coba Generator IQC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/daftar"
                className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
              >
                Buat Akun Sesi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
