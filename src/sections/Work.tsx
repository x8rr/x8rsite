import { ChevronRight, ExternalLink } from "lucide-react";
import { PROJECTS, ORGS, SKILLS } from "../data";
import Eyebrow from "../components/Eyebrow";

export default function Work() {
  return (
    <div className="swap">
      <Eyebrow>my work</Eyebrow>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-bone">
        projects
      </h1>
      <p className="mt-2 max-w-lg text-soft">
        stuff i've built and worked on.
      </p>

      <div className="mt-6 space-y-3">
        {PROJECTS.map((p) => {
          const Wrapper = p.live ? "a" : "div";
          return (
            <Wrapper
              key={p.name}
              {...(p.live
                ? { href: p.href, target: "_blank", rel: "noreferrer" }
                : {})}
              className={`group block rounded-2xl border border-white/8 bg-ink p-4 transition-colors ${
                p.live ? "hover:border-accent/30" : "opacity-70"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.icon}
                  alt=""
                  className="h-10 w-10 rounded-lg object-contain"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-bone">{p.name}</span>
                    {p.tag && (
                      <span className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">{p.blurb}</p>
                </div>
                {p.live && (
                  <ExternalLink
                    size={16}
                    className="shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>

      <div className="mt-8">
        <Eyebrow>organizations</Eyebrow>
        <div className="mt-3 space-y-2">
          {ORGS.map((o) => (
            <a
              key={o.name}
              href={o.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-white/8 bg-ink px-4 py-3 transition-colors hover:border-white/15"
            >
              <div className="min-w-0 flex-1">
                <span className="font-medium text-bone">{o.name}</span>
                <p className="truncate text-sm text-muted">{o.blurb}</p>
              </div>
              <ChevronRight
                size={16}
                className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-bone"
              />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Eyebrow>stack</Eyebrow>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SKILLS.map((skill) => {
            const needsInvert = ["fastify", "bun"].includes(skill);
            return (
              <div
                key={skill}
                title={skill}
                className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-ink transition-colors hover:border-accent/40"
              >
                <i
                  className={`devicon-${skill}-plain ${
                    needsInvert ? "text-bone opacity-80" : "colored"
                  } text-lg transition-transform group-hover:scale-110`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
