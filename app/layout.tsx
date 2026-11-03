import type { Metadata } from 'next';
import './globals.css';
import AppPopupProvider from '@/components/AppPopupProvider';
import TopProgressBar from '@/components/TopProgressBar';

export const metadata: Metadata = {
  title: 'FZTOOLS - Minimalist Creative & Utility Suite',
  description:
    'Paket alat utilitas modern dan minimalis untuk kreator: konversi file, generator media sosial, kode QR, dan kreasi meme bertenaga AI.',
  openGraph: {
    title: 'FZTOOLS - Minimalist Creative & Utility Suite',
    description:
      'Paket alat utilitas modern dan minimalis untuk kreator: konversi file, generator media sosial, kode QR, dan kreasi meme bertenaga AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FZTOOLS - Minimalist Creative & Utility Suite',
    description:
      'Paket alat utilitas modern dan minimalis untuk kreator: konversi file, generator media sosial, kode QR, dan kreasi meme bertenaga AI.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        suppressHydrationWarning
        className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 selection:bg-indigo-100 dark:selection:bg-indigo-900/30 relative overflow-x-hidden transition-colors duration-300"
      >
        {/* BACKGROUND LIQUID GLOW (Tersembunyi di belakang) */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="bg-glow-orb bg-purple-500/20 w-[300px] h-[300px] top-[-50px] left-[-50px] dark:bg-purple-500/10" />
          <div className="bg-glow-orb bg-teal-500/20 w-[400px] h-[400px] bottom-[-100px] right-[-100px] dark:bg-teal-500/10" />
          <div className="bg-glow-orb bg-indigo-500/20 w-[250px] h-[250px] top-[40%] left-[20%] dark:bg-indigo-500/10" />
        </div>

        <TopProgressBar />
        <AppPopupProvider />

        {/* WRAPPER KONTEN UTAMA */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
