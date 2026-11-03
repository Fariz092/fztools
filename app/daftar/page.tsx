'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import {
  UserPlus,
  User,
  Lock,
  Key,
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import {
  computeInitials,
  pickAvatarColor,
  saveUserSession,
  getStoredUserSession,
  UserSession,
} from '@/lib/auth-session';
import { brutalistAlert, brutalistToast } from '@/lib/popup-service';
import { motion } from 'motion/react';

function createRandomCaptcha(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState<string>(() => createRandomCaptcha());
  const [isLoading, setIsLoading] = useState(false);
  const [existingSession, setExistingSession] = useState<UserSession | null>(() =>
    getStoredUserSession()
  );

  const generateCaptcha = () => {
    setCaptchaCode(createRandomCaptcha());
    setCaptchaInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim().replace(/^@+/, '');

    if (!cleanUsername || cleanUsername.length < 3) {
      brutalistToast('Username minimal 3 karakter!', 'error');
      return;
    }

    if (!password || password.length < 4) {
      brutalistToast('Password minimal 4 karakter!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      brutalistToast('Konfirmasi password tidak cocok!', 'error');
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      brutalistToast('Kode captcha salah! Periksa kembali.', 'error');
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      const initials = computeInitials(cleanUsername);
      const avatarColor = pickAvatarColor(cleanUsername);

      const session: UserSession = {
        username: cleanUsername,
        initials,
        avatarColor,
        registeredAt: new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        role: 'VERIFIED MEMBER',
        stats: {
          quotesCreated: 0,
          conversions: 0,
          memesGenerated: 0,
        },
      };

      saveUserSession(session);
      setIsLoading(false);
      setExistingSession(session);

      await brutalistAlert({
        title: 'PENDAFTARAN BERHASIL!',
        message: `Selamat datang @${cleanUsername}!\n\nSesi akun Anda telah berhasil disimpan di browser ini.\n\nInisial profil (${initials}) kini langsung tampil pada menu navigasi.`,
        type: 'success',
        confirmText: 'BUKA PROFIL SAYA',
      });

      router.push('/akun');
    }, 1000);
  };

  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-4 sm:py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-indigo-500 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {existingSession && (
          <div className="mb-6 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 shadow-lg shadow-emerald-500/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                {existingSession.initials}
              </div>
              <div>
                <p className="font-bold text-xs text-zinc-900 dark:text-white">
                  Sesi Aktif: @{existingSession.username}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Anda sudah terdaftar. Mendaftar lagi akan memperbarui sesi.
                </p>
              </div>
            </div>
            <Link
              href="/akun"
              className="px-3.5 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs rounded-xl hover:opacity-90 transition-all shadow-sm"
            >
              Profil
            </Link>
          </div>
        )}

        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-xl shadow-zinc-200/20 dark:shadow-black/20 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <UserPlus className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Buat Akun Kreator
              </h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Simpan sesi pengguna lokal dan personalisasi identitas pada menu aplikasi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-zinc-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Username</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-zinc-400 font-bold text-sm">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username_anda"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 pl-8 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-zinc-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Kata Sandi</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ketik kata sandi..."
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 pr-10 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  title="Lihat Kata Sandi"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-zinc-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Konfirmasi Kata Sandi</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi..."
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verifikasi Keamanan</span>
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:underline cursor-pointer"
                  title="Ganti Kode"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Acak Ulang</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 py-2.5 px-4 bg-zinc-900 text-white rounded-xl text-center select-none font-mono text-xl font-bold tracking-[0.3em] border border-zinc-800">
                  {captchaCode}
                </div>

                <input
                  type="text"
                  required
                  maxLength={4}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  placeholder="KODE"
                  className="w-28 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-center font-mono font-bold text-base tracking-widest text-zinc-900 dark:text-white focus:outline-none uppercase shadow-sm"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Sesi...</span>
                </>
              ) : (
                <span>Daftar & Simpan Sesi</span>
              )}
            </motion.button>

            <div className="text-center pt-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Sudah memiliki sesi?{' '}
                <Link
                  href="/akun"
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Buka Pengaturan Akun
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
