'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

export default function TopProgressBar() {
  const pathname = usePathname();
  const [isShooting, setIsShooting] = useState(false);

  useEffect(() => {
    setIsShooting(true);

    // 3 putaran melesat (0.65s x 3 = ~1.95s) lalu fade-out
    const timer = setTimeout(() => {
      setIsShooting(false);
    }, 2100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="fixed top-0 inset-x-0 z-[99999] h-1 pointer-events-none overflow-visible">
      <AnimatePresence>
        {isShooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            {/* Jalur dasar penanda tipis */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-indigo-500/15" />

            {/* Balok laser gradasi kontras tinggi melesat 3 kali */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '180%' }}
              transition={{
                repeat: 2, // 1 awal + 2 ulangan = tepat 3 kali melesat
                duration: 0.65,
                ease: [0.3, 0, 0.2, 1],
              }}
              className="absolute top-0 h-1 w-[85%] bg-gradient-to-r from-transparent via-indigo-600 via-cyan-400 to-indigo-500 shadow-[0_1px_14px_rgba(6,182,212,0.9),0_0_24px_rgba(99,102,241,0.8)]"
            />

            {/* Titik pendar putih terang di kepala laser */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '180%' }}
              transition={{
                repeat: 2,
                duration: 0.65,
                ease: [0.3, 0, 0.2, 1],
              }}
              className="absolute top-0 right-0 h-1.5 w-32 bg-gradient-to-r from-cyan-300 via-white to-transparent blur-[0.8px] shadow-[0_0_12px_#ffffff,0_0_20px_rgba(6,182,212,1)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
