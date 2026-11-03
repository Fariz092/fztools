'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import IqcV2Tool from '@/components/tools/IqcV2Tool';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function IqcV2Page() {
  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-indigo-500 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          href="/iqc"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 rounded-xl text-xs font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
        >
          <span>Beralih ke IQC v1 (Teks)</span>
        </Link>
      </div>
      <IqcV2Tool />
    </AppShell>
  );
}
