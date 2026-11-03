'use client';

import AppShell from '@/components/AppShell';
import ChatStoryTool from '@/components/tools/ChatStoryTool';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChatStoryPage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-4 sm:py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-indigo-500 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        
        <ChatStoryTool />
      </div>
    </AppShell>
  );
}
