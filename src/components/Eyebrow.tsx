// Quiet section label. No symbols, no rules — just understated mono text.
export default function Eyebrow({ children }: { children: string }) {
  return (
    <div className="font-mono text-xs tracking-wide text-muted">{children}</div>
  );
}
