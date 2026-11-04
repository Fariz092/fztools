import React, { useState } from 'react';
import Form, { CustomChat } from './Form';
import Preview from './Preview';

export default function CustomAUMaker() {
  const [name, setName] = useState('MyPrincess💖');
  const [avatar, setAvatar] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [chats, setChats] = useState<CustomChat[]>([
    { id: '1', sender: 'them', time: '22.00', text: 'babe, udah tidur?' },
    { id: '2', sender: 'me', time: '22.01', text: 'belum sayang, kenapa?' }
  ]);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-zinc-900 mb-2">Custom AU Maker</h1>
          <p className="text-sm text-zinc-500">Buat cerita fake chat sendiri. Isi form di bawah, lalu download bagian chat yang kamu mau!</p>
        </div>
        <Form 
          name={name} setName={setName}
          avatar={avatar} setAvatar={setAvatar}
          chats={chats} setChats={setChats}
          showKeyboard={showKeyboard} setShowKeyboard={setShowKeyboard}
        />
      </div>
      
      <div className="w-full lg:sticky lg:top-24">
        <Preview name={name} avatar={avatar} chats={chats} showKeyboard={showKeyboard} />
      </div>
    </div>
  );
}
