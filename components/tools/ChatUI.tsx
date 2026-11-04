'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, Pause, ChevronUp, Delete, Globe, Smile, CheckCheck, Send } from 'lucide-react';

export type Sender = 'me' | 'them';
export type MessageType = 'text' | 'image' | 'voice';
export type MessageStatus = 'sent' | 'read';

export interface Message {
  id: number;
  sender: Sender;
  type: MessageType;
  content: string;
  time: string;
  duration?: string;
  audioSrc?: string;
  status?: MessageStatus;
  isTypo?: boolean;
  reaction?: string;
}

export const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export const WAVEFORM_HEIGHTS = [30, 50, 20, 80, 40, 90, 60, 30, 70, 100, 40, 60, 20, 80, 50, 40, 90, 30, 70, 50, 20, 80, 40, 60, 90, 30, 70, 50, 80, 40];

export const EMOJI_LIST = ['😀','😂','🥺','😍','😭','👍','🔥','✨','🎀','❤️','💖','😎','😡','🥰','💔','🙏'];

// 1. KOMPONEN KEYBOARD iOS
export const Keyboard = ({ activeKey, touches, onEmojiClick, isEmoji }: { activeKey: string | null, touches: {id:number, key:string}[], onEmojiClick: () => void, isEmoji: boolean }) => {
  if (isEmoji) {
    return (
      <div className="bg-[#D1D5DB] h-[260px] px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom),6px)] flex flex-col justify-between shrink-0 z-30">
        <div className="flex-1 grid grid-cols-8 gap-1 px-1 content-start pb-2">
          {EMOJI_LIST.map((emoji, idx) => <div key={idx} className="flex items-center justify-center text-2xl h-10 rounded-lg cursor-pointer">{emoji}</div>)}
        </div>
        <div className="flex gap-1.5 justify-center mt-1">
          <div className="bg-[#ABB2BA] w-[42px] h-[42px] rounded-[5px] text-[15px] font-bold flex items-center justify-center text-black">123</div>
          <div onClick={onEmojiClick} className="bg-white w-[42px] h-[42px] rounded-[5px] text-[15px] flex items-center justify-center text-black cursor-pointer"><span className="text-sm font-bold">ABC</span></div>
          <div className="bg-white flex-1 h-[42px] rounded-[5px] text-[16px] font-bold flex items-center justify-center text-black">Spasi</div>
          <div className="bg-[#ABB2BA] w-[70px] h-[42px] rounded-[5px] text-[15px] font-bold flex items-center justify-center text-black">Kembali</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#D1D5DB] h-[260px] px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom),6px)] flex flex-col justify-between shrink-0 z-30">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className={`flex gap-1.5 justify-center ${rowIndex === 1 ? 'px-4' : ''}`}>
          {rowIndex === 2 && <div className="bg-[#ABB2BA] w-10 h-[42px] rounded-[5px] flex items-center justify-center"><ChevronUp className="w-5 h-5 text-black" /></div>}
          {row.map(k => {
            const isActive = activeKey === k;
            const hasTouch = touches.some(t => t.key === k);
            return (
              <div key={k} className={`relative flex-1 max-w-[34px] h-[42px] rounded-[5px] flex items-center justify-center text-[19px] font-bold text-black transition-colors ${isActive ? 'bg-[#ABB2BA]' : 'bg-white'}`}>
                {k}
                {hasTouch && <div className="absolute inset-0 bg-black/10 rounded-[5px] animate-ping pointer-events-none" />}
              </div>
            );
          })}
          {rowIndex === 2 && <div className="bg-[#ABB2BA] w-10 h-[42px] rounded-[5px] flex items-center justify-center"><Delete className="w-5 h-5 text-black" /></div>}
        </div>
      ))}
      <div className="flex gap-1.5 justify-center mt-1">
        <div className="bg-[#ABB2BA] w-[42px] h-[42px] rounded-[5px] text-[15px] font-bold flex items-center justify-center text-black">123</div>
        <div onClick={onEmojiClick} className="bg-white w-[42px] h-[42px] rounded-[5px] text-[15px] flex items-center justify-center text-black cursor-pointer"><Smile className="w-6 h-6" /></div>
        <div className="bg-white flex-1 h-[42px] rounded-[5px] text-[16px] font-bold flex items-center justify-center text-black">Spasi</div>
        <div className="bg-[#ABB2BA] w-[70px] h-[42px] rounded-[5px] text-[15px] font-bold flex items-center justify-center text-black">Kembali</div>
      </div>
      <div className="flex justify-between items-center px-4 mt-1 mb-1">
        <Globe className="w-6 h-6 text-gray-500" strokeWidth={2} />
        <Mic className="w-6 h-6 text-gray-500" strokeWidth={2} />
      </div>
    </div>
  );
};

// 2. KOMPONEN BUBBLE CHAT
export const MessageBubble = ({ msg, isVnPlaying, vnProgress, vnDurationText, toggleVoiceNote, setActiveImage }: any) => {
  const isMe = msg.sender === 'me';
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`relative max-w-[85%] rounded-[16px] flex flex-col ${isMe ? 'bg-[#DCF8C6] rounded-tr-[4px]' : 'bg-white rounded-tl-[4px]'} ${msg.type === 'image' ? 'p-1' : 'px-2.5 py-1.5'}`}
      >
        {msg.type === 'text' && <span className="text-black text-[15px] font-medium pr-14 leading-snug">{msg.content}</span>}
        {msg.type === 'image' && (
          <div className="relative rounded-lg overflow-hidden bg-zinc-200 cursor-pointer" onClick={() => setActiveImage(msg.content)}>
            <img src={msg.content} alt="PAP" className="w-full h-auto max-h-[350px] object-cover" />
          </div>
        )}
        {msg.type === 'voice' && (
          <div onClick={() => toggleVoiceNote(msg)} className="flex items-center gap-3 pr-10 py-1 cursor-pointer w-full">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isMe ? 'bg-black text-white' : 'bg-black text-white'}`}>
              {isVnPlaying ? <Pause className="w-3.5 h-3.5" fill="currentColor" /> : <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />}
            </div>
            <div className="flex items-center justify-between gap-[2px] h-6 flex-1 relative overflow-hidden">
               {WAVEFORM_HEIGHTS.map((h, i) => {
                 const isPlayed = (i / WAVEFORM_HEIGHTS.length) * 100 <= (isVnPlaying ? vnProgress : 0);
                 return (
                   <div key={i} className={`w-[2px] rounded-full shrink-0 transition-colors ${isPlayed ? 'bg-[#128C7E]' : 'bg-gray-300'}`} style={{ height: `${h}%` }} />
                 );
               })}
            </div>
          </div>
        )}
        <div className="absolute bottom-1 right-1.5 flex items-center gap-1">
          <span className="text-[10px] text-gray-500 font-semibold">{isVnPlaying ? vnDurationText : msg.time}</span>
          {isMe && (msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" /> : <CheckCheck className="w-3.5 h-3.5 text-gray-400" />)}
        </div>
        {msg.reaction && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`absolute -bottom-3 bg-white border border-gray-200 rounded-full px-1.5 py-0.5 shadow-sm text-[12px] z-20 ${isMe ? '-left-2' : '-right-2'}`}
          >
            {msg.reaction}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
