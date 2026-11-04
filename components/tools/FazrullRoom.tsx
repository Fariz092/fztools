'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, Pause, Bell, Send, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, MessageBubble, Keyboard } from './ChatUI';

const FAZRULL_SCRIPT: Omit<Message, 'id'>[] = [
  { sender: 'me', type: 'text', content: "p, mabar zrull", time: '22.31' },
  { sender: 'them', type: 'text', content: "gaskeunnn loginnkann!!", time: '22.31' },
];

export default function FazrullRoom({ onFinish, isPlaying, isMuted, progress, setProgress }: any) {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [typingSender, setTypingSender] = useState<'me' | 'them' | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [touches, setTouches] = useState<{id: number, key: string}[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancelRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentIdxRef = useRef(progress);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (progress !== currentIdxRef.current || !hasMounted.current) {
      currentIdxRef.current = progress;
      const history = FAZRULL_SCRIPT.slice(0, progress).map((msg, i) => ({
        ...msg, id: Date.now() + i, status: 'read' as any
      }));
      setDisplayedMessages(history);
      
      if (progress === FAZRULL_SCRIPT.length) {
        const timer = setTimeout(() => setIsOffline(true), 0);
        return () => clearTimeout(timer);
      }
      hasMounted.current = true;
    }
  }, [progress]);

  const initAudio = () => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  };

  const playSfx = (type: 'type' | 'send' | 'notif') => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);

    if (type === 'type') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'send') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(400, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'notif') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px'; 
      const scrollH = textareaRef.current.scrollHeight;
      if (scrollH > 24) textareaRef.current.style.height = `${scrollH}px`;
    }
  }, [inputText]);

  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [displayedMessages, typingSender, isOffline]);

  const triggerTouch = (key: string) => {
    const id = Date.now() + Math.random();
    setTouches(prev => [...prev, { id, key }]);
    setTimeout(() => setTouches(prev => prev.filter(t => t.id !== id)), 300);
  };

  useEffect(() => {
    if (!isPlaying) { cancelRef.current = true; return; }
    cancelRef.current = false;
    initAudio();

    const runSequence = async () => {
      setInputText(''); setTypingSender(null);
      await new Promise(r => setTimeout(r, 500));

      for (let i = currentIdxRef.current; i < FAZRULL_SCRIPT.length; i++) {
        if (cancelRef.current) return;
        const msg = FAZRULL_SCRIPT[i];
        const msgId = Date.now() + i;

        if (msg.sender === 'them') {
          setTypingSender('them');
          await new Promise(r => setTimeout(r, 1800)); 
          if (cancelRef.current) return;
          setTypingSender(null);
          
          setDisplayedMessages(prev => [...prev, { ...msg, id: msgId }]);
          playSfx('notif');
          await new Promise(r => setTimeout(r, 1000));
        } else {
          setTypingSender('me');
          const text = msg.content;
          
          for (let j = 0; j <= text.length; j++) {
            if (cancelRef.current) return;
            const char = text[j - 1];
            if (char && char !== ' ') {
              setActiveKey(char.toLowerCase());
              triggerTouch(char.toLowerCase());
              playSfx('type');
            } else {
              setActiveKey(null);
            }
            setInputText(text.slice(0, j));
            await new Promise(r => setTimeout(r, Math.floor(Math.random() * 40) + 50)); 
          }
          
          setActiveKey(null);
          await new Promise(r => setTimeout(r, 400));
          if (cancelRef.current) return;
          
          setTypingSender(null);
          setDisplayedMessages(prev => [...prev, { ...msg, id: msgId, status: 'sent' as any }]);
          playSfx('send');
          setInputText('');
          if (textareaRef.current) textareaRef.current.style.height = '24px';
          
          await new Promise(r => setTimeout(r, 2000));
          setDisplayedMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' } : m));
          await new Promise(r => setTimeout(r, 1000));
        }
        
        if (!cancelRef.current) {
           currentIdxRef.current = i + 1;
           setProgress(i + 1);
        }
      }
      
      if (!cancelRef.current) {
        // JIKA CHAT SELESAI, TUNGGU SEBENTAR LALU FINISH
        await new Promise(r => setTimeout(r, 2000));
        setIsOffline(true);
        await new Promise(r => setTimeout(r, 2000));
        onFinish();
      }
    };

    runSequence();
    return () => { cancelRef.current = true; };
  }, [isPlaying, isMuted]);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-3xl px-3 py-2.5 flex items-center justify-between border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onFinish}><ChevronLeft className="w-6 h-6 text-black" strokeWidth={2.5} /></button>
          <div className="relative w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="#8E8E93" className="w-7 h-7 mt-2"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
             {!isOffline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full transition-all duration-300"></div>}
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-black leading-tight">Fazrull</span>
            <div className="h-[16px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={isOffline ? 'offline' : typingSender === 'them' ? 'typing' : 'online'}
                  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-[12px] font-medium text-gray-600 leading-tight block"
                >
                  {isOffline ? 'terakhir dilihat 22.31' : typingSender === 'them' ? 'sedang mengetik...' : 'Online'}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-black">
          <Video className="w-6 h-6" strokeWidth={1.5} />
          <Phone className="w-5 h-5" strokeWidth={1.5} />
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 pt-[70px] relative scroll-smooth bg-[#EFEAE2]" style={{ backgroundImage: 'url("/background-wa.png")', backgroundSize: 'cover' }}>
        <div className="flex justify-center mb-4">
          <span className="bg-[#E2DCD3]/90 text-[#5E5E5E] text-[11px] font-semibold px-3 py-1 rounded-full">4 November 2026</span>
        </div>
        {displayedMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isVnPlaying={false} vnProgress={0} vnDurationText="" toggleVoiceNote={() => {}} setActiveImage={() => {}} />
        ))}
        {typingSender === 'them' && (
          <div className="flex justify-start mb-2 animate-in fade-in">
            <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#F6F6F6] p-1.5 flex items-end gap-2 z-30 shrink-0 border-t border-gray-200">
        <div className="w-[36px] h-[36px] flex items-center justify-center shrink-0 text-gray-600"><Plus className="w-6 h-6" strokeWidth={1.5} /></div>
        <div className="flex-1 bg-white rounded-3xl flex items-end px-2 py-1 border border-gray-300 min-h-[36px] relative">
          {inputText === '' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-gray-400 pointer-events-none">Ketik pesan</span>}
          <textarea ref={textareaRef} value={inputText} readOnly rows={1} className="flex-1 bg-transparent outline-none text-[14px] font-medium text-black resize-none max-h-[80px] overflow-y-auto leading-tight relative z-10 py-1" style={{ height: '24px' }} />
          <div className="flex items-center gap-2 shrink-0 pl-2 pb-1">
            {inputText.trim() === '' ? (
              <><Camera className="w-[20px] h-[20px] text-gray-500" strokeWidth={1.5} /><Mic className="w-[20px] h-[20px] text-gray-500" strokeWidth={1.5} /></>
            ) : (
              <button className="w-7 h-7 bg-[#00A884] rounded-full flex items-center justify-center animate-in zoom-in duration-200"><Send className="w-3.5 h-3.5 text-white -ml-0.5" fill="currentColor" /></button>
            )}
          </div>
        </div>
      </div>
      
      <Keyboard activeKey={activeKey} touches={touches} isEmoji={false} onEmojiClick={() => {}} />
    </>
  );
}
