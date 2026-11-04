'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ChatList from './ChatList';
import PrincessRoom from './PrincessRoom';
import FazrullRoom from './FazrullRoom';

type ScreenView = 'list' | 'princess' | 'fazrull' | 'ending';

export default function ChatStoryTool() {
  const [screen, setScreen] = useState<ScreenView>('princess');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const startSequence = () => {
    setShowControls(false);
    setScreen('princess');
    setIsPlaying(true);
  };

  const handlePrincessFinish = () => {
    setScreen('list');
    setTimeout(() => setScreen('fazrull'), 2000);
  };

  const handleFazrullFinish = () => {
    setScreen('ending');
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 font-sans">
      
      {/* TOMBOL KONTROL (DI LUAR HP) */}
      {showControls && !isPlaying && (
        <button onClick={startSequence} className="bg-indigo-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"/></svg> Mulai Auto-Play
        </button>
      )}

      {/* FRAME HP */}
      <div className="w-full max-w-[400px] h-[85dvh] sm:h-[800px] bg-white rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl relative flex flex-col overflow-hidden">
        
        {screen === 'list' && (
          <ChatList 
            onOpenPrincess={() => {}} 
            onOpenFazrull={() => {}} 
          />
        )}

        {screen === 'princess' && (
          <PrincessRoom onFinish={handlePrincessFinish} />
        )}

        {screen === 'fazrull' && (
          <FazrullRoom onFinish={handleFazrullFinish} />
        )}

        {/* LAYAR ENDING */}
        <AnimatePresence>
          {screen === 'ending' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.p 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
                className="text-white text-lg font-medium leading-relaxed mb-4"
              >
                gua dan fazrull mabar emel sampe jam 3 pagi
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2 }}
                className="text-gray-400 text-sm font-mono tracking-widest"
              >
                03.00
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
