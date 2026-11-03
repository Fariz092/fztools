'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, RotateCcw, ChevronUp, Delete, FileText, Globe, Smile, Volume2, VolumeX, Pause, Send } from 'lucide-react';

type Sender = 'me' | 'them';
type MessageType = 'text' | 'image' | 'voice';

interface Message {
  id: number;
  sender: Sender;
  type: MessageType;
  content: string; // text, image URL, or VN label
  time: string;
  duration?: string;
  audioSrc?: string;
}

// Alur Cerita Lengkap: My Princess (Part 1 & Part 2)
const STORY_SCRIPT: Omit<Message, 'id'>[] = [
  // --- PART 1 ---
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
  
  // --- PART 2 ---
  { sender: 'me', type: 'text', content: "KAMU SERIUS DIMANA? JANGAN BIKIN PANIK", time: '22.18' },
  
  // VN 1 (Cewek)
  { sender: 'them', type: 'voice', content: "VN: Bercanda babe...", time: '22.19', duration: '0:12', audioSrc: '/voice-note.mp3' },
  
  { sender: 'me', type: 'text', content: "Parfum Baccarat. Kamu di kamar sebelah mana? Kok kamu tau wangi kamar aku?", time: '22.20' },
  { sender: 'them', type: 'text', content: "Aku lagi di depan pintu kamar kamu.", time: '22.21' },
  { sender: 'me', type: 'text', content: "Hah? Aku ga denger suara apa-apa.", time: '22.21' },
  { sender: 'them', type: 'text', content: "Aku udah masuk kok. Kamu lagi rebahan kan?", time: '22.22' },
  { sender: 'them', type: 'image', content: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", time: '22.22' },
  { sender: 'them', type: 'text', content: "Jangan bangun. Aku lagi di samping kamu.", time: '22.23' },

  // VN 2 (Cowok - Bakal disimulasikan rekam & kirim)
  { sender: 'me', type: 'voice', content: "VN: Babe, serius deh...", time: '22.24', duration: '0:09', audioSrc: '/vn-cowo.mp3' },

  // VN 3 (Cewek Balas Terakhir)
  { sender: 'them', type: 'voice', content: "VN: Ssstt... jangan berisik sayang...", time: '22.25', duration: '0:15', audioSrc: '/vn-cewe2.mp3' },
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
  
  // State for Voice Note Player & Recording
  const [activeVnId, setActiveVnId] = useState<number | null>(null);
  const [vnProgress, setVnProgress] = useState(0);
  const [vnDurationText, setVnDurationText] = useState('0:00');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [previewVn, setPreviewVn] = useState<Message | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancelRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const voiceNoteAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- WEB AUDIO API (SFX) ---
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
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'send') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'receive') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
  };

  // --- AUDIO SETUP (Untuk Chat) ---
  useEffect(() => {
    const audio = new Audio();
    voiceNoteAudioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setVnProgress(progress);
        const mins = Math.floor(audio.currentTime / 60);
        const secs = Math.floor(audio.currentTime % 60);
        setVnDurationText(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };
    const handleEnded = () => {
      setActiveVnId(null);
      setVnProgress(0);
      setVnDurationText('0:00');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleVoiceNote = (msg: Message) => {
    const audio = voiceNoteAudioRef.current;
    if (!audio || !msg.audioSrc) return;

    if (activeVnId === msg.id) {
      audio.pause();
      setActiveVnId(null);
    } else {
      audio.src = msg.audioSrc;
      audio.play().catch(e => console.log('Play error', e));
      setActiveVnId(msg.id);
    }
  };

  // Fungsi simulasi play VN secara programatik (untuk alur cerita otomatis)
  const autoPlayVoiceNote = (msg: Message) => {
    return new Promise<void>((resolve) => {
      const audio = new Audio(msg.audioSrc);
      audio.play().then(() => {
        setActiveVnId(msg.id);
        const timeUpdate = setInterval(() => {
          if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            setVnProgress(progress);
            const mins = Math.floor(audio.currentTime / 60);
            const secs = Math.floor(audio.currentTime % 60);
            setVnDurationText(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
          }
        }, 100);

        audio.onended = () => {
          clearInterval(timeUpdate);
          setActiveVnId(null);
          setVnProgress(0);
          setVnDurationText('0:00');
          resolve();
        };
      }).catch(() => {
        // Jika browser blokir autoplay, resolve aja biar cerita lanjut
        setTimeout(() => resolve(), 3000); 
      });
    });
  };

  // Auto-resize Textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // Scroll terisolasi
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayedMessages, typingSender, isRecording, previewVn]);

  // Main Sequence
  useEffect(() => {
    if (!isPlaying) {
      cancelRef.current = true;
      if (voiceNoteAudioRef.current) voiceNoteAudioRef.current.pause();
      return;
    }
    cancelRef.current = false;

    const runSequence = async () => {
      setDisplayedMessages([]);
      setInputText('');
      setTypingSender(null);
      setUnreadCount(10);
      setIsEmojiKeyboard(false);
      setActiveVnId(null);
      setIsRecording(false);
      setPreviewVn(null);
      await new Promise(r => setTimeout(r, 1000));

      for (let i = 0; i < STORY_SCRIPT.length; i++) {
        if (cancelRef.current) return;
        const msg = STORY_SCRIPT[i];

        if (msg.sender === 'them') {
          setTypingSender('them');
          await new Promise(r => setTimeout(r, msg.type === 'image' ? 2500 : msg.type === 'voice' ? 2000 : 1500)); 
          if (cancelRef.current) return;
          
          setTypingSender(null);
          const newMsg = { ...msg, id: Date.now() + i };
          setDisplayedMessages(prev => [...prev, newMsg]);
          setUnreadCount(prev => prev + 1);
          playSfx('receive');
          
          // Jika itu VN, otomatis play
          if (msg.type === 'voice') {
            await autoPlayVoiceNote(newMsg);
          } else {
            await new Promise(r => setTimeout(r, 1000));
          }

        } else {
          // Kalo Cowok yang kirim VN (Record -> Preview -> Send)
          if (msg.type === 'voice') {
            setIsRecording(true);
            setRecordTime(0);
            const recInterval = setInterval(() => setRecordTime(p => p + 1), 1000);
            
            await new Promise(r => setTimeout(r, 4000)); // Simulasi rekam 4 detik
            if (cancelRef.current) return;
            
            clearInterval(recInterval);
            setIsRecording(false);
            
            // Muncul Preview VN
            const previewMsg = { ...msg, id: Date.now() + i };
            setPreviewVn(previewMsg);
            await new Promise(r => setTimeout(r, 500)); // Jeda bentar sebelum play
            
            if (cancelRef.current) return;
            setPreviewPlaying(true);
            
            // Simulasi muter preview VN
            const audioPreview = new Audio(msg.audioSrc);
            audioPreview.play().then(() => {
              const prevInterval = setInterval(() => {
                if (audioPreview.duration) setPreviewProgress((audioPreview.currentTime / audioPreview.duration) * 100);
              }, 100);
              audioPreview.onended = () => {
                clearInterval(prevInterval);
                setPreviewPlaying(false);
                setPreviewProgress(0);
              };
            }).catch(() => {
              // Kalo autoplay kena blokir, asal jeda aja
              setTimeout(() => setPreviewPlaying(false), 3000);
            });

            // Tunggu VN selesai baru kirim
            await new Promise(r => setTimeout(r, 9500)); 
            if (cancelRef.current) return;
            
            // Kirim
            setPreviewVn(null);
            setDisplayedMessages(prev => [...prev, previewMsg]);
            playSfx('send');
            await new Promise(r => setTimeout(r, 1000));
          } else {
            // Teks biasa
            setTypingSender('me');
            const text = msg.content;
            for (let j = 0; j <= text.length; j++) {
              if (cancelRef.current) return;
              const char = text[j - 1];
              
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
              await new Promise(r => setTimeout(r, 70)); 
            }
            
            setIsEmojiKeyboard(false);
            setActiveKey(null);
            await new Promise(r => setTimeout(r, 400));
            if (cancelRef.current) return;
            
            setTypingSender(null);
            setDisplayedMessages(prev => [...prev, { ...msg, id: Date.now() + i }]);
            playSfx('send');
            setInputText('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
            await new Promise(r => setTimeout(r, 1000));
          }
        }
      }
      if (!cancelRef.current) setIsPlaying(false);
    };

    runSequence();
    return () => { cancelRef.current = true; };
  }, [isPlaying, isMuted]);

  const handlePlay = () => { initAudio(); setIsPlaying(true); };
  const handleReset = () => {
    setIsPlaying(false); setDisplayedMessages([]); setInputText(''); setTypingSender(null); setUnreadCount(10); setIsEmojiKeyboard(false); setActiveVnId(null); setIsRecording(false); setPreviewVn(null);
    if (voiceNoteAudioRef.current) voiceNoteAudioRef.current.pause();
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
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

      <div className="w-full max-w-[380px] h-[85dvh] sm:h-[750px] bg-[#EFEAE2] rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl relative flex flex-col overflow-hidden font-sans">
        
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
            const isVnPlaying = activeVnId === msg.id;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-200`}>
                <div className={`relative max-w-[85%] rounded-[16px] shadow-sm flex flex-col ${isMe ? 'bg-[#DCF8C6] rounded-tr-[4px]' : 'bg-white rounded-tl-[4px]'} ${msg.type === 'image' ? 'p-1' : 'px-2.5 py-1'}`}>
                  
                  {isMe ? (
                    <div className="absolute top-0 -right-[6px] w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="#DCF8C6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg></div>
                  ) : (
                    <div className="absolute top-0 -left-[6px] w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" transform="scale(-1, 1) translate(-8, 0)"></path><path fill="#FFFFFF" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" transform="scale(-1, 1) translate(-8, 0)"></path></svg></div>
                  )}

                  {msg.type === 'text' && (
                    <span className="text-black text-[14.5px] pr-12 leading-snug">{msg.content}</span>
                  )}

                  {msg.type === 'image' && (
                    <div className="relative rounded-xl overflow-hidden bg-zinc-200">
                      <img src={msg.content} alt="PAP" className="w-full h-auto max-h-[350px] object-cover" />
                    </div>
                  )}

                  {msg.type === 'voice' && (
                    <div 
                      onClick={() => toggleVoiceNote(msg)}
                      className="flex items-center gap-2 pr-12 py-1 cursor-pointer min-w-[180px]"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isMe ? 'bg-[#25D366]/20' : 'bg-[#007AFF]/10'}`}>
                        {isVnPlaying ? <Pause className={`w-4 h-4 ${isMe ? 'text-[#128C7E]' : 'text-[#007AFF]'}`} fill="currentColor" /> : <Play className={`w-4 h-4 ${isMe ? 'text-[#128C7E]' : 'text-[#007AFF]'}`} fill="currentColor" />}
                      </div>
                      
                      <div className="flex items-center gap-0.5 h-6 flex-1 relative overflow-hidden">
                         {[...Array(15)].map((_, i) => (
                           <div key={i} className={`w-[2px] rounded-full shrink-0 ${isMe ? 'bg-zinc-500' : 'bg-zinc-400'}`} style={{ height: `${Math.random() * 100}%` }}></div>
                         ))}
                         <div className="absolute top-0 bottom-0 left-0 bg-black/10 pointer-events-none" style={{ width: `${isVnPlaying ? vnProgress : 0}%` }} />
                      </div>

                      <span className="text-[10px] text-[#8E8E93] w-8 shrink-0 mt-2 text-right">
                        {isVnPlaying ? vnDurationText : msg.duration}
                      </span>
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

        {/* INPUT AREA */}
        <div className="bg-[#F6F6F6] border-t border-[#D1D1D6] p-1.5 flex items-end gap-2 z-30 shrink-0 min-h-[52px]">
          
          {isRecording ? (
            /* UI SEDANG MEREKAM */
            <div className="flex-1 flex items-center gap-2 px-2 h-[36px]">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 font-mono text-sm">{formatTime(recordTime)}</span>
              <span className="text-zinc-400 text-sm ml-2">Sedang merekam...</span>
            </div>
          ) : previewVn ? (
            /* UI PREVIEW VN SEBELUM KIRIM */
            <div className="flex-1 flex items-center gap-2 bg-white rounded-[18px] px-2 py-1.5 border border-[#D1D1D6] min-h-[36px]">
              <div className="w-6 h-6 bg-[#25D366]/20 rounded-full flex items-center justify-center shrink-0">
                {previewPlaying ? <Pause className="w-3 h-3 text-[#128C7E]" fill="currentColor" /> : <Play className="w-3 h-3 text-[#128C7E]" fill="currentColor" />}
              </div>
              <div className="flex items-center gap-0.5 h-4 flex-1 relative overflow-hidden">
                 {[...Array(15)].map((_, i) => (
                   <div key={i} className="w-[2px] bg-zinc-400 rounded-full shrink-0" style={{ height: `${Math.random() * 100}%` }}></div>
                 ))}
                 <div className="absolute top-0 bottom-0 left-0 bg-black/10 pointer-events-none" style={{ width: `${previewPlaying ? previewProgress : 0}%` }} />
              </div>
              <span className="text-[10px] text-[#8E8E93] w-8 shrink-0 text-right">{previewVn.duration}</span>
              
              <button className="w-8 h-8 bg-[#007AFF] rounded-full flex items-center justify-center shrink-0 ml-1 animate-in zoom-in duration-300">
                <Send className="w-4 h-4 text-white -ml-0.5" fill="currentColor" />
              </button>
            </div>
          ) : (
            /* UI INPUT NORMAL */
            <>
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
            </>
          )}
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
