import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('file_id');
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!fileId) {
    return new Response('Missing file_id', { status: 400 });
  }
  if (!token) {
    return new Response('Server missing TELEGRAM_BOT_TOKEN env', { status: 500 });
  }

  try {
    const api = `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`;
    const r = await fetch(api, { cache: 'no-store' });
    if (!r.ok) {
      const text = await r.text();
      return new Response(`Telegram getFile failed: ${text}`, { status: 502 });
    }
    const json = await r.json();
    const path = json?.result?.file_path as string | undefined;
    if (!path) {
      return new Response('No file_path in Telegram response', { status: 404 });
    }

    const fileUrl = `https://api.telegram.org/file/bot${token}/${path}`;
    const enc = Buffer.from(fileUrl).toString('base64url');
    const proxied = `/api/proxy?u=${enc}`;

    return Response.json({ url: proxied, isHls: fileUrl.endsWith('.m3u8') });
  } catch (e:any) {
    return new Response(`Resolve error: ${e.message || 'unknown'}`, { status: 500 });
  }
}
