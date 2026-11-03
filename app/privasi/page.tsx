'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import {
  Lock,
  EyeOff,
  Trash2,
  Database,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { clearUserSession } from '@/lib/auth-session';
import { brutalistConfirm, brutalistToast } from '@/lib/popup-service';
import { motion } from 'motion/react';

export default function PrivacyPage() {
  const handleClearAllData = async () => {
    const confirmed = await brutalistConfirm(
      'HAPUS SEMUA DATA LOKAL',
      'Tindakan ini akan menghapus sesi akun, riwayat konversi gambar, dan seluruh data yang tersimpan di browser Anda. Lanjutkan?',
      'warning'
    );

    if (confirmed) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      clearUserSession();
      brutalistToast('Semua data lokal dan sesi berhasil dibersihkan!', 'success');
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-4 sm:py-8">
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
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-600 dark:text-indigo-400 mb-2 block">
              Komitmen Privasi
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
              Privasi & Keamanan Data
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-xl leading-relaxed">
              Kami memprioritaskan privasi Anda. Seluruh konversi dan pembuatan visual dilakukan langsung di peramban Anda tanpa pelacak tersembunyi.
            </p>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            <div className="space-y-4">
              <div className="p-5 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl flex gap-4 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                    1. Pemrosesan 100% di Sisi Klien
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Konversi gambar, pembuatan meme, teks brat, dan screenshot WhatsApp diproses langsung di memori perangkat Anda tanpa pernah dikirim ke server pihak ketiga.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl flex gap-4 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                    2. Bebas Pelacak Iklan Pihak Ketiga
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Kami tidak memasang pelacak periklanan invasif atau skrip pihak ketiga. Pengalaman menjelajah Anda tetap bersih, hening, dan cepat.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl flex gap-4 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                    3. Kendali Penuh Pengguna
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Sesi akun dan preferensi disimpan pada LocalStorage lokal peramban. Anda dapat membersihkannya kapan saja melalui tombol kendali di bawah ini.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <div className="p-6 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Pembersihan Data Pengguna</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 font-medium leading-relaxed">
                  Ingin menghapus seluruh riwayat, sesi akun lokal, dan pengaturan yang tersimpan pada perangkat ini?
                </p>
                <button
                  onClick={handleClearAllData}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Bersihkan Semua Data Lokal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
