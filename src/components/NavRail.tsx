import { useLayoutEffect, useRef, useState } from "react";

export type SectionId = "home" | "work" | "music" | "announcements";

const ITEMS: { id: SectionId; label: string }[] = [
  { id: "home", label: "home" },
  { id: "work", label: "work" },
  { id: "music", label: "music" },
  { id: "announcements", label: "blog" },
];

export default function NavRail({
  active,
  onSelect,
  dots = [],
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
  dots?: SectionId[];
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const measure = () => {
      const el = itemRefs.current[active];
      const list = listRef.current;
      if (!el || !list) return;
      const a = el.getBoundingClientRect();
      const b = list.getBoundingClientRect();
      setPill({ left: a.left - b.left, width: a.width, ready: true });
    };
    measure();
    window.addEventListener("resize", measure);
    // re-measure once the mono font swaps in and changes tab widths
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <header className="fixed left-1/2 top-5 z-20 -translate-x-1/2">
      <nav
        aria-label="Sections"
        className="rounded-full border border-white/10 bg-elevated/70 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md"
      >
        <ul ref={listRef} className="relative flex items-center gap-0.5">
          {/* sliding indicator */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 rounded-full bg-white/10"
            style={{
              left: pill.left,
              width: pill.width,
              opacity: pill.ready ? 1 : 0,
              transition:
                "left 0.32s cubic-bezier(0.4,0.1,0.2,1), width 0.32s cubic-bezier(0.4,0.1,0.2,1), opacity 0.2s",
            }}
          />
          {ITEMS.map(({ id, label }) => {
            const on = active === id;
            const hasDot = dots.includes(id);
            return (
              <li key={id}>
                <button
                  ref={(el) => {
                    itemRefs.current[id] = el;
                  }}
                  type="button"
                  onClick={() => onSelect(id)}
                  aria-current={on ? "page" : undefined}
                  className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-sm transition-colors ${
                    on ? "text-bone" : "text-muted hover:text-bone"
                  }`}
                >
                  {label}
                  {hasDot && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-2 opacity-80" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
