import { useEffect, useState } from "react";
import type { Spotify } from "./useLanyard";

export type LyricLine = { t: number; text: string };

function parseLrc(lrc: string): LyricLine[] {
  const out: LyricLine[] = [];
  const re = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
  for (const raw of lrc.split("\n")) {
    const text = raw.replace(re, "").trim();
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw))) {
      const min = parseInt(m[1], 10);
      const sec = parseInt(m[2], 10);
      const frac = m[3] ? parseInt(m[3].padEnd(3, "0"), 10) / 1000 : 0;
      out.push({ t: min * 60 + sec + frac, text });
    }
  }
  return out.filter((l) => l.text.length > 0).sort((a, b) => a.t - b.t);
}

// Fetches time-synced lyrics from lrclib (free, no key). Returns [] when a
// track has no synced lyrics — the widget just hides the ghost text then.
export function useLyrics(spotify: Spotify | null): LyricLine[] {
  const [lines, setLines] = useState<LyricLine[]>([]);

  useEffect(() => {
    setLines([]);
    if (!spotify) return;
    let alive = true;

    const duration = Math.max(1, Math.round((spotify.end - spotify.start) / 1000));
    const params = new URLSearchParams({
      artist_name: spotify.artist.split(";")[0].trim(),
      track_name: spotify.song,
      album_name: spotify.album,
      duration: String(duration),
    });

    fetch(`https://lrclib.net/api/get?${params}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (alive && j?.syncedLyrics) setLines(parseLrc(j.syncedLyrics));
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [spotify?.trackId, spotify?.song, spotify?.artist, spotify?.album, spotify?.end, spotify?.start]);

  return lines;
}
