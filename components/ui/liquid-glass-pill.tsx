'use client';

import React from 'react';

interface LiquidGlassPillProps {
  children: React.ReactNode;
  className?: string;
}

export function LiquidGlassPill({ children, className = '' }: LiquidGlassPillProps) {
  return (
    <div 
      className={`relative overflow-hidden rounded-full border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)] bg-white/40 dark:bg-zinc-900/50 backdrop-blur-3xl backdrop-saturate-150 ${className}`}
    >
      {/* Highlight Tipis di Atas (Specular Reflection) */}
      <div 
        className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
      />

      {/* Konten */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
