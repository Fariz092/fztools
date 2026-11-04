'use client';

import React from 'react';
import { Search, Edit, MessageSquare, PhoneCall, Settings, Camera as CameraIcon } from 'lucide-react';

export default function ChatList({
  onOpenPrincess,
  onOpenFazrull,
  princessPreview = "ketik dan tahan pada chat untuk opsi",
  fazrullPreview = "ketik dan tahan pada chat untuk opsi",
  princessTime = "22.31",
  fazrullTime = "22.31",
  princessUnread = false,
  fazrullUnread = true,
  princessAvatar = "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
}: any) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-white px-4 pt-4 pb-2 flex justify-between items-center">
        <span className="text-[#007AFF] text-[17px]">Edit</span>
        <Edit className="w-6 h-6 text-[#007AFF]" />
      </div>
      <h1 className="px-4 text-[34px] font-bold text-black tracking-tight mb-3">Chat</h1>
      
      <div className="px-4 mb-4">
        <div className="bg-[#E3E3E8] rounded-[12px] flex items-center px-3 py-2 h-[36px]">
          <Search className="w-5 h-5 text-[#8E8E93] mr-2" />
          <span className="text-[#8E8E93] text-[17px]">Cari</span>
        </div>
      </div>

      <div className="px-4 flex justify-between items-center mb-4">
        <span className="text-[#007AFF] text-[17px]">Siaran baru</span>
        <span className="text-[#007AFF] text-[17px]">Grup baru</span>
      </div>

      <div className="px-4 flex items-center justify-between py-2 border-b border-gray-200 ml-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </div>
          <span className="text-[17px] text-black">Diarsipkan</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* MyPrincess */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer active:bg-gray-50" onClick={onOpenPrincess}>
          <div className="relative w-12 h-12 rounded-full bg-gray-300 mr-3">
             <img src={princessAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex-1 border-b border-gray-100 pb-3 pt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[17px] font-semibold text-black">MyPrincess💖</span>
              <span className="text-[15px] text-gray-500">{princessTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-gray-500 line-clamp-1">{princessPreview}</span>
              {princessUnread && <div className="w-5 h-5 bg-[#007AFF] rounded-full flex items-center justify-center text-white text-[11px] font-bold">1</div>}
            </div>
          </div>
        </div>

        {/* Fazrull */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer active:bg-gray-50" onClick={onOpenFazrull}>
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-3 shrink-0">
             <svg viewBox="0 0 24 24" fill="#8E8E93" className="w-8 h-8 mt-2"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div className="flex-1 border-b border-gray-100 pb-3 pt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[17px] font-semibold text-black">Fazrull</span>
              <span className="text-[15px] text-gray-500">{fazrullTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-gray-500 line-clamp-1">{fazrullPreview}</span>
              {fazrullUnread && <div className="w-5 h-5 bg-[#007AFF] rounded-full flex items-center justify-center text-white text-[11px] font-bold">1</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-[#F9F9F9] border-t border-gray-200 flex justify-between items-center px-6 py-2 pb-6">
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <div className="w-6 h-6 rounded-full border-2 border-gray-600 p-[2px]"><div className="w-full h-full border border-gray-600 rounded-full"></div></div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#007AFF] rounded-full border border-white"></div>
          </div>
          <span className="text-[10px] text-black">Status</span>
        </div>
        <div className="flex flex-col items-center gap-1"><PhoneCall className="w-6 h-6 text-gray-600" /><span className="text-[10px] text-black">Panggilan</span></div>
        <div className="flex flex-col items-center gap-1"><CameraIcon className="w-6 h-6 text-gray-600" /><span className="text-[10px] text-black">Kamera</span></div>
        <div className="flex flex-col items-center gap-1"><MessageSquare className="w-6 h-6 text-[#007AFF]" fill="#007AFF" /><span className="text-[10px] text-[#007AFF]">Chat</span></div>
        <div className="flex flex-col items-center gap-1"><Settings className="w-6 h-6 text-gray-600" /><span className="text-[10px] text-black">Setelan</span></div>
      </div>
    </div>
  );
}
