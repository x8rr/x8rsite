import { ANNOUNCEMENTS } from "../data";
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
            className="text-accent underline-offset-4 hover:underline"
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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Announcements() {
  return (
    <div className="swap">
      <Eyebrow>announcements</Eyebrow>
      <h1 className="mt-3 text-5xl font-bold tracking-tight text-bone sm:text-6xl">
        updates
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {ANNOUNCEMENTS.length === 0 ? (
          <p className="text-muted font-mono text-sm">nothing here yet.</p>
        ) : (
          ANNOUNCEMENTS.slice().reverse().map((a, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-ink p-5 leading-relaxed"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-muted">
                  {formatDate(a.date)}
                </span>
              </div>
              <p className="font-semibold text-bone">{a.title}</p>
              <p className="mt-1 text-soft"><Linkified text={a.body} /></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
