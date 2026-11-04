import React, { useRef } from 'react';
import { Plus, Trash2, Upload, User, MessageSquare } from 'lucide-react';

export interface CustomChat {
  id: string;
  sender: 'me' | 'them';
  time: string;
  text: string;
}

interface FormProps {
  name: string;
  setName: (val: string) => void;
  avatar: string;
  setAvatar: (val: string) => void;
  chats: CustomChat[];
  setChats: (val: CustomChat[]) => void;
  showKeyboard: boolean;
  setShowKeyboard: (val: boolean) => void;
}

export default function Form({ name, setName, avatar, setAvatar, chats, setChats, showKeyboard, setShowKeyboard }: FormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addChat = () => {
    if (chats.length >= 15) return alert('Maksimal 15 chat bre biar ga berat!');
    const newChat: CustomChat = {
      id: Date.now().toString(),
      sender: 'me',
      time: '22.00',
      text: ''
    };
    setChats([...chats, newChat]);
  };

  const updateChat = (id: string, field: keyof CustomChat, value: string) => {
    setChats(chats.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeChat = (id: string) => {
    setChats(chats.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4 pb-10">
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="font-bold text-sm text-zinc-800 mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Profil Kontak</h3>
        <div className="flex items-center gap-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-full bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 hover:bg-zinc-200 transition-colors"
          >
            {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-zinc-400" />}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          <div className="flex-1 space-y-2">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nama Kontak (misal: MyPrincess)"
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
              <input type="checkbox" checked={showKeyboard} onChange={(e) => setShowKeyboard(e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
              Tampilkan Keyboard (Pajangan)
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-zinc-800 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> List Chat</h3>
          <button onClick={addChat} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-700">
            <Plus className="w-3 h-3" /> Tambah
          </button>
        </div>
        
        <div className="space-y-3">
          {chats.map((chat, idx) => (
            <div key={chat.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl relative">
              <div className="flex gap-2 mb-2">
                <select 
                  value={chat.sender} 
                  onChange={(e) => updateChat(chat.id, 'sender', e.target.value)}
                  className="text-xs px-2 py-1 border border-zinc-300 rounded-lg bg-white"
                >
                  <option value="me">Kanan (Saya)</option>
                  <option value="them">Kiri (Dia)</option>
                </select>
                <input 
                  type="text" 
                  value={chat.time} 
                  onChange={(e) => updateChat(chat.id, 'time', e.target.value)}
                  placeholder="Jam (22.30)"
                  className="w-20 text-xs px-2 py-1 border border-zinc-300 rounded-lg bg-white text-center"
                />
                <button onClick={() => removeChat(chat.id)} className="ml-auto text-red-500 p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea 
                value={chat.text}
                onChange={(e) => updateChat(chat.id, 'text', e.target.value)}
                placeholder="Isi pesan..."
                rows={2}
                className="w-full text-sm px-2 py-1.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          ))}
          {chats.length === 0 && (
            <p className="text-xs text-center text-zinc-400 py-4">Belum ada chat. Klik Tambah.</p>
          )}
        </div>
      </div>
    </div>
  );
}
