import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        reply: 'Maaf bre, GEMINI_API_KEY belum dipasang di environment server (.env).' 
      }, { status: 500 });
    }

    const contents = history.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const systemInstruction = "Kamu adalah Velicia AI, asisten virtual ramah dan pintar untuk platform FZTOOLS. FZTOOLS (Minimalist Creative Suite) diciptakan oleh Riz Universe (M. Fariz Alfauzi). FZTOOLS berisi alat seperti generator meme, IQC WhatsApp, Brat, Konverter, dan QR Code. Jawablah dengan ringkas, santai, dan asyik menggunakan gaya bahasa gaul Indonesia (panggil user dengan sebutan 'bre'). Jangan terlalu panjang atau kaku.";
    contents[0].parts[0].text = `[SYSTEM INSTRUCTION: ${systemInstruction}]\n\n${contents[0].parts[0].text}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gagal generate response dari Gemini');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf bre, aku lagi bingung nih.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ 
      reply: 'Waduh, server lagi gangguan nih bre. Coba lagi nanti ya!' 
    }, { status: 500 });
  }
}
