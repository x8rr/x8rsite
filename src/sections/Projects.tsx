import { Clapperboard, Code2, ExternalLink, Music } from "lucide-react";
import { CREWS, REPOS, RUNNING, WEBPORTS } from "../data";

function Icon({ src, name, size = "size-10" }: { src?: string; name: string; size?: string }) {
  return src ? (
    <img src={src} alt="" className={`${size} shrink-0 rounded-xl object-contain`} />
  ) : (
    <div className={`${size} grid shrink-0 place-items-center rounded-xl border border-line bg-gradient-to-br from-fg/15 to-fg/[0.02] font-bold`}>{name[0]}</div>
  );
}

// repos without a logo of their own get a tile in the profile theme colours
function Glyph({ kind }: { kind: "music" | "movies" }) {
  const G = kind === "music" ? Music : Clapperboard;
  return (
    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[linear-gradient(160deg,color-mix(in_oklab,var(--theme-b)_70%,white),color-mix(in_oklab,var(--theme-b)_80%,black))] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_2px_6px_-2px_rgb(0_0_0/0.3)]">
      <G className="size-[18px]" strokeWidth={2.4} />
    </div>
  );
}

export default function Projects() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0">
        {RUNNING.map((r) => (
          <a key={r.name} href={r.href} target="_blank" rel="noreferrer" className="panel group flex items-center gap-4 p-4 transition hover:brightness-125">
            <Icon src={r.icon} name={r.name} size="size-12" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-lg font-bold">
                {r.name}
                <span className="rounded-md bg-fg/[0.07] px-1.5 py-0.5 text-[11px] font-semibold text-soft">{r.role}</span>
              </p>
              <p className="truncate text-sm text-dim">{r.blurb ?? new URL(r.href!).host}</p>
            </div>
            <span className="sq size-10 group-hover:-translate-y-[15%] group-hover:scale-110 group-hover:bg-fg/10">
              <ExternalLink className="size-4" />
            </span>
          </a>
        ))}
      </div>

      <div className="panel p-5">
        <p className="label">api / lib repos</p>
        <ul className="mt-2 divide-y divide-line">
          {REPOS.map((r) => (
            <li key={r.name} className="flex items-center gap-3 py-3">
              {r.glyph ? <Glyph kind={r.glyph} /> : <Icon src={r.icon} name={r.name} size="size-9" />}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {r.name} <span className="font-mono text-xs font-normal text-dim">{r.tag}</span>
                </p>
                <p className="truncate text-sm text-dim">{r.blurb}</p>
              </div>
              <a href={r.href} target="_blank" rel="noreferrer" aria-label={`${r.name} source`} title="source" className="sq size-9">
                <Code2 className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <div className="panel p-5">
          <p className="label">projects / organizations</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CREWS.map((c) => {
              const body = (
                <>
                  {c.icon ? (
                    <img src={c.icon} alt="" className="size-5 rounded-md object-cover" />
                  ) : (
                    <span className="grid size-5 place-items-center rounded-md bg-fg/15 text-[11px] font-bold">{c.name[0]}</span>
                  )}
                  {c.name}
                  <span className="text-dim">{c.role}</span>
                </>
              );
              const cls = "flex items-center gap-1.5 rounded-lg border border-line bg-inset px-2.5 py-1.5 text-sm";
              return c.href ? (
                <a key={c.name} href={c.href} target="_blank" rel="noreferrer" className={`${cls} lift transition duration-300 ease-bounce hover:-translate-y-0.5 hover:bg-fg/10`}>
                  {body}
                </a>
              ) : (
                <span key={c.name} className={cls}>
                  {body}
                </span>
              );
            })}
          </div>
        </div>

        <div className="panel p-5">
          <p className="label">webports</p>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {WEBPORTS.map((w) => {
              const body = (
                <>
                  <img src={w.art} alt="" className="h-11 w-[116px] shrink-0 rounded-md object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{w.name}</span>
                    <span className={`font-mono text-[11px] ${w.wip ? "text-[#f0b232]" : "text-[#23a55a]"}`}>{w.wip ? "work in progress" : "playable"}</span>
                  </span>
                </>
              );
              const cls = "flex items-center gap-3 rounded-lg border border-line bg-inset p-1.5 pr-3 text-sm";
              return (
                <li key={w.name}>
                  {w.href ? (
                    <a href={w.href} target="_blank" rel="noreferrer" className={`${cls} transition hover:bg-fg/10`}>
                      {body}
                    </a>
                  ) : (
                    <div className={`${cls} text-soft`}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
