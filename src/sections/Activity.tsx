import { useRef, useState } from "react";
import { motion } from "motion/react";
import { SpotifyIcon } from "../components/Icons";
import { ago, clock, duration, useGameLog, useLyrics, useNow } from "../lib/hooks";
import type { Game, Spotify } from "../lib/lanyard";

function Equalizer() {
  return (
    <span className="eq flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-full w-[2px] rounded-full bg-bar" style={{ animationDelay: `${i * 0.17}s` }} />
      ))}
    </span>
  );
}

// apple-music-ish: every line on a strip that glides so the sung line sits near
// the top, neighbours dimmed and softly blurred, and the current line filling
// in left to right over exactly as long as it's sung
function Lyrics({ sp, now }: { sp: Spotify; now: number }) {
  const lines = useLyrics(sp);
  const refs = useRef<(HTMLElement | null)[]>([]);
  if (lines.length === 0) return null;

  // tiny lead so the line lands as it's sung, not after
  const pos = (now - sp.start) / 1000 + 0.25;
  let idx = -1;
  for (let k = 0; k < lines.length && lines[k].t <= pos; k++) idx = k;

  // a long gap before the first line (or after the current one ends) shows
  // breathing dots instead of a stale line
  const intro = idx === -1;
  const el = refs.current[idx];
  // keep the sung line just below the top fade
  const offset = el ? el.offsetTop - 30 : 0;

  return (
    <div className="relative mt-4 h-[11.5rem] overflow-hidden rounded-xl border border-line bg-inset">
      {/* fade only the text strip, so the box itself stays solid */}
      <div className="h-full [mask-image:linear-gradient(transparent,#000_10%,#000_78%,transparent)]">
      <motion.div
        className="px-4 pt-3.5 pb-24"
        animate={{ y: -offset }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 0.9 }}
      >
        <div className={`flex h-9 items-center gap-1.5 transition-opacity duration-500 ${intro ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
          {[0, 1, 2].map((d) => (
            <span key={d} className="breathe size-2 rounded-full bg-fg" style={{ animationDelay: `${d * 0.2}s` }} />
          ))}
        </div>
        {lines.map((line, k) => {
          const dist = k - idx;
          const cur = dist === 0;
          // lrclib only times lines, not words, so estimate how long the line
          // is actually sung (~13 chars/s) instead of sweeping across gaps
          const gap = (lines[k + 1]?.t ?? line.t + 4) - line.t;
          const len = Math.min(gap, Math.max(0.8, line.text.length * 0.075 + 0.35));
          return (
            <p
              key={k}
              ref={(n) => {
                refs.current[k] = n;
              }}
              className="lyric origin-left py-1.5 text-[19px] font-bold leading-snug"
              data-state={cur ? "current" : dist < 0 ? "past" : "next"}
              style={{
                opacity: cur ? 1 : dist === 1 ? 0.62 : dist < 0 ? 0.3 : 0.42,
                filter: cur || dist === 1 ? "none" : `blur(${Math.min(1.2, (Math.abs(dist) - 1) * 0.5)}px)`,
                scale: cur ? 1 : 0.96,
                // start the fill partway through if we arrive mid-line
                transitionDelay: cur ? `0s, 0s, 0s, ${-(pos - line.t)}s` : undefined,
                transitionDuration: cur ? `0.6s, 0.6s, 0.6s, ${len}s` : undefined,
              }}
            >
              {line.text}
            </p>
          );
        })}
      </motion.div>
      </div>
    </div>
  );
}

export function SpotifyCard({ sp }: { sp: Spotify | null }) {
  const now = useNow(250);

  if (!sp) {
    return (
      <div className="panel flex items-center gap-4 p-5">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl border border-line bg-inset">
          <SpotifyIcon className="size-6 text-faint" />
        </div>
        <div>
          <p className="label">spotify</p>
          <p className="mt-1 text-sm text-dim">not listening to anything right now</p>
        </div>
      </div>
    );
  }

  const total = Math.max(1, sp.end - sp.start);
  const elapsed = Math.min(total, Math.max(0, now - sp.start));
  const link = `https://open.spotify.com/track/${sp.trackId}`;

  return (
    <div className="panel relative overflow-hidden p-5">
      <img key={sp.art} src={sp.art} alt="" className="absolute inset-0 -z-0 size-full scale-150 object-cover opacity-25 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="label flex items-center gap-2">
            <Equalizer /> listening to spotify
          </p>
          <a href={link} target="_blank" rel="noreferrer" aria-label="open in spotify" className="sq size-8 border-0">
            <SpotifyIcon className="size-4" />
          </a>
        </div>

        <div className="mt-3 flex gap-4">
          <a href={link} target="_blank" rel="noreferrer" className="shrink-0">
            <img src={sp.art} alt={sp.album} className="size-24 rounded-xl object-cover shadow-lg shadow-black/50 transition duration-300 ease-bounce hover:scale-105" />
          </a>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <a href={link} target="_blank" rel="noreferrer" className="truncate text-lg font-bold hover:underline">
              {sp.song}
            </a>
            <p className="truncate text-sm text-soft">{sp.artist.replaceAll(";", ",")}</p>
            <p className="truncate text-sm text-dim">{sp.album}</p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-dim">
              <span>{clock(elapsed)}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-fg/10">
                <div className="h-full rounded-full bg-[color-mix(in_oklab,var(--theme-a)_70%,white)]" style={{ width: `${(elapsed / total) * 100}%` }} />
              </div>
              <span>{clock(total)}</span>
            </div>
          </div>
        </div>

        <Lyrics key={sp.trackId} sp={sp} now={now} />
      </div>
    </div>
  );
}

function GameIcon({ src, name, className = "" }: { src: string | null; name: string; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return <div className={`grid place-items-center bg-inset font-bold text-dim ${className}`}>{name.slice(0, 1).toUpperCase()}</div>;
  }
  return <img src={src} alt="" onError={() => setBroken(true)} className={`object-cover ${className}`} />;
}

export function GamesCard({ games }: { games: Game[] }) {
  const log = useGameLog();
  const now = useNow(1000);
  const current = games[0];

  // fold the live session into the recorded totals so the bars move while playing
  const top = (log?.top ?? []).map((t) => ({ ...t }));
  for (const g of games) {
    const start = log?.live.find((l) => l.name === g.name)?.start ?? g.start;
    if (!start) continue;
    const t = top.find((x) => x.name === g.name);
    if (t) t.ms += now - start;
    else top.push({ name: g.name, icon: g.icon, ms: now - start, sessions: 0, last: now });
  }
  top.sort((a, b) => b.ms - a.ms);
  const shown = top.slice(0, 5);
  const max = shown[0]?.ms ?? 1;
  const last = log?.recent[0];

  return (
    <div className="panel p-5">
      <p className="label">{current ? "playing a game" : "games"}</p>

      {current ? (
        <div className="mt-3 flex items-center gap-4">
          <GameIcon src={current.icon} name={current.name} className="size-16 shrink-0 rounded-xl border border-line text-xl" />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{current.name}</p>
            {(current.details || current.state) && (
              <p className="truncate text-sm text-soft">{[current.details, current.state].filter(Boolean).join(" · ")}</p>
            )}
            {current.start && <p className="mt-0.5 font-mono text-sm text-[#23a55a]">{clock(now - current.start)} elapsed</p>}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-dim">
          {last ? (
            <>
              not playing anything. last played <span className="text-fg">{last.name}</span> {ago(now - last.end)} for {duration(last.end - last.start)}.
            </>
          ) : (
            "not playing anything right now."
          )}
        </p>
      )}

      {shown.length > 0 && (
        <div className="mt-5 rounded-xl border border-line bg-inset p-4">
          <p className="label">most played</p>
          <ul className="mt-3 space-y-3">
            {shown.map((t) => (
              <li key={t.name} className="flex items-center gap-3">
                <GameIcon src={t.icon} name={t.name} className="size-8 shrink-0 rounded-lg text-xs" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate">{t.name}</span>
                    <span className="shrink-0 font-mono text-xs text-dim">{duration(t.ms)}</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-fg/[0.06]">
                    <div className="h-full rounded-full bg-[color-mix(in_oklab,var(--theme-a)_70%,white)] opacity-80" style={{ width: `${Math.max(3, (t.ms / max) * 100)}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {log?.since && (
            <p className="mt-4 font-mono text-[10px] text-faint">
              tracked since {new Date(log.since).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toLowerCase()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
