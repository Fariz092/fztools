'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderDown, X, CheckCircle2 } from 'lucide-react';

export interface ToastData {
  id: number;
  filename: string;
}

interface DownloadToastProps {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}

export default function DownloadToast({ toasts, onDismiss }: DownloadToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="pointer-events-auto bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-700/50 p-3 pr-4 flex items-center gap-3 min-w-[280px] max-w-[360px]"
          >
            {/* Ikon folder (ala Chrome) */}
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
              <FolderDown className="w-5 h-5 text-indigo-400" />
            </div>

            {/* Konten */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Download Selesai
                </p>
              </div>
              <p className="text-xs font-semibold text-white truncate" title={toast.filename}>
                {toast.filename}
              </p>
            </div>

            {/* Tombol close */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
