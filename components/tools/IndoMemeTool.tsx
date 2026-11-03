'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Type, 
  LayoutGrid,
  CloudUpload
} from 'lucide-react';
import { saveHistoryItem } from '@/lib/history-service';
import { motion } from 'motion/react';

export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  defaultTop: string;
  defaultBottom: string;
}

export const POPULAR_INDO_MEMES: MemeTemplate[] = [
  {
    id: 'tukang_parkir',
    name: 'Tukang Parkir Gaib',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    defaultTop: 'PAS DATANG GAK ADA ORANG',
    defaultBottom: 'PAS MUNDUR TIBA-TIBA: "PRRRRT TERUS TERUS"',
  },
  {
    id: 'pria_senyum_nangis',
    name: 'Pria Tersenyum Menahan Tangis',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    defaultTop: 'BILANGNYA: "IYA GAK APA-APA KOK"',
    defaultBottom: 'PADAHAL ASAM LAMBUNG SUDAH SAMPAI TENGGOROKAN',
  },
  {
    id: 'kucing_judes',
    name: 'Kucing Tatapan Mengadili',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    defaultTop: 'LIHAT TEMEN GAYA SULTAN',
    defaultBottom: 'PADAHAL KEMARIN PINJAM SERATUS BELUM DIBAYAR',
  },
  {
    id: 'mas_bengong',
    name: 'Mas-Mas Bengong di Warkop',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
    defaultTop: 'LAGI NGASO MINUM ES TEH',
    defaultBottom: 'TIBA-TIBA KEPIKIRAN MASA DEPAN YANG GAK JELAS',
  },
];

export default function IndoMemeTool() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(POPULAR_INDO_MEMES[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [topText, setTopText] = useState<string>(POPULAR_INDO_MEMES[0].defaultTop);
  const [bottomText, setBottomText] = useState<string>(POPULAR_INDO_MEMES[0].defaultBottom);
  const [fontSize, setFontSize] = useState<number>(36);
  const [textColor] = useState<string>('#FFFFFF');
  const [selectedBadge, setSelectedBadge] = useState<string>('MENURUT BMKG');
  const [showBadge, setShowBadge] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeImgUrl = customImageUrl || selectedTemplate.url;

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const test = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = test;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = 650;
      const h = Math.round((img.naturalHeight / img.naturalWidth) * w) || 650;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);

      ctx.fillStyle = textColor;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 2;
      ctx.textAlign = 'center';
      ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;

      if (topText) {
        const topLines = wrapText(ctx, topText.toUpperCase(), w - 40);
        for (let i = 0; i < topLines.length; i++) {
          const y = 45 + i * (fontSize + 6);
          ctx.strokeText(topLines[i], w / 2, y);
          ctx.fillText(topLines[i], w / 2, y);
        }
      }

      if (bottomText) {
        const botLines = wrapText(ctx, bottomText.toUpperCase(), w - 40);
        const startY = h - 25 - (botLines.length - 1) * (fontSize + 6);

        for (let i = 0; i < botLines.length; i++) {
          const y = startY + i * (fontSize + 6);
          ctx.strokeText(botLines[i], w / 2, y);
          ctx.fillText(botLines[i], w / 2, y);
        }
      }

      if (showBadge && selectedBadge) {
        const badgeY = 24;
        const badgeX = 24;
        ctx.font = '800 12px "Courier New", monospace';
        const badgeW = ctx.measureText(selectedBadge).width + 16;
        
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(badgeX, badgeY, badgeW, 24);
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.fillText(selectedBadge, badgeX + 8, badgeY + 16);
      }
    };
    img.src = activeImgUrl;
  }, [activeImgUrl, topText, bottomText, fontSize, textColor, showBadge, selectedBadge]);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomImageUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `meme_${Date.now()}.png`;
    a.click();
    try {
      await saveHistoryItem({
        toolType: 'meme',
        title: `Meme: "${(topText || bottomText).slice(0, 30)}..."`,
        details: `Template: ${selectedTemplate.name}`,
        previewUrl: dataUrl,
        fileFormat: 'png',
      });
    } catch (e) { console.warn(e); }
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-12 shadow-xl shadow-zinc-200/20 dark:shadow-black/40 border border-zinc-200/60 dark:border-zinc-800/60">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/60 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Meme Indonesia
            </h2>
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              · Koleksi Populer
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
            Template meme legendaris dengan tipografi Impact khas media sosial.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-zinc-400 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <CloudUpload className="w-3.5 h-3.5" />
          <span>Pakai Gambar Sendiri</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50/80 dark:bg-zinc-800/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-5 shadow-xs">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5" />
              Pilih Template Meme
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {POPULAR_INDO_MEMES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    setCustomImageUrl(null);
                    setTopText(tmpl.defaultTop);
                    setBottomText(tmpl.defaultBottom);
                  }}
                  className={`group relative aspect-[4/3] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    selectedTemplate.id === tmpl.id && !customImageUrl 
                      ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-sm' 
                      : 'border-zinc-200/60 dark:border-zinc-700/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={tmpl.url} alt={tmpl.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-bold text-white truncate">{tmpl.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-50/80 dark:bg-zinc-800/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                <Type className="w-3 h-3" />
                Teks Atas
              </label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="CONTOH TEKS ATAS..."
                className="w-full bg-white dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none uppercase shadow-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                <Type className="w-3 h-3" />
                Teks Bawah
              </label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="CONTOH TEKS BAWAH..."
                className="w-full bg-white dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none uppercase shadow-xs"
              />
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                <span>Ukuran Teks</span>
                <span className="tabular-nums text-indigo-600 dark:text-indigo-400 font-semibold">
                  {fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="24"
                max="56"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="pt-2 border-t border-zinc-200/40 dark:border-zinc-700/40">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Stiker Konteks</label>
              <div className="flex flex-wrap gap-1.5">
                {['MENURUT BMKG', 'WKWK LAND', 'INFO KONOHA', 'VERSI NETIZEN'].map((b) => (
                  <button
                    key={b}
                    onClick={() => { setSelectedBadge(b); setShowBadge(true); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                      selectedBadge === b && showBadge 
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs' 
                        : 'bg-white/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200/50 dark:border-zinc-700/50 hover:border-zinc-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
                <button
                  onClick={() => setShowBadge(!showBadge)}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-rose-50/80 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 cursor-pointer"
                >
                  {showBadge ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleDownload}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-500 cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95 uppercase tracking-[0.15em]"
          >
            <Download className="w-4 h-4" />
            Unduh Meme PNG
          </motion.button>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 shadow-xl shadow-black/30 flex flex-col items-center justify-center min-h-[460px]">
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-zinc-400 mb-6 pb-4 border-b border-zinc-800">
              <span className="uppercase tracking-[0.2em]">Pratinjau Langsung</span>
              <span className="uppercase text-zinc-500">{selectedTemplate.name}</span>
            </div>

            <div className="relative max-w-full overflow-hidden rounded-xl shadow-2xl border border-zinc-800">
               <canvas
                ref={canvasRef}
                className="max-h-[420px] max-w-full object-contain"
              />
            </div>

            <p className="mt-6 text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] text-center">
              Dihasilkan dengan font Impact resolusi tinggi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
