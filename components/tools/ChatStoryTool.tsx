'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ChatList from './ChatList';
import PrincessRoom, { STORY_SCRIPT } from './PrincessRoom';
import FazrullRoom from './FazrullRoom';
import { Play, Pause, Save, RotateCcw, Volume2, VolumeX } from 'lucide-react';

type ScreenView = 'princess' | 'list' | 'fazrull' | 'ending';

export default function ChatStoryTool() {
  const [screen, setScreen] = useState<ScreenView>('princess');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('fz_chat_progress');
      if (saved) setProgress(parseInt(saved));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handlePrincessFinish = () => {
    setScreen('list');
    setTimeout(() => setScreen('fazrull'), 2000);
  };

  const handleFazrullFinish = () => {
    setScreen('ending');
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    localStorage.removeItem('fz_chat_progress');
    setScreen('princess');
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 font-sans py-4">
      
      <div className="w-full max-w-[400px] flex flex-col gap-2 px-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {isPlaying ? (
              <button onClick={() => setIsPlaying(false)} className="bg-amber-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md">
                <Pause className="w-3.5 h-3.5" /> Pause
              </button>
            ) : (
              <button onClick={() => setIsPlaying(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md">
                <Play className="w-3.5 h-3.5" /> {progress > 0 ? 'Lanjut' : 'Putar'}
              </button>
            )}
            <button onClick={handleReset} className="bg-white text-zinc-900 border border-zinc-300 px-3 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
          <div className="flex gap-2">
             <button onClick={() => { localStorage.setItem('fz_chat_progress', progress.toString()); alert('Progres disimpan!'); }} className="bg-emerald-600 text-white px-3 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md">
               <Save className="w-3.5 h-3.5" /> Simpan
             </button>
             <button onClick={() => setIsMuted(!isMuted)} className="bg-zinc-800 text-white p-2 rounded-full shadow-md">
               {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
             </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-zinc-500">0</span>
           <input 
             type="range" 
             min="0" 
             max={STORY_SCRIPT.length} 
             value={progress} 
             onChange={(e) => setProgress(parseInt(e.target.value))} 
             className="flex-1 h-1.5 bg-zinc-300 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
           />
           <span className="text-[10px] font-bold text-zinc-500">{STORY_SCRIPT.length}</span>
        </div>
      </div>

      <div className="w-full max-w-[400px] h-[80dvh] sm:h-[750px] bg-white rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl relative flex flex-col overflow-hidden">
        
        {screen === 'princess' && (
          <PrincessRoom 
            onFinish={handlePrincessFinish} 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying} 
            isMuted={isMuted} 
            progress={progress} 
            setProgress={setProgress} 
          />
        )}

        {screen === 'list' && (
          <ChatList 
            onOpenPrincess={() => { setScreen('princess'); setIsPlaying(true); }} 
            onOpenFazrull={() => { setScreen('fazrull'); }} 
          />
        )}

        {screen === 'fazrull' && (
          <FazrullRoom onFinish={handleFazrullFinish} />
        )}

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
