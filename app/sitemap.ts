import type { MetadataRoute } from 'next';

const SITE_URL = 'https://fztools.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const toolRoutes = [
    '',
    '/converter',
    '/brat',
    '/iqc',
    '/iqcv2',
    '/qr',
    '/fakett',
    '/meme',
    '/sarcastic',
    '/tiktok',
    '/akun',
    '/daftar',
    '/tentang',
    '/faq',
    '/privasi',
  ];

  return toolRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
