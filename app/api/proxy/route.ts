import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // needs Node for streaming and Range

function decodeU(u: string) {
  // base64url -> string
  u = u.replace(/-/g, '+').replace(/_/g, '/');
  const pad = u.length % 4 ? 4 - (u.length % 4) : 0;
  return Buffer.from(u + '='.repeat(pad), 'base64').toString('utf8');
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get('u');
  if (!u) return new Response('Missing u', { status: 400 });

  const target = decodeU(u);
  const range = req.headers.get('range') || undefined;

  const resp = await fetch(target, {
    method: 'GET',
    headers: range ? { Range: range } : undefined,
    cache: 'no-store',
  });

  const headers = new Headers();
  const passthru = [
    'content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified', 'cache-control'
  ];
  for (const key of passthru) {
    const v = resp.headers.get(key);
    if (v) headers.set(key, v);
  }
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(resp.body, { status: resp.status, headers });
}
