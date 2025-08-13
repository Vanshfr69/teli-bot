import { NextRequest } from "next/server";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.WEBHOOK_SECRET;
  const origin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : new URL(req.url).origin;
  if (!token || !secret) return new Response("Missing TELEGRAM_BOT_TOKEN or WEBHOOK_SECRET", { status: 500 });
  const webhookUrl = `${origin}/api/webhook`;
  const r = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: webhookUrl, secret_token: secret }),
  });
  const j = await r.json();
  return Response.json({ ok: true, setWebhookResponse: j, webhookUrl });
}
