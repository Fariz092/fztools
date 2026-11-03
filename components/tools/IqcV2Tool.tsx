'use client';

import React, { useState, useRef, useEffect } from 'react';
import { saveHistoryItem } from '@/lib/history-service';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Download, 
  Settings2, 
  Image as ImageIcon, 
  MessageSquare, 
  Smartphone,
  ChevronLeft,
  Crop,
  Zap,
  Check,
  SmartphoneIcon,
  Copy,
  Info
} from 'lucide-react';

// Preset sample photos & captions
const PRESET_PHOTOS = [
  {
    id: 'mlbb',
    name: 'Mobile Legends Lovers',
    badge: 'CONTOH USER',
    src: '/assets/aistudio/80d9efb6d0fcc068fdb3fc332ebf09a3_f670b24f.webp',
    caption: 'gw udah ada lovers, lu kapan 😂?',
    time: '18:02',
    sender: '',
  },
  {
    id: 'sunset',
    name: 'Senja Aesthetic',
    badge: 'AESTHETIC',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    caption: 'nikmati prosesnya, hasil tak akan mengkhianati usaha ✨🌊',
    time: '17:45',
    sender: 'senja',
  },
  {
    id: 'cat',
    name: 'Kucing Sinis',
    badge: 'MEME',
    src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    caption: 'napa lu liat-liat? mau ngajak ribut apa gimana 😾',
    time: '12:30',
    sender: 'kucing oyen',
  },
];

const ASPECT_RATIOS = [
  { id: '3:4', label: '3:4 (Standar WA)', ratio: 3 / 4, desc: 'Natural' },
  { id: '1:1', label: '1:1 (Kotak)', ratio: 1, desc: 'Instagram' },
  { id: '9:16', label: '9:16 (Story)', ratio: 9 / 16, desc: 'Vertikal' },
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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

/**
 * Universal Lucide SVG Path Renderer for HTML5 Canvas
 */
function drawLucideSvg(
  ctx: CanvasRenderingContext2D,
  pathData: string,
  x: number,
  y: number,
  color: string,
  size: number = 26,
  lineWidth: number = 2.4,
  fill: boolean = false
) {
  if (typeof Path2D === 'undefined') return;
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 24;
  ctx.scale(scale, scale);
  const path = new Path2D(pathData);
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill(path);
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(path);
  }
  ctx.restore();
}

// Exact Lucide SVG Icon Drawers
function drawIconStar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(
    ctx,
    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    x,
    y,
    color,
    26,
    2.2
  );
}

function drawIconReply(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M9 17L4 12l5-5 M20 18v-2a4 4 0 0 0-4-4H4', x, y, color, 26, 2.4);
}

function drawIconForward(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(ctx, 'M15 17l5-5-5-5 M4 18v-2a4 4 0 0 1 4-4h12', x, y, color, 26, 2.4);
}

function drawIconCopy(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(
    ctx,
    'M9 9h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
    x,
    y,
    color,
    26,
    2.2
  );
}

function drawIconTrash(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(
    ctx,
    'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6',
    x,
    y,
    color,
    26,
    2.2
  );
}

function drawIconMore(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawLucideSvg(
    ctx,
    'M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M19 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M5 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
    x,
    y,
    color,
    26,
    2.2,
    true
  );
}

function drawBlueTicks(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = '#53BDEB';
  ctx.lineWidth = 2.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y + 7);
  ctx.lineTo(x + 5, y + 12);
  ctx.lineTo(x + 14, y + 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 7);
  ctx.lineTo(x + 11, y + 12);
  ctx.lineTo(x + 20, y + 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Authentic iOS Glassmorphism Surface for Context Menu
 */
function drawFrostedGlassMenuSurface(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  isPink: boolean = false
) {
  ctx.save();
  ctx.shadowColor = isPink ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;

  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = isPink 
    ? 'rgba(255, 255, 255, 0.72)' 
    : 'rgba(35, 45, 52, 0.78)';
  ctx.fill();
  ctx.restore();

  ctx.save();
  const rimGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  if (isPink) {
    rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    rimGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
  } else {
    rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    rimGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
  }
  ctx.strokeStyle = rimGrad;
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r);
  ctx.stroke();
  ctx.restore();
}

