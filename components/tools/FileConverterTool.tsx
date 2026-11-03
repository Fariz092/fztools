'use client';

import React, { useState, useRef } from 'react';
import { 
  ArrowRightLeft, 
  Download, 
  Check, 
  Copy, 
  FileImage,
  ImageIcon, 
  Sliders, 
  Code, 
  FileText, 
  RefreshCw,
  Zap,
  CloudUpload
} from 'lucide-react';
import { saveHistoryItem } from '@/lib/history-service';
import { motion, AnimatePresence } from 'motion/react';

export default function FileConverterTool() {
  const [activeSubTab, setActiveSubTab] = useState<'image' | 'base64' | 'data'>('image');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('image/webp');
  const [quality, setQuality] = useState<number>(0.85);
  const [scale, setScale] = useState<number>(1);
  const [converting, setConverting] = useState<boolean>(false);
  const [convertedResult, setConvertedResult] = useState<{
    url: string;
    format: string;
    sizeKb: number;
    dimensions: string;
  } | null>(null);

  const [base64Input, setBase64Input] = useState<string>('');
  const [base64Output, setBase64Output] = useState<string>('');
  const [copiedBase64, setCopiedBase64] = useState<boolean>(false);

  const [dataInput, setDataInput] = useState<string>('[\n  {"nama": "Budi", "kota": "Jakarta", "peran": "Developer"},\n  {"nama": "Siti", "kota": "Bandung", "peran": "Designer"}\n]');
  const [dataOutput, setDataOutput] = useState<string>('');
  const [dataMode, setDataMode] = useState<'json2csv' | 'csv2json'>('json2csv');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setConvertedResult(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewSrc(result);
        setBase64Output(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageConversion = () => {
    if (!previewSrc || !selectedFile) return;
    setConverting(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const targetW = Math.round(img.naturalWidth * scale);
      const targetH = Math.round(img.naturalHeight * scale);
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setConverting(false);
        return;
      }

      if (targetFormat === 'image/jpeg' || targetFormat === 'image/bmp') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);

      const mimeType = targetFormat;
      const convertedDataUrl = canvas.toDataURL(mimeType, quality);

      const stringLength = convertedDataUrl.length - 'data:image/png;base64,'.length;
      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383;
      const sizeKb = Math.round(sizeInBytes / 1024);

      const ext = mimeType.split('/')[1] || 'png';
      setConvertedResult({
        url: convertedDataUrl,
        format: ext,
        sizeKb,
        dimensions: `${targetW} x ${targetH} px`,
      });

      try {
        await saveHistoryItem({
          toolType: 'converter',
          title: `Konversi ${selectedFile.name} -> .${ext.toUpperCase()}`,
          details: `Ukuran: ${sizeKb} KB | Dimensi: ${targetW}x${targetH}px | Kualitas: ${Math.round(quality * 100)}%`,
          previewUrl: convertedDataUrl,
          fileFormat: ext,
        });
      } catch (err) {
        console.warn(err);
      } finally {
        setConverting(false);
      }
    };
    img.src = previewSrc;
  };

  const handleDownloadConverted = () => {
    if (!convertedResult) return;
    const a = document.createElement('a');
    a.href = convertedResult.url;
    const baseName = selectedFile ? selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'converted' : 'image';
    a.download = `${baseName}_fztools.${convertedResult.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleConvertData = () => {
    try {
      if (dataMode === 'json2csv') {
        const json = JSON.parse(dataInput);
        if (!Array.isArray(json) || json.length === 0) {
          setDataOutput('Kesalahan: Masukkan JSON array valid.');
          return;
        }
        const headers = Object.keys(json[0]);
        const csvRows = [
          headers.join(','),
          ...json.map((row) =>
            headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
          ),
        ];
        setDataOutput(csvRows.join('\n'));
      } else {
        const lines = dataInput.trim().split('\n');
        if (lines.length < 2) {
          setDataOutput('Kesalahan: CSV memerlukan header dan baris data.');
          return;
        }
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const result = lines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = values[i] || '';
          });
          return obj;
        });
        setDataOutput(JSON.stringify(result, null, 2));
      }
    } catch (e: unknown) {
      setDataOutput(`Gagal memproses data: ${e instanceof Error ? e.message : 'Format input tidak sesuai'}`);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-12 shadow-xl shadow-zinc-200/20 dark:shadow-black/20 border border-zinc-200/80 dark:border-zinc-800/80">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 flex items-center justify-center shadow-xs">
            <ArrowRightLeft className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Konverter File Instan
              </h2>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                Lokal Client-Side
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
              Konversi format gambar instan, enkripsi Base64, dan manipulasi data JSON/CSV berkecepatan tinggi.
            </p>
          </div>
        </div>

        <div className="flex p-1 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
          <button
            onClick={() => setActiveSubTab('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'image' 
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <FileImage className="w-3.5 h-3.5" />
            <span>Gambar</span>
          </button>
          <button
            onClick={() => setActiveSubTab('base64')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'base64' 
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Base64</span>
          </button>
          <button
            onClick={() => setActiveSubTab('data')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'data' 
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Data</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'image' && (
          <motion.div
            key="image"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-5 space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 hover:border-indigo-500/50 p-8 rounded-2xl text-center cursor-pointer transition-all shadow-sm"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center">
                  <CloudUpload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                  {selectedFile ? selectedFile.name : 'Pilih Berkas Gambar'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Mendukung PNG, JPG, WEBP, GIF, dan BMP
                </p>
                {selectedFile && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                    <Check className="w-3 h-3" />
                    Ukuran: {Math.round(selectedFile.size / 1024)} KB
                  </div>
                )}
              </div>

              <div className="p-5 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-indigo-500" />
                    Format Hasil
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'WEBP', mime: 'image/webp' },
                      { label: 'PNG', mime: 'image/png' },
                      { label: 'JPEG', mime: 'image/jpeg' },
                      { label: 'GIF', mime: 'image/gif' },
                      { label: 'BMP', mime: 'image/bmp' },
                      { label: 'ICO', mime: 'image/x-icon' },
                    ].map((fmt) => (
                      <button
                        key={fmt.mime}
                        onClick={() => {
                          setTargetFormat(fmt.mime);
                          setConvertedResult(null);
                        }}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          targetFormat === fmt.mime
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-indigo-400'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-2">
                      <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Kualitas Kompresi</span>
                      <span className="tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                        {Math.round(quality * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-2">
                      <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Skala Dimensi</span>
                      <span className="tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                        {Math.round(scale * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="2.0"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>

                <button
                  onClick={processImageConversion}
                  disabled={!selectedFile || converting}
                  className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  {converting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> 
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="w-4 h-4" />
                      <span>Konversi Gambar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800/80 rounded-3xl min-h-[480px] flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                      Pratinjau Hasil
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  {convertedResult && (
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md border border-emerald-500/30">
                      BERHASIL
                    </span>
                  )}
                </div>

                <div className="flex-1 flex items-center justify-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 my-6 overflow-hidden p-4">
                  {convertedResult ? (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={convertedResult.url}
                      alt="Hasil konversi"
                      className="max-h-[380px] max-w-full object-contain rounded-xl shadow-2xl"
                    />
                  ) : previewSrc ? (
                    <img
                      src={previewSrc}
                      alt="Pratinjau awal"
                      className="max-h-[380px] max-w-full object-contain opacity-40 blur-[1px]"
                    />
                  ) : (
                    <div className="text-center px-4">
                      <ImageIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                      <p className="text-xs font-bold text-zinc-400 mb-1">Belum ada berkas dipilih</p>
                      <p className="text-[10px] text-zinc-600 font-medium">
                        Pilih gambar di panel sebelah kiri untuk konversi instan.
                      </p>
                    </div>
                  )}
                </div>

                {convertedResult && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Informasi Berkas</div>
                        <div className="flex items-center gap-3 text-xs font-bold text-white">
                          <span className="tabular-nums">{convertedResult.sizeKb} KB</span>
                          <span className="text-zinc-700">•</span>
                          <span>{convertedResult.dimensions}</span>
                          {selectedFile && (
                            <span className="text-emerald-400 text-[10px]">
                              (Hemat {Math.max(0, Math.round((1 - convertedResult.sizeKb / (selectedFile.size / 1024)) * 100))}%)
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleDownloadConverted}
                        className="px-5 py-2.5 bg-white text-zinc-900 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-zinc-100 transition-all cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh Berkas
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'base64' && (
          <motion.div
            key="base64"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="p-6 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                  <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Gambar ke Base64</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">Encode gambar menjadi string data URI.</p>
                </div>
              </div>
              <textarea
                value={base64Output}
                readOnly
                placeholder="Pilih gambar di tab Gambar untuk melihat Base64..."
                className="flex-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 focus:outline-none mb-4 resize-none min-h-[180px] shadow-sm"
              />
              <button
                onClick={() => {
                  if (base64Output) {
                    navigator.clipboard.writeText(base64Output);
                    setCopiedBase64(true);
                    setTimeout(() => setCopiedBase64(false), 2000);
                  }
                }}
                disabled={!base64Output}
                className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {copiedBase64 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBase64 ? 'Tersalin' : 'Salin String Base64'}
              </button>
            </div>

            <div className="p-6 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                  <FileImage className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Base64 ke Gambar</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">Decode string Base64 kembali ke format gambar.</p>
                </div>
              </div>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Tempel data:image/... di sini..."
                className="flex-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 focus:outline-none mb-4 resize-none min-h-[180px] shadow-sm"
              />
              {base64Input.startsWith('data:image') && (
                <div className="mb-4 p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center">
                  <img src={base64Input} alt="Preview" className="max-h-20 object-contain shadow-md" />
                </div>
              )}
              <button
                onClick={() => {
                  if (base64Input.startsWith('data:image')) {
                    const a = document.createElement('a');
                    a.href = base64Input;
                    a.download = `decoded_${Date.now()}.png`;
                    a.click();
                  }
                }}
                disabled={!base64Input.startsWith('data:image')}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-indigo-500 disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Gambar PNG
              </button>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'data' && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setDataMode('json2csv'); setDataOutput(''); }}
                className={`px-5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  dataMode === 'json2csv' 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm' 
                    : 'bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                JSON ➔ CSV
              </button>
              <ArrowRightLeft className="w-4 h-4 text-zinc-400" />
              <button
                onClick={() => { setDataMode('csv2json'); setDataOutput(''); }}
                className={`px-5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  dataMode === 'csv2json' 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm' 
                    : 'bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                CSV ➔ JSON
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-3">Input Data Raw</label>
                <textarea
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-900 dark:text-white focus:outline-none min-h-[260px] resize-none shadow-sm"
                />
                <button
                  onClick={handleConvertData}
                  className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Konversi Data
                </button>
              </div>

              <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-3">Hasil Output</label>
                <textarea
                  value={dataOutput}
                  readOnly
                  placeholder="Hasil konversi akan tampil di sini..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:outline-none min-h-[260px] resize-none"
                />
                {dataOutput && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(dataOutput)}
                      className="py-2.5 bg-zinc-800 text-white rounded-xl font-bold text-xs hover:bg-zinc-700 transition-all cursor-pointer"
                    >
                      Salin Teks
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([dataOutput], { type: dataMode === 'json2csv' ? 'text/csv' : 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `output_${Date.now()}.${dataMode === 'json2csv' ? 'csv' : 'json'}`;
                        a.click();
                      }}
                      className="py-2.5 bg-white text-zinc-900 rounded-xl font-bold text-xs hover:bg-zinc-100 transition-all cursor-pointer shadow-sm"
                    >
                      Unduh Berkas
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
