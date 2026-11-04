'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, RotateCcw, ChevronUp, Delete, Globe, Smile, Volume2, VolumeX, Pause, Send, CheckCheck, Bell } from 'lucide-react';

type Sender = 'me' | 'them';
type MessageType = 'text' | 'image' | 'voice';
type MessageStatus = 'sent' | 'read';

interface Message {
  id: number;
  sender: Sender;
  type: MessageType;
  content: string;
  time: string;
  duration?: string;
  audioSrc?: string;
  status?: MessageStatus;
  isTypo?: boolean;
}

const STORY_SCRIPT: Omit<Message, 'id'>[] = [
  { sender: 'them', type: 'text', content: "babe, udah tidur?", time: '22.00' },
  { sender: 'me', type: 'text', content: "belum sayang, kenapa?", time: '22.01' },
  { sender: 'them', type: 'text', content: "kangen aja hehe. btw ini pap aku barusan, bagus ga?", time: '22.02' },
  { sender: 'them', type: 'image', content: "/pap-myprinces.png", time: '22.02' },
  { sender: 'me', type: 'text', content: "cantik banget 😍", time: '22.03' },
  { sender: 'them', type: 'text', content: "hehehe... kamu lagi di kamar kan?", time: '22.05' },
  { sender: 'me', type: 'text', content: "iya dong, kok kamu tau?", time: '22.06' },
  { sender: 'them', type: 'text', content: "nggak, cuma feeling aja. jendela kamar kamu katupin ya, anginnya kenceng.", time: '22.08' },
  { sender: 'me', type: 'text', content: "lah? kok kamu tau jendela kamar aku? kamu di mana?", time: '22.09' },
  { sender: 'them', type: 'text', content: "aku di rumah kok. tenang aja.", time: '22.10' },
  { sender: 'me', type: 'text', content: "jangan bikin merinding bre, aku lagi sendirian nih.", time: '22.11' },
  { sender: 'them', type: 'text', content: "kamu takut ya? hehehe.", time: '22.12' },
  { sender: 'them', type: 'text', content: "btw, aku tadi liat kamu lagi rebahan di kasur.", time: '22.12' },
  { sender: 'me', type: 'text', content: "hah? serius kamu di mana?", time: '22.13' },
  { sender: 'them', type: 'image', content: "/fotopemandanganjendela.jpeg", time: '22.14' },
  { sender: 'them', type: 'text', content: "ini pemandangan dari jendela kamar kamu kan?", time: '22.14' },
  { sender: 'me', type: 'text', content: "bercanda kamu ya? aku merinding beneran nih.", time: '22.15' },
  { sender: 'them', type: 'text', content: "aku serius sayang. aku udah nungguin kamu dari jam 12 malam loh.", time: '22.16' },
  { sender: 'them', type: 'text', content: "jangan nengok ke belakang ya.", time: '22.16' },
  { sender: 'them', type: 'text', content: "aku udah di samping kamu.", time: '22.17' },
  { sender: 'me', type: 'text', content: "kamu serius dimana? jangan bikin panik", time: '22.18', isTypo: true },
  { sender: 'them', type: 'voice', content: "vn: bercanda babe...", time: '22.19', duration: '0:12', audioSrc: '/voice-note.mp3' },
  { sender: 'me', type: 'text', content: "parfum baccarat. kamu di kamar sebelah mana? kok kamu tau wangi kamar aku?", time: '22.20' },
  { sender: 'them', type: 'text', content: "aku lagi di depan pintu kamar kamu.", time: '22.21' },
  { sender: 'me', type: 'text', content: "hah? aku ga denger suara apa-apa.", time: '22.21' },
  { sender: 'them', type: 'text', content: "aku udah masuk kok. kamu lagi rebahan kan?", time: '22.22' },
  { sender: 'them', type: 'image', content: "/fotocowolagirebahan.jpeg", time: '22.22' },
  { sender: 'them', type: 'text', content: "jangan bangun. aku lagi di samping kamu.", time: '22.23' },
  { sender: 'me', type: 'voice', content: "vn: babe, serius deh...", time: '22.24', duration: '0:09', audioSrc: '/vn-cowo.mp3' },
  { sender: 'them', type: 'voice', content: "vn: ssstt... jangan berisik sayang...", time: '22.25', duration: '0:10', audioSrc: '/vn-cewe2.mp3' },
  { sender: 'me', type: 'voice', content: "vn: (napas terengah, suara pintu dibanting)", time: '22.26', duration: '0:05', audioSrc: '/voice-cowo2.mp3' },
  { sender: 'them', type: 'voice', content: "vn: (suara napas pelan, ketawa merinding)", time: '22.27', duration: '0:08', audioSrc: '/voice-cewe3.mp3' },
  { sender: 'me', type: 'text', content: "ah elahh, kirainn, tau ahh maless", time: '22.28' },
];

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const EMOJI_LIST = ['😀','😂','🥺','😍','😭','👍','🔥','✨','🎀','❤️','💖','😎','😡','🥰','💔','🙏'];
const WAVEFORM_HEIGHTS = [30, 60, 40, 80, 50, 90, 70, 40, 100, 60, 30, 80, 50, 70, 40];

