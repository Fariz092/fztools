import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { ChevronLeft, Video, Phone, Plus, Camera, Mic, Download, CheckCheck } from 'lucide-react';
import { CustomChat } from './Form';
import { Keyboard } from '../ChatUI';

interface PreviewProps {
  name: string;
  avatar: string;
  chats: CustomChat[];
  showKeyboard: boolean;
}

export default function Preview({ name, avatar, chats, showKeyboard }: PreviewProps) {
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!chatAreaRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(chatAreaRef.current, { 
        quality: 1, 
        pixelRatio: 2,
        style: { transform: 'scale(1)' } // Biar ga blur
      });
      const link = document.createElement('a');
      link.download = `custom-au-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Gagal mendownload gambar. Coba lagi.');
      console.error(err);
    }
    setIsDownloading(false);
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-2 mx-auto">
      <button 
        onClick={handleDownload} 
        disabled={isDownloading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
      >
        <Download className="w-5 h-5" /> 
        {isDownloading ? 'Menyimpan...' : 'Download Area Ini'}
      </button>

      <div className="w-full bg-white rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl relative flex flex-col overflow-hidden h-[700px]">
        
        {/* HEADER */}
        <div className="bg-white/30 backdrop-blur-3xl px-3 py-2.5 flex items-center justify-between border-b border-white/20 shadow-sm z-50 shrink-0">
          <div className="flex items-center gap-3">
            <ChevronLeft className="w-6 h-6 text-black" strokeWidth={2.5} />
            <div className="relative w-10 h-10 rounded-full bg-gray-300">
               {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" /> : <div className="w-full h-full bg-gray-300 rounded-full" />}
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-black leading-tight">{name || 'Nama Kontak'}</span>
              <span className="text-[12px] font-medium text-gray-600 leading-tight">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-black">
            <Video className="w-6 h-6" strokeWidth={1.5} />
            <Phone className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </div>

        {/* AREA CHAT (YANG DI SCREENSHOT) */}
        <div 
          ref={chatAreaRef}
          className="flex-1 overflow-y-auto p-3 relative scroll-smooth bg-[#EFEAE2]" 
          style={{ backgroundImage: 'url("/background-wa.png")', backgroundSize: 'cover' }}
        >
          <div className="flex justify-center mb-4">
            <span className="bg-[#E2DCD3]/90 text-[#5E5E5E] text-[11px] font-semibold px-3 py-1 rounded-full">Hari Ini</span>
          </div>

          {chats.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`relative max-w-[85%] rounded-[16px] flex flex-col ${isMe ? 'bg-[#DCF8C6] rounded-tr-[4px]' : 'bg-white rounded-tl-[4px]'} px-2.5 py-1.5`}>
                  {isMe ? (
                    <div className="absolute top-0 -right-[6px] w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="#DCF8C6" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg></div>
                  ) : (
                    <div className="absolute top-0 -left-[6px] w-2 h-3"><svg viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" transform="scale(-1, 1) translate(-8, 0)"></path><path fill="#FFFFFF" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" transform="scale(-1, 1) translate(-8, 0)"></path></svg></div>
                  )}
                  
                  <span className="text-black text-[15px] font-medium pr-14 leading-snug whitespace-pre-wrap">{msg.text || '...'}</span>
                  
                  <div className="absolute bottom-1 right-1.5 flex items-center gap-1">
                    <span className="text-[10px] text-gray-500 font-semibold">{msg.time}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT & KEYBOARD */}
        <div className="bg-[#F6F6F6] p-1.5 flex items-end gap-2 z-30 shrink-0 border-t border-gray-200">
          <div className="w-[36px] h-[36px] flex items-center justify-center shrink-0 text-gray-600"><Plus className="w-6 h-6" strokeWidth={1.5} /></div>
          <div className="flex-1 bg-white rounded-3xl flex items-end px-2 py-1 border border-gray-300 min-h-[36px]">
            <span className="text-[14px] font-medium text-gray-400 py-1 pl-1">Ketik pesan</span>
            <div className="ml-auto flex items-center gap-2 pb-1">
              <Camera className="w-5 h-5 text-gray-500" />
              <Mic className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
        
        {showKeyboard && <Keyboard activeKey={null} touches={[]} isEmoji={false} onEmojiClick={() => {}} />}
      </div>
    </div>
  );
}
