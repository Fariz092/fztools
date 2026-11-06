'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Video, 
  Music, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  FileDown
} from 'lucide-react';
import { brutalistToast } from '@/lib/popup-service';
import DownloadToast, { ToastData } from './DownloadToast';

interface TiktokData {
  title: string;
  author: { nickname: string; avatar: string; };
  stats: { likeCount: string; commentCount: string; shareCount: string; };
  video: { noWatermark: string; watermark: string; hd: string; };
  music: { url: string; title: string; };
  thumbnail: string;
}

type DownloadStatus = 'idle' | 'downloading' | 'success';

export default function TiktokDownloaderTool() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TiktokData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State animasi download per tombol
  const [downloadStates, setDownloadStates] = useState<Record<string, DownloadStatus>>({});
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound effect "Ting" pakai Web Audio API
  const playDingSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  const fetchTiktokData = async () => {
    if (!url) {
      brutalistToast('Masukkan URL TikTok terlebih dahulu!', 'error');
      return;
    }
    if (!url.includes('tiktok.com')) {
      brutalistToast('URL tidak valid. Pastikan link dari TikTok.', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.status === 200 || data.result) {
        const res = data.result;
        setResult({
          title: res.description || 'TikTok Video',
          author: { nickname: res.author.nickname || 'Unknown User', avatar: res.author.avatar || '' },
          stats: {
            likeCount: res.statistics?.likeCount || '0',
            commentCount: res.statistics?.commentCount || '0',
            shareCount: res.statistics?.shareCount || '0',
          },
          video: {
            noWatermark: res.video.noWatermark || res.video.url_list[0],
            watermark: res.video.watermark || '',
            hd: res.video.noWatermark || '',
          },
          music: { url: res.music.play_url || res.music.url, title: res.music.title || 'Original Sound' },
          thumbnail: res.video.cover || res.video.origin_cover,
        });
        brutalistToast('Video berhasil ditemukan!', 'success');
      } else {
        throw new Error('Gagal mengambil data video.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Gagal mengambil data video. Pastikan tautan publik atau coba lagi nanti.');
      brutalistToast('Terjadi kesalahan saat memproses tautan.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi download dengan animasi & notifikasi
  const handleDownload = async (downloadUrl: string, filename: string, key: string) => {
    if (!downloadUrl) return;
    if (downloadStates[key] === 'downloading') return;

    setDownloadStates(prev => ({ ...prev, [key]: 'downloading' }));

    try {
      // Fetch file buat beneran download pakai blob
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Simulasi progress biar berasa (delay dikit)
      await new Promise(r => setTimeout(r, 1500));

      // Trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      // Update state ke success
      setDownloadStates(prev => ({ ...prev, [key]: 'success' }));
      playDingSound();

      // Tambahin notifikasi ke daftar toast
      const toastId = Date.now();
      setToasts(prev => [...prev, { id: toastId, filename }]);

      // Auto dismiss notifikasi setelah 5 detik
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 5000);

      // Reset status tombol setelah 3 detik
      setTimeout(() => {
        setDownloadStates(prev => ({ ...prev, [key]: 'idle' }));
      }, 3000);
    } catch (err) {
      console.error('Download error:', err);
      brutalistToast('Gagal mengunduh file. Coba lagi.', 'error');
      setDownloadStates(prev => ({ ...prev, [key]: 'idle' }));
    }
  };

  // Render konten tombol berdasarkan status
  const renderButtonContent = (key: string, icon: React.ReactNode, title: string, subtitle: string, badge?: string) => {
    const status = downloadStates[key] || 'idle';
    
    if (status === 'downloading') {
      return (
        <div className="relative w-full">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Mengunduh...
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-indigo-500 rounded-full"
            />
          </div>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Selesai!
          </span>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center">{icon}</div>
          {badge && <span className="text-[9px] font-bold tracking-wider">{badge}</span>}
        </div>
        <span className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-tight">{title}</span>
        <span className="text-[10px] text-zinc-400 font-medium mt-0.5">{subtitle}</span>
      </>
    );
  };

  return (
    <>
      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-12 shadow-xl shadow-zinc-200/20 dark:shadow-black/20 border border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Pengunduh Video TikTok</h2>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Tanpa Watermark</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">Unduh video TikTok tanpa tanda air dalam resolusi HD atau ambil berkas audio MP3 secara langsung.</p>
          </div>
        </div>

        <div className="p-5 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md mb-8">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3 flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5" /> Tempel Tautan TikTok
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="https://www.tiktok.com/@kreator/video/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400 shadow-sm"
            />
            <motion.button
              onClick={fetchTiktokData}
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`px-8 py-3 bg-indigo-600 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-500'}`}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Memeriksa...</>
              ) : (
                <>Cek Video<ChevronRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              <div className="md:col-span-5 lg:col-span-4">
                <div className="bg-zinc-950 rounded-2xl shadow-xl overflow-hidden group border border-zinc-800">
                  <div className="aspect-[9/16] relative bg-black">
                    <img src={result.thumbnail} alt="Pratinjau Video" className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl border border-white/20 overflow-hidden bg-white/10 backdrop-blur-md shrink-0">
                          <img src={result.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-white min-w-0">
                          <p className="font-bold text-xs truncate">@{result.author.nickname}</p>
                          <p className="text-[10px] text-zinc-400 font-medium tracking-wide">Kreator</p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-white font-bold text-[10px] tracking-wider">
                        <div className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />{result.stats.likeCount}</div>
                        <div className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />{result.stats.commentCount}</div>
                        <div className="flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />{result.stats.shareCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 lg:col-span-8 space-y-6">
                <div className="p-6 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
                    <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-zinc-400">Pilihan Kualitas Berkas</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />SIAP UNDUH
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2 italic">&ldquo;{result.title}&rdquo;</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <motion.button
                        onClick={() => handleDownload(result.video.noWatermark, `tiktok_no_wm_${Date.now()}.mp4`, 'no_wm')}
                        disabled={downloadStates['no_wm'] === 'downloading' || downloadStates['no_wm'] === 'success'}
                        whileHover={downloadStates['no_wm'] === 'idle' ? { scale: 1.01, y: -2 } : {}}
                        whileTap={downloadStates['no_wm'] === 'idle' ? { scale: 0.99 } : {}}
                        className="flex flex-col p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all text-left hover:border-indigo-500 shadow-sm cursor-pointer disabled:cursor-default"
                      >
                        {renderButtonContent('no_wm', <Download className="w-3.5 h-3.5" />, 'Video Tanpa Watermark', 'Kualitas jernih untuk edit ulang', 'HD 1080P')}
                      </motion.button>

                      {result.video.watermark && (
                        <motion.button
                          onClick={() => handleDownload(result.video.watermark, `tiktok_wm_${Date.now()}.mp4`, 'wm')}
                          disabled={downloadStates['wm'] === 'downloading' || downloadStates['wm'] === 'success'}
                          whileHover={downloadStates['wm'] === 'idle' ? { scale: 1.01, y: -2 } : {}}
                          whileTap={downloadStates['wm'] === 'idle' ? { scale: 0.99 } : {}}
                          className="flex flex-col p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all text-left hover:border-zinc-400 shadow-sm cursor-pointer disabled:cursor-default"
                        >
                          {renderButtonContent('wm', <Download className="w-3.5 h-3.5" />, 'Video Standar', 'Dengan watermark asli')}
                        </motion.button>
                      )}

                      <motion.button
                        onClick={() => handleDownload(result.music.url, `tiktok_audio_${Date.now()}.mp3`, 'audio')}
                        disabled={downloadStates['audio'] === 'downloading' || downloadStates['audio'] === 'success'}
                        whileHover={downloadStates['audio'] === 'idle' ? { scale: 1.01, y: -2 } : {}}
                        whileTap={downloadStates['audio'] === 'idle' ? { scale: 0.99 } : {}}
                        className="flex flex-col p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all text-left hover:border-amber-500 shadow-sm cursor-pointer disabled:cursor-default"
                      >
                        {renderButtonContent('audio', <Music className="w-3.5 h-3.5" />, 'Berkas Audio MP3', result.music.title)}
                      </motion.button>
                    </div>

                    <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">Gunakan berkas unduhan sesuai ketentuan hak cipta kreator. Berkas diproses langsung tanpa penyimpanan permanen.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-9 h-9 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0"><AlertCircle className="w-4 h-4" /></div>
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">Gagal Memproses</p>
                <p className="text-xs text-rose-500 font-medium mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification Container */}
      <DownloadToast toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </>
  );
}
