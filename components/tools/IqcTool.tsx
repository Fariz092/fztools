'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { saveHistoryItem } from '@/lib/history-service';
import { motion } from 'motion/react';

const POPULAR_QUOTES = [
  { text: 'makanya cantik.', name: 'ayang', time: '18.30' },
  { text: 'dihina ga tumbang\ndibilang cakep ya emang bang', name: 'crush', time: '21.35' },
  { text: 'jangan berekspektasi tinggi,\nmanusia itu tempatnya kecewa.', name: 'ayang', time: '02.14' },
  { text: 'tetap tersenyum,\nwalau batin sedang babak belur.', name: 'bestie', time: '19.45' },
  { text: 'capek kerja pengen kaya,\ntapi males gerak.', name: 'ayang', time: '12.00' },
  { text: 'yang jago cuman ayam\nyang sakti cuman kera\nkalo yang elit ya kitaa', name: 'ayang', time: '23.49' },
];

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function drawLucideSvg(ctx: CanvasRenderingContext2D, pathData: string, x: number, y: number, color: string, size: number = 24, lineWidth: number = 2) {
  if (typeof Path2D === 'undefined') return;
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 24;
  ctx.scale(scale, scale);
  const path = new Path2D(pathData);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(path);
  ctx.restore();
}

function drawIconReply(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) { 
  drawLucideSvg(ctx, 'M9 17L4 12l5-5 M20 18v-2a4 4 0 0 0-4-4H4', x, y, color, 32, 2.5); 
}
function drawIconForward(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) { 
  drawLucideSvg(ctx, 'M15 17l5-5-5-5 M4 18v-2a4 4 0 0 1 4-4h12', x, y, color, 32, 2.5); 
}
function drawIconCopy(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M9 9h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1', x, y, color, 32, 2.5);
}
function drawIconStar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', x, y, color, 32, 2.5);
}
function drawIconTrash(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6', x, y, color, 32, 2.5);
}
function drawIconEllipsis(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M5 12h.01 M12 12h.01 M19 12h.01', x, y, color, 32, 3);
}

function drawBlueTicks(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save(); ctx.strokeStyle = '#53BDEB'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x + 4, y + 9); ctx.lineTo(x + 12, y + 1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 5, y + 5); ctx.lineTo(x + 9, y + 9); ctx.lineTo(x + 17, y + 1); ctx.stroke();
  ctx.restore();
}

