import { useSyncExternalStore } from "react";
import { DISCORD_ID, IGNORED_GAMES } from "../data";

export type Status = "online" | "idle" | "dnd" | "offline";

export type Spotify = {
  song: string;
  artist: string;
  album: string;
  art: string;
  trackId: string;
  start: number;
  end: number;
};

export type Game = {
  name: string;
  details?: string;
  state?: string;
  icon: string | null;
  start: number | null;
};

export type Presence = {
  ready: boolean;
  username: string;
  displayName: string;
  status: Status;
  custom: { text: string; emoji?: string } | null;
  spotify: Spotify | null;
  games: Game[];
  platforms: string[];
  // profile cosmetics, straight from discord
  decoration: string | null;
  nameColors: string[];
  tag: { text: string; badge: string } | null;
  badges: { label: string; icon: string }[];
};

// public_flags bits we can render (discord's own badge art)
const FLAG_BADGES: [number, string, string][] = [
  [1 << 6, "HypeSquad Bravery", "8a88d63823d8a71cd5e390baa45efa02"],
  [1 << 7, "HypeSquad Brilliance", "011940fd013da3f7fb926e4a1cd2e618"],
  [1 << 8, "HypeSquad Balance", "3aa41de486fa12454c3761e8e223442e"],
  [1 << 22, "Active Developer", "6bdc42827a38498929a4920da12695d9"],
];

type RawActivity = {
  type: number;
  name: string;
  state?: string;
  details?: string;
  application_id?: string;
  timestamps?: { start?: number };
  assets?: { large_image?: string };
  emoji?: { name?: string; id?: string; animated?: boolean };
};

// same mapping the counter worker uses when recording sessions
export function activityIcon(a: RawActivity): string | null {
  const img = a.assets?.large_image;
  if (img?.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${img.slice("mp:external/".length)}`;
  }
  if (img && a.application_id && !img.includes(":")) {
    return `https://cdn.discordapp.com/app-assets/${a.application_id}/${img}.png`;
  }
  if (a.application_id) return `https://dcdn.dstn.to/app-icons/${a.application_id}`;
  return null;
}
function parse(d: any): Presence {
  const acts: RawActivity[] = d.activities ?? [];
  const custom = acts.find((a) => a.type === 4);
  const sp = d.listening_to_spotify && d.spotify ? d.spotify : null;
  const u = d.discord_user;
  const g = u?.primary_guild;
  return {
    ready: true,
    username: d.discord_user?.username ?? "",
    displayName: d.discord_user?.global_name ?? d.discord_user?.username ?? "",
    status: d.discord_status ?? "offline",
    custom: custom?.state
      ? { text: custom.state, emoji: custom.emoji?.id ? undefined : custom.emoji?.name }
      : null,
    spotify: sp
      ? {
          song: sp.song,
          artist: sp.artist,
          album: sp.album,
          art: sp.album_art_url,
          trackId: sp.track_id,
          start: sp.timestamps?.start ?? 0,
          end: sp.timestamps?.end ?? 0,
        }
      : null,
    games: acts
      .filter((a) => a.type === 0 && !IGNORED_GAMES.has(a.name))
      .map((a) => ({
        name: a.name,
        details: a.details,
        state: a.state,
        icon: activityIcon(a),
        start: a.timestamps?.start ?? null,
      })),
    platforms: (["desktop", "web", "mobile"] as const).filter((p) => d[`active_on_discord_${p}`]),
    decoration: u?.avatar_decoration_data?.asset
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${u.avatar_decoration_data.asset}.png?size=240&passthrough=true`
      : null,
    nameColors: (u?.display_name_styles?.colors ?? []).map((c: number) => `#${c.toString(16).padStart(6, "0")}`),
    tag: g?.tag && g.identity_enabled
      ? { text: g.tag, badge: `https://cdn.discordapp.com/guild-tag-badges/${g.identity_guild_id}/${g.badge}.png?size=32` }
      : null,
    badges: FLAG_BADGES.filter(([bit]) => (u?.public_flags ?? 0) & bit).map(([, label, hash]) => ({
      label,
      icon: `https://cdn.discordapp.com/badge-icons/${hash}.png`,
    })),
  };
}

let state: Presence = {
  ready: false,
  username: "hvtrs",
  displayName: "hvtrs",
  status: "offline",
  custom: null,
  spotify: null,
  games: [],
  platforms: [],
  decoration: null,
  nameColors: [],
  tag: null,
  badges: [],
};
const listeners = new Set<() => void>();
const emit = (next: Presence) => {
  state = next;
  listeners.forEach((l) => l());
};

// one live websocket for the whole page. falls back to a REST fetch so the
// first paint has data even before the socket says hello.
let started = false;
function start() {
  if (started) return;
  started = true;

  fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
    .then((r) => r.json())
    .then((j) => {
      if (j.success && !state.ready) emit(parse(j.data));
    })
    .catch(() => {});

  let retry = 1000;
  const connect = () => {
    const ws = new WebSocket("wss://api.lanyard.rest/socket");
    let beat: ReturnType<typeof setInterval> | undefined;
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.op === 1) {
        retry = 1000;
        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
        beat = setInterval(() => ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
      } else if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
        emit(parse(msg.d));
      }
    };
    ws.onclose = () => {
      clearInterval(beat);
      setTimeout(connect, retry);
      retry = Math.min(retry * 2, 30000);
    };
  };
  connect();
}

export function useLanyard(): Presence {
  return useSyncExternalStore(
    (cb) => {
      start();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}
