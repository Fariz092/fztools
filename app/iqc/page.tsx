'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import IqcTool from '@/components/tools/IqcTool';
import Link from 'next/link';
import { ArrowLeft, MessageSquareQuote } from 'lucide-react';

export default function IqcPage() {
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
            <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <MessageSquareQuote className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-[0.25em]">
              Creator Tool
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
            IQC<br />Generator<span className="text-rose-500">.</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Buat kartu kutipan pesan WhatsApp gaya iPhone dengan efek glassmorphism. Presisi tinggi, siap diunduh dan dibagikan ke media sosial.
          </p>
        </div>

        <IqcTool />

      </div>
    </AppShell>
  );
}
