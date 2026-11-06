'use client';

import React, { useState, useRef } from 'react';
import { saveHistoryItem } from '@/lib/history-service';
import { motion } from 'motion/react';
import { Download, Check } from 'lucide-react';

const POPULAR_QUOTES = [
  { text: 'makanya cantik.', time: '18.30' },
  { text: 'dihina ga tumbang\ndibilang cakep ya emang bang', time: '21.35' },
  { text: 'jangan berekspektasi tinggi,\nmanusia itu tempatnya kecewa.', time: '02.14' },
  { text: 'tetap tersenyum,\nwalau batin sedang babak belur.', time: '19.45' },
  { text: 'capek kerja pengen kaya,\ntapi males gerak.', time: '12.00' },
  { text: 'yang jago cuman ayam\nyang sakti cuman kera\nkalo yang elit ya kitaa', time: '23.49' },
];

export default function IqcTool() {
  const [theme, setTheme] = useState<'neutral' | 'pink'>('pink'); 
  const [fontWeight, setFontWeight] = useState<'normal' | 'semibold' | 'bold'>('normal');
  const [quoteText, setQuoteText] = useState<string>('makanya cantik.');
  const [timeText, setTimeText] = useState<string>('18.30');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      await document.fonts.ready;
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(previewRef.current, { quality: 1, pixelRatio: 3 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `iqc_${theme}_${fontWeight}_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      await saveHistoryItem({
        toolType: 'iqc',
        title: `.IQC ${theme.toUpperCase()}: "${quoteText.slice(0, 30)}..."`,
        details: `Jam: ${timeText} | Font: ${fontWeight}`,
        previewUrl: dataUrl,
        fileFormat: 'png',
      });
    } catch (e) {
      console.error(e);
      alert('Gagal render gambar. Coba lagi.');
    }
  };

  const handleCopy = async () => {
    if (!previewRef.current) return;
    try {
      await document.fonts.ready;
      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(previewRef.current, { pixelRatio: 3 });
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
          <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg font-bold text-2xl text-white">IQ</div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Generator .IQC</h2>
              <span className="inline-flex px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md text-[10px] font-bold uppercase tracking-widest border border-amber-100 dark:border-amber-900/30">Proporsi 9:16</span>
            </div>
            <p className="text-sm text-zinc-400 font-medium mt-1">Desain presisi iOS WhatsApp dengan efek long-press haptic yang estetik.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* KOLOM KIRI: INPUT */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* THEME TOGGLE */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pilih Tema:</label>
            <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-max">
              <button 
                onClick={() => setTheme('neutral')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${theme === 'neutral' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Neutral
              </button>
              <button 
                onClick={() => setTheme('pink')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${theme === 'pink' ? 'bg-white dark:bg-zinc-700 shadow-sm text-pink-600 dark:text-pink-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Pink
              </button>
            </div>
          </div>

          {/* FONT TOGGLE */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pilih Ketebalan Font:</label>
            <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-max">
              <button 
                onClick={() => setFontWeight('normal')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${fontWeight === 'normal' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Regular
              </button>
              <button 
                onClick={() => setFontWeight('semibold')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${fontWeight === 'semibold' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Semibold
              </button>
              <button 
                onClick={() => setFontWeight('bold')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${fontWeight === 'bold' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Bold
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Teks Kutipan:</label>
            <textarea rows={4} value={quoteText} onChange={(e) => setQuoteText(e.target.value)} placeholder="Tulis pesan kutipan..." className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none" />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Waktu Pesan:</label>
            <div className="flex gap-3">
              <input type="text" value={timeText} onChange={(e) => setTimeText(e.target.value)} placeholder="18.30" className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none" />
              <motion.button type="button" onClick={() => { const now = new Date(); const hh = String(now.getHours()).padStart(2, '0'); const mm = String(now.getMinutes()).padStart(2, '0'); setTimeText(`${hh}.${mm}`); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-5 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 text-[10px] font-bold rounded-xl border border-pink-100 dark:border-pink-800 cursor-pointer uppercase tracking-wider">Sekarang</motion.button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Preset Populer:</label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_QUOTES.map((preset, idx) => (
                <button key={idx} type="button" onClick={() => { setQuoteText(preset.text); setTimeText(preset.time); }} className="px-3 py-1.5 text-[10px] font-medium rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-pink-600 hover:bg-white transition-all cursor-pointer border border-zinc-100 dark:border-zinc-700 shadow-sm">
                  &quot;{preset.text.split('\n')[0].slice(0, 16)}...&quot;
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
            <motion.button onClick={handleDownload} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-pink-600 text-white font-bold text-xs rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 uppercase tracking-[0.2em]">
              <Download className="w-5 h-5" />
              <span>Unduh Gambar HD</span>
            </motion.button>
            <motion.button onClick={handleCopy} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-[10px] rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest">
              {copiedSuccess ? <Check className="w-4 h-4" /> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>}
              <span>{copiedSuccess ? 'Berhasil!' : 'Salin'}</span>
            </motion.button>
          </div>
        </div>

        {/* KOLOM KANAN: PREVIEW HTML/CSS */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="w-full max-w-[400px] mx-auto rounded-[2.5rem] bg-zinc-950 p-2 shadow-2xl border border-zinc-800 relative">
            <div className="absolute top-4 left-6 flex items-center gap-3 z-10">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pratinjau</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            </div>
            
            {/* AREA YANG DI CAPTURE */}
            <div 
              ref={previewRef}
              className={`relative w-full rounded-[2rem] overflow-hidden aspect-[9/16] flex flex-col justify-center ${theme === 'pink' ? 'bg-vignette-pink' : 'bg-[#EFEFF4]'}`}
              style={{ 
                fontFamily: '"MyriadPro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                WebkitFontSmoothing: 'antialiased',
                background: theme === 'pink' ? 'radial-gradient(circle at 45% 45%, #ffffff 0%, #fde4ec 30%, #f9a8d4 70%, #e11d48 135%)' : '#EFEFF4',
                fontWeight: fontWeight === 'bold' ? 700 : fontWeight === 'semibold' ? 600 : 400
              }}
            >
              {/* Background Dummy Chats (Blurred) */}
              <div className="absolute inset-0 z-0 p-4 pt-10 flex flex-col gap-4 overflow-hidden blur-[6px] opacity-70 pointer-events-none select-none">
                  <div className={`self-start ${theme === 'pink' ? 'bg-white/90' : 'bg-white'} rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[75%] shadow-sm`}>
                      <span className="text-[15.5px] text-gray-900">Eh kemarin jadi pergi ke sana?</span>
                  </div>
                  <div className={`self-end ${theme === 'pink' ? 'bg-[#fbcfe8]' : 'bg-[#dcf8c6]'} rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[75%] shadow-sm mt-2`}>
                      <span className="text-[15.5px] text-gray-900">Jadi dong, seru banget tempatnya!</span>
                  </div>
                  <div className={`self-start ${theme === 'pink' ? 'bg-white/90' : 'bg-white'} rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[75%] shadow-sm mt-2`}>
                      <span className="text-[15.5px] text-gray-900">Wah sayang aku ga bisa ikut 😭</span>
                  </div>
                  <div className={`self-end ${theme === 'pink' ? 'bg-[#fbcfe8]' : 'bg-[#dcf8c6]'} rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[75%] shadow-sm mt-2`}>
                      <span className="text-[15.5px] text-gray-900">Gapapa, next time kita ke sana bareng ya</span>
                  </div>
                  <div className={`self-start ${theme === 'pink' ? 'bg-white/90' : 'bg-white'} rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[75%] shadow-sm mt-2`}>
                      <span className="text-[15.5px] text-gray-900">Btw foto-fotonya bagus banget yang di post</span>
                  </div>
                  <div className="h-10"></div>
                  <div className="h-32"></div>
                  <div className={`self-end ${theme === 'pink' ? 'bg-[#fbcfe8]' : 'bg-[#dcf8c6]'} rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[75%] shadow-sm mt-10`}>
                      <span className="text-[15.5px] text-gray-900">Hahaha makasih! Pake kamera baru nih 😎</span>
                  </div>
                  <div className={`self-start ${theme === 'pink' ? 'bg-white/90' : 'bg-white'} rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[75%] shadow-sm mt-2`}>
                      <span className="text-[15.5px] text-gray-900">Pantesan jernih banget hasilnya. Beli dimana?</span>
                  </div>
                  <div className={`self-end ${theme === 'pink' ? 'bg-[#fbcfe8]' : 'bg-[#dcf8c6]'} rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[75%] shadow-sm mt-2`}>
                      <span className="text-[15.5px] text-gray-900">Beli di toko oren waktu lagi flash sale wkwk</span>
                  </div>
                  <div className={`self-start ${theme === 'pink' ? 'bg-white/90' : 'bg-white'} rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[75%] shadow-sm mt-2`}>
                      <span className="text-[15.5px] text-gray-900">Mantap, nanti kirimin ya file aslinya!</span>
                  </div>
              </div>

              {/* Container: Left-aligned items */}
              <div className="relative w-full max-w-sm flex flex-col items-start gap-1.5 z-10 px-4">
                  
                  {/* 1. Reaction Bar */}
                  <div className={`flex items-center gap-3 ${theme === 'pink' ? 'bg-white/90 backdrop-blur-md' : 'bg-white'} px-4 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-max ml-2 relative z-30`}>
                      <span className="emoji-btn text-[26px] leading-none cursor-pointer select-none">👍</span>
                      <span className="emoji-btn text-[26px] leading-none cursor-pointer select-none">❤️</span>
                      <span className="emoji-btn text-[26px] leading-none cursor-pointer select-none">😂</span>
                      <span className="emoji-btn text-[26px] leading-none cursor-pointer select-none">😮</span>
                      <span className="emoji-btn text-[26px] leading-none cursor-pointer select-none">😢</span>
                      <span className="emoji-btn text-[26px] leading-none cursor-pointer select-none">🙏</span>
                      <button className={`w-8 h-8 ml-1 flex items-center justify-center ${theme === 'pink' ? 'bg-gray-100/80' : 'bg-gray-100'} rounded-full hover:bg-gray-200 transition-colors shrink-0`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-gray-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                      </button>
                  </div>

                  {/* 2. Chat Message Bubble */}
                  <div className="relative ml-2 mt-0.5">
                      <div className={`relative ${theme === 'pink' ? 'bg-[#fbcfe8]' : 'bg-white'} rounded-2xl rounded-tl-none px-3.5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.05)] inline-flex items-end gap-3 z-20 max-w-[280px]`}>
                          {/* Ekor chat (Top-Left) */}
                          <div className={`absolute top-0 -left-2 w-3 h-3 ${theme === 'pink' ? 'bg-[#fbcfe8]' : 'bg-white'}`} style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                          <span className="text-[15.5px] text-gray-900 pb-0.5 leading-snug break-words">{quoteText}</span>
                          <span className="text-[11px] text-gray-600/80 mb-0.5 shrink-0">{timeText}</span>
                      </div>
                  </div>

                  {/* 3. Glassmorphism Context Menu */}
                  <div className={`mt-1 ml-2 ${theme === 'pink' ? 'bg-white/55 backdrop-blur-3xl backdrop-saturate-180' : 'bg-white/80 backdrop-blur-3xl'} shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col w-[260px] py-2 rounded-[22px] overflow-hidden z-10`}>
                      
                      <button className="flex items-center gap-4 px-5 py-3 hover:bg-black/5 active:bg-black/10 transition-colors w-full text-left group">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5 text-gray-900"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                          <span className="text-[15px] text-gray-900 font-medium tracking-tight">Balas</span>
                      </button>
                      <button className="flex items-center gap-4 px-5 py-3 hover:bg-black/5 active:bg-black/10 transition-colors w-full text-left group">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5 text-gray-900"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></svg>
                          <span className="text-[15px] text-gray-900 font-medium tracking-tight">Teruskan</span>
                      </button>
                      <button className="flex items-center gap-4 px-5 py-3 hover:bg-black/5 active:bg-black/10 transition-colors w-full text-left group">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5 text-gray-900"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                          <span className="text-[15px] text-gray-900 font-medium tracking-tight">Salin</span>
                      </button>
                      <button className="flex items-center gap-4 px-5 py-3 hover:bg-black/5 active:bg-black/10 transition-colors w-full text-left group">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5 text-gray-900"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                          <span className="text-[15px] text-gray-900 font-medium tracking-tight">Beri bintang</span>
                      </button>
                      <button className="flex items-center gap-4 px-5 py-3 hover:bg-red-500/15 transition-colors w-full text-left group">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          <span className="text-[15px] text-red-600 font-medium tracking-tight">Hapus</span>
                      </button>
                      <hr className="border-t border-black/5 mx-5 my-1.5" />
                      <button className="flex items-center gap-4 px-5 py-3 hover:bg-black/5 active:bg-black/10 transition-colors w-full text-left group">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" className="w-5 h-5 text-gray-900"><circle cx="12" cy="12" r="9.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01" /></svg>
                          <span className="text-[15px] text-gray-900 font-medium tracking-tight">Lainnya...</span>
                      </button>
                  </div>
              </div>
            </div>
            {/* END AREA CAPTURE */}

          </div>
        </div>
      </div>
    </div>
  );
}
