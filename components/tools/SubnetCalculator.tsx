'use client';

import React, { useState } from 'react';
import { Network, Calculator, ArrowRight, Loader2, Binary, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Helper: Konversi IP ke Integer
const ipToInt = (ip: string) => ip.split('.').reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0;
// Helper: Konversi Integer ke IP
const intToIp = (int: number) => [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
// Helper: Konversi Integer ke Binary string (32-bit)
const intToBinary = (int: number) => int.toString(2).padStart(32, '0').match(/.{1,8}/g)?.join('.') || '';

// Fungsi murni buat kalkulasi
const calculateSubnet = (ip: string, cidr: number) => {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  if (!ipRegex.test(ip)) return { error: 'Format IP Address tidak valid! (Contoh: 192.168.1.1)' };
  if (cidr < 0 || cidr > 32) return { error: 'CIDR harus di antara 0 dan 32.' };

  const ipInt = ipToInt(ip);
  const maskInt = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;
  const totalHosts = cidr === 32 ? 1 : cidr === 31 ? 2 : (1 << (32 - cidr)) - 2;
  
  const firstHostInt = totalHosts > 0 ? networkInt + 1 : networkInt;
  const lastHostInt = totalHosts > 0 ? broadcastInt - 1 : broadcastInt;

  return {
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    mask: intToIp(maskInt),
    wildcard: intToIp(wildcardInt),
    firstHost: intToIp(firstHostInt),
    lastHost: intToIp(lastHostInt),
    totalHosts: totalHosts < 0 ? 0 : totalHosts,
    cidr: cidr,
    binaryIp: intToBinary(ipInt),
    binaryMask: intToBinary(maskInt),
    binaryNetwork: intToBinary(networkInt),
  };
};

export default function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.10');
  const [cidr, setCidr] = useState(24);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [result, setResult] = useState<any>(() => calculateSubnet('192.168.1.10', 24));

  const handleCalculate = () => {
    setIsCalculating(true);
    setError('');
    
    setTimeout(() => {
      const res = calculateSubnet(ip, cidr);
      if (res.error) {
        setError(res.error);
        setResult(null);
      } else {
        setResult(res);
      }
      setIsCalculating(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Network className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-mono)' }}>
            IP_Subnet_Calc<span className="text-emerald-500 animate-pulse">_</span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono">[ IPv4 Network Addressing Tool v1.0 ]</p>
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        {/* Efek Grid Halus di background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-2 block font-mono">
              &gt; Input_IP_Address
            </label>
            <input 
              type="text" 
              value={ip} 
              onChange={(e) => setIp(e.target.value)}
              className="w-full bg-black/50 border border-zinc-700 focus:border-emerald-500 rounded-lg px-4 py-3 text-lg font-mono text-white outline-none transition-colors placeholder:text-zinc-600"
              placeholder="192.168.1.1"
            />
          </div>
          <div className="w-full md:w-32">
            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-2 block font-mono">
              &gt; CIDR
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">/</span>
              <input 
                type="number" 
                min="0" max="32"
                value={cidr} 
                onChange={(e) => setCidr(parseInt(e.target.value) || 0)}
                className="w-full bg-black/50 border border-zinc-700 focus:border-emerald-500 rounded-lg pl-8 pr-4 py-3 text-lg font-mono text-white outline-none transition-colors"
              />
            </div>
          </div>
          <button 
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-black font-bold font-mono text-sm rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> EXEC...</>
            ) : (
              <><Calculator className="w-4 h-4" /> CALCULATE</>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-mono">
            [!] ERROR: {error}
          </div>
        )}
      </div>

      {/* RESULT SECTION */}
      <AnimatePresence mode="wait">
        {result && !error && (
          <motion.div 
            key={result.network + result.cidr}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* BINARY REPRESENTATION */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-black/40 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Binary className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-widest">Binary Representation</h3>
              </div>
              <div className="space-y-2 font-mono text-sm overflow-x-auto whitespace-nowrap pb-2">
                <div className="flex text-zinc-400">
                  <span className="w-24 text-emerald-500/70">IP      :</span>
                  <span>{result.binaryIp}</span>
                </div>
                <div className="flex text-zinc-400">
                  <span className="w-24 text-emerald-500/70">MASK    :</span>
                  <span className="text-cyan-400">{result.binaryMask}</span>
                </div>
                <div className="flex text-white">
                  <span className="w-24 text-emerald-500/70">NETWORK :</span>
                  <span className="text-emerald-400">{result.binaryNetwork}</span>
                </div>
              </div>
            </motion.div>

            {/* MAIN RESULTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <p className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1">Network Address</p>
                <p className="text-2xl font-mono font-bold text-emerald-400">{result.network} <span className="text-zinc-600">/</span> {result.cidr}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                <p className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1">Broadcast Address</p>
                <p className="text-2xl font-mono font-bold text-rose-400">{result.broadcast}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1">Subnet Mask</p>
                <p className="text-xl font-mono font-bold text-white">{result.mask}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1">Wildcard Mask</p>
                <p className="text-xl font-mono font-bold text-white">{result.wildcard}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }} className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl md:col-span-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent"></div>
                <p className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1">Usable Host Range</p>
                <div className="flex items-center gap-3 text-xl md:text-2xl font-mono font-bold text-white">
                  <span className="text-emerald-400">{result.firstHost}</span>
                  <ArrowRight className="w-5 h-5 text-zinc-600" />
                  <span className="text-emerald-400">{result.lastHost}</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl md:col-span-2 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest mb-1">Total Usable Hosts</p>
                  <p className="text-3xl font-mono font-bold text-white">{result.totalHosts.toLocaleString()}</p>
                </div>
                <Activity className="w-10 h-10 text-zinc-800" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
