
import { NextRequest, NextResponse } from 'next/server';
import kv from '@/lib/kv';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-telegram-bot-api-secret-token');
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const video = body?.message?.video || body?.message?.document;
  if (!video) return NextResponse.json({ status: 'no_video' });

  await kv.set('latest_file_id', video.file_id);
  return NextResponse.json({ status: 'ok' });
}
