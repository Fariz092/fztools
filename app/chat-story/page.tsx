'use client';

import ChatStoryTool from '@/components/tools/ChatStoryTool';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChatStoryPage() {
  return (
    <div className="min-h-[100dvh] bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 pointer-events-none" />

      <Link
        href="/"
        className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold backdrop-blur-md transition-all shadow-sm group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali</span>
      </Link>

      <ChatStoryTool />
    </div>
  );
}
