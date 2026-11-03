import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || `tiktok_${Date.now()}.mp4`;

  if (!fileUrl) {
    return NextResponse.json({ error: 'URL diperlukan' }, { status: 400 });
  }

  const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

  try {
    const upstreamRes = await fetch(fileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return NextResponse.redirect(fileUrl);
    }

    const contentType =
      upstreamRes.headers.get('content-type') ||
      (safeFilename.endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4');

    return new Response(upstreamRes.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('Download stream proxy error:', err);
    return NextResponse.redirect(fileUrl);
  }
}
