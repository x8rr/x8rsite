import { useEffect, useState } from "react";
import { COUNTER } from "../data";
import type { Spotify } from "./lanyard";

export function useNow(every = 1000): number {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), every);
    return () => clearInterval(id);
  }, [every]);
  return now;
}

// counts this visit once per tab session so refreshes don't inflate it
export function useViewCount(): number | null {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    let counted = false;
    try {
      counted = sessionStorage.getItem("x8r:counted") === "1";
      sessionStorage.setItem("x8r:counted", "1");
    } catch {}
    fetch(`${COUNTER}/${counted ? "" : "up"}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => alive && typeof j?.count === "number" && setCount(j.count))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return count;
}

export type DiscordProfile = {
  banner: string | null;
  // nitro profile theme: [top, bottom]
  theme: [string, string] | null;
  pronouns: string;
  badges: { label: string; icon: string }[];
  // the "game collection" on the profile (favourites first), as app icons
  games: string[];
};

// discord's rule of thumb for themed profiles: light top colour, light card
export function isLight(hexColor: string): boolean {
  const n = parseInt(hexColor.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

const hex = (n: number) => `#${n.toString(16).padStart(6, "0")}`;
let profileReq: Promise<DiscordProfile | null> | null = null;

// lanyard doesn't carry banner/theme/pronouns, so read them from dstn's public
// profile endpoint. one request shared by everything that asks
export function useDiscordProfile(id: string): DiscordProfile | null {
  const [profile, setProfile] = useState<DiscordProfile | null>(null);
  useEffect(() => {
    let alive = true;
    profileReq ??= fetch(`https://dcdn.dstn.to/profile/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j?.user) return null;
        const hash: string | undefined = j.user_profile?.banner ?? j.user.banner;
        const tc: number[] | undefined = j.user_profile?.theme_colors;
        return {
          banner: hash ? `https://cdn.discordapp.com/banners/${id}/${hash}.${hash.startsWith("a_") ? "gif" : "png"}?size=600` : null,
          theme: tc?.length === 2 ? [hex(tc[0]), hex(tc[1])] : null,
          pronouns: j.user_profile?.pronouns ?? "",
          badges: (j.badges ?? []).map((b: { description: string; icon: string }) => ({
            label: b.description,
            icon: `https://cdn.discordapp.com/badge-icons/${b.icon}.png`,
          })),
          games: [
            ...new Set<string>(
              ["favorite_games", "played_games"].flatMap((type) =>
                (j.widgets ?? [])
                  .filter((w: { data?: { type?: string } }) => w.data?.type === type)
                  .flatMap((w: { data: { games?: { game_id: string }[] } }) => (w.data.games ?? []).map((g) => g.game_id)),
              ),
            ),
          ].map((id) => `https://dcdn.dstn.to/app-icons/${id}`),
        } satisfies DiscordProfile;
      })
      .catch(() => null);
    profileReq.then((p) => alive && setProfile(p));
    return () => {
      alive = false;
    };
  }, [id]);
  return profile;
}

export type GameSession = { name: string; icon: string | null; start: number; end: number };
export type GameTotal = { name: string; icon: string | null; ms: number; sessions: number; last: number };
export type GameLog = {
  since: number | null;
  live: { name: string; icon: string | null; start: number }[];
  recent: GameSession[];
  top: GameTotal[];
};

// recorded by the counter worker's cron, see workers/counter
export function useGameLog(): GameLog | null {
  const [log, setLog] = useState<GameLog | null>(null);
  useEffect(() => {
    let alive = true;
    const pull = () =>
      fetch(`${COUNTER}/games`)
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => alive && j && Array.isArray(j.top) && setLog(j))
        .catch(() => {});
    pull();
    const id = setInterval(pull, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return log;
}

export type LyricLine = { t: number; text: string };

function parseLrc(lrc: string): LyricLine[] {
  const out: LyricLine[] = [];
  const re = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
  for (const raw of lrc.split("\n")) {
    const text = raw.replace(re, "").trim();
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw))) {
      const frac = m[3] ? parseInt(m[3].padEnd(3, "0"), 10) / 1000 : 0;
      out.push({ t: parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + frac, text });
    }
  }
  return out.filter((l) => l.text).sort((a, b) => a.t - b.t);
}

// time-synced lyrics from lrclib (free, no key). [] when there are none
export function useLyrics(sp: Spotify | null): LyricLine[] {
  const [lines, setLines] = useState<{ id: string; lines: LyricLine[] }>({ id: "", lines: [] });
  const id = sp?.trackId ?? "";
  useEffect(() => {
    if (!sp) return;
    let alive = true;
    const artist = sp.artist.split(";")[0].trim();
    const secs = Math.max(1, Math.round((sp.end - sp.start) / 1000));
    const exact = new URLSearchParams({ artist_name: artist, track_name: sp.song, album_name: sp.album, duration: String(secs) });
    const loose = new URLSearchParams({ artist_name: artist, track_name: sp.song });

    // exact lookup misses whenever spotify's album name differs from lrclib's
    // (deluxe editions, remasters), so fall back to a search and take the
    // closest-length synced result
    (async () => {
      const hit = await fetch(`https://lrclib.net/api/get?${exact}`).then((r) => (r.ok ? r.json() : null));
      let synced: string | null = hit?.syncedLyrics ?? null;
      if (!synced) {
        const found: { duration: number; syncedLyrics: string | null }[] = await fetch(`https://lrclib.net/api/search?${loose}`).then((r) => (r.ok ? r.json() : []));
        synced =
          found
            .filter((f) => f.syncedLyrics && Math.abs(f.duration - secs) <= 3)
            .sort((a, b) => Math.abs(a.duration - secs) - Math.abs(b.duration - secs))[0]?.syncedLyrics ?? null;
      }
      if (alive) setLines({ id: sp.trackId, lines: synced ? parseLrc(synced) : [] });
    })().catch(() => {});
    return () => {
      alive = false;
    };
  }, [id]);
  return lines.id === id ? lines.lines : [];
}

export function ago(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d}d ago` : `${Math.round(d / 30)}mo ago`;
}

export function duration(ms: number): string {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function clock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(h ? 2 : 1, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
