import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.WEBHOOK_SECRET;
  if (!token || !secret) {
    return NextResponse.json({ ok:false, reason:"Missing TELEGRAM_BOT_TOKEN or WEBHOOK_SECRET" }, { status: 500 });
  }

  const origin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : new URL(req.url).origin;
  const webhookUrl = `${origin}/api/webhook`;

  const r = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: webhookUrl, secret_token: secret }),
  });
  const j = await r.json();
  return NextResponse.json({ ok:true, webhookUrl, telegram: j });
}