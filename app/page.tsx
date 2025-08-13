'use client';
import { useEffect, useState } from 'react';

type Current = { ok: boolean; url?: string; meta?: any; reason?: string; };

export default function Home() {
  const [data, setData] = useState<Current | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/current', { cache: 'no-store' });
      const json = await res.json();
      setData(json);
    } catch (e) {
      setData({ ok:false, reason: 'Failed to fetch /api/current' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="container">
      <div className="card">
        <h1 style={{ marginBottom: 8 }}>Telegram Video Stream</h1>
        <p className="meta" style={{ marginBottom: 16 }}>Send a video to your bot — the latest one plays here. Each new upload replaces the previous one.</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh Video'}
          </button>
          {data?.meta?.file_size && <span className="meta">Size: {Math.round((data.meta.file_size||0)/1024/1024)} MB</span>}
          {data?.meta?.from && <span className="meta">From: @{data.meta.from?.username || data.meta.from?.id}</span>}
        </div>
        {!loading && !data?.ok && <p style={{ color: '#b91c1c', marginBottom: 12 }}>{data?.reason || 'No video yet. Send one to your bot.'}</p>}
        {data?.ok && data?.url ? (
          <video className="video" src={data.url} controls playsInline />
        ) : (
          <div style={{ height: 360, display: 'grid', placeItems: 'center', background: '#0b1220', color: '#93c5fd', borderRadius: 12 }}>
            {loading ? 'Loading…' : 'No video yet. Send one to your bot.'}
          </div>
        )}
      </div>
    </main>
  );
}