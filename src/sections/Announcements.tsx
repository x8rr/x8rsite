import { useState } from "react";
import { ANNOUNCEMENTS, type Announcement } from "../data";
import Eyebrow from "../components/Eyebrow";

const URL_RE = /(https?:\/\/[^\s]+)/g;

function Linkified({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) =>
        URL_RE.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="text-soft underline underline-offset-4 decoration-white/20 hover:text-bone hover:decoration-white/50 transition-colors"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const SEEN_KEY = "seen_posts";

function getSeenKeys(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function postKey(a: { date: string; title: string }) {
  return `${a.date}::${a.title}`;
}

function excerpt(body: string, words = 20) {
  const flat = body.replace(/\n+/g, " ").split(" ");
  if (flat.length <= words) return flat.join(" ");
  return flat.slice(0, words).join(" ") + "…";
}

function PostView({
  post,
  isNew,
  onBack,
}: {
  post: Announcement;
  isNew: boolean;
  onBack: () => void;
}) {
  const paragraphs = post.body.split(/\n\n+/);
  return (
    <div className="swap">
      <button
        onClick={onBack}
        className="mb-8 font-mono text-xs text-muted hover:text-soft transition-colors cursor-pointer"
      >
        ← back
      </button>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <time className="font-mono text-xs text-muted">{formatDate(post.date)}</time>
        {isNew && (
          <span className="rounded-full bg-white/8 px-2 py-0.5 font-mono text-[10px] text-soft tracking-wider uppercase">
            new
          </span>
        )}
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-bone leading-snug sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-8 flex flex-col gap-5 text-soft leading-[1.8] text-[15px]">
        {paragraphs.map((p, i) => (
          <p key={i}>
            <Linkified text={p} />
          </p>
        ))}
      </div>
    </div>
  );
}

function initSeen(): Set<string> {
  const prev = getSeenKeys();
  const next = new Set([...prev, ...ANNOUNCEMENTS.map(postKey)]);
  localStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
  return prev;
}

export default function Announcements() {
  const posts = ANNOUNCEMENTS.slice().reverse();
  const [seen] = useState<Set<string>>(initSeen);
  const [selected, setSelected] = useState<Announcement | null>(null);

  if (selected) {
    return (
      <PostView
        post={selected}
        isNew={!seen.has(postKey(selected))}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="swap">
      <h1 className="mt-3 text-5xl font-bold tracking-tight text-bone sm:text-6xl">
        blog
      </h1>
      <p className="mt-2 font-mono text-xs text-muted">
        {posts.length} post{posts.length !== 1 ? "s" : ""}
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-muted font-mono text-sm">nothing here yet.</p>
      ) : (
        <div className="mt-10 flex flex-col">
          {posts.map((a, i) => {
            const isNew = !seen.has(postKey(a));
            return (
              <article key={i} className="border-t border-white/8 py-7 first:border-t-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <time className="font-mono text-xs text-muted">
                    {formatDate(a.date)}
                  </time>
                  {isNew && (
                    <span className="rounded-full bg-white/8 px-2 py-0.5 font-mono text-[10px] text-soft tracking-wider uppercase">
                      new
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelected(a)}
                  className="group text-left cursor-pointer block"
                >
                  <h2 className="text-xl font-semibold text-bone leading-snug group-hover:text-soft transition-colors">
                    {a.title}
                  </h2>
                </button>

                <p className="mt-2 text-muted leading-relaxed text-sm">
                  {excerpt(a.body)}
                </p>

                <button
                  onClick={() => setSelected(a)}
                  className="mt-3 font-mono text-xs text-muted hover:text-soft transition-colors cursor-pointer"
                >
                  read more →
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
