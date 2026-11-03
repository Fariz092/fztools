'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Heart, 
  MessageCircle, 
  CheckCircle2, 
  Pin, 
  Upload, 
  Moon, 
  Sun,
  Shuffle,
  ChevronRight
} from 'lucide-react';
import { saveHistoryItem } from '@/lib/history-service';
import { motion, AnimatePresence } from 'motion/react';

export default function FakeTtCommentTool() {
  const [username, setUsername] = useState<string>('ical_official');
  const [displayName, setDisplayName] = useState<string>('Ical Hack');
  const [commentText, setCommentText] = useState<string>(
    'Minimal mandi dulu bang sebelum bikin tutorial 😭🙏🏻 tapi ilmunya mantap sih!'
  );
  const [timestamp, setTimestamp] = useState<string>('2 jam lalu');
  const [likesCount, setLikesCount] = useState<string>('48.2K');
  const [repliesCount, setRepliesCount] = useState<string>('124');
  const [isLiked, setIsLiked] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const AVATAR_PRESETS = [
    { name: 'Cat Meme', url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sigma Boy', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Bocil Epep', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Anime Girl', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  ];
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(AVATAR_PRESETS[0].url);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FUNNY_COMMENTS = [
    'Minimal mandi dulu bang sebelum bikin konten 😭🙏🏻',
    'Info loker yang kerjanya rebahan tapi digaji setara umr dubai dong',
    'Sebagai warga konoha, saya merasa terpanggil melihat video ini wkwk',
    'Bang, lu kalau tidur merem apa melek sih?',
    'Udah subscribe dari zaman nabi adam bang, baru kali ini dinotice',
    'Menurut BMKG gempa barusan disebabkan oleh beban pikiran kamu yang overthinking',
  ];

  const handleRandomComment = () => {
    const random = FUNNY_COMMENTS[Math.floor(Math.random() * FUNNY_COMMENTS.length)];
    setCommentText(random);
  };

  const handleCustomAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSelectedAvatarUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const renderRestOfComment = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    startY: number
  ) => {
    const textStartX = 110;

    ctx.font = '600 21px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isDarkMode ? '#E4E4E7' : '#18181B';
    ctx.textAlign = 'left';
    ctx.fillText(username, textStartX, startY + 20);

    let offsetAfterUsername = textStartX + ctx.measureText(username).width + 8;

    if (isVerified) {
      if (typeof Path2D !== 'undefined') {
        ctx.save();
        ctx.translate(offsetAfterUsername + 2, startY + 5);
        const scale = 17 / 24;
        ctx.scale(scale, scale);
        const badgePath = new Path2D(
          'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z'
        );
        ctx.fillStyle = '#20D5EC';
        ctx.fill(badgePath);
        const checkPath = new Path2D('m9 12 2 2 4-4');
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke(checkPath);
        ctx.restore();
      }
      offsetAfterUsername += 24;
    }

    if (isCreator) {
      ctx.fillStyle = isDarkMode ? '#27272A' : '#F4F4F5';
      ctx.fillRect(offsetAfterUsername, startY + 4, 80, 22);
      ctx.fillStyle = '#FF0050';
      ctx.font = '700 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Pembuat', offsetAfterUsername + 40, startY + 19);
    }

    ctx.font = '400 21px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isDarkMode ? '#FFFFFF' : '#09090B';
    ctx.textAlign = 'left';

    const words = commentText.split(' ');
    const lines: string[] = [];
    let curLine = '';
    const maxTextWidth = w - textStartX - 90;

    for (const word of words) {
      const test = curLine ? `${curLine} ${word}` : word;
      if (ctx.measureText(test).width > maxTextWidth && curLine) {
        lines.push(curLine);
        curLine = word;
      } else {
        curLine = test;
      }
    }
    if (curLine) lines.push(curLine);

    const lineH = 30;
    let commentBottomY = startY + 54;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], textStartX, commentBottomY + i * lineH);
    }
    commentBottomY += lines.length * lineH;

    ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isDarkMode ? '#71717A' : '#A1A1AA';
    ctx.fillText(`${timestamp}  •  Balas`, textStartX, commentBottomY + 10);

    if (parseInt(repliesCount) > 0) {
      ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = isDarkMode ? '#A1A1AA' : '#71717A';
      const replyLabel = `── Lihat ${repliesCount} balasan `;
      ctx.fillText(replyLabel, textStartX, commentBottomY + 40);
      const labelW = ctx.measureText(replyLabel).width;

      if (typeof Path2D !== 'undefined') {
        ctx.save();
        ctx.translate(textStartX + labelW, commentBottomY + 28);
        const scale = 14 / 24;
        ctx.scale(scale, scale);
        const chevron = new Path2D('m6 9 6 6 6-6');
        ctx.strokeStyle = isDarkMode ? '#A1A1AA' : '#71717A';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke(chevron);
        ctx.restore();
      }
    }

    const heartX = w - 50;
    const heartY = startY + 25;

    if (typeof Path2D !== 'undefined') {
      ctx.save();
      ctx.translate(heartX - 11, heartY - 14);
      const scale = 22 / 24;
      ctx.scale(scale, scale);
      const heartPath = new Path2D(
        'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'
      );
      if (isLiked) {
        ctx.fillStyle = '#FE2C55';
        ctx.fill(heartPath);
      } else {
        ctx.strokeStyle = isDarkMode ? '#71717A' : '#A1A1AA';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke(heartPath);
      }
      ctx.restore();
    }

    ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isDarkMode ? '#A1A1AA' : '#71717A';
    ctx.textAlign = 'center';
    ctx.fillText(likesCount, heartX, heartY + 24);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = 750;
    const h = isPinned ? 340 : 300;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = isDarkMode ? '#121212' : '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = isDarkMode ? '#27272A' : '#E4E4E7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, h - 1);
    ctx.lineTo(w - 20, h - 1);
    ctx.stroke();

    let startY = 30;

    if (isPinned) {
      if (typeof Path2D !== 'undefined') {
        ctx.save();
        ctx.translate(110, startY - 7);
        const scale = 17 / 24;
        ctx.scale(scale, scale);
        const pinPath = new Path2D(
          'M12 17v5 M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z'
        );
        ctx.strokeStyle = isDarkMode ? '#A1A1AA' : '#71717A';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke(pinPath);
        ctx.restore();
      }
      ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = isDarkMode ? '#A1A1AA' : '#71717A';
      ctx.textAlign = 'left';
      ctx.fillText('Disematkan oleh pembuat', 132, startY + 8);
      startY += 35;
    }

    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    avatarImg.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(58, startY + 28, 28, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, 30, startY, 56, 56);
      ctx.restore();
      renderRestOfComment(ctx, w, h, startY);
    };
    avatarImg.onerror = () => {
      ctx.fillStyle = '#3F3F46';
      ctx.beginPath();
      ctx.arc(58, startY + 28, 28, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(displayName[0] || 'U', 58, startY + 36);
      renderRestOfComment(ctx, w, h, startY);
    };
    avatarImg.src = selectedAvatarUrl;

  }, [username, displayName, commentText, timestamp, likesCount, repliesCount, isLiked, isVerified, isCreator, isPinned, isDarkMode, selectedAvatarUrl]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `fakett_${username}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    try {
      await saveHistoryItem({
        toolType: 'fakett',
        title: `TikTok Comment @${username}: "${commentText.slice(0, 30)}..."`,
        details: `Suka: ${likesCount} | Mode: ${isDarkMode ? 'Gelap' : 'Terang'}`,
        previewUrl: dataUrl,
        fileFormat: 'png',
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-12 shadow-xl shadow-zinc-200/20 dark:shadow-black/20 border border-zinc-200/80 dark:border-zinc-800/80">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 font-bold text-2xl text-white">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Generator Komentar TikTok
              </h2>
              <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest">
                Mockup Presisi
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
              Buat tangkapan layar komentar TikTok realistis untuk konten meme dan kreator.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
          <button
            onClick={() => setIsDarkMode(true)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isDarkMode 
                ? 'bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-700' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> GELAP
          </button>
          <button
            onClick={() => setIsDarkMode(false)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              !isDarkMode 
                ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> TERANG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="p-5 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Foto Profil</label>
            <div className="flex items-center gap-3">
              {AVATAR_PRESETS.map((av) => (
                <button
                  key={av.name}
                  onClick={() => setSelectedAvatarUrl(av.url)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedAvatarUrl === av.url ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                </button>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-[10px] uppercase tracking-wider border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm"
              >
                Unggah
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCustomAvatar} className="hidden" />
            </div>
          </div>

          <div className="p-5 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Waktu</label>
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Isi Komentar</label>
                <button
                  onClick={handleRandomComment}
                  className="text-[10px] font-bold text-indigo-500 hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Shuffle className="w-3 h-3" /> Acak
                </button>
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Jumlah Suka</label>
                <input
                  type="text"
                  value={likesCount}
                  onChange={(e) => setLikesCount(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Jumlah Balasan</label>
                <input
                  type="text"
                  value={repliesCount}
                  onChange={(e) => setRepliesCount(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 cursor-pointer shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Centang Biru</span>
                <input type="checkbox" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} className="accent-indigo-600" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 cursor-pointer shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Badge Pembuat</span>
                <input type="checkbox" checked={isCreator} onChange={(e) => setIsCreator(e.target.checked)} className="accent-indigo-600" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 cursor-pointer shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Disematkan</span>
                <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="accent-indigo-600" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 cursor-pointer shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Disukai (Merah)</span>
                <input type="checkbox" checked={isLiked} onChange={(e) => setIsLiked(e.target.checked)} className="accent-indigo-600" />
              </label>
            </div>
          </div>

          <motion.button
            onClick={handleDownload}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Download className="w-4 h-4" /> Unduh Gambar Komentar
          </motion.button>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="rounded-3xl bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black/20 flex flex-col items-center justify-center min-h-[440px] border border-zinc-800/80 relative">
            <div className="absolute top-5 left-6 flex items-center gap-2.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Pratinjau Komentar</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="w-full overflow-hidden flex items-center justify-center p-2 rounded-2xl transition-transform duration-300 hover:scale-[1.01] mt-6">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto block rounded-xl shadow-2xl"
              />
            </div>
            
            <p className="mt-6 text-[10px] font-medium text-zinc-500 uppercase tracking-[0.25em]">
              Gaya antarmuka TikTok presisi tinggi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
