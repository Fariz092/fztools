'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, MessageBubble, Keyboard } from './ChatUI';

const FAZRULL_SCRIPT: Omit<Message, 'id'>[] = [
  { sender: 'me', type: 'text', content: "p, mabar zrull", time: '22.31' },
  { sender: 'them', type: 'text', content: "gaskeunnn loginnkann!!", time: '22.31' },
];

export default function FazrullRoom({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const hasPlayed = useRef(false);

  useEffect(() => {
    // Cegah double trigger kalau di-render ulang
    if (hasPlayed.current) return;
    hasPlayed.current = true;

    const play = async () => {
      setMessages([]);
      setIsOffline(false);
      await new Promise(r => setTimeout(r, 1000));
      
      // Cowok ngetik (lo)
      setMessages([{ ...FAZRULL_SCRIPT[0], id: Date.now(), status: 'sent' }]);
      await new Promise(r => setTimeout(r, 1500));
      
      // Fazrull ngetik
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1500));
      setIsTyping(false);
      
      // Fazrull bales
      setMessages(prev => [...prev, { ...FAZRULL_SCRIPT[1], id: Date.now() + 1, status: 'read' }]);
      await new Promise(r => setTimeout(r, 2000));
      
      // Fazrull Offline
      setIsOffline(true);
    };
    play();
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-3xl px-3 py-2.5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-6 h-6 text-[#007AFF]" strokeWidth={2.5} /></button>
          <div className="relative w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="#8E8E93" className="w-7 h-7 mt-2"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
             {!isOffline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full transition-all duration-300"></div>}
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-black leading-tight">Fazrull</span>
            <div className="h-[16px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={isOffline ? 'offline' : isTyping ? 'typing' : 'online'}
                  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-[12px] font-medium text-gray-500 leading-tight block"
                >
                  {isOffline ? 'terakhir dilihat 22.31' : isTyping ? 'sedang mengetik...' : 'Online'}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#007AFF]">
          <Video className="w-6 h-6" strokeWidth={1.5} />
          <Phone className="w-5 h-5" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-[70px] relative scroll-smooth bg-[#EFEAE2]" style={{ backgroundImage: 'url("/background-wa.png")', backgroundSize: 'cover' }}>
        <div className="flex justify-center mb-4">
          <span className="bg-[#E2DCD3]/90 text-[#5E5E5E] text-[11px] font-semibold px-3 py-1 rounded-full">4 November 2026</span>
        </div>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isVnPlaying={false} vnProgress={0} vnDurationText="" toggleVoiceNote={() => {}} setActiveImage={() => {}} />
        ))}
        {isTyping && (
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
        <div className="flex-1 bg-white rounded-3xl flex items-end px-2 py-1 border border-gray-300 min-h-[36px]">
          <span className="text-[14px] font-medium text-gray-400 py-1 pl-1">Ketik pesan</span>
        </div>
      </div>
      <Keyboard activeKey={null} touches={[]} onEmojiClick={() => {}} isEmoji={false} />
    </>
  );
}
