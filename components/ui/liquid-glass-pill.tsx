'use client';

import React from 'react';

interface LiquidGlassPillProps {
  children: React.ReactNode;
  className?: string;
}

export function LiquidGlassPill({ children, className = '' }: LiquidGlassPillProps) {
  return (
    <>
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="liquid-glass-navbar-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.005"
              numOctaves="2"
              seed="92"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className={`relative ${className}`}>
        {/* LAYER 1: SOFT BLUR BACKDROP (KACA BUROM) */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            backdropFilter: 'blur(28px) saturate(180%) brightness(1.05)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%) brightness(1.05)',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        />

        {/* LAYER 2: DISPLACEMENT FILTER (EFEK REFRACTION) */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          style={{
            filter: 'url(#liquid-glass-navbar-filter)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            mixBlendMode: 'overlay',
            opacity: 0.6,
          }}
        />

        {/* LAYER 3: SPECULAR HIGHLIGHT (KILAU ATAS) */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[1.5px] rounded-full pointer-events-none"
          style={{
            width: '80%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* LAYER 4: INNER SHADOW BERLAPIS (KACA TEBAL) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `
              inset 0 1px 0 rgba(255, 255, 255, 0.6),
              inset 0 -1px 0 rgba(255, 255, 255, 0.15),
              inset 0 0 12px 4px rgba(255, 255, 255, 0.35),
              0 8px 32px rgba(0, 0, 0, 0.15)
            `,
          }}
        />

        {/* LAYER 5: CHROMATIC ABERRATION (TINT MERAH-BIRU) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-50 mix-blend-overlay"
          style={{
            boxShadow: `
              inset -3px 0 6px rgba(255, 100, 100, 0.2),
              inset 3px 0 6px rgba(100, 100, 255, 0.2)
            `,
          }}
        />

        {/* LAYER 6: KONTEN */}
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}
