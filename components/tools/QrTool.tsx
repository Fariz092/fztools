'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Download, 
  Link, 
  MessageSquare, 
  Wifi, 
  Type,
  QrCode
} from 'lucide-react';
import { saveHistoryItem } from '@/lib/history-service';
import { motion } from 'motion/react';

export default function QrTool() {
  const [mode, setMode] = useState<'text' | 'url' | 'whatsapp' | 'wifi'>('text');
  const [rawText, setRawText] = useState<string>('FZTOOLS - Minimalist Utility Suite');
  const [urlInput, setUrlInput] = useState<string>('https://google.com');
  const [waPhone, setWaPhone] = useState<string>('6281234567890');
  const [waMessage, setWaMessage] = useState<string>('Halo admin FZTOOLS, saya mau tanya...');
  const [wifiSsid, setWifiSsid] = useState<string>('FZTOOLS_WIFI');
  const [wifiPassword, setWifiPassword] = useState<string>('12345678');
  const [wifiAuth, setWifiAuth] = useState<string>('WPA');

  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [frameTitle, setFrameTitle] = useState<string>('Pindai Saya');
  const [showFrame, setShowFrame] = useState<boolean>(true);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const compositeCanvasRef = useRef<HTMLCanvasElement>(null);

  const getPayload = () => {
    switch (mode) {
      case 'url':
        return urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      }
      case 'wifi':
        return `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPassword};;`;
      case 'text':
      default:
        return rawText;
    }
  };

  useEffect(() => {
    let payload = rawText;
    if (mode === 'url') {
      payload = urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
    } else if (mode === 'whatsapp') {
      const cleanPhone = waPhone.replace(/[^0-9]/g, '');
      payload = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
    } else if (mode === 'wifi') {
      payload = `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPassword};;`;
    }

    if (!payload) return;

    QRCode.toDataURL(payload, {
      width: 450,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => console.error(err));
  }, [mode, rawText, urlInput, waPhone, waMessage, wifiSsid, wifiPassword, wifiAuth, fgColor, bgColor, errorLevel]);

  useEffect(() => {
    if (!qrDataUrl) return;
    const canvas = compositeCanvasRef.current;
    if (!canvas) return;

    const qrImg = new Image();
    qrImg.onload = () => {
      const size = 500;
      const frameHeight = showFrame ? 620 : 500;
      canvas.width = size;
      canvas.height = frameHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, frameHeight);

      if (showFrame) {
        ctx.fillStyle = '#4F46E5';
        ctx.fillRect(0, 0, size, 76);

        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(frameTitle.toUpperCase(), size / 2, 48);

        ctx.drawImage(qrImg, 25, 96, 450, 450);

        ctx.fillStyle = '#FAFAFA';
        ctx.fillRect(0, frameHeight - 56, size, 56);
        ctx.font = '600 13px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#71717A';
        ctx.fillText('FZTOOLS · GENERATOR KODE QR', size / 2, frameHeight - 22);
      } else {
        ctx.drawImage(qrImg, 25, 25, 450, 450);
      }
    };
    qrImg.src = qrDataUrl;
  }, [qrDataUrl, showFrame, frameTitle]);

  const handleDownload = async () => {
    const canvas = compositeCanvasRef.current;
    if (!canvas) return;

    const finalUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = finalUrl;
    a.download = `qr_fztools_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    try {
      await saveHistoryItem({
        toolType: 'qr',
        title: `QR Code: ${getPayload().slice(0, 35)}`,
        details: `Tipe: ${mode.toUpperCase()} | Frame: ${showFrame ? frameTitle : 'Polos'}`,
        previewUrl: finalUrl,
        fileFormat: 'png',
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-12 shadow-xl shadow-zinc-200/20 dark:shadow-black/40 border border-zinc-200/60 dark:border-zinc-800/60">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/60 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 flex items-center justify-center shadow-xs">
            <QrCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Generator Kode QR
              </h2>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                · Vektor Presisi
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
              Buat kode QR untuk Teks, URL, WhatsApp, atau Wi-Fi dengan format poster estetik.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 p-1 bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
          <button
            onClick={() => setMode('text')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'text' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Type className="w-3 h-3" /> Teks
          </button>
          <button
            onClick={() => setMode('url')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'url' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Link className="w-3 h-3" /> URL
          </button>
          <button
            onClick={() => setMode('whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'whatsapp' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3 h-3" /> WhatsApp
          </button>
          <button
            onClick={() => setMode('wifi')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'wifi' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Wifi className="w-3 h-3" /> Wi-Fi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 flex flex-col gap-5">
          <div className="space-y-4">
            {mode === 'text' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Isi Teks QR:
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl p-3.5 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none shadow-xs"
                  placeholder="Ketik teks, pesan, atau informasi..."
                />
              </div>
            )}

            {mode === 'url' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Tautan URL:
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
                  placeholder="https://contoh.com"
                />
              </div>
            )}

            {mode === 'whatsapp' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Nomor WhatsApp (Kode Negara 62):
                  </label>
                  <input
                    type="text"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    className="w-full bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none shadow-xs"
                    placeholder="628123456789"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Pesan Otomatis:
                  </label>
                  <textarea
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-4 py-2 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none shadow-xs resize-none"
                    placeholder="Halo admin..."
                  />
                </div>
              </div>
            )}

            {mode === 'wifi' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Nama Jaringan Wi-Fi (SSID):
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Kata Sandi Wi-Fi:
                  </label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    className="w-full bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none shadow-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-zinc-50/80 dark:bg-zinc-800/40 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Format Bingkai Poster
              </label>
              <button 
                type="button"
                onClick={() => setShowFrame(!showFrame)}
                className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors flex items-center ${showFrame ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showFrame ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {showFrame && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Judul Banner Poster:
                </label>
                <input
                  type="text"
                  value={frameTitle}
                  onChange={(e) => setFrameTitle(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-4 py-2 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none uppercase"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Pindai Saya', 'Menu Digital', 'Hubungi Kami', 'Akses Wi-Fi'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setFrameTitle(preset)}
                      className="px-2.5 py-1 text-[9px] font-semibold rounded-lg bg-white/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-zinc-400 transition-all cursor-pointer shadow-xs"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-200/40 dark:border-zinc-700/40">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Warna QR:</label>
                <div className="flex items-center gap-2.5 bg-white dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl p-2 shadow-xs">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-6 h-6 rounded-md border-0 cursor-pointer overflow-hidden p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">{fgColor}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Warna Latar:</label>
                <div className="flex items-center gap-2.5 bg-white dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl p-2 shadow-xs">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-6 h-6 rounded-md border-0 cursor-pointer overflow-hidden p-0 bg-transparent"
                  />
                  <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleDownload}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-[0.2em] active:scale-95"
          >
            <Download className="w-4 h-4" /> Unduh Gambar QR
          </motion.button>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="rounded-3xl bg-zinc-950 p-6 shadow-xl shadow-black/30 flex flex-col items-center justify-center min-h-[420px] border border-zinc-800/80 relative">
            <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pratinjau QR</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              </div>
              <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider">
                {showFrame ? 'Format Poster' : 'Format Polos'}
              </span>
            </div>

            <div className="max-w-full overflow-hidden flex items-center justify-center bg-white rounded-2xl p-4 shadow-2xl">
              <canvas
                ref={compositeCanvasRef}
                className="max-h-[380px] max-w-full object-contain block"
              />
            </div>
            
            <p className="mt-6 text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em]">
              Pindai dengan kamera ponsel atau scanner QR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