export default function ChatStoryTool() {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [typingSender, setTypingSender] = useState<Sender | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isWaitingForContinue, setIsWaitingForContinue] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const continueResolver = useRef<(() => void) | null>(null);

  const [activeVnId, setActiveVnId] = useState<number | null>(null);
  const [vnProgress, setVnProgress] = useState(0);
  const [vnDurationText, setVnDurationText] = useState('0:00');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [touches, setTouches] = useState<{id: number, key: string}[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancelRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const voiceNoteAudioRef = useRef<HTMLAudioElement | null>(null);

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
    const audio = new Audio();
    voiceNoteAudioRef.current = audio;
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setVnProgress((audio.currentTime / audio.duration) * 100);
        const mins = Math.floor(audio.currentTime / 60); const secs = Math.floor(audio.currentTime % 60);
        setVnDurationText(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };
    const handleEnded = () => { setActiveVnId(null); setVnProgress(0); setVnDurationText('0:00'); };
    audio.addEventListener('timeupdate', handleTimeUpdate); audio.addEventListener('ended', handleEnded);
    return () => { audio.pause(); audio.removeEventListener('timeupdate', handleTimeUpdate); audio.removeEventListener('ended', handleEnded); };
  }, []);

  const toggleVoiceNote = (msg: Message) => {
    const audio = voiceNoteAudioRef.current;
    if (!audio || !msg.audioSrc) return;
    if (activeVnId === msg.id) { audio.pause(); setActiveVnId(null); } 
    else { audio.src = msg.audioSrc; audio.play().catch(e => console.log(e)); setActiveVnId(msg.id); }
  };

  const autoPlayVoiceNote = (msg: Message) => {
    return new Promise<void>((resolve) => {
      const audio = new Audio(msg.audioSrc);
      audio.play().then(() => {
        setActiveVnId(msg.id);
        const timeUpdate = setInterval(() => {
          if (audio.duration) {
            setVnProgress((audio.currentTime / audio.duration) * 100);
            const mins = Math.floor(audio.currentTime / 60); const secs = Math.floor(audio.currentTime % 60);
            setVnDurationText(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
          }
        }, 100);
        audio.onended = () => { clearInterval(timeUpdate); setActiveVnId(null); setVnProgress(0); setVnDurationText('0:00'); resolve(); };
      }).catch(() => setTimeout(() => resolve(), 3000));
    });
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
  }, [displayedMessages, typingSender, isRecording, isWaitingForContinue]);

  const waitForContinue = () => {
    setIsWaitingForContinue(true);
    playSfx('notif');
    return new Promise<void>((resolve) => {
      continueResolver.current = () => { setIsWaitingForContinue(false); resolve(); };
    });
  };

  const triggerTouch = (key: string) => {
    const id = Date.now() + Math.random();
    setTouches(prev => [...prev, { id, key }]);
    setTimeout(() => setTouches(prev => prev.filter(t => t.id !== id)), 300);
  };

  useEffect(() => {
    if (!isPlaying) { cancelRef.current = true; if (voiceNoteAudioRef.current) voiceNoteAudioRef.current.pause(); return; }
    cancelRef.current = false;

    const runSequence = async () => {
      setDisplayedMessages([]); setInputText(''); setTypingSender(null); setActiveVnId(null); setIsRecording(false); setActiveImage(null); setIsWaitingForContinue(false);
      await new Promise(r => setTimeout(r, 1000));

      for (let i = 0; i < STORY_SCRIPT.length; i++) {
        if (cancelRef.current) return;
        const msg = STORY_SCRIPT[i];
        const msgId = Date.now() + i;

        if (msg.sender === 'them') {
          setTypingSender('them');
          await new Promise(r => setTimeout(r, msg.type === 'voice' ? 2000 : 1800)); 
          if (cancelRef.current) return;
          setTypingSender(null);
          
          const newMsg = { ...msg, id: msgId };
          setDisplayedMessages(prev => [...prev, newMsg]);

          if (msg.type === 'image') await waitForContinue();
          else if (msg.type === 'voice') await autoPlayVoiceNote(newMsg);
          else await new Promise(r => setTimeout(r, 1000));
        } else {
          if (msg.type === 'voice') {
            setIsRecording(true); 
            const targetSecs = parseInt(msg.duration?.split(':')[1] || '5');
            let currentSec = 0; setRecordTime(0);
            
            const recInterval = setInterval(() => { currentSec++; setRecordTime(currentSec); if (currentSec >= targetSecs) clearInterval(recInterval); }, 1000);
            await new Promise(r => setTimeout(r, targetSecs * 1000 + 1000)); 
            if (cancelRef.current) return;
            clearInterval(recInterval); setIsRecording(false);
            
            const newMsg = { ...msg, id: msgId, status: 'sent' as MessageStatus };
            setDisplayedMessages(prev => [...prev, newMsg]);
            await new Promise(r => setTimeout(r, 1500));
            setDisplayedMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' } : m));
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

            if (msg.isTypo) {
              await new Promise(r => setTimeout(r, 500));
              for (let k = 0; k < 3; k++) { setInputText(prev => prev.slice(0, -1)); await new Promise(r => setTimeout(r, 150)); }
              await new Promise(r => setTimeout(r, 600));
              const typoFix = "na? jangan bikin panik";
              for (let k = 0; k < typoFix.length; k++) {
                setInputText(prev => prev + typoFix[k]);
                setActiveKey(typoFix[k].toLowerCase());
                triggerTouch(typoFix[k].toLowerCase());
                playSfx('type');
                await new Promise(r => setTimeout(r, 80));
              }
            }
            
            setActiveKey(null);
            await new Promise(r => setTimeout(r, 400));
            if (cancelRef.current) return;
            
            setTypingSender(null);
            const newMsg = { ...msg, id: msgId, status: 'sent' as MessageStatus };
            setDisplayedMessages(prev => [...prev, newMsg]);
            playSfx('send');
            setInputText('');
            if (textareaRef.current) textareaRef.current.style.height = '24px';
            
            await new Promise(r => setTimeout(r, 2000));
            setDisplayedMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' } : m));
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
    setIsPlaying(false); setDisplayedMessages([]); setInputText(''); setTypingSender(null); setActiveVnId(null); setIsRecording(false); setActiveImage(null); setIsWaitingForContinue(false);
    if (voiceNoteAudioRef.current) voiceNoteAudioRef.current.pause();
    if (textareaRef.current) textareaRef.current.style.height = '24px';
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 font-sans">
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

      <div className="w-full max-w-[400px] h-[85dvh] sm:h-[800px] bg-[#EFEAE2] rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* HEADER GLASSMORPHISM (SANGAT TRANSPARAN & BLUR TEBAL) */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-3xl border-b border-black/10 px-3 py-2.5 flex items-center justify-between drop-shadow-sm">
          <div className="flex items-center gap-3">
            <ChevronLeft className="w-6 h-6 text-black drop-shadow-sm" strokeWidth={2.5} />
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-300 shadow-sm">
               <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-black leading-tight drop-shadow-sm">MyPrincess💖</span>
              <span className="text-[12px] font-semibold text-gray-800 leading-tight drop-shadow-sm">
                {isRecording ? 'Merekam Audio...' : typingSender === 'them' ? 'sedang mengetik...' : 'Online'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-black drop-shadow-sm">
            <Video className="w-6 h-6" strokeWidth={1.5} />
            <Phone className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </div>

        {/* NOTIFIKASI ALA IPHONE */}
        {isWaitingForContinue && (
          <div className="absolute top-4 left-2 right-2 z-[60] animate-in slide-in-from-top-10 duration-500 fade-in">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D1D1D6] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pemberitahuan Sistem</p>
                <p className="text-[13px] font-semibold text-black leading-tight mt-0.5">Pesan baru: Foto dari MyPrincess</p>
              </div>
              <button 
                onClick={() => continueResolver.current && continueResolver.current()}
                className="bg-[#007AFF] text-white text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-transform shrink-0"
              >
                Lanjut
              </button>
            </div>
          </div>
        )}

        {/* AREA CHAT */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 pt-[70px] relative scroll-smooth bg-[#EFEAE2]" style={{ backgroundImage: 'url("/background-wa.png")', backgroundSize: 'cover' }}>
          <div className="flex justify-center mb-4">
            <span className="bg-[#E2DCD3]/90 text-[#5E5E5E] text-[11px] font-semibold px-3 py-1 rounded-full">4 November 2026</span>
          </div>

          {displayedMessages.map((msg) => {
            const isMe = msg.sender === 'me';
            const isVnPlaying = activeVnId === msg.id;
            
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`relative max-w-[85%] rounded-[12px] shadow-sm flex flex-col ${isMe ? 'bg-[#DCF8C6]' : 'bg-white'} ${msg.type === 'image' ? 'p-1' : 'px-2 py-1.5'}`}>
                  
                  {msg.type === 'text' && <span className="text-black text-[15px] font-medium pr-14 leading-snug">{msg.content}</span>}

                  {msg.type === 'image' && (
                    <div className="relative rounded-lg overflow-hidden bg-zinc-200 cursor-pointer" onClick={() => setActiveImage(msg.content)}>
                      <img src={msg.content} alt="PAP" className="w-full h-auto max-h-[350px] object-cover" />
                    </div>
                  )}

                  {msg.type === 'voice' && (
                    <div onClick={() => toggleVoiceNote(msg)} className="flex items-center gap-2 pr-12 py-1 cursor-pointer w-[220px]">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#128C7E] text-white`}>
                        {isVnPlaying ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4" fill="currentColor" />}
                      </div>
                      <div className="flex items-center gap-0.5 h-6 flex-1 relative overflow-hidden">
                         {WAVEFORM_HEIGHTS.map((h, i) => (
                           <div key={i} className={`w-[2px] rounded-full shrink-0 bg-zinc-400`} style={{ height: `${h}%` }}></div>
                         ))}
                         <div className="absolute top-0 bottom-0 left-0 bg-white/60 mix-blend-overlay pointer-events-none transition-all duration-100" style={{ width: `${isVnPlaying ? vnProgress : 0}%` }} />
                      </div>
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/50 ml-auto">
                        <img src={isMe ? "https://i.pravatar.cc/150?img=11" : "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-1 right-1.5 flex items-center gap-1">
                    <span className="text-[10px] text-gray-500 font-semibold">{isVnPlaying ? vnDurationText : msg.time}</span>
                    {isMe && (msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" /> : <CheckCheck className="w-3.5 h-3.5 text-gray-400" />)}
                  </div>
                </div>
              </div>
            );
          })}

          {typingSender === 'them' && (
            <div className="flex justify-start mb-2 animate-in fade-in">
              <div className="bg-white rounded-xl px-3 py-2 shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* INPUT CHAT (COMPACT) */}
        <div className="bg-[#F6F6F6] p-1.5 flex items-end gap-2 z-30 shrink-0 border-t border-gray-200">
          {isRecording ? (
            <div className="flex-1 flex items-center gap-2 bg-white rounded-3xl px-4 h-[36px] border border-gray-300 shadow-sm">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 font-mono font-bold text-sm">{`0:${recordTime < 10 ? '0' : ''}${recordTime}`}</span>
              <span className="text-gray-500 text-xs font-medium ml-2">Merekam Audio...</span>
            </div>
          ) : (
            <>
              <div className="w-[36px] h-[36px] flex items-center justify-center shrink-0 text-gray-600"><Plus className="w-6 h-6" strokeWidth={1.5} /></div>
              
              <div className="flex-1 bg-white rounded-3xl flex items-end px-2 py-1 border border-gray-300 shadow-sm min-h-[36px] relative">
                {inputText === '' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-gray-400 pointer-events-none">Ketik pesan</span>}
                <textarea 
                  ref={textareaRef} 
                  value={inputText} 
                  readOnly 
                  rows={1} 
                  className="flex-1 bg-transparent outline-none text-[14px] font-medium text-black resize-none max-h-[80px] overflow-y-auto leading-tight relative z-10 py-1" 
                  style={{ height: '24px' }} 
                />
                <div className="flex items-center gap-2 shrink-0 pl-2 pb-1">
                  {inputText.trim() === '' ? (
                    <><Camera className="w-[20px] h-[20px] text-gray-500" strokeWidth={1.5} /><Mic className="w-[20px] h-[20px] text-gray-500" strokeWidth={1.5} /></>
                  ) : (
                    <button className="w-7 h-7 bg-[#00A884] rounded-full flex items-center justify-center animate-in zoom-in duration-200"><Send className="w-3.5 h-3.5 text-white -ml-0.5" fill="currentColor" /></button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* KEYBOARD */}
        <div className="bg-[#D1D5DB] h-[260px] px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom),6px)] flex flex-col justify-between shrink-0 z-30">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className={`flex gap-1.5 justify-center ${rowIndex === 1 ? 'px-4' : ''}`}>
              {rowIndex === 2 && <div className="bg-[#ABB2BA] w-10 h-[42px] rounded-[5px] shadow-sm flex items-center justify-center"><ChevronUp className="w-5 h-5 text-black" /></div>}
              {row.map(k => {
                const isActive = activeKey === k;
                const hasTouch = touches.some(t => t.key === k);
                return (
                  <div key={k} className={`relative flex-1 max-w-[34px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] flex items-center justify-center text-[19px] font-bold text-black transition-colors ${isActive ? 'bg-[#ABB2BA]' : 'bg-white'}`}>
                    {k}
                    {hasTouch && <div className="absolute inset-0 bg-black/10 rounded-[5px] animate-ping pointer-events-none" />}
                  </div>
                );
              })}
              {rowIndex === 2 && <div className="bg-[#ABB2BA] w-10 h-[42px] rounded-[5px] shadow-sm flex items-center justify-center"><Delete className="w-5 h-5 text-black" /></div>}
            </div>
          ))}
          <div className="flex gap-1.5 justify-center mt-1">
            <div className="bg-[#ABB2BA] w-[42px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[15px] font-bold flex items-center justify-center text-black">123</div>
            <div className="bg-white w-[42px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[15px] flex items-center justify-center text-black"><Smile className="w-6 h-6" /></div>
            <div className="bg-white flex-1 h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[16px] font-bold flex items-center justify-center text-black">Spasi</div>
            <div className="bg-[#ABB2BA] w-[70px] h-[42px] rounded-[5px] shadow-[0_1px_0_0_rgba(0,0,0,0.3)] text-[15px] font-bold flex items-center justify-center text-black">Kembali</div>
          </div>
          <div className="flex justify-between items-center px-4 mt-1 mb-1">
            <Globe className="w-6 h-6 text-gray-500" strokeWidth={2} />
            <Mic className="w-6 h-6 text-gray-500" strokeWidth={2} />
          </div>
        </div>
      </div>

      {activeImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setActiveImage(null)}>
          <img src={activeImage} alt="Zoomed" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          <span className="absolute bottom-10 text-white/70 text-sm font-medium">Ketuk di mana saja untuk menutup</span>
        </div>
      )}
    </div>
  );
}
