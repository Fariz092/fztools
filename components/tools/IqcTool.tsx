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

function drawTrueGlass(
  ctx: CanvasRenderingContext2D,
  snapshot: HTMLCanvasElement,
  x: number, y: number, w: number, h: number, r: number,
  isPink: boolean,
  blurPx: number = 30,
  tintOpacity: number = 0.35
) {
  ctx.save();
  
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.clip();

  if (typeof ctx.filter !== 'undefined') {
    ctx.filter = `blur(${blurPx}px)`;
  }
  const pad = 20;
  ctx.drawImage(snapshot, x - pad, y - pad, w + pad * 2, h + pad * 2, x - pad, y - pad, w + pad * 2, h + pad * 2);
  ctx.filter = 'none';

  ctx.fillStyle = isPink
    ? `rgba(255, 245, 250, ${tintOpacity})`
    : `rgba(30, 40, 48, ${tintOpacity})`;
  ctx.fillRect(x, y, w, h);

  const shine = ctx.createLinearGradient(x, y, x, y + h * 0.6);
  shine.addColorStop(0, isPink ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)');
  shine.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = shine;
  ctx.fillRect(x, y, w, h * 0.6);

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = isPink ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, x + 0.75, y + 0.75, w - 1.5, h - 1.5, r);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.shadowColor = isPink ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = 'transparent';
  ctx.stroke();
  ctx.restore();
}

function drawLucideSvg(ctx: CanvasRenderingContext2D, pathData: string, x: number, y: number, color: string, size: number = 26, lineWidth: number = 2.4) {
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

function drawIconReply(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) { drawLucideSvg(ctx, 'M9 17L4 12l5-5 M20 18v-2a4 4 0 0 0-4-4H4', x, y, color); }
function drawIconForward(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) { drawLucideSvg(ctx, 'M15 17l5-5-5-5 M4 18v-2a4 4 0 0 1 4-4h12', x, y, color); }
function drawIconCopy(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M9 9h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1', x, y, color, 26, 2.2);
}
function drawIconStar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', x, y, color, 26, 2.2);
}
function drawIconTrash(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6', x, y, color, 26, 2.2);
}
function drawIconInfo(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 16v-4 M12 8h.01', x, y, color, 26, 2.2);
}
function drawBlueTicks(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save(); ctx.strokeStyle = '#53BDEB'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x + 4, y + 9); ctx.lineTo(x + 11, y + 1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 5, y + 5); ctx.lineTo(x + 9, y + 9); ctx.lineTo(x + 16, y + 1); ctx.stroke();
  ctx.restore();
}

