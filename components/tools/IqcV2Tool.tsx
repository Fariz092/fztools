'use client';

import React, { useState, useRef } from 'react';
import { saveHistoryItem } from '@/lib/history-service';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Upload, 
  Download, 
  Crop,
  Check,
  SmartphoneIcon,
  Info
} from 'lucide-react';

const PRESET_PHOTOS = [
  {
    id: 'mlbb',
    name: 'Mobile Legends Lovers',
    src: '/assets/aistudio/80d9efb6d0fcc068fdb3fc332ebf09a3_f670b24f.webp',
    caption: 'gw udah ada lovers, lu kapan 😂?',
    time: '18:02',
    sender: '',
  },
  {
    id: 'sunset',
    name: 'Senja Aesthetic',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    caption: 'nikmati prosesnya, hasil tak akan mengkhianati usaha ✨🌊',
    time: '17:45',
    sender: 'senja',
  },
  {
    id: 'cat',
    name: 'Kucing Sinis',
    src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    caption: 'napa lu liat-liat? mau ngajak ribut apa gimana 😾',
    time: '12:30',
    sender: 'kucing oyen',
  },
];

const ASPECT_RATIOS = [
  { id: '4/5', label: '4:5 (Feed IG)' },
  { id: '1/1', label: '1:1 (Kotak)' },
  { id: '9/16', label: '9:16 (Story)' },
];

