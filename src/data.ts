export const DISCORD_ID = "979137914464247838";
export const GITHUB = "x8rr";
export const COUNTER = "https://counter.x8r.dev";

// always the current github pfp (by account id, so it's CORS-readable and
// survives renames). github caches it for 5 minutes
export const GITHUB_ID = 159058655;
export const avatar = (size = 256) => `https://avatars.githubusercontent.com/u/${GITHUB_ID}?s=${size}`;

// "playing" presences that aren't games. keep in sync with workers/counter
export const IGNORED_GAMES = new Set(["cherrion.top"]);

const devicon = (n: string, v = "original") => `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${n}/${n}-${v}.svg`;

export type Skill = { name: string; icon: string; learning?: boolean };

export const STACK: Skill[] = [
  { name: "html", icon: devicon("html5") },
  { name: "css", icon: devicon("css3") },
  { name: "javascript", icon: devicon("javascript") },
  { name: "typescript", icon: devicon("typescript") },
  { name: "react", icon: devicon("react") },
  { name: "node", icon: devicon("nodejs") },
  { name: "bun", icon: devicon("bun") },
  { name: "fastify", icon: devicon("fastify") },
  { name: "python (learning)", icon: devicon("python"), learning: true },
  { name: "c++ (learning)", icon: devicon("cplusplus"), learning: true },
];

export type Crew = { name: string; href?: string; role: string; icon?: string; blurb?: string };

// the things i run, shown big
export const RUNNING: Crew[] = [
  {
    name: "cherri",
    href: "https://cherrion.top/",
    role: "co-owner",
    icon: "https://cherrion.top/assets/img/fav.png",
    blurb: "an all-in-one site: chat, play, watch, browse, and more",
  },
  {
    name: "breeze",
    href: "https://breezeunb.locker/",
    role: "owner",
    icon: "/img/logos/breeze.webp",
  },
];

export const CREWS: Crew[] = [
  { name: "vortex", href: "https://vtx.chat", role: "developer", icon: "/img/vtx.png" },
  { name: "nautilus labs", href: "https://github.com/nautilus-os", role: "developer", icon: "/img/logos/nautilus.png" },
  { name: "fern", href: "https://fern.best/", role: "helper", icon: "/img/logos/fern.svg" },
  { name: "opium", href: "https://opium.best", role: "helper" },
  { name: "lucide", href: "https://lucideon.top", role: "helper", icon: "/img/logos/lucide.png" },
  { name: "quasar", role: "helper" },
  { name: "wasm.rip", href: "https://wasm.rip", role: "member", icon: "/img/logos/wasm.png" },
];

export type Repo = { name: string; href: string; blurb: string; icon?: string; glyph?: "music" | "movies"; tag: string };

export const REPOS: Repo[] = [
  {
    name: "stratus",
    href: "https://github.com/x8rr/stratus-api",
    blurb: "cloud gaming api: drop 180+ aaa titles into any website",
    icon: "/img/stratus.svg",
    tag: "api",
  },
  {
    name: "sapphire",
    href: "https://github.com/x8rr/sapphire",
    blurb: "run mv3 chrome extensions inside a website, as a scramjet plugin",
    icon: "/img/sapphire.png",
    tag: "lib",
  },
  {
    name: "music",
    href: "https://github.com/x8rr/music",
    blurb: "a music api that just works",
    glyph: "music",
    tag: "api",
  },
  {
    name: "movies",
    href: "https://github.com/x8rr/movies",
    blurb: "a movies api",
    glyph: "movies",
    tag: "api",
  },
  {
    name: "gmshelf",
    href: "https://github.com/gmshelf",
    blurb: "game delivery api",
    icon: "/img/logos/gmshelf.png",
    tag: "api",
  },
];

export type Port = { name: string; href?: string; wip?: boolean; art: string };

export const WEBPORTS: Port[] = [
  { name: "crashout crew", href: "https://wasm.rip/files/cc/index.html", art: "/img/logos/crashout-crew.jpg" },
  { name: "minecraft dungeons", wip: true, art: "/img/logos/minecraft-dungeons.jpg" },
];

export type Social = { key: "discord" | "github" | "email"; label: string; href: string };

export const SOCIALS: Social[] = [
  { key: "discord", label: "discord", href: `https://discord.com/users/${DISCORD_ID}` },
  { key: "github", label: "github", href: `https://github.com/${GITHUB}` },
  { key: "email", label: "email", href: "mailto:me@x8r.dev" },
];

// live: draw it with LiveButton instead of the image (own button only)
export type ButtonItem = { src: string; alt: string; href?: string; live?: boolean };

// 88x31s. own button first (no link), then sites/tools i like
export const BUTTONS: ButtonItem[] = [
  { src: "/img/button.gif", alt: "x8r", live: true },
  { src: "/img/buttons/geeked.png", alt: "geeked.wtf", href: "https://geeked.wtf/" },
  { src: "/img/buttons/github.png", alt: "GitHub", href: "https://github.com/" },
  { src: "/img/buttons/discord.png", alt: "Discord", href: "https://discord.com/" },
  { src: "/img/buttons/spotify.png", alt: "Spotify", href: "https://spotify.com/" },
  { src: "/img/buttons/steam.png", alt: "Steam", href: "https://store.steampowered.com/" },
  { src: "/img/buttons/vscode.png", alt: "VS Code", href: "https://code.visualstudio.com/" },
  { src: "/img/buttons/ublock.png", alt: "uBlock Origin", href: "https://ublockorigin.com/" },
  { src: "/img/buttons/endeavour.png", alt: "EndeavourOS", href: "https://endeavouros.com/" },
  { src: "/img/buttons/minecraft.png", alt: "Minecraft", href: "https://minecraft.net/" },
  { src: "/img/buttons/gd.png", alt: "Geometry Dash", href: "https://store.steampowered.com/app/322170/Geometry_Dash/" },
  { src: "/img/buttons/hollowknight.png", alt: "Hollow Knight", href: "https://store.steampowered.com/app/367520/Hollow_Knight/" },
  { src: "/img/buttons/slqnt.png", alt: "slqnt", href: "https://slqnt.dev" },
  { src: "/img/buttons/rogo.png", alt: "rogo.best", href: "https://rogo.best/" },
  { src: "/img/buttons/spark.png", alt: "spark", href: "https://github.com/problematicdesire" },
  { src: "/img/buttons/proudparrot.png", alt: "proudparrot2", href: "https://github.com/proudparrot2" },
  { src: "/img/buttons/technonyte.png", alt: "technonyte" },
  { src: "/img/buttons/starlight.jpg", alt: "starlight" },
  { src: "/img/buttons/react.png", alt: "React", href: "https://react.dev" },
  { src: "/img/buttons/helium.png", alt: "Helium", href: "https://helium.computer/" },
  { src: "/img/buttons/linux.png", alt: "GNU/Linux", href: "https://www.linux.org/" },
];