export default function IqcV2Tool() {
  const [variant, setVariant] = useState<'iqc' | 'iqcpink'>('iqc');
  const [imageSrc, setImageSrc] = useState<string>(PRESET_PHOTOS[0].src);
  const [captionText, setCaptionText] = useState<string>(PRESET_PHOTOS[0].caption);
  const [senderName, setSenderName] = useState<string>('');
  const [timeText, setTimeText] = useState<string>('18:02');
  const [aspectRatioId, setAspectRatioId] = useState<string>('3:4');
  const [cropOffsetY, setCropOffsetY] = useState<number>(0.5);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isOutgoing, setIsOutgoing] = useState<boolean>(false);
  const [showBlueTicks, setShowBlueTicks] = useState<boolean>(true);
  const [watermarkOverlay, setWatermarkOverlay] = useState<string>('Hasilnya:');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Bubble Chat & Inset Photo Optimization Settings
  const [bubblePadding] = useState<number>(6);
  const [photoRadius] = useState<number>(16);
  const [bubbleWidth] = useState<number>(620);
  const [bubbleTopY] = useState<number>(90);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const pinkBgImgRef = useRef<HTMLImageElement | null>(null);
  const darkBgImgRef = useRef<HTMLImageElement | null>(null);
  const [imageKey, setImageKey] = useState<number>(0);
  const [wallpapersLoaded, setWallpapersLoaded] = useState<boolean>(false);

  // Load WhatsApp wallpaper background images
  useEffect(() => {
    let count = 0;
    const checkReady = () => {
      count++;
      if (count >= 2) setWallpapersLoaded(true);
    };
    const pImg = new Image();
    pImg.crossOrigin = 'anonymous';
    pImg.src = '/bc-iqcpink.png';
    pImg.onload = checkReady;
    pImg.onerror = checkReady;
    pinkBgImgRef.current = pImg;

    const dImg = new Image();
    dImg.crossOrigin = 'anonymous';
    dImg.src = '/bc-iqc.png';
    dImg.onload = checkReady;
    dImg.onerror = checkReady;
    darkBgImgRef.current = dImg;
  }, []);

  // Load active photo
  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      if (active) {
        loadedImageRef.current = img;
        setImageKey((prev) => prev + 1);
      }
    };
    img.onerror = () => {
      if (active) {
        console.warn('Failed to load image, using fallback');
        setImageKey((prev) => prev + 1);
      }
    };
    return () => {
      active = false;
    };
  }, [imageSrc]);

  // Handle local user upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageSrc(event.target.result);
        setImageKey((prev) => prev + 1);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = 1080;
    const h = 1920;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const isPink = variant === 'iqcpink';
    const sfFontFamily = '"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // -------------------------------------------------------------
    // LAYER 1: AUTHENTIC BLURRED CHAT BACKGROUND & DUMMY CHATS
    // -------------------------------------------------------------
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = w;
    bgCanvas.height = h;
    const bgCtx = bgCanvas.getContext('2d');
    if (!bgCtx) return;

    bgCtx.imageSmoothingEnabled = true;
    bgCtx.imageSmoothingQuality = 'high';

    const bgImg = isPink ? pinkBgImgRef.current : darkBgImgRef.current;
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      bgCtx.drawImage(bgImg, 0, 0, w, h);
    } else {
      const bgGrad = bgCtx.createLinearGradient(0, 0, w, h);
      if (isPink) {
        bgGrad.addColorStop(0, '#FFEBF2');
        bgGrad.addColorStop(0.5, '#FFD8E7');
        bgGrad.addColorStop(1, '#FFC9DD');
      } else {
        bgGrad.addColorStop(0, '#0C1317');
        bgGrad.addColorStop(0.5, '#111B21');
        bgGrad.addColorStop(1, '#0B141A');
      }
      bgCtx.fillStyle = bgGrad;
      bgCtx.fillRect(0, 0, w, h);
    }

    // iOS WhatsApp Top Navigation Header Bar
    const headerH = 120;
    const headerY = 54;
    const accentColor = isPink ? '#D81B60' : '#00A884';

    bgCtx.save();
    bgCtx.strokeStyle = accentColor;
    bgCtx.lineWidth = 4.0;
    bgCtx.lineCap = 'round';
    bgCtx.lineJoin = 'round';
    bgCtx.beginPath();
    bgCtx.moveTo(48, headerY + 54);
    bgCtx.lineTo(34, headerY + 66);
    bgCtx.lineTo(48, headerY + 78);
    bgCtx.stroke();

    const avatarCenterX = 98;
    const avatarCenterY = headerY + 66;
    const avatarRadius = 34;
    const avGrad = bgCtx.createLinearGradient(
      avatarCenterX - avatarRadius,
      avatarCenterY - avatarRadius,
      avatarCenterX + avatarRadius,
      avatarCenterY + avatarRadius
    );
    if (isPink) {
      avGrad.addColorStop(0, '#FF4081');
      avGrad.addColorStop(1, '#C2185B');
    } else {
      avGrad.addColorStop(0, '#25D366');
      avGrad.addColorStop(1, '#128C7E');
    }
    bgCtx.fillStyle = avGrad;
    bgCtx.beginPath();
    bgCtx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
    bgCtx.fill();
    bgCtx.fillStyle = '#FFFFFF';
    bgCtx.font = `700 28px ${sfFontFamily}`;
    bgCtx.textAlign = 'center';
    bgCtx.textBaseline = 'middle';
    bgCtx.fillText('A', avatarCenterX, avatarCenterY + 1);

    const contactDisplayName = senderName.trim() || 'ayang ❤️';
    bgCtx.fillStyle = isPink ? '#111B21' : '#E9EDEF';
    bgCtx.font = `600 32px ${sfFontFamily}`;
    bgCtx.textAlign = 'left';
    bgCtx.textBaseline = 'top';
    bgCtx.fillText(contactDisplayName, 150, headerY + 42);

    bgCtx.fillStyle = isPink ? '#D81B60' : '#8696A0';
    bgCtx.font = `400 22px ${sfFontFamily}`;
    bgCtx.fillText('online', 150, headerY + 80);

    drawLucideSvg(bgCtx, 'm22 8-6 4 6 4V8Z M14 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z', w - 140, headerY + 52, accentColor, 28, 2.5);
    drawLucideSvg(bgCtx, 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z', w - 74, headerY + 52, accentColor, 28, 2.5);
    bgCtx.restore();

    // Date Pill
    const dateText = 'HARI INI';
    bgCtx.font = `600 20px ${sfFontFamily}`;
    const dateW = bgCtx.measureText(dateText).width + 36;
    const dateX = (w - dateW) / 2;
    const dateY = headerY + headerH + 20;
    bgCtx.save();
    bgCtx.fillStyle = isPink ? 'rgba(255, 255, 255, 0.85)' : 'rgba(24, 34, 41, 0.88)';
    drawRoundedRect(bgCtx, dateX, dateY, dateW, 38, 12);
    bgCtx.fill();
    bgCtx.fillStyle = isPink ? '#54656F' : '#8696A0';
    bgCtx.textAlign = 'center';
    bgCtx.textBaseline = 'middle';
    bgCtx.fillText(dateText, w / 2, dateY + 19);
    bgCtx.restore();

    // Apply Blur
    ctx.save();
    if (typeof ctx.filter !== 'undefined') {
      ctx.filter = 'blur(14px)';
    }
    ctx.drawImage(bgCanvas, 0, 0);
    ctx.restore();

    // Dimming
    ctx.fillStyle = isPink ? 'rgba(40, 15, 25, 0.32)' : 'rgba(0, 0, 0, 0.68)';
    ctx.fillRect(0, 0, w, h);

    // -------------------------------------------------------------
    // 2. FOCUSED MEDIA CHAT BUBBLE
    // -------------------------------------------------------------
    const bubbleW = bubbleWidth;
    const bubbleX = isOutgoing ? w - bubbleW - 74 : 74;
    const bubbleY = bubbleTopY;

    const pad = bubblePadding;
    const photoW = bubbleW - pad * 2;
    const currentRatioObj = ASPECT_RATIOS.find((r) => r.id === aspectRatioId) || ASPECT_RATIOS[0];
    const photoH = Math.round(photoW / currentRatioObj.ratio);
    const photoX = bubbleX + pad;
    const photoY = bubbleY + pad;
    const photoR = Math.max(4, Math.min(photoRadius, photoW / 2));

    const captionFontSize = 32;
    const captionLineHeight = 44;
    ctx.font = `400 ${captionFontSize}px ${sfFontFamily}`;

    const textPaddingX = Math.max(22, pad + 16);
    const maxTextW = bubbleW - textPaddingX * 2;
    const captionLines: string[] = [];
    captionText.split('\n').forEach((para) => {
      const words = para.split(/\s+/).filter(Boolean);
      let curLine = '';
      words.forEach((wrd) => {
        const testLine = curLine ? `${curLine} ${wrd}` : wrd;
        if (ctx.measureText(testLine).width > maxTextW && curLine) {
          captionLines.push(curLine);
          curLine = wrd;
        } else {
          curLine = testLine;
        }
      });
      if (curLine) captionLines.push(curLine);
    });
    if (captionLines.length === 0) captionLines.push('');

    const hasSender = senderName.trim().length > 0;
    const senderHeaderH = hasSender ? 36 : 0;
    const textBlockH = captionLines.length * captionLineHeight;
    const timeRowH = 34;
    const captionMarginTop = 14;
    const captionAreaH = captionMarginTop + senderHeaderH + textBlockH + timeRowH + 12;
    const totalBubbleH = pad + photoH + captionAreaH;
    const cornerR = 22;

    ctx.save();
    ctx.shadowColor = isPink ? 'rgba(195, 75, 115, 0.45)' : 'rgba(0, 0, 0, 0.88)';
    ctx.shadowBlur = 48;
    ctx.shadowOffsetY = 16;
    ctx.beginPath();
    ctx.moveTo(bubbleX + cornerR, bubbleY);
    ctx.lineTo(bubbleX + bubbleW - cornerR, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + cornerR);
    if (isOutgoing) {
      ctx.lineTo(bubbleX + bubbleW, bubbleY + totalBubbleH - 24);
      ctx.bezierCurveTo(bubbleX + bubbleW + 4, bubbleY + totalBubbleH - 12, bubbleX + bubbleW + 16, bubbleY + totalBubbleH - 4, bubbleX + bubbleW + 18, bubbleY + totalBubbleH + 2);
      ctx.bezierCurveTo(bubbleX + bubbleW + 10, bubbleY + totalBubbleH, bubbleX + bubbleW + 2, bubbleY + totalBubbleH - 2, bubbleX + bubbleW - 6, bubbleY + totalBubbleH);
      ctx.lineTo(bubbleX + cornerR, bubbleY + totalBubbleH);
      ctx.quadraticCurveTo(bubbleX, bubbleY + totalBubbleH, bubbleX, bubbleY + totalBubbleH - cornerR);
      ctx.lineTo(bubbleX, bubbleY + cornerR);
      ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + cornerR, bubbleY);
    } else {
      ctx.lineTo(bubbleX + bubbleW, bubbleY + totalBubbleH - cornerR);
      ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + totalBubbleH, bubbleX + bubbleW - cornerR, bubbleY + totalBubbleH);
      ctx.lineTo(bubbleX + 24, bubbleY + totalBubbleH);
      ctx.bezierCurveTo(bubbleX + 6, bubbleY + totalBubbleH, bubbleX - 10, bubbleY + totalBubbleH + 2, bubbleX - 18, bubbleY + totalBubbleH + 2);
      ctx.bezierCurveTo(bubbleX - 16, bubbleY + totalBubbleH - 4, bubbleX - 4, bubbleY + totalBubbleH - 12, bubbleX, bubbleY + totalBubbleH - 24);
      ctx.lineTo(bubbleX, bubbleY + cornerR);
      ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + cornerR, bubbleY);
    }
    ctx.fillStyle = isPink ? (isOutgoing ? '#FFD4E2' : '#FFFFFF') : (isOutgoing ? '#005C4B' : '#202C33');
    ctx.fill();
    ctx.restore();

    ctx.save();
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
    ctx.clip();
    const photoImg = loadedImageRef.current;
    if (photoImg && photoImg.naturalWidth && photoImg.naturalHeight) {
      const imgW = photoImg.naturalWidth;
      const imgH = photoImg.naturalHeight;
      const targetAspect = photoW / photoH;
      const srcAspect = imgW / imgH;
      let sw = imgW, sh = imgH, sx = 0, sy = 0;
      if (srcAspect > targetAspect) {
        sw = imgH * targetAspect;
        sx = (imgW - sw) * 0.5;
      } else {
        sh = imgW / targetAspect;
        sy = Math.max(0, Math.min(imgH - sh, (imgH - sh) * cropOffsetY));
      }
      if (zoomLevel > 1.0) {
        const zoomedW = sw / zoomLevel;
        const zoomedH = sh / zoomLevel;
        sx += (sw - zoomedW) * 0.5;
        sy += (sh - zoomedH) * 0.5;
        sw = zoomedW;
        sh = zoomedH;
      }
      ctx.drawImage(photoImg, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
    }
    if (showWatermark && watermarkOverlay.trim().length > 0) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `700 52px ${sfFontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillText(watermarkOverlay.trim(), photoX + photoW / 2, photoY + photoH * 0.62);
    }
    ctx.restore();

    // Caption
    ctx.save();
    let currentTextY = photoY + photoH + captionMarginTop;
    const textX = bubbleX + textPaddingX;
    if (hasSender) {
      ctx.font = `600 24px ${sfFontFamily}`;
      ctx.fillStyle = isPink ? '#D81B60' : '#53BDEB';
      ctx.fillText(senderName.trim(), textX, currentTextY + 22);
      currentTextY += senderHeaderH;
    }
    ctx.font = `400 ${captionFontSize}px ${sfFontFamily}`;
    ctx.fillStyle = isPink ? '#111B21' : '#E9EDEF';
    captionLines.forEach((line, idx) => {
      ctx.fillText(line, textX, currentTextY + 22 + idx * captionLineHeight);
    });
    const timeBottomY = bubbleY + totalBubbleH - 12;
    const timeEndX = bubbleX + bubbleW - Math.max(22, pad + 14);
    ctx.font = `400 20px ${sfFontFamily}`;
    ctx.fillStyle = isPink ? '#667781' : '#8696A0';
    ctx.textAlign = 'right';
    if (showBlueTicks && isOutgoing) {
      ctx.fillText(timeText, timeEndX - 28, timeBottomY);
      drawBlueTicks(ctx, timeEndX - 24, timeBottomY - 22);
    } else {
      ctx.fillText(timeText, timeEndX, timeBottomY);
    }
    ctx.restore();

    // Context Menu
    const menuW = 390;
    const menuX = isOutgoing ? bubbleX + bubbleW - menuW : bubbleX;
    const menuRowH = 68;
    const gapBubbleMenu = 24;
    const menuItems = [
      { id: 'star', label: 'Beri Bintang', icon: 'star' },
      { id: 'reply', label: 'Balas', icon: 'reply' },
      { id: 'forward', label: 'Teruskan', icon: 'forward' },
      { id: 'copy', label: 'Salin', icon: 'copy' },
      { id: 'delete', label: 'Hapus', icon: 'trash', isDestructive: true },
    ];
    const block1H = menuItems.length * menuRowH;
    const menu1Y = bubbleY + totalBubbleH + gapBubbleMenu;
    drawFrostedGlassMenuSurface(ctx, menuX, menu1Y, menuW, block1H, 22, isPink);
    menuItems.forEach((item, idx) => {
      const rowY = menu1Y + idx * menuRowH;
      if (idx > 0) {
        ctx.strokeStyle = isPink ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath(); ctx.moveTo(menuX + 20, rowY); ctx.lineTo(menuX + menuW - 20, rowY); ctx.stroke();
      }
      ctx.font = item.isDestructive ? `500 26px ${sfFontFamily}` : `400 26px ${sfFontFamily}`;
      ctx.fillStyle = item.isDestructive ? '#FF453A' : (isPink ? '#111B21' : '#FFFFFF');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(item.label, menuX + 24, rowY + menuRowH / 2);
      const iconX = menuX + menuW - 46;
      const iconY = rowY + (menuRowH - 26) / 2;
      const iconColor = item.isDestructive ? '#FF453A' : (isPink ? '#3C3C43' : '#8E8E93');
      if (item.icon === 'star') drawIconStar(ctx, iconX, iconY, iconColor);
      if (item.icon === 'reply') drawIconReply(ctx, iconX, iconY, iconColor);
      if (item.icon === 'forward') drawIconForward(ctx, iconX, iconY, iconColor);
      if (item.icon === 'copy') drawIconCopy(ctx, iconX, iconY, iconColor);
      if (item.icon === 'trash') drawIconTrash(ctx, iconX, iconY, iconColor);
    });
    const block2Y = menu1Y + block1H + 12;
    const block2H = 64;
    drawFrostedGlassMenuSurface(ctx, menuX, block2Y, menuW, block2H, 20, isPink);
    ctx.font = `400 26px ${sfFontFamily}`;
    ctx.fillStyle = isPink ? '#111B21' : '#FFFFFF';
    ctx.fillText('Lainnya...', menuX + 24, block2Y + block2H / 2);
    drawIconMore(ctx, menuX + menuW - 46, block2Y + (block2H - 26) / 2, isPink ? '#3C3C43' : '#8E8E93');
  };

  useEffect(() => {
    renderCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, imageSrc, captionText, senderName, timeText, aspectRatioId, cropOffsetY, zoomLevel, isOutgoing, showBlueTicks, watermarkOverlay, showWatermark, imageKey, wallpapersLoaded]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `iqcv2_${Date.now()}.png`;
    a.click();
    try {
      await saveHistoryItem({
        toolType: 'iqcv2',
        title: `IQC v2: "${captionText.slice(0, 20)}..."`,
        details: `Rasio: ${aspectRatioId}`,
        previewUrl: dataUrl,
        fileFormat: 'png',
      });
    } catch (e) { console.warn(e); }
  };

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
                      setImageKey(prev => prev + 1);
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
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer shadow-lg active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Unduh Hasil PNG
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
              {/* iPhone Mockup Frame */}
              <div className="absolute inset-0 border-[10px] border-zinc-900 dark:border-zinc-800 rounded-[52px] pointer-events-none z-20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-900 dark:bg-zinc-800 rounded-b-2xl z-30" />
              
              <div className="relative rounded-[40px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 w-[320px] sm:w-[380px] aspect-[9/16] shadow-inner">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Action Floating Buttons */}
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => setZoomLevel(prev => prev > 1 ? prev - 0.1 : 1)}
                  className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border border-zinc-100 dark:border-zinc-800 text-zinc-600 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  -
                </button>
                <button 
                  onClick={() => setZoomLevel(prev => prev + 0.1)}
                  className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border border-zinc-100 dark:border-zinc-800 text-zinc-600 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-[11px] font-medium text-zinc-500 max-w-xs text-center">
              Kartu media Anda dihasilkan dengan resolusi 1080x1920 yang dioptimalkan untuk WhatsApp Story dan Feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
