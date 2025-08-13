'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';

function buildProxyUrl(raw: string) {
  const enc = typeof window === 'undefined' ? Buffer.from(raw).toString('base64url') : btoa(raw).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/, '');
  return `/api/proxy?u=${enc}`;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [fileId, setFileId] = useState("");
  const [mode, setMode] = useState<'direct'|'bot'>('direct');
  const [src, setSrc] = useState<string | null>(null);
  const [levels, setLevels] = useState<{index:number; height?: number; bitrate?: number}[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [rate, setRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const isHls = useMemo(() => !!src && src.includes('.m3u8'), [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const ls = (hls.levels || []).map((l, idx) => ({ index: idx, height: l.height, bitrate: l.bitrate }));
        setLevels(ls);
        setCurrentLevel(hls.currentLevel);
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentLevel(data.level);
      });
    } else {
      video.src = src;
      video.play().catch(() => {});
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, isHls]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
  }, [rate]);

  async function handleResolve() {
    try {
      if (mode === 'direct') {
        if (!input) throw new Error('Provide a direct Telegram file or HLS URL');
        setSrc(buildProxyUrl(input.trim()));
      } else {
        if (!fileId) throw new Error('Provide a Telegram file_id');
        const res = await fetch(`/api/resolve?file_id=${encodeURIComponent(fileId)}`);
        if (!res.ok) throw new Error(await res.text());
        const { url } = await res.json();
        setSrc(url);
      }
    } catch (e:any) {
      alert(e.message || 'Failed to resolve');
    }
  }

  function onLevelChange(idx: number) {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = idx; // -1 for auto
    setCurrentLevel(idx);
  }

  return (
    <div className="container">
      <h1>Telegram Video Streamer</h1>
      <p className="help">Paste a direct Telegram file/HLS URL (public) or use a bot <code>file_id</code> via server-side resolve. The app proxies via Vercel to enable CORS and HTTP Range for seeking.</p>

      <div className="card">
        <div style={{display:'flex', gap:12, flexWrap:'wrap', marginBottom:12}}>
          <button className="btn" onClick={() => setMode('direct')} aria-pressed={mode==='direct'}>Direct URL</button>
          <button className="btn" onClick={() => setMode('bot')} aria-pressed={mode==='bot'}>Bot file_id</button>
        </div>

        {mode === 'direct' ? (
          <div>
            <label>Telegram file URL or HLS (.m3u8) URL</label>
            <input placeholder="https://api.telegram.org/file/... or https://cdn*.telegram-cdn.org/... or https://...m3u8" value={input} onChange={e=>setInput(e.target.value)} />
          </div>
        ) : (
          <div>
            <label>Telegram <code>file_id</code> (resolved using your server-side bot token)</label>
            <input placeholder="e.g. BAACAgQAAxkBAA..." value={fileId} onChange={e=>setFileId(e.target.value)} />
            <p className="help">Set <code>TELEGRAM_BOT_TOKEN</code> in your Vercel env. We never expose it to the client. The server resolves to a signed file URL and streams through the proxy.</p>
          </div>
        )}

        <div style={{marginTop:12}}>
          <button className="btn" onClick={handleResolve}>Load Video</button>
        </div>

        {src && (
          <div className="video-wrap">
            <video ref={videoRef} controls style={{width:'100%', maxHeight: '70vh', borderRadius: 12}} playsInline/>

            <div className="controls">
              <label>Playback speed</label>
              <select value={rate} onChange={e=>setRate(parseFloat(e.target.value))}>
                {[0.25,0.5,0.75,1,1.25,1.5,1.75,2].map(r => (
                  <option key={r} value={r}>{r}×</option>
                ))}
              </select>

              {isHls && (
                <>
                  <span className="badge">HLS detected</span>
                  <label>Quality</label>
                  <select value={currentLevel} onChange={e=>onLevelChange(parseInt(e.target.value, 10))}>
                    <option value={-1}>Auto</option>
                    {levels.map(l => (
                      <option key={l.index} value={l.index}>
                        {l.height ? `${l.height}p` : `Level ${l.index}`} {l.bitrate ? `(${Math.round(l.bitrate/1000)} kbps)` : ''}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <details>
              <summary>Debug info</summary>
              <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify({ src, isHls, currentLevel, levels }, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>

      <div style={{marginTop:20}}>
        <h3>How quality works</h3>
        <p className="help">If your Telegram source is an HLS manifest (.m3u8) with multiple variants, you can pick exact quality. If it is a single MP4/WebM, quality depends on the source file; you still get full seeking and custom playback speeds.</p>
      </div>
    </div>
  );
}
