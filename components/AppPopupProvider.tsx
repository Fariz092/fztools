'use client';

import React, { useState, useEffect } from 'react';
import {
  PopupOptions,
  ToastOptions,
  SHOW_POPUP_EVENT,
  SHOW_TOAST_EVENT,
} from '@/lib/popup-service';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AppPopupProvider() {
  const [popup, setPopup] = useState<PopupOptions | null>(null);
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  useEffect(() => {
    const handlePopup = (e: Event) => {
      const custom = e as CustomEvent<PopupOptions>;
      if (custom.detail) {
        setPopup(custom.detail);
      }
    };

    const handleToast = (e: Event) => {
      const custom = e as CustomEvent<ToastOptions>;
      if (custom.detail) {
        const newToast = custom.detail;
        setToasts((prev) => [...prev, newToast]);

        const duration = newToast.duration || 3200;
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, duration);
      }
    };

    window.addEventListener(SHOW_POPUP_EVENT, handlePopup);
    window.addEventListener(SHOW_TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(SHOW_POPUP_EVENT, handlePopup);
      window.removeEventListener(SHOW_TOAST_EVENT, handleToast);
    };
  }, []);

  const closePopup = (confirmed: boolean) => {
    if (!popup) return;
    if (confirmed) {
      if (popup.onConfirm) popup.onConfirm();
    } else {
      if (popup.onCancel) popup.onCancel();
    }
    setPopup(null);
  };

  const getThemeHeader = (type?: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500',
          textColor: 'text-white',
          icon: <CheckCircle2 className="w-5 h-5" />,
          title: 'BERHASIL',
        };
      case 'error':
        return {
          bg: 'bg-rose-500',
          textColor: 'text-white',
          icon: <AlertCircle className="w-5 h-5" />,
          title: 'KESALAHAN',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500',
          textColor: 'text-white',
          icon: <AlertTriangle className="w-5 h-5" />,
          title: 'KONFIRMASI',
        };
      default:
        return {
          bg: 'bg-indigo-600',
          textColor: 'text-white',
          icon: <Info className="w-5 h-5" />,
          title: 'INFORMASI',
        };
    }
  };

  const currentTheme = getThemeHeader(popup?.type);

  return (
    <>
      {/* Minimalist Toast Container */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 max-w-md w-[92vw] pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const theme = getThemeHeader(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pointer-events-auto glass dark:glass rounded-2xl p-1 pr-1 border border-white/50 dark:border-white/10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${theme.bg} ${theme.textColor} flex items-center justify-center shadow-lg shadow-${theme.bg.split('-')[1]}-500/20`}>
                      {theme.icon}
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white leading-snug">
                      {toast.message}
                    </span>
                  </div>
                  <button
                    onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Minimalist Popup Modal */}
      <AnimatePresence>
        {popup && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closePopup(false)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl shadow-black/20 w-full max-w-sm overflow-hidden border border-zinc-100 dark:border-zinc-900"
            >
              <div className={`p-6 ${currentTheme.bg} ${currentTheme.textColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      {currentTheme.icon}
                    </div>
                    <h3 className="font-bold text-sm tracking-widest uppercase">{popup.title || currentTheme.title}</h3>
                  </div>
                  <button
                    onClick={() => closePopup(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  {popup.message}
                </p>
              </div>

              <div className="p-6 flex flex-col gap-2">
                <button
                  onClick={() => closePopup(true)}
                  className={`w-full py-3 ${currentTheme.bg} text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-${currentTheme.bg.split('-')[1]}-500/20 cursor-pointer`}
                >
                  {popup.confirmText || 'MENGERTI'}
                </button>
                {popup.cancelText && (
                  <button
                    onClick={() => closePopup(false)}
                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    {popup.cancelText}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
