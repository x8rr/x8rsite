export const DISCORD_ID = "1452708222405185616";

export type Project = {
  name: string;
  href: string;
  icon: string;
  blurb: string;
  tag?: string;
  live: boolean;
};

export const PROJECTS: Project[] = [
  {
    name: "cherri",
    href: "https://cherrion.top/",
    icon: "https://cherrion.top/assets/img/fav.png",
    blurb: "an all-in-one website: chat, play, watch, browse, and more",
    live: true,
  },
  {
    name: "eaglercraft extras",
    href: "https://eaglercraftextras.github.io/",
    icon: "https://eaglercraftextras.github.io/assets/icon.png",
    blurb: "eaglercraft resources in a single website",
    live: true,
  },
  {
    name: "GUST",
    href: "https://gust-browser.vercel.app/",
    icon: "/img/wind-solid.png",
    blurb: "a web proxy that runs on the file protocol with no service worker",
    live: true,
  },
  {
    name: "vortex chat",
    href: "https://vtx.chat/",
    icon: "/img/vtx.png",
    blurb: "a chatroom with a thriving community and rich features",
    live: true,
  },
  {
    name: "stratus (work in progress)",
    href: "#",
    icon: "/img/stratus.svg",
    blurb: "simple cloud gaming API for developers with 180+ titles",
    live: false,
  },
];

export type OrgItem = { name: string; href: string; blurb: string };

export const ORGS: OrgItem[] = [
  {
    name: "nautilus labs",
    href: "https://github.com/nautilus-os/",
    blurb: "building apps engineered to run in abnormal environments",
  },
  {
    name: "wilted services",
    href: "https://wiltedservices.org/",
    blurb: "creating software for the unblocking community",
  },
];

export type Social = {
  key: "discord" | "github" | "telegram" | "email";
  label: string;
  handle: string;
  href: string;
};

export const SOCIALS: Social[] = [
  {
    key: "discord",
    label: "Discord",
    handle: "@4pgx",
    href: `https://discord.com/users/${DISCORD_ID}`,
  },
  {
    key: "github",
    label: "GitHub",
    handle: "x8rr",
    href: "https://github.com/x8rr",
  },
  {
    key: "email",
    label: "Email",
    handle: "say hi",
    href: "mailto:me@x8r.dev",
  },
];

export const SKILLS = [
  "html5",
  "css3",
  "javascript",
  "typescript",
  "nodejs",
  "fastify",
  "bun",
  "astro",
  "react",
  "python",
  "cplusplus",
  "git",
  "archlinux",
  "windows11",
];
