'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, RotateCcw, Send, ChevronUp, Delete } from 'lucide-react';

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
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [typingSender, setTypingSender] = useState<'me' | 'them' | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);

  // Scroll ke bawah setiap ada pesan atau indikator ngetik
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages, typingSender]);

  // Logika Animasi
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
      await new Promise(r => setTimeout(r, 500));

      for (let i = 0; i < INITIAL_MESSAGES.length; i++) {
        if (cancelRef.current) return;
        const msg = INITIAL_MESSAGES[i];

        if (msg.sender === 'them') {
          // Lawan bicara mengetik
          setTypingSender('them');
          await new Promise(r => setTimeout(r, 1500)); 
          if (cancelRef.current) return;
          setTypingSender(null);
          setDisplayedMessages(prev => [...prev, msg]);
          await new Promise(r => setTimeout(r, 800));
        } else {
          // Kita (sender) mengetik otomatis di keyboard
          setTypingSender('me');
          const text = msg.text;
          for (let j = 0; j <= text.length; j++) {
            if (cancelRef.current) return;
            setInputText(text.slice(0, j));
            await new Promise(r => setTimeout(r, 60)); // Kecepatan ngetik
          }
          await new Promise(r => setTimeout(r, 400));
          if (cancelRef.current) return;
          setTypingSender(null);
          setDisplayedMessages(prev => [...prev, msg]);
          setInputText('');
          await new Promise(r => setTimeout(r, 800));
        }
      }
      if (!cancelRef.current) {
        setIsPlaying(false);
      }
    };

    runSequence();

    return () => {
      cancelRef.current = true;
    };
  }, [isPlaying]);

  // Kirim pesan manual
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isPlaying) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: timeStr,
    };

    setDisplayedMessages([...displayedMessages, newMsg]);
    setInputText('');
  };

  const handlePlay = () => setIsPlaying(true);
  const handleReset = () => {
    setIsPlaying(false);
    setDisplayedMessages([]);
    setInputText('');
    setTypingSender(null);
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="flex justify-center gap-3 mb-4">
        <button onClick={handlePlay} disabled={isPlaying} className="glass-btn-purple px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 disabled:opacity-50">
          <Play className="w-3.5 h-3.5" /> {isPlaying ? 'Sedang Berjalan...' : 'Play Animasi'}
        </button>
        <button onClick={handleReset} className="glass-circle px-4 py-2 rounded-full text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="bg-[#EFEAE2] rounded-[2.5rem] overflow-hidden border-[8px] border-zinc-900 shadow-2xl relative flex flex-col h-[700px]">
        
        {/* HEADER (Tanpa Status Bar, Align Kiri) */}
        <div className="bg-[#F6F6F6] border-b border-zinc-300 px-2 py-2 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <ChevronLeft className="w-7 h-7 text-[#007AFF]" />
            <span className="text-[#007AFF] text-sm font-medium mr-1">10</span>
            
            <div className="w-9 h-9 bg-zinc-300 rounded-full overflow-hidden ml-1">
              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col ml-1">
              <span className="text-[15px] font-semibold text-black leading-tight">mas rafli ❤️</span>
              <span className="text-[11px] text-zinc-500 leading-tight">
                {typingSender === 'them' ? 'sedang mengetik...' : 'online'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[#007AFF] pr-2">
            <Video className="w-6 h-6" strokeWidth={1.5} />
            <Phone className="w-5 h-5" strokeWidth={2} />
          </div>
        </div>

        {/* AREA CHAT */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', backgroundBlendMode: 'soft-light' }}>
          
          {displayedMessages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`relative max-w-[80%] px-2.5 py-1.5 rounded-lg text-[14px] shadow-sm flex flex-col ${isMe ? 'bg-[#DCF8C6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                  {isMe ? (
                    <div className="absolute top-0 -right-2 w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="#DCF8C6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg></div>
                  ) : (
                    <div className="absolute top-0 -left-2 w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" transform="scale(-1, 1) translate(-8, 0)"></path><path fill="#FFFFFF" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" transform="scale(-1, 1) translate(-8, 0)"></path></svg></div>
                  )}
                  <span className="text-zinc-900 pr-12">{msg.text}</span>
                  <div className="absolute bottom-1 right-1.5 flex items-center gap-1">
                    <span className="text-[10px] text-zinc-400 font-medium">{msg.time}</span>
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

          {/* Indikator Mengetik (Titik-titik) */}
          {typingSender === 'them' && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-white rounded-lg rounded-tl-none px-3 py-2.5 shadow-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="bg-[#F6F6F6] p-2 flex items-end gap-2 z-10 border-t border-zinc-300">
          <Plus className="w-7 h-7 text-[#007AFF] mb-0.5" strokeWidth={2} />
          <div className="flex-1 bg-white rounded-3xl flex items-end px-3 py-1.5 border border-zinc-300 shadow-sm min-h-[36px]">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
              disabled={isPlaying || typingSender !== null}
              placeholder=""
              className="flex-1 bg-transparent outline-none text-[15px] text-black placeholder-zinc-400 pb-1"
            />
            <div className="flex items-center gap-3 text-[#007AFF] ml-2 pb-1">
              {inputText.trim() ? (
                <button type="button" onClick={() => handleSend()}>
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <Camera className="w-6 h-6" strokeWidth={1.5} />
                  <Mic className="w-6 h-6" strokeWidth={1.5} />
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* KEYBOARD iPHONE */}
        <div className="bg-[#D1D5DB] h-[230px] px-1 pt-2 pb-6 flex flex-col justify-between hidden sm:flex">
           <div className="flex gap-1.5 justify-center">
              {['q','w','e','r','t','y','u','i','o','p'].map(k => <div key={k} className="bg-white flex-1 max-w-[32px] h-10 rounded shadow-sm flex items-center justify-center text-[15px] font-medium text-black">{k}</div>)}
           </div>
           <div className="flex gap-1.5 justify-center px-4">
              {['a','s','d','f','g','h','j','k','l'].map(k => <div key={k} className="bg-white flex-1 max-w-[32px] h-10 rounded shadow-sm flex items-center justify-center text-[15px] font-medium text-black">{k}</div>)}
           </div>
           <div className="flex gap-1.5 justify-center">
              <div className="bg-[#ABB2BA] w-10 h-10 rounded flex items-center justify-center shadow-sm"><ChevronUp className="w-5 h-5 text-black" /></div>
              {['z','x','c','v','b','n','m'].map(k => <div key={k} className="bg-white flex-1 max-w-[32px] h-10 rounded shadow-sm flex items-center justify-center text-[15px] font-medium text-black">{k}</div>)}
              <div className="bg-[#ABB2BA] w-10 h-10 rounded flex items-center justify-center shadow-sm"><Delete className="w-5 h-5 text-black" /></div>
           </div>
           <div className="flex gap-1.5 justify-center">
              <div className="bg-[#ABB2BA] w-12 h-10 rounded shadow-sm text-[14px] flex items-center justify-center text-black">123</div>
              <div className="bg-white w-10 h-10 rounded shadow-sm text-[14px] flex items-center justify-center text-black">😊</div>
              <div className="bg-white flex-1 h-10 rounded shadow-sm text-[14px] flex items-center justify-center text-black">Spasi</div>
              <div className="bg-[#ABB2BA] w-16 h-10 rounded shadow-sm text-[14px] flex items-center justify-center text-black">Kembali</div>
           </div>
        </div>
      </div>
    </div>
  );
}
