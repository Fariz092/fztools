'use client';

import React, { useState, useRef } from 'react';
import { saveHistoryItem } from '@/lib/history-service';
import { Download, Upload, Check, Type, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function IqcTiktokTool() {
  const [messageText, setMessageText] = useState('sombong amat');
  const [timeText, setTimeText] = useState('10.45');
  const [senderName, setSenderName] = useState(''); 
  const [bgImage, setBgImage] = useState('https://unsplash.com/photos/aRQ-hOdNiUI/download?w=1080');
  const [fontFamily, setFontFamily] = useState<'myriad' | 'sfpro'>('myriad');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setBgImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getFontFamily = () => {
    if (fontFamily === 'sfpro') return '"SF Pro Display", -apple-system, sans-serif';
    return '"MyriadPro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  };

  const handleDownload = async () => {
    if (!previewRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      await document.fonts.ready;
      const { toPng } = await import('html-to-image');
      
      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 3,
        skipFonts: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' },
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `iqc-tiktok_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      await saveHistoryItem({
        toolType: 'iqc-tiktok',
        title: `IQC TikTok: "${messageText.slice(0, 20)}..."`,
        details: `Font: ${fontFamily === 'sfpro' ? 'SF Pro' : 'Myriad'}`,
        previewUrl: dataUrl,
        fileFormat: 'png',
      });
    } catch (e) {
      console.error(e);
      alert('Gagal render gambar. Coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    if (!previewRef.current || copiedSuccess) return;
    try {
      await document.fonts.ready;
      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(previewRef.current, { pixelRatio: 3, skipFonts: true });
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-12 shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-900 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center shadow-lg text-white">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">IQC TikTok Context</h2>
              <span className="inline-flex px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-md text-[10px] font-bold uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">Mockup</span>
            </div>
            <p className="text-sm text-zinc-400 font-medium mt-1">Bikin tampilan menu pesan (long-press) ala TikTok dengan background kustom.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Teks Pesan:</label>
            <textarea rows={2} value={messageText} onChange={(e) => setMessageText(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Jam:</label>
              <input type="text" value={timeText} onChange={(e) => setTimeText(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nama (Opsional):</label>
              <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Kosongkan jika tidak perlu" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Background (Foto/Dummy Chat):</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl cursor-pointer transition-all border border-zinc-200 dark:border-zinc-700 font-semibold text-xs">
                <Upload className="w-4 h-4" />
                <span>Upload Background</span>
                <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5"><Type className="w-3 h-3" /> Font:</label>
            <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-max">
              <button onClick={() => setFontFamily('myriad')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${fontFamily === 'myriad' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>Myriad (Default)</button>
              <button onClick={() => setFontFamily('sfpro')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${fontFamily === 'sfpro' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>SF Pro (iOS)</button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
            <motion.button onClick={handleDownload} disabled={isDownloading} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 uppercase tracking-[0.2em] disabled:opacity-50">
              <Download className="w-5 h-5" />
              <span>{isDownloading ? 'Memproses...' : 'Unduh Gambar HD'}</span>
            </motion.button>
            <motion.button onClick={handleCopy} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-[10px] rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest">
              {copiedSuccess ? <Check className="w-4 h-4" /> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>}
              <span>{copiedSuccess ? 'Berhasil!' : 'Salin'}</span>
            </motion.button>
          </div>
        </div>

        {/* PREVIEW AREA (UKURAN SAMA KAYAK IQC) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="w-full max-w-[400px] mx-auto">
            <div 
              ref={previewRef}
              className="relative w-full aspect-[9/16] flex flex-col items-start justify-center overflow-hidden bg-zinc-900"
              style={{ fontFamily: getFontFamily() }}
            >
              {/* Background Image dengan Blur */}
              <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="Background" className="w-full h-full object-cover blur-[15px] scale-110 opacity-70" />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Container Konten di Tengah */}
              <div className="relative z-10 w-full pl-6 pr-4 flex flex-col gap-3 items-start">
                
                {/* 1. Reaction Bar */}
                <div className="bg-white rounded-full flex items-center gap-[8px] px-[12px] py-[6px] shadow-sm">
                  <span className="text-[22px] leading-none cursor-pointer hover:scale-110 transition-transform origin-bottom">❤️</span>
                  <span className="text-[22px] leading-none cursor-pointer hover:scale-110 transition-transform origin-bottom">😂</span>
                  <span className="text-[22px] leading-none cursor-pointer hover:scale-110 transition-transform origin-bottom">😮</span>
                  <span className="text-[22px] leading-none cursor-pointer hover:scale-110 transition-transform origin-bottom">😢</span>
                  <span className="text-[22px] leading-none cursor-pointer hover:scale-110 transition-transform origin-bottom">😡</span>
                  <span className="text-[22px] leading-none cursor-pointer hover:scale-110 transition-transform origin-bottom">👍</span>
                  
                  <button className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 ml-1">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14m-7-7h14" />
                    </svg>
                  </button>
                </div>

                {/* 2. Message Bubble */}
                <div className="bg-white rounded-[16px] px-[14px] pt-[8px] pb-[6px] ml-1 flex flex-col min-w-[120px] shadow-sm max-w-[85%]">
                  {senderName.trim() && (
                    <span className="text-[11px] font-semibold text-pink-500 mb-0.5">{senderName}</span>
                  )}
                  <p className="text-[14px] text-black self-start leading-snug break-words">{messageText}</p>
                  <span className="text-[10px] text-gray-500 self-end mt-1">{timeText}</span>
                </div>

                {/* 3. Action Menu (Glassmorphism) */}
                <div className="bg-white/30 backdrop-blur-xl border border-white/30 rounded-[20px] w-[210px] py-2 flex flex-col overflow-hidden shadow-lg mt-1 ml-1">
                  
                  {/* Balas */}
                  <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px] text-left">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-black" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 14L4 9l5-5" />
                      <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v1.5" />
                    </svg>
                    <span className="text-[13px] font-medium text-black">Balas</span>
                  </button>

                  {/* Teruskan */}
                  <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px] text-left">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-black" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                    <span className="text-[13px] font-medium text-black">Teruskan</span>
                  </button>

                  {/* Salin */}
                  <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px] text-left">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-black" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="11" height="11" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span className="text-[13px] font-medium text-black">Salin</span>
                  </button>

                  {/* Terjemahkan */}
                  <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px] text-left">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-black" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 8 6 6" />
                      <path d="m4 14 6-6 2-3" />
                      <path d="M2 5h12" />
                      <path d="M7 2h1" />
                      <path d="m22 22-5-10-5 10" />
                      <path d="M14 18h6" />
                    </svg>
                    <span className="text-[13px] font-medium text-black">Terjemahkan</span>
                  </button>

                  {/* Laporkan */}
                  <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px] text-left text-[#e02424]">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 20L4.5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-11L4 20z" />
                      <path d="M12 7v5" />
                      <path d="M12 15h.01" />
                    </svg>
                    <span className="text-[13px] font-medium">Laporkan</span>
                  </button>

                  {/* Lainnya */}
                  <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px] text-left">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-black" fill="currentColor">
                      <circle cx="5" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="19" cy="12" r="1.5" />
                    </svg>
                    <span className="text-[13px] font-medium text-black">Lainnya</span>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
