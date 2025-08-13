# Telegram Video Streamer (Vercel)

Stream Telegram-hosted videos through a Vercel proxy, with playback speed controls and (when available) HLS quality selection.

## What you get
- **Two input modes**:
  - **Direct URL**: paste a Telegram file URL (e.g. `https://api.telegram.org/file/...`) or an HLS `.m3u8` manifest.
  - **Bot `file_id`**: paste a Telegram `file_id`; the server resolves it securely using your `TELEGRAM_BOT_TOKEN` (env var) and proxies the stream.
- **Proxy with HTTP Range** for instant seeking and proper video tag support.
- **HLS support** via hls.js with manual quality selection when the manifest has multiple variants; otherwise falls back to standard `<video>`.
- **Playback speed** from 0.25× to 2×.

> ⚠️ **Limits**: Vercel cannot perform server-side transcoding. "Different quality" works when your source is HLS with multiple variants. For single MP4/WebM files, quality depends on the source file.

## Deploy on Vercel
1. Create a new Vercel project and import this repo.
2. *(Optional, but recommended for `file_id` mode)* add env var: `TELEGRAM_BOT_TOKEN=123456:ABC...`.
3. Deploy.

## Usage
- **Direct URL mode**: Paste a Telegram file URL (e.g., `https://api.telegram.org/file/...`) or an HLS `.m3u8` and click **Load Video**.
- **Bot `file_id` mode**: Obtain a `file_id` from bot updates, paste it; server calls `getFile` and streams via the proxy.

## Security & CORS
- Client never sees the bot token. All Telegram fetches happen server-side.
- `/api/proxy` enables CORS and forwards Range headers.

## Development
```bash
npm i
npm run dev
# or: pnpm i; pnpm dev
```

## Notes
- Some Telegram links are **private/authenticated** and may expire quickly. If a link dies, resolve it again through `file_id`.
- If you have DASH (.mpd) streams, extend the player to support dash.js.
