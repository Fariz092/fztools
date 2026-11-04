'use client';

import React, { useState } from 'react';
import ChatList from './ChatList';
import PrincessRoom from './PrincessRoom';
import FazrullRoom from './FazrullRoom';

type ScreenView = 'list' | 'princess' | 'fazrull';

export default function ChatStoryTool() {
  const [screen, setScreen] = useState<ScreenView>('list');

  return (
    <div className="w-full flex flex-col items-center gap-3 font-sans">
      <div className="w-full max-w-[400px] h-[85dvh] sm:h-[800px] bg-white rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl relative flex flex-col overflow-hidden">
        
        {screen === 'list' && (
          <ChatList 
            onOpenPrincess={() => setScreen('princess')} 
            onOpenFazrull={() => setScreen('fazrull')} 
          />
        )}

        {screen === 'princess' && (
          <PrincessRoom onBack={() => setScreen('list')} />
        )}

        {screen === 'fazrull' && (
          <FazrullRoom onBack={() => setScreen('list')} />
        )}

      </div>
    </div>
  );
}
