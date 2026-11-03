import type { Metadata } from 'next';
import './globals.css';
import AppPopupProvider from '@/components/AppPopupProvider';

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
      <body suppressHydrationWarning className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 selection:bg-indigo-100 dark:selection:bg-indigo-900/30 relative overflow-x-hidden transition-colors duration-300">
        
        <AppPopupProvider />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
