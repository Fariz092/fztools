'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, RotateCcw, ChevronUp, Delete, FileText, Globe, Smile } from 'lucide-react';

type Sender = 'me' | 'them';
type MessageType = 'text' | 'image';

interface Message {
  id: number;
  sender: Sender;
  type: MessageType;
  content: string;
  time: string;
}

const STORY_SCRIPT: Omit<Message, 'id'>[] = [
  { sender: 'them', type: 'text', content: "🥺", time: '20.15' },
  { sender: 'me', type: 'text', content: "kenapaaa", time: '20.16' },
  { sender: 'them', type: 'text', content: "tadii foto kamu juga baguss", time: '20.17' },
  { sender: 'me', type: 'text', content: "foto mana", time: '20.17' },
  { sender: 'me', type: 'text', content: "aku ga kirim foto", time: '20.17' },
  { sender: 'them', type: 'text', content: "yang selfi dikirim ke aku itu", time: '20.17' },
  { sender: 'them', type: 'text', content: "thats the problem", time: '20.17' },
  { sender: 'them', type: 'text', content: "wanjaii", time: '20.17' },
  { sender: 'them', type: 'text', content: "hahahah", time: '20.17' },
  { sender: 'them', type: 'text', content: "kek di tiktok ye", time: '20.18' },
];

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export default function ChatStoryTool() {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [typingSender, setTypingSender] = useState<Sender | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(10);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayedMessages, typingSender]);

  useEffect(() => {
    if (!isPlaying) {
      cancelRef.current = true;
      return;
    }
    cancelRef.current = false;

    const runSequence = async () => {
      setDisplayedMessages([]);
      setInputText('');
      setTypingSender(null);
      setUnreadCount(10);
      await new Promise(r => setTimeout(r, 1000));

      for (let i = 0; i < STORY_SCRIPT.length; i++) {
        if (cancelRef.current) return;
        const msg = STORY_SCRIPT[i];

        if (msg.sender === 'them') {
          setTypingSender('them');
          await new Promise(r => setTimeout(r, msg.type === 'image' ? 2500 : 1500)); 
          if (cancelRef.current) return;
          
          setTypingSender(null);
          setDisplayedMessages(prev => [...prev, { ...msg, id: Date.now() + i }]);
          setUnreadCount(prev => prev + 1);
          await new Promise(r => setTimeout(r, 800));
        } else {
          setTypingSender('me');
          const text = msg.content;
          for (let j = 0; j <= text.length; j++) {
            if (cancelRef.current) return;
            
            const char = text[j - 1];
            if (char && char !== ' ') {
              setActiveKey(char.toLowerCase());
            } else {
              setActiveKey(null);
            }

            setInputText(text.slice(0, j));
            await new Promise(r => setTimeout(r, 100)); 
          }
          
          setActiveKey(null);
          await new Promise(r => setTimeout(r, 400));
          if (cancelRef.current) return;
          
          setTypingSender(null);
          setDisplayedMessages(prev => [...prev, { ...msg, id: Date.now() + i }]);
          setInputText('');
          await new Promise(r => setTimeout(r, 800));
        }
      }
      if (!cancelRef.current) setIsPlaying(false);
    };

    runSequence();
    return () => { cancelRef.current = true; };
  }, [isPlaying]);

  const handlePlay = () => setIsPlaying(true);
  const handleReset = () => {
    setIsPlaying(false);
    setDisplayedMessages([]);
    setInputText('');
    setTypingSender(null);
    setUnreadCount(10);
  };

  return (
    <div className="w-full h-[100dvh] sm:h-[800px] max-w-[400px] mx-auto bg-[#EFEAE2] relative flex flex-col overflow-hidden sm:rounded-[3rem] sm:border-[10px] sm:border-zinc-900 sm:shadow-2xl font-sans">
      
      {/* OVERLAY CONTROLS (Hanya muncul saat hover) */}
      <div className="absolute top-2 left-0 right-0 z-50 flex justify-center gap-2 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
        <button onClick={handlePlay} disabled={isPlaying} className="pointer-events-auto bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
          <Play className="w-3 h-3" /> Play
        </button>
        <button onClick={handleReset} className="pointer-events-auto bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* HEADER (Sesuai Screenshot) */}
      <div className="bg-[#F6F6F6] border-b border-[#D1D1D6] px-2 py-1.5 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center">
          <ChevronLeft className="w-7 h-7 text-[#007AFF] -ml-1" strokeWidth={2.5} />
          <span className="text-[#007AFF] text-[17px] font-normal mr-2">{unreadCount}</span>
          
          {/* Avatar Abu-abu (Placeholder) */}
          <div className="w-[38px] h-[38px] bg-[#D1D1D6] rounded-full overflow-hidden flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="#8E8E93" className="w-7 h-7 mt-2"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          
          <div className="flex flex-col ml-2">
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-semibold text-black leading-tight">mas rafli ❤️</span>
            </div>
            <span className="text-[12px] text-[#8E8E93] leading-tight">
              {typingSender === 'them' ? 'sedang mengetik...' : 'online'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[#007AFF] pr-1">
          <Video className="w-[26px] h-[26px]" strokeWidth={1.5} />
          <Phone className="w-[22px] h-[22px]" strokeWidth={2} />
        </div>
      </div>

      {/* AREA CHAT */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-1.5 relative scroll-smooth" 
        style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', backgroundBlendMode: 'soft-light' }}
      >
        {displayedMessages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-200`}>
              <div className={`relative max-w-[85%] rounded-[16px] shadow-sm flex flex-col ${isMe ? 'bg-[#DCF8C6] rounded-tr-[4px]' : 'bg-white rounded-tl-[4px]'} px-2.5 py-1`}>
                
                {/* Tail Chat */}
                {isMe ? (
                  <div className="absolute top-0 -right-[6px] w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="#DCF8C6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg></div>
                ) : (
                  <div className="absolute top-0 -left-[6px] w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" transform="scale(-1, 1) translate(-8, 0)"></path><path fill="#FFFFFF" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" transform="scale(-1, 1) translate(-8, 0)"></path></svg></div>
                )}

                {/* Isi Pesan */}
                <span className="text-black text-[14.5px] pr-12 leading-snug">{msg.content}</span>

                {/* Time & Ticks */}
                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                  <span className="text-[10px] text-[#8E8E93] font-medium">{msg.time}</span>
                  {isMe && (
                    <svg viewBox="0 0 16 11" width="14" height="10">
                      <path fill="#53BDEB" d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 0 0-.336-.146.47.47 0 0 0-.343.146l-.311.31a.445.445 0 0 0-.14.337c0 .136.047.25.14.343l2.996 2.996a.724.724 0 0 0 .501.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.167-.374l-.333-.261zm-1.06 0a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-1.152-1.087-.311.31a.445.445 0 0 0-.14.337c0 .136.047.25.14.343l1.744 1.744a.724.724 0 0 0 .501.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.167-.374l-.333-.261z"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {typingSender === 'them' && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-white rounded-[16px] rounded-tl-[4px] px-3 py-2 shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#8E8E93] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-[#8E8E93] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-[#8E8E93] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="bg-[#F6F6F6] border-t border-[#D1D1D6] p-1.5 flex items-end gap-2 z-30 shrink-0">
        <div className="w-9 h-9 flex items-center justify-center">
          <Plus className="w-6 h-6 text-[#007AFF]" strokeWidth={2.5} />
        </div>
        <div className="flex-1 bg-white rounded-[18px] flex items-center px-2 py-1 border border-[#D1D1D6] min-h-[36px]">
          <input
            type="text"
            value={inputText}
            readOnly
            placeholder=""
            className="flex-1 bg-transparent outline-none text-[15px] text-black placeholder-zinc-400"
          />
          <div className="flex items-center gap-3 text-[#007AFF] pl-2">
            <FileText className="w-[22px] h-[22px]" strokeWidth={1.5} />
            <Camera className="w-[22px] h-[22px]" strokeWidth={1.5} />
            <Mic className="w-[22px] h-[22px]" strokeWidth={1.5} />
          </div>
        </div>
      </div>
      
      {/* KEYBOARD (Solid iOS Style) */}
      <div className="bg-[#D1D5DB] h-[260px] px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom),6px)] flex flex-col justify-between shrink-0 z-30">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex gap-1.5 justify-center ${rowIndex === 1 ? 'px-4' : ''}`}>
            {rowIndex === 2 && (
              <div className="bg-[#ABB2BA] w-10 h-10 rounded-[5px] shadow-sm flex items-center justify-center">
                <ChevronUp className="w-5 h-5 text-black" />
              </div>
            )}
            
            {row.map(k => {
              const isActive = activeKey === k;
              return (
                <div 
                  key={k} 
                  className={`flex-1 max-w-[34px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] flex items-center justify-center text-[19px] font-normal text-black transition-colors ${isActive ? 'bg-[#ABB2BA]' : 'bg-white'}`}
                >
                  {k}
                </div>
              );
            })}

            {rowIndex === 2 && (
              <div className="bg-[#ABB2BA] w-10 h-10 rounded-[5px] shadow-sm flex items-center justify-center">
                <Delete className="w-5 h-5 text-black" />
              </div>
            )}
          </div>
        ))}
        
        {/* Bottom Bar Keyboard */}
        <div className="flex gap-1.5 justify-center mt-1">
          <div className="bg-[#ABB2BA] w-[42px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[15px] flex items-center justify-center text-black">123</div>
          <div className="bg-white w-[42px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[15px] flex items-center justify-center text-black">
            <Smile className="w-6 h-6" />
          </div>
          <div className="bg-white flex-1 h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[16px] flex items-center justify-center text-black">Spasi</div>
          <div className="bg-[#ABB2BA] w-[70px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[15px] flex items-center justify-center text-black">Kembali</div>
        </div>

        {/* Bottom Most Bar (Globe & Mic) */}
        <div className="flex justify-between items-center px-4 mt-2 mb-1">
          <Globe className="w-6 h-6 text-[#8E8E93]" strokeWidth={2} />
          <Mic className="w-6 h-6 text-[#8E8E93]" strokeWidth={2} />
        </div>
      </div>

    </div>
  );
}
