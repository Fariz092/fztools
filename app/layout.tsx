import type { Metadata } from 'next';
import './globals.css';
import AppPopupProvider from '@/components/AppPopupProvider';
import LiquidGlassFilter from '@/components/LiquidGlassFilter';

const SITE_URL = 'https://fztools.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FZTOOLS - Minimalist Creative & Utility Suite',
    template: '%s | FZTOOLS',
  },
  description:
    'Paket alat utilitas modern dan minimalis untuk kreator: konversi file, generator media sosial, kode QR, dan kreasi meme bertenaga AI.',
  authors: [
    {
      name: 'M. Fariz Alfauzi',
      url: SITE_URL,
    },
  ],
  creator: 'M. Fariz Alfauzi',
  publisher: 'FZTOOLS',
  openGraph: {
    title: 'FZTOOLS - Minimalist Creative & Utility Suite',
    description:
      'Paket alat utilitas modern dan minimalis untuk kreator: konversi file, generator media sosial, kode QR, dan kreasi meme bertenaga AI.',
    type: 'website',
    url: SITE_URL,
    siteName: 'FZTOOLS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FZTOOLS - Minimalist Creative & Utility Suite',
    description:
      'Paket alat utilitas modern dan minimalis untuk kreator: konversi file, generator media sosial, kode QR, dan kreasi meme bertenaga AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'uzCSdEaJ9uf0ZVpX5uPikbuu_rByF9wVnyRbdu2s-W4',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#developer`,
      name: 'M. Fariz Alfauzi',
      jobTitle: 'Software Developer & Programmer',
      description:
        'M. Fariz Alfauzi adalah seorang pengembang perangkat lunak dan programmer asal Cianjur, Jawa Barat, yang lahir pada Agustus 2008. Saat ini ia menempuh pendidikan di SMK Nurul Islam Cianjur Affandiyah, kelas XI, dengan jurusan Teknik Jaringan Komputer dan Telekomunikasi (TJKT). Ia merupakan pengembang di balik platform FZTOOLS, XHZELL-AI, 4STRO.AI Dashboard, dan Velicia AI.',
      url: SITE_URL,
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'SMK Nurul Islam Cianjur Affandiyah',
      },
      knowsAbout: [
        'Software Development',
        'Web Development',
        'Artificial Intelligence',
        'Computer Network Engineering',
        'Telecommunications',
      ],
      owns: [
        { '@type': 'WebSite', name: 'FZTOOLS', url: SITE_URL },
        { '@type': 'SoftwareApplication', name: 'XHZELL-AI' },
        { '@type': 'SoftwareApplication', name: '4STRO.AI Dashboard' },
        { '@type': 'SoftwareApplication', name: 'Velicia AI' },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'FZTOOLS',
      description:
        'Paket alat utilitas modern dan minimalis untuk kreator: konversi file, generator media sosial, kode QR, dan kreasi meme bertenaga AI.',
      publisher: {
        '@id': `${SITE_URL}/#developer`,
      },
      inLanguage: 'id-ID',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#app`,
      name: 'FZTOOLS',
      url: SITE_URL,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'IDR',
      },
      author: {
        '@id': `${SITE_URL}/#developer`,
      },
    },
  ],
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
        <LiquidGlassFilter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <AppPopupProvider />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
