'use client';

import React, { useState, useEffect } from 'react';
import { Network, Calculator, ArrowRight } from 'lucide-react';

// Helper: Konversi IP ke Integer
const ipToInt = (ip: string) => ip.split('.').reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0;
// Helper: Konversi Integer ke IP
const intToIp = (int: number) => [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');

export default function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.10');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Fungsi Kalkulasi
  const calculate = () => {
    setError('');
    // Validasi IP
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip)) {
      setError('Format IP Address tidak valid! (Contoh: 192.168.1.1)');
      return;
    }
    if (cidr < 0 || cidr > 32) {
      setError('CIDR harus di antara 0 dan 32.');
      return;
    }

    const ipInt = ipToInt(ip);
    const maskInt = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | (~maskInt)) >>> 0;
    const wildcardInt = (~maskInt) >>> 0;
    const totalHosts = cidr === 32 ? 1 : cidr === 31 ? 2 : (1 << (32 - cidr)) - 2;
    
    const firstHostInt = totalHosts > 0 ? networkInt + 1 : networkInt;
    const lastHostInt = totalHosts > 0 ? broadcastInt - 1 : broadcastInt;

    setResult({
      network: intToIp(networkInt),
      broadcast: intToIp(broadcastInt),
      mask: intToIp(maskInt),
      wildcard: intToIp(wildcardInt),
      firstHost: intToIp(firstHostInt),
      lastHost: intToIp(lastHostInt),
      totalHosts: totalHosts < 0 ? 0 : totalHosts,
      cidr: cidr
    });
  };

  // Hitung otomatis saat pertama kali dibuka
  useEffect(() => {
    calculate();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* INPUT SECTION */}
      <div className="modern-glass-card p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <Network className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">IP Subnet Calculator</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Hitung Network ID, Broadcast, dan Host Range secara instan.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">IP Address</label>
            <input 
              type="text" 
              value={ip} 
              onChange={(e) => setIp(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="192.168.1.1"
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">CIDR ( / )</label>
            <input 
              type="number" 
              min="0" max="32"
              value={cidr} 
              onChange={(e) => setCidr(parseInt(e.target.value) || 0)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button 
            onClick={calculate}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" /> Hitung
          </button>
        </div>

        {error && <p className="mt-4 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg">{error}</p>}
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="modern-glass-card p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Network Address</p>
            <p className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{result.network} / {result.cidr}</p>
          </div>

          <div className="modern-glass-card p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Broadcast Address</p>
            <p className="text-xl font-mono font-bold text-rose-600 dark:text-rose-400">{result.broadcast}</p>
          </div>

          <div className="modern-glass-card p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Subnet Mask</p>
            <p className="text-xl font-mono font-bold text-zinc-900 dark:text-white">{result.mask}</p>
          </div>

          <div className="modern-glass-card p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Wildcard Mask</p>
            <p className="text-xl font-mono font-bold text-zinc-900 dark:text-white">{result.wildcard}</p>
          </div>

          <div className="modern-glass-card p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 sm:col-span-2 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-900/10">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Usable Host Range</p>
            <div className="flex items-center gap-2 text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <span>{result.firstHost}</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
              <span>{result.lastHost}</span>
            </div>
          </div>

          <div className="modern-glass-card p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 sm:col-span-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Usable Hosts</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">{result.totalHosts.toLocaleString()} <span className="text-sm font-medium text-zinc-500">Host</span></p>
          </div>

        </div>
      )}
    </div>
  );
}
