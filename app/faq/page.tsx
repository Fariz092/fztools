'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import {
  HelpCircle,
  Plus,
  Minus,
  Search,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    question: 'Apakah akun di FZTOOLS gratis dan bagaimana sesi saya disimpan?',
    answer:
      'Akun di FZTOOLS 100% gratis tanpa biaya tersembunyi. Sesi akun Anda disimpan secara lokal pada peramban (localStorage) perangkat Anda. Anda dapat membuat username, password, dan verifikasi sederhana tanpa memerlukan email atau registrasi rumit.',
    category: 'Akun & Sesi',
  },
  {
    id: '2',
    question: 'Bagaimana inisial nama saya muncul di bilah navigasi & menu?',
    answer:
      'Begitu Anda mendaftar akun di halaman /daftar, sistem secara otomatis menghitung inisial dari 2 karakter nama pengguna Anda (misalnya @icalhack menjadi "IC"). Inisial ini otomatis muncul di pill bar atas dan di drawer menu.',
    category: 'Akun & Sesi',
  },
  {
    id: '3',
    question: 'Bagaimana cara membuat kutipan WhatsApp IQC dan IQC v2?',
    answer:
      'Cukup buka rute /iqc atau /iqcv2. Anda dapat memilih tema Dark iOS atau Soft Pink, memasukkan nama kontak, teks pesan, dan jam. Untuk IQC v2, Anda juga dapat mengunggah foto dengan auto-crop dan menu aksi konteks realistis.',
    category: 'Alat & Generator',
  },
  {
    id: '4',
    question: 'Apakah berkas foto atau dokumen saya diunggah ke server pihak ketiga?',
    answer:
      'Sama sekali tidak. Semua konversi format (PNG, JPEG, WEBP) dan generator meme dikerjakan langsung secara lokal pada memori peramban Anda menggunakan Canvas API. Privasi Anda terjaga sepenuhnya.',
    category: 'Keamanan & Privasi',
  },
  {
    id: '5',
    question: 'Bagaimana cara keluar atau menghapus sesi akun saya?',
    answer:
      'Buka menu Sidebar lalu pilih keluar, atau kunjungi halaman Profil Akun (/akun) dan tekan tombol "Keluar Sesi". Sesi lokal peramban akan langsung dibersihkan.',
    category: 'Akun & Sesi',
  },
  {
    id: '6',
    question: 'Apakah hasil unduhan memiliki resolusi tinggi untuk media sosial?',
    answer:
      'Ya! Seluruh modul alat menghasilkan gambar dan stiker pada rasio proporsional berkualitas tinggi yang dioptimalkan untuk WhatsApp Status, Instagram Story, maupun feed TikTok.',
    category: 'Alat & Generator',
  },
];

export default function FaqPage() {
  const [openIds, setOpenIds] = useState<string[]>(['1', '3']);
  const [search, setSearch] = useState('');

  const toggleItem = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaq = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

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

        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl shadow-zinc-200/20 dark:shadow-black/20 overflow-hidden mb-6">
          <div className="p-6 sm:p-10 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-600 dark:text-indigo-400 mb-2 block">
              Pusat Bantuan
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-xl leading-relaxed">
              Temukan informasi seputar akun lokal, alat kreator, generator konten, dan jaminan keamanan data Anda.
            </p>

            <div className="mt-6 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pertanyaan atau topik..."
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 pl-10 text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-3">
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item) => {
                const isOpen = openIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="border border-zinc-200/70 dark:border-zinc-800/70 rounded-2xl bg-white/50 dark:bg-zinc-950/40 overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-4 sm:p-5 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-4 cursor-pointer text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider w-fit">
                          {item.category}
                        </span>
                        <span>{item.question}</span>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed border-t border-zinc-100 dark:border-zinc-800/50">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-zinc-400 font-medium">
                Tidak ada pertanyaan yang sesuai dengan kata kunci &quot;{search}&quot;.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
