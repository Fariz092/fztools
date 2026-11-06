'use client';

import React from 'react';

interface LiquidGlassPillProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Liquid Glass Pill (Apple Control Center Style)
 * 
 * Efek:
 * 1. SVG Displacement Filter - bikin konten di belakang kaca "membelok" (refraction)
 * 2. Chromatic Aberration - tint merah/biru tipis di pinggir (khas kaca premium)
 * 3. Specular Highlight - kilau putih di atas kaca
 * 4. Inner Shadow Berlapis - bikin kaca keliatan tebal
 */
export function LiquidGlassPill({ children, className = '' }: LiquidGlassPillProps) {
  return (
    <>
      {/* SVG Filter (disembunyiin, cuma buat definisi) */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          {/* Filter utama: Displacement + Chromatic Aberration */}
          <filter id="liquid-glass-navbar-filter" x="-20%" y="-20%" width="140%" height="140%">
            {/* Noise buat displacement */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.008"
              numOctaves="2"
              seed="92"
              result="noise"
            />
            {/* Map noise ke displacement */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>

          {/* Filter chromatic aberration (tint merah-biru) */}
          <filter id="chromatic-shift" x="-10%" y="-10%" width="120%" height="120%">
            <feOffset in="SourceGraphic" dx="-1.5" dy="0" result="red-shift" />
            <feOffset in="SourceGraphic" dx="1.5" dy="0" result="blue-shift" />
            <feColorMatrix in="red-shift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-tinted" />
            <feColorMatrix in="blue-shift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-tinted" />
            <feBlend in="red-tinted" in2="SourceGraphic" mode="screen" result="red-overlay" />
            <feBlend in="red-overlay" in2="blue-tinted" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Container Liquid Glass */}
      <div className={`relative ${className}`}>
        {/* Layer 1: Backdrop blur + displacement filter (efek refraction) */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            filter: 'url(#liquid-glass-navbar-filter)',
          }}
        />

        {/* Layer 2: Specular highlight atas (::before khas Apple) */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[1.5px] rounded-full pointer-events-none"
          style={{
            width: '80%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Layer 3: Inner shadow berlapis (kaca tebal) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `
              inset 0 1px 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1),
              inset 0 0 10px 5px rgba(255, 255, 255, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.12)
            `,
          }}
        />

        {/* Layer 4: Chromatic aberration (tint merah-biru di pinggir) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            boxShadow: `
              inset -2px 0 4px rgba(255, 100, 100, 0.15),
              inset 2px 0 4px rgba(100, 100, 255, 0.15)
            `,
          }}
        />

        {/* Layer 5: Konten */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </>
  );
}
