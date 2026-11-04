import "../../scripts/button/button.css";
import { avatar, DISCORD_ID } from "../data";
import { isLight, useDiscordProfile } from "../lib/hooks";
import { useLanyard } from "../lib/lanyard";

// the x8r 88x31, drawn live from the current pfp, decoration and discord theme.
// same stylesheet render.mjs uses for the hotlinkable gif, so they always match
export default function LiveButton({ className = "" }: { className?: string }) {
  const p = useLanyard();
  const theme = useDiscordProfile(DISCORD_ID)?.theme;
  const [a, b] = theme ?? ["#f2dbd3", "#a77c6d"];
  const fg = isLight(a) ? `color-mix(in oklab, ${b} 30%, #1d1615)` : "#fff";

  return (
    <span
      className={`x8r-btn live ${className}`}
      style={{ ["--a" as string]: a, ["--b" as string]: b, ["--fg" as string]: fg }}
      role="img"
      aria-label="x8r.dev 88x31 button"
    >
      <span className="pfp">
        <img src={avatar(96)} alt="" />
      </span>
      {p.decoration && <img className="deco" src={p.decoration} alt="" />}
      <span className="t">
        x8r.dev<span className="cur">_</span>
      </span>
    </span>
  );
}
