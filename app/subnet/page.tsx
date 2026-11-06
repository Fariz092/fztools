'use client';

import AppShell from '@/components/AppShell';
import SubnetCalculator from '@/components/tools/SubnetCalculator';
import BackButton from '@/components/BackButton';
import { Network } from 'lucide-react';

export default function SubnetPage() {
  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Network className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.25em]">TJKT Tool</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
            Subnet<br />Calculator<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Kalkulator subnet IPv4 untuk menghitung Network ID, Broadcast, Subnet Mask, dan Host Range secara instan. Dirancang khusus untuk siswa TJKT.
          </p>
        </div>

        <SubnetCalculator />
      </div>
    </AppShell>
  );
}
