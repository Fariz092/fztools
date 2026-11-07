'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link as LinkIcon, Search, Copy, Check, ShieldAlert, ExternalLink } from 'lucide-react';

export default function LinkExpanderTool() {
  const [inputUrl, setInputUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleExpand = async () => {
    if (!inputUrl.trim()) return;
    
    // Pastiin format URL valid
    let formattedUrl = inputUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setStatus('loading');
    setResultUrl('');
    setErrorMsg('');

    try {
      // Coba pakai API unshorten.me dulu
      const response = await fetch(`https://unshorten.me/api/v2/unshorten?url=${encodeURIComponent(formattedUrl)}`);
      const data = await response.json();

      if (data.success) {
        setResultUrl(data.resolved_url);
        setStatus('success');
      } else {
        throw new Error(data.error || 'Gagal melacak link ini.');
      }
    } catch (err) {
      // Kalau gagal, fallback pakai allorigins (ngecek redirect header)
      try {
        const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(formattedUrl)}`);
        const proxyData = await proxyRes.json();
        
        // Kadang allorigins ngasih status.url yang udah resolved
        if (proxyData.status && proxyData.status.url) {
          setResultUrl(proxyData.status.url);
          setStatus('success');
        } else {
          throw new Error('Link tidak bisa dilacak atau bukan shortlink yang valid.');
        }
      } catch (fallbackErr) {
        setStatus('error');
        setErrorMsg('Gagal melacak link. Pastiin linknya bener (contoh: bit.ly/xxxx).');
      }
    }
  };

  const handleCopy = () => {
    if (!resultUrl) return;
    navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 mb-12 shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-900 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg text-white">
             <LinkIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Link Expander</h2>
              <span className="inline-flex px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">Alat Baru</span>
            </div>
            <p className="text-sm text-zinc-400 font-medium mt-1">Lacak URL asli di balik shortlink (bit.ly, s.id, t.co, dll) tanpa harus klik iklannya.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Input Form */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Masukkan Shortlink:</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={inputUrl} 
              onChange={(e) => setInputUrl(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleExpand()}
              placeholder="Contoh: bit.ly/3xyzABC atau s.id/promo" 
              className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
            />
            <motion.button 
              onClick={handleExpand} 
              disabled={status === 'loading'}
              whileHover={{ y: -2 }} 
              whileTap={{ scale: 0.98 }} 
              className="px-8 py-4 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-[0.1em] disabled:opacity-50 shrink-0"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Mencari...
                </span>
              ) : (
                <><Search className="w-4 h-4" /> Lacak Link</>
              )}
            </motion.button>
          </div>
        </div>

        {/* Hasil Pelacakan */}
        {status === 'success' && resultUrl && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <Check className="w-5 h-5" /> Link Asli Ditemukan!
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-950 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
              <input type="text" readOnly value={resultUrl} className="flex-1 bg-transparent text-sm text-zinc-800 dark:text-zinc-200 outline-none truncate" />
              <button onClick={handleCopy} className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 transition-colors shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shrink-0">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-400">Gagal Melacak</p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">{errorMsg}</p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
