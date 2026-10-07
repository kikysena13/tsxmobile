# ServerHub API

This is a small, separate API service for the Expo app. It does not create a second Discord bot. It validates Discord administrator access, then proxies a minimal dashboard payload from the existing bot.

## Local setup

1. Copy `.env.example` to `.env` and fill the values locally. Never commit `.env` or send its contents in chat.
2. Set `DISCORD_REDIRECT_URI` to the exact callback URL registered in Discord Developer Portal: `https://<serverhub-api-host>/api/auth/discord/callback`.
3. Keep the bot API token on servers only: `BOT_API_TOKEN` here must match `DASHBOARD_API_TOKEN` on the existing bot service.
4. Set `BOT_API_URL` to the bot's protected endpoint ending in `/api/serverhub/dashboard`.
5. Set `DISCORD_GUILD_ID` to the server this dashboard manages. Discord OAuth scopes are limited to `identify` and `guilds`; users need Manage Server or Administrator permission.
6. Set `APP_ALLOWED_ORIGINS` to the exact web app origins. Native requests do not send an Origin header and still require an authenticated session.
7. Run `npm install`, then `npm start`. The health check is `/health`.

## Deploy on Railway

Deploy this directory as a **separate service** from the already-hosted bot, with `backend/` as the service root. The included `railway.json` starts `npm start` and checks `/health`. Add the variables from `.env.example` in Railway's Variables page; do not put tokens into Expo's `.env`.

The app only needs the public `EXPO_PUBLIC_API_URL` set to this service's HTTPS URL in `B:\ServerHub\.env`. The Expo app never receives the Discord client secret or bot API token.

`ALLOW_EXPO_GO_REDIRECTS=true` is only for temporary development with Expo Go and should remain false in production. A production build uses the `serverhub://auth` app scheme.

## Dashboard data notes

- Member, message, leaderboard, and current voice counts come from the existing bot.
- Message history and recent events start accumulating after the updated bot is deployed; older message counts cannot be reconstructed from the current counter file.
- The bot writes these counters/events to `data/activity-points.json`; mount a persistent Railway volume at the bot's `data/` directory if this history must survive redeploys.
- Online count remains unavailable until the privileged Presence intent is enabled both in Discord Developer Portal and on the bot service (`DISCORD_PRESENCE_ENABLED=true`).
- Sessions are held in memory for 12 hours; use one backend instance for this MVP. A shared session store is needed before scaling to multiple instances.
