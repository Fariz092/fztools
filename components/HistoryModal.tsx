'use client';

import React, { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';
import { HistoryItem, fetchUserHistory, deleteHistoryItem } from '@/lib/history-service';
import { 
  X, 
  Trash2, 
  Download, 
  ExternalLink, 
  Cloud, 
  RefreshCw, 
  Filter, 
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);

  const currentUser = auth.currentUser;

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchUserHistory();
      setHistoryList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;
    fetchUserHistory()
      .then((data) => {
        if (isSubscribed) {
          setHistoryList(data);
        }
      })
      .catch((err) => console.error(err));

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, currentUser]);

  const filtered = selectedFilter === 'all' 
    ? historyList 
    : historyList.filter((item) => item.toolType.toLowerCase().includes(selectedFilter.toLowerCase()));

  const handleDelete = async (id: string) => {
    try {
      await deleteHistoryItem(id);
      setHistoryList((prev) => prev.filter((i) => i.id !== id));
      if (previewItem?.id === id) setPreviewItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (item: HistoryItem) => {
    if (!item.previewUrl) return;
    const a = document.createElement('a');
    a.href = item.previewUrl;
    a.download = `fztools_${item.toolType}_${item.id.slice(-5)}.${item.fileFormat || 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-zinc-100 dark:border-zinc-900"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                  <RefreshCw className={`w-5 h-5 text-indigo-600 dark:text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white uppercase tracking-wider">
                    Riwayat Kreasi
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                    {currentUser ? (
                      <span className="flex items-center gap-1.5 text-emerald-500">
                        <Cloud className="w-3 h-3" /> Cloud Tersinkron
                      </span>
                    ) : (
                      <span className="text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                        Mode Lokal (Login untuk Cloud)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  title="Segarkan Riwayat"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-rose-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="p-4 px-6 border-b border-zinc-100 dark:border-zinc-900 flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-2">
                <Filter className="w-3 h-3" /> Filter
              </div>
              {['all', 'converter', 'brat', 'iqc', 'iqcv2', 'qr', 'fakett', 'meme', 'sarcasm', 'tiktok'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedFilter === f
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}
                >
                  {f === 'all' ? 'Semua' : f}
                </button>
              ))}
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-900/30">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Memuat Data...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="max-w-xs mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-[24px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto">
                      <Layers className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                    </div>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-tight">Belum Ada Riwayat</p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Gunakan alat di FZTOOLS dan kreasi Anda akan tersimpan otomatis di sini.
                    </p>
                    {!currentUser && (
                      <button
                        onClick={() => signInWithPopup(auth, googleProvider)}
                        className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-zinc-900/20 transition-all hover:opacity-90"
                      >
                        Login Google
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="bg-white dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-between border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all group"
                    >
                      <div>
                        {/* Badge & Date */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold uppercase tracking-widest rounded-lg">
                            {item.toolType}
                          </span>
                          <span className="text-[9px] font-bold text-zinc-400">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Preview Thumbnail */}
                        <div className="w-full h-36 bg-zinc-50 dark:bg-zinc-950 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative group/img cursor-pointer border border-zinc-100 dark:border-zinc-800"
                             onClick={() => setPreviewItem(item)}>
                          {item.previewUrl?.startsWith('data:image') || item.previewUrl?.startsWith('http') || item.previewUrl?.startsWith('blob') ? (
                            <img
                              src={item.previewUrl}
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="p-4 text-[9px] font-bold text-zinc-400 overflow-hidden line-clamp-5 whitespace-pre-wrap text-center">
                              {item.details || item.title}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all flex items-center justify-center">
                            <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1 mb-1">
                          {item.title}
                        </h3>
                        {item.details && (
                          <p className="text-[10px] font-medium text-zinc-400 line-clamp-1 mb-4">
                            {item.details}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center gap-2">
                        {item.previewUrl && (
                          <button
                            onClick={() => handleDownload(item)}
                            className="flex-1 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-[9px] flex items-center justify-center gap-2 hover:opacity-90 transition-all uppercase tracking-wider"
                          >
                            <Download className="w-3 h-3" /> Unduh
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(item.details || item.title, item.id)}
                          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all cursor-pointer"
                          title="Salin teks"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950 text-zinc-400 hover:text-rose-500 rounded-xl transition-all cursor-pointer"
                          title="Hapus riwayat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 px-6 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Riwayat Tersinkron ke Cloud Firestore
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                Tutup
              </button>
            </div>
          </motion.div>

          {/* Full Preview Modal */}
          <AnimatePresence>
            {previewItem && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setPreviewItem(null)}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative max-w-xl w-full bg-white dark:bg-zinc-950 rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
                >
                  <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white truncate max-w-[200px]">
                      {previewItem.title}
                    </span>
                    <button
                      onClick={() => setPreviewItem(null)}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-rose-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 overflow-auto min-h-[300px]">
                    {previewItem.previewUrl ? (
                      <img 
                        src={previewItem.previewUrl} 
                        alt={previewItem.title} 
                        className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl" 
                      />
                    ) : (
                      <pre className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 p-6 whitespace-pre-wrap bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-full">
                        {previewItem.details}
                      </pre>
                    )}
                  </div>
                  <div className="p-6 flex items-center justify-end gap-3">
                    {previewItem.previewUrl && (
                      <button
                        onClick={() => handleDownload(previewItem)}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Simpan Lagi
                      </button>
                    )}
                    <button
                      onClick={() => setPreviewItem(null)}
                      className="px-6 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                    >
                      Selesai
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
