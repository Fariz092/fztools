'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

export default function TopProgressBar() {
  const pathname = usePathname();
  const [isShooting, setIsShooting] = useState(false);

  useEffect(() => {
    // Picu animasi melesat setiap kali rute berpindah
    setIsShooting(true);

    // 3 siklus melesat (0.62 detik x 3 = ~1.86 detik) + waktu transisi fade-out halus
    const timer = setTimeout(() => {
      setIsShooting(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="fixed top-0 inset-x-0 z-[99999] h-[3px] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {isShooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            {/* Jalur dasar tipis semi-transparan */}
            <div className="absolute inset-0 bg-indigo-500/10 dark:bg-white/5" />

            {/* Balok gradasi laser yang melesat 3 kali */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '180%' }}
              transition={{
                repeat: 2, // 1 awal + 2 perulangan = tepat 3 kali melesat
                duration: 0.62,
                ease: [0.35, 0, 0.25, 1],
              }}
              className="absolute inset-y-0 w-3/4 bg-gradient-to-r from-transparent via-indigo-500 via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.85)]"
            />

            {/* Ujung pendar kilau putih di kepala laser */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '180%' }}
              transition={{
                repeat: 2,
                duration: 0.62,
                ease: [0.35, 0, 0.25, 1],
              }}
              className="absolute top-0 right-0 w-24 h-full bg-gradient-to-r from-cyan-300 via-white to-transparent blur-[0.5px] shadow-[0_0_8px_#ffffff]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
