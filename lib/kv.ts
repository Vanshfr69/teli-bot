import { kv } from "@vercel/kv";
export const LAST_VIDEO_KEY = "last_video_file_id";
export const LAST_META_KEY = "last_video_meta";
export async function saveLastVideo(file_id: string, meta: any) {
  await kv.set(LAST_VIDEO_KEY, file_id);
  await kv.set(LAST_META_KEY, JSON.stringify(meta));
}
export async function getLastVideo() {
  const file_id = await kv.get<string>(LAST_VIDEO_KEY);
  const metaRaw = await kv.get<string>(LAST_META_KEY);
  const meta = metaRaw ? JSON.parse(metaRaw) : null;
  return { file_id, meta };
}
