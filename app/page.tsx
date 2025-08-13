
'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch('/api/current');
        const data = await res.json();
        if (data.url) setVideoUrl(data.url);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, []);

  return (
    <main style={{ maxWidth: '800px', margin: 'auto', padding: '20px', textAlign: 'center' }}>
      <h1>Telegram Video Stream</h1>
      {loading && <p>Loading...</p>}
      {!loading && !videoUrl && <p>No video found. Send one to the bot.</p>}
      {videoUrl && (
        <video src={videoUrl} controls style={{ width: '100%', borderRadius: '8px' }} />
      )}
    </main>
  );
}
