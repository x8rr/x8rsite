import { useEffect, useState } from "react";
import type { Spotify } from "../lib/useLanyard";
import { useLyrics } from "../lib/useLyrics";
import { SpotifyIcon } from "./BrandIcons";

function Equalizer() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="eqbar w-[2px] rounded-full bg-soft"
          style={{ height: "100%", animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

// The live, time-synced lyric line for the current playback position.
function CurrentLyric({ spotify }: { spotify: Spotify }) {
  const lines = useLyrics(spotify);
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    if (lines.length === 0) return;
    const tick = () => {
      const pos = (Date.now() - spotify.start) / 1000;
      let i = -1;
      for (let k = 0; k < lines.length; k++) {
        if (lines[k].t <= pos) i = k;
        else break;
      }
      setIdx(i);
    };
    tick();
    const id = setInterval(tick, 350);
    return () => clearInterval(id);
  }, [lines, spotify.start]);

  if (lines.length === 0 || idx < 0) return null;

  return (
    <div key={idx} className="lyric-enter mt-1 truncate text-xs italic text-soft/70">
      "{lines[idx].text}"
    </div>
  );
}

export default function NowPlaying({
  spotify,
  variant = "inline",
}: {
  spotify: Spotify | null;
  variant?: "inline" | "card";
}) {
  if (!spotify) {
    return (
      <div
        className={
          variant === "card"
            ? "flex items-center gap-3 rounded-xl border border-white/8 bg-ink px-4 py-3 text-sm text-muted"
            : "flex items-center gap-2 text-sm text-muted"
        }
      >
        <SpotifyIcon className="h-4 w-4 opacity-50" />
        not listening to anything right now
      </div>
    );
  }

  const artist = spotify.artist.split(";")[0].trim();

  if (variant === "card") {
    return (
      <div className="rounded-xl border border-white/8 bg-ink p-4">
        <div className="flex items-center gap-4">
          <img
            src={spotify.albumArt}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2 text-xs text-muted">
              <Equalizer />
              now playing
            </div>
            <div className="truncate font-semibold text-bone">
              {spotify.song}
            </div>
            <div className="truncate text-sm text-muted">{artist}</div>
          </div>
          <a
            href={`https://open.spotify.com/track/${spotify.trackId}`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-muted transition-colors hover:text-bone"
            aria-label="Open in Spotify"
          >
            <SpotifyIcon className="h-5 w-5" />
          </a>
        </div>
        <CurrentLyric spotify={spotify} />
      </div>
    );
  }

  // inline: a compact, self-contained chip — no overlap with the hero name
  return (
    <a
      href={`https://open.spotify.com/track/${spotify.trackId}`}
      target="_blank"
      rel="noreferrer"
      className="group flex w-full items-center gap-3 rounded-xl border border-white/8 bg-ink px-3.5 py-3 transition-colors hover:border-white/15"
    >
      <img
        src={spotify.albumArt}
        alt=""
        className="h-10 w-10 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted">
          <Equalizer />
          now playing
        </div>
        <div className="truncate text-sm font-medium text-bone">
          {spotify.song}
          <span className="font-normal text-muted"> · {artist}</span>
        </div>
        <CurrentLyric spotify={spotify} />
      </div>
    </a>
  );
}
