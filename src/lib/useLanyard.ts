import { useEffect, useState } from "react";
import { DISCORD_ID } from "../data";

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export type Spotify = {
  song: string;
  artist: string;
  album: string;
  albumArt: string;
  trackId: string;
  start: number;
  end: number;
};

export type Lanyard = {
  status: DiscordStatus;
  spotify: Spotify | null;
};

// Polls Lanyard for live Discord presence + Spotify. One request, reused
// across the whole site so we don't hammer the API from every section.
export function useLanyard(): Lanyard {
  const [state, setState] = useState<Lanyard>({
    status: "offline",
    spotify: null,
  });

  useEffect(() => {
    let alive = true;

    const pull = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
        );
        const json = await res.json();
        if (!alive || !json.success || !json.data) return;
        const d = json.data;
        const sp = d.listening_to_spotify && d.spotify
          ? {
              song: d.spotify.song as string,
              artist: d.spotify.artist as string,
              album: d.spotify.album as string,
              albumArt: d.spotify.album_art_url as string,
              trackId: d.spotify.track_id as string,
              start: d.spotify.timestamps?.start ?? 0,
              end: d.spotify.timestamps?.end ?? 0,
            }
          : null;
        setState({
          status: (d.discord_status || "offline") as DiscordStatus,
          spotify: sp,
        });
      } catch {
        if (alive) setState((s) => ({ ...s, status: "offline" }));
      }
    };

    pull();
    const id = setInterval(pull, 8000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return state;
}
