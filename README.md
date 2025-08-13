# TG Stream — Premium (Vercel, Telegram Bot)
Send a video to your Telegram **bot**, and it will automatically appear on this website for streaming. Each new video **replaces** the previous one. No manual URLs needed.
## Deploy (Vercel)
1. Import this repo.
2. Add env vars: `TELEGRAM_BOT_TOKEN`, `WEBHOOK_SECRET`.
3. Add **Vercel KV** (Upstash) integration so KV envs are present.
4. Deploy, then open `/api/setup` once to register the webhook.
## Usage
Send a video (or MP4/WebM document) to the bot or add it to a channel. Refresh the site.
