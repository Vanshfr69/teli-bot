import { NextRequest } from "next/server";
import { getLastVideo } from "@/lib/kv";
export const runtime = "nodejs";
function b64url(x: string) { return Buffer.from(x).toString("base64").replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/, ''); }
export async function GET(req: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return Response.json({ ok:false, reason: "Server missing TELEGRAM_BOT_TOKEN" }, { status: 500 });
    const { file_id, meta } = await getLastVideo();
    if (!file_id) return Response.json({ ok:false, reason: "No video yet. Send one to your bot." }, { status: 404 });
    const r = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(file_id)}`, { cache: "no-store" });
    if (!r.ok) return Response.json({ ok:false, reason: "getFile failed" }, { status: 502 });
    const j = await r.json();
    const path = j?.result?.file_path as string | undefined;
    if (!path) return Response.json({ ok:false, reason: "Telegram returned no file_path" }, { status: 502 });
    const direct = `https://api.telegram.org/file/bot${token}/${path}`;
    const url = `/api/proxy?u=${b64url(direct)}`;
    return Response.json({ ok:true, url, meta });
  } catch (e:any) {
    return Response.json({ ok:false, reason: e.message || "unknown error" }, { status: 500 });
  }
}
