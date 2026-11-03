import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== 'string' || !url.includes('tiktok.com')) {
      return NextResponse.json(
        { error: 'URL TikTok tidak valid. Pastikan link berasal dari tiktok.com atau vt.tiktok.com' },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();

    // Mesin Utama: TikWM API (Server-side tanpa hambatan CORS)
    try {
      const tikwmRes = await fetch('https://www.tikwm.com/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        body: new URLSearchParams({
          url: cleanUrl,
          count: '12',
          cursor: '0',
          web: '1',
          hd: '1',
        }),
      });

      if (tikwmRes.ok) {
        const json = await tikwmRes.json();
        if (json.code === 0 && json.data) {
          const d = json.data;
          const formatUrl = (u?: string) => {
            if (!u) return '';
            return u.startsWith('http') ? u : `https://www.tikwm.com${u}`;
          };

          return NextResponse.json({
            success: true,
            title: d.title || 'TikTok Media',
            author: {
              nickname: d.author?.nickname || d.author?.unique_id || 'TikTok Creator',
              avatar: formatUrl(d.author?.avatar),
            },
            stats: {
              likeCount: Number(d.digg_count || 0).toLocaleString('id-ID'),
              commentCount: Number(d.comment_count || 0).toLocaleString('id-ID'),
              shareCount: Number(d.share_count || 0).toLocaleString('id-ID'),
            },
            video: {
              noWatermark: formatUrl(d.play),
              watermark: formatUrl(d.wmplay),
              hd: formatUrl(d.hdplay || d.play),
            },
            music: {
              url: formatUrl(d.music || d.music_info?.play),
              title: d.music_info?.title || d.music || 'Original Audio',
            },
            thumbnail: formatUrl(d.cover || d.origin_cover),
            images: Array.isArray(d.images) ? d.images.map((img: string) => formatUrl(img)) : [],
          });
        }
      }
    } catch (tikwmErr) {
      console.warn('TikWM server error, mencoba cadangan:', tikwmErr);
    }

    // Mesin Cadangan (Fallback): TiklyDown API
    try {
      const tiklyRes = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(cleanUrl)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });

      if (tiklyRes.ok) {
        const json = await tiklyRes.json();
        const res = json.result || json.data;
        if (res) {
          return NextResponse.json({
            success: true,
            title: res.title || res.description || 'TikTok Media',
            author: {
              nickname: res.author?.nickname || res.author?.name || 'TikTok Creator',
              avatar: res.author?.avatar || '',
            },
            stats: {
              likeCount: String(res.statistics?.likeCount || res.stats?.likes || '0'),
              commentCount: String(res.statistics?.commentCount || res.stats?.comments || '0'),
              shareCount: String(res.statistics?.shareCount || res.stats?.shares || '0'),
            },
            video: {
              noWatermark: res.video?.noWatermark || res.video?.url_list?.[0] || '',
              watermark: res.video?.watermark || '',
              hd: res.video?.hd || res.video?.noWatermark || '',
            },
            music: {
              url: res.music?.play_url || res.music?.url || '',
              title: res.music?.title || 'Original Audio',
            },
            thumbnail: res.video?.cover || res.video?.origin_cover || res.cover || '',
            images: Array.isArray(res.images) ? res.images.map((i: any) => typeof i === 'string' ? i : i.url) : [],
          });
        }
      }
    } catch (tiklyErr) {
      console.warn('TiklyDown fallback error:', tiklyErr);
    }

    return NextResponse.json(
      { error: 'Gagal memproses video. Pastikan video bersifat publik dan tautan tidak kedaluwarsa.' },
      { status: 502 }
    );
  } catch (err: any) {
    console.error('Fatal TikTok Route Error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat menghubungi server pengunduh.' },
      { status: 500 }
    );
  }
}
