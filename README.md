# x8r.dev

Vite + React + Tailwind + Motion.

```sh
bun install
bun dev      # http://localhost:5173
bun run build  # -> dist/
```

Live bits:

- **pfp**: pulled straight from GitHub (`avatars.githubusercontent.com/u/<id>`), so changing it on GitHub changes it here. The click-to-enter splash turns it into ASCII art on the fly, and the banner colour is sampled from it (or from the album art while music is playing).
- **profile cosmetics**: avatar decoration, server tag, name colours and badges come from your Discord profile via Lanyard.
- **discord / spotify / games**: [Lanyard](https://github.com/Phineas/lanyard) websocket, with synced lyrics from [lrclib](https://lrclib.net).
- **view counter + game history**: the `counter` worker in `workers/counter` (`counter.x8r.dev`). It polls Lanyard every minute on a cron and records game sessions + total playtime into a Durable Object; the site reads them from `/games`.
