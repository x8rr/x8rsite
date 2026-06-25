import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

// Best-effort view counter via the free counterapi.dev. Stays hidden if the
// service is unreachable rather than showing a broken/zero state.
export default function ViewCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("https://api.counterapi.dev/v1/x8r-dev/site-views/up")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (alive && typeof j?.count === "number") setCount(j.count);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (count === null) return null;

  return (
    <div className="fixed bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-lg border border-white/8 bg-elevated/70 px-2.5 py-1.5 font-mono text-xs text-muted backdrop-blur-md">
      <Eye size={13} />
      {count.toLocaleString()}
      <span className="text-faint">views</span>
    </div>
  );
}
