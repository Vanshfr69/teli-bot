
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');
  if (!path) return new Response('Missing path', { status: 400 });

  const tgUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${path}`;
  const range = req.headers.get('range') || '';

  const tgRes = await fetch(tgUrl, { headers: range ? { range } : {} });
  return new Response(tgRes.body, {
    status: tgRes.status,
    headers: {
      'Content-Type': tgRes.headers.get('content-type') || 'video/mp4',
      'Content-Length': tgRes.headers.get('content-length') || '',
      'Accept-Ranges': 'bytes',
    },
  });
}
