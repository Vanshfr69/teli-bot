
import { NextResponse } from 'next/server';
import kv from '@/lib/kv';

export async function GET() {
  const fileId = await kv.get<string>('latest_file_id');
  if (!fileId) return NextResponse.json({ url: null });

  const tgRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
  const tgData = await tgRes.json();
  if (!tgData.ok) return NextResponse.json({ url: null });

  const filePath = tgData.result.file_path;
  const url = `/api/proxy?path=${encodeURIComponent(filePath)}`;
  return NextResponse.json({ url });
}
