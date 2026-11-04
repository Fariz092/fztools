'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Camera, Flashlight, Lock } from 'lucide-react';

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  return (
    <motion.div 
      drag="y"
      dragConstraints={{ top: -200, bottom: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.y < -80) {
          onUnlock();
        }
      }}
      className="absolute inset-0 z-[100] bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')] bg-cover bg-center flex flex-col items-center cursor-grab active:cursor-grabbing"
    >
      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />

      {/* Jam & Tanggal */}
      <div className="relative z-10 mt-12 text-center text-white">
        <p className="text-[15px] font-medium mb-1">Monday, 5 November</p>
        <h1 className="text-[80px] font-semibold leading-none tracking-tight">09:10</h1>
      </div>

      {/* Notifikasi Spam */}
      <div className="relative z-10 w-full px-4 mt-12 space-y-2 overflow-hidden">
        {/* Spam 1 */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 flex gap-3 text-white border border-white/10">
          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-bold text-[14px]">WhatsApp</span>
              <span className="text-[12px] text-white/70">now</span>
            </div>
            <p className="text-[13px] font-semibold">MyPrincess💖</p>
            <p className="text-[13px]">p</p>
          </div>
        </div>

        {/* Spam 2 */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 flex gap-3 text-white border border-white/10">
          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-bold text-[14px]">WhatsApp</span>
              <span className="text-[12px] text-white/70">1m ago</span>
            </div>
            <p className="text-[13px] font-semibold">MyPrincess💖 (5 messages)</p>
            <p className="text-[13px]">sayankkk, kemana sih,,</p>
          </div>
        </div>

        {/* Spam 3 */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 flex gap-3 text-white border border-white/10">
          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-bold text-[14px]">WhatsApp</span>
              <span className="text-[12px] text-white/70">2m ago</span>
            </div>
            <p className="text-[13px] font-semibold">MyPrincess💖</p>
            <p className="text-[13px]">tau ah males</p>
          </div>
        </div>
      </div>

      {/* Tombol Bawah (Flashlight & Camera) */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-between px-10">
        <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white">
          <Flashlight className="w-5 h-5" />
        </div>
        <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white">
          <Camera className="w-5 h-5" />
        </div>
      </div>

      {/* Indikator Swipe */}
      <div className="absolute bottom-24 left-0 right-0 z-10 flex flex-col items-center gap-2 text-white/70 animate-pulse">
        <Lock className="w-5 h-5 mb-1" />
        <span className="text-[12px] font-bold tracking-wide">swipe ke atas untuk membuka chat</span>
      </div>
    </motion.div>
  );
}
