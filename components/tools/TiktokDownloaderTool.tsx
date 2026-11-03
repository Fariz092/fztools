'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Music, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Check,
  Images
} from 'lucide-react';
import { brutalistToast } from '@/lib/popup-service';
import { saveHistoryItem } from '@/lib/history-service';

interface TiktokData {
  title: string;
  author: {
    nickname: string;
    avatar: string;
  };
  stats: {
    likeCount: string;
    commentCount: string;
    shareCount: string;
  };
  video: {
    noWatermark: string;
    watermark: string;
    hd: string;
  };
  music: {
    url: string;
    title: string;
  };
  thumbnail: string;
  images?: string[];
}

export default function TiktokDownloaderTool() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TiktokData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchTiktokData = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      brutalistToast('Masukkan tautan video TikTok terlebih dahulu!', 'warning');
      return;
    }

    if (!trimmedUrl.includes('tiktok.com')) {
      brutalistToast('Tautan tidak valid. Pastikan link dari tiktok.com atau vt.tiktok.com', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/tiktok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Gagal memproses video.');
      }

      setResult(data);
      brutalistToast('Media TikTok berhasil ditemukan!', 'success');

      try {
        await saveHistoryItem({
          toolType: 'tiktok',
          title: `TikTok: ${data.author.nickname} - "${data.title.slice(0, 30)}..."`,
          details: `Suka: ${data.stats.likeCount} | Tipe: ${data.images && data.images.length > 0 ? 'Slide Foto' : 'Video HD'}`,
          previewUrl: data.thumbnail,
          fileFormat: data.images && data.images.length > 0 ? 'jpg' : 'mp4',
        });
      } catch (histErr) {
        console.warn('Gagal menyimpan riwayat:', histErr);
      }
    } catch (err: any) {
      console.error('Download error:', err);
      const errMsg = err.message || 'Gagal mengambil data video. Pastikan link dapat diakses publik.';
      setError(errMsg);
      brutalistToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFile = (downloadUrl: string, filename: string) => {
    if (!downloadUrl) {
      brutalistToast('Tautan berkas tidak tersedia.', 'error');
      return;
    }

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    brutalistToast('Mengunduh berkas...', 'info');
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    brutalistToast('Tautan berhasil disalin!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-12 shadow-xl shadow-zinc-200/20 dark:shadow-black/20 border border-zinc-200/80 dark:border-zinc-800/80">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Pengunduh Video TikTok
            </h2>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md">
              Aktif & Cepat
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Unduh video tanpa tanda air (watermark), slide foto HD, atau file musik MP3 secara instan.
          </p>
        </div>
      </div>

      <div className="p-5 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md mb-8">
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3 flex items-center gap-2">
          <LinkIcon className="w-3.5 h-3.5" />
          Tempel Tautan TikTok (Video / Slide Foto)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Contoh: https://vt.tiktok.com/xxxxxx/ atau https://www.tiktok.com/@user/video/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTiktokData()}
            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400 shadow-sm font-medium"
          />
          <motion.button
            onClick={fetchTiktokData}
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`px-8 py-3 bg-indigo-600 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-500'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Unduh Media
                <ChevronRight className="w-4 h-4" />
              </>
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
                  <img
                    src={result.thumbnail}
                    alt="Pratinjau Video"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                    <div className="flex items-center gap-3 mb-3">
                      {result.author.avatar && (
                        <div className="w-9 h-9 rounded-xl border border-white/20 overflow-hidden bg-white/10 backdrop-blur-md shrink-0">
                          <img src={result.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="text-white min-w-0">
                        <p className="font-bold text-xs truncate">@{result.author.nickname}</p>
                        <p className="text-[10px] text-zinc-400 font-medium tracking-wide">Kreator TikTok</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-white font-bold text-[10px] tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        {result.stats.likeCount}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                        {result.stats.commentCount}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                        {result.stats.shareCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 space-y-6">
              <div className="p-6 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Opsi Unduhan Siap Pakai
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    SUKSES
                  </div>
                </div>
                
                <div className="space-y-5">
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-3 italic bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                    &ldquo;{result.title}&rdquo;
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Tombol Video Tanpa Watermark */}
                    {result.video.noWatermark && (
                      <motion.button
                        onClick={() => handleDownloadFile(result.video.hd || result.video.noWatermark, `tiktok_nowm_${Date.now()}.mp4`)}
                        whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex flex-col p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all text-left hover:border-indigo-500 shadow-sm cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                            <Download className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[9px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                            HD TANPA WATERMARK
                          </span>
                        </div>
                        <span className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-tight">Unduh Video HD</span>
                        <span className="text-[10px] text-zinc-400 font-medium mt-0.5">MP4 kualitas jernih langsung disimpan</span>
                      </motion.button>
                    )}

                    {/* Tombol Audio MP3 */}
                    {result.music.url && (
                      <motion.button
                        onClick={() => handleDownloadFile(result.music.url, `tiktok_audio_${Date.now()}.mp3`)}
                        whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex flex-col p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all text-left hover:border-amber-500 shadow-sm cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                            <Music className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[9px] font-bold tracking-wider text-amber-500">
                            AUDIO MP3
                          </span>
                        </div>
                        <span className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-tight">Unduh Audio</span>
                        <span className="text-[10px] text-zinc-400 font-medium mt-0.5 truncate max-w-full">{result.music.title}</span>
                      </motion.button>
                    )}

                    {/* Tombol Salin Tautan Langsung */}
                    <motion.button
                      onClick={() => handleCopy(result.video.hd || result.video.noWatermark || result.music.url)}
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex flex-col p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all text-left hover:border-zinc-400 shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-[9px] font-bold tracking-wider text-zinc-500">
                          SALIN LINK
                        </span>
                      </div>
                      <span className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-tight">
                        {copiedLink ? 'Link Tersalin!' : 'Salin URL Langsung'}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium mt-0.5">Buka di peramban atau downloader lain</span>
                    </motion.button>
                  </div>

                  {/* Jika Postingan Berupa Kumpulan Slide Foto */}
                  {result.images && result.images.length > 0 && (
                    <div className="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200/50 dark:border-indigo-900/40">
                      <div className="flex items-center gap-2 mb-3">
                        <Images className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-xs text-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
                          Kumpulan Slide Foto ({result.images.length} Gambar)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {result.images.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleDownloadFile(imgUrl, `tiktok_slide_${idx + 1}_${Date.now()}.jpg`)}
                            className="p-2 bg-white dark:bg-zinc-900 rounded-lg text-[10px] font-bold border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-1.5 hover:border-indigo-500 transition-all cursor-pointer text-zinc-700 dark:text-zinc-300"
                          >
                            <Download className="w-3 h-3 text-indigo-500" /> Foto #{idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                      Unduhan diproses melalui jalur server lokal tanpa watermark. Gunakan berkas sesuai ketentuan hak cipta pembuat konten.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl flex items-center gap-4 shadow-sm"
          >
            <div className="w-9 h-9 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">Gagal Memproses Video</p>
              <p className="text-xs text-rose-500 font-medium mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
