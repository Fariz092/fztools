'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, RotateCcw } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "🥺", sender: 'them', time: '20.15' },
  { id: 2, text: "kenapaaa", sender: 'me', time: '20.16' },
  { id: 3, text: "tadii foto kamu juga baguss", sender: 'them', time: '20.17' },
  { id: 4, text: "foto mana", sender: 'me', time: '20.17' },
  { id: 5, text: "aku ga kirim foto", sender: 'me', time: '20.17' },
  { id: 6, text: "yang selfi dikirim ke aku itu", sender: 'them', time: '20.17' },
  { id: 7, text: "thats the problem", sender: 'them', time: '20.17' },
  { id: 8, text: "wanjaii", sender: 'them', time: '20.17' },
  { id: 9, text: "hahahah", sender: 'them', time: '20.17' },
  { id: 10, text: "kek di tiktok ye", sender: 'them', time: '20.18' },
];

export default function ChatStoryTool() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_MESSAGES.length);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, visibleCount]);

  useEffect(() => {
    if (!isPlaying) return;
    if (visibleCount >= messages.length) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isPlaying, visibleCount, messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newMsg: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: timeStr,
    };
    
    setMessages([...messages, newMsg]);
    setVisibleCount((prev) => prev + 1);
    setInputText('');
  };

  const handlePlay = () => {
    setVisibleCount(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setVisibleCount(INITIAL_MESSAGES.length);
    setIsPlaying(false);
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="flex justify-center gap-3 mb-4">
        <button onClick={handlePlay} className="glass-btn-purple px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
          <Play className="w-3.5 h-3.5" /> Play Animasi
        </button>
        <button onClick={handleReset} className="glass-circle px-4 py-2 rounded-full text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="bg-[#EFEAE2] rounded-[2.5rem] overflow-hidden border-[8px] border-zinc-900 shadow-2xl relative flex flex-col h-[700px]">
        <div className="bg-[#F6F6F6] px-6 pt-3 pb-1 flex justify-between items-center text-black text-xs font-semibold z-20">
          <span>20.18</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">▲</span>
            <div className="flex gap-0.5 items-end h-2.5">
              <div className="w-0.5 h-1 bg-black"></div>
              <div className="w-0.5 h-1.5 bg-black"></div>
              <div className="w-0.5 h-2 bg-black"></div>
              <div className="w-0.5 h-2.5 bg-black"></div>
            </div>
            <span className="text-[10px] font-bold">5G</span>
            <div className="w-5 h-2.5 border border-black rounded-sm relative">
              <div className="absolute left-0 top-0 bottom-0 bg-black w-3/4 m-[1px]"></div>
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-black"></div>
            </div>
          </div>
        </div>

        <div className="bg-[#F6F6F6] border-b border-zinc-300 px-2 py-2 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 text-[#007AFF]">
            <ChevronLeft className="w-6 h-6" />
            <span className="text-sm font-medium">10</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 bg-zinc-300 rounded-full mb-0.5 overflow-hidden">
              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-black leading-none">mas rafli ❤️</span>
            </div>
            <span className="text-[9px] text-zinc-500 leading-tight">online</span>
          </div>
          <div className="flex items-center gap-4 text-[#007AFF] pr-2">
            <Video className="w-5 h-5" />
            <Phone className="w-5 h-5" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', backgroundBlendMode: 'soft-light' }}>
          {messages.slice(0, visibleCount).map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-[80%] px-2.5 py-1.5 rounded-lg text-[13px] shadow-sm flex flex-col ${isMe ? 'bg-[#DCF8C6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                  {isMe ? (
                    <div className="absolute top-0 -right-2 w-2 h-3">
                      <svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="#DCF8C6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg>
                    </div>
                  ) : (
                    <div className="absolute top-0 -left-2 w-2 h-3">
                      <svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" transform="scale(-1, 1) translate(-8, 0)"></path><path fill="#FFFFFF" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" transform="scale(-1, 1) translate(-8, 0)"></path></svg>
                    </div>
                  )}
                  <span className="text-zinc-900 pr-12">{msg.text}</span>
                  <div className="absolute bottom-1 right-1.5 flex items-center gap-1">
                    <span className="text-[9px] text-zinc-400 font-medium">{msg.time}</span>
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
          <div ref={chatEndRef} />
        </div>

        <div className="bg-[#F6F6F6] p-2 flex items-end gap-2 z-10 border-t border-zinc-300">
          <Plus className="w-6 h-6 text-[#007AFF] mb-1" />
          <div className="flex-1 bg-white rounded-full flex items-center px-3 py-1.5 border border-zinc-300 shadow-sm">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
              placeholder=""
              className="flex-1 bg-transparent outline-none text-sm text-black placeholder-zinc-400"
            />
            <div className="flex items-center gap-3 text-[#007AFF] ml-2">
              <Camera className="w-5 h-5" />
              <Mic className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-[#D1D5DB] h-[220px] px-2 pt-2 hidden sm:block">
           <div className="flex gap-1 justify-center mb-2">
              {['q','w','e','r','t','y','u','i','o','p'].map(k => <div key={k} className="bg-white w-8 h-10 rounded shadow-sm flex items-center justify-center text-sm">{k}</div>)}
           </div>
           <div className="flex gap-1 justify-center mb-2 px-4">
              {['a','s','d','f','g','h','j','k','l'].map(k => <div key={k} className="bg-white w-8 h-10 rounded shadow-sm flex items-center justify-center text-sm">{k}</div>)}
           </div>
           <div className="flex gap-1 justify-center mb-2">
              <div className="bg-[#ABB2BA] w-10 h-10 rounded flex items-center justify-center shadow-sm">⇧</div>
              {['z','x','c','v','b','n','m'].map(k => <div key={k} className="bg-white w-8 h-10 rounded shadow-sm flex items-center justify-center text-sm">{k}</div>)}
              <div className="bg-[#ABB2BA] w-10 h-10 rounded flex items-center justify-center shadow-sm">⌫</div>
           </div>
           <div className="flex gap-1 justify-center">
              <div className="bg-[#ABB2BA] w-12 h-10 rounded shadow-sm text-xs flex items-center justify-center">123</div>
              <div className="bg-white w-6 h-10 rounded shadow-sm text-xs flex items-center justify-center">😊</div>
              <div className="bg-white flex-1 h-10 rounded shadow-sm text-sm flex items-center justify-center">Spasi</div>
              <div className="bg-[#ABB2BA] w-16 h-10 rounded shadow-sm text-xs flex items-center justify-center">Kembali</div>
           </div>
        </div>
      </div>
    </div>
  );
}
