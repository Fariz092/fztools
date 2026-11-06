'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import BratTool from '@/components/tools/BratTool';
import Link from 'next/link';
import { ArrowLeft, Type } from 'lucide-react';

export default function BratPage() {
  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali</span>
          </Link>
        </div>

        <div className="mb-10 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-lime-500/10 rounded-lg border border-lime-500/20">
              <Type className="w-6 h-6 text-lime-600 dark:text-lime-400" />
            </div>
            <span className="text-[10px] font-bold text-lime-600 dark:text-lime-400 uppercase tracking-[0.25em]">
              Viral Tool
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
            Brat<br />Generator<span className="text-lime-500">.</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Ubah teks biasa menjadi gambar estetik gaya "brat" ala Charli XCX. Kustomisasi warna, font, dan ukuran sesuka hati.
          </p>
        </div>

        <BratTool />

      </div>
    </AppShell>
  );
}
