import { useEffect, useState } from "react";
import { useLyrics } from "../lib/useLyrics";
import type { Spotify } from "../lib/useLanyard";

type Display = {
  prev: string | null;
  curr: string;
  next: string | null;
  key: number;
};

export default function LyricsWidget({ spotify }: { spotify: Spotify | null }) {
  const lines = useLyrics(spotify);
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState<Display>({ prev: null, curr: "", next: null, key: 0 });

  useEffect(() => {
    setIdx(0);
  }, [spotify?.trackId]);

  useEffect(() => {
    if (!spotify || lines.length === 0) return;
    const tick = () => {
      const elapsed = (Date.now() - spotify.start) / 1000;
      let cur = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].t <= elapsed) cur = i;
        else break;
      }
      setIdx(cur);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [lines, spotify]);

  useEffect(() => {
    if (!lines.length) return;
    setDisplay({
      prev: idx > 0 ? lines[idx - 1].text : null,
      curr: lines[idx]?.text ?? "",
      next: idx < lines.length - 1 ? lines[idx + 1].text : null,
      key: idx,
    });
  }, [idx, lines]);

  if (!spotify || lines.length === 0) return null;

  return (
    <div className="flex flex-col items-end text-right select-none">
      {/* lyric stack — keyed so it re-animates on every line change */}
      <div key={display.key} className="lyric-enter flex flex-col items-end gap-1">
        <div className="h-[1.25rem] flex items-center justify-end overflow-hidden">
          {display.prev ? (
            <span className="text-xs text-muted/50 max-w-[200px] truncate leading-none">
              {display.prev}
            </span>
          ) : null}
        </div>

        <div className="text-sm font-semibold text-bone/90 max-w-[220px] leading-snug">
          {display.curr}
        </div>

        <div className="h-[1.25rem] flex items-center justify-end overflow-hidden">
          {display.next ? (
            <span className="text-xs text-muted/50 max-w-[200px] truncate leading-none">
              {display.next}
            </span>
          ) : null}
        </div>
      </div>

      <p className="mt-2.5 font-mono text-[10px] text-faint leading-relaxed">
        listening to{" "}
        <span className="text-muted/70">{spotify.song}</span>
        {" "}by{" "}
        <span className="text-muted/70">{spotify.artist.split(";")[0].trim()}</span>
      </p>
    </div>
  );
}
