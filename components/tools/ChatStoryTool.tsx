'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, RotateCcw, ChevronUp, Delete, FileText, Globe, Smile, Volume2, VolumeX } from 'lucide-react';

type Sender = 'me' | 'them';
type MessageType = 'text' | 'image';

interface Message {
  id: number;
  sender: Sender;
  type: MessageType;
  content: string;
  time: string;
}

// Alur Cerita "My Princess" (Romantis -> Mistis)
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

const EMOJI_LIST = ['😀','😂','🥺','😍','😭','👍','🔥','✨','🎀','❤️','💖','😎','😡','🥰','💔','🙏'];

export default function ChatStoryTool() {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [typingSender, setTypingSender] = useState<Sender | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(10);
  const [isEmojiKeyboard, setIsEmojiKeyboard] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancelRef = useRef(false);
  
  // Audio Refs
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const sendAudioRef = useRef<HTMLAudioElement | null>(null);

  // Inisialisasi Audio
  useEffect(() => {
    typingAudioRef.current = new Audio('/sound-typing.mp3');
    sendAudioRef.current = new Audio('/sound-send.mp3');
    if (typingAudioRef.current) typingAudioRef.current.volume = 0.6;
    if (sendAudioRef.current) sendAudioRef.current.volume = 0.9;
  }, []);

  // Auto-resize Textarea (Memanjang ke atas saat teks panjang)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // Scroll HANYA di dalam container chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayedMessages, typingSender]);

  const playSfx = (type: 'type' | 'send') => {
    if (isMuted) return;
    if (type === 'type' && typingAudioRef.current) {
      typingAudioRef.current.currentTime = 0;
      typingAudioRef.current.play().catch(() => {});
    } else if (type === 'send' && sendAudioRef.current) {
      sendAudioRef.current.currentTime = 0;
      sendAudioRef.current.play().catch(() => {});
    }
  };

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
      setIsEmojiKeyboard(false);
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
            
            // Deteksi Emoji
            if (char && /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}]/u.test(char)) {
              setIsEmojiKeyboard(true);
            } else if (char === ' ') {
              setIsEmojiKeyboard(false);
            }

            if (char && char !== ' ') {
              setActiveKey(char.toLowerCase());
              playSfx('type');
            } else {
              setActiveKey(null);
            }

            setInputText(text.slice(0, j));
            await new Promise(r => setTimeout(r, 80)); // Kecepatan ngetik
          }
          
          setIsEmojiKeyboard(false);
          setActiveKey(null);
          await new Promise(r => setTimeout(r, 400));
          if (cancelRef.current) return;
          
          setTypingSender(null);
          setDisplayedMessages(prev => [...prev, { ...msg, id: Date.now() + i }]);
          playSfx('send');
          setInputText('');
          
          // Kembalikan tinggi textarea ke awal setelah terkirim
          if (textareaRef.current) textareaRef.current.style.height = 'auto';
          
          await new Promise(r => setTimeout(r, 800));
        }
      }
      if (!cancelRef.current) setIsPlaying(false);
    };

    runSequence();
    return () => { cancelRef.current = true; };
  }, [isPlaying, isMuted]);

  const handlePlay = () => setIsPlaying(true);
  const handleReset = () => {
    setIsPlaying(false);
    setDisplayedMessages([]);
    setInputText('');
    setTypingSender(null);
    setUnreadCount(10);
    setIsEmojiKeyboard(false);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      
      {/* TOMBOL KONTROL (Di luar HP) */}
      <div className="flex justify-center gap-2 w-full z-50">
        <button onClick={handlePlay} disabled={isPlaying} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg">
          <Play className="w-4 h-4" /> {isPlaying ? 'Memutar...' : 'Putar Cerita'}
        </button>
        <button onClick={handleReset} className="bg-white text-zinc-900 px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button onClick={() => setIsMuted(!isMuted)} className="bg-zinc-800 text-white p-2.5 rounded-full hover:bg-zinc-700 transition-all shadow-lg">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* BINGKAI HP MOCKUP */}
      <div className="w-full max-w-[380px] h-[80dvh] sm:h-[750px] bg-[#EFEAE2] rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl relative flex flex-col overflow-hidden font-sans">
        
        {/* HEADER */}
        <div className="bg-[#F6F6F6] border-b border-[#D1D1D6] px-2 py-1.5 flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center">
            <ChevronLeft className="w-7 h-7 text-[#007AFF] -ml-1" strokeWidth={2.5} />
            <span className="text-[#007AFF] text-[17px] font-normal mr-2">{unreadCount}</span>
            
            <div className="w-[38px] h-[38px] bg-[#D1D1D6] rounded-full overflow-hidden flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col ml-2">
              <div className="flex items-center gap-1">
                <span className="text-[16px] font-semibold text-black leading-tight">My Princess 🎀</span>
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
                <div className={`relative max-w-[85%] rounded-[16px] shadow-sm flex flex-col ${isMe ? 'bg-[#DCF8C6] rounded-tr-[4px]' : 'bg-white rounded-tl-[4px]'} ${msg.type === 'image' ? 'p-1' : 'px-2.5 py-1'}`}>
                  
                  {isMe ? (
                    <div className="absolute top-0 -right-[6px] w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="#DCF8C6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg></div>
                  ) : (
                    <div className="absolute top-0 -left-[6px] w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" transform="scale(-1, 1) translate(-8, 0)"></path><path fill="#FFFFFF" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" transform="scale(-1, 1) translate(-8, 0)"></path></svg></div>
                  )}

                  {msg.type === 'text' ? (
                    <span className="text-black text-[14.5px] pr-12 leading-snug">{msg.content}</span>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden bg-zinc-200">
                      <img src={msg.content} alt="PAP" className="w-full h-auto max-h-[350px] object-cover" />
                    </div>
                  )}

                  <div className={`absolute bottom-1 right-2 flex items-center gap-1 ${msg.type === 'image' ? 'bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-sm' : ''}`}>
                    <span className={`text-[10px] font-medium ${msg.type === 'image' ? 'text-white' : 'text-[#8E8E93]'}`}>{msg.time}</span>
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

        {/* INPUT AREA (Auto-Resize Textarea) */}
        <div className="bg-[#F6F6F6] border-t border-[#D1D1D6] p-1.5 flex items-end gap-2 z-30 shrink-0">
          <div className="w-9 h-9 flex items-center justify-center shrink-0 mb-0.5">
            <Plus className="w-6 h-6 text-[#007AFF]" strokeWidth={2.5} />
          </div>
          <div className="flex-1 bg-white rounded-[18px] flex items-end px-2 py-1.5 border border-[#D1D1D6] min-h-[36px]">
            <textarea
              ref={textareaRef}
              value={inputText}
              readOnly
              rows={1}
              placeholder=""
              className="flex-1 bg-transparent outline-none text-[15px] text-black placeholder-zinc-400 resize-none max-h-[80px] overflow-y-auto leading-tight"
            />
            <div className="flex items-center gap-3 text-[#007AFF] pl-2 shrink-0 pb-0.5">
              <FileText className="w-[22px] h-[22px]" strokeWidth={1.5} />
              <Camera className="w-[22px] h-[22px]" strokeWidth={1.5} />
              <Mic className="w-[22px] h-[22px]" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        
        {/* KEYBOARD (iOS Style) */}
        <div className="bg-[#D1D5DB] h-[250px] px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom),6px)] flex flex-col justify-between shrink-0 z-30">
          
          {isEmojiKeyboard ? (
             <div className="flex-1 grid grid-cols-8 gap-1 px-1 content-start pb-2">
               {EMOJI_LIST.map((emoji, idx) => (
                 <div key={idx} className="flex items-center justify-center text-2xl h-10 active:bg-black/10 rounded-lg cursor-pointer">
                   {emoji}
                 </div>
               ))}
             </div>
          ) : (
            <>
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
            </>
          )}
          
          {/* Bottom Bar Keyboard */}
          <div className="flex gap-1.5 justify-center mt-1">
            <div className="bg-[#ABB2BA] w-[42px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[15px] flex items-center justify-center text-black">123</div>
            <div 
              onClick={() => setIsEmojiKeyboard(!isEmojiKeyboard)}
              className="bg-white w-[42px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[15px] flex items-center justify-center text-black cursor-pointer active:bg-zinc-200"
            >
              {isEmojiKeyboard ? <span className="text-sm font-bold">ABC</span> : <Smile className="w-6 h-6" />}
            </div>
            <div className="bg-white flex-1 h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[16px] flex items-center justify-center text-black">Spasi</div>
            <div className="bg-[#ABB2BA] w-[70px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[15px] flex items-center justify-center text-black">Kembali</div>
          </div>

          {/* Bottom Most Bar (Globe & Mic) */}
          <div className="flex justify-between items-center px-4 mt-1 mb-1">
            <Globe className="w-6 h-6 text-[#8E8E93]" strokeWidth={2} />
            <Mic className="w-6 h-6 text-[#8E8E93]" strokeWidth={2} />
          </div>
        </div>

      </div>
    </div>
  );
}
