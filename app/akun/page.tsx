'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import {
  User,
  Calendar,
  LogOut,
  UserPlus,
  ArrowLeft,
  Camera,
  Trash2,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import {
  UserSession,
  getStoredUserSession,
  saveUserSession,
  clearUserSession,
  AUTH_CHANGE_EVENT,
} from '@/lib/auth-session';
import { brutalistAlert, brutalistConfirm, brutalistToast } from '@/lib/popup-service';

export default function AccountPage() {
  const [session, setSession] = useState<UserSession | null>(() => getStoredUserSession());
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<UserSession | null>;
      setSession(custom.detail || null);
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  const handleLogout = async () => {
    const confirmed = await brutalistConfirm(
      'KONFIRMASI KELUAR',
      'Apakah Anda yakin ingin keluar dari akun ini? Sesi lokal dan inisial akan dibersihkan.'
    );

    if (confirmed) {
      clearUserSession();
      brutalistToast('Sesi akun berhasil dikeluarkan.', 'info');
    }
  };

  const handleChangePassword = async () => {
    await brutalistAlert({
      title: 'PENGATURAN KEAMANAN',
      message:
        'Sandi akun lokal tersimpan aman di browser Anda. Untuk mengubah password, silakan daftar ulang dengan username yang sama atau buat profil baru.',
      type: 'info',
    });
  };

  // Kompresi dan simpan foto ke sesi pengguna
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;

    if (!file.type.startsWith('image/')) {
      brutalistToast('Harap pilih file gambar (JPG, PNG, atau WEBP)!', 'error');
      return;
    }

    setIsProcessingPhoto(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Buat canvas persegi 256x256 untuk performa maksimal
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setIsProcessingPhoto(false);
          brutalistToast('Gagal memproses gambar.', 'error');
          return;
        }

        // Potong gambar secara proporsional di tengah (Center Crop 1:1)
        const minDim = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - minDim) / 2;
        const sy = (img.naturalHeight - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        const updatedSession: UserSession = {
          ...session,
          avatarUrl: compressedDataUrl,
        };

        saveUserSession(updatedSession);
        setSession(updatedSession);
        setIsProcessingPhoto(false);
        brutalistToast('Foto profil berhasil dipasang!', 'success');
      };

      img.onerror = () => {
        setIsProcessingPhoto(false);
        brutalistToast('Gagal membaca gambar.', 'error');
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
    // Reset value input file
    e.target.value = '';
  };

  const handleRemovePhoto = async () => {
    if (!session || !session.avatarUrl) return;

    const confirmed = await brutalistConfirm(
      'HAPUS FOTO PROFIL',
      'Apakah Anda ingin menghapus foto profil dan kembali menggunakan inisial nama?'
    );

    if (confirmed) {
      const updatedSession: UserSession = { ...session };
      delete updatedSession.avatarUrl;

      saveUserSession(updatedSession);
      setSession(updatedSession);
      brutalistToast('Foto profil dihapus, kembali ke inisial.', 'info');
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-4 sm:py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-indigo-500 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {session ? (
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl shadow-zinc-200/20 dark:shadow-black/20 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                {/* Avatar Box dengan Tombol Kamera */}
                <div className="relative group/avatar shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg shadow-indigo-600/20 overflow-hidden select-none border border-zinc-200/50 dark:border-zinc-800">
                    {session.avatarUrl ? (
                      <img
                        src={session.avatarUrl}
                        alt={session.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{session.initials}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingPhoto}
                    className="absolute -bottom-1.5 -right-1.5 p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl shadow-md border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Ganti Foto Profil"
                  >
                    {isProcessingPhoto ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Camera className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Sesi Aktif
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      {session.role}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    @{session.username}
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Terdaftar: {session.registeredAt}
                  </p>

                  {session.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 mt-2 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus Foto (Gunakan Inisial)</span>
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="self-start sm:self-center px-4 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-rose-200/50 dark:border-rose-900/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Sesi</span>
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  Informasi Sesi Lokal
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Penyimpanan
                    </span>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white mt-0.5">
                      LocalStorage Peramban
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1">
                      Foto dan profil tersimpan secara privat di perangkat Anda.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Status Identitas
                    </span>
                    <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {session.avatarUrl ? 'Foto Pribadi Aktif' : `Inisial Aktif (${session.initials})`}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1">
                      Identitas ini otomatis ditampilkan pada bilah navigasi atas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  Aksi Cepat
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href="/iqc"
                    className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 rounded-xl font-bold text-xs transition-all border border-indigo-200/50 dark:border-indigo-900/50"
                  >
                    Buka IQC WhatsApp
                  </Link>
                  <Link
                    href="/brat"
                    className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 rounded-xl font-bold text-xs transition-all border border-emerald-200/50 dark:border-emerald-900/50"
                  >
                    Buka Brat Generator
                  </Link>
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Keamanan Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl shadow-zinc-200/20 dark:shadow-black/20 p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
              Belum Ada Sesi Pengguna
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
              Anda sedang menjelajah sebagai tamu. Buat akun gratis untuk menyimpan sesi dan memasang foto profil personal Anda.
            </p>
            <Link
              href="/daftar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Akun Sekarang</span>
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}
