'use client';
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion } from 'framer-motion';

type CurrentResp = { ok: boolean; url?: string; meta?: any; reason?: string };

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [rate, setRate] = useState(1);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/current', { cache: 'no-store' });
      const json: CurrentResp = await res.json();
      if (!json.ok || !json.url) throw new Error(json.reason || 'No video yet. Send one to your bot.');
      setMeta(json.meta || null);
      mountPlayer(json.url);
    } catch (e:any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  function mountPlayer(src: string) {
    const video = videoRef.current;
    if (!video) return;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    const isHls = src.includes('.m3u8');
    if (isHls && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(()=>{}); });
    } else {
      video.src = src;
      video.play().catch(()=>{});
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = rate; }, [rate]);

  return (
    <main className="container space-y-6">
      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:.4}} className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">TG Stream <span className="badge">Premium</span></h1>
        <p className="text-sm opacity-80">Send a video to your Telegram bot — it auto-appears here. New uploads replace the previous one.</p>
      </motion.div>
      <div className="card space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <button className="btn" onClick={load} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh Video'}</button>
          {meta?.from && <p className="text-sm opacity-80">From: @{meta.from?.username || meta.from?.id}</p>}
          {meta?.file_size && <p className="text-sm opacity-80">Size: {Math.round(meta.file_size/1024/1024)} MB</p>}
          <p className="text-sm opacity-70">Playback speed</p>
          <select className="select max-w-28" value={rate} onChange={e=>setRate(parseFloat(e.target.value))}>
            {[0.25,0.5,0.75,1,1.25,1.5,1.75,2].map(v => <option key={v} value={v}>{v}×</option>)}
          </select>
        </div>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <div className="aspect-video w-full bg-neutral-900 rounded-2xl overflow-hidden">
          <video ref={videoRef} controls playsInline className="w-full h-full" />
        </div>
        <p className="text-xs opacity-70">Tip: Add the bot to your channel/group and send a video or forward one to it. Supported: Telegram video, document (MP4/WebM), and HLS if provided.</p>
      </div>
    </main>
  );
}
