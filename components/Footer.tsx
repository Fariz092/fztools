'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-12">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden bg-white">
              <Image
                src="/assets/aistudio/Alice_ac18f5a2.jpeg"
                alt="FZ Logo"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="font-extrabold text-xl text-zinc-900 dark:text-white leading-tight tracking-tight">FZTOOLS</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">Paket Kreatif Minimalis</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
              FZTOOLS | RIZ UNIVERSE
            </p>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
              © {new Date().getFullYear()} SEMUA HAK DILINDUNGI
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          <Link href="/tentang" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors no-underline">
            Tentang
          </Link>
          <Link href="/faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors no-underline">
            FAQ
          </Link>
          <Link href="/privasi" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors no-underline">
            Privasi
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Kembali ke Atas
            <span className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
