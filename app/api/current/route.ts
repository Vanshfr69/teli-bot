import { NextRequest, NextResponse } from "next/server";
import kv from "../../../lib/kv";

export const runtime = "nodejs";

function b64url(x: string) {
  return Buffer.from(x).toString("base64").replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/, '');
}

export async function GET(_req: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return NextResponse.json({ ok:false, reason: "Server missing TELEGRAM_BOT_TOKEN" }, { status: 500 });

    const file_id = await kv.get<string>("latest_file_id");
    const metaRaw = await kv.get<string>("latest_meta");
    const meta = metaRaw ? JSON.parse(metaRaw) : null;

    if (!file_id) return NextResponse.json({ ok:false, reason: "No video yet. Send one to your bot." }, { status: 404 });

    const r = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(file_id)}`, { cache: "no-store" });
    const j = await r.json();
    const path = j?.result?.file_path as string | undefined;
    if (!path) return NextResponse.json({ ok:false, reason: "Telegram returned no file_path" }, { status: 502 });

    const direct = `https://api.telegram.org/file/bot${token}/${path}`;
    const url = `/api/proxy?u=${b64url(direct)}`;

    return NextResponse.json({ ok:true, url, meta });
  } catch (e: any) {
    return NextResponse.json({ ok:false, reason: e.message || "unknown error" }, { status: 500 });
  }
}