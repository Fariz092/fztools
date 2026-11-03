'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import {
  User,
  ShieldCheck,
  Calendar,
  LogOut,
  UserPlus,
  CheckCircle2,
  ArrowLeft,
  Key,
} from 'lucide-react';
import {
  UserSession,
  getStoredUserSession,
  clearUserSession,
  AUTH_CHANGE_EVENT,
} from '@/lib/auth-session';
import { brutalistAlert, brutalistConfirm, brutalistToast } from '@/lib/popup-service';
import { motion } from 'motion/react';

export default function AccountPage() {
  const [session, setSession] = useState<UserSession | null>(() => getStoredUserSession());

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
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-600/20 select-none">
                  {session.initials}
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
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="self-start sm:self-center px-4 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-rose-200/50 dark:border-rose-900/40"
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
                      Data akun tersimpan aman di perangkat tanpa pelacakan server.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Inisial Navigasi
                    </span>
                    <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif ({session.initials})
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1">
                      Tampil otomatis pada bilah navigasi header dan sidebar.
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
                    className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-xl font-bold text-xs transition-all border border-indigo-200/50 dark:border-indigo-900/50"
                  >
                    Buka IQC WhatsApp
                  </Link>
                  <Link
                    href="/brat"
                    className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-xl font-bold text-xs transition-all border border-emerald-200/50 dark:border-emerald-900/50"
                  >
                    Buka Brat Generator
                  </Link>
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 rounded-xl font-bold text-xs transition-all cursor-pointer"
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
              Anda sedang menjelajah sebagai tamu. Buat akun gratis untuk menyimpan sesi dan menampilkan inisial personal Anda.
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
