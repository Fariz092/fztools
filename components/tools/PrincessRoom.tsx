'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Play, Pause, Bell, Send, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, MessageBubble, Keyboard } from './ChatUI';

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
  { sender: 'them', type: 'voice', content: "vn: (suara langkah kaki, ketawa pelan)", time: '22.29', duration: '0:07', audioSrc: '/voice-cewe4.mp3' },
  { sender: 'me', type: 'voice', content: "vn: (suara panik, napas berat)", time: '22.30', duration: '0:06', audioSrc: '/voice-cowo4.mp3' },
];

export default function PrincessRoom({ onFinish }: { onFinish: () => void }) {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [typingSender, setTypingSender] = useState<'me' | 'them' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [isWaitingForContinue, setIsWaitingForContinue] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const continueResolver = useRef<(() => void) | null>(null);

  const [activeVnId, setActiveVnId] = useState<number | null>(null);
  const [vnProgress, setVnProgress] = useState(0);
  const [vnDurationText, setVnDurationText] = useState('0:00');
  const [touches, setTouches] = useState<{id: number, key: string}[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const voiceNoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

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

    const runSequence = async () => {
      await new Promise(r => setTimeout(r, 1000));

      for (let i = 0; i < STORY_SCRIPT.length; i++) {
        const msg = STORY_SCRIPT[i];
        const msgId = Date.now() + i;

        if (msg.sender === 'them') {
          setTypingSender('them');
          await new Promise(r => setTimeout(r, msg.type === 'voice' ? 2000 : 1800)); 
          setTypingSender(null);
          
          const newMsg = { ...msg, id: msgId };
          setDisplayedMessages(prev => [...prev, newMsg]);

          if (msg.type === 'image') {
            setIsWaitingForContinue(true);
            await new Promise<void>((resolve) => {
              continueResolver.current = () => { setIsWaitingForContinue(false); resolve(); };
            });
          } else if (msg.type === 'voice') {
            const vnAudio = new Audio(msg.audioSrc);
            await new Promise<void>((resolve) => {
              vnAudio.play().then(() => {
                setActiveVnId(msg.id);
                const interval = setInterval(() => {
                  if (vnAudio.duration) {
                    setVnProgress((vnAudio.currentTime / vnAudio.duration) * 100);
                    const m = Math.floor(vnAudio.currentTime / 60); const s = Math.floor(vnAudio.currentTime % 60);
                    setVnDurationText(`${m}:${s < 10 ? '0' : ''}${s}`);
                  }
                }, 100);
                vnAudio.onended = () => { clearInterval(interval); setActiveVnId(null); setVnProgress(0); setVnDurationText('0:00'); resolve(); };
              }).catch(() => setTimeout(resolve, 3000));
            });
          } else {
            await new Promise(r => setTimeout(r, 1000));
          }
        } else {
          if (msg.type === 'voice') {
            setIsRecording(true); 
            const targetSecs = parseInt(msg.duration?.split(':')[1] || '5');
            let currentSec = 0; setRecordTime(0);
            const recInterval = setInterval(() => { currentSec++; setRecordTime(currentSec); if (currentSec >= targetSecs) clearInterval(recInterval); }, 1000);
            await new Promise(r => setTimeout(r, targetSecs * 1000 + 1000)); 
            clearInterval(recInterval); setIsRecording(false);
            
            const newMsg = { ...msg, id: msgId, status: 'sent' as any };
            setDisplayedMessages(prev => [...prev, newMsg]);
            
            if (i === STORY_SCRIPT.length - 1) {
              await new Promise(r => setTimeout(r, 1500)); 
              setDisplayedMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read', reaction: '❤️' } : m)); 
              await new Promise(r => setTimeout(r, 2500)); 
              setIsOffline(true); 
              await new Promise(r => setTimeout(r, 2000)); 
              onFinish(); // SELESAI, KEMBALI KE LIST
            } else {
              await new Promise(r => setTimeout(r, 1500));
              setDisplayedMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' } : m));
              await new Promise(r => setTimeout(r, 1000));
            }
          } else {
            setTypingSender('me');
            const text = msg.content;
            for (let j = 0; j <= text.length; j++) {
              const char = text[j - 1];
              if (char && char !== ' ') {
                setActiveKey(char.toLowerCase());
                const id = Date.now() + Math.random();
                setTouches(prev => [...prev, { id, key: char.toLowerCase() }]);
                setTimeout(() => setTouches(prev => prev.filter(t => t.id !== id)), 300);
              } else {
                setActiveKey(null);
              }
              setDisplayedMessages(prev => {
                if (prev.length === 0 || prev[prev.length - 1].id !== msgId) {
                  return [...prev, { ...msg, id: msgId, content: text.slice(0, j), status: 'sent' }];
                }
                return prev.map(m => m.id === msgId ? { ...m, content: text.slice(0, j) } : m);
              });
              await new Promise(r => setTimeout(r, Math.floor(Math.random() * 40) + 50)); 
            }

            if (msg.isTypo) {
              await new Promise(r => setTimeout(r, 500));
              for (let k = 0; k < 3; k++) { 
                setDisplayedMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: m.content.slice(0, -1) } : m));
                await new Promise(r => setTimeout(r, 150)); 
              }
              await new Promise(r => setTimeout(r, 600));
              const typoFix = "na? jangan bikin panik";
              for (let k = 0; k < typoFix.length; k++) {
                setDisplayedMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: m.content + typoFix[k] } : m));
                setActiveKey(typoFix[k].toLowerCase());
                await new Promise(r => setTimeout(r, 80));
              }
            }
            
            setActiveKey(null);
            await new Promise(r => setTimeout(r, 400));
            setTypingSender(null);
            setDisplayedMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'sent' } : m));
            
            await new Promise(r => setTimeout(r, 2000));
            setDisplayedMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' } : m));
            await new Promise(r => setTimeout(r, 1000));
          }
        }
        
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
    runSequence();
    return () => { audio.pause(); audio.removeEventListener('timeupdate', handleTimeUpdate); audio.removeEventListener('ended', handleEnded); };
  }, []);

  return (
    <>
      {/* HEADER GLASSMORPHISM BERSIH */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-3xl px-3 py-2.5 flex items-center justify-between border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-gray-300">
             <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover rounded-full" />
             {!isOffline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full transition-all duration-300"></div>}
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-black leading-tight">MyPrincess💖</span>
            <div className="h-[16px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={isOffline ? 'offline' : isRecording ? 'recording' : typingSender === 'them' ? 'typing' : 'online'}
                  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-[12px] font-medium text-gray-600 leading-tight block"
                >
                  {isOffline ? 'terakhir dilihat 22.31' : isRecording ? 'Merekam Audio...' : typingSender === 'them' ? 'sedang mengetik...' : 'Online'}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-black">
          <Video className="w-6 h-6" strokeWidth={1.5} />
          <Phone className="w-5 h-5" strokeWidth={1.5} />
        </div>
      </div>

      {isWaitingForContinue && (
        <div className="absolute top-4 left-2 right-2 z-[60] animate-in slide-in-from-top-10 duration-500 fade-in">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D1D1D6] flex items-center justify-center shrink-0"><Bell className="w-5 h-5 text-black" /></div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pemberitahuan Sistem</p>
              <p className="text-[13px] font-semibold text-black leading-tight mt-0.5">Pesan baru: Foto dari MyPrincess</p>
            </div>
            <button onClick={() => continueResolver.current && continueResolver.current()} className="bg-[#007AFF] text-white text-xs font-bold px-4 py-2 rounded-full shrink-0">Lanjut</button>
          </div>
        </div>
      )}

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 pt-[70px] relative scroll-smooth bg-[#EFEAE2]" style={{ backgroundImage: 'url("/background-wa.png")', backgroundSize: 'cover' }}>
        <div className="flex justify-center mb-4">
          <span className="bg-[#E2DCD3]/90 text-[#5E5E5E] text-[11px] font-semibold px-3 py-1 rounded-full">4 November 2026</span>
        </div>
        {displayedMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isVnPlaying={activeVnId === msg.id} vnProgress={vnProgress} vnDurationText={vnDurationText} toggleVoiceNote={() => {}} setActiveImage={setActiveImage} />
        ))}
        {typingSender === 'them' && (
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
      
      <Keyboard activeKey={activeKey} touches={touches} isEmoji={false} onEmojiClick={() => {}} />

      {activeImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setActiveImage(null)}>
          <img src={activeImage} alt="Zoomed" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
}
