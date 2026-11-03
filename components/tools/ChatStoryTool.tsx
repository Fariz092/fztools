'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, RotateCcw, ChevronUp, Delete, Send, Volume2, VolumeX } from 'lucide-react';

type Sender = 'me' | 'them';
type MessageType = 'text' | 'image';

interface Message {
  id: number;
  sender: Sender;
  type: MessageType;
  content: string;
  time: string;
}

// Skenario Cerita: My Princess (Romantis -> Mistis)
const STORY_SCRIPT: Omit<Message, 'id'>[] = [
  { sender: 'them', type: 'text', content: "Babe, udah tidur?", time: '22.00' },
  { sender: 'me', type: 'text', content: "Belum sayang, kenapa?", time: '22.01' },
  { sender: 'them', type: 'text', content: "Kangen aja hehe. Btw ini pap aku barusan, bagus ga?", time: '22.02' },
  { sender: 'them', type: 'image', content: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", time: '22.02' },
  { sender: 'me', type: 'text', content: "Cantik banget 😍", time: '22.03' },
  { sender: 'them', type: 'text', content: "Hehehe... Kamu lagi di kamar kan?", time: '22.05' },
  { sender: 'me', type: 'text', content: "Iya dong, kok kamu tau?", time: '22.06' },
  { sender: 'them', type: 'text', content: "Nggak, cuma feeling aja. Jendela kamar kamu katupin ya, anginnya kenceng.", time: '22.08' },
  { sender: 'me', type: 'text', content: "Lah? Kok kamu tau jendela kamar aku? Kamu di mana?", time: '22.09' },
  { sender: 'them', type: 'text', content: "Aku di rumah kok. Tenang aja.", time: '22.10' },
  { sender: 'me', type: 'text', content: "Jangan bikin merinding bre, aku lagi sendirian nih.", time: '22.11' },
  { sender: 'them', type: 'text', content: "Kamu takut ya? Hehehe.", time: '22.12' },
  { sender: 'them', type: 'text', content: "Btw, aku tadi liat kamu lagi rebahan di kasur.", time: '22.12' },
  { sender: 'me', type: 'text', content: "Hah? Serius kamu di mana?", time: '22.13' },
  { sender: 'them', type: 'image', content: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", time: '22.14' },
  { sender: 'them', type: 'text', content: "Ini pemandangan dari jendela kamar kamu kan?", time: '22.14' },
  { sender: 'me', type: 'text', content: "Bercanda kamu ya? Aku merinding beneran nih.", time: '22.15' },
  { sender: 'them', type: 'text', content: "Aku serius sayang. Aku udah nungguin kamu dari jam 12 malam loh.", time: '22.16' },
  { sender: 'them', type: 'text', content: "Jangan nengok ke belakang ya.", time: '22.16' },
  { sender: 'them', type: 'text', content: "Aku udah di samping kamu.", time: '22.17' },
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
  const [isMuted, setIsMuted] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // --- WEB AUDIO API UNTUK SFX ---
  const initAudio = () => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSfx = (type: 'type' | 'send' | 'receive') => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'type') {
      // Suara ketikan (klik pendek)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'send') {
      // Suara kirim pesan (swoosh naik)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'receive') {
      // Suara notifikasi WA (ting-ting)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
  };

  // Scroll internal
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
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
      await new Promise(r => setTimeout(r, 1000));

      for (let i = 0; i < STORY_SCRIPT.length; i++) {
        if (cancelRef.current) return;
        const msg = STORY_SCRIPT[i];

        if (msg.sender === 'them') {
          setTypingSender('them');
          await new Promise(r => setTimeout(r, msg.type === 'image' ? 2500 : 1800)); 
          if (cancelRef.current) return;
          
          setTypingSender(null);
          setDisplayedMessages(prev => [...prev, { ...msg, id: Date.now() + i }]);
          playSfx('receive'); // Suara notif masuk
          await new Promise(r => setTimeout(r, 1000));
        } else {
          setTypingSender('me');
          const text = msg.content;
          for (let j = 0; j <= text.length; j++) {
            if (cancelRef.current) return;
            
            const char = text[j - 1];
            if (char && char !== ' ') {
              setActiveKey(char.toLowerCase());
              playSfx('type'); // Suara ketikan
            } else {
              setActiveKey(null);
            }

            setInputText(text.slice(0, j));
            await new Promise(r => setTimeout(r, 80)); 
          }
          
          setActiveKey(null);
          await new Promise(r => setTimeout(r, 500));
          if (cancelRef.current) return;
          
          setTypingSender(null);
          setDisplayedMessages(prev => [...prev, { ...msg, id: Date.now() + i }]);
          playSfx('send'); // Suara terkirim
          setInputText('');
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      if (!cancelRef.current) {
        setIsPlaying(false);
      }
    };

    runScript();

    return () => {
      cancelRef.current = true;
    };
  }, [isPlaying]);

  const handlePlay = () => {
    initAudio();
    setIsPlaying(true);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setDisplayedMessages([]);
    setInputText('');
    setTypingSender(null);
  };

  return (
    <div className="max-w-md mx-auto w-full">
      {/* Kontrol Atas */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button onClick={handlePlay} disabled={isPlaying} className="glass-btn-purple px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 disabled:opacity-50">
          <Play className="w-3.5 h-3.5" /> {isPlaying ? 'Sedang Berjalan...' : 'Putar Cerita'}
        </button>
        <button onClick={handleReset} className="glass-circle px-4 py-2 rounded-full text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5" /> Ulangi
        </button>
        <button onClick={() => setIsMuted(!isMuted)} className="glass-circle px-3 py-2 rounded-full text-zinc-900 dark:text-white flex items-center justify-center">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* FRAME HP */}
      <div className="bg-[#EFEAE2] rounded-[2.5rem] overflow-hidden border-[8px] border-zinc-900 shadow-2xl relative flex flex-col h-[700px]">
        
        {/* HEADER */}
        <div className="bg-[#F6F6F6] border-b border-zinc-300 px-2 py-2 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-1.5">
            <ChevronLeft className="w-7 h-7 text-[#007AFF]" />
            <span className="text-[#007AFF] text-sm font-medium mr-1">10</span>
            
            <div className="w-9 h-9 bg-zinc-300 rounded-full overflow-hidden ml-1">
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col ml-1">
              <span className="text-[15px] font-semibold text-black leading-tight">My Princess 🎀</span>
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

        {/* AREA CHAT (SCROLL ONLY HERE) */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3 space-y-2 relative scroll-smooth" 
          style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', backgroundBlendMode: 'soft-light' }}
        >
          {displayedMessages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`relative max-w-[80%] rounded-lg shadow-sm flex flex-col ${isMe ? 'bg-[#DCF8C6] rounded-tr-none' : 'bg-white rounded-tl-none'} ${msg.type === 'image' ? 'p-1' : 'px-2.5 py-1.5'}`}>
                  
                  {isMe ? (
                    <div className="absolute top-0 -right-2 w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="#DCF8C6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg></div>
                  ) : (
                    <div className="absolute top-0 -left-2 w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" transform="scale(-1, 1) translate(-8, 0)"></path><path fill="#FFFFFF" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" transform="scale(-1, 1) translate(-8, 0)"></path></svg></div>
                  )}

                  {msg.type === 'text' ? (
                    <span className="text-zinc-900 text-[14px] pr-12">{msg.content}</span>
                  ) : (
                    <div className="relative rounded-md overflow-hidden bg-zinc-200">
                      <img src={msg.content} alt="PAP" className="w-full h-auto max-h-[300px] object-cover" />
                    </div>
                  )}

                  <div className={`absolute bottom-1 right-1.5 flex items-center gap-1 ${msg.type === 'image' ? 'bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-sm' : ''}`}>
                    <span className={`text-[10px] font-medium ${msg.type === 'image' ? 'text-white' : 'text-zinc-400'}`}>{msg.time}</span>
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
              <div className="bg-white rounded-lg rounded-tl-none px-3 py-3 shadow-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="bg-[#F6F6F6] p-2 flex items-end gap-2 z-10 border-t border-zinc-300 shrink-0">
          <Plus className="w-7 h-7 text-[#007AFF] mb-0.5" strokeWidth={2} />
          <div className="flex-1 bg-white rounded-3xl flex items-end px-3 py-1.5 border border-zinc-300 shadow-sm min-h-[36px]">
            <input
              type="text"
              value={inputText}
              readOnly
              placeholder=""
              className="flex-1 bg-transparent outline-none text-[15px] text-black placeholder-zinc-400 pb-1"
            />
            <div className="flex items-center gap-3 text-[#007AFF] ml-2 pb-1">
              {inputText.trim() ? (
                <Send className="w-5 h-5" />
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
        <div className="bg-[#D1D5DB] h-[230px] px-1 pt-2 pb-6 flex flex-col justify-between shrink-0">
           {KEYBOARD_ROWS.map((row, rowIndex) => (
             <div key={rowIndex} className={`flex gap-1.5 justify-center ${rowIndex === 1 ? 'px-4' : ''}`}>
               {rowIndex === 2 && <div className="bg-[#ABB2BA] w-10 h-10 rounded flex items-center justify-center shadow-sm"><ChevronUp className="w-5 h-5 text-black" /></div>}
               
               {row.map(k => {
                 const isActive = activeKey === k;
                 return (
                   <div 
                     key={k} 
                     className={`flex-1 max-w-[32px] h-10 rounded shadow-sm flex items-center justify-center text-[15px] font-medium text-black transition-colors ${isActive ? 'bg-zinc-400' : 'bg-white'}`}
                   >
                     {k}
                   </div>
                 );
               })}

               {rowIndex === 2 && <div className="bg-[#ABB2BA] w-10 h-10 rounded flex items-center justify-center shadow-sm"><Delete className="w-5 h-5 text-black" /></div>}
             </div>
           ))}
           
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
