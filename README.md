# Telegram Video Stream — Stable, Clean

**What it does:** Send a video to your Telegram bot, and this site streams the latest one (each new video replaces the last).

## Deploy (Vercel)
1) Create a repo from this folder (GitHub/GitLab/Bitbucket).
2) Import to Vercel (framework: Next.js).
3) Add Environment Variables:
   - `TELEGRAM_BOT_TOKEN` (from @BotFather)
   - `WEBHOOK_SECRET` (any long random string)
4) Add the **Vercel KV** (Upstash) integration (injects KV env vars automatically).
5) Deploy.
6) Open `/api/setup` once to register the Telegram webhook.
7) Send a video or MP4/WebM document to your bot → refresh the site.

## Endpoints
- `POST /api/webhook` – Telegram sends updates; stores latest file_id + meta in KV.
- `GET /api/current` – Resolves a fresh Telegram file URL on every call; returns a proxied URL.
- `GET /api/proxy?u=<base64url>` – Proxies Telegram file with HTTP Range for seeking.
- `GET /api/setup` – Sets Telegram webhook with secret token verification.

## Notes
- No transcoding. Plays Telegram-provided MP4/WebM directly. HLS (.m3u8) also works if source is HLS.
- The proxy forwards `Range` headers for proper seeking.
- One active video by design; extend KV logic to store a playlist if you need history.