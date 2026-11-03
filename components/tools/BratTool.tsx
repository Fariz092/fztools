'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SimpleGifEncoder } from '@/lib/gif-encoder';
import { saveHistoryItem } from '@/lib/history-service';
import { motion } from 'motion/react';
import { Download, Loader2, Play, Pause } from 'lucide-react';

export default function BratTool() {
  const [text, setText] = useState<string>('Minimalis\nEstetik Modern');
  const [theme, setTheme] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#000000');

  const BASE_FONT_SIZE = 70;
  const BLUR_AMOUNT = 2;
  const CANVAS_SIZE = 512;

  const [isPlayingLive, setIsPlayingLive] = useState<boolean>(true);
  const [animStep, setAnimStep] = useState<{ wordLimit: number; yOffset: number }>({
    wordLimit: 0,
    yOffset: 0,
  });

  const [isGeneratingGif, setIsGeneratingGif] = useState<boolean>(false);
  const [gifProgress, setGifProgress] = useState<number>(0);
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const COLOR_PRESETS = [
    { name: 'Putih Stiker WA', bg: '#FFFFFF', text: '#000000' },
    { name: 'Hijau Brat Asli', bg: '#8ACE00', text: '#000000' },
    { name: 'Hitam Pekat', bg: '#0A0A0A', text: '#FFFFFF' },
    { name: 'Abu Modern', bg: '#E4E4E7', text: '#000000' },
    { name: 'Merah Muda', bg: '#FF54A2', text: '#000000' },
    { name: 'Kuning Cerah', bg: '#FACC15', text: '#000000' },
  ];

  const PRESETS = [
    'Minimalis\nEstetik Modern',
    'kamu nanya\nbang?',
    'pinjam seratus\nbesok diganti',
    'minimal mandi\ndulu bang',
    'info loker yang kerjanya rebahan tapi gaji dollar',
    'si paling loyalitas kerja lembur',
    'fztools creative studio',
  ];

  const getParsedTokens = useCallback(() => {
    const lines = text.split('\n');
    const tokens: { text: string; isNewLine: boolean }[] = [];

    lines.forEach((line, lineIndex) => {
      const words = line.trim().split(/\s+/).filter(Boolean);
      words.forEach((w, wordIndex) => {
        tokens.push({
          text: w,
          isNewLine: wordIndex === 0 && lineIndex > 0,
        });
      });
    });

    return tokens.length > 0 ? tokens : [{ text: 'brat', isNewLine: false }];
  }, [text]);

  const computeFittedLayout = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    tokens: { text: string; isNewLine: boolean }[]
  ) => {
    const paddingX = w * 0.08;
    const paddingY = h * 0.08;
    const maxTextWidth = w - paddingX * 2;
    const maxTextHeight = h - paddingY * 2;

    let targetFontSize = BASE_FONT_SIZE * (w / CANVAS_SIZE);

    while (targetFontSize > 16) {
      ctx.font = `600 ${Math.round(targetFontSize)}px Arial, "Helvetica Neue", Helvetica, sans-serif`;
      const testLines: string[] = [];
      let curLine = '';
      let fitsHorizontal = true;

      for (const token of tokens) {
        const tokenWidth = ctx.measureText(token.text).width;
        if (tokenWidth > maxTextWidth) {
          fitsHorizontal = false;
          break;
        }

        if (token.isNewLine && curLine) {
          testLines.push(curLine);
          curLine = token.text;
        } else if (!curLine) {
          curLine = token.text;
        } else {
          const candidate = `${curLine} ${token.text}`;
          if (ctx.measureText(candidate).width <= maxTextWidth) {
            curLine = candidate;
          } else {
            testLines.push(curLine);
            curLine = token.text;
          }
        }
      }
      if (curLine) testLines.push(curLine);

      if (fitsHorizontal) {
        const lineH = targetFontSize * 0.95;
        const totalHeight = testLines.length * lineH;
        if (totalHeight <= maxTextHeight) {
          return { fontSize: targetFontSize, lines: testLines, lineHeight: lineH, paddingX, paddingY };
        }
      }
      targetFontSize -= 2;
    }

    ctx.font = `600 16px Arial, "Helvetica Neue", Helvetica, sans-serif`;
    const fallbackLines: string[] = [];
    let curLine = '';
    for (const token of tokens) {
      if (token.isNewLine && curLine) {
        fallbackLines.push(curLine);
        curLine = token.text;
      } else if (!curLine) {
        curLine = token.text;
      } else {
        const candidate = `${curLine} ${token.text}`;
        if (ctx.measureText(candidate).width <= maxTextWidth) {
          curLine = candidate;
        } else {
          fallbackLines.push(curLine);
          curLine = token.text;
        }
      }
    }
    if (curLine) fallbackLines.push(curLine);
    return { fontSize: 16, lines: fallbackLines, lineHeight: 16 * 0.95, paddingX, paddingY };
  }, []);

  const drawBratFrame = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    activeWordLimit: number,
    scrollOffset: number
  ) => {
    ctx.save();
    ctx.fillStyle = theme;
    ctx.fillRect(0, 0, w, h);

    const tokens = getParsedTokens();
    const visibleTokens = activeWordLimit === 0 ? [] : tokens.slice(0, activeWordLimit);

    if (visibleTokens.length === 0) {
      ctx.restore();
      return;
    }

    const { fontSize, lines, lineHeight, paddingX } = computeFittedLayout(ctx, w, h, visibleTokens);
    ctx.font = `600 ${Math.round(fontSize)}px Arial, "Helvetica Neue", Helvetica, sans-serif`;

    const totalBlockHeight = lines.length * lineHeight;
    let startY = (h - totalBlockHeight) / 2 + lineHeight * 0.75 - scrollOffset;

    ctx.filter = `blur(${BLUR_AMOUNT * (w / CANVAS_SIZE)}px)`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'alphabetic';

    lines.forEach((line) => {
      ctx.fillText(line, paddingX, startY);
      startY += lineHeight;
    });

    ctx.restore();
  }, [theme, textColor, getParsedTokens, computeFittedLayout]);

  useEffect(() => {
    if (!isPlayingLive) {
      return;
    }
    const tokens = getParsedTokens();
    const totalWords = tokens.length;
    let currentLimit = 1;
    const interval = setInterval(() => {
      setAnimStep({ wordLimit: currentLimit, yOffset: 0 });
      currentLimit++;
      if (currentLimit > totalWords) {
        currentLimit = 1;
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isPlayingLive, getParsedTokens]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tokens = getParsedTokens();
    const activeLimit = isPlayingLive ? animStep.wordLimit : tokens.length;
    drawBratFrame(ctx, CANVAS_SIZE, CANVAS_SIZE, activeLimit, animStep.yOffset);
  }, [drawBratFrame, animStep, isPlayingLive, getParsedTokens]);

  const handleDownloadWaSticker = async () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = CANVAS_SIZE;
    tempCanvas.height = CANVAS_SIZE;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    const tokens = getParsedTokens();
    drawBratFrame(ctx, CANVAS_SIZE, CANVAS_SIZE, tokens.length, 0);

    const dataUrl = tempCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `brat_stiker_${text.slice(0, 15).replace(/\s+/g, '_')}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    try {
      await saveHistoryItem({
        toolType: 'brat',
        title: `Brat Stiker WA: "${text.slice(0, 30)}..."`,
        details: `Resolusi 1:1 512x512 | Warna: ${theme}`,
        previewUrl: dataUrl,
        fileFormat: 'png',
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleGenerateBratGif = async () => {
    if (isGeneratingGif) return;
    setIsGeneratingGif(true);
    setGifProgress(5);
    setGifUrl(null);

    const w = CANVAS_SIZE;
    const h = CANVAS_SIZE;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) {
      setIsGeneratingGif(false);
      return;
    }

    const tokens = getParsedTokens();
    const totalWords = tokens.length;

    const encoder = new SimpleGifEncoder(w, h);

    drawBratFrame(ctx, w, h, 0, 0);
    encoder.addFrame(ctx, 250);

    for (let wordIdx = 1; wordIdx <= totalWords; wordIdx++) {
      drawBratFrame(ctx, w, h, wordIdx, 0);
      encoder.addFrame(ctx, 420);
      setGifProgress(Math.round((wordIdx / totalWords) * 80));
      await new Promise((r) => setTimeout(r, 10));
    }

    for (let hold = 0; hold < 3; hold++) {
      drawBratFrame(ctx, w, h, totalWords, 0);
      encoder.addFrame(ctx, 400);
    }

    setGifProgress(95);

    const gifBlob = encoder.generateBlob();
    const url = URL.createObjectURL(gifBlob);
    setGifUrl(url);
    setIsGeneratingGif(false);
    setGifProgress(100);

    try {
      const previewDataUrl = tempCanvas.toDataURL('image/png', 0.6);
      await saveHistoryItem({
        toolType: 'bratgif',
        title: `Brat GIF: "${text.slice(0, 30)}..."`,
        details: `Animasi Perkata (${totalWords} kata) | Format 1:1`,
        previewUrl: previewDataUrl,
        fileFormat: 'gif',
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDownloadGif = () => {
    if (!gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = `bratgif_${text.slice(0, 15).replace(/\s+/g, '_')}_${Date.now()}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-12 shadow-xl shadow-zinc-200/20 dark:shadow-black/40 border border-zinc-200/60 dark:border-zinc-800/60">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/60 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-sm">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Generator Brat
              </h2>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                · Optimasi 1:1
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
              Animasi teks viral dan stiker resolusi tinggi untuk WhatsApp dan media sosial.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 flex flex-col gap-5">
          <div className="p-4 bg-zinc-50/80 dark:bg-zinc-800/40 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50">
            <span className="block text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-3">
              Preset Cepat
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setText(p)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-semibold transition-all cursor-pointer ${
                    text === p 
                      ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-zinc-900 shadow-xs' 
                      : 'bg-white/80 dark:bg-zinc-800/80 border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400'
                  }`}
                >
                  {p.replace('\n', ' · ')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-zinc-50/80 dark:bg-zinc-800/40 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2.5">
              Teks Stiker (Enter untuk baris baru)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Ketik teks di sini..."
              className="w-full bg-white dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl p-3.5 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none shadow-xs"
            />
          </div>

          <div className="p-5 bg-zinc-50/80 dark:bg-zinc-800/40 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 space-y-5">
            <span className="block text-[10px] font-bold tracking-widest uppercase text-zinc-400">
              Opsi Visual
            </span>

            <div>
              <span className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-2.5">
                Preset Tema
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_PRESETS.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => {
                      setTheme(t.bg);
                      setTextColor(t.text);
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                      theme === t.bg 
                        ? 'bg-white dark:bg-zinc-800 border-indigo-500 shadow-xs' 
                        : 'bg-white/80 dark:bg-zinc-800/80 border-zinc-200/60 dark:border-zinc-700/60 hover:border-zinc-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-zinc-200 dark:border-zinc-700 shrink-0"
                      style={{ backgroundColor: t.bg }}
                    />
                    <span className="truncate text-[10px] font-medium text-zinc-700 dark:text-zinc-300">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-200/40 dark:border-zinc-700/40">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Latar Belakang</label>
                <div className="flex items-center gap-2.5 bg-white dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl p-2 shadow-xs">
                  <input
                    type="color"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-6 h-6 rounded-md border-0 cursor-pointer overflow-hidden p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">{theme}</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Warna Teks</label>
                <div className="flex items-center gap-2.5 bg-white dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl p-2 shadow-xs">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-6 h-6 rounded-md border-0 cursor-pointer overflow-hidden p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">{textColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <motion.button
              onClick={handleDownloadWaSticker}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              Unduh Stiker
            </motion.button>

            <motion.button
              onClick={handleGenerateBratGif}
              disabled={isGeneratingGif}
              whileHover={!isGeneratingGif ? { y: -2 } : {}}
              whileTap={!isGeneratingGif ? { scale: 0.98 } : {}}
              className="py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isGeneratingGif ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses {gifProgress}%
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Buat GIF Animasi
                </>
              )}
            </motion.button>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="rounded-3xl bg-zinc-950 p-6 shadow-xl shadow-black/30 flex flex-col items-center justify-between min-h-[460px] border border-zinc-800/80">
            <div className="flex items-center justify-between w-full pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Pratinjau Langsung</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              </div>

              <button
                onClick={() => setIsPlayingLive(!isPlayingLive)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isPlayingLive ? (
                  <>
                    <Pause className="w-3 h-3 text-amber-400" />
                    Jeda
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    Putar
                  </>
                )}
              </button>
            </div>

            <div className="w-full flex items-center justify-center p-4">
              <div 
                className="relative rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
                style={{
                  width: '300px',
                  height: '300px',
                  backgroundColor: theme,
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)'
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                />

                <div className="absolute bottom-2.5 right-3 text-[8px] font-bold text-zinc-400 uppercase tracking-widest opacity-30 pointer-events-none select-none">
                  FZTOOLS 1:1
                </div>
              </div>
            </div>

            <div className="w-full text-center">
              <span className={`text-[10px] font-semibold uppercase tracking-widest transition-colors ${isPlayingLive ? 'text-indigo-400' : 'text-zinc-500'}`}>
                {isPlayingLive ? 'Animasi Dinamis Berjalan' : 'Tampilan Statis'}
              </span>
            </div>

            {gifUrl && (
              <div className="mt-6 p-4 bg-zinc-900 border border-indigo-500/30 rounded-2xl w-full flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={gifUrl} alt="Hasil bratgif" className="w-12 h-12 rounded-xl object-cover border border-zinc-800 bg-white" />
                  <div>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                      GIF Siap Diunduh
                    </div>
                    <div className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">
                      Stiker Animasi 1:1
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={handleDownloadGif}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-indigo-600 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md shadow-indigo-600/20 hover:bg-indigo-500 cursor-pointer text-white flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh GIF
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
