'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Phone, Volume2, Video, MicOff, UserPlus, Grid3X3, Info, Upload } from 'lucide-react';
import { saveHistoryItem } from '@/lib/history-service';

export default function FakeCallTool() {
  const [contactName, setContactName] = useState('(866) 527-0393');
  const [duration, setDuration] = useState('05:33');
  const [photoUrl, setPhotoUrl] = useState('https://i.pravatar.cc/300?img=68');
  const [isSpeakerActive, setIsSpeakerActive] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const [callTime, setCallTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `fake_call_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      await saveHistoryItem({
        toolType: 'fake-call',
        title: `Fake Call: ${contactName}`,
        details: `Durasi: ${isRunning ? formatTime(callTime) : duration}`,
        previewUrl: dataUrl,
        fileFormat: 'png',
      });
    } catch (e) {
      console.error('Download Error:', e);
      alert('Gagal render gambar. Coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-12 shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-900 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg font-bold text-2xl text-white">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Fake Call Generator</h2>
            <p className="text-sm text-zinc-400 font-medium mt-1">Buat screenshot panggilan masuk iOS yang realistis.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nama / Nomor:</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Durasi Panggilan:</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Upload Foto Profil:</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl cursor-pointer transition-all border border-zinc-200 dark:border-zinc-700 font-semibold text-xs">
                <Upload className="w-4 h-4" />
                <span>Pilih Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpeakerActive}
                onChange={(e) => setIsSpeakerActive(e.target.checked)}
                className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Speaker Aktif</span>
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
            <motion.button
              onClick={() => { setIsRunning(!isRunning); setCallTime(0); }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs rounded-2xl shadow-xl transition-all cursor-pointer uppercase tracking-[0.2em]"
            >
              {isRunning ? 'Stop Timer' : 'Mulai Timer (Live)'}
            </motion.button>
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-green-600 text-white font-bold text-xs rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 uppercase tracking-[0.2em] disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>{isDownloading ? 'Memproses...' : 'Simpan Screenshot'}</span>
            </motion.button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="w-full max-w-[400px] mx-auto rounded-[2.5rem] bg-zinc-950 p-2 shadow-2xl border border-zinc-800 relative">
            <div className="absolute top-4 left-6 flex items-center gap-3 z-10">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pratinjau</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div
              ref={previewRef}
              className="relative w-full rounded-[2rem] overflow-hidden aspect-[9/16] flex flex-col justify-between bg-gradient-to-b from-[#3d463d] to-[#1c1c1c]"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              <div className="relative pt-12 px-6 flex flex-col items-center">
                <button className="absolute top-8 right-6 text-white/70">
                  <Info className="w-6 h-6" />
                </button>
                <div className="mt-8 flex flex-col items-center gap-1 text-center w-full">
                  <span className="text-white/70 text-lg font-medium tracking-wide">
                    {isRunning ? formatTime(callTime) : duration}
                  </span>
                  <h1 className="text-white text-[38px] font-semibold tracking-tight whitespace-nowrap">
                    {contactName}
                  </h1>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center pb-8">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl bg-white/10 relative">
                  <img src={photoUrl} alt="Contact" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="px-8 pb-16 flex flex-col items-center w-full">
                <div className="grid grid-cols-3 gap-x-6 gap-y-6 max-w-[300px] w-full">
                  <div className="flex flex-col items-center gap-2">
                    <button className={`w-[76px] h-[76px] rounded-full flex items-center justify-center ${isSpeakerActive ? 'bg-white text-black' : 'bg-white/15 text-white'}`}>
                      <Volume2 className="w-8 h-8" />
                    </button>
                    <span className="text-white text-[13px]">Speaker</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className="w-[76px] h-[76px] rounded-full bg-white/15 flex items-center justify-center text-white/40">
                      <Video className="w-8 h-8" />
                    </button>
                    <span className="text-white text-[13px]">FaceTime</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className="w-[76px] h-[76px] rounded-full bg-white/15 flex items-center justify-center text-white">
                      <MicOff className="w-8 h-8" />
                    </button>
                    <span className="text-white text-[13px]">Mute</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <button className="w-[76px] h-[76px] rounded-full bg-white/15 flex items-center justify-center text-white">
                      <UserPlus className="w-8 h-8" />
                    </button>
                    <span className="text-white text-[13px]">Add</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <button className="w-[76px] h-[76px] rounded-full bg-[#eb4e3d] flex items-center justify-center text-white">
                      <Phone className="w-8 h-8 rotate-[135deg]" fill="currentColor" />
                    </button>
                    <span className="text-white text-[13px]">End</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <button className="w-[76px] h-[76px] rounded-full bg-white/15 flex items-center justify-center text-white">
                      <Grid3X3 className="w-8 h-8" />
                    </button>
                    <span className="text-white text-[13px]">Keypad</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-2 left-0 right-0 flex justify-center pb-2">
                <div className="w-1/3 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
