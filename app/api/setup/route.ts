
import { NextResponse } from 'next/server';

export async function GET() {
  const webhookUrl = `${process.env.VERCEL_URL?.startsWith('http') ? process.env.VERCEL_URL : 'https://' + process.env.VERCEL_URL}/api/webhook`;
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: process.env.WEBHOOK_SECRET,
    }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