export default function IqcV2Tool() {
  const [variant, setVariant] = useState<'iqc' | 'iqcpink'>('iqc');
  const [imageSrc, setImageSrc] = useState<string>(PRESET_PHOTOS[0].src);
  const [captionText, setCaptionText] = useState<string>(PRESET_PHOTOS[0].caption);
  const [senderName, setSenderName] = useState<string>('');
  const [timeText, setTimeText] = useState<string>('18:02');
  const [aspectRatio, setAspectRatio] = useState<string>('4/5');
  const [isOutgoing, setIsOutgoing] = useState<boolean>(false);
  const [showBlueTicks, setShowBlueTicks] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageSrc(event.target.result);
      }
    };
    reader.readAsDataURL(file);
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
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `iqcv2_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      await saveHistoryItem({
        toolType: 'iqcv2',
        title: `IQC v2: "${captionText.slice(0, 20)}..."`,
        details: `Rasio: ${aspectRatio}`,
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

  const isPink = variant === 'iqcpink';

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-full">
              Versi Terkini • V2
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
            IQC <span className="text-indigo-600 dark:text-indigo-400">Media</span> Generator
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-md">
            Buat kartu media WhatsApp dengan menu iOS asli dan pemotongan foto otomatis yang presisi.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <Link
            href="/iqc"
            className="px-4 py-2 text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all"
          >
            IQC v1 (Teks)
          </Link>
          <div className="px-4 py-2 bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 rounded-xl text-[11px] font-bold shadow-sm">
            IQC v2 (Media)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-8">
          {/* Theme Selector */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Pilih Tema</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setVariant('iqc')}
                className={`flex items-center justify-center gap-3 py-3.5 rounded-2xl border transition-all cursor-pointer ${
                  variant === 'iqc' 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-lg' 
                    : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                <span className="text-xs font-bold uppercase tracking-wide">Dark iOS</span>
              </button>
              <button
                onClick={() => setVariant('iqcpink')}
                className={`flex items-center justify-center gap-3 py-3.5 rounded-2xl border transition-all cursor-pointer ${
                  variant === 'iqcpink' 
                    ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200 dark:shadow-none' 
                    : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-pink-300'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-pink-300" />
                <span className="text-xs font-bold uppercase tracking-wide">Soft Pink</span>
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center justify-between">
              <span>Unggah Foto</span>
              <div className="flex items-center gap-1.5 text-indigo-500">
                <Crop className="w-3 h-3" />
                <span className="text-[9px]">Auto-Crop Pro</span>
              </div>
            </label>
            <div className="space-y-4">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all cursor-pointer group"
              >
                <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                Pilih Foto dari Galeri
              </button>

              <div className="grid grid-cols-3 gap-2">
                {PRESET_PHOTOS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setImageSrc(p.src);
                      setCaptionText(p.caption);
                      setTimeText(p.time);
                      setSenderName(p.sender);
                    }}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      imageSrc === p.src ? 'border-indigo-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p.src} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Teks Caption</label>
              <textarea
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                placeholder="Tulis pesan kamu..."
                className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Nama Pengirim</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Opsional"
                  className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 text-xs font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Jam Kirim</label>
                <input
                  type="text"
                  value={timeText}
                  onChange={(e) => setTimeText(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 text-xs font-medium focus:outline-none text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Rasio Foto</label>
              <div className="flex gap-2">
                {ASPECT_RATIOS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-xl border transition-all ${
                      aspectRatio === r.id ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setIsOutgoing(!isOutgoing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                  isOutgoing ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-100 dark:border-zinc-800'
                }`}
              >
                {isOutgoing ? 'Pesan Terkirim' : 'Pesan Diterima'}
              </button>
              <button
                onClick={() => setShowBlueTicks(!showBlueTicks)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                  showBlueTicks ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-100 dark:border-zinc-800'
                }`}
              >
                {showBlueTicks ? 'Centang Biru On' : 'Centang Biru Off'}
              </button>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Memproses...' : 'Unduh Hasil PNG'}
          </button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="sticky top-24 w-full flex flex-col items-center">
            <div className="mb-6 w-full flex items-center justify-between text-[10px] font-bold text-zinc-400 px-4">
              <span className="uppercase tracking-[0.2em]">Pratinjau iPhone</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  Kualitas HD
                </span>
                <span className="flex items-center gap-1.5">
                  <SmartphoneIcon className="w-3 h-3" />
                  iOS 18 Context
                </span>
              </div>
            </div>
            
            <div className="relative group bg-zinc-200 dark:bg-zinc-950 p-3 rounded-[52px] shadow-2xl border border-white/10">
              <div className="absolute inset-0 border-[10px] border-zinc-900 dark:border-zinc-800 rounded-[52px] pointer-events-none z-20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-900 dark:bg-zinc-800 rounded-b-2xl z-30" />
              
              <div className="relative rounded-[40px] overflow-hidden w-[320px] sm:w-[380px] bg-zinc-100">
                
                {/* AREA YANG DI CAPTURE (HTML/CSS VERSION) */}
                <div 
                  ref={previewRef}
                  className={`relative w-full aspect-[9/16] flex flex-col justify-center overflow-hidden ${isPink ? 'bg-vignette-pink' : 'bg-[#0b141a]'}`}
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    WebkitFontSmoothing: 'antialiased',
                  }}
                >
                  {/* Background Dummy Blurred Chat Content */}
                  <div className="absolute inset-0 z-0 p-6 pt-12 flex flex-col gap-3 overflow-hidden blur-[8px] opacity-40 pointer-events-none select-none">
                      <div className={`self-start ${isPink ? 'bg-white/80' : 'bg-[#202c33]'} rounded-2xl rounded-tl-none px-4 py-2 max-w-[70%] shadow-sm`}>
                          <span className={`text-[15px] ${isPink ? 'text-gray-900' : 'text-white'}`}>Kenapa bisa gitu sih?</span>
                      </div>
                      <div className={`self-end ${isPink ? 'bg-[#dcf8c6]' : 'bg-[#005c4b]'} rounded-2xl rounded-tr-none px-4 py-2 max-w-[70%] shadow-sm mt-1`}>
                          <span className={`text-[15px] ${isPink ? 'text-gray-900' : 'text-white'}`}>Ya emang dasarnya begitu dari sana 😅</span>
                      </div>
                      <div className={`self-start ${isPink ? 'bg-white/80' : 'bg-[#202c33]'} rounded-2xl rounded-tl-none px-4 py-2 max-w-[70%] shadow-sm mt-2`}>
                          <span className={`text-[15px] ${isPink ? 'text-gray-900' : 'text-white'}`}>Bisa dikirim ulang fotonya?</span>
                      </div>
                      <div className="h-44"></div>
                      <div className={`self-end ${isPink ? 'bg-[#dcf8c6]' : 'bg-[#005c4b]'} rounded-2xl rounded-tr-none px-4 py-2 max-w-[70%] shadow-sm mt-8`}>
                          <span className={`text-[15px] ${isPink ? 'text-gray-900' : 'text-white'}`}>Nanti aku kabarin lagi kalau udah siap ya.</span>
                      </div>
                  </div>

                  {/* Main Active UI Container */}
                  <div className="relative w-full max-w-sm flex flex-col items-start gap-2 z-10 px-5">
                    
                    {/* 1. Message Bubble */}
                    <div className="relative mt-0.5">
                        <div className={`relative ${isPink ? 'bg-white' : 'bg-[#202c33]'} rounded-2xl rounded-tl-none p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col z-20 w-[260px] max-w-full`}>
                            {/* Ekor Chat */}
                            <div className={`absolute top-0 -left-2 w-3 h-3 ${isPink ? 'bg-white' : 'bg-[#202c33]'}`} style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                            
                            {/* Media Image */}
                            <img src={imageSrc} alt="Preview" className={`w-full h-auto rounded-[12px] rounded-tl-[4px] object-cover aspect-[${aspectRatio}] shadow-sm`} />
                            
                            {/* Caption Text & Timestamp */}
                            <div className="flex flex-col px-1.5 pt-1.5 pb-0.5">
                                {senderName.trim() && (
                                  <span className={`text-[13px] font-semibold mb-0.5 ${isPink ? 'text-pink-600' : 'text-[#53BDEB]'}`}>{senderName}</span>
                                )}
                                <div className="flex items-end justify-between gap-2">
                                    <span className={`text-[15px] leading-snug break-words font-normal ${isPink ? 'text-gray-900' : 'text-white'}`}>{captionText}</span>
                                    <span className={`text-[11px] shrink-0 font-medium translate-y-[2px] flex items-center gap-1 ${isPink ? 'text-gray-400' : 'text-[#8696a0]'}`}>
                                      {timeText}
                                      {isOutgoing && showBlueTicks && (
                                        <svg className="w-4 h-4 text-[#53BDEB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2 12l4 4L14 6 M10 12l4 4L22 6" /></svg>
                                      )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Context Menu */}
                    <div className={`mt-0.5 ${isPink ? 'bg-white/40 border-white/60' : 'bg-[#233138]/90 border-white/10'} backdrop-blur-[24px] rounded-[26px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col w-[250px] py-1.5 overflow-hidden z-10 border ring-1 ring-black/5`}>
                        
                        <button className={`flex items-center gap-4 px-4 py-2.5 transition-colors w-full text-left ${isPink ? 'hover:bg-white/40 text-gray-900' : 'hover:bg-white/5 text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                            <span className="text-[15px] font-normal">Balas</span>
                        </button>
                        <button className={`flex items-center gap-4 px-4 py-2.5 transition-colors w-full text-left ${isPink ? 'hover:bg-white/40 text-gray-900' : 'hover:bg-white/5 text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></svg>
                            <span className="text-[15px] font-normal">Teruskan</span>
                        </button>
                        <button className={`flex items-center gap-4 px-4 py-2.5 transition-colors w-full text-left ${isPink ? 'hover:bg-white/40 text-gray-900' : 'hover:bg-white/5 text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                            <span className="text-[15px] font-normal">Salin</span>
                        </button>
                        <button className={`flex items-center gap-4 px-4 py-2.5 transition-colors w-full text-left ${isPink ? 'hover:bg-white/40 text-gray-900' : 'hover:bg-white/5 text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                            <span className="text-[15px] font-normal">Beri bintang</span>
                        </button>
                        <button className={`flex items-center gap-4 px-4 py-2.5 transition-colors w-full text-left ${isPink ? 'hover:bg-white/40' : 'hover:bg-white/5'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="#e11d48" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            <span className="text-[15px] text-[#e11d48] font-normal">Hapus</span>
                        </button>
                        <div className={`h-[1px] mx-4 my-1 ${isPink ? 'bg-gray-300/40' : 'bg-white/10'}`}></div>
                        <button className={`flex items-center gap-4 px-4 py-2.5 transition-colors w-full text-left ${isPink ? 'hover:bg-white/40 text-gray-900' : 'hover:bg-white/5 text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01" /></svg>
                            <span className="text-[15px] font-normal">Lainnya...</span>
                        </button>
                    </div>

                  </div>
                </div>
                {/* END CAPTURE AREA */}
              </div>
            </div>
            
            <p className="mt-8 text-[11px] font-medium text-zinc-500 max-w-xs text-center">
              Kartu media Anda dihasilkan dengan resolusi HD yang dioptimalkan untuk WhatsApp Story dan Feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
