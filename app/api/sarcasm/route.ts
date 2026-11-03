import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: NextRequest) {
  try {
    const { topic, tone = 'pedas' } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Topik harus diisi' }, { status: 400 });
    }

    if (!ai) {
      // Fallback offline curated sarcastic lines if API key is not yet set
      const offlineSarcasms = [
        {
          headline: 'SI PALING LOYALITAS',
          quote: `Kerja keras bagai kuda demi ${topic}, ujung-ujungnya cuma dapat ucapan "terima kasih tim hebat" di grup WA.`,
          subtext: 'Disponsori oleh kopi sasetan dan asam lambung akut.',
          topText: 'KERJA LEMBUR TIAP MALAM',
          bottomText: 'GAJI HABIS SEBELUM TANGGAL 5',
        },
        {
          headline: 'MOTIVASI ATAU HALUSINASI',
          quote: `Fokus banget ngejar ${topic}, tapi tabungan lebih sering menangis daripada saldo bertambah.`,
          subtext: 'Bukan pelit, cuma mengapresiasi kemiskinan yang terstruktur.',
          topText: 'KATANYA USAHA GAK MENGKHIANATI HASIL',
          bottomText: 'TAPI KENAPA HASILNYA MENGKHIANATI SAYA?',
        },
        {
          headline: 'SENYUM PALSU TERBAIK',
          quote: `Mengikhlaskan ${topic} dengan senyuman, padahal di dalam hati udah nyiapin 100 lembar surat pengunduran diri.`,
          subtext: 'Status: Masih bernafas demi cicilan bulan depan.',
          topText: 'TETAP TERSENYUM',
          bottomText: 'WALAUPUN JIWANYA SUDAH MENINGGAL',
        },
      ];
      return NextResponse.json({ results: offlineSarcasms });
    }

    const systemPrompt = `Kamu adalah master pembuat meme sarkastik Indonesia dengan selera humor tajam, relatable, satir, sinis, dan lucu khas netizen Konoha / Twitter / TikTok Indonesia.
Hasilkan 3 variasi lelucon / kutipan meme sarkastik yang menusuk dan bikin ketawa mengenai topik yang diberikan pengguna.

Format keluaran WAJIB berupa JSON array valid tanpa markdown formatting tambahan atau backticks:
[
  {
    "headline": "JUDUL SARKAS SINGKAT DALAM HURUF BESAR (2-4 kata)",
    "quote": "Kutipan atau sindiran sarkastik yang tajam dan mengena (1-2 kalimat)",
    "subtext": "Catatan kaki sinis / lucu (contoh: Disponsori oleh dompet tipis dan overthinking)",
    "topText": "Teks atas untuk format meme standar (pendek, huruf kapital)",
    "bottomText": "Teks bawah punchline meme (pendek, huruf kapital)"
  }
]`;

    const userPrompt = `Topik: "${topic}". Gaya nada sarkas: "${tone}". Buat 3 punchline sarkastik terbaikmu dalam bahasa Indonesia gaul/netizen yang sangat mengena!`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '[]';
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // try to extract json from possible text wrapper
      const match = responseText.match(/\[[\s\S]*\]/);
      parsed = match ? JSON.parse(match[0]) : [];
    }

    return NextResponse.json({ results: Array.isArray(parsed) && parsed.length > 0 ? parsed : [] });
  } catch (error) {
    console.error('Sarcasm API error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat meme sarkastik via AI. Menggunakan mode cadangan.' },
      { status: 500 }
    );
  }
}
