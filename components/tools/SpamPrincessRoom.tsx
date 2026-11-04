'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, MessageBubble, Keyboard } from './ChatUI';

const SPAM_SCRIPT: Omit<Message, 'id'>[] = [
  { sender: 'them', type: 'text', content: "p", time: '06.45' },
  { sender: 'them', type: 'text', content: "p", time: '06.45' },
  { sender: 'them', type: 'text', content: "p", time: '06.45' },
  { sender: 'them', type: 'text', content: "p", time: '06.45' },
  { sender: 'them', type: 'text', content: "p", time: '06.45' },
  { sender: 'them', type: 'text', content: "sayankkk", time: '06.46' },
  { sender: 'them', type: 'text', content: "kemana sih,,", time: '06.50' },
  { sender: 'them', type: 'text', content: "tau ah males", time: '07.05' },
];

export default function SpamPrincessRoom({ onBack }: { onBack: () => void }) {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isOffline, setIsOffline] = useState(true);

  useEffect(() => {
    // Langsung tampilkan semua pesan spam
    const history = SPAM_SCRIPT.map((msg, i) => ({ ...msg, id: Date.now() + i }));
    setDisplayedMessages(history);
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-3xl px-3 py-2.5 flex items-center justify-between border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-6 h-6 text-black" strokeWidth={2.5} /></button>
          <div className="relative w-10 h-10 rounded-full bg-gray-300">
             <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover rounded-full" />
             {/* Titik hijau hilang karena offline */}
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-black leading-tight">MyPrincess💖</span>
            <div className="h-[16px] overflow-hidden">
              <span className="text-[12px] font-medium text-gray-600 leading-tight block">
                terakhir dilihat 07.12
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-black">
          <Video className="w-6 h-6" strokeWidth={1.5} />
          <Phone className="w-5 h-5" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-[70px] relative scroll-smooth bg-[#EFEAE2]" style={{ backgroundImage: 'url("/background-wa.png")', backgroundSize: 'cover' }}>
        <div className="flex justify-center mb-4">
          <span className="bg-[#E2DCD3]/90 text-[#5E5E5E] text-[11px] font-semibold px-3 py-1 rounded-full">5 November 2026</span>
        </div>
        {displayedMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isVnPlaying={false} vnProgress={0} vnDurationText="" toggleVoiceNote={() => {}} setActiveImage={() => {}} />
        ))}
      </div>

      <div className="bg-[#F6F6F6] p-1.5 flex items-end gap-2 z-30 shrink-0 border-t border-gray-200">
        <div className="w-[36px] h-[36px] flex items-center justify-center shrink-0 text-gray-600"><Plus className="w-6 h-6" strokeWidth={1.5} /></div>
        <div className="flex-1 bg-white rounded-3xl flex items-end px-2 py-1 border border-gray-300 min-h-[36px]">
          <span className="text-[14px] font-medium text-gray-400 py-1 pl-1">Ketik pesan</span>
        </div>
      </div>
      
      <Keyboard activeKey={null} touches={[]} isEmoji={false} onEmojiClick={() => {}} />
    </>
  );
}
