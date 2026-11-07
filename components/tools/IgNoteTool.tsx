'use client';

import React, { useState, useRef } from 'react';
import { saveHistoryItem } from '@/lib/history-service';
import { Download, Upload, Type, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function IgNoteTool() {
  const [noteText, setNoteText] = useState('why am I like\nthis?');
  const [photoUrl, setPhotoUrl] = useState('');
  const [fontFamily, setFontFamily] = useState<'myriad' | 'sfpro'>('myriad');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
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
      a.download = `ignote_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      await saveHistoryItem({
        toolType: 'ig-note',
        title: `IG Note: "${noteText.replace(/\n/g, ' ').slice(0, 20)}..."`,
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
          <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
             <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">IG Note Generator</h2>
              <span className="inline-flex px-2 py-0.5 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-md text-[10px] font-bold uppercase tracking-widest border border-pink-100 dark:border-pink-900/30">Fitur Baru</span>
            </div>
            <p className="text-sm text-zinc-400 font-medium mt-1">Buat status teks ala Note Instagram dengan foto profil kustom.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Teks Note:</label>
            <textarea rows={3} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Tulis note..." className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none" />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Foto Profil:</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl cursor-pointer transition-all border border-zinc-200 dark:border-zinc-700 font-semibold text-xs">
                <Upload className="w-4 h-4" />
                <span>Upload Foto</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              {photoUrl && (
                <button onClick={() => setPhotoUrl('')} className="px-3 py-3 text-xs font-bold text-red-500 bg-red-50 rounded-xl">Hapus</button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5"><Type className="w-3 h-3" /> Pilih Jenis Font:</label>
            <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-max">
              <button onClick={() => setFontFamily('myriad')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${fontFamily === 'myriad' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>Myriad (Default)</button>
              <button onClick={() => setFontFamily('sfpro')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${fontFamily === 'sfpro' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>SF Pro (iOS)</button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
            <motion.button onClick={handleDownload} disabled={isDownloading} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-pink-600 text-white font-bold text-xs rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 uppercase tracking-[0.2em] disabled:opacity-50">
              <Download className="w-5 h-5" />
              <span>{isDownloading ? 'Memproses...' : 'Unduh Gambar HD'}</span>
            </motion.button>
            <motion.button onClick={handleCopy} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-[10px] rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest">
              {copiedSuccess ? <Check className="w-4 h-4" /> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>}
              <span>{copiedSuccess ? 'Berhasil!' : 'Salin'}</span>
            </motion.button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="w-full max-w-[400px] mx-auto">
            <div ref={previewRef} className="relative w-full aspect-[9/16] flex flex-col items-center justify-center overflow-hidden bg-[#0f0f12]" style={{ fontFamily: getFontFamily() }}>
              <div className="flex flex-col items-center relative">
                  <div className="relative w-full flex justify-center mb-[-5px] z-20">
                      <div className="relative bg-[#2a2b30] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_20px_rgba(0,0,0,0.4)] rounded-[22px] px-5 py-3">
                          <div className="absolute bottom-[-6px] left-[22px] w-5 h-5 bg-[#2a2b30] rounded-br-[6px] -z-10" style={{ transform: 'skew(-20deg) rotate(45deg)', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}></div>
                          <p className="text-[#f1f1f1] text-[17px] font-medium leading-[1.3] text-center whitespace-pre-wrap">
                              {noteText}
                              <span className="inline-block w-[2px] h-[1.1em] bg-[#4b89ff] align-middle ml-[2px] mb-[2px] animate-[blink_1s_step-end_infinite]"></span>
                          </p>
                      </div>
                  </div>

                  <div className="relative z-10 mb-6 mt-1">
                      <div className="absolute top-[18px] left-[4px] w-2.5 h-2.5 bg-[#0f0f12] rounded-full z-30 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                      </div>
                      <div className="w-[140px] h-[140px] bg-[#f3f4f6] rounded-full overflow-hidden flex flex-col items-center justify-end relative shadow-2xl">
                          {photoUrl ? (
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <div className="w-[52px] h-[52px] bg-[#8c929d] rounded-full absolute top-[30px]"></div>
                              <div className="w-[115px] h-[55px] bg-[#8c929d] rounded-t-[55px] mb-[-5px]"></div>
                            </>
                          )}
                      </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                      <div className="w-[52px] h-[44px] rounded-[18px] border border-[#2a2b30] bg-[#141519] flex items-center justify-center"><svg className="w-6 h-6 text-[#ff3b5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg></div>
                      <div className="w-[52px] h-[44px] rounded-[18px] border border-[#2a2b30] bg-[#141519] flex items-center justify-center"><svg className="w-6 h-6 text-[#a259ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                      <div className="w-[52px] h-[44px] rounded-[18px] border border-[#2a2b30] bg-[#141519] flex items-center justify-center"><svg className="w-6 h-6 text-[#ff3b5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg></div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