export default function IqcTool() {
  const [senderName, setSenderName] = useState<string>('ayang');
  const [quoteText, setQuoteText] = useState<string>('makanya cantik.');
  const [timeText, setTimeText] = useState<string>('18.30');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = 1080;
    const h = 1920;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const sfFontFamily = '"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // 1. BACKGROUND (SOFT PINK/WARM BOKEH)
    ctx.fillStyle = '#FCF5F7'; 
    ctx.fillRect(0, 0, w, h);

    const bokehColors = ['rgba(255, 218, 224, 0.5)', 'rgba(255, 240, 245, 0.7)', 'rgba(250, 230, 235, 0.6)'];
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 250 + Math.random() * 350;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, bokehColors[i % bokehColors.length]);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. DATE BADGE
    ctx.save();
    const dateText = 'HARI INI';
    ctx.font = `500 28px ${sfFontFamily}`;
    const dateW = ctx.measureText(dateText).width + 48;
    const dateX = (w - dateW) / 2;
    const dateY = 120;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    drawRoundedRect(ctx, dateX, dateY, dateW, 48, 20);
    ctx.fill();
    ctx.fillStyle = '#54656F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateText, dateX + dateW / 2, dateY + 25);
    ctx.restore();

    // 3. DUMMY BUBBLES (SCALED UP)
    const drawDummyBubble = (x: number, y: number, text: string, time: string, isIncoming: boolean) => {
      ctx.save();
      ctx.font = `400 34px ${sfFontFamily}`;
      const lineW = ctx.measureText(text).width;
      const bW = Math.max(260, lineW + 100);
      const bH = 80;
      const r = 24;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = isIncoming ? '#FFFFFF' : '#FFD4E2';
      drawRoundedRect(ctx, x, y, bW, bH, r);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#111B21';
      ctx.font = `400 34px ${sfFontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + 26, y + bH / 2 - 4);

      ctx.fillStyle = '#667781';
      ctx.font = `400 22px ${sfFontFamily}`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(time, x + bW - 18, y + bH - 12);
    };

    drawDummyBubble(86, 200, 'kamu lagi dimana sayang?', '18.25', true);
    drawDummyBubble(w - 86 - 420, 300, 'ini baru mau otw pulang kok', '18.27', false);
    drawDummyBubble(86, 400, 'yaudah hati-hati di jalan yaa', '18.28', true);
    drawDummyBubble(w - 86 - 380, 500, 'siap meluncur pulang', '18.29', false);
    drawDummyBubble(86, 1450, 'nanti malam telfonan yaa', '18.31', true);
    drawDummyBubble(w - 86 - 340, 1550, 'iyaa sayang aman', '18.32', false);
    drawDummyBubble(86, 1650, 'jangan lupa makan', '18.33', true);

    // 4. BLUR BACKGROUND
    const bgSnapshot = document.createElement('canvas');
    bgSnapshot.width = w; bgSnapshot.height = h;
    const snapCtx = bgSnapshot.getContext('2d');
    if (snapCtx) {
      snapCtx.drawImage(canvas, 0, 0);
      ctx.save();
      ctx.clearRect(0, 0, w, h);
      if (typeof ctx.filter !== 'undefined') ctx.filter = 'blur(16px)';
      ctx.drawImage(bgSnapshot, 0, 0);
      ctx.filter = 'none';
      ctx.restore();
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(0, 0, w, h);

    // HITUNG UKURAN BUBBLE (ZOOMED UP)
    const bubbleX = 90;
    const bubbleMaxW = 900;
    const fontSize = 46; // Teks lebih besar
    const lineHeight = 62;
    ctx.font = `400 ${fontSize}px ${sfFontFamily}`;

    const textLines: string[] = [];
    const rawParagraphs = quoteText.split('\n');
    rawParagraphs.forEach((p) => {
      const words = p.split(/\s+/).filter(Boolean);
      let curLine = '';
      words.forEach((wrd) => {
        const test = curLine ? `${curLine} ${wrd}` : wrd;
        if (ctx.measureText(test).width > bubbleMaxW - 120 && curLine) { textLines.push(curLine); curLine = wrd; }
        else curLine = test;
      });
      if (curLine) textLines.push(curLine);
      if (words.length === 0) textLines.push('');
    });
    if (textLines.length === 0) textLines.push('makanya cantik.');

    let longestLineWidth = 0;
    textLines.forEach((l) => { const metrics = ctx.measureText(l).width; if (metrics > longestLineWidth) longestLineWidth = metrics; });

    ctx.font = `400 26px ${sfFontFamily}`;
    const timeWidth = ctx.measureText(timeText).width + 40;
    const bubbleContentW = Math.max(300, longestLineWidth + timeWidth + 60);
    const bubbleW = Math.min(bubbleMaxW, bubbleContentW);
    const bubbleH = textLines.length * lineHeight + 50; // Padding lebih lega

    const bubbleY = 720; // Posisi agak ke atas
    const bubbleYBottom = bubbleY + bubbleH;

    // 5. REACTION PILL (ZOOMED UP)
    const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '😭'];
    const emojiCellW = 72; // Jarak antar emoji lebih lebar
    const plusButtonW = 72;
    const pillPaddingX = 20;
    const pillW = pillPaddingX * 2 + emojis.length * emojiCellW + plusButtonW;
    const pillH = 100;
    const gapPillBubble = 24;
    const pillY = bubbleY - pillH - gapPillBubble;
    const pillX = bubbleX;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 12;
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.font = '54px "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const emojiCenterY = pillY + pillH / 2;
    emojis.forEach((em, idx) => {
      const ex = pillX + pillPaddingX + idx * emojiCellW + emojiCellW / 2;
      ctx.fillText(em, ex, emojiCenterY + 4);
    });

    const plusCenterX = pillX + pillPaddingX + emojis.length * emojiCellW + plusButtonW / 2;
    const plusRadius = 24;
    ctx.fillStyle = '#F2F4F7';
    ctx.beginPath(); ctx.arc(plusCenterX, emojiCenterY, plusRadius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#54656F';
    ctx.font = `600 36px ${sfFontFamily}`;
    ctx.fillText('+', plusCenterX, emojiCenterY + 2);
    ctx.restore();

    // 6. BUBBLE CHAT UTAMA
    const r = 36;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    ctx.beginPath();
    ctx.moveTo(bubbleX + r, bubbleY);
    ctx.lineTo(bubbleX + bubbleW - r, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + r);
    ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - r);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - r, bubbleY + bubbleH);
    ctx.lineTo(bubbleX + r, bubbleY + bubbleH);
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - r);
    ctx.lineTo(bubbleX, bubbleY + 30);
    ctx.bezierCurveTo(bubbleX - 4, bubbleY + 18, bubbleX - 18, bubbleY + 6, bubbleX - 20, bubbleY - 2);
    ctx.bezierCurveTo(bubbleX - 12, bubbleY - 1, bubbleX - 2, bubbleY + 2, bubbleX + 6, bubbleY);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    let contentStartY = bubbleY + 24;
    const textPaddingX = bubbleX + 32;
    ctx.save();
    ctx.fillStyle = '#111B21';
    ctx.font = `400 ${fontSize}px ${sfFontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    textLines.forEach((l, idx) => { ctx.fillText(l, textPaddingX, contentStartY + idx * lineHeight); });

    ctx.fillStyle = '#667781';
    ctx.font = `400 26px ${sfFontFamily}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    const timeEndX = bubbleX + bubbleW - 42;
    ctx.fillText(timeText, timeEndX, bubbleY + bubbleH - 14);
    drawBlueTicks(ctx, timeEndX + 8, bubbleY + bubbleH - 24);
    ctx.restore();

    // 7. CONTEXT MENU (ZOOMED UP)
    const menuW = 620;
    const menuRowH = 88;
    const menuItems = 6;
    const menuH = menuRowH * menuItems;
    const gapBubbleMenu = 32;
    const menuY = bubbleYBottom + gapBubbleMenu;
    const menuX = bubbleX;

    // Glass Effect
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 15;
    drawRoundedRect(ctx, menuX, menuY, menuW, menuH, 32);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, menuX, menuY, menuW, menuH, 32);
    ctx.stroke();
    ctx.restore();

    const menuList = [
      { label: 'Balas', icon: 'reply', color: '#111B21' },
      { label: 'Teruskan', icon: 'forward', color: '#111B21' },
      { label: 'Salin', icon: 'copy', color: '#111B21' },
      { label: 'Beri bintang', icon: 'star', color: '#111B21' },
      { label: 'Hapus', icon: 'trash', color: '#E91E63' },
      { label: 'Lainnya...', icon: 'ellipsis', color: '#111B21' }
    ];

    menuList.forEach((item, idx) => {
      const rowY = menuY + idx * menuRowH;
      
      if (idx === 5) {
         ctx.save();
         ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
         ctx.lineWidth = 1.5;
         ctx.beginPath();
         ctx.moveTo(menuX + 30, rowY);
         ctx.lineTo(menuX + menuW - 30, rowY);
         ctx.stroke();
         ctx.restore();
      }

      const iconX = menuX + 36;
      const iconY = rowY + (menuRowH - 32) / 2;
      if (item.icon === 'reply') drawIconReply(ctx, iconX, iconY, item.color);
      if (item.icon === 'forward') drawIconForward(ctx, iconX, iconY, item.color);
      if (item.icon === 'copy') drawIconCopy(ctx, iconX, iconY, item.color);
      if (item.icon === 'star') drawIconStar(ctx, iconX, iconY, item.color);
      if (item.icon === 'trash') drawIconTrash(ctx, iconX, iconY, item.color);
      if (item.icon === 'ellipsis') drawIconEllipsis(ctx, iconX, iconY, item.color);

      ctx.fillStyle = item.color;
      ctx.font = `400 34px ${sfFontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, menuX + 96, rowY + menuRowH / 2);
    });
  };

  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => { renderCard(); });
    } else {
      renderCard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderName, quoteText, timeText]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `iqc_whatsapp_ios_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    try {
      await saveHistoryItem({
        toolType: 'iqc',
        title: `.IQC: "${quoteText.slice(0, 30)}..."`,
        details: `Nama: ${senderName || '-'} | Jam: ${timeText} | Format: 9:16 iOS`,
        previewUrl: dataUrl,
        fileFormat: 'png',
      });
    } catch (e) { console.warn(e); }
  };

  const handleDownloadSticker = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stickerCanvas = document.createElement('canvas');
    stickerCanvas.width = 512; stickerCanvas.height = 512;
    const sCtx = stickerCanvas.getContext('2d');
    if (!sCtx) return;
    sCtx.imageSmoothingEnabled = true; sCtx.imageSmoothingQuality = 'high';
    const scale = Math.min(512 / canvas.width, 512 / canvas.height);
    const nw = canvas.width * scale; const nh = canvas.height * scale;
    const ox = (512 - nw) / 2; const oy = (512 - nh) / 2;
    sCtx.drawImage(canvas, ox, oy, nw, nh);
    stickerCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `iqc_sticker_${Date.now()}.webp`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    }, 'image/webp');
  };

  const handleCopyClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([ new ClipboardItem({ 'image/png': blob }) ]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2500);
      } catch (err) { console.error(err); }
    }, 'image/png');
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-12 shadow-xl shadow-zinc-200/20 dark:shadow-black/20 border border-zinc-200/80 dark:border-zinc-800/80">
      
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-900 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 font-bold text-2xl text-white">IQ</div>
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
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nama Kontak:</label>
              <div className="flex gap-1">
                {['ayang', 'crush', 'bae'].map((n) => (
                  <button key={n} type="button" onClick={() => setSenderName(n)} className="text-[9px] font-bold px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer border border-zinc-100 dark:border-zinc-700">+{n}</button>
                ))}
              </div>
            </div>
            <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Contoh: ayang" className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Teks Kutipan:</label>
            <textarea rows={4} value={quoteText} onChange={(e) => setQuoteText(e.target.value)} placeholder="Tulis pesan kutipan..." className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Waktu Pesan:</label>
            <div className="flex gap-3">
              <input type="text" value={timeText} onChange={(e) => setTimeText(e.target.value)} placeholder="18.30" className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none" />
              <motion.button type="button" onClick={() => { const now = new Date(); const hh = String(now.getHours()).padStart(2, '0'); const mm = String(now.getMinutes()).padStart(2, '0'); setTimeText(`${hh}.${mm}`); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-xl border border-indigo-100 dark:border-indigo-800 cursor-pointer uppercase tracking-wider">Sekarang</motion.button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Preset Populer:</label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_QUOTES.map((preset, idx) => (
                <button key={idx} type="button" onClick={() => { setQuoteText(preset.text); setSenderName(preset.name); setTimeText(preset.time); }} className="px-3 py-1.5 text-[10px] font-medium rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-zinc-700 transition-all cursor-pointer border border-zinc-100 dark:border-zinc-700 shadow-sm">
                  &quot;{preset.text.split('\n')[0].slice(0, 16)}...&quot;
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
            <motion.button onClick={handleDownload} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-indigo-600 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-3 uppercase tracking-[0.2em]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              <span>Unduh Gambar HD</span>
            </motion.button>

            <div className="grid grid-cols-2 gap-3">
              <motion.button onClick={handleDownloadSticker} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-[10px] rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                <span>Stiker 1:1</span>
              </motion.button>

              <motion.button onClick={handleCopyClipboard} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-[10px] rounded-2xl shadow-lg shadow-zinc-900/10 dark:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                <span>{copiedSuccess ? 'Berhasil!' : 'Salin'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="w-full max-w-[420px] mx-auto rounded-[2.5rem] bg-zinc-950 p-2 shadow-2xl border border-zinc-800 relative">
            <div className="absolute top-4 left-6 flex items-center gap-3 z-10">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pratinjau</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            </div>
            <div className="relative w-full rounded-[2rem] overflow-hidden aspect-[9/16]">
              <canvas ref={canvasRef} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
