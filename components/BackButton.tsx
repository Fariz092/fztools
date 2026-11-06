'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function BackButton({ href = '/', label = 'Kembali' }: { href?: string; label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full
                   bg-white/40 dark:bg-white/5
                   backdrop-blur-xl backdrop-saturate-150
                   border border-white/60 dark:border-white/10
                   shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.6)]
                   dark:shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)]
                   hover:bg-white/60 dark:hover:bg-white/10
                   hover:border-white/80 dark:hover:border-white/20
                   transition-all duration-300 overflow-hidden"
      >
        {/* Glow halus di belakang */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
        
        {/* Ikon Panah */}
        <ArrowLeft className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:-translate-x-0.5 transition-all relative z-10" strokeWidth={2.5} />
        
        {/* Teks */}
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white relative z-10">
          {label}
        </span>
      </Link>
    </motion.div>
  );
}
