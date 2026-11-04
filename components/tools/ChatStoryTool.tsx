'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ChatList from './ChatList';
import PrincessRoom, { STORY_SCRIPT } from './PrincessRoom';
import FazrullRoom from './FazrullRoom';
import LockScreen from './LockScreen';
import SpamPrincessRoom from './SpamPrincessRoom';
import { Play, Pause, Save, RotateCcw, Volume2, VolumeX } from 'lucide-react';

type ScreenView = 'princess' | 'list' | 'fazrull' | 'ending-night' | 'ending-morning' | 'lockscreen' | 'spam-room';

export default function ChatStoryTool() {
  const [screen, setScreen] = useState<ScreenView>('princess');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [princessProgress, setPrincessProgress] = useState(0);
  const [fazrullProgress, setFazrullProgress] = useState(0);
  const [isMorning, setIsMorning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('fz_chat_progress');
      if (saved) setPrincessProgress(parseInt(saved));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handlePrincessFinish = () => {
    setScreen('list');
    setTimeout(() => setScreen('fazrull'), 2000);
  };

  const handleFazrullFinish = () => {
    setScreen('ending-night');
    setTimeout(() => setScreen('ending-morning'), 2500);
    setTimeout(() => setScreen('lockscreen'), 5000);
  };

  const handleUnlock = () => {
    setIsMorning(true);
    setScreen('list');
    setTimeout(() => setScreen('spam-room'), 2000);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPrincessProgress(0);
    setFazrullProgress(0);
    setIsMorning(false);
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
                <Play className="w-3.5 h-3.5" /> {princessProgress > 0 ? 'Lanjut' : 'Putar'}
              </button>
            )}
            <button onClick={handleReset} className="bg-white text-zinc-900 border border-zinc-300 px-3 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
          <div className="flex gap-2">
             <button onClick={() => { localStorage.setItem('fz_chat_progress', princessProgress.toString()); alert('Progres disimpan!'); }} className="bg-emerald-600 text-white px-3 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md">
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
             max={screen === 'princess' ? STORY_SCRIPT.length : 2} 
             value={screen === 'princess' ? princessProgress : fazrullProgress} 
             onChange={(e) => {
                const val = parseInt(e.target.value);
                if (screen === 'princess') setPrincessProgress(val);
                else setFazrullProgress(val);
             }} 
             className="flex-1 h-1.5 bg-zinc-300 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
           />
           <span className="text-[10px] font-bold text-zinc-500">{screen === 'princess' ? STORY_SCRIPT.length : 2}</span>
        </div>
      </div>

      <div className="w-full max-w-[400px] h-[80dvh] sm:h-[750px] bg-white rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl relative flex flex-col overflow-hidden">
        
        {screen === 'princess' && (
          <PrincessRoom 
            onFinish={handlePrincessFinish} 
            isPlaying={isPlaying} 
            isMuted={isMuted} 
            progress={princessProgress} 
            setProgress={setPrincessProgress} 
          />
        )}

        {screen === 'list' && (
          <ChatList 
            onOpenPrincess={() => {
              if (isMorning) setScreen('spam-room');
              else { setScreen('princess'); if (princessProgress < STORY_SCRIPT.length) setIsPlaying(true); }
            }}
            onOpenFazrull={() => {
              setScreen('fazrull');
              if (fazrullProgress < 2) setIsPlaying(true);
            }}
            princessPreview={isMorning ? "p" : (princessProgress > 0 ? "terakhir dilihat 22.31" : "ketik dan tahan pada chat untuk opsi")}
            fazrullPreview={fazrullProgress > 0 ? "gaskeunnn loginnkann!!" : "ketik dan tahan pada chat untuk opsi"}
            princessTime={isMorning ? "07.05" : "22.31"}
            fazrullTime={fazrullProgress > 0 ? "22.31" : "22.31"}
            princessUnread={isMorning}
            fazrullUnread={fazrullProgress === 0}
          />
        )}

        {screen === 'fazrull' && (
          <FazrullRoom 
            onFinish={handleFazrullFinish}
            isPlaying={isPlaying}
            isMuted={isMuted}
            progress={fazrullProgress}
            setProgress={setFazrullProgress}
          />
        )}

        {screen === 'spam-room' && (
          <SpamPrincessRoom onBack={() => setScreen('list')} />
        )}

        <AnimatePresence>
          {screen === 'ending-night' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center">
              <p className="text-white text-lg font-medium leading-relaxed mb-4">gua dan fazrull mabar emel sampe jam 3 pagi</p>
              <p className="text-gray-400 text-sm font-mono tracking-widest">03.00</p>
            </motion.div>
          )}

          {screen === 'ending-morning' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-black flex items-center justify-center">
              <p className="text-white text-4xl font-mono tracking-widest font-bold">09.10</p>
            </motion.div>
          )}

          {screen === 'lockscreen' && (
            <LockScreen onUnlock={handleUnlock} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
