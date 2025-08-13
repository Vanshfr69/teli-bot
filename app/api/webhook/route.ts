import { NextRequest, NextResponse } from "next/server";
import kv from "../../../lib/kv";

export const runtime = "nodejs";

type TgVideo = { file_id: string; file_size?: number; mime_type?: string; duration?: number; width?: number; height?: number };
type TgDoc = { file_id: string; file_size?: number; mime_type?: string; file_name?: string };

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token") || "";
  const expected = process.env.WEBHOOK_SECRET || "";
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  const update = await req.json();
  const msg = update?.message || update?.channel_post;
  if (!msg) return NextResponse.json({ ok: true, reason: "no message" });

  const from = msg.from || msg.sender_chat || null;
  let file_id: string | null = null;
  let meta: any = { from };

  if (msg.video) {
    const v: TgVideo = msg.video;
    file_id = v.file_id;
    meta = { ...meta, kind: "video", file_size: v.file_size, mime_type: v.mime_type, duration: v.duration, width: v.width, height: v.height };
  } else if (msg.document && /video|mp4|webm/i.test(msg.document.mime_type || "")) {
    const d: TgDoc = msg.document;
    file_id = d.file_id;
    meta = { ...meta, kind: "document", file_size: d.file_size, mime_type: d.mime_type, file_name: d.file_name };
  } else if (msg.animation) {
    const a = msg.animation;
    file_id = a.file_id;
    meta = { ...meta, kind: "animation", file_size: a.file_size, mime_type: a.mime_type, duration: a.duration, width: a.width, height: a.height };
  }

  if (!file_id) {
    return NextResponse.json({ ok: true, reason: "no supported media found" });
  }

  await kv.set("latest_file_id", file_id);
  await kv.set("latest_meta", JSON.stringify(meta));
  return NextResponse.json({ ok: true });
}