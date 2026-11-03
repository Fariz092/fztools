'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Flame, 
  RefreshCw, 
  Copy, 
  Check, 
  Send,
  Zap,
  Info,
  Type,
  Palette,
  MessageSquare
} from 'lucide-react';
import { saveHistoryItem } from '@/lib/history-service';
import { motion, AnimatePresence } from 'motion/react';

interface SarcasticResult {
  headline: string;
  quote: string;
  subtext: string;
  topText: string;
  bottomText: string;
}

export default function SarcasticMemeTool() {
  const [topic, setTopic] = useState<string>('Kerja lembur bagai kuda tapi gaji numpang lewat');
  const [tone, setTone] = useState<string>('pedas');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SarcasticResult[]>([
    {
      headline: 'SI PALING LOYALITAS',
      quote: 'Kerja keras 14 jam sehari biar bos bisa beli mobil baru. Semangat ya, kamu pahlawan tanpa kenaikan gaji.',
      subtext: 'Disponsori oleh kopi sachet dan asam lambung akut.',
      topText: 'KERJA LEMBUR TIAP MALAM',
      bottomText: 'GAJI HABIS SEBELUM TANGGAL 5',
    },
    {
      headline: 'MOTIVASI ATAU HALU',
      quote: 'Katanya rezeki sudah ada yang ngatur, tapi kenapa pengeluarannya yang rajin nyamperin?',
      subtext: 'Status: Berdamai dengan saldo rekening yang mengheningkan cipta.',
      topText: 'PENGEN HIDUP TENANG',
      bottomText: 'TAPI CICILAN BILANG JANGAN',
    },
  ]);
  const [activeResult, setActiveResult] = useState<SarcasticResult>(results[0]);
  const [colorScheme, setColorScheme] = useState<'indigo' | 'rose' | 'emerald' | 'zinc'>('indigo');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function drawRoundedRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  const TOPIC_CHIPS = [
    'Teman pinjam seratus',
    'Gaji numpang lewat',
    'Diet cuma wacana',
    'Skripsi revisi terus',
    'Overthinking jam 2 pagi',
  ];

  const handleGenerateAI = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/sarcasm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone }),
      });

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setResults(data.results);
        setActiveResult(data.results[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeResult) return;

    const w = 750;
    const h = 950;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bgMain = '#4F46E5';
    if (colorScheme === 'rose') bgMain = '#E11D48';
    if (colorScheme === 'emerald') bgMain = '#059669';
    if (colorScheme === 'zinc') bgMain = '#18181B';

    ctx.fillStyle = bgMain;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    for (let i = 0; i < h; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    const cardX = 50;
    const cardY = 50;
    const cardW = w - 100;
    const cardH = h - 100;
    
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    drawRoundedRect(ctx, cardX + 8, cardY + 8, cardW, cardH, 36);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 36);
    ctx.fill();

    ctx.font = '900 46px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = bgMain;
    ctx.textAlign = 'center';
    ctx.fillText(activeResult.headline.toUpperCase(), w / 2, cardY + 95);

    ctx.strokeStyle = '#F4F4F5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 90, cardY + 130);
    ctx.lineTo(cardX + cardW - 90, cardY + 130);
    ctx.stroke();

    ctx.font = '500 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#18181B';
    const words = activeResult.quote.split(' ');
    const lines: string[] = [];
    let curLine = '';
    const maxTextW = cardW - 120;

    for (const word of words) {
      const test = curLine ? `${curLine} ${word}` : word;
      if (ctx.measureText(test).width > maxTextW && curLine) {
        lines.push(curLine);
        curLine = word;
      } else {
        curLine = test;
      }
    }
    if (curLine) lines.push(curLine);

    let startY = cardY + 260;
    const lineH = 46;
    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, startY + i * lineH);
    });

    const subtextY = cardY + cardH - 110;
    ctx.font = 'italic 500 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#71717A';
    ctx.fillText(activeResult.subtext, w / 2, subtextY);

    ctx.fillStyle = bgMain;
    drawRoundedRect(ctx, cardX + 60, cardY + cardH - 60, cardW - 120, 38, 19);
    ctx.fill();
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('FZTOOLS • GENERATOR SARKASME AI', w / 2, cardY + cardH - 36);

  }, [activeResult, colorScheme]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !activeResult) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `sarkas_${Date.now()}.png`;
    a.click();
    try {
      await saveHistoryItem({
        toolType: 'sarcasm',
        title: `Roast: ${activeResult.headline}`,
        details: activeResult.quote,
        previewUrl: dataUrl,
        fileFormat: 'png',
      });
    } catch (e) { console.warn(e); }
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-12 shadow-xl shadow-zinc-200/20 dark:shadow-black/20 border border-zinc-200/80 dark:border-zinc-800/80">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Sarkasme AI
            </h2>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
              Gemini AI
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Gunakan kekuatan AI untuk membuat sindiran tajam khas netizen dalam format poster estetik.
          </p>
        </div>

        <div className="flex items-center p-1 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
           {[
            { id: 'indigo', color: 'bg-indigo-600' },
            { id: 'rose', color: 'bg-rose-600' },
            { id: 'emerald', color: 'bg-emerald-600' },
            { id: 'zinc', color: 'bg-zinc-900' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setColorScheme(c.id as any)}
              className={`w-8 h-8 rounded-xl m-1 transition-all cursor-pointer border-2 ${
                colorScheme === c.id ? 'border-white dark:border-zinc-300 scale-110 shadow-sm' : 'border-transparent opacity-80'
              } ${c.color}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md space-y-4">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Masukkan Topik Roasting
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Teman pinjam seratus..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
            />
            <button
              onClick={handleGenerateAI}
              disabled={loading}
              className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer disabled:opacity-50 shadow-md"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? 'AI Sedang Berpikir...' : 'Minta Roast AI'}
            </button>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {TOPIC_CHIPS.map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="px-2.5 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
             <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Pilihan Sindiran</label>
             <AnimatePresence mode="popLayout">
              {results.map((item, idx) => (
                <motion.button
                  key={idx}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setActiveResult(item)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeResult === item
                      ? 'bg-white dark:bg-zinc-800 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                      : 'bg-white/60 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{item.headline}</span>
                    <span className="text-[10px] font-bold text-zinc-400">#{idx + 1}</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300 line-clamp-2 italic">“{item.quote}”</p>
                </motion.button>
              ))}
             </AnimatePresence>
          </div>

          {activeResult && (
            <div className="p-5 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1.5">Edit Judul</label>
                <input
                  type="text"
                  value={activeResult.headline}
                  onChange={(e) => setActiveResult({ ...activeResult, headline: e.target.value })}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1.5">Edit Kutipan</label>
                <textarea
                  value={activeResult.quote}
                  onChange={(e) => setActiveResult({ ...activeResult, quote: e.target.value })}
                  rows={3}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none resize-none shadow-sm"
                />
              </div>
            </div>
          )}

          <motion.button
            onClick={handleDownload}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            Unduh Poster Sarkas
          </motion.button>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/20 flex flex-col items-center justify-center min-h-[480px]">
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-zinc-400 mb-6 pb-4 border-b border-zinc-800/80">
              <span className="uppercase tracking-[0.2em]">Pratinjau Poster</span>
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-zinc-400" />
                <span className="uppercase text-zinc-500">{colorScheme} Edition</span>
              </div>
            </div>

            <div className="relative max-w-full overflow-hidden rounded-2xl shadow-2xl border border-zinc-800">
               <canvas
                ref={canvasRef}
                className="max-h-[480px] max-w-full object-contain"
              />
            </div>

            <p className="mt-6 text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] text-center">
              Tata letak tipografi editorial kartu minimalis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
