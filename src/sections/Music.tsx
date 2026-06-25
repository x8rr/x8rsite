import type { Lanyard } from "../lib/useLanyard";
import NowPlaying from "../components/NowPlaying";
import { SpotifyIcon } from "../components/BrandIcons";

export default function Music({ lanyard }: { lanyard: Lanyard }) {
  const sp = lanyard.spotify;
  return (
    <div className="swap">
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-bone">music</h1>
      <p className="mt-2 max-w-lg text-soft">
        whatever i'm listening to at the moment
      </p>

      <div className="mt-6">
        <NowPlaying spotify={sp} variant="card" />
      </div>

      {sp ? (
        <div className="mt-6 rounded-2xl border border-white/8 bg-ink p-5">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <SpotifyIcon className="h-3.5 w-3.5 text-accent" />
            from the album
          </div>
          <div className="mt-2 flex items-center gap-4">
            <img
              src={sp.albumArt}
              alt=""
              className="h-20 w-20 rounded-xl object-cover"
            />
            <div>
              <div className="font-semibold text-bone">{sp.album}</div>
              <div className="text-sm text-muted">{sp.artist}</div>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-6 font-mono text-sm text-muted">
          come back when i've got something playing.
        </p>
      )}
    </div>
  );
}
