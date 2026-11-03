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
      <body suppressHydrationWarning className="bg-zinc-50 min-h-screen text-zinc-900 selection:bg-indigo-100">
        <TopProgressBar />
        <AppPopupProvider />
        {children}
      </body>
    </html>
  );
}