export default function IqcTool() {
  const [variant, setVariant] = useState<'iqcpink' | 'iqc'>('iqcpink');
  const [senderName, setSenderName] = useState<string>('ayang');
  const [quoteText, setQuoteText] = useState<string>('makanya cantik.');
  const [timeText, setTimeText] = useState<string>('18.30');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinkBgImgRef = useRef<HTMLImageElement | null>(null);
  const darkBgImgRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  useEffect(() => {
    let loadedCount = 0;
    const checkAllLoaded = () => { loadedCount++; if (loadedCount >= 2) setImagesLoaded(true); };
    const pinkImg = new Image(); pinkImg.crossOrigin = 'anonymous'; pinkImg.src = '/bc-iqcpink.png'; pinkImg.onload = checkAllLoaded; pinkImg.onerror = checkAllLoaded; pinkBgImgRef.current = pinkImg;
    const darkImg = new Image(); darkImg.crossOrigin = 'anonymous'; darkImg.src = '/bc-iqc.png'; darkImg.onload = checkAllLoaded; darkImg.onerror = checkAllLoaded; darkBgImgRef.current = darkImg;
  }, []);

  const renderCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isPink = variant === 'iqcpink';
    const w = 1080;
    const h = 1920;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const sfFontFamily = '"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // BACKGROUND
    const bgImg = isPink ? pinkBgImgRef.current : darkBgImgRef.current;
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, w, h);
    } else {
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      if (isPink) { bgGrad.addColorStop(0, '#FFF0F3'); bgGrad.addColorStop(0.5, '#FCE4E8'); bgGrad.addColorStop(1, '#F7D6DC'); }
      else { bgGrad.addColorStop(0, '#0D1418'); bgGrad.addColorStop(0.5, '#111B21'); bgGrad.addColorStop(1, '#0B141A'); }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);
    }

    // DATE BADGE
    ctx.save();
    const dateText = 'HARI INI';
    ctx.font = `500 22px ${sfFontFamily}`;
    const dateW = ctx.measureText(dateText).width + 36;
    const dateX = (w - dateW) / 2;
    const dateY = 80;
    ctx.fillStyle = isPink ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 42, 50, 0.85)';
    drawRoundedRect(ctx, dateX, dateY, dateW, 38, 14);
    ctx.fill();
    ctx.fillStyle = isPink ? '#54656F' : '#8696A0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateText, dateX + dateW / 2, dateY + 19);
    ctx.restore();

    // DUMMY BUBBLES
    const drawDummyBubble = (x: number, y: number, text: string, time: string, isIncoming: boolean) => {
      ctx.save();
      ctx.font = `400 30px ${sfFontFamily}`;
      const lineW = ctx.measureText(text).width;
      const bW = Math.max(200, lineW + 80);
      const bH = 72;
      const r = 20;
      ctx.shadowColor = isPink ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = isIncoming ? (isPink ? '#FFFFFF' : '#202C33') : (isPink ? '#FFD4E2' : '#005C4B');
      drawRoundedRect(ctx, x, y, bW, bH, r);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = isPink ? '#111B21' : '#E9EDEF';
      ctx.font = `400 30px ${sfFontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + 22, y + bH / 2 - 4);

      ctx.fillStyle = isPink ? '#667781' : '#8696A0';
      ctx.font = `400 18px ${sfFontFamily}`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(time, x + bW - 14, y + bH - 10);
    };

    drawDummyBubble(86, 180, 'kamu lagi dimana sayang?', '18.25', true);
    drawDummyBubble(w - 86 - 360, 260, 'ini baru mau otw pulang kok', '18.27', false);
    drawDummyBubble(86, 340, 'yaudah hati-hati di jalan yaa', '18.28', true);
    drawDummyBubble(w - 86 - 320, 420, 'siap meluncur pulang', '18.29', false);
    drawDummyBubble(86, 1560, 'nanti malam telfonan yaa', '18.31', true);
    drawDummyBubble(w - 86 - 280, 1640, 'iyaa sayang aman', '18.32', false);
    drawDummyBubble(86, 1720, 'jangan lupa makan', '18.33', true);

    // BLUR + DIMMING BACKGROUND
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
    ctx.fillStyle = isPink ? 'rgba(40, 15, 25, 0.35)' : 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, w, h);

    const glassSourceSnapshot = document.createElement('canvas');
    glassSourceSnapshot.width = w; glassSourceSnapshot.height = h;
    const glassSnapCtx = glassSourceSnapshot.getContext('2d');
    if (glassSnapCtx) glassSnapCtx.drawImage(canvas, 0, 0);

    // HITUNG UKURAN BUBBLE
    ctx.globalAlpha = 1.0;
    const bubbleX = 86;
    const bubbleMaxW = Math.min(740, w - bubbleX * 2);
    const fontSize = 34;
    const lineHeight = 48;
    ctx.font = `400 ${fontSize}px ${sfFontFamily}`;

    const textLines: string[] = [];
    const rawParagraphs = quoteText.split('\n');
    rawParagraphs.forEach((p) => {
      const words = p.split(/\s+/).filter(Boolean);
      let curLine = '';
      words.forEach((wrd) => {
        if (ctx.measureText(wrd).width > bubbleMaxW - 100) {
          for (let i = 0; i < wrd.length; i++) {
            const char = wrd[i];
            if (ctx.measureText(curLine + char).width > bubbleMaxW - 100) { textLines.push(curLine); curLine = char; }
            else curLine += char;
          }
        } else {
          const test = curLine ? `${curLine} ${wrd}` : wrd;
          if (ctx.measureText(test).width > bubbleMaxW - 100 && curLine) { textLines.push(curLine); curLine = wrd; }
          else curLine = test;
        }
      });
      if (curLine) textLines.push(curLine);
      if (words.length === 0) textLines.push('');
    });
    if (textLines.length === 0) textLines.push('makanya cantik.');

    let longestLineWidth = 0;
    textLines.forEach((l) => { const metrics = ctx.measureText(l).width; if (metrics > longestLineWidth) longestLineWidth = metrics; });

    let senderNameWidth = 0;
    const hasSenderName = senderName.trim().length > 0;
    if (hasSenderName) { ctx.font = `600 26px ${sfFontFamily}`; senderNameWidth = ctx.measureText(senderName.trim()).width + 16; }

    ctx.font = `400 20px ${sfFontFamily}`;
    const timeWidth = ctx.measureText(timeText).width + 30;
    const contentNeededW = Math.max(longestLineWidth, senderNameWidth);
    const needExtraLineForTime = textLines.length === 1 && contentNeededW + timeWidth + 50 > bubbleMaxW - 30;

    const bubbleContentW = Math.max(280, contentNeededW + (needExtraLineForTime ? 34 : timeWidth + 56));
    const bubbleW = Math.min(bubbleMaxW, bubbleContentW);
    const nameHeaderH = hasSenderName ? 30 : 0;
    const bubbleH = Math.max(88, nameHeaderH + textLines.length * lineHeight + (needExtraLineForTime ? 54 : 30));

    const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
    const emojiCellW = 44;
    const plusButtonW = 40;
    const pillPaddingX = 18;
    const pillW = pillPaddingX * 2 + emojis.length * emojiCellW + plusButtonW;
    const pillH = 74;
    const gapPillBubble = 12;
    const gapBubbleMenu = 16;
    const menuRowH = 68;
    const menuRows = 6;
    const menuH = menuRowH * menuRows;
    const menuW = 390;

    const bubbleY = 720;
    const pillY = bubbleY - pillH - gapPillBubble;
    const pillX = bubbleX;
    const menuY = bubbleY + bubbleH + gapBubbleMenu;
    const menuX = bubbleX;

    // PILL: TRUE GLASS
    drawTrueGlass(ctx, glassSourceSnapshot, pillX, pillY, pillW, pillH, pillH / 2, isPink, 40, isPink ? 0.45 : 0.35);

    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.font = '38px "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", "SF Pro Text", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const emojiCenterY = pillY + pillH / 2;
    emojis.forEach((em, idx) => {
      const ex = pillX + pillPaddingX + idx * emojiCellW + emojiCellW / 2;
      ctx.fillText(em, ex, emojiCenterY + 2);
    });
    const plusCenterX = pillX + pillPaddingX + emojis.length * emojiCellW + plusButtonW / 2;
    const plusCenterY = emojiCenterY;
    const plusRadius = 16;
    ctx.fillStyle = isPink ? 'rgba(240, 244, 247, 0.9)' : 'rgba(45, 56, 66, 0.9)';
    ctx.beginPath(); ctx.arc(plusCenterX, plusCenterY, plusRadius, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = isPink ? 'rgba(224, 224, 224, 0.9)' : 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = isPink ? '#54656F' : '#8696A0';
    ctx.font = `600 22px ${sfFontFamily}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('+', plusCenterX, plusCenterY + 1);
    ctx.restore();

    // FOCUSED BUBBLE
    const r = 22;
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.shadowColor = isPink ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 15;
    ctx.beginPath();
    ctx.moveTo(bubbleX + r, bubbleY);
    ctx.lineTo(bubbleX + bubbleW - r, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + r);
    ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - r);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - r, bubbleY + bubbleH);
    ctx.lineTo(bubbleX + r, bubbleY + bubbleH);
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - r);
    ctx.lineTo(bubbleX, bubbleY + 24);
    ctx.bezierCurveTo(bubbleX - 3, bubbleY + 14, bubbleX - 14, bubbleY + 5, bubbleX - 16, bubbleY - 2);
    ctx.bezierCurveTo(bubbleX - 10, bubbleY - 1, bubbleX - 2, bubbleY + 2, bubbleX + 5, bubbleY);
    ctx.closePath();
    ctx.fillStyle = isPink ? '#FFFFFF' : '#202C33';
    ctx.fill();
    ctx.restore();

    if (isPink) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bubbleX + r, bubbleY); ctx.lineTo(bubbleX + bubbleW - r, bubbleY);
      ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + r);
      ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - r);
      ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - r, bubbleY + bubbleH);
      ctx.lineTo(bubbleX + r, bubbleY + bubbleH);
      ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - r);
      ctx.lineTo(bubbleX, bubbleY + 24);
      ctx.bezierCurveTo(bubbleX - 3, bubbleY + 14, bubbleX - 14, bubbleY + 5, bubbleX - 16, bubbleY - 2);
      ctx.bezierCurveTo(bubbleX - 10, bubbleY - 1, bubbleX - 2, bubbleY + 2, bubbleX + 5, bubbleY);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    let contentStartY = bubbleY + 16;
    const textPaddingX = bubbleX + 26;
    ctx.save();
    if (hasSenderName) {
      ctx.font = `600 26px ${sfFontFamily}`;
      ctx.fillStyle = isPink ? '#D81B60' : '#53BDEB';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(senderName.trim(), textPaddingX, contentStartY);
      contentStartY += 30;
    }
    ctx.fillStyle = isPink ? '#111B21' : '#E9EDEF';
    ctx.font = `400 ${fontSize}px ${sfFontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    textLines.forEach((l, idx) => { ctx.fillText(l, textPaddingX, contentStartY + idx * lineHeight); });

    ctx.fillStyle = isPink ? '#667781' : '#8696A0';
    ctx.font = `400 20px ${sfFontFamily}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    const timeEndX = bubbleX + bubbleW - 36;
    ctx.fillText(timeText, timeEndX, bubbleY + bubbleH - 10);
    drawBlueTicks(ctx, timeEndX + 6, bubbleY + bubbleH - 22);
    ctx.restore();

    // CONTEXT MENU: TRUE GLASS
    drawTrueGlass(ctx, glassSourceSnapshot, menuX, menuY, menuW, menuH, 22, isPink, 40, isPink ? 0.5 : 0.4);

    ctx.save();
    const menuItems = [
      { id: 'reply', label: 'Balas', icon: 'reply', isDestructive: false },
      { id: 'forward', label: 'Teruskan', icon: 'forward', isDestructive: false },
      { id: 'copy', label: 'Salin', icon: 'copy', isDestructive: false },
      { id: 'star', label: 'Beri bintang', icon: 'star', isDestructive: false },
      { id: 'delete', label: 'Hapus', icon: 'trash', isDestructive: true },
      { id: 'info', label: 'Info', icon: 'info', isDestructive: false },
    ];
    menuItems.forEach((item, idx) => {
      const rowY = menuY + idx * menuRowH;
      if (idx > 0) {
        ctx.save();
        ctx.strokeStyle = isPink ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(menuX + 20, rowY); ctx.lineTo(menuX + menuW - 20, rowY);
        ctx.stroke();
        ctx.restore();
      }
      const textColor = item.isDestructive ? '#FF3B30' : isPink ? '#111B21' : '#FFFFFF';
      const iconColor = item.isDestructive ? '#FF3B30' : isPink ? '#3C3C43' : '#8E8E93';
      ctx.font = item.isDestructive ? `500 26px ${sfFontFamily}` : `400 26px ${sfFontFamily}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, menuX + 24, rowY + menuRowH / 2);
      const iconX = menuX + menuW - 46;
      const iconY = rowY + (menuRowH - 26) / 2;
      if (item.icon === 'reply') drawIconReply(ctx, iconX, iconY, iconColor);
      if (item.icon === 'forward') drawIconForward(ctx, iconX, iconY, iconColor);
      if (item.icon === 'copy') drawIconCopy(ctx, iconX, iconY, iconColor);
      if (item.icon === 'star') drawIconStar(ctx, iconX, iconY, iconColor);
      if (item.icon === 'trash') drawIconTrash(ctx, iconX, iconY, iconColor);
      if (item.icon === 'info') drawIconInfo(ctx, iconX, iconY, iconColor);
    });
    ctx.restore();
  };

  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => { renderCard(); });
    } else {
      renderCard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, senderName, quoteText, timeText, imagesLoaded]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${variant}_whatsapp_ios_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    try {
      await saveHistoryItem({
        toolType: variant,
        title: `${variant === 'iqcpink' ? '.IQCPINK' : '.IQC'}: "${quoteText.slice(0, 30)}..."`,
        details: `Nama: ${senderName || '-'} | Jam: ${timeText} | Format: 9:16 iOS Proporsional`,
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
      a.href = url; a.download = `${variant}_sticker_${Date.now()}.webp`;
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
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl mb-8 border border-indigo-100 dark:border-indigo-900/30">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-full uppercase tracking-widest">IQC v1 (Teks)</span>
          <span className="text-[11px] font-medium text-indigo-900 dark:text-indigo-300 hidden sm:inline">Klasik WhatsApp quote generator</span>
        </div>
        <Link href="/iqcv2" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-xl shadow-lg shadow-emerald-500/20 no-underline flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider">
          <span>Buka IQC v2 (Foto + Caption)</span>
          <span className="px-1.5 py-0.5 bg-white/20 rounded text-[8px]">BARU!</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-900 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 font-bold text-2xl text-white">IQ</div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Generator .IQC & .IQCPINK</h2>
              <span className="inline-flex px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md text-[10px] font-bold uppercase tracking-widest border border-amber-100 dark:border-amber-900/30">Proporsi 9:16</span>
            </div>
            <p className="text-sm text-zinc-400 font-medium mt-1">Desain presisi iOS WhatsApp dengan efek long-press haptic yang estetik.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-1 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
          <button onClick={() => setVariant('iqcpink')} className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer ${variant === 'iqcpink' ? 'bg-white dark:bg-zinc-700 text-pink-600 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600' : 'text-zinc-400 hover:text-zinc-600'}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400" /><span>GLOSSY PINK</span>
          </button>
          <button onClick={() => setVariant('iqc')} className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer ${variant === 'iqc' ? 'bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600' : 'text-zinc-400 hover:text-zinc-600'}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-white" /><span>CLASSIC DARK</span>
          </button>
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
          <div className="rounded-3xl bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black/20 flex flex-col items-center justify-center min-h-[600px] border border-zinc-800 relative group/canvas">
            <div className="absolute top-4 left-6 flex items-center gap-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pratinjau</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </div>
            <div className="w-full max-w-[340px] transform scale-75 xs:scale-90 sm:scale-100 transition-transform duration-500 origin-center hover:scale-[1.02]">
              <div className="relative rounded-2xl shadow-2xl bg-zinc-900 overflow-hidden aspect-[9/16]">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
