import type { Lanyard } from "../lib/useLanyard";
import { SOCIALS } from "../data";
import Eyebrow from "../components/Eyebrow";
import NowPlaying from "../components/NowPlaying";
import { BRAND } from "../components/BrandIcons";

const STATUS = {
  online: { color: "#23a55a", label: "online" },
  idle: { color: "#f0b232", label: "idle" },
  dnd: { color: "#f23f43", label: "busy" },
  offline: { color: "#80848e", label: "offline" },
} as const;

export default function Home({
  lanyard,
  onGoto,
}: {
  lanyard: Lanyard;
  onGoto: (id: "work") => void;
}) {
  const s = STATUS[lanyard.status];

  return (
    <div className="swap">
      {/* hero: clean vertical stack — name, handle, then now-playing */}
      <div>
        <Eyebrow>what's up, i'm</Eyebrow>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-bone sm:text-6xl">
          x8r
        </h1>

        <div className="mt-3 flex items-center gap-2 font-mono text-sm text-muted">
          <img
            src="/img/pfp.jpeg"
            alt=""
            className="h-5 w-5 rounded-full object-cover"
          />
          @4pgx
          <span className="mx-1 text-faint">·</span>
          <span
            className="inline-block h-2 w-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: s.color, boxShadow: `0 0 7px ${s.color}` }}
          />
          <span className="text-muted">{s.label}</span>
        </div>

        <div className="mt-5">
          <NowPlaying spotify={lanyard.spotify} />
        </div>
      </div>

      {/* bio card */}
      <div className="mt-6 rounded-2xl border border-white/8 bg-ink p-5 leading-relaxed text-soft">
        i'm a <b className="font-semibold text-bone">14 yo fullstack developer</b>. i own{" "}
        <b className="font-semibold text-bone">cherri</b> and also help work on{" "}
        <b className="font-semibold text-bone">vortex</b>. i mainly do web development, but i'm open to doing anything outside of that field. take a look at my{" "}
        <button
          onClick={() => onGoto("work")}
          className="font-semibold text-accent underline-offset-4 hover:underline"
        >
          projects
        </button>{" "}
        or find me on{" "}
        <a
          href={SOCIALS[0].href}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-accent underline-offset-4 hover:underline"
        >
          discord
        </a>
        .
      </div>

      {/* social links */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {SOCIALS.map((soc) => {
          const Brand = BRAND[soc.key];
          return (
            <a
              key={soc.key}
              href={soc.href}
              target={soc.key === "email" ? undefined : "_blank"}
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-xl border border-white/8 bg-ink px-3.5 py-2 text-sm text-soft transition-colors hover:border-white/15 hover:text-bone"
            >
              {Brand ? (
                <Brand className="h-4 w-4 text-muted group-hover:text-bone" />
              ) : null}
              {soc.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
