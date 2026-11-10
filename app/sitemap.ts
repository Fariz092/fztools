import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fztools.vercel.app'
  const routes = ['', '/akun', '/brat', '/converter', '/daftar', '/fakett', '/faq', '/ig-note', '/iqc', '/iqc-tiktok', '/iqcv2', '/link-expander', '/meme', '/privasi', '/qr', '/sarcastic', '/subnet', '/tentang', '/tiktok']

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
