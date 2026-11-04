import { Eye, Mail, Monitor, Globe, Smartphone } from "lucide-react";
import { avatar, DISCORD_ID, SOCIALS, STACK } from "../data";
import { useLanyard, type Status } from "../lib/lanyard";
import { isLight, useDiscordProfile, useViewCount } from "../lib/hooks";
import { DiscordIcon, GithubIcon } from "../components/Icons";
import Digits from "../components/Digits";

export const STATUS: Record<Status, { color: string; label: string }> = {
  online: { color: "#23a55a", label: "online" },
  idle: { color: "#f0b232", label: "idle" },
  dnd: { color: "#f23f43", label: "do not disturb" },
  offline: { color: "#80848e", label: "offline" },
};

const PLATFORM = { desktop: Monitor, web: Globe, mobile: Smartphone } as const;
const SOCIAL_ICON = { discord: DiscordIcon, github: GithubIcon, email: Mail } as const;

export default function Profile() {
  const p = useLanyard();
  const views = useViewCount();
  const dc = useDiscordProfile(DISCORD_ID);
  const s = STATUS[p.status];
  const light = dc?.theme ? isLight(dc.theme[0]) : false;
  // discord's own name gradient if set, else the old white -> grey sheen. on a
  // light card the white stops become the text colour, like discord does
  const stops = (p.nameColors.length > 1 ? p.nameColors : ["#ffffff", "#ffffff", "#888888"]).map((c) =>
    light && c === "#ffffff" ? "var(--fg)" : c,
  );
  // the full set from the profile; lanyard only knows the flag ones
  const badges = dc?.badges.length ? dc.badges : p.badges;

  return (
    <article className="panel relative overflow-hidden">
      {/* banner: your discord banner, else a gradient off the pfp */}
      <div className="relative h-36 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--theme-a),var(--theme-b))]" />
        {dc?.banner && <img src={dc.banner} alt="" className="absolute inset-0 size-full object-cover" />}
      </div>

      <div className="px-5 pb-5">
        <div className="relative -mt-16 flex items-end justify-between">
          <div className="relative size-[120px] shrink-0">
            {/* with a decoration the pfp fills the circle edge to edge, so the
                bubble's animation never uncovers a ring behind it */}
            <div className={`absolute inset-0 rounded-full ${p.decoration ? "" : "bg-panel p-1.5"}`}>
              <img src={avatar(256)} alt="x8r's avatar" className="size-full rounded-full object-cover" />
            </div>
            {p.decoration && (
              <img src={p.decoration} alt="" className="pointer-events-none absolute left-1/2 top-1/2 size-[144px] max-w-none -translate-x-1/2 -translate-y-1/2" />
            )}
            <span
              className="status absolute bottom-2 right-2 size-7"
              data-status={p.status}
              style={{ ["--status" as string]: s.color }}
              title={s.label}
            />
          </div>

          <div className="mb-1 flex items-center gap-1.5 rounded-lg border border-line bg-inset px-2 py-1.5 empty:hidden">
            {p.platforms.map((pl) => {
              const Icon = PLATFORM[pl as keyof typeof PLATFORM];
              return Icon ? <Icon key={pl} className="size-4 text-dim" aria-label={`on ${pl}`} /> : null;
            })}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className="bg-clip-text text-[26px] font-bold leading-tight tracking-tight text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${stops.join(", ")})` }}
            >
              {p.displayName}
            </h1>
            {p.tag && (
              <span className="flex items-center gap-1 rounded-md bg-fg/[0.07] px-1.5 py-0.5 text-xs font-semibold">
                <img src={p.tag.badge} alt="" className="size-3.5" />
                {p.tag.text}
              </span>
            )}
          </div>
          <p className="text-sm text-dim">
            {p.username}
            {dc?.pronouns && <> · {dc.pronouns}</>}
          </p>
          {badges.length > 0 && (
            <div className="mt-2 inline-flex flex-wrap items-center gap-1 rounded-lg border border-line bg-inset p-1">
              {badges.map((b) => (
                <img key={b.label} src={b.icon} alt={b.label} title={b.label} className="size-[22px] transition duration-300 ease-bounce hover:scale-125" />
              ))}
            </div>
          )}
        </div>

        {p.custom && (
          <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-xl rounded-tl-sm border border-line bg-inset px-3 py-2 text-sm">
            {p.custom.emoji && <span>{p.custom.emoji}</span>}
            <span className="truncate text-soft">{p.custom.text}</span>
          </div>
        )}

        <div className="mt-4 space-y-4 rounded-2xl border border-line bg-inset p-4">
          <section>
            <h3 className="label">about me</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-soft">
              hi! i'm x8r (also known as hvtrs), and i'm a 14 year old fullstack developer. i'm the ex-owner (now co-owner) of{" "}
              <a href="https://cherrion.top/" target="_blank" rel="noreferrer" className="font-semibold text-fg hover:underline">
                cherri
              </a>
              , the owner of{" "}
              <a href="https://breezeunb.locker/" target="_blank" rel="noreferrer" className="font-semibold text-fg hover:underline">
                breeze
              </a>
              , and i help with various other projects too.
            </p>
          </section>

          <section>
            <h3 className="label">stack</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {STACK.map((k) => (
                <span key={k.name} title={k.name} className={`sq size-9 bg-panel ${k.learning ? "border-dashed opacity-60" : ""}`}>
                  <img src={k.icon} alt={k.name} className={`size-5 ${k.name === "fastify" ? "invert-on-dark" : ""}`} />
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {SOCIALS.map((so) => {
              const Icon = SOCIAL_ICON[so.key];
              return (
                <a
                  key={so.key}
                  href={so.href}
                  target={so.key === "email" ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={so.label}
                  title={so.label}
                  className="sq size-11"
                >
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-dim" title="views">
            <Eye className="size-4" />
            <span className="font-mono text-lg font-semibold leading-none tabular-nums text-fg">
              {views === null ? <span className="text-faint">-----</span> : <Digits value={views} />}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
